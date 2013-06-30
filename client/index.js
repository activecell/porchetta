;(function(Backbone, _) {
'use strict';

/**
 * Expose `Porchetta`.
 */

window.Porchetta = Porchetta;

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
 */

function Porchetta(url, room, options) {
  this.socket = io.connect(url, options);
  this.active = false;
  this.colls  = {};
  this.subscribe('sync', this.onsync);

  // emit viewers
  this.subscribe('viewers', function(viewers) {
    this.active = viewers.length > 1;
    this.trigger('viewers', viewers);
  });

  // join room
  this.subscribe('connect', function() {
    this.socket.emit('room', room);
    this.trigger('connect');
  });
}

// Add event-emitter options
_.extend(Porchetta.prototype, Backbone.Events);

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
 */

Porchetta.prototype.add = function(collection, name) {
  if (!name || this.colls[name])
    throw new TypeError('Collection should have unique name or already added');

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

  this.trigger(data.collection + ':' + data.event, data.json);
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
  this.socket.on(event, _.bind(cb, this));
};

}).call(this, Backbone, _);
