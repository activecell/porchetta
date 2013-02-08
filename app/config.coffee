config =
    app:
        port: process.env.PORT or 5300
        secret: 'somesecretstring'
        host: 'http://porchetta.herokuapp.com'
        socketUrl: 'http://porchetta.herokuapp.com:80/'
    
if process.env.NODE_ENV is 'production'
else if process.env.NODE_ENV is 'testing'
    config.app.port = 3900
    config.app.host = 'http://localhost'
    config.app.socketUrl = "http://localhost:#{config.app.port}/"

module.exports = config
