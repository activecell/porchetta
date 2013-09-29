# Porchetta Server [![Build Status](https://circleci.com/gh/activecell/porchetta.png?circle-token=e4e94a5aa232fb270ea22a5f32a34e3db5e75b61)](https://circleci.com/gh/activecell/porchetta)

  A bad-ass socket server for activecell.
  Use [porchetta-client](https://github.com/activecell/porchetta-client) to work with on client side.

Start Server
---

  It's so easy to start server `npm start`. Server accepts 2 additional params:

  * PORT - [default: 4000] server's port
  * LOG_LEVEL - [default: 1] [socket.io log level](https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO): 1 - warn, 2 - info, 3 - debug

```bash
LOG_LEVEL=3 PORT=5000 npm start
```

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

  This scripts helps to manage ugly nodejitsu restrictions: rewrite of package.json, and not ability to deploy staging. More control can be found on https://webops.nodejitsu.com/apps/porchetta. Available domains:

  * As a production server we use: https://porchetta.activecell.com/
  * As a staging/development server we use: https://porchetta-staging.nodejitsu.com/ (it also can be available at porchetta.activecell.net, but I didn't find valid ssl keys.)
