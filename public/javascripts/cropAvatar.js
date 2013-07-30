var cropAvatar = {
  upload_ava: function(){
    $("#form_avatar-preview-block").html('<img id="form_avatar-preview" />');
    cropAvatar.updateCoords({x:0,y:0,w:0,h:0});
    var uploadFile = $('#form_avatar')[0].files[0];
    var imgFilter = /^(image\/jpeg|image\/jpg|image\/png)$/i;
    if (! imgFilter.test(uploadFile.type)) {
      popup.popupInput('form_avatar', 'Изображение должно иметь расширение <b>jpeg, jpg</b> или <b>png</b>');
      return false;
    }

    var preview = document.getElementById('form_avatar-preview');
    var Reader = new FileReader();
    Reader.onload = function(e) {
      preview.src = e.target.result;
      preview.onload = function() { // onload event handler
        var imageSize = {w: preview.width, h: preview.height};
        var scaleImage = 600/imageSize.w;
        if(imageSize.h*scaleImage> 400){
          scaleImage = 400/imageSize.h;
          preview.height = 400;
          preview.width = imageSize.w*scaleImage;
        }else{
          preview.width = 600;
        }
        $('#form_avatar-scale').val(scaleImage);
        $('#popupInfo_apply').show();


        var jcrop_api, boundx, boundy;

        // destroy Jcrop if it is existed
        if (typeof jcrop_api != 'undefined')
            jcrop_api.destroy();

        // initialize Jcrop
        function cropJcrop(){
          $('#form_avatar-preview').Jcrop({
            aspectRatio: 1,
            setSelect: [0, 0, 250, 250],
            minSize: [100, 100],
            onSelect: cropAvatar.updateCoords,
            onRelease: cropJcrop
          });
        }
        cropJcrop();
      };
    };
    Reader.readAsDataURL(uploadFile);
  },
  updateCoords: function(c){
    var imageScale = $('#form_avatar-scale').val();
    $('#form_avatarPx').val(Math.round(c.x/imageScale));
    $('#form_avatarPy').val(Math.round(c.y/imageScale));
    $('#form_avatarPw').val(Math.round(c.w/imageScale));
    $('#form_avatarPh').val(Math.round(c.h/imageScale));
  },
  cropSave: function(){
    popup.popupInfoClose();
    return false;
  },
  cropCancel: function(){
    $('#popupInfo_apply').hide();
    $("#form_avatar").replaceWith($("#form_avatar").clone());
    $("#form_avatar-preview-block").html('<img id="form_avatar-preview" />');
    cropAvatar.updateCoords({x:0,y:0,w:0,h:0});
    popup.popupInfoClose(); 
  }
};