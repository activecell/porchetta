# Porchetta [![Build Status](https://circleci.com/gh/activecell/porchetta.png?circle-token=e4e94a5aa232fb270ea22a5f32a34e3db5e75b61)](https://circleci.com/gh/activecell/porchetta)

  A bad-ass socket server for activecell. It does not require specific observers on rails side and sync data from [/bootstrap.json](https://github.com/activecell/activecell/blob/master/app/views/home/bootstrap.json.erb) and the [initial app bootstrap](https://github.com/activecell/activecell/blob/master/app/views/home/index.html.erb).

  Also it provides client that integrates with [socket.io-client](https://github.com/LearnBoost/socket.io-client) and sync Backbone.Collection instances.

## Installation

  Copy [client/index.js](https://github.com/activecell/porchetta/blob/master/client/index.js) and [socket.io-client.js](https://github.com/LearnBoost/socket.io-client/blob/0.9/dist/socket.io.js) to your vendor folder.

## Example

  Assume you started porchetta on http://localhost:4000 with `npm start`.

```coffee
porchetta = new Porchetta('http://localhost:4000', app.company.id);

# Watch collections
porchetta
  .add(app.vendors, 'vendors')
  .add(app.tasks, 'tasks')
  .add(app.accounts, 'accounts')

porchetta.on 'connect', ->
  console.log('connected to the server')

porchetta.on 'viewers', (viewers) ->
  if viewers.length > 1
    console.log('Porchetta is active for ' + viewers.length + ' viewers');
  else
    console.log('Porchetta is inactive');

# Porchetta emits event after every sync with pattern: <collection-name>:<event>
porchetta.on 'vendors:add',     (json) -> console.log('new vendor added', json)
porchetta.on 'tasks:change',    (json) -> console.log('task changed', json)
porchetta.on 'accounts:remove', (json) -> console.log('account removed', json)
```

## One minute setup

  * `badass bootstrap` - to check requirements with [badass](https://github.com/activecell/badass) tool.
  * `npm test` - to run tests to ensure that all pass.
  * `npm start` - to start server locally on http://localhost:4000.
