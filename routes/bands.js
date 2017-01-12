var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var Bands = require('../models/bands.js');
var BandModel = mongoose.model("Bands");
var multer = require('multer');
var mkdirp = require('mkdirp');
var aws = require('aws-sdk');
var multerS3 = require('multer-s3');
var S3FS = require('s3fs');
aws.config.loadFromPath('./config/config.json');
var s3 = new aws.S3({
  params:{Bucket:'bbmusicstore2'}});
function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length && obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

router.get('/search',ensureAuthenticated,function(req,res){
  var query = req.query.name;
  var page = req.query.page || 0;
  var limit = 5;
  var skip = page * limit;
  Bands.getBandsName(query,function(err,bands){
    if(err)
    {
      throw err;
      //res.render('error',{errMsg:err});
    }
    else{
        res.send({bands:bands});
      }
    }
  );
});
router.get('/',ensureAuthenticated,function(req,res){
  var page = req.query.page || 0;
  var limit = 5;
  var skip = page * limit;
  var query = req.query.name;
  if(typeof(query) == "undefined")
  {
    Bands.countBands(function(err,count){
      Bands.getBandsName(query,function(err,bands){
        if(err)
        {
          throw err;
          //res.render('error',{errMsg:err});
        }
        else{
            res.render('bands',{arr:bands,page:page,count:count,skipped:skip});
          }
        }
      ,skip,limit);
    });
  }
  else{
    Bands.getBandsName(query,function(err,bands){
      if(err)
      {
        throw err;
        //res.render('error',{errMsg:err});
      }
      else{
          if(bands!=null)
          count = bands.length;
          res.render('bands',{arr:bands,page:page,count:count,skipped:skip});
        }
      }
    ,skip);
  }

});
router.get('/add',ensureAuthenticated,function(req,res){
  res.render('add');
});
router.post('/delete',ensureAuthenticated,function(req,res){
  var id = req.body.id;
  Bands.removeBands(id,function(err,callback){
    if(err)
    {
      throw err;
    }
    else{
      res.redirect('/bands');
    }
  });
});
router.post('/add',ensureAuthenticated,function(req,res){

  var upload = multer({
  limits:{fileSize:52428800},
  storage: multerS3({
  s3:s3,bucket:'bbmusicstore2',
  acl:'public-read',
  metadata: function (req, file, cb) {
    var fieldName = file.fieldName || "";
    cb(null, {fieldName: fieldName});
  },
  key: function (req, file, cb) {
    var ext = path.extname(file.originalname) || "";
    cb(null,Date.now().toString());
  },
})}).single('Logo');
  upload(req,res,function(err)
  {
    var newBand = new BandModel({
      name:req.body.name,
      bestSellingAlbum:req.body.bestSellingAlbum,
      yearsActive:req.body.yearsActive,
      numberOfReleasedAlbums:req.body.numberOfReleasedAlbums,
      membersCount:req.body.membersCount
    });
    if(err)
    {
      throw err;
    }
    else{
          newBand.image='https://s3-eu-west-1.amazonaws.com/bbmusicstore2/' +req.file.key;
          Bands.addBands(newBand,function(err,createdBand){
            if(err)
            {
              res.json(err.message);
              //res.render('error',{errMsg:err});
            }
            else{
              res.redirect('/bands/'+createdBand._id);
            }
          });
    }
  });
});
router.get('/:id',function(req,res){
  var id = req.params.id;
  Bands.getBandsById(id,function(err,band){
    if(err)
    {
      throw err;
      //res.render('error',{errMsg:err});
    }
    else{
      res.render('bandhome',{band:band});
    }
  });
});
module.exports = router;
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated())
  {
      return next();
	}
		res.redirect('/users/login');
}
