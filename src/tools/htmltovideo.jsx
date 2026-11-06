import React, { useState, useRef, useMemo } from 'react';
import { Card, CardContent, Typography, TextField, Box, ToggleButton, ToggleButtonGroup, Alert, Button } from '@mui/material';

function Wrap({ children, note }) {
  return (<><Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>{children}</CardContent></Card>{note && <Alert severity="info" sx={{ mt: 2 }}>{note}</Alert>}</>);
}

// HTML to Video (Code to Video) - everything runs in the browser, nothing is uploaded.
// The preview runs in a sandboxed iframe. Recording snapshots the preview with
// html2canvas, draws each snapshot on a canvas, and turns the frames into a video.
//
// The tool works out what kind of content it is, so the user just pastes code
// and presses Record video. No HTML/CSS/JS knowledge needed:
// - CSS animation (keyframes): SMOOTH engine, offline frame-by-frame. The
//   animation is paused, then stepped to the exact time of every frame
//   (10, 30 or 60 fps) and each frame is encoded with its exact timestamp
//   (VideoEncoder + mp4-muxer). Truly smooth, always the right length.
//   Output is a real MP4 with fast-start (moov at the front), so it plays in
//   WhatsApp and TikTok. Needs a browser with VideoEncoder (recent Chrome,
//   Edge, Safari 16.4+, Firefox 130+).
// - JavaScript story (a script, or a Play/Start button): LIVE engine. JS runs
//   in real time and cannot be rewound, so the tool records it live while it
//   plays, at the frame rate picked on the main screen (10, 30 or 60 fps in
//   the file; the picture updates as fast as the page allows). If the story
//   makes sound with WebAudio, the sound is recorded too (MP4 with AAC,
//   WebM with Opus). On "From the beginning" it reloads the preview and
//   presses Play for the user, so the story starts by itself, in sync with
//   the recording.
// - Static page (nothing moves): short live recording.
// The old real-time MediaRecorder path is the LIVE engine above; it is also
// the fallback when the smooth engine fails, and the only engine for WebM
// (WebM is always live; for smooth 30/60 fps choose MP4).
// While any recording runs, the preview is slowed to at most 20 frames per
// second so the snapshots land steadily instead of freezing; the story's own
// clock (its sound) is not affected, and the preview goes back to full speed
// afterwards.
//
// Quality rules (fixed 5 Nov 2026 - the old version recorded at preview size with
// the browser's default bitrate, so the video looked soft, and a tall page was
// squashed into the short preview frame):
// - Snapshots are taken at 2x the preview size (1.5x on heavy pages, measured from
//   the first snapshot), so the video stays sharp. The long side is capped at 1920.
//   A live recording starts at 1.5x (1x when slow) so the picture keeps up with
//   the story instead of freezing.
// - A tall fixed stage (for example a vertical 9:16 scene up to 1200px tall) is
//   captured whole, so it comes out as a vertical video instead of being squashed.
//   A long scrolling page is captured as the visible window instead.
// - A vertical story is shown in a vertical preview (the stage fills the frame),
//   so the video comes out vertical instead of a narrow strip with black bars.
// - A 3D/WebGL scene (for example Three.js) is captured too: the preview asks
//   the browser to keep the last frame, otherwise the whole scene comes out black.
// - Video bitrate is 5 Mbps so compression does not soften the picture.
const SAMPLE = `<!DOCTYPE html>
<html>
<head><style>
body { margin: 0; font-family: sans-serif; background: #1565c0; color: #fff; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; }
.box { width: 80px; height: 80px; background: #ffca28; border-radius: 12px; animation: slide 2s ease-in-out infinite alternate; }
@keyframes slide { from { transform: translateX(-120px); } to { transform: translateX(120px); } }
h1 { font-size: 28px; margin: 20px 0 0; }
p { font-size: 16px; opacity: 0.9; }
</style></head>
<body>
<div class="box"></div>
<h1>Hello from Kalkio</h1>
<p>Your HTML, as a video</p>
</body>
</html>`;

const MIME_CANDIDATES = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
const MP4_CANDIDATES = ['video/mp4;codecs="avc1.640028"', 'video/mp4;codecs="avc1.42E01E"', 'video/mp4'];
// With sound: the same containers, plus an audio codec (AAC for MP4, Opus for
// WebM), so a story that makes sound records with sound.
const MP4_AUDIO_CANDIDATES = ['video/mp4;codecs="avc1.640028,mp4a.40.2"', 'video/mp4;codecs="avc1.42E01E,mp4a.40.2"', 'video/mp4'];
const WEBM_AUDIO_CANDIDATES = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
// Chrome, Edge and Safari can record real MP4 (H.264) straight from the canvas -
// tested 5 Nov 2026: a 2s MP4 recording came out as a valid file (ftypisom).
// Firefox cannot, so it falls back to WebM.
const MP4_SUPPORTED = typeof window !== 'undefined' && !!window.MediaRecorder && MP4_CANDIDATES.some((m) => { try { return MediaRecorder.isTypeSupported(m); } catch { return false; } });
const VIDEO_ENCODER_SUPPORTED = typeof window !== 'undefined' && 'VideoEncoder' in window && 'VideoFrame' in window;
const CAN_MAKE_MP4 = MP4_SUPPORTED || VIDEO_ENCODER_SUPPORTED;
const VIDEO_BITRATE = 5000000;
const MAX_FRAMES = 1800; // offline rendering cap: 60s at 30fps, 30s at 60fps
const fmtSize = (b) => b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
const tick = () => new Promise((r) => setTimeout(r, 0));

