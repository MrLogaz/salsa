var path = require('path');
var fs = require('fs');
var gm = require('gm');
var queryUser = require('../db/user').queryUser;
var region = require('../db/region');
var dbUser = new queryUser('localhost', 27017);
var crypto = require('crypto');




exports.profile = function(req, res){
  dbUser.findByLogin(req.param('login'), function(err, profile){
    if(err) throw err
    else {
      if(profile == null){
        res.render('page/error404', {
          head: {
            title: '404'
          },
          authorized: req.session.authorized,
          user: req.cookies
        });
      }else{
        res.render('page/profile/profile', {
          head: {
            title: 'Танцор ' + profile.login
          },
          authorized: req.session.authorized,
          user: req.cookies,
          profile: profile
        });
      }
    }
  });
};



exports.settingsGet = function(req, res){
  if(req.session.authorized && req.session.login == req.param('login')){
    dbUser.findByLogin(req.param('login'), function(err, profile){
      if(err) throw err
      else {
        res.render('page/profile/settings', {
          head: {
            title: 'Настройки'
          },
          authorized: req.session.authorized,
          user: req.cookies,
          profile: profile
        });
      }
    });
  }else{
    res.redirect('/user/' + req.param('login'));
  }
};

exports.settingsPost = function(req, res){
  var userFilePatch = __dirname + '/../public/files/user/' + req.param('login');

  var profileSettings = {
    fname: req.param('fname'),
    sname: req.param('sname'),
    tname: req.param('tname'),
    region: req.param('region'),
    city: req.param('city'),
    sex: req.param('sex'),
    about: req.param('about')
  };

    
  dbUser.update(req.session.userid, profileSettings, function(err, newSetting) {
    if(err) throw (err);
    else{
      res.cookie('user_id', req.session.userid);
      res.cookie('user_login', req.session.login);
      res.cookie('user_fname', newSetting.fname);
      res.cookie('user_sname', newSetting.sname);
      res.cookie('user_tname', newSetting.tname);
      res.cookie('user_pass', req.cookies.user_pass);
      res.cookie('user_city', newSetting.city);
      res.redirect('/user/' + req.session.login);
    }
  });
};


exports.avatarPost = function(req, res){

  var userFilePatch = __dirname + '/../public/files/user/' + req.session.login;
  var userAvatar = false;
  var targetPath = path.resolve(userFilePatch + '/ava-');
  
  if(req.files.avatar.size > 30) {userAvatar = true;}
  else {userAvatar = false}
  var ava = {
    x: req.param('form_avatarPx'),
    y: req.param('form_avatarPy'),
    w: req.param('form_avatarPw'),
    h: req.param('form_avatarPh')
  };

  var tempPath = req.files.avatar.path;
  if(userAvatar){
    gm(tempPath).identify(function(err, metadata){
      if(err) throw (err);
      else {
        if(metadata.size.width > 600){
          var imgWidth = 600;
        }else{
          var imgWidth = metadata.size.width;
        }
        gm(tempPath)
        .crop(ava.w, ava.h, ava.x, ava.y)
        .resize(60,60)
        .write(targetPath + '60.jpg', function (err) {
          if (err) throw err;
          else {
            gm(tempPath)
            .resize(imgWidth)
            .write(targetPath + 'orig.jpg', function (err) {
              if (err) throw err;
              else {
                dbUser.update(req.session.userid, {avatar: true}, function(err, newSetting) {
                  if (err) throw err;
                  else {
                    res.cookie('user_avatar', true);
                    res.redirect('/user/' + req.session.login);
                  }
                });
                fs.unlink(tempPath, function (err){
                  if (err) throw err;
                });
              }
            });
          }
        });
      }
    });
  }else{
    fs.unlink(tempPath, function (err){
      if (err) throw err;
    });
  }
};