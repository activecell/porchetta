app = glob.app

app.get '/company/:companyId', (req,res)->
    console.log 'get room', req.params.companyId
    unless glob.rooms[req.params.companyId]
        console.log 'create room'
        glob.rooms[req.params.companyId] = new glob.room
            company: req.params.companyId
    else
        console.log 'room exist'
    res.header "Content-Type", "application/json"
    res.header "Charset", "utf-8"
    res.send req.query.callback+'()'

app.post "/message/:companyId", (req, res) ->
    companyId = req.params.companyId
    message = req.body.message
    console.log companyId
    console.log message
    if glob.rooms[req.params.companyId] and message
        glob.rooms[req.params.companyId].send message
    res.send 200

app.post '*', (req,res)->
    console.log '*', req.url

app.get '*', (req,res)->
    console.log '*', req.url

