var validTitle = false;
var event_create = {
	titleCheck: function(title){
    if(title.length<5){
      $('#ec_title').addClass('input-fail').removeClass('input-good');
      popup.popupInput('ec_title', 'Название должено содержать не менее 5 символов');
      validTitle = false;
    }else{
      $.ajax({
        type: "Post",
        url: "/events/titleCheck",
        data: {titleCheck: title},
        success: function(res){
          if(res){
            $('#ec_title').addClass('input-good').removeClass('input-fail');
            popup.popupInputHide();
            validTitle = true;
          }else{
            $('#ec_title').addClass('input-fail').removeClass('input-good');
            popup.popupInput('ec_title', 'Такое событие уже существует');
            validTitle = false;
          }
        }
      });
    }
  },
};