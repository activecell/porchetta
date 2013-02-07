module.exports = class Room
    constructor: (options)->
        console.log 'init room'
        return console.log 'no options' unless options
        console.log 'company:',options.company
        @room = glob.io.of("/company/#{options.company}")
        @room.on 'connection', (socket)=>
            console.log 'connection'
            socket.broadcast.emit 'join'
        options.callback() if options.callback

    send: (message)->
        console.log 'room send, message:',message
        #try
            #message = JSON.parse(message)
        @room.emit message.action,message
