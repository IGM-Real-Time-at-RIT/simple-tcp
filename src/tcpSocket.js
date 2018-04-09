// import the server's public properties into the variable server
// since node only ever loads a class once, this will not be
// a circular reference. Having server import this class and this
// class import server, just brings the public properties into scope
// They will *not* recursively call each other
const server = require('./server.js');

// function to add 'data' events to the socket
// data events are automatically fired by tcp sockets to handle
// incoming messages from clients.
const onData = (socket) => {
  // set the callback function for any time this
  // socket's 'data' event fires
  socket.on('data', (data) => {
    // take the data and call the server's broadcast method
    // to send the data to all connected clients
    server.broadcast(`${socket.name} : ${data}`);
  });
};

// function to add 'error' events to the socket
// error events are automatically fired by tcp sockets to
// handle any TCP connection errors for a client
const onError = (socket) => {
  // detect if a socket has errored out and destroy the connection
  socket.on('error', () => {
    // destroy immediately goes into the destruction process
    // instead of the ending and closing
    // We will assume that if we had a connection error,
    // they have already ended and closed the connection,
    // so we will destroy it
    socket.destroy();
  });
};

// function to add 'end' events to the socket
// end events are automatically fired by tcp sockets to
// handle any disconnecting messages from the client
// end events are messages that the socket is going to be
// closed, but it has not happened yet.
// This allows you respond before the socket is fully closed.
// end events will not fire if the connection is manually
// killed or closed without an ending message being sent
const onEnd = (socket) => {
  // sends a message on disconnection event (before fully closed)
  socket.on('end', () => {
    // write to the socket to say goodbye before the disconnect fully
    socket.write('Goodbye');
  });
};

// function to add 'close' events to the socket
// close events are automatically fired by tcp sockets to handle
// any closing of sockets
// close events are the disconnection of a socket.
// They happened after the 'end' events
// (if the end events are even fired by the client).
// close events mean that connection is no longer open and
// has been fully disconnected from the server.
const onClose = (socket) => {
  // remove the socket and updates everyone in chat when
  // a socket is fully disconnected
  socket.on('close', () => {
    // remove this client from the clients array since we
    // don't want to send messages to this disconnected client
    server.clients.splice(server.clients.indexOf(socket), 1);

    // call the server's broadcast function to send out a
    // message to everyone still in the clients array to let them know who left
    server.broadcast(`${socket.name} left the chat.\n`);
  });
};

// set the public functions for this class
// exporting out as the same names for convenience
module.exports.onData = onData;
module.exports.onError = onError;
module.exports.onEnd = onEnd;
module.exports.onClose = onClose;
