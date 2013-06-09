require('..');

var expect = require('chai').expect;
var _      = require('underscore');
var io     = require('socket.io-client');
var bertCooper, rogerSterling, peteCampbell;

function connect(next) {
  var socket = io.connect('http://localhost:4000/', { 'force new connection': true });
  socket.on('connect', next);
  return socket;
}

describe('Porchetta', function(){
  beforeEach(function(done) {
    var next = _.after(3, done);

    bertCooper    = connect(next);
    rogerSterling = connect(next);
    peteCampbell  = connect(next);
  });

  afterEach(function() {
    bertCooper.disconnect();
    rogerSterling.disconnect();
    peteCampbell.disconnect();
  });

  it('has `sync` event', function() {

  });
});
