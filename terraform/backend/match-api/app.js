const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('✅ Match API is running on port 80!');
});
server.listen(80, () => console.log('Match API is live on port 80'));
