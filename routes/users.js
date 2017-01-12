var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username,function(err,user){
      if(err)
        throw err;
      if(!user)
      {
        return done(null,false,{message:'Wrong username/password'});
      }
      User.comparePassword(password,user.password,function(err,isMatch){
        if(err)
        {
            throw err;
        }

        if(isMatch)
        {
            return done(null,user);
        }

        else
        {
            return done(null,false,{message:'Wrong username/password'});
        }

      });
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});
router.get('/register',function(req,res)
{
  res.render('register');
});
router.get('/login',function(req,res)
{
  res.render('login');
});
router.post('/register',function(req,res)
{
  var username = req.body.username;
  var password = req.body.password;
  req.checkBody('username','username is required').notEmpty();
  req.checkBody('password','password is required').notEmpty();
  var errors = req.validationErrors();
  if(errors)
    res.render('register',{errors : errors});
  else{
  User.getUserByUsernameOrEmail(username,function(err,userDb){
    if(err)
    {
      throw err;
    }
    else{
      var len = 0;
      if(userDb!=null)
      {
        len = userDb.length;
      }
      if(userDb.length>0)
      {
        req.flash('error_msg','username is in use');
        res.redirect('register');
      }
      else
      {
        console.log('here');
        var newUser = new User({
          username:username,
          password:password,
          type:"basic"
        });

        User.createUser(newUser,function(err,user){
          if(err)
            throw err;
            req.flash('success_msg','You are registered and can now login');
            res.redirect('login');
        });
      }
      }
    });
  }

});

router.post('/login',
  passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:true}),
  function(req, res) {
    if(req.session.OldUrl){
      console.log(req.session.OldUrl);
      var old = req.session.OldUrl;
      req.session.OldUrl = null;
      res.redirect(old);
    }
    else
    {
      res.redirect('/');
    }
  });
router.get('/logout',function(req,res)
  {
    req.logout();
    req.flash('success_msg','you logged out');
    res.redirect('login')
  });
router.get('/list',ensureAdmin,function(req,res){
    User.getAllUsers(function(err,users){
      if(err)
       throw err;
      else{
        res.render('list',{arr:users});
      }
  });
});
module.exports = router;
function ensureAdmin(req, res, next){
	if(req.isAuthenticated() && req.user.type=='admin')
  {
      return next();
	}
		res.redirect('/users/login');
}
