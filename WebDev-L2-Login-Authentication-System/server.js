const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
    // Parse URL and sanitize file path
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    if (pathname === '/') {
        pathname = '/index.html';
    }

    const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(PUBLIC_DIR, safePath);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head><title>404 Not Found</title></head>
                <body style="font-family: sans-serif; background: #0b0f19; color: #fff; padding: 3rem; text-align: center;">
                    <h1>404 - Page Not Found</h1>
                    <p style="color: #9ca3af;">The requested file "${pathname}" was not found.</p>
                    <a href="/login.html" style="color: #6366f1;">Go to Login</a>
                </body>
                </html>
            `);
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache'
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Authentication System Server Running!`);
    console.log(`📡 Local URL:   http://localhost:${PORT}`);
    console.log(`🔑 Login Page:  http://localhost:${PORT}/login.html`);
    console.log(`📝 Register:    http://localhost:${PORT}/register.html`);
    console.log(`🛡️  Dashboard:   http://localhost:${PORT}/dashboard.html`);
    console.log(`======================================================\n`);
});

