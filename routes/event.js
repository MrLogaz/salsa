var path = require('path');
var fs = require('fs');
var im = require('imagemagick');
var queryUser = require('../db/user').queryUser;
var queryEvent = require('../db/event').queryEvent;
var region = require('../db/region');
var dbUser = new queryUser('localhost', 27017);
var dbEvent = new queryEvent('localhost', 27017);
var crypto = require('crypto');
var rustolat = require('../modules/url_rus-to-lat');
var vow = require('vow');



exports.listAll = function(req, res){
  dbEvent.findAll(function (err, dataEvents){
    if(err) throw err
    else {
      
      var eventsLength = dataEvents.length;
      function getUser(id){
        var promise = vow.promise();
        dbUser.findById(id, function(err, dataUser){
          if(err) throw err
          else {
            promise.fulfill(dataUser);
          }
        });
        return promise;
      };
      function compare(a,b) {
        if (a.date < b.date)
           return 1;
        if (a.date > b.date)
          return -1;
        return 0;
      }

      var eventsArr = [];
      dataEvents.forEach(function(i){
        vow.all([getUser(i.behalfId)]).then(function(user){
          i.authorAvatar = user[0].avatar;
          i.authorLogin = user[0].login;
          i.authorFname = user[0].fname;
          i.authorSname = user[0].sname;
          eventsArr.push(i);
          if(eventsArr.length == eventsLength){
            renderFunction(eventsArr.sort(compare));
          }
        });
      });

      function renderFunction(eventsArr){
        res.render('page/event/listAll', {
          head: {
            title: 'События' 
          },
          authorized: req.session.authorized,
          user: req.cookies.user,
          posts: eventsArr
        });
      };
    }
  });
};


exports.createGet = function(req, res){
  if(req.session.authorized){
    res.render('page/event/create', {
      head: {
        title: 'Создать событие'
      },
      authorized: req.session.authorized,
      user: req.cookies.user
    });
  }else{
    res.redirect('/events');
  }
};

exports.createPost = function(req, res){
  rustolat.translit(req.param('title'), function(latUrl){
    var eventFilePatch = __dirname + '/../public/files/event/' + latUrl;

    var newEvent = {
      latUrl: latUrl,
      title: req.param('title'),
      anons: req.param('anons'),
      text: req.param('text'),
      region: req.param('region'),
      address: req.param('address'),
      price: req.param('price'),
      avatar: false,
      behalf: req.param('behalf'),
      behalfId: req.param('behalfid'),
      author: req.session.login,
      authorId: req.session.userid,
      date: new Date()
    };

    fs.mkdir(eventFilePatch, function (err){
      if(err) throw err
      else {
        dbEvent.save(newEvent, function(err, dataEvent) {
          if(err) throw err
          else{
            res.redirect('/events/' + latUrl);
          }
        });
        
      }
    });
  });
};

exports.titleCheck = function(req, res){
  rustolat.translit(req.body.titleCheck, function(latUrl){
    dbEvent.findByTitle(latUrl, function (err, dataEvent){
      if(err) {
        res.send(false);
      }else{
        if(dataEvent == null)
          res.send(true)
        else
          res.send(false)
      }
    });
  });
};