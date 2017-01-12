var mongoose = require('mongoose');
var bandsSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  bestSellingAlbum:{
    type:String
  },
  yearsActive:{
    type:Date,
    required:true,
    Default:Date.now()
  },
  numberOfReleasedAlbums:{
    type:Number,
    Default:0
  },
  membersCount:{
    type:Number,
    Default:0
  },
  image:{
    type:String
  }
});
var Bands = module.exports =  mongoose.model('Bands',bandsSchema);
//Get artist funcs
module.exports.countBands = function(callback){
   Bands.count(callback);
}
module.exports.getBands = function(query,callback,skip,limit){
  Bands.find(query,callback).limit(limit).skip(skip);
}
module.exports.getBandsById = function(id,callback){
  Bands.findById(id,callback);
}

//
//Priority Related funcs
//
//Search related funcs
module.exports.getBandsName = function(name,callback,skip,limit){
  if(name)
  {
    var query = {'name' : new RegExp('^'+name,"i")}
  }
  Bands.find(query,callback).limit(limit).skip(skip);
}
//
///CRUD related funcs
//add
module.exports.addBands = function(band,callback){
  Bands.create(band,callback);
}
//
//Edit

module.exports.updateOrInsertArtist = function(id,artist,callback){
  var query = {_id :id };
  var options= {};
  var update = {'$set' :artist};
  Bands.findOneAndUpdate(query,update,options,callback);
}
//
//delete
module.exports.removeBands = function(id, callback){
  var query = {_id: id};
  Bands.remove(query, callback);
};