function getAnims(doc) {
  try { return doc.getAnimations ? doc.getAnimations() : []; } catch { return []; }
}
// Length of one full run of the animation in the preview, in seconds.
// A looping animation counts as one loop. Returns 0 when there is no animation.
function fullAnimSeconds(doc) {
  let max = 0;
  for (const a of getAnims(doc)) {
    try {
      const t = a.effect ? a.effect.getComputedTiming() : null;
      if (!t) continue;
      const dur = (t.duration === 'auto' || t.duration == null) ? 0 : +t.duration;
      const iter = t.iterations === Infinity ? 1 : (+t.iterations || 1);
      const delay = +t.delay || 0;
      if (dur > 0) max = Math.max(max, (delay + dur * iter) / 1000);
    } catch { /* ignore one bad animation */ }
  }
  return max;
}

// What kind of content is this? Worked out from the pasted code and the live
// preview, so the user never has to know HTML from CSS from JavaScript.
// css: a CSS animation. js: JavaScript drives it (a script, or a Play/Start
// button). static: nothing moves.
function detectContent(doc, code) {
  if (!doc || !doc.body) return { kind: 'css', cssSeconds: 0, playButton: null };
  const anims = getAnims(doc);
  const cssSeconds = fullAnimSeconds(doc);
  let playButton = null;
  try {
    const els = doc.querySelectorAll('button, a, [role="button"], input[type="button"], input[type="submit"]');
    for (const el of els) {
      const text = ((el.textContent || el.value || '') + '').trim();
      if (!/^(▶|►|play|start|begin|watch)\b/i.test(text)) continue;
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) { playButton = el; break; }
    }
  } catch { /* ignore */ }
  const hasJS = /<script[\s>]/i.test(code) || /addEventListener|setTimeout|setInterval|requestAnimationFrame/i.test(code);
  let kind = 'static';
  if (playButton) kind = 'js';
  else if (anims.length > 0 && cssSeconds > 0) kind = 'css';
  else if (hasJS) kind = 'js';
  return { kind, cssSeconds, playButton };
}

// Runs inside the preview before the pasted code. Three small fixes:
// 1. 3D/WebGL scenes (for example a Three.js story) draw on a <canvas> whose
//    picture the browser throws away after each frame. The recorder draws that
//    canvas into the video, so without this the whole 3D scene comes out
//    black. This asks the browser to keep the last frame, so the recorder can
//    see it. It changes nothing the user sees.
// 2. Sound: every AudioContext the code makes also sends its sound to a
//    stream the recorder can use, so a story that makes sound with WebAudio
//    records with sound. The sound still plays from the speakers too.
// 3. Smoothness: while recording, the preview runs at up to 20 frames per
//    second (the tool turns this on and off), so the recorder has time to
//    take steady snapshots instead of freezing. The story's own clock (its
//    sound) is not affected.
const PREVIEW_PATCH = `<script>(function(){
try{var ogc=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(t,a){if(t==='webgl'||t==='webgl2'||t==='experimental-webgl'){a=Object.assign({},a,{preserveDrawingBuffer:true});}return ogc.call(this,t,a);};}catch(e){}
try{
window.__kalkioAudioStreams=[];
var AC=window.AudioContext||window.webkitAudioContext;
if(AC){
var OrigAC=AC,destByCtx=new WeakMap(),streamConnected=new WeakSet();
var Ctx=function(){var ctx=new OrigAC();try{var d=ctx.createMediaStreamDestination();destByCtx.set(ctx,d);window.__kalkioAudioStreams.push(d.stream);}catch(e){}return ctx;};
Ctx.prototype=OrigAC.prototype;
window.AudioContext=Ctx;if(window.webkitAudioContext)window.webkitAudioContext=Ctx;
var origConnect=AudioNode.prototype.connect;
AudioNode.prototype.connect=function(target){
var r=origConnect.apply(this,arguments);
try{var ctx=this.context;if(ctx&&target===ctx.destination){var d=destByCtx.get(ctx);if(d&&!streamConnected.has(this)){streamConnected.add(this);origConnect.call(this,d);}}}catch(e){}
return r;};
}
}catch(e){}
try{
var raf=window.requestAnimationFrame.bind(window),lastRaf=0;
window.requestAnimationFrame=function(cb){
var throttle=window.__kalkioRafThrottle||0;
if(!throttle)return raf(cb);
var now=performance.now(),wait=Math.max(0,throttle-(now-lastRaf));
return window.setTimeout(function(){lastRaf=performance.now();raf(cb);},wait);
};
}catch(e){}
})();<\/script>`;
function injectPatch(code) {
  if (!/<script[\s>]/i.test(code)) return code;
  if (/<head[^>]*>/i.test(code)) return code.replace(/<head[^>]*>/i, (m) => m + PREVIEW_PATCH);
  if (/<html[^>]*>/i.test(code)) return code.replace(/<html[^>]*>/i, (m) => m + PREVIEW_PATCH);
  return PREVIEW_PATCH + code;
}

