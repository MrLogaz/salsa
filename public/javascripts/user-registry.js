var validLogin = false;
var user_registry = {
  loginCheck: function(login){
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
  },
  fileSelect: function(){
    var oFile = $('#ur_avatar')[0].files[0];
    var rFilter = /^(image\/jpeg|image\/jpg|image\/png)$/i;
    if (! rFilter.test(oFile.type)) {
      console.log('негодный файл');
      return;
    }
    var oImage = document.getElementById('ur_avatar-preview');
    var oReader = new FileReader();
    oReader.onload = function(e) {
      // e.target.result contains the DataURL which we can use as a source of the image
      oImage.src = e.target.result;
      oImage.onload = function () { // onload event handler

        // display step 2
        // $('#ur_avatar-preview').fadeIn(500);

        // display some basic image info
        // var sResultFileSize = bytesToSize(oFile.size);
        // Create variables (in this scope) to hold the Jcrop API and image size
        var jcrop_api, boundx, boundy;

        // destroy Jcrop if it is existed
        if (typeof jcrop_api != 'undefined')
            jcrop_api.destroy();

        // initialize Jcrop
        $('#ur_avatar-preview').Jcrop({
            minSize: [100, 100], // min crop size
            aspectRatio : 1, // keep aspect ratio 1:1
            bgFade: true, // use fade effect
            bgOpacity: .3 // fade opacity
            // onChange: updateInfo,
            // onSelect: updateInfo,
            // onRelease: clearInfo
        }, function(){

            // use the Jcrop API to get the real image size
            var bounds = this.getBounds();
            boundx = bounds[0];
            boundy = bounds[1];

            // Store the Jcrop API in the jcrop_api variable
            jcrop_api = this;
        });
      };
    };
    oReader.readAsDataURL(oFile);
  }

};