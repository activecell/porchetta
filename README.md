# Porchetta

  A bad-ass socket server for activecell.
  It does not require specific observers on rails side and sync data from /bootstrap.json and the [initial app bootstrap](https://github.com/activecell/activecell/blob/master/app/views/home/index.html.erb).

## Installation

  Check your system for local requirements with [badass](https://github.com/activecell/badass) tool:

    badass bootstrap

## Example

```coffee
socket = io.connect('http://localhost:4000')

socket.on 'connect', ->
  socket.on('sync', syncData)
  socket.join(app.company.id)
```

## Development

  * `npm test` - to run tests to ensure that all pass:
  * `npm start` - to run the project locally

## TODO

  * activecell: add handshake url: /api/v1/handshake.json that returns 204 or 403 + correct cookie passing
  * client: handle sync event and network problems (request bootstrap.json)
