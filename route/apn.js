var apn = require('apn')
var fs = require('fs')

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
    var note = new apn.Notification();

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.sound = "ping.aiff";
    note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
    note.payload = {'messageFrom': 'John Appleseed'};
    note.topic = "com.pie.hscrollview";

    console.log("deviceToken => ", req.body.deviceToken)

    apnProvider.send(note, req.body.deviceToken).then( (result) => {
        // see documentation for an explanation of result
        res.status(201).json(result)
    });
}