const app      = require('express')();
const server   = require('http').createServer(app);
const io       = require('socket.io').listen(server);
const port     = process.env.PORT || 4000;
const logLevel = process.env.LOG_LEVEL || 1;

require('./setup-server')(app);
io.set('log level', logLevel);

io.sockets.on('connection', function (socket) {
  var companyId = null;

  socket.on('room', function(room) {
    companyId = room;
    socket.join(room);
    viewers(room);
  });

  socket.on('sync', function (data) {
    socket.broadcast.to(companyId).emit('sync', data);
  });

  socket.on('disconnect', function() {
    if (!companyId) return;
    socket.leave(companyId);
    viewers(companyId);
  });
});

/**
 * Emit viewers event for all sockets connected to the `room`
 */

function viewers(room) {
  const sockets = io.sockets.clients(room);
  const data    = sockets.map(function(socket) { return socket.id; });
  if (data.length) io.sockets.in(room).emit('viewers', data);
}

// start server
server.listen(port);
