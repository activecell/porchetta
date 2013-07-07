# Porchetta [![Build Status](https://circleci.com/gh/activecell/porchetta.png?circle-token=e4e94a5aa232fb270ea22a5f32a34e3db5e75b61)](https://circleci.com/gh/activecell/porchetta)

  A bad-ass socket server for activecell. It does not require specific observers on rails side and sync any type of data.
  Also it provides client, that syncs instances of Backbone.Collection or Backbone.Model.

## Start server

  It's so easy: `npm install && npm start`. Server accepts 2 additional params:

  * PORT - [default: 4000] server's port
  * ORIGIN - [default: headers.origin] use to set http origin header on handshake with activecell server.

```bash
ORIGIN="http://localhost:4001" PORT=5000 npm start
```

## Installation

  Copy [client/index.js](https://github.com/activecell/porchetta/blob/master/client/index.js) and [socket.io-client.js](https://github.com/LearnBoost/socket.io-client/blob/0.9/dist/socket.io.js) to your vendor folder.

## Example

  Assume you started porchetta-server on http://localhost:4000 with `npm start`.

```coffee
porchetta = new Porchetta('http://localhost:4000', app.company.id);

# Watch collections
porchetta
  .addCollection(app.vendors, 'vendors')
  .addCollection(app.tasks, 'tasks')
  .addCollection(app.accounts, 'accounts')
  .addModel(app.company, 'company')
  .addModel(app.user, 'user')

porchetta.on 'connect', ->
  console.log('connected to the server')

porchetta.on 'viewers', (viewers) ->
  if viewers.length > 1
    console.log('Porchetta is active for ' + viewers.length + ' viewers');
  else
    console.log('Porchetta is inactive');

# Porchetta emits event after every sync with pattern: <name>:<event>
porchetta.on 'vendors:add',     (json) -> console.log('new vendor added', json)
porchetta.on 'tasks:change',    (json) -> console.log('task changed', json)
porchetta.on 'accounts:remove', (json) -> console.log('account removed', json)
```

## API

  In general porchetta-client is wrapper around [socket.io-client](https://github.com/LearnBoost/socket.io-client).
  Porchetta starts to work when has more than one connected user.

### new Porchetta(url, room, [socketIoOptions])

  Connect to porchetta server, that started on `url`, and join selected `room`.
  `socketIoOptions` is an optional parameter with [specific options for socket.io](https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO).

### Events

  Porchetta's instance is event emiiter. Subscribe to specific events with `on` and `once` methods

```coffee
porchetta.on 'connect', ->
  console.log('connected to the server')
```

  Available events (for more examples, check [test suite](https://github.com/activecell/porchetta/blob/master/test/client/index-test.js)):

  * `connect` - after succesfull connect.
  * `viewers` - someone connected or disconnected.
  * `<name>:<event>` - after sync event.

### porchetta#addCollection(collection, name)

  Sync Backbone.Collection events: `add`, `change`, `remove`. Make sure that `name` is unique identificator.

### porchetta#addModel(model, name)

  Sync Backbone.Model instance through porchetta-server. It tracks `change` and `destroy` event. Logic is similar to `addCollection`.

## One minute setup

  * `badass bootstrap` - to check requirements with [badass](https://github.com/activecell/badass) tool.
  * `npm test` - to run tests to ensure that all pass.
  * `npm start` - to start server locally on http://localhost:4000.
