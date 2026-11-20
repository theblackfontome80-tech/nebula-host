// Aperçu local : node scripts/serve.mjs   → http://localhost:4173
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { join, resolve, extname, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 4173;
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.txt': 'text/plain; charset=utf-8' };

createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400); return res.end(); }
  let file = resolve(ROOT, '.' + p);
  if (file !== ROOT && !file.startsWith(ROOT + sep)) { res.writeHead(403); return res.end(); }
  try { if (statSync(file).isDirectory()) file = join(file, 'index.html'); statSync(file); }
  catch { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('404'); }
  res.writeHead(200, { 'Content-Type': MIME[extname(file).toLowerCase()] || 'application/octet-stream' });
  createReadStream(file).pipe(res);
}).listen(PORT, '127.0.0.1', () => console.log(`Aperçu : http://localhost:${PORT}`));
