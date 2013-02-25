app = glob.app

app.get '/company/:companyId', (req, res)->
  companyId = req.params.companyId

  console.log 'get room', companyId
  # TODO enable secret string check
  unless glob.rooms[companyId]
    console.log 'create room'
    glob.rooms[companyId] = new glob.room
      company: companyId
  else
    console.log 'room exist'
  if req.query.callback
    res.header "Content-Type", "application/json"
    res.header "Charset", "utf-8"
    res.send req.query.callback + '()'
  else
    res.send 200

#curl -v -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"message":{"action":"intuit-connected"}}' http://porchetta.herokuapp.com/message/sterlingcooper
app.post "/message/:companyId", (req, res) ->
  console.log req.body
  if req.body.secret is glob.config.app.secret
    companyId = req.params.companyId
    message = req.body.message
    if glob.rooms[companyId] and message
      glob.rooms[companyId].send message
    res.send 200
  else
    res.send 401

app.post '*', (req, res)->
  console.log '*', req.url

app.get '*', (req, res)->
  console.log '*', req.url