// Is the content a vertical story (for example a 9:16 phone story)? The
// preview is a wide box, so a vertical stage sits in the middle with black
// bars on the sides, and the video comes out wide and unprofessional. When the
// content is vertical, the preview is resized to match it, so the video comes
// out vertical. Returns the stage aspect (width/height), or 0 when not vertical.
function detectPortrait(doc, iw, ih) {
  if (!doc || !doc.body) return 0;
  const bodyH = (doc.body && doc.body.scrollHeight) || ih;
  if (bodyH > ih + 50) return 0; // a tall scrolling page is handled separately
  let els = [];
  try { els = doc.querySelectorAll('body *'); } catch { return 0; }
  let best = null;
  const n = Math.min(els.length, 1500);
  for (let i = 0; i < n; i++) {
    const el = els[i];
    let r;
    try { r = el.getBoundingClientRect(); } catch { continue; }
    if (r.width < 30 || r.height < 30) continue;
    if (r.height < ih * 0.8) continue; // must fill most of the height
    const area = r.width * r.height;
    // By design: the element declares a portrait aspect ratio (a 9:16 stage).
    let ar = 0;
    try {
      const cs = doc.defaultView ? doc.defaultView.getComputedStyle(el) : null;
      const v = cs ? cs.aspectRatio : '';
      const m = v && v !== 'auto' ? String(v).match(/([\d.]+)\s*\/\s*([\d.]+)/) : null;
      if (m) ar = parseFloat(m[1]) / parseFloat(m[2]);
    } catch { /* ignore */ }
    if (ar > 0 && ar < 0.95) {
      if (!best || area > best.area) best = { aspect: ar, area };
      continue;
    }
    // By shape: a tall narrow box (a fixed-size stage) in a wide preview.
    const shape = r.width / r.height;
    if (shape < 0.95 && r.width >= iw * 0.25 && r.width <= iw * 0.95) {
      if (!best || area > best.area) best = { aspect: shape, area };
    }
  }
  return best ? best.aspect : 0;
}

