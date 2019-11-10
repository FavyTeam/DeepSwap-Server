const execa = require('execa');

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

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
                var is_exist = false

                // console.log("_id => ", user._id)
                // console.log("username => ", user.username)


                for (var i =0; i < users.length; i++){
                    if (users[i].userData._id === user._id){
                        is_exist = true
                    }
                }

                if (is_exist == false){
                    var data = {
                        userData : user,
                        socketData : socket
                    }
    
                    users[user._id] = data

                    // console.log(users)

                    console.log("New user connected => ", user.username)
                }else{
                    console.log("User already existed => ", user.username)
                }
            })

            socket.on('disconnected', function(user){

                if (users[user._id] == undefined){
                    console.log(user.username + " user already offline")
                }else{
                    console.log("user offline => ", user.username)
                    delete users[user._id]

                    console.log("user data => ", users)
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
                
                var data = {
                    "result" : room
                }

                console.log("Room => ", JSON.stringify(data))
                rooms[room.key] = room

                if (users[room.receiver_id] == undefined){
                    // user not existed
                    // timer1 = setInterval(function(){
                    //     users[room.receiver_id].socketData.emit('ask_join', room)  // ask join serveral times every 500ms
                    //     console.log(room.sender_username + " ask to join " + room.key + " with " + room.receiver_username + " user")
                    // }, 100)
                    console.log(room.receiver_username + " user is offline")
                }else{
                    // user existed
                    users[room.receiver_id].socketData.emit('ask_join', JSON.stringify(data))  // ask join serveral times every 500ms
                    console.log(room.sender_username + " ask to join " + room.key + " with " + room.receiver_username + " user")
                }
            })

            socket.on('close_meeting', function(roomKey){
                console.log('close room: ', roomKey)
                delete rooms[roomKey]
            })

            socket.on('join_meeting', function(room){

                console.log('join room: ', room.key)

                // clearInterval(timer1)   // Stop send messages

                if (rooms[room.key] == undefined){
                    // Room is closed
                    console.log("Room is closed => ", room.key)

                    if (users[room.sender_id] == undefined){
                        console.log(room.sender_username + " user is offline")
                    }else{
                        users[room.sender_id].socketData.emit('closed')
                    }

                    if (users[room.receiver_id] == undefined){
                        console.log(room.receiver_username + " user is offline")
                    }else{
                        users[room.receiver_id].socketData.emit('closed')
                    }
                }else{
                    // Awaiting video call
                    // ffmpeg run

                    // var param1 = room.receiver_live_url.substring(room.receiver_live_url.lastIndexOf('/') + 1) + ".m3u8"
                    // var param2 = room.sender_live_url.substring(room.sender_live_url.lastIndexOf('/') + 1) + ".m3u8"

                    // console.log("Real link => ", room.receiver_live_url, room.sender_live_url)
                    // console.log("m3u8 link => ", param1, param2)

                    // var command_url1 = "-fflags nobuffer " + param1 + " -loglevel verbose"
                    // var command_url2 = "-fflags nobuffer " + param2 + " -loglevel verbose"
                    
                    // execa('ffplay', [command_url1]).stdout.pipe(process.stdout)
                    // execa('ffplay', [command_url2]).stdout.pipe(process.stdout)
                    
                    if (users[room.sender_id] == undefined){
                        console.log(room.sender_username + " user is offline")
                    }else{
                        users[room.sender_id].socketData.emit('joined', room.receiver_live_url)
                        console.log("Joined now, let start the call!", room.receiver_live_url)
                    }

                    if (users[room.receiver_id] == undefined){
                        console.log(room.receiver_username + " user is offline")
                    }else{
                        users[room.receiver_id].socketData.emit('joined', room.sender_live_url)
                        console.log("Joined now, let start the call!", room.sender_live_url)
                    }
                }
            })


            console.log('user connection on port ' + PORT + ' : ' + socket.id)
        })
    }
}