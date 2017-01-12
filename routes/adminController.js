var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

router.get('/register',function(req,res)
{
  res.render('admin/register');
});
router.post('/register',function(req,res)
{
  var name = req.body.name;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;
  req.checkBody('name','Name is required').notEmpty();
  req.checkBody('username','username is required').notEmpty();
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('email','Email is not valud').isEmail();
  req.checkBody('password','password is required').notEmpty();
  req.checkBody('password2','Passwords do not match').notEmpty();
  var errors = req.validationErrors();
  if(errors)
    res.render('admin/register',{errors : errors});
  else{
  User.getUserByUsernameOrEmail(username,email,function(err,userDb){
    if(err)
    {
      throw err;
    }
    else{
      var len = userDb.length;
      if(len != 0)
      {
        for(var i=0;i<len;i++)
        {
          if(username == userDb[i].username)
          {
            req.flash('error_msg','username is in use');
            res.redirect('register');
            break;
          }
          if(email == userDb[i].email)
          {
            req.flash('error_msg','email is in use');
            res.redirect('register');
            break;
          }
        }
      }
      else
      {

        var newUser = new User({
          name:name,
          email:email,
          username:username,
          password:password,
          type:"admin"
        });
        User.createUser(newUser,function(err,user){
          if(err)
            throw err;
            req.flash('success_msg','You are registered and can now login');
            res.redirect('/users/login');
        });
      }
      }
    });
  }

});
module.exports = router;
