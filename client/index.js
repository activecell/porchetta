/**
 * Local variables.
 */

var io      = require('socket.io');
var bind    = require('bind');
var Emitter = require('emitter');

/**
 * Expose `Porchetta`.
 */

module.exports = Porchetta;

/**
 * Connect to porchetta server by `url`
 * and join selected `room`.
 *
 * Example:
 *
 *   new Porchetta(http://localhost:4000, app.company.id, { 'force new connection': true });
 *
 * @param {String} url
 * @param {String} room
 * @param {Object} options - socket.io-client options
 * @api public
 */

function Porchetta(url, room, options) {
  this.active = false;
  this.colls  = {};
  this.socket = io.connect(url, options);

  this.subscribe('viewers', this.onviewers);
  this.subscribe('sync', this.onsync);

  // join room
  this.subscribe('connect', function() {
    this.socket.emit('room', room);
    this.emit('connect');
  });
}

// Add event-emitter options
Emitter(Porchetta.prototype);

/**
 * Observe `collection`.
 * Collection's instance should have property name.
 *
 * Example:
 *
 *   porchetta
 *     .add(app.vendors);
 *     .add(app.accounts);
 *
 * @param {Backbone.Collection} collection
 * @api public
 */

Porchetta.prototype.add = function(collection) {
  var name = collection.name;
  if (!name || collections[name]) throw new TypeError('Collection should have unique name attribute');

  this.colls[name] = collection;
  collection.on('add', this.handleEvent('add', name), this);
  collection.on('change', this.handleEvent('change', name), this);
  collection.on('remove', this.handleEvent('remove', name), this);

  return this;
};

/**
 * Handles `sync` event to update collection based on received data.
 */

Porchetta.prototype.onsync = function(data) {
  var collection = this.colls[data.collection], model;

  switch (data.event) {
    case 'add':
      collection.add(data.json, { socketId: data.socketId });
      break;

    case 'change':
      model = collection.get(data.json.id);
      if (model) model.set(data.json, { socketId: data.socketId });
      break;

    case 'remove':
      model = collection.get(data.json.id);
      if (model) collection.remove(model, { socketId: data.socketId });
      break;
  }

  this.emit(data.collection + ':' + data.event, data.json);
};

/**
 * Handles `viewers` event to change active flag.
 */

Porchetta.prototype.onviewers = function(data) {
  this.active = data.length > 1;
  this.emit('viewers', data);
};

/**
 * Helper, that emits sync event on every collection change.
 * Helps to manage `add`, `change`, and `remove` events.
 */

Porchetta.prototype.handleEvent = function(event, name) {
  return function(model, collection, options) {
    if (!this.active) return; // return if only one viewer
    if (!options) options = collection; // for change event
    if (options.socketId) return; // prevent updates after sync

    this.socket.emit('sync', {
      collection: name,
      event: event,
      socketId: this.socket.socket.sessionid,
      json: model.toJSON()
    });
  };
};

/**
 * Subscribe on socket.io events and bind callback to current instance.
 */

Porchetta.prototype.subscribe = function(event, cb) {
  this.socket.on(event, bind(this, cb));
};
