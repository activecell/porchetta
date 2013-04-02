config =
  app:
    port: process.env.PORT or 80
    secret: "this is a secret!"

switch process.env.NODE_ENV
  when 'production'
    domain = 'porchetta.activecell.com'
  when 'staging'
    domain = 'porchetta.activecell.net'
  when 'development'
    domain = 'localhost'
    config.app.port = 3900
  when 'test'
    domain = 'localhost'
    config.app.port = 3900
  else
    console.warn "unknown NODE_ENV: #{process.env.NODE_ENV}"

config.app.host = "http://#{domain}"
config.app.socketUrl = "http://#{domain}:#{config.app.port}/"

module.exports = config
