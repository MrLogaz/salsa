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
  },
  popupInfoShow: function(windowname, popupWidth, popupHeight){
    blanket_size(windowname);
    window_pos(windowname, popupWidth, popupHeight);
    popup.show('blanket');
    popup.show(windowname);
    return false;
  },
  popupInfoShow: function(popupWidth, popupHeight){
    popup.popupInfo_pos(popupWidth, popupHeight);
    var blanket = document.getElementById('blanket');
    var popupInfo = document.getElementById('popupInfo');
    blanket.style.display = 'block';
    popupInfo.style.display = 'block';
    return false;
  },
  popupInfoClose: function(){
    var blanket = document.getElementById('blanket');
    var popupInfo = document.getElementById('popupInfo');
    blanket.style.display = 'none';
    popupInfo.style.display = 'none';
    return false;
  },

  blanket_size: function(){
    var blanket = document.getElementById('blanket');
    if(typeof window.innerWidth != 'undefined'){
      viewportheight = window.innerHeight;
    }else{
      viewportheight = document.documentElement.clientHeight;
    }
    if((viewportheight > document.body.parentNode.scrollHeight) && (viewportheight > document.body.parentNode.clientHeight)) {
      blanket_height = viewportheight;
    }else{
      if (document.body.parentNode.clientHeight > document.body.parentNode.scrollHeight) {
        blanket_height = document.body.parentNode.clientHeight;
      } else {
        blanket_height = document.body.parentNode.scrollHeight;
      }
    }
    
    blanket.style.height = blanket_height + 'px';
  },
  popupInfo_pos: function(popupWidth, popupHeight) {
    if (typeof window.innerWidth != 'undefined')
      viewportwidth = window.innerHeight;
    else
      viewportwidth = document.documentElement.clientHeight;
    if ((viewportwidth > document.body.parentNode.scrollWidth) && (viewportwidth > document.body.parentNode.clientWidth))
      window_width = viewportwidth;
    else {
      if (document.body.parentNode.clientWidth > document.body.parentNode.scrollWidth)
        window_width = document.body.parentNode.clientWidth;
      else
        window_width = document.body.parentNode.scrollWidth;
    }
    var popUpDiv = document.getElementById('popupInfo');
    window_width=window_width/2-(popupWidth/2);
    popUpDiv.style.left = window_width + 'px';
    popUpDiv.style.width = popupWidth + 'px';

    var scrollTop = html.scrollTop || body && body.scrollTop || 0;
    scrollTop -= html.clientTop; // IE<8
    popUpDiv.style.top = scrollTop + 100 + 'px';

    if(popupHeight)
      popUpDiv.style.height = popupHeight + 'px';
  }
};