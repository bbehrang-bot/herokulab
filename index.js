var index = require('./routes/index');
var bands = require('./routes/bands');
var api = require('./routes/api');
var users = require('./routes/users');

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var engine = require('ejs-mate');
var MongoStore =require('connect-mongo')(session);
var LocalStrategy = require('passport-local').Strategy;
var csrf = require('csurf');
var route = express.Router();
var csrfProtection = csrf({cookie:true});
mongoose.connect('mongodb://heroku_w2ghbx7q:q7umm8br4dkegd8i5hrutabi9o@ds161518.mlab.com:61518/heroku_w2ghbx7q');
var db = mongoose.connection;
var app = express();

app.set('port', (process.env.PORT || 5001));

// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



//bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());


//static folder

app.use("/public",express.static(path.join(__dirname + '/public')));
//express session
app.use(session({
    secret: 'winteriscomingandthedeadcomewithitbastard',
    saveUninitialized: false,
    resave: false,
    store:new MongoStore({
      mongooseConnection : mongoose.connection,
    }),
    cookie:{maxAge : 180*60*1000}
}));

//route.use(csrf());
//passportInit
app.use(passport.initialize());
app.use(passport.session());
// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());
//app.use(csrf());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.session = req.session;
  next();
});

app.use('/',index);
app.use('/users',users);
app.use('/bands',bands);
app.use('/api',api);
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
