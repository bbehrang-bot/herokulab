var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var Cart = require('../models/cart.js');
var Order = require('../models/orders.js');
router.get('/',ensureAuthenticated,function(req,res){
  if(!req.session.cart || req.session.cart.totalPrice == 0)
  {
    res.render('error/somethingwrong',{error:"Your cart is empty"});
  }
  else{
    var cart = new Cart(req.session.cart);
    res.render('checkout/checkout',{total:cart.totalPrice || 0});
  }

});
router.post('/',ensureAuthenticated,function(req,res){
  if(!req.session.cart || req.session.cart.totalPrice == 0)
  {
    res.render('error/somethingwrong',{error:"Your cart is empty"});
  }
  else{
    var cart = new Cart(req.session.cart);
    var stripe = require("stripe")(
      "sk_test_Bu3udwRjvjKZpCIYWvAhka8p"
    );

    stripe.charges.create({
      amount: cart.totalPrice * 100,
      currency: "usd",
      source: req.body.stripeToken, // obtained with Stripe.js
      description: "Student project payment test"
    }, function(err, charge) {
      if(err)
      {
        res.render('error/somethingwrong',{error:err});
      }

      else{
        var order = new Order({
          user: req.user,
          cart : cart,
          name:req.body.name,
          paymentId : charge.id
        });
        Order.saveOrder(order,function(err,callback){
          if(err)
          {
              res.render('error/somethingwrong',{error:"Payment was made but there was a problem saving the order, please contact the administrator with your info in order to recieve your products."});
          }
          else
          {
            req.session.cart = {};
            res.render('checkout/successfull');
          }
        });

      }
    });
  }

});
module.exports = router;
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
    req.session.OldUrl = '/checkout';
		res.redirect('/users/login');
}
