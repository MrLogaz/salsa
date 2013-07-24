var user_auth = {
  loginShow: function(el){
    if(el.hasClass('active')){
      el.removeClass('active');
      $('#user-auth').removeClass('user-auth_show');  
    }else{
      el.addClass('active');
      $('#user-auth').addClass('user-auth_show');
    }
    $('.top-vs').click(function(){
      el.removeClass('active');
      $('#user-auth').removeClass('user-auth_show');  
    });
    return false; 
  }
}