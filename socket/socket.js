var http = require('http');

module.exports = {
    connect : function(io, PORT){
        var rooms = {}
        var users = {}
        var timer1 = null
        var timer2 = null

        io.on('connection', (socket) => {

            /*
            User Information
                _id : String
                username : String
            */
            socket.on('connected', function(user){
                var data = {
                    userData : user,
                    socketData : socket
                }

                users[user._id] = data
            })

            socket.on('disconnected', function(user){
                for (var i =0; i < users.length; i++){
                    var userInfo = users[i]

                    if (userInfo.userData._id === user._id){
                        users.splice(i,1)
                    }
                }
            })
           
            /*
            Room Info
                key                 -   require
                sender_id               -   require
                sender_username         -   require
                sender_live_url         -   require
                receiver_id             -   require
                receiver_username       -   require
                receiver_live_url       -   optional
            */

            socket.on('create_room', function(room){
                console.log('create room: ', room.key)
                rooms[room.key] = room

                for (var i =0; i < users.length; i++){
                    var userInfo = users[i]

                    if (userInfo.userData._id === room.receiver_id){
                        timer1 = setInterval(function(){
                            userInfo.socketData.emit('ask_join', room)  // ask join serveral times every 500ms
                        }, 500)
                        return
                    }
                }
            })

            socket.on('close_meeting', function(roomKey){
                console.log('close room: ', roomKey)
                delete rooms[roomKey]
            })

            socket.on('join_meeting', function(room){
                console.log('join room: ', room.key)

                clearInterval(timer1)   // Stop send messages

                if (rooms[room.key] == undefined){
                    // Room is closed
                    for (var i =0; i < users.length; i++){
                        var userInfo = users[i]
    
                        if (userInfo.userData._id === room.sender_id){
                            userInfo.socketData.emit('closed')
                        }
                        if (userInfo.userData._id === room.receiver_id){
                            userInfo.socketData.emit('closed')
                        }
                    }
                }else{
                    // Awaiting video call
                    for (var i =0; i < users.length; i++){
                        var userInfo = users[i]
    
                        if (userInfo.userData._id === room.sender_id){
                            userInfo.socketData.emit('joined', room)
                            return
                        }
                    }
                }
            })


            console.log('user connection on port ' + PORT + ' : ' + socket.id)
        })
    }
}