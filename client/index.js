/**
 * Local variables.
 */

var io = require('socket.io');
var active = false;
var collections = {};
var socket;

/**
 * Expose `connect` and `add` methods.
 */

exports.connect = connect;
exports.add     = add;

/**
 * Connect to porchetta server by `url`
 * and join selected `room`.
 *
 * Example:
 *
 *   porchetta.connect(http://localhost:4000, app.company.id);
 *
 * @param {String} url
 * @param {String} room
 */

function connect(url, room) {
  socket = io.connect(url);
  socket.on('viewers', viewers);
  socket.on('sync', sync);

  // join room
  socket.on('connect', function() {
    socket.emit('room', room);
  });
}

/**
 * Observe `collection`.
 * Collection's instance should have property name.
 *
 * Example:
 *
 *   porchetta.add(app.vendors);
 *   porchetta.add(app.accounts);
 *
 * @param {Backbone.Collection} collection
 */

function add(collection) {
  var name = collection.name;
  if (!name || collections[name]) throw new TypeError('Collection should have unique name attribute');

  collections[name] = collection;
  collection.on('add', emit('add', name));
  collection.on('change', emit('change', name));
  collection.on('remove', emit('remove', name));
}

/**
 * Emit sync event on every collection change.
 * Helps to manage `add`, `change`, and `remove` events.
 */

function emit(event, name) {
  return function(model, collection, options) {
    if (!active) return; // return if only one viewers
    if (!options) options = collection; // for change event
    if (options.socketId) return; // prevent updates after sync

    socket.emit('sync', {
      collection: name,
      event: event,
      socketId: socket.socket.sessionid,
      json: model.toJSON()
    });
  };
}

/**
 * Handles `sync` event to update collection based on received data.
 */

function sync(data) {
  var model, collection = collections[data.collection];

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
}

/**
 * Handles `viewers` event to change active flag.
 */

function viewers(data) {
  active = data.length > 1;
  if (active)
    console.log('Porchetta is active for ' + data.length + ' viewers');
  else
    console.log('Porchetta is inactive');
}
