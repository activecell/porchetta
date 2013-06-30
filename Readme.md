[![Build Status](https://circleci.com/gh/activecell/porchetta.png?circle-token=e4e94a5aa232fb270ea22a5f32a34e3db5e75b61)](https://circleci.com/gh/activecell/porchetta)

# Porchetta

  A bad-ass socket server for activecell. It does not require specific observers on rails side and sync data from [/bootstrap.json](https://github.com/activecell/activecell/blob/master/app/views/home/bootstrap.json.erb) and the [initial app bootstrap](https://github.com/activecell/activecell/blob/master/app/views/home/index.html.erb).

  Also it provides client that integrates with [socket.io-client](https://github.com/LearnBoost/socket.io-client) and sync Backbone.Collection instances.

## Installation

  Copy [client/index.js](https://github.com/activecell/porchetta/blob/master/client/index.js) and [socket.io-client.js](https://github.com/LearnBoost/socket.io-client/blob/0.9/dist/socket.io.js) to your vendor folder.

## Example

  Assume you started porchetta on http://localhost:4000 with `npm start`.

```js
var Porchetta = require('porchetta');

// Connect to socket server
var porchetta = new Porchetta('http://localhost:4000', app.company.id);

// Watch collections
porchetta
  .add(app.vendors)
  .add(app.tasks)
  .add(app.accounts);

porchetta.on('connect', function() {
  console.log('connected to the server');
});

porchetta.on('viewers', function(viewers) {
  if (viewers.length > 1)
    console.log('Porchetta is active for ' + viewers.length + ' viewers');
  else
    console.log('Porchetta is inactive');
})

// Porchetta emits event after every sync with pattern: <collection-name>:<event>
porchetta.on('vendors:add', function(json) { console.log('new vendor added', json); });
porchetta.on('tasks:change', function(json) { console.log('task changed', json); });
porchetta.on('accounts:remove', function(json) { console.log('account removed', json); });
```

## One minute setup

  * `badass bootstrap` - to check requirements with [badass](https://github.com/activecell/badass) tool.
  * `npm test` - to run tests to ensure that all pass.
  * `npm start` - to start server locally on http://localhost:4000.
