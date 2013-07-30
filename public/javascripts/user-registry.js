var validLogin = false;
var user_registry = {
  loginCheck: function(login){
    var lReg = /^[a-z][a-z0-9]*([-_][a-z0-9]+){0,2}$/i;
    if(!lReg.test(login)){
      validLogin = false;
      $('#ur_login').addClass('input-fail').removeClass('input-good');
      popup.popupInput('ur_login', 'Логин должен содержать только латинские симолы и цифры');
    }else {
      if(login.length<3){
        $('#ur_login').addClass('input-fail').removeClass('input-good');
        popup.popupInput('ur_login', 'Логин должен быть не менее 3 символов');
        validLogin = false;
      }else{
        $.ajax({
          type: "Post",
          url: "/user/loginCheck",
          data: {loginCheck: login},
          success: function(res){
            if(res){
              $('#ur_login').addClass('input-good').removeClass('input-fail');
              popup.popupInput('ur_login', 'Логин свободен');
              validLogin = true;
            }else{
              $('#ur_login').addClass('input-fail').removeClass('input-good');
              popup.popupInput('ur_login', 'Логин занят');
              validLogin = false;
            }
          }
        });
      }
    }
  },
  passwordCheck: function(pass){
    if(pass.length<5){
      $('#ur_pass').addClass('input-fail').removeClass('input-good');
      popup.popupInput('ur_pass', 'Пароль должен быть не менее 5 символов');
      return false;
    }else if(pass.length>5 && pass.length<8){
      $('#ur_pass').addClass('input-good').removeClass('input-fail');
      popup.popupInput('ur_pass', 'Хороший пароль');
      return true;
    }else {
      $('#ur_pass').addClass('input-good').removeClass('input-fail');
      popup.popupInput('ur_pass', 'Отличный пароль');
      return true;
    }
  },
  emailCheck: function(email){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(email)){
      $('#ur_email').addClass('input-good').removeClass('input-fail');
      return true;
    }else{
      $('#ur_email').addClass('input-fail').removeClass('input-good');
      popup.popupInput('ur_email', 'Email некорректен');
      return false;
    }
  },
  formValidate: function(){
    if(validLogin && registry.passwordCheck($('#ur_pass').val()) && registry.emailCheck($('#ur_email').val()))
      return true;
    else
      return false;
  }
};