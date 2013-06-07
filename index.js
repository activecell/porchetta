var request = require('request');
var io      = require('socket.io').listen(port);
var port    = process.env.PORT || 3000;
var host    = 'http://localhost:' + port;

io.set('authorization', function (handshakeData, cb) {
  var options = { some: 'data' };

  request.post(host + '/users/sign_in', options, function(err, res, body) {

  });
});

io.sockets.on('connection', function (socket) {
  socket.on('sync', function (data) {
    socket.broadcast.emit('sync', data);
  });
});
