var express = require('express');
var router = express.Router();
var path = require('path');
router.get('/',function(req,res)
{
  res.render('home/index');
});
router.post('/fromLanding',function(req,res)
{
  var lastPriority = req.body.priority;
  if(typeof(lastPriority) == 'undefined')
  {
    res.render('Error/somethingwrong',{error:"Wrong input"});
  }
  Artist.getArtistsByPriority(lastPriority,3,function(err,artists){
    if(err)
    {
    res.render('Error/somethingwrong',{error:err});
    }
    else
    {
      res.send({artists:artists});
    }
  });
});
router.post('/',function(req,res){
  var priority = req.body.lastPriority;
  var lastPriority = 0;
  Artist.getArtistLastPriority(function(err,artist){
    if(err)
    {
        res.render('Error/somethingwrong',{error:err});
    }
    else
    {
      lastPriority = artist[0].priority;
      console.log("last " + lastPriority);
      console.log("prio" + priority);
      if(priority >= lastPriority)
      {
        priority = 0;
      }
      Artist.getArtistsByPriority(priority,3,function(err,artists){
        if(err)
        {
          res.render('Error/somethingwrong',{error:err});
        }
        else{
            res.send({artists:artists});
        }
      });
    }
  });
});
module.exports = router;
