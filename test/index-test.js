require('..');

var expect  = require('chai').expect;
var _       = require('underscore');
var connect = require('./support/connect');
var timeout = function(cb) { return _.delay(cb, 20); };
var bertCooper, rogerSterling, peteCambell;

describe('Porchetta', function(){
  beforeEach(function(done) {
    var next = _.after(2, function() {
      bertCooper.emit('room', 1);
      rogerSterling.emit('room', 1);
      peteCambell.emit('room', 2);
      timeout(done);
    });

    bertCooper    = connect(next);
    rogerSterling = connect(next);
    peteCambell   = connect(next);
  });

  it('has `sync` event', function(done) {
    bertCooper.emit('sync', { name: 'vendors', json: { id: 1, name: 'test' } });

    rogerSterling.on('sync', function(data) {
      expect(data.name).equal('vendors');
      expect(data.json).exists;
      timeout(done);
    });

    bertCooper.on('sync', function() {
      done('error: it does not return event back');
    });

    peteCambell.on('sync', function() {
      done('error: it broadcasts only in room with companyId');
    });
  });

  afterEach(function() {
    bertCooper.disconnect();
    rogerSterling.disconnect();
    peteCambell.disconnect();
  });
});
