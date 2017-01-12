var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var Bands = require('../models/bands.js');
var BandModel = mongoose.model("Bands");
router.get('/',function(req,res){
  var band = req.query;
  Bands.getBands(band,function(err,bands){
    if(err)
    {
      throw err;
      //res.render('error',{errMsg:err});
    }
    else{
      res.json(bands);
    }
  });
});

router.get('/:id',function(req,res){
  var id = req.params.id;
  Bands.getBandsById(id,function(err,bands){
    if(err)
    {
      res.json(err.message);
      //res.render('error',{errMsg:err});
    }
    else{
      res.json(bands);
    }
  });
});
router.post('/add',function(req,res){
  var band = req.body;
  Bands.addBands(band,function(err,createdBand){
    if(err)
    {
      res.json(err.message);
      //res.render('error',{errMsg:err});
    }
    else{
      res.json(createdBand);
    }
  });
});
router.delete('/delete/:id',function(req,res){
  var id = req.params.id;
  Bands.removeBands(id,function(err,deleted){
    if(err)
    {
      res.json(err.message);
    }
    else{
      res.json(deleted);
    }
  });
});
module.exports = router;
