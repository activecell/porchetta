var request = require('request');
var port    = process.env.PORT || 4000;
var appPort = process.env.APP_PORT || 3000;
var io      = require('socket.io').listen(port);

io.set('log level', 1); // change to 3 for debug
io.set('authorization', function (data, accept) {
  request.get(handshake(data), function(err, res, body) {
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
});

/**
 * Helper to prepare request options based on handshake `data`
 */

function handshake(data) {
  var host   = data.address.address + ':' + appPort;
  var url    = 'http://' + host + '/api/v1/handshake.json';
  var jar    = request.jar();
  var cookie = request.cookie(data.headers.cookie || '');
  jar.add(cookie);

  return { url: url, jar: jar, json: true };
}

/**
 * Emit viewers event for all sockets connected to the `room`
 */

function viewers(room) {
  var sockets = io.sockets.clients(room);
  var data    = sockets.map(function(socket) { return socket.id; });
  if (data.length) io.sockets.in(room).emit('viewers', data);
}
