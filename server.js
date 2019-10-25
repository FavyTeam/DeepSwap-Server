var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)

// DB CONNECTION
require('./config/db_config');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/www'))

// Avoid CROS
app.all('/*' ,function(req, res, next) {
    res.append("Access-Control-Allow-Origin", ['*']);
    res.append("Access-Control-Allow-Credentials", true);
    res.append("Access-Control-Allow-Headers", 'X-Requested-With, Content-Type');
    res.append("Access-Control-Allow-Methods", "GET, POST","PUT");
    next();
})

var main = require('./route/index')
// route
app.use('/api/v1', main)

let server = http.listen(3000, function(){
    let host = server.address().address
    let port = server.address().port

    console.log("Server listening on : " + host + " port : " + port)

})
