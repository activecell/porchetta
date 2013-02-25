global.glob = {}
glob.modules =
  http: require("http")
  socketio: require("socket.io")

glob.rooms = []
glob.config = require './config'

express = require("express")
glob.app = app = express()

app.configure ->
  app.set "port", glob.config.port
  app.use(express.bodyParser());
  app.use express.methodOverride()
  app.use app.router

app.configure "development", ->
  app.use express.errorHandler()

server = glob.modules.http.createServer(app)

glob.io = io = glob.modules.socketio.listen(server)

#io.set "transports", ["xhr-polling"]
#io.set "polling duration", 10
io.set "log level", 0

require './router'
glob.room = require('./socket')

server.listen glob.config.app.port, ->
  console.log 'listen'