export function HtmlToVideoTool() {
  const [code, setCode] = useState(SAMPLE);
  const [duration, setDuration] = useState('5');
  const [customSeconds, setCustomSeconds] = useState('10');
  const [fps, setFps] = useState('30');
  const [startFrom, setStartFrom] = useState('start');
  const [format, setFormat] = useState(CAN_MAKE_MP4 ? 'mp4' : 'webm');
  const [recording, setRecording] = useState(false);
  const [progress, setProgress] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [resultInfo, setResultInfo] = useState('');
  const [error, setError] = useState('');
  const [paused, setPaused] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previewTick, setPreviewTick] = useState(0);
  const [previewSize, setPreviewSize] = useState(null); // {w, h} when the content is vertical, null for wide
  const iframeRef = useRef(null);
  const canvasRef = useRef(null);
  const stopRef = useRef(false);
  const snapFailedRef = useRef(false);
  // The preview runs the pasted code plus the WebGL patch (see injectPatch).
  // The code the user sees and edits is never changed.
  const previewCode = useMemo(() => injectPatch(code), [code]);

  const previewDoc = () => {
    const iframe = iframeRef.current;
    return iframe ? iframe.contentDocument : null;
  };
  // Detection runs on render (read-only) and refreshes when the preview loads.
  const det = (() => { void previewTick; return detectContent(previewDoc(), code); })();

  const pausePreview = () => {
    const doc = previewDoc();
    if (!doc) return;
    getAnims(doc).forEach((a) => { try { a.pause(); } catch { /* ignore */ } });
    setPaused(true);
  };
  const playPreview = () => {
    const doc = previewDoc();
    if (!doc) return;
    getAnims(doc).forEach((a) => { try { a.play(); } catch { /* ignore */ } });
    setPaused(false);
  };
  const restartPreview = () => {
    const iframe = iframeRef.current;
    if (iframe) iframe.srcdoc = previewCode;
    setPaused(false);
  };
  // Runs when the preview loads: refresh the detection and resize the
  // preview when the content is a vertical story.
  const onPreviewLoad = () => {
    setPreviewTick((t) => t + 1);
    const iframe = iframeRef.current;
    const doc = previewDoc();
    if (!iframe || !doc) return;
    try {
      const ar = detectPortrait(doc, iframe.clientWidth, iframe.clientHeight);
      if (ar > 0) {
        const w = 360;
        const h = Math.min(720, Math.max(360, Math.round(w / ar)));
        setPreviewSize((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
      } else {
        setPreviewSize((prev) => (prev === null ? prev : null));
      }
    } catch { /* ignore */ }
  };
  // Reload the preview and resolve when it has loaded (never hang).
  const reloadPreview = () => new Promise((resolve) => {
    const iframe = iframeRef.current;
    if (!iframe) { resolve(); return; }
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    try { iframe.addEventListener('load', finish, { once: true }); } catch { /* ignore */ }
    iframe.srcdoc = previewCode;
    setTimeout(finish, 2000);
  });

  const resolveDuration = (doc) => {
    if (duration === 'full') {
      const f = fullAnimSeconds(doc);
      return f > 0 ? Math.min(120, Math.max(1, Math.ceil(f))) : 5;
    }
    if (duration === 'custom') {
      const n = parseInt(customSeconds, 10);
      return Math.min(120, Math.max(1, Number.isNaN(n) ? 5 : n));
    }
    return parseInt(duration, 10) || 5;
  };
  // Simple mode: the tool picks the length. CSS animation: its full run.
  // JavaScript story: 60 seconds. Static page: 5 seconds.
  const autoSeconds = (d) => (d.kind === 'css' ? Math.min(120, Math.max(1, Math.ceil(d.cssSeconds))) : d.kind === 'js' ? 60 : 5);
  const effectiveDuration = (doc) => (showAdvanced ? resolveDuration(doc) : autoSeconds(det));

  // Shared first step for both engines: load html2canvas, take a timed first
  // snapshot, size the hidden canvas. Returns null on failure. A live
  // recording snapshots while the story plays, so it starts at a smaller
  // size (1.5x) to keep up; a smooth recording is offline, so it starts at 2x.
  const prepareCanvas = async (doc, html2canvas, live) => {
    const iframe = iframeRef.current;
    const w = (iframe && iframe.clientWidth) || 640;
    const h = (iframe && iframe.clientHeight) || 360;
    const bodyH = (doc.body && doc.body.scrollHeight) || h;
    const fullBody = bodyH > h + 50 && bodyH <= 1200;
    const shotOpts = { backgroundColor: '#ffffff', logging: false, useCORS: true, scale: live ? 1.5 : 2 };
    if (!fullBody) { shotOpts.width = w; shotOpts.height = h; }
    let first;
    try {
      const t0 = Date.now();
      first = await html2canvas(doc.body, shotOpts);
      if (Date.now() - t0 > 400) {
        shotOpts.scale = live ? 1 : 1.5;
        first = await html2canvas(doc.body, shotOpts);
      }
    } catch { snapFailedRef.current = true; }
    if (!first) return null;
    const canvas = canvasRef.current;
    let cw = first.width, ch = first.height;
    const longest = Math.max(cw, ch);
    if (longest > 1920) { const k = 1920 / longest; cw = Math.round(cw * k); ch = Math.round(ch * k); }
    canvas.width = cw; canvas.height = ch;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(first, 0, 0, cw, ch);
    return { canvas, ctx, cw, ch, shotOpts };
  };

  // SMOOTH engine: offline frame-by-frame MP4 at the chosen fps.
  // Returns the video info, or throws so the caller can fall back to live.
  const recordSmooth = async (doc, html2canvas, total, fpsNum, offsets) => {
    const prep = await prepareCanvas(doc, html2canvas, false);
    if (!prep) throw new Error('snapshot failed');
    const { canvas, ctx, cw, ch, shotOpts } = prep;
    const { Muxer, ArrayBufferTarget } = await import('mp4-muxer');
    let totalFrames = Math.round(total * fpsNum);
    let capped = false;
    if (totalFrames > MAX_FRAMES) { totalFrames = MAX_FRAMES; capped = true; }
    const actualSeconds = totalFrames / fpsNum;
    const muxer = new Muxer({
      target: new ArrayBufferTarget(),
      video: { codec: 'avc', width: cw, height: ch },
      fastStart: 'in-memory',
      firstTimestampBehavior: 'offset',
    });
    let encError = null;
    const encoder = new VideoEncoder({
      output: (chunk, meta) => { try { muxer.addVideoChunk(chunk, meta); } catch (e) { encError = e; } },
      error: (e) => { encError = e; },
    });
    let codec = 'avc1.640028';
    try { encoder.configure({ codec, width: cw, height: ch, bitrate: VIDEO_BITRATE, framerate: fpsNum }); }
    catch {
      codec = 'avc1.42E01E';
      encoder.configure({ codec, width: cw, height: ch, bitrate: VIDEO_BITRATE, framerate: fpsNum });
    }
    const anims = getAnims(doc);
    const frameDurUs = 1000000 / fpsNum;
    const t0 = Date.now();
    let framesDone = 0;
    for (let i = 0; i < totalFrames; i++) {
      if (stopRef.current || encError) break;
      anims.forEach((a, j) => { try { a.currentTime = offsets[j] + (i / fpsNum) * 1000; } catch { /* ignore */ } });
      await tick();
      try {
        const shot = await html2canvas(doc.body, shotOpts);
        ctx.drawImage(shot, 0, 0, cw, ch);
      } catch { snapFailedRef.current = true; }
      const frame = new VideoFrame(canvas, { timestamp: Math.round(i * frameDurUs) });
      encoder.encode(frame, { keyFrame: i % fpsNum === 0 });
      frame.close();
      framesDone = i + 1;
      const avgMs = (Date.now() - t0) / framesDone;
      const leftMs = avgMs * (totalFrames - framesDone);
      setProgress('Frame ' + framesDone + ' of ' + totalFrames + (leftMs > 5000 ? ' - about ' + Math.max(1, Math.round(leftMs / 1000)) + 's left' : ''));
    }
    // One extra frame holding the last picture, so the file lasts exactly
    // framesDone/fps seconds. Without it the last frame counts as 0 seconds
    // and a "5 second" video plays as 4 seconds (the player shows whole
    // seconds, so 4.98s looks like 4s).
    if (framesDone > 0 && !encError) {
      const lastFrame = new VideoFrame(canvas, { timestamp: Math.round(framesDone * frameDurUs) });
      encoder.encode(lastFrame, { keyFrame: framesDone % fpsNum === 0 });
      lastFrame.close();
    }
    await encoder.flush();
    if (encError) throw encError;
    muxer.finalize();
    const { buffer } = muxer.target;
    if (!buffer || buffer.byteLength === 0) throw new Error('empty video');
    return {
      blob: new Blob([buffer], { type: 'video/mp4' }),
      info: cw + ' x ' + ch + ' - ' + actualSeconds.toFixed(actualSeconds % 1 ? 1 : 0) + ' seconds - ' + fpsNum + ' fps - ' + fmtSize(buffer.byteLength) + (capped ? ' - capped at ' + MAX_FRAMES + ' frames' : ''),
    };
  };

  // LIVE engine: real-time MediaRecorder at the chosen fps. Used for
  // JavaScript stories and static pages, for WebM, and as the fallback.
  // The first snapshot is taken before Play is pressed, then Play is pressed
  // and recording starts at once, so the story clock and the recording start
  // together. Before, the story had already been playing for a second by the
  // time recording started, so the start was cut off and the end showed the
  // title screen again.
  const recordClassic = async (doc, html2canvas, total, fpsNum, playButton) => {
    const prep = await prepareCanvas(doc, html2canvas, true);
    if (!prep) throw new Error('snapshot failed');
    const { canvas, ctx, cw, ch, shotOpts } = prep;
    if (playButton) { try { playButton.click(); } catch { /* ignore */ } }
    // Sound: the preview patch sends every AudioContext's sound to a stream.
    // Take the latest one (the story makes its context when Play is pressed).
    let audioStream = null;
    try {
      const win = iframeRef.current && iframeRef.current.contentWindow;
      const list = win && win.__kalkioAudioStreams;
      if (list && list.length) audioStream = list[list.length - 1];
    } catch { /* ignore */ }
    const videoStream = canvas.captureStream(fpsNum);
    let stream = videoStream;
    if (audioStream) {
      const tracks = [...videoStream.getVideoTracks(), ...audioStream.getAudioTracks()];
      if (tracks.length > 1) stream = new MediaStream(tracks);
    }
    const candidates = format === 'mp4'
      ? (audioStream ? MP4_AUDIO_CANDIDATES : MP4_CANDIDATES)
      : (audioStream ? WEBM_AUDIO_CANDIDATES : MIME_CANDIDATES);
    let mime = '';
    for (const m of candidates) { if (window.MediaRecorder.isTypeSupported(m)) { mime = m; break; } }
    // No type that carries sound: try the picture-only types, and record
    // without sound instead of failing.
    if (audioStream && !mime) {
      const plain = format === 'mp4' ? MP4_CANDIDATES : MIME_CANDIDATES;
      for (const m of plain) { if (window.MediaRecorder.isTypeSupported(m)) { mime = m; break; } }
      if (mime) { stream = videoStream; audioStream = null; }
    }
    if (format === 'mp4' && !mime) throw new Error('Your browser cannot make MP4. Try WebM instead.');
    let rec;
    try { rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: VIDEO_BITRATE } : { videoBitsPerSecond: VIDEO_BITRATE }); }
    catch { throw new Error('Recording is not supported in this browser. Try Chrome or Edge.'); }
    const chunks = [];
    rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    const done = new Promise((resolve) => { rec.onstop = resolve; });
    stopRef.current = false;
    setRecording(true); setSecondsLeft(total);
    rec.start(200);
    const start = Date.now();
    let busy = false;
    let snapMs = 0, snapCount = 0;
    const timer = setInterval(async () => {
      const elapsed = (Date.now() - start) / 1000;
      setSecondsLeft(Math.max(0, Math.ceil(total - elapsed)));
      if (elapsed >= total || stopRef.current) { clearInterval(timer); if (rec.state !== 'inactive') rec.stop(); return; }
      if (busy) return;
      busy = true;
      const snapStart = Date.now();
      try { const shot = await html2canvas(doc.body, shotOpts); ctx.drawImage(shot, 0, 0, cw, ch); }
      catch { snapFailedRef.current = true; }
      const snapDt = Date.now() - snapStart;
      snapMs += snapDt; snapCount++;
      // A slow snapshot freezes the picture. If snapshots average over about
      // 120ms, shrink them so the picture keeps moving instead of hanging.
      // The video stays the same size; the picture just gets a little softer.
      if (snapCount >= 3 && snapMs / snapCount > 120 && shotOpts.scale > 1) {
        shotOpts.scale = shotOpts.scale > 1.25 ? 1.25 : 1;
        snapMs = 0; snapCount = 0;
      }
      busy = false;
    }, Math.max(33, Math.round(1000 / fpsNum)));
    await done;
    clearInterval(timer);
    setRecording(false);
    const blob = new Blob(chunks, { type: format === 'mp4' ? 'video/mp4' : 'video/webm' });
    if (blob.size === 0) throw new Error('Recording failed. The preview may use something this recorder cannot capture.');
    return {
      blob,
      info: cw + ' x ' + ch + ' - about ' + total + ' seconds - ' + fpsNum + ' fps' + (audioStream ? ' - with sound' : '') + ' - ' + fmtSize(blob.size),
    };
  };

  // Slows the preview to at most 20 frames per second while recording, so
  // the recorder has time to take steady snapshots. Turned off afterwards.
  const setRafThrottle = (ms) => {
    try {
      const win = iframeRef.current && iframeRef.current.contentWindow;
      if (win) win.__kalkioRafThrottle = ms;
    } catch { /* ignore */ }
  };

  const startRecording = async () => {
    setError('');
    if (videoUrl) { URL.revokeObjectURL(videoUrl); setVideoUrl(''); }
    setResultInfo('');
    setProgress('');
    if (!code.trim()) { setError('Paste some HTML code first.'); return; }
    if (!window.MediaRecorder && !VIDEO_ENCODER_SUPPORTED) { setError('Recording is not supported in this browser. Try Chrome or Edge.'); return; }
    let doc = previewDoc();
    if (!doc || !doc.body) { setError('Preview is not ready yet. Wait a second and try again.'); return; }
    let html2canvas;
    try { ({ default: html2canvas } = await import('html2canvas')); }
    catch { setError('Could not load the recorder. Check your connection and try again.'); return; }
    const d = detectContent(doc, code);
    const total = showAdvanced ? resolveDuration(doc) : autoSeconds(d);
    const useSmooth = d.kind === 'css' && VIDEO_ENCODER_SUPPORTED && format === 'mp4';
    const fpsNum = parseInt(fps, 10) || 30;
    // Fresh start: reload the preview so everything begins at 0. For a live
    // story the Play button is pressed inside the live recorder, right after
    // the first snapshot, so the story and the recording start together.
    let playButton = null;
    if (startFrom === 'start') {
      await reloadPreview();
      doc = previewDoc();
      if (doc && doc.body) {
        const d2 = detectContent(doc, code);
        playButton = d2.playButton;
        if (useSmooth && playButton) {
          try { playButton.click(); } catch { /* ignore */ }
          await new Promise((r) => setTimeout(r, 200));
        }
      }
    }
    doc = previewDoc();
    if (!doc || !doc.body) { setError('Preview is not ready yet. Wait a second and try again.'); return; }
    const anims = getAnims(doc);
    // Save the animation state so the preview goes back to how it was.
    const saved = anims.map((a) => ({ a, t: a.currentTime, state: a.playState }));
    const offsets = startFrom === 'start' ? anims.map(() => 0) : anims.map((a) => (a.currentTime == null ? 0 : a.currentTime));
    if (useSmooth) {
      if (startFrom === 'start') anims.forEach((a) => { try { a.currentTime = 0; } catch { /* ignore */ } });
      anims.forEach((a) => { try { a.pause(); } catch { /* ignore */ } });
    }
    stopRef.current = false; snapFailedRef.current = false;
    setRecording(true);
    setRafThrottle(50);
    let result = null;
    let usedClassic = false;
    try {
      if (useSmooth) {
        try {
          result = await recordSmooth(doc, html2canvas, total, fpsNum, offsets);
        } catch (e1) {
          // One retry: a failed chunk load or a transient encoder error
          // should not drop a smooth-capable browser to 10 fps.
          if (stopRef.current) throw e1;
          setProgress('Smooth recording hit a snag, trying once more...');
          result = await recordSmooth(doc, html2canvas, total, fpsNum, offsets);
        }
      } else {
        usedClassic = true;
        result = await recordClassic(doc, html2canvas, total, fpsNum, startFrom === 'start' ? playButton : null);
      }
    } catch (e) {
      // Smooth engine failed (for example an old browser): fall back to live.
      if (stopRef.current) { setError('Recording stopped.'); }
      else if (!usedClassic && window.MediaRecorder) {
        try {
          setProgress('Smooth recording did not work here (' + (e.message || 'browser error') + '), recording in real time instead.');
          result = await recordClassic(doc, html2canvas, total, fpsNum, null);
          usedClassic = true;
        } catch (e2) { setError(e2.message || 'Recording failed.'); }
      } else {
        setError(e.message || 'Recording failed.');
      }
    } finally {
      setRafThrottle(0);
      // Put the preview back how it was before recording.
      saved.forEach(({ a, t, state }) => {
        try {
          a.currentTime = t;
          if (state === 'running') a.play();
          else if (state === 'paused') a.pause();
        } catch { /* ignore */ }
      });
    }
    setRecording(false);
    setProgress('');
    if (!result) return;
    setVideoUrl(URL.createObjectURL(result.blob));
    setResultInfo(result.info);
    if (snapFailedRef.current) setError('Some frames could not be captured. External images and fonts may not appear in the video.');
    else if (usedClassic && d.kind === 'css' && VIDEO_ENCODER_SUPPORTED && format === 'mp4') setError('Smooth recording did not work here, so this video was recorded in real time at ' + fpsNum + ' fps. Try Chrome or Edge for smooth recording.');
  };

  // One plain line saying what will happen when Record is pressed. No jargon.
  const summary = (() => {
    const doc = previewDoc();
    if (!doc || !doc.body) return '';
    const total = showAdvanced ? resolveDuration(doc) : autoSeconds(det);
    const smoothOn = det.kind === 'css' && VIDEO_ENCODER_SUPPORTED && format === 'mp4';
    if (det.kind === 'css' && smoothOn) {
      const frames = Math.round(total * (parseInt(fps, 10) || 30));
      const est = frames * 0.12;
      return 'Your video: about ' + total + ' seconds, smooth ' + fps + ' fps. Recording takes about ' + (est >= 60 ? Math.round(est / 60) + ' minutes' : Math.max(5, Math.round(est)) + ' seconds') + '.';
    }
    if (det.kind === 'css') return 'Your video: ' + total + ' seconds, recorded live at ' + fps + ' fps. Recording takes ' + total + ' seconds.';
    if (det.kind === 'js') {
      return 'Your story plays live: ' + total + ' seconds at ' + fps + ' fps. Recording takes ' + total + ' seconds.'
        + (/AudioContext/i.test(code) ? ' With sound.' : '')
        + (det.playButton && startFrom === 'start' ? ' It presses Play for you.' : '')
        + (det.playButton && startFrom === 'current' ? ' Press Play in the preview first if the story has not started.' : '');
    }
    return 'No animation in your code: ' + total + ' seconds of still video.';
  })();
  const mp4Disabled = det.kind === 'css' ? !CAN_MAKE_MP4 : !MP4_SUPPORTED;

  return (<Wrap>
    <TextField fullWidth multiline rows={10} label="Your HTML code (inline CSS allowed)" value={code} onChange={(e) => setCode(e.target.value)} sx={{ mb: 2, '& textarea': { fontFamily: 'monospace', fontSize: 13 } }} />
    <Typography variant="subtitle1" fontWeight={700} gutterBottom>Live preview</Typography>
    <Box sx={{ mb: 1, border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
      <iframe ref={iframeRef} title="HTML preview" sandbox="allow-scripts allow-same-origin" srcDoc={previewCode} onLoad={onPreviewLoad} style={{ width: previewSize ? previewSize.w : '100%', height: previewSize ? previewSize.h : 360, border: 0, display: 'block', background: '#fff', margin: previewSize ? '0 auto' : undefined }} />
    </Box>
    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
      {paused
        ? <Button size="small" variant="outlined" onClick={playPreview}>Play preview</Button>
        : <Button size="small" variant="outlined" onClick={pausePreview}>Pause preview</Button>}
      <Button size="small" variant="outlined" onClick={restartPreview}>Restart from beginning</Button>
    </Box>
    {summary && <Typography variant="body1" sx={{ mb: 2 }}>{summary}</Typography>}
    <Typography variant="body2" color="text.secondary" gutterBottom>Video smoothness (frames per second)</Typography>
    <ToggleButtonGroup value={fps} exclusive fullWidth onChange={(_, nv) => nv && setFps(nv)} sx={{ mb: 2 }}>
      <ToggleButton value="10">10 fps</ToggleButton><ToggleButton value="30">30 fps - smooth</ToggleButton><ToggleButton value="60">60 fps - smoothest</ToggleButton>
    </ToggleButtonGroup>
    <Button size="small" variant="outlined" sx={{ mb: 2 }} onClick={() => setShowAdvanced((v) => !v)}>{showAdvanced ? 'Fewer options' : 'More options'}</Button>
    {showAdvanced && (<>
      <Typography variant="body2" color="text.secondary" gutterBottom>Video length</Typography>
      <ToggleButtonGroup value={duration} exclusive fullWidth onChange={(_, nv) => nv && setDuration(nv)} sx={{ mb: 1, flexWrap: 'wrap' }}>
        <ToggleButton value="3">3 seconds</ToggleButton><ToggleButton value="5">5 seconds</ToggleButton><ToggleButton value="10">10 seconds</ToggleButton><ToggleButton value="15">15 seconds</ToggleButton><ToggleButton value="30">30 seconds</ToggleButton><ToggleButton value="60">60 seconds</ToggleButton>
        {det.kind === 'css' && <ToggleButton value="full">Full animation</ToggleButton>}<ToggleButton value="custom">Custom</ToggleButton>
      </ToggleButtonGroup>
      {duration === 'custom' && (<TextField label="Seconds (1 to 120)" type="number" value={customSeconds} onChange={(e) => setCustomSeconds(e.target.value)} inputProps={{ min: 1, max: 120 }} size="small" sx={{ mb: 1, width: 220 }} />)}
      {duration === 'full' && det.kind === 'css' && <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Full animation records one full run of your animation. For a looping animation, that is one loop.</Typography>}
      {det.kind !== 'css' && <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Full needs a CSS animation. Your content plays with JavaScript, so pick a length above.</Typography>}
      <Typography variant="body2" color="text.secondary" gutterBottom>Start recording</Typography>
      <ToggleButtonGroup value={startFrom} exclusive fullWidth onChange={(_, nv) => nv && setStartFrom(nv)} sx={{ mb: 1 }}>
        <ToggleButton value="start">From the beginning</ToggleButton><ToggleButton value="current">From where it is now</ToggleButton>
      </ToggleButtonGroup>
      <Typography variant="body2" color="text.secondary" gutterBottom>Video format</Typography>
      <ToggleButtonGroup value={format} exclusive fullWidth onChange={(_, nv) => nv && setFormat(nv)} sx={{ mb: 2 }}>
        <ToggleButton value="mp4" disabled={mp4Disabled}>MP4 - plays everywhere</ToggleButton><ToggleButton value="webm">WebM</ToggleButton>
      </ToggleButtonGroup>
      {!CAN_MAKE_MP4 && <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Your browser cannot make MP4, so WebM is used.</Typography>}
      {det.kind !== 'css' && !MP4_SUPPORTED && CAN_MAKE_MP4 && <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Your browser records WebM for live stories. MP4 needs Chrome, Edge or Safari.</Typography>}
      {format === 'webm' && VIDEO_ENCODER_SUPPORTED && det.kind === 'css' && <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>WebM records in real time at 10 frames per second. For smooth 30 or 60 fps, choose MP4.</Typography>}
    </>)}
    {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
    {recording
      ? (<><Button fullWidth variant="contained" color="error" sx={{ mb: 2 }} onClick={() => { stopRef.current = true; }}>Stop recording</Button>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>{progress || ('Recording... ' + secondsLeft + 's left. Keep this tab open.')}</Typography></>)
      : (<Button fullWidth variant="contained" sx={{ mb: 2 }} onClick={startRecording}>Record video</Button>)}
    <canvas ref={canvasRef} style={{ display: 'none' }} />
    {videoUrl && (<>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Your video</Typography>
      <Box sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
        <video src={videoUrl} controls style={{ width: '100%', display: 'block', background: '#000' }} />
      </Box>
      {resultInfo && <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Your video: {resultInfo}</Typography>}
      <Button fullWidth variant="outlined" component="a" href={videoUrl} download={format === 'mp4' ? 'kalkio-html-video.mp4' : 'kalkio-html-video.webm'}>Download video ({format === 'mp4' ? '.MP4' : '.WEBM'})</Button>
    </>)}
  </Wrap>);
}
