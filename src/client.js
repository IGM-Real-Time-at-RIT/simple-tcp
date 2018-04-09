// import the TCP module 'net'. This contains all of the TCP methods
const net = require('net');

// set the server address to connect to. In this example, I'm just using the local machine address
const HOST = '127.0.0.1'; // server address
const PORT = 12000; // port on the server to connect to

// Create a new socket for the client to connect with
const client = new net.Socket();

// Connect to the server with the socket's connect method
// Params - port, server address, function to call when connected
client.connect(PORT, HOST, () => {
  console.log('Client connected');
});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
// data events are automatically fired by the tcp socket
client.on('data', (data) => {
    // Data is a binary buffer. If you print it on its own, it will show you the buffer in hex
    // If you print it in a string like this, it converts it to a string for you
  console.log(`Recieved: ${data}`);
});

// Add a 'close' event handler for the client socket
// close events are fired automatically by the tcp socket
// A close event occurs when the connection is fully disconnected from the server
// There are also 'error' events for tcp errors and 'end'
// events for messages indicating a disconnect is going to happen
// 'end' events allow you to handle a final message to the server
// before the socket is disconnected
// 'close' events occur after the socket is disconnected
client.on('close', () => {
  console.log('Connection closed');
});

// Use stdin (from the process) to read in data from the command
// line and send it to the server
// stdin is just like in C++. It is the command line input from the OS.
// set the 'data' event for the command line input. The 'data' event
// fires any time data comes in on the command line.
// Data is only sent from the command line when the user hits enter,
// then the data is passed into this function
process.stdin.on('data', (data) => {
  // write the data from the command line to the socket, writing it to the server
  client.write(data);
});
