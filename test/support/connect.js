var io = require('socket.io-client');

module.exports = function connect(next) {
  var socket = io.connect('http://localhost:4000/', { 'force new connection': true });
  socket.on('connect', next);
  return socket;
};
