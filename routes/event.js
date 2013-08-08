var path = require('path');
var fs = require('fs');
var gm = require('gm');
var queryUser = require('../db/user').queryUser;
var queryEvent = require('../db/event').queryEvent;
var city = require('../db/cityjson');
var dbUser = new queryUser('localhost', 27017);
var dbEvent = new queryEvent('localhost', 27017);
var crypto = require('crypto');
var rustolat = require('../modules/url_rus-to-lat');
var designText = require('../modules/designText');
var vow = require('vow');



exports.listAll = function(req, res){
  var skip = 0;
  var limit = 5;
  var page = 1;
  dbEvent.count(function(err, count){
    if(err) throw err;
    else {
      if(count == 0) {
        res.render('page/event/listAll', {
          head: {
            title: 'События' 
          },
          authorized: req.session.authorized,
          user: req.cookies,
          posts: false,
        });
      }
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
      dbEvent.findAll(skip, limit, function (err, dataEvents){
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
            if (a.created < b.created)
               return 1;
            if (a.created > b.created)
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
              user: req.cookies,
              posts: eventsArr,
              pagination: {count: count, link: 'events', limit: limit, current: page}
            });
          };
        }
      });
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
      user: req.cookies
    });
  }else{
    res.redirect('/events');
  }
};

exports.createPost = function(req, res){
  if (req.param('title').length < 6){
    res.redirect('/events/create');
    return false;
  }
  rustolat.translit(req.param('title'), function(latUrl){
    var eventFilePatch = __dirname + '/../public/files/event/' + latUrl;
    var eventAvatar = false;

    if(req.files.avatar.size > 30) {eventAvatar = true;}
    else {eventAvatar = false}

    var newEvent = {
      latUrl: latUrl,
      title: req.param('title'),
      anons: req.param('anons'),
      text: req.param('text'),
      date: new Date(req.param('date_hidden')),
      city: req.param('city'),
      cityId: req.param('cityid'),
      address: req.param('street') + ' ' + req.param('house'),
      price: req.param('price'),
      avatar: eventAvatar,
      behalf: req.param('behalf'),
      behalfId: req.param('behalfid'),
      author: req.session.login,
      authorId: req.session.userid,
      created: new Date()
    };
    var tempPath = req.files.avatar.path;
    var targetPath = path.resolve(eventFilePatch + '/ava-');


    fs.mkdir(eventFilePatch, function (err){
      if(err) throw err;
      else {
        if(eventAvatar){
          gm(tempPath).identify(function(err, metadata){
            if(err) throw (err);
            else {
              if(metadata.size.width > 600){
                var imgWidth = 600;
              }else{
                var imgWidth = metadata.size.width;
              }
              gm(tempPath)
              .resize(imgWidth)
              .write(targetPath + 'prev.jpg', function (err) {
                if (err) throw err;
                else {
                  designText.toHtml(newEvent.text, function (htmlText){
                    newEvent.text = htmlText;
                    dbEvent.save(newEvent, function (err, dataEvent) {
                      if(err) throw err
                      else{
                        res.redirect('/events/' + latUrl);
                      }
                    });
                  });
                  
                  fs.unlink(tempPath, function (err){
                    if (err) throw err;
                  });
                }
              });
            }
          });
        }else{
          designText.toHtml(newEvent.text, function (htmlText){
            newEvent.text = htmlText;
            dbEvent.save(newEvent, function (err, dataEvent) {
              if(err) throw err
              else{
                res.redirect('/events/' + latUrl);
              }
            });
          });
          fs.unlink(tempPath, function (err){
            if (err) throw err;
          });
        }
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


exports.eventPage = function(req, res){
  dbEvent.findByTitle(req.param('title'), function (err, dataEvent){
    if(err) throw err;
    else{
      if(dataEvent == null){
        res.render('page/error404', {
          head: {
            title: '404'
          },
          authorized: req.session.authorized,
          user: req.cookies
        });
      }else{
        dbUser.findById(dataEvent.behalfId, function (err, dataUser){
          if(err) throw err
          else {
            res.render('page/event/event', {
              head: {
                title: dataEvent.title
              },
              authorized: req.session.authorized,
              user: req.cookies,
              post: dataEvent,
              author: dataUser
            });
          }
        });
      }
    }
  });
};