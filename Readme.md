# Porchetta

  A bad-ass socket server for activecell.
  It does not require specific observers on rails side and sync data from [/bootstrap.json](https://github.com/activecell/activecell/blob/master/app/views/home/bootstrap.json.erb) and the [initial app bootstrap](https://github.com/activecell/activecell/blob/master/app/views/home/index.html.erb).

## One minute setup

  * `badass bootstrap` - to check requirements with [badass](https://github.com/activecell/badass) tool.
  * `npm test` - to run tests to ensure that all pass.
  * `npm start` - to start server locally on http://localhost:4000.

## Example

```coffee
socket = io.connect('http://localhost:4000')

socket.on 'connect', ->
  # join current company rooom
  socket.emit('room', app.company.id)

  # subscribe on all sync updates and handle them with `syncData`
  socket.on('sync', syncData)
```
