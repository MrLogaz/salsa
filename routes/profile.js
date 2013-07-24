var path = require('path');
var fs = require('fs');
var im = require('imagemagick');
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
          user: req.cookies.user
        });
      }else{
        res.render('page/profile/profile', {
          head: {
            title: 'Танцор ' + profile.login
          },
          authorized: req.session.authorized,
          user: req.cookies.user,
          profile: profile
        });
      }
    }
  });
};



exports.settingsGet = function(req, res){
  console.log(req.session.login +"=="+ req.param('login'));
  if(req.session.authorized && req.session.login == req.param('login')){
    dbUser.findByLogin(req.param('login'), function(err, profile){
      if(err) throw err
      else {
        res.render('page/profile/settings', {
          head: {
            title: 'Настройки'
          },
          authorized: req.session.authorized,
          user: req.cookies.user,
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
  var userAvatar = false;
  var targetPath = path.resolve(userFilePatch + '/ava-');
  
  if(req.files.avatar.size > 30) {userAvatar = true;}
  else {userAvatar = false}

  var profileSettings = {
    fname: req.param('fname'),
    sname: req.param('sname'),
    tname: req.param('tname'),
    region: req.param('region'),
    city: req.param('city'),
    sex: req.param('sex'),
    avatar: userAvatar,
    about: req.param('about')
  };


  var tempPath = req.files.avatar.path;
  if(req.files.avatar.size > 30){
    im.identify(tempPath, function(err, metadata){
      if (err) throw err;
      else {
        if(metadata.width > 600){
          var imgWidth = 600;
        }else{
          var imgWidth = metadata.width;
        }
        im.resize({
          srcPath: tempPath,
          dstPath: targetPath + '60.jpg',
          width:   60,
          format: 'jpg'
        }, function (err, stdout, stderr){
          if (err) throw err;
          else{
            im.resize({
              srcPath: tempPath,
              dstPath: targetPath + 'orig.jpg',
              width:   imgWidth,
              format: 'jpg'
            }, function (err, stdout, stderr){
              if (err) throw err;
              else{
                dbUser.update(req.session.userid, profileSettings, function(err, newSetting) {
                  if (err) console.log(err);
                  else{
                    var userCookie = {
                      id: req.session.userid,
                      login: req.session.login,
                      pass: req.cookies.user.pass,
                      fname: newSetting.fname,
                      sname: newSetting.sname,
                      tname: newSetting.tname,
                      city: newSetting.city,
                      region: newSetting.region,
                      avatar: newSetting.avatar
                    };
                    res.cookie('user', userCookie);
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
    dbUser.update(req.session.userid, profileSettings, function(err, newSetting) {
      if (err) console.log(err);
      else{
        var userCookie = {
          id: req.session.userid,
          login: req.session.login,
          pass: req.cookies.user.pass,
          fname: newSetting.fname,
          sname: newSetting.sname,
          tname: newSetting.tname,
          city: newSetting.city,
          region: newSetting.region,
          avatar: newSetting.avatar
        };
        res.cookie('user', userCookie);
        res.redirect('/user/' + req.session.login);
      }
    });
  
    fs.unlink(tempPath, function (err){
      if (err) throw err;
    });
  }
};