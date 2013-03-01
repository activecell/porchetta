config =
  app:
    port: process.env.PORT or 5300
    secret: "somesecretstring"
    secret2: "this is a secret!"
    host: "http://porchetta.activecell.net"
    socketUrl: "http://porchetta.activecell.net:80/"

if process.env.NODE_ENV is "production"
  config.app.host = "http://porchetta.activecell.com"
  config.app.socketUrl = "http://porchetta.activecell.net:com"

else if process.env.NODE_ENV is "testing"
  config.app.port = 3900
  config.app.host = "http://localhost"
  config.app.socketUrl = "http://localhost:#{config.app.port}/"

module.exports = config
