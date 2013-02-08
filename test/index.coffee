process.env.NODE_ENV = 'testing'
global.glob = {}

glob.modules =
  assert: assert = require 'assert'
  request: request = require '../node_modules/request'
  socket: require '../node_modules/socket.io'
  socket_client: require '../node_modules/socket.io-client'
  child_process: require('child_process')

glob.config = require '../app/config'

testCompanyId = 'test_company'

Socket = null
server = null

sendMessage = (action, cb)->
  req =
    url: glob.config.app.host + ':' + glob.config.app.port + '/message/' + testCompanyId
    method: 'POST'
    json: true
    body:
      secret: glob.config.app.secret
      message:
        action: action
  request req, (err, response, body)->
    cb err, response, body if cb

describe 'server', ->
  it 'start', (done)->
    server = glob.modules.child_process.spawn 'node', ['run.js'], {env: process.env}
    server.stdout.on 'data', (data)->
      data = data.toString()
      process.stdout.write data
      if data is 'listen' or data is 'listen\n'
        assert true
        done()
    server.stderr.on 'data', (data)->
      process.stdout.write data.toString()

describe 'test http api server', ->
  it 'room creation', (done)->
    req =
      url: glob.config.app.host + ':' + glob.config.app.port + '/company/' + testCompanyId
      qs:
        secret: glob.config.app.secret
    request req, (err, response, body)->
      assert !err, err
      assert response.statusCode is 200, 'statuscode: ' + response.statusCode
      assert body
      done()

  it 'send message', (done)->
    sendMessage 'anyaction', (err, response, body)->
      assert !err, err
      assert response.statusCode is 200, 'statuscode: ' + response.statusCode
      assert body
      done()

describe 'test socket server', ->
  io = null
  io2 = null
  url = glob.config.app.host + ':' + glob.config.app.port + '/company/' + testCompanyId
  options =
    'force new connection': true

  it 'connect to room', (done)->
    io = glob.modules.socket_client.connect url, options
    io.on 'connect', (socket)->
      done()

  it 'check socket join event', (done)->
    io.on 'join', ->
      done()
    io2 = glob.modules.socket_client.connect url, options
  #io2.on 'connect', ->

  it 'check intuit-connected event', (done)->
    r1 = false
    r2 = false
    io.on 'intuit-connected', ->
      r1 = true
      done() if r2
    io2.on 'intuit-connected', ->
      r2 = true
      done() if r1
    sendMessage 'intuit-connected'

after (done)->
  server.kill()
  done()
