var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Song = require('../models/songs.js');
var SongModel =  mongoose.model('Song');
var multer = require('multer');


router.get('/',function(req,res)
{
  res.render('ajax');
});
router.get('/products',function(req,res)
{
  res.send({response:"succes"});
});


module.exports = router;
