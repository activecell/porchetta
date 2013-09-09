# Porchetta Server [![Build Status](https://circleci.com/gh/activecell/porchetta-server.png?circle-token=e4e94a5aa232fb270ea22a5f32a34e3db5e75b61)](https://circleci.com/gh/activecell/porchetta-server)

  A bad-ass socket server for activecell.

Development
-----------

  Use [History.md](https://github.com/activecell/porchetta/blob/master/History.md) and versions to log your actions.

### One minute setup

  * `npm install` - to install dependencies
  * `npm test` - to run tests and ensure that all pass.
  * `npm run watch` - to start development server locally on http://localhost:4000. It restarts on every change.

### Deploy

  In order to deploy you need install [jitsu](https://github.com/nodejitsu/jitsu) locally (`npm install -g jitsu`) and login as activecell user (ask @adamrneary for password).

    $ ./script/deploy-production
    $ ./script/deploy-staging

  This scripts helps to manage ugly nodejitsu restrictions: (rewrite of package.json, and not ability to deploy staging.) Nodejitsu does not support node 0.10.x, be careful. (Why do we use nodejitsu? Because they only one option, heroku sucks with websoket support.)

API
---

  It's so easy to start server `npm install && npm start`. Server accepts 2 additional params:

  * PORT - [default: 4000] server's port
  * ORIGIN - [default: headers.origin] use to set http origin header on handshake with activecell server.

```bash
ORIGIN="http://localhost:4001" PORT=5000 npm start
```
