import React, { useState, useRef } from 'react';
import { Card, CardContent, Typography, TextField, Box, ToggleButton, ToggleButtonGroup, Alert, Button } from '@mui/material';

function Wrap({ children, note }) {
  return (<><Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>{children}</CardContent></Card>{note && <Alert severity="info" sx={{ mt: 2 }}>{note}</Alert>}</>);
}

// HTML to Video (Code to Video) - everything runs in the browser, nothing is uploaded.
// The preview runs in a sandboxed iframe. Recording takes a snapshot of the preview
// with html2canvas about 10 times per second, draws each snapshot on a canvas, and
// records that canvas with MediaRecorder. Output is .webm only - true .mp4 encoding
// needs a server, so this tool does not claim to make .mp4 files.
//
// Quality rules (fixed 5 Nov 2026 - the old version recorded at preview size with
// the browser's default bitrate, so the video looked soft, and a tall page was
// squashed into the short preview frame):
// - Snapshots are taken at 2x the preview size (1.5x on heavy pages, measured from
//   the first snapshot), so the video stays sharp. The long side is capped at 1920.
// - A tall fixed stage (for example a vertical 9:16 scene up to 1200px tall) is
//   captured whole, so it comes out as a vertical video instead of being squashed.
//   A long scrolling page is captured as the visible window instead.
// - MediaRecorder runs at 5 Mbps so compression does not soften the picture.
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
// Chrome, Edge and Safari can record real MP4 (H.264) straight from the canvas -
// tested 5 Nov 2026: a 2s MP4 recording came out as a valid file (ftypisom).
// Firefox cannot, so it falls back to WebM.
const MP4_SUPPORTED = typeof window !== 'undefined' && !!window.MediaRecorder && MP4_CANDIDATES.some((m) => { try { return MediaRecorder.isTypeSupported(m); } catch { return false; } });
const VIDEO_BITRATE = 5000000;
const fmtSize = (b) => b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';

