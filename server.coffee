io = require("socket.io").listen(3001)

io.set 'log level', 0

# Heroku won't actually allow us to use WebSockets
# so we have to setup polling instead.
# https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
io.set "transports", ["xhr-polling"]
io.set "polling duration", 10

status = "Roasting juicy pig.."

io.sockets.on "connection", (socket) ->
  io.sockets.emit 'status', status: status

  socket.on "message", (message)->
    socket.broadcast.emit "message", message
