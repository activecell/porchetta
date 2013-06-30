
/**
 * Local variables.
 */

var io = require('socket.io');

/**
 * Expose `Porchetta`.
 */

module.exports = Porchetta;

/**
 * Create `Porchetta` instance.
 *
 * Example:
 *
 *   var porchetta = new Porchetta(http://localhost:4000, app.company.id);
 *
 * @param {String} url
 * @param {String} room
 */

function Porchetta(url, room) {
  var socket = io.connect(options.url);
  socket.on('connect', function() {
    socket.emit('room', options.room);
  });
  socket.on('sync', sync(socket));
}

/**
 * Observe `collection`.
 *
 * @param {Backbone.Collection} collection
 */

Porchetta.prototype.add = function(collection) {
  // body...
};
