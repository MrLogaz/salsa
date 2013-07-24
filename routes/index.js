
/*
 * GET home page.
 */
var json = require('./json');

exports.index = function(req, res){
  res.render('page/main', json.index);
};