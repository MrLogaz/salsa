var express = require('express')
  , http = require('http')
  , path = require('path')
  , crypto = require('crypto')
  , authorized = require('./modules/authorized');

// routes
var routes = require('./routes')
  , user = require('./routes/user')
  , profile = require('./routes/profile')
  , event = require('./routes/event');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({uploadDir: __dirname + "/public/files/tmp"}));
app.use(express.cookieParser());
app.use(express.session({
  secret: 'secret',
  cookie: { maxAge : 1*24*60*60*1000 } // Дней, часов, минут, секунд, милисекунд
}));

app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));




// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// var authCheck = function(req, res, callback){

// };

//main
app.get('/', routes.index);

// USER.js
app.get('/users', authorized.check, user.list);
// user registry
app.get('/registry', user.registryGet);
app.post('/registry', user.registryPost);
app.post('/user/loginCheck', user.loginCheck);
// user authorization
app.get('/login', user.loginGet);
app.post('/login', user.loginPost);
app.get('/logout', user.logout);

// PROFILE.js
app.get('/user/:login', authorized.check, profile.profile);
// profile settings
app.get('/user/:login/settings', authorized.check, profile.settingsGet);
app.post('/user/:login/settings', authorized.check, profile.settingsPost);
// profile avatar
app.post('/user-avatar', authorized.check, profile.avatarPost);

//EVENT.js
// main
app.get('/events', authorized.check, event.listAll);
// create
app.get('/events/create', authorized.check, event.createGet);
app.post('/events/create', authorized.check, event.createPost);
app.post('/events/titleCheck', event.titleCheck);
//event page
app.get('/events/:title', authorized.check, event.eventPage);





http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
