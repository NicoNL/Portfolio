const http = require('http');
const port = 8000;
const fs = require('fs');
// console.log(http);
// This is a function from the http module assigned to the createServer object


//BOTH EXPRESSIONS ARE EQUIVALENT
// const { createS0erver : makeServer} = require('http');
//This expression is known as Destructuring
// HTTP Object Server
//Then we use the function and it'll take a request and a response that will be handle by Node
const server = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    fs.readFile('index.html', (error, data) => {
        if (error) {
            response.writeHead(404);
            response.write("Error: File Not Found");
        } else {
            response.write(data);
        }
        response.end();
    });
});
//We let the server wait for more requests
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


// function handleRequest(request, response) {
//   response.writeHead(200, { 'Content-Type': 'text/html' });
//   response.write('<h1>Hello World!</h1>');
//   response.end();
// }

// const server = createServer(handleRequest)
