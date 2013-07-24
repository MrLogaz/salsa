var queryUser = require('../db/user').queryUser
  , dbUser = new queryUser('localhost', 27017);

exports.check = function(req, res, callback){
  /*
  Обычно делают так:
  1) Новый пользователь при регистрации задаёт пароль, который шифруется со случайной «солью». 
  Пользователь отправляется в виде кук его ID(для ускорения запросов), login и шифрованный пароль. 
  В базу записывается ID, login, соль и шифрованный пароль.
  2) При авторизации проверяется куки, если они верные, то создаём сессию и помещаем в нее нужные данные. 
  Если в кукак что-то не так, то удаляем их на сервере и на клиенте при помощи JS и перекидываем на форму авторизации.
  3) При обновлении страницы сверяем данные кук и сессии, если всё верно, то работаем. 
  Если нет, то очищаем сессию и авторизуемся через куки. Пароль в сессии не храним.

  Если надолго, тогда конечно случайный хэш при логине в куку, и пару тот же хэш в базу
  */

  if(req.cookies.user){
    if(req.cookies.user.id == req.session.userid){
      req.session.authorized = true;
      callback(null, true);
    }else{
      dbUser.findByLogin(req.cookies.user.login, function (err, dataUser){
        if(err) throw err
        else {
          if(dataUser){
            console.log('Пользователь спрашивается в базе для авторизации!!! Ахтунг');
            console.info(dataUser.pass +"=="+ req.cookies.user.pass);
            if(dataUser.pass == req.cookies.user.pass){
              var userCookie = {
                id: dataUser._id,
                login: dataUser.login,
                fname: dataUser.fname,
                sname: dataUser.sname,
                tname: dataUser.tname,
                pass: dataUser.pass,
                city: dataUser.city,
                region: dataUser.region,
                avatar: dataUser.avatar
              };
              res.cookie('user', userCookie);
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