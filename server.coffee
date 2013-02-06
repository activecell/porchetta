port = process.env.PORT or 3001
io = require("socket.io").listen(port)

io.set 'log level', 0

io.sockets.on "connection", (socket) ->

  socket.on "change", (data)->
      socket.broadcast.emit "update", data
