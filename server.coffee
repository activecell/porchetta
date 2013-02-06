express = require("express")
app = express(express.logger())

server = require("http").createServer(app)
io = require("socket.io").listen(server)

port = process.env.PORT || 5000
server.listen(port)

# Heroku won't actually allow us to use WebSockets
# so we have to setup polling instead.
# https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
io.set "transports", ["xhr-polling"]
io.set "polling duration", 10

io.sockets.on "connection", (socket) ->
  socket.emit("status", status: "Roasting juicy pig..")

  socket.on "join", (data) ->
    socket.join(data.companyId)

    socket.broadcast.to(data.companyId).send("company joined: #{data.companyId}")

    socket.on "message", (data, fn) ->
      # send notification to the sender
      socket.emit("message", message: "send message: #{data.message}")
      # broadcast it to the others
      socket.broadcast.emit("message", data)

      fn("received")

app.use(express.bodyParser())

app.post "/message/:companyId", (request, response) ->
  companyId = request.params.companyId
  message = request.body.message

  io.sockets.to(companyId).emit("message", message: message) if message
  response.send 200
