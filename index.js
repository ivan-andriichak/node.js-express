const http = require("node:http");

const {foo} = require('./some_dir/helper');


foo();
console.log('Hello World!');
console.log(__dirname);
console.log(__filename)
console.log(process.cwd())

//HTTP
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('Hello world Express!!!');
});


server.listen(3001, () => {
  console.log('Server is running on port 3001');
});