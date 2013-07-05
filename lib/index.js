var agent   = require('superagent');
var port    = process.env.PORT || 4000;
var io      = require('socket.io').listen(parseInt(port, 10));

io.set('log level', 1); // change to 3 for debug
io.set('authorization', function (data, accept) {
  request(data, function(err, res) {
    accept(err, res.statusCode === 204);
  });
});

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
 * Helper to prepare request options based on handshake `data`
 */

function request(data, cb) {
  agent
    .get((process.env.ORIGIN || data.headers.origin) + '/api/v1/handshake.json')
    .set('Host', (data.headers.origin || '').replace('http://', ''))
    .set('Cookie', data.headers.cookie)
    .set('Accept', 'application/json')
    .end(cb);
}

/**
 * Emit viewers event for all sockets connected to the `room`
 */

function viewers(room) {
  var sockets = io.sockets.clients(room);
  var data    = sockets.map(function(socket) { return socket.id; });
  if (data.length) io.sockets.in(room).emit('viewers', data);
}
