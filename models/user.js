var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var userSchema = mongoose.Schema(
  {
    password:{
      type:String
    },
    username:{
      type:String
    },
    type:{
      type:String
    }
  }
);


var User = module.exports = mongoose.model('User',userSchema);

module.exports.createUser = function(newUser,callback){
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
    });
});
}
module.exports.getUserByUsername = function(username,callback){
  var query = {username:username};
  User.findOne(query,callback);
}
module.exports.getUserByUsernameOrEmail = function(username,callback){
  User.find({$or:[{username:username}]},callback);
}
module.exports.getUserById = function(id,callback){
  User.findById(id,callback);
}
module.exports.comparePassword = function(candidatePassword,hash,callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      if(err)
        throw err;
      callback(null,isMatch);
  });
}
module.exports.getAllUsers = function(callback){
  User.find({"type":"basic"},{"username":1},callback);
}
