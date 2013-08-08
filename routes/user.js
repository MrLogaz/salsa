var path = require('path');
var fs = require('fs');
var queryUser = require('../db/user').queryUser;
var dbUser = new queryUser('localhost', 27017);
var crypto = require('crypto');

exports.loginCheck = function(req, res){
  dbUser.findByLogin(req.body.loginCheck, function (err, dataUser){
    if(err) {
      res.send(false);
    }else{
      if(dataUser == null)
        res.send(true)
      else
        res.send(false)
    }
  });
};

exports.registryGet = function(req, res){
  if(req.session.authorized){
    res.redirect('/');
  }
  res.render('page/user/registry', {
    head: {
      title: 'Регистрация'  
    }
  });
};

exports.registryPost = function(req, res){
  var userFilePatch = __dirname + '/../public/files/user/' + req.param('login');

  var salt = new Date().getTime().toString();
  var passHash = crypto.createHash('md5').update(req.param('pass') + salt).digest("hex");

  var newUser = {
    login: req.param('login'),
    pass: passHash,
    passOLD: req.param('pass'),
    salt: salt,
    email: req.param('email'),
    regDate: new Date(),
    // Сохранение пустых значений
    fname: "",
    sname: "",
    tname: "",
    city: "",
    sex: "",
    avatar: false,
    about: ""
  };

  fs.mkdir(userFilePatch, function (err){
    if(err) throw err;
    else {
      dbUser.save(newUser, function(err, dataUser) {
        if(err) throw err;
        else{
          res.cookie('user_id', dataUser[0]._id);
          res.cookie('user_login', dataUser[0].login);
          res.cookie('user_pass', dataUser[0].pass);
          req.session.userid = dataUser[0]._id;
          req.session.login = dataUser[0].login;
          res.redirect('/user/' + req.param('login') + '/settings');
        }
      });
      
    }
  });
};

exports.list = function(req, res){
  var skip = 0;
  var limit = 5;
  var page = 1;
  if(req.query.p){
    page = +req.query.p;
    if(page != NaN && page > 0){
      var skipAll = limit * (page-1);
      if(skipAll < count)
        skip = skipAll;
      else
        res.redirect('/events');
    }else
      res.redirect('/events');
  }
  function Render(dataUsers, uCount){
    res.render('page/user/list', {
      head: {
        title: 'Танцоры' 
      },
      authorized: req.session.authorized,
      user: req.cookies,
      users: dataUsers,
      pagination: {count: uCount, link: 'users', limit: limit, current: page}
    });
  }
  dbUser.findAll(skip, limit, function (err, dataUsers){
    if(err) throw err;
    else {
      dbUser.count(function(err, uCount){
        Render(dataUsers, uCount);
      });
    }
  });
};

exports.loginPost = function(req, res){
  dbUser.findByLogin(req.param('login'), function(err, dataUser){
    if(err) throw err
    else {
      if(dataUser){
        var saltPass = req.param('pass') + dataUser.salt;
        var passHash = crypto.createHash('md5').update(saltPass).digest("hex");
        if(dataUser.pass == passHash){
          res.cookie('user_id', dataUser._id);
          res.cookie('user_login', dataUser.login);
          res.cookie('user_fname', dataUser.fname);
          res.cookie('user_sname', dataUser.sname);
          res.cookie('user_tname', dataUser.tname);
          res.cookie('user_pass', dataUser.pass);
          res.cookie('user_city', dataUser.city);
          res.cookie('user_avatar', dataUser.avatar);

          req.session.userid = dataUser._id;
          req.session.login = dataUser.login;
          req.session.authorized = true;
          res.redirect('/user/' + req.param('login'));
        }else{
          res.redirect('/login');
        }
      }else{
        res.redirect('/login');
      }
    }
  });
};

exports.loginGet = function(req, res){
  if(req.session.authorized && req.session.id == req.cookies.user_id){
    res.redirect('/');
  }else{
    res.render('page/user/login', {
      head: {
        title: 'Авторизация' 
      }
    });
  }
};

exports.logout = function(req, res){
  req.session.destroy();
  res.clearCookie('user_id');
  res.clearCookie('user_login');
  res.clearCookie('user_fname');
  res.clearCookie('user_sname');
  res.clearCookie('user_sname');
  res.clearCookie('user_pass');
  res.clearCookie('user_city');
  res.clearCookie('user_avatar');
  res.redirect('/users');
};