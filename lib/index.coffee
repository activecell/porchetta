port    = process.env.PORT || 4000
request = require('request')
io      = require('socket.io').listen(port)
url     = 'http://localhost:3000/users/sign_in'

io.set 'authorization', (data, accept) ->
  options = {}
  cookie  = data.headers.cookie
  return accept(null, false) unless cookie

  console.log(handshakeData)
  request.post url, options, (err, res, body) ->
    console.log(err, res, body)

io.sockets.on 'connection', (socket) ->
  socket.on 'sync', (data) ->
    socket.broadcast.emit('sync', data)
