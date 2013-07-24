var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;




queryEvent = function(host, port) {
  this.db = new Db('salsa', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};



//getCollection
queryEvent.prototype.getCollection = function(callback) {
  this.db.collection('events', function(err, event_collection) {
    if(err) callback(err);
    else callback(null, event_collection);
  });
};

//findAll
queryEvent.prototype.findAll = function(callback) {
    this.getCollection(function(err, event_collection) {
      if(err) callback(err)
      else {
        event_collection.find().limit(3).sort({ date: -1 }).toArray(function(err, results) {
          if(err) callback(err)
          else callback(null, results)
        });
      }
    });
};

//findByLogin
queryEvent.prototype.findByTitle = function(latUrlTitle, callback) {
    this.getCollection(function(err, event_collection) {
      if(err) callback(err)
      else {
        event_collection.findOne({latUrl: latUrlTitle}, function(err, result) {
          if(err) callback(err)
          else callback(null, result)
        });
      }
    });
};

//findById
queryEvent.prototype.findById = function(id, callback) {
    this.getCollection(function(err, event_collection) {
      if(err) callback(err)
      else {
        event_collection.findOne({_id: ObjectID(id)}, function(err, result) {
          if(err) callback(err)
          else callback(null, result)
        });
      }
    });
};

//save
queryEvent.prototype.save = function(event, callback) {
    this.getCollection(function(err, event_collection) {
      if(err) callback(err)
      else {
        if( typeof(event.length)=="undefined")
          event = [event];
        event_collection.insert(event, function() {
          callback(null, event);
        });
      }
    });
};

//update
queryEvent.prototype.update = function(id, settings, callback) {
    this.getCollection(function(err, event_collection) {
      if(err) callback(err)
      else {
        event_collection.update({_id: ObjectID(id)}, {$set: settings}, function() {
          callback(null, settings);
        });
      }
    });
};

exports.queryEvent = queryEvent;

