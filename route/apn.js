var apn = require('apn')
var fs = require('fs')
var _auth = require('./userRole')

var options = {
    token: {
      key: fs.readFileSync('./certification/AuthKey_CPC79T65QP.p8'),
      keyId: "CPC79T65QP",
      teamId: "GU3Z9XQ7M6"
    },
    production: false
};

var apnProvider = new apn.Provider(options)

module.exports.sendNotification = async function(req, res){

    console.log(req.body)

    var userInfo = await _auth.get_user_by_name(req.body.receiver)  // Get receiver Data

    console.log(userInfo)

    var note = new apn.Notification();

    note.expiry = Math.floor(Date.now() / 1000) + 15; // Expires 15 secs from now.
    note.sound = "ping.aiff";
    note.alert = req.body.sender + " is waiting you to accept call now!";
    note.payload = {'messageFrom': req.body.sender};
    note.topic = "com.pie.hscrollview";

    console.log("deviceToken => ", userInfo.deviceToken)

    apnProvider.send(note, userInfo.deviceToken).then( (result) => {
        // see documentation for an explanation of result
        res.status(201).json(result)
    });
}