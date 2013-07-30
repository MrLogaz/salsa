var queryUser = require('../db/user').queryUser
  , dbUser = new queryUser('localhost', 27017);

exports.check = function(req, res, callback){

  if(req.cookies.user_id){
    if(req.cookies.user_id == req.session.userid){
      req.session.authorized = true;
      callback(null, true);
    }else{
      dbUser.findById(req.cookies.user_id, function (err, dataUser){
        if(err) throw err
        else {
          if(dataUser){
            if(dataUser.pass == req.cookies.user_pass){
   
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
              callback(null, true);
            }else{
              req.session.authorized = false;
              callback(null, true);
            }
          }else{
            req.session.authorized = false;
            callback(null, true);
          }
        }
      });
    }  
  }else{
    req.session.authorized = false;
    callback(null, true);
  }
};