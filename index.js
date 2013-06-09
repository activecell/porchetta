var request = require('request');
var port    = process.env.PORT || 4000;
var io      = require('socket.io').listen(port);

io.set('authorization', function (data, accept) {
  request.get(handshake(data), function(err, res, body) {
    accept(err, res.statusCode === 204);
  });
});

io.sockets.on('connection', function (socket) {
  var companyId = null;

  socket.on('sync', function (data) {
    socket.broadcast.to(companyId).emit('sync', data);
  });

  socket.on('room', function(room) {
    companyId = room;
    socket.join(room);
  });
});

function handshake(data) {
  var url     = 'http://sterlingcooper.activecell.local:3000/api/v1/handshake.json';
  var jar     = request.jar();
  var cookie  = request.cookie(data.headers.cookie);
  jar.add(cookie);

  return { url: url, jar: jar, json: true };
}
