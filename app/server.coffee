port = process.env.PORT || 5001
console.log port

global.glob = {}
glob.rooms = []

express = require("express")
glob.app = app = express()

app.configure ->
  app.set "port", port
  #app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use express.methodOverride()
  app.use app.router

app.configure "development", ->
  app.use express.errorHandler()

server = require("http").createServer(app)

glob.io = io = require("socket.io").listen(server)

io.set "transports", ["xhr-polling"]
io.set "polling duration", 10
io.set "log level", 0

require './router'
glob.room = require('./socket')

server.listen(port)
