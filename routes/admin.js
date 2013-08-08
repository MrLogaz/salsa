var path = require('path');
var fs = require('fs');
var gm = require('gm');
var queryUser = require('../db/user').queryUser;
var queryEvent = require('../db/event').queryEvent;
var dbUser = new queryUser('localhost', 27017);
var dbEvent = new queryEvent('localhost', 27017);


exports.main = function(req, res){
  if(req.session.authorized && req.session.login == 'admin' && req.cookies.user_login == 'admin'){
    function Render(eCount, uCount){
      res.render('page/admin/main', {
        head: {
          title: 'Страница админа СЖ' 
        },
        authorized: req.session.authorized,
        user: req.cookies,
        eventCount: eCount,
        userCount: uCount
      });
    }
    dbEvent.count(function(err, eCount){
      if(err) throw err;
      else {
        dbUser.count(function(err, uCount){
          Render(eCount, uCount);  
        });
      }
    });
  }else{
    res.redirect('/');
  }
  
};


exports.users = function(req, res){
  var skip = 0;
  var limit = 10;
  var page = 1;
  if(req.query.p){
    page = +req.query.p;
    if(page != NaN && page > 0){
      var skipAll = limit * (page-1);
      if(skipAll < count)
        skip = skipAll;
      else
        res.redirect('/admin/users');
    }else
      res.redirect('/admin/users');
  }
  if(req.session.authorized && req.session.login == 'admin' && req.cookies.user_login == 'admin'){
    function Render(dataUsers, uCount){
      res.render('page/admin/users', {
        head: {
          title: 'Страница админа СЖ' 
        },
        authorized: req.session.authorized,
        user: req.cookies,
        userCount: uCount,
        dataUsers: dataUsers,
        pagination: {count: uCount, link: '/admin/users', limit: limit, current: page}
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
  }else{
    res.redirect('/');
  }
};