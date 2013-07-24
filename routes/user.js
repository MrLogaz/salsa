var path = require('path');
var fs = require('fs');
var im = require('imagemagick');
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
    country: "",
    region: "66",
    city: "",
    sex: "",
    avatar: false,
    about: ""
  };

  fs.mkdir(userFilePatch, function (err){
    if(err) throw err
    else {
      dbUser.save(newUser, function(err, dataUser) {
        if (err) console.log(err);
        else{
          var userCookie = {
            id: dataUser[0]._id,
            login: dataUser[0].login,
            pass: dataUser[0].pass,
          };
          res.cookie('user', userCookie);
          req.session.userid = dataUser[0]._id;
          req.session.login = dataUser[0].login;
          res.redirect('/user/' + req.param('login') + '/settings');
        }
      });
      
    }
  });
};

exports.list = function(req, res){
  dbUser.findAll(function (err, dataUsers){
    if(err) throw err
    else {
      res.render('page/user/list', {
        head: {
          title: 'Танцоры' 
        },
        authorized: req.session.authorized,
        user: req.cookies.user,
        users: dataUsers
      });
    }
  });
};

exports.loginPost = function(req, res){
  dbUser.findByLogin(req.param('login'), function(err, dataUser){
    if(err) throw err
    else {
      if(dataUser){
        console.log(req.param('pass') +"+"+ dataUser.salt);
        var saltPass = req.param('pass') + dataUser.salt;
        var passHash = crypto.createHash('md5').update(saltPass).digest("hex");
        console.log(dataUser.pass + "=Loginpost=" +  passHash);
        if(dataUser.pass == passHash){
          
          var userCookie = {
            id: dataUser._id,
            login: dataUser.login,
            fname: dataUser.fname,
            sname: dataUser.sname,
            tname: dataUser.tname,
            pass: dataUser.pass,
            city: dataUser.city,
            avatar: dataUser.avatar
          };
          console.log(userCookie);
          res.cookie('user', userCookie);
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
  if(req.session.authorized && req.session.id == req.cookies.user._id){
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
  res.clearCookie('user');
  res.redirect('/users');
};