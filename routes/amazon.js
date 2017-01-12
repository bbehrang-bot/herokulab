var express = require('express');
var router = express.Router();
var multer = require('multer') var upload = multer({
    dest: 'uploads/'
});
var fs = require('fs');
var AWS = require('aws-sdk');
var _config = require('../config/config');



router.get('/upload', function(req, res, next){
  res.render('upload', {title : 'Upload image'});
});
router.post('/upload', upload.single('product'), function(req, res, next) {
            console.log('/// ----------- Upload');
            console.log(req.file);
            console.log(appRoot + '/uploads');
            if(!req.file) {
            return res.render('upload', {
            title: 'Upload Image', message: {
            type: 'danger', messages: [ 'Failed uploading image. 1x001']
            }
            }
            );
            }
            else {
            fs.rename(req.file.path, appRoot + '/uploads/' + req.file.originalname, function(err) {
            if(err) {
            return res.render('upload', {
                title: 'Upload Image', message: {
                    type: 'danger', messages: [ 'Failed uploading image. 1x001']
                }
            }
            );
            }
            else {
//pipe to s3 AWS.config.update({accessKeyId: _config.aws_access_key_id, secretAccessKey: _config.aws_secret_access_key}); // here is where the config.js file comes in with your credentials var fileBuffer = fs.readFileSync(appRoot + '/uploads/' + req.file.originalname); // we need to turn the file into something we can pass over to s3 var s3 = new AWS.S3(); var s3_param = { Bucket: 'your_bucket_name', Key: req.file.originalname, Expires: 60, //expires set till the image is no longer cached ContentType: req.file.mimetype, ACL: 'public-read', Body: fileBuffer //our file data }; s3.putObject(s3_param, function(err, data){ if(err){ console.log(err); } else { var return_data = { signed_request: data, url: 'https://your_bucket_name.s3.amazonaws.com/'+req.file.originalname //url where you can use the image }; console.log('return data - ////////// --------------'); console.log(return_data); return res.render('upload', {data : return_data, title : 'Upload Image : success', message : { type: 'success', messages : [ 'Uploaded Image']}}); } }); } }) } });
module.exports = router;
