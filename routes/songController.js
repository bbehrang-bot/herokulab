var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Song = require('../models/songs.js');
var SongModel =  mongoose.model('Song');
var multer = require('multer');
router.post('/getArtistsList',function(req,res){
  var name = req.body.name;
  Artist.searchArtistsByName(name,100,function(err,artists){
    if(err)
    {
      res.json(err);
      throw err;
    }
    else{
      res.send({artists:artists})
    }
  });
});
router.post('/getAlbumInfo',function(req,res){
  var artistName = req.body.artistName;
  var albumName = req.body.albumName;

  Album.getAlbumInfoByName(artistName,albumName,function(err,albumInfo){
    if(err)
    {
      res.json(err);
      throw err;
    }
    else{
      res.send({albumInfo:albumInfo});
    }
  });
});
router.post('/getAlbumsByArtist',function(req,res){
  Album.getAlbumsByArtist(req.body.name,function(err,albums){
    res.send(albums);
  });
});
router.get('/getArtistsList',function(req,res){
  Artist.getArtists(function(err,artists){
    if(err)
    {
      res.json(err);
      throw err;
    }
    else{
      res.send({artists:artists})
    }
  });
});
router.get('/',function(req,res)
{
  Song.getSongs(function(err,callback){

    if(err)
    {
      throw err;
    }
    res.json(callback);
  });
});
router.get('/api',function(req,res){
  Song.getSongs(function(err,callback){
    if(err)
      throw err;
    else{
        res.json(callback);
    }
  });

});
router.get('/songSubmit',ensureAuthenticated,function(req,res)
{
    res.render('songsubmit');
});
router.get('/api/:id',function(req,res)
{
  var id = req.params.id;
  Song.getSongById(id,function(err,callback){
    if(err)
    {
      throw err;
    }
    res.json(callback);
  });
});
router.post('/submit',ensureAuthenticated,function(req,res)
{
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'artistsMedia/drake/songs')
    },
    filename: function (req, file, cb) {
      cb(null, req.body.name + path.extname(file.originalname)) //Appending extension
    },

  });
  var upload = multer({
    storage: storage,
    limits :{fileSize :52428800}
  }).single('songFile');
  upload(req,res,function(err)
  {
    if(err)
      res.send(err.code);
      else{
        var song = new SongModel({
          name:req.body.name,lyrics:req.body.lyrics,trackNumber:req.body.trackNumber,price:req.body.price,songPath:'/' +req.file.destination + '/'+req.file.filename
        });
        Song.addSong(song);
        res.render('songplay',{song:song})
      }

  });

});
router.post('/api',function(req,res)
{
  var song = req.body;
  console.log("sdsaddsadas");
  console.log(song);
  Song.addSong(song,function(err,song){
    if(err)
    {
      throw err;
    }
    else{
          res.json(song);
    }
  });
});

router.put('/api/:id',function(req,res)
{
  var id = req.params.id;
  var song = req.body;
  Song.updateSong(id,song,{},function(err,song){
    if(err)
    {
      throw err;
    }
    res.json(song);
  });
});
router.delete('/api/:id',function(req,res)
{
  var id = req.params.id;
  Song.deleteSong(id,function(err,song){
    if(err)
    {
      throw err;
    }
    else
    {
      res.json(song);
    }

  });
});
router.get('/edit',ensureAuthenticated,function(req,res){
  res.render('song/edit');
});
router.post('/save',ensureAuthenticated,function(req,res){
  console.log('s');
  var song = {
    name : req.body.name,
    price:req.body.price
  };
  Song.updateSong(req.body.id,song,function(err,songSave){
    if(err)
    {
      res.render('error/somethingwrong',{error:err});
    }
    else{
      Song.getSongById(req.body.id,function(err,newSong){
        if(err)
        {
          res.render('error/somethingwrong',{error:err});
        }
        else{
          res.send({song:newSong});
        }

      });
    }
  });
});
router.post('/delete',ensureAuthenticated,function(req,res){
  Song.deleteSong(req.body.id,function(err,callback){
    if(err)
    {
      res.render('error/somethingwrong',{error:err});
    }
    else{
      Album.removeSongFromAlbum(req.body.id,function(err,album)
      {
        if(err)
        {
          res.render('error/somethingwrong',{error:err});
        }
        else{
          console.log(album);
          res.send({id:req.body.id});
        }
      });
    }
  });

});
module.exports = router;
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
    {
      if(req.user.type=="admin")
      {
        return next();
      }
    }
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}
