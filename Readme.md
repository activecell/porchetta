# Porchetta

  A bad-ass socket server for activecell. It does not require specific observers on rails side and sync data from [/bootstrap.json](https://github.com/activecell/activecell/blob/master/app/views/home/bootstrap.json.erb) and the [initial app bootstrap](https://github.com/activecell/activecell/blob/master/app/views/home/index.html.erb).

  Also it provides client that integrates with [socket.io-client](https://github.com/LearnBoost/socket.io-client) and sync Backbone.Collection instances.

## Installation

  Copy [dist/porchetta.js](https://github.com/activecell/porchetta/blob/master/dist/porchetta.js) to your vendor folder or

    $ component install activecell/porchetta

## Example

  Assume you started porchetta on http://localhost:4000 with `npm start`.

```js
var porchetta = require('porchetta');

// Connect to socket server
porchetta.connect(http://localhost:4000, app.company.id);

// Watch collections
porchetta.add(app.vendors);
porchetta.add(app.accounts);
```

## One minute setup

  * `badass bootstrap` - to check requirements with [badass](https://github.com/activecell/badass) tool.
  * `npm test` - to run tests to ensure that all pass.
  * `npm start` - to start server locally on http://localhost:4000.
