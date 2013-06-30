/**
 * Local variables.
 */

var io   = require('socket.io');
var bind = require('bind');

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
  this.collections = {};
  this.socket      = io.connect(url);
  this.socket.on('connect', bind(this.socket, 'emit', 'room', room));
  this.socket.on('sync', sync(this.collections));
}

/**
 * Observe `collection`.
 * Collection's instance should have property name.
 *
 * Example:
 *
 *   porchetta
 *     .add(app.vendors)
 *     .add(app.accounts)
 *     .add(app.stages);
 *
 * @param {Backbone.Collection} collection
 */

Porchetta.prototype.add = function(collection) {
  this.collections[collection.name] = collection;
  collection.on('add', emit('add', collection, this.socket));
  collection.on('change', emit('change', collection, this.socket));
  collection.on('remove', emit('remove', collection, this.socket));
  return this;
};


/**
 * Emit sync event on every collection change.
 * Helps to manage `add`, `change`, and `remove` events.
 */

function emit(event, collection, socket) {
  return function(model, collection, options) {
    if (!options) options = collection; // for change event
    if (options.socketId) return; // prevent sync updates

    socket.emit('sync', {
      collection: collection.name,
      event: event,
      socketId: socket.socket.sessionid,
      json: model.toJSON()
    });
  };
}

/**
 * Helper to handle sync event and update collection based on received data.
 */

function sync(collections) {
  return function(event, data) {
    var collection = collections[data.collection], model;

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
  };
}
