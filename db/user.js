var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;




queryUser = function(host, port) {
  this.db = new Db('salsa', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};



//getCollection
queryUser.prototype.getCollection = function(callback) {
  this.db.collection('users', function(err, user_collection) {
    if(err) callback(err);
    else callback(null, user_collection);
  });
};

//findAll
queryUser.prototype.findAll = function(callback) {
    this.getCollection(function(err, user_collection) {
      if(err) callback(err)
      else {
        user_collection.find().toArray(function(err, results) {
          if(err) callback(err)
          else callback(null, results)
        });
      }
    });
};

//findByLogin
queryUser.prototype.findByLogin = function(login, callback) {
    this.getCollection(function(err, user_collection) {
      if(err) callback(err)
      else {
        user_collection.findOne({login: login}, function(err, result) {
          if(err) callback(err)
          else callback(null, result)
        });
      }
    });
};

//findById
queryUser.prototype.findById = function(id, callback) {
    this.getCollection(function(err, user_collection) {
      if(err) callback(err)
      else {
        user_collection.findOne({_id: ObjectID(id)}, function(err, result) {
          if(err) callback(err)
          else callback(null, result)
        });
      }
    });
};

//save
queryUser.prototype.save = function(user, callback) {
    this.getCollection(function(err, user_collection) {
      if(err) callback(err)
      else {
        if( typeof(user.length)=="undefined")
          user = [user];
        user_collection.insert(user, function() {
          callback(null, user);
        });
      }
    });
};

//update
queryUser.prototype.update = function(id, settings, callback) {
    this.getCollection(function(err, user_collection) {
      if(err) callback(err)
      else {
        user_collection.update({_id: ObjectID(id)}, {$set: settings}, function() {
          callback(null, settings);
        });
      }
    });
};

exports.queryUser = queryUser;