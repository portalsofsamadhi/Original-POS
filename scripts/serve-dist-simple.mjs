import { createServer } from 'http';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '..', 'dist');
const port = process.env.PORT || 3004;

const server = createServer(async (req, res) => {
  try {
    let filePath = req.url === '/' ? path.join(distDir, 'index.html') : path.join(distDir, req.url);
    // Prevent directory traversal
    if (!filePath.startsWith(distDir)) { res.statusCode = 403; res.end('Forbidden'); return; }
    const data = await readFile(filePath);
    res.statusCode = 200;
    res.end(data);
  } catch (err) {
    res.statusCode = 404;
    res.end('Not found');
  }
});

server.listen(port, '0.0.0.0', () => console.log(`Simple static server running on http://localhost:${port}`));
