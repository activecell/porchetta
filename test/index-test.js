require('..');

var expect  = require('chai').expect;
var _       = require('underscore');
var connect = require('./support/connect');
var bertCooper, rogerSterling, peteCampbell;

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
