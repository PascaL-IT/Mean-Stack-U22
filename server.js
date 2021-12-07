const http = require('http');
const app = require('./backend/app');

const hostname = '127.0.0.1';
const port = process.env.port || 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello from server.js');
// });

app.set('port', port);
const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

console.log("Server started ... ");
