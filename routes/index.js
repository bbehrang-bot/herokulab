"use strict";
var express = require('express');
var router = express.Router();

/* GET home page. */
router.all('/', function(req, res, next) {
  res.render('index', {
    meta_desc: 'Cool music',
    meta_author: 'Behrang Behvandi',
    page_title: 'B.B Online Music Store',
    header: 'B.B Online Music Store',
    });
});

/* GET about page. */


module.exports = router;
