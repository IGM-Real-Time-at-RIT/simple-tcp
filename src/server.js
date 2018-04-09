// Load the TCP Library. This is called 'net'. T
// his has all of the TCP methods
const net = require('net');

// pull in our tcpSocket class to attach all of our socket handlers
const tcpSocket = require('./tcpSocket.js');

// Array to keep track of the chat clients
const clients = [];

// Send a message to all clients
const broadcast = (message) => {
  // loop through each client and write the message to the TCP stream
  clients.forEach((client) => {
    console.log(client.name);

    // use the tcp socket's write method to write data to the TCP stream
    client.write(message);
  });

  // Log it to the server output too
  console.log(message);
};

// function to handle new connections. This will accept a TCP socket.
const handleSocket = (sock) => {
  const socket = sock;

  // we'll add a field to the socket object called name and use it
  // to identify the client we'll make the name the combination
  // of their ip address and port
  socket.name = `${socket.remoteAddress}:${socket.remotePort}`;

  // call the tcpSocket methods to attach handlers to the socket
  // These are the methods from tcpSocket.js
  tcpSocket.onData(socket);
  tcpSocket.onError(socket);
  tcpSocket.onEnd(socket);
  tcpSocket.onClose(socket);

  // Put this new client socket to the list
  clients.push(socket);

  // Send a nice welcome message and announce
  // use the socket's write function to write data out
  socket.write(`Welcome ${socket.name}\n`);

  // call the broadcast function to send out a message to
  // everyone connected
  broadcast(`${socket.name} joined the chat\n`);
};

// Start a TCP Server and listen on port 12000. This is an arbitrary number
// the createServer method takes a function to call on new connections
net.createServer(handleSocket).listen(12000);

// Put a friendly message on the terminal of the server.
console.log('Chat server running at port 12000\n');

// make the clients array and broadcast function public so the tcpSocket class can reference them.
module.exports.clients = clients;
module.exports.broadcast = broadcast;
