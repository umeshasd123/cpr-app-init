const http = require('http');
require('dotenv').config();
const express = require("express");
const path = require("path");
const debug = require('debug')('nodejs-express:server');

const app = require("./app.js");

const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

// The port number on which the server will listen for incoming requests.
const PORT = normalizePort(process.env.PORT || 5000);
app.set('port', PORT);

// Serve frontend build
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// Error handling for the server
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// The server will listen on the specified port.
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

const server = http.createServer(app);
server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);