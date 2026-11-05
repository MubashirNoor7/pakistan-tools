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

export function HtmlToVideoTool() {
  const [code, setCode] = useState(SAMPLE);
  const [duration, setDuration] = useState('5');
  const [recording, setRecording] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const iframeRef = useRef(null);
  const canvasRef = useRef(null);
  const stopRef = useRef(false);
  const snapFailedRef = useRef(false);

  const startRecording = async () => {
    setError('');
    if (videoUrl) { URL.revokeObjectURL(videoUrl); setVideoUrl(''); }
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
    const canvas = canvasRef.current;
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
    const total = parseInt(duration, 10) || 5;
    let mime = '';
    for (const m of MIME_CANDIDATES) { if (window.MediaRecorder.isTypeSupported(m)) { mime = m; break; } }
    let rec;
    try { rec = new MediaRecorder(canvas.captureStream(10), mime ? { mimeType: mime } : undefined); }
    catch { setError('Recording is not supported in this browser. Try Chrome or Edge.'); return; }
    const chunks = [];
    rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    const done = new Promise((resolve) => { rec.onstop = resolve; });
    stopRef.current = false; snapFailedRef.current = false;
    setRecording(true); setSecondsLeft(total);
    // First frame before starting, so the video does not open on a blank frame.
    try { const first = await html2canvas(doc.body, { backgroundColor: '#ffffff', logging: false, useCORS: true }); ctx.drawImage(first, 0, 0, w, h); }
    catch { snapFailedRef.current = true; }
    rec.start(200);
    const start = Date.now();
    let busy = false;
    const timer = setInterval(async () => {
      const elapsed = (Date.now() - start) / 1000;
      setSecondsLeft(Math.max(0, Math.ceil(total - elapsed)));
      if (elapsed >= total || stopRef.current) { clearInterval(timer); if (rec.state !== 'inactive') rec.stop(); return; }
      if (busy) return;
      busy = true;
      try { const shot = await html2canvas(doc.body, { backgroundColor: '#ffffff', logging: false, useCORS: true }); ctx.drawImage(shot, 0, 0, w, h); }
      catch { snapFailedRef.current = true; }
      busy = false;
    }, 100);
    await done;
    clearInterval(timer);
    setRecording(false);
    const blob = new Blob(chunks, { type: 'video/webm' });
    if (blob.size === 0) { setError('Recording failed. The preview may use something this recorder cannot capture.'); return; }
    setVideoUrl(URL.createObjectURL(blob));
    if (snapFailedRef.current) setError('Some frames could not be captured. External images and fonts may not appear in the video.');
  };

  return (<Wrap note="Video downloads as .webm (plays in browsers and phones). True .mp4 needs a server, so this tool does not make .mp4 files. Everything runs in your browser. Nothing is uploaded.">
    <TextField fullWidth multiline rows={10} label="Your HTML code (inline CSS allowed)" value={code} onChange={(e) => setCode(e.target.value)} sx={{ mb: 2, '& textarea': { fontFamily: 'monospace', fontSize: 13 } }} />
    <Typography variant="subtitle1" fontWeight={700} gutterBottom>Live preview</Typography>
    <Box sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
      <iframe ref={iframeRef} title="HTML preview" sandbox="allow-scripts allow-same-origin" srcDoc={code} style={{ width: '100%', height: 360, border: 0, display: 'block', background: '#fff' }} />
    </Box>
    <Typography variant="body2" color="text.secondary" gutterBottom>Video length</Typography>
    <ToggleButtonGroup value={duration} exclusive fullWidth onChange={(_, nv) => nv && setDuration(nv)} sx={{ mb: 2 }}>
      <ToggleButton value="3">3 seconds</ToggleButton><ToggleButton value="5">5 seconds</ToggleButton><ToggleButton value="10">10 seconds</ToggleButton>
    </ToggleButtonGroup>
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
      <Button fullWidth variant="outlined" component="a" href={videoUrl} download="kalkio-html-video.webm">Download video (.webm)</Button>
    </>)}
  </Wrap>);
}
