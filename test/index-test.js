require('../lib');

const io      = require('socket.io-client');
const expect  = require('chai').expect;
const _       = require('underscore');

function timeout(cb) {
  return _.delay(cb, 20);
}

function connect(next) {
  const socket = io.connect('http://localhost:4000/', { 'force new connection': true });
  socket.on('connect', next);
  return socket;
}

describe('Porchetta', function(){
  var bertCooper, rogerSterling, peteCambell;

  beforeEach(function(done) {
    var next = _.after(3, function() {
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
    bertCooper.emit('sync', { collection: 'vendors', event: 'add', json: { id: 1, name: 'test' } });

    rogerSterling.on('sync', function(data) {
      expect(data.collection).equal('vendors');
      expect(data.event).equal('add');
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

  it('emits `viewers` event after join', function(done) {
    peteCambell.emit('room', 1);
    var next = _.after(3, done);

    bertCooper.on('viewers',    function(data) { expect(data).length(3); next(); });
    rogerSterling.on('viewers', function(data) { expect(data).length(3); next(); });
    peteCambell.on('viewers',   function(data) { expect(data).length(3); next(); });
  });

  it('emits `viewers` on disconnect', function(done) {
    rogerSterling.disconnect();

    bertCooper.on('viewers', function(data) {
      expect(data).length(1);
      timeout(done);
    });

    peteCambell.on('viewers', function() {
      done('error: it emits only in related room');
    });
  });

  afterEach(function() {
    bertCooper.disconnect();
    rogerSterling.disconnect();
    peteCambell.disconnect();
  });
});
