const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5500;

http.createServer((req, res) => {
    // Lấy đường dẫn file, bỏ qua các tham số URL (như ?name=...)
    let filePath = '.' + req.url.split('?')[0];
    if (filePath === './') filePath = './index.html';

    // Thêm Header Content-Encoding: br nếu là file nén Brotli (.br)
    if (filePath.endsWith('.br')) {
        res.setHeader('Content-Encoding', 'br');
    }

    // Đặt Content-Type tương ứng cho từng loại file
    let contentType = 'application/octet-stream';
    if (filePath.endsWith('.html')) contentType = 'text/html';
    else if (filePath.endsWith('.js') || filePath.endsWith('.js.br')) contentType = 'text/javascript';
    else if (filePath.endsWith('.css')) contentType = 'text/css';
    else if (filePath.endsWith('.wasm') || filePath.endsWith('.wasm.br')) contentType = 'application/wasm';
    else if (filePath.endsWith('.png')) contentType = 'image/png';
    else if (filePath.endsWith('.jpg')) contentType = 'image/jpeg';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}).listen(PORT, () => {
    console.log(`Server local dang chay tai: http://localhost:${PORT}`);
});