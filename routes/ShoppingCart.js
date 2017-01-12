var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
Artist = require('../models/songs.js');
var Cart = require('../models/cart.js');
router.get('/add/:id',function(req,res){
  var id = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart :{});
  Song.getSongById(id,function(err,song){
    if(err)
    {
      res.render('error/somethingwrong',{error:err});
    }
    else{
      cart.add(song,song.id);
      req.session.cart = cart;
      res.send({cart:cart});
    }
  });
});
router.get('/ff/',function(req,res){
  var cart = new Cart(req.session.cart ? req.session.cart :{});
  res.send({cart:cart});
});
router.get('/remove/:id',function(req,res){
  var id = req.params.id;
  console.log(id);
  var cart = new Cart(req.session.cart ? req.session.cart :{});
  Song.getSongById(id,function(err,song){
    if(err)
    {
      res.render('error/somethingwrong',{error:err});
    }
    else{
      cart.remove(song,song.id);
      req.session.cart = cart;
      res.send({cart:cart});
    }
  });
});
router.get('/',function(req,res){
  var cart = new Cart(req.session.cart ? req.session.cart :{});
  var cartArray =cart.generateArray();
  res.send({cart:cartArray,total:req.session.cart.totalPrice});
});






module.exports = router;
