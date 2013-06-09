var express = require('express');
var http    = require('http');
var app     = express();

app.set('port', process.env.APP_PORT || 4001);
app.get('/api/v1/handshake.json', function(req, res) {
  res.send(204);
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Fake activecell server started on port %d', app.get('port'));
});
