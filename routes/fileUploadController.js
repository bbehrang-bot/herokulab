var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/test')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
});

var upload = multer({ storage: storage });
router.get('/',function(req,res)
{
  res.render('fileUpload');
});
router.post('/',upload.single('songFile'),function(req,res)
{
  res.render('imgTest',{img:req.file});
});

module.exports = router;
