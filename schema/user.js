var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username : String,
    deviceToken : String,
    status : Boolean
}); 
  
module.exports = mongoose.model('User', userSchema);