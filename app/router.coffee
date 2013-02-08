app = glob.app

app.get '/company/:companyId', (req,res)->
    console.log 'get room', req.params.companyId
    if req.query.secret is glob.config.app.secret
        unless glob.rooms[req.params.companyId]
            console.log 'create room'
            glob.rooms[req.params.companyId] = new glob.room
                company: req.params.companyId
        else
            console.log 'room exist'
        if req.query.callback
            res.header "Content-Type", "application/json"
            res.header "Charset", "utf-8"
            res.send req.query.callback+'()'
        else
            res.send 200
    else
        res.send 401

#curl -v -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"message":{"action":"intuit-disconnect"}}' http://porchetta.herokuapp.com/message/sterlingcooper
app.post "/message/:companyId", (req, res) ->
    if req.body.secret is glob.config.app.secret
        companyId = req.params.companyId
        message = req.body.message
        if glob.rooms[companyId] and message
            glob.rooms[companyId].send message
        res.send 200
    else
        res.send 401

app.post '*', (req,res)->
    console.log '*', req.url

app.get '*', (req,res)->
    console.log '*', req.url