export function HtmlToVideoTool() {
  const [code, setCode] = useState(SAMPLE);
  const [duration, setDuration] = useState('5');
  const [format, setFormat] = useState(MP4_SUPPORTED ? 'mp4' : 'webm');
  const [recording, setRecording] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [resultInfo, setResultInfo] = useState('');
  const [error, setError] = useState('');
  const iframeRef = useRef(null);
  const canvasRef = useRef(null);
  const stopRef = useRef(false);
  const snapFailedRef = useRef(false);

  const startRecording = async () => {
    setError('');
    if (videoUrl) { URL.revokeObjectURL(videoUrl); setVideoUrl(''); }
    setResultInfo('');
    if (!code.trim()) { setError('Paste some HTML code first.'); return; }
    if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) { setError('Recording is not supported in this browser. Try Chrome or Edge.'); return; }
    const iframe = iframeRef.current;
    const doc = iframe && iframe.contentDocument;
    if (!doc || !doc.body) { setError('Preview is not ready yet. Wait a second and try again.'); return; }
    let html2canvas;
    try { ({ default: html2canvas } = await import('html2canvas')); }
    catch { setError('Could not load the recorder. Check your connection and try again.'); return; }
    const w = iframe.clientWidth || 640;
    const h = iframe.clientHeight || 360;
    const bodyH = doc.body.scrollHeight || h;
    const fullBody = bodyH > h + 50 && bodyH <= 1200;
    const shotOpts = { backgroundColor: '#ffffff', logging: false, useCORS: true, scale: 2 };
    if (!fullBody) { shotOpts.width = w; shotOpts.height = h; }
    // First snapshot before starting, so the video does not open on a blank frame.
    // It is also timed: if one snapshot is slow, drop to 1.5x so frames keep coming.
    let first;
    try {
      const t0 = Date.now();
      first = await html2canvas(doc.body, shotOpts);
      if (Date.now() - t0 > 400) {
        shotOpts.scale = 1.5;
        first = await html2canvas(doc.body, shotOpts);
      }
    } catch { snapFailedRef.current = true; }
    if (!first) { setError('Recording failed. The preview may use something this recorder cannot capture.'); return; }
    const canvas = canvasRef.current;
    let cw = first.width, ch = first.height;
    const longest = Math.max(cw, ch);
    if (longest > 1920) { const k = 1920 / longest; cw = Math.round(cw * k); ch = Math.round(ch * k); }
    canvas.width = cw; canvas.height = ch;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(first, 0, 0, cw, ch);
    const total = parseInt(duration, 10) || 5;
    const candidates = format === 'mp4' ? MP4_CANDIDATES : MIME_CANDIDATES;
    let mime = '';
    for (const m of candidates) { if (window.MediaRecorder.isTypeSupported(m)) { mime = m; break; } }
    if (format === 'mp4' && !mime) { setError('Your browser cannot make MP4. Try WebM instead.'); return; }
    let rec;
    try { rec = new MediaRecorder(canvas.captureStream(10), mime ? { mimeType: mime, videoBitsPerSecond: VIDEO_BITRATE } : { videoBitsPerSecond: VIDEO_BITRATE }); }
    catch { setError('Recording is not supported in this browser. Try Chrome or Edge.'); return; }
    const chunks = [];
    rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    const done = new Promise((resolve) => { rec.onstop = resolve; });
    stopRef.current = false; snapFailedRef.current = false;
    setRecording(true); setSecondsLeft(total);
    rec.start(200);
    const start = Date.now();
    let busy = false;
    const timer = setInterval(async () => {
      const elapsed = (Date.now() - start) / 1000;
      setSecondsLeft(Math.max(0, Math.ceil(total - elapsed)));
      if (elapsed >= total || stopRef.current) { clearInterval(timer); if (rec.state !== 'inactive') rec.stop(); return; }
      if (busy) return;
      busy = true;
      try { const shot = await html2canvas(doc.body, shotOpts); ctx.drawImage(shot, 0, 0, cw, ch); }
      catch { snapFailedRef.current = true; }
      busy = false;
    }, 100);
    await done;
    clearInterval(timer);
    setRecording(false);
    const blob = new Blob(chunks, { type: format === 'mp4' ? 'video/mp4' : 'video/webm' });
    if (blob.size === 0) { setError('Recording failed. The preview may use something this recorder cannot capture.'); return; }
    setVideoUrl(URL.createObjectURL(blob));
    setResultInfo(cw + ' x ' + ch + ' - about ' + total + ' seconds - ' + fmtSize(blob.size));
    if (snapFailedRef.current) setError('Some frames could not be captured. External images and fonts may not appear in the video.');
  };

  return (<Wrap>
    <TextField fullWidth multiline rows={10} label="Your HTML code (inline CSS allowed)" value={code} onChange={(e) => setCode(e.target.value)} sx={{ mb: 2, '& textarea': { fontFamily: 'monospace', fontSize: 13 } }} />
    <Typography variant="subtitle1" fontWeight={700} gutterBottom>Live preview</Typography>
    <Box sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
      <iframe ref={iframeRef} title="HTML preview" sandbox="allow-scripts allow-same-origin" srcDoc={code} style={{ width: '100%', height: 360, border: 0, display: 'block', background: '#fff' }} />
    </Box>
    <Typography variant="body2" color="text.secondary" gutterBottom>Video length</Typography>
    <ToggleButtonGroup value={duration} exclusive fullWidth onChange={(_, nv) => nv && setDuration(nv)} sx={{ mb: 2, flexWrap: 'wrap' }}>
      <ToggleButton value="3">3 seconds</ToggleButton><ToggleButton value="5">5 seconds</ToggleButton><ToggleButton value="10">10 seconds</ToggleButton><ToggleButton value="15">15 seconds</ToggleButton><ToggleButton value="30">30 seconds</ToggleButton><ToggleButton value="60">60 seconds</ToggleButton>
    </ToggleButtonGroup>
    <Typography variant="body2" color="text.secondary" gutterBottom>Video format</Typography>
    <ToggleButtonGroup value={format} exclusive fullWidth onChange={(_, nv) => nv && setFormat(nv)} sx={{ mb: 2 }}>
      <ToggleButton value="mp4" disabled={!MP4_SUPPORTED}>MP4 - plays everywhere</ToggleButton><ToggleButton value="webm">WebM</ToggleButton>
    </ToggleButtonGroup>
    {!MP4_SUPPORTED && <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Your browser cannot make MP4, so WebM is used.</Typography>}
    {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
    {recording
      ? (<><Button fullWidth variant="contained" color="error" sx={{ mb: 2 }} onClick={() => { stopRef.current = true; }}>Stop recording ({secondsLeft}s left)</Button>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>Recording... {secondsLeft}s left. Keep this tab open.</Typography></>)
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
