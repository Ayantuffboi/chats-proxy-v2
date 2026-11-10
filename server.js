const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

// Fixed, harmless diagnostic destinations only.
// This server intentionally does not accept arbitrary URLs or forward arbitrary web requests.
const TESTS = [
  { name: 'Example test domain', url: 'https://example.com/', host: 'example.com' },
  { name: 'HTTP test endpoint', url: 'https://httpbin.org/status/200', host: 'httpbin.org' }
];

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' });
  res.end(body);
}
function json(res, status, obj) { send(res, status, JSON.stringify(obj)); }

const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
  if (pathname === '/api/status') {
    return json(res, 200, { ok: true, service: "Chat's Proxy diagnostics", serverTime: new Date().toISOString() });
  }
  if (pathname === '/api/diagnostics') {
    const checks = await Promise.all(TESTS.map(async test => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      try {
        const response = await fetch(test.url, { method: 'HEAD', redirect: 'manual', signal: controller.signal });
        return { name: test.name, ok: response.status >= 200 && response.status < 400, detail: `HTTP ${response.status} from ${test.host}` };
      } catch (error) {
        return { name: test.name, ok: false, detail: `${test.host}: ${error.name === 'AbortError' ? 'timed out' : 'connection failed'}` };
      } finally { clearTimeout(timer); }
    }));
    return json(res, 200, { serverTime: new Date().toISOString(), checks });
  }
  if (pathname.startsWith('/api/')) return json(res, 404, { error: 'Unknown API route' });

  let file = pathname === '/' ? 'index.html' : decodeURIComponent(pathname).replace(/^\/+/, '');
  const full = path.resolve(ROOT, file);
  if (!full.startsWith(ROOT + path.sep) && full !== path.join(ROOT, 'index.html')) return send(res, 403, 'Forbidden', 'text/plain; charset=utf-8');
  fs.readFile(full, (err, data) => {
    if (err) return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
    const ext = path.extname(full);
    const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8' };
    send(res, 200, data, types[ext] || 'application/octet-stream');
  });
});
server.listen(PORT, () => console.log(`Chat's Proxy diagnostics listening on ${PORT}`));
