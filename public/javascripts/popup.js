var popup = {
	popupInput: function(id, msg){
    var offset = $('#' + id).offset();
    var width = $('#' + id).outerWidth();
    $("#popup-input").removeClass("pi_show");
    setTimeout('$("#popup-input").addClass("pi_show")', 200);
    $('#popup-input')
    .css({'top': offset.top+5, 'left': offset.left+width+10})
    .html(msg);
  },
  popupInputHide: function(){
  	$("#popup-input").removeClass("pi_show");
  }
};