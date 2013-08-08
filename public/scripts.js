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
var curDate = new Date();
var date = {
	monthToStr: function(){
		var months = new Array("января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря");
		$('.date-month').each(function(){
			$(this).html(months[$(this).data('value')]);
		});
	},
	clearCurrentYear: function(){
		var currentYear = curDate.getFullYear();
		$('.date-year').each(function(){
			if($(this).data('value') == currentYear){
				$(this).hide();
			}
		});
	}
};
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
var image = {
	showPreview: function(previewId, fileId){
		var preview = document.getElementById(previewId);
		var file = $('#'+fileId)[0].files[0];
		popup.popupInputHide();
		var imgFilter = /^(image\/jpeg|image\/jpg|image\/png)$/i;
    if (! imgFilter.test(file.type)) {
      popup.popupInput(fileId, 'Изображение должно иметь расширение <b>jpeg, jpg</b> или <b>png</b>');
      previewClone = $("#"+previewId).prop('src', '').clone()
      $("#"+fileId).replaceWith($("#"+fileId).clone());
      $("#"+previewId).replaceWith(previewClone);
      return false;
    }
		var Reader = new FileReader();
    Reader.onload = function(e) {
      preview.src = e.target.result;
  	};
  	Reader.readAsDataURL(file);
	}
};
var html = document.documentElement;
var body = document.body;

var init = {
	common: function(){
		date.monthToStr();
		date.clearCurrentYear();
		popup.blanket_size();
	}
};
/**
 * jquery.Jcrop.min.js v0.9.12 (build:20130202)
 * jQuery Image Cropping Plugin - released under MIT License
 * Copyright (c) 2008-2013 Tapmodo Interactive LLC
 * https://github.com/tapmodo/Jcrop
 */
(function(a){a.Jcrop=function(b,c){function i(a){return Math.round(a)+"px"}function j(a){return d.baseClass+"-"+a}function k(){return a.fx.step.hasOwnProperty("backgroundColor")}function l(b){var c=a(b).offset();return[c.left,c.top]}function m(a){return[a.pageX-e[0],a.pageY-e[1]]}function n(b){typeof b!="object"&&(b={}),d=a.extend(d,b),a.each(["onChange","onSelect","onRelease","onDblClick"],function(a,b){typeof d[b]!="function"&&(d[b]=function(){})})}function o(a,b,c){e=l(D),bc.setCursor(a==="move"?a:a+"-resize");if(a==="move")return bc.activateHandlers(q(b),v,c);var d=_.getFixed(),f=r(a),g=_.getCorner(r(f));_.setPressed(_.getCorner(f)),_.setCurrent(g),bc.activateHandlers(p(a,d),v,c)}function p(a,b){return function(c){if(!d.aspectRatio)switch(a){case"e":c[1]=b.y2;break;case"w":c[1]=b.y2;break;case"n":c[0]=b.x2;break;case"s":c[0]=b.x2}else switch(a){case"e":c[1]=b.y+1;break;case"w":c[1]=b.y+1;break;case"n":c[0]=b.x+1;break;case"s":c[0]=b.x+1}_.setCurrent(c),bb.update()}}function q(a){var b=a;return bd.watchKeys
(),function(a){_.moveOffset([a[0]-b[0],a[1]-b[1]]),b=a,bb.update()}}function r(a){switch(a){case"n":return"sw";case"s":return"nw";case"e":return"nw";case"w":return"ne";case"ne":return"sw";case"nw":return"se";case"se":return"nw";case"sw":return"ne"}}function s(a){return function(b){return d.disabled?!1:a==="move"&&!d.allowMove?!1:(e=l(D),W=!0,o(a,m(b)),b.stopPropagation(),b.preventDefault(),!1)}}function t(a,b,c){var d=a.width(),e=a.height();d>b&&b>0&&(d=b,e=b/a.width()*a.height()),e>c&&c>0&&(e=c,d=c/a.height()*a.width()),T=a.width()/d,U=a.height()/e,a.width(d).height(e)}function u(a){return{x:a.x*T,y:a.y*U,x2:a.x2*T,y2:a.y2*U,w:a.w*T,h:a.h*U}}function v(a){var b=_.getFixed();b.w>d.minSelect[0]&&b.h>d.minSelect[1]?(bb.enableHandles(),bb.done()):bb.release(),bc.setCursor(d.allowSelect?"crosshair":"default")}function w(a){if(d.disabled)return!1;if(!d.allowSelect)return!1;W=!0,e=l(D),bb.disableHandles(),bc.setCursor("crosshair");var b=m(a);return _.setPressed(b),bb.update(),bc.activateHandlers(x,v,a.type.substring
(0,5)==="touch"),bd.watchKeys(),a.stopPropagation(),a.preventDefault(),!1}function x(a){_.setCurrent(a),bb.update()}function y(){var b=a("<div></div>").addClass(j("tracker"));return g&&b.css({opacity:0,backgroundColor:"white"}),b}function be(a){G.removeClass().addClass(j("holder")).addClass(a)}function bf(a,b){function t(){window.setTimeout(u,l)}var c=a[0]/T,e=a[1]/U,f=a[2]/T,g=a[3]/U;if(X)return;var h=_.flipCoords(c,e,f,g),i=_.getFixed(),j=[i.x,i.y,i.x2,i.y2],k=j,l=d.animationDelay,m=h[0]-j[0],n=h[1]-j[1],o=h[2]-j[2],p=h[3]-j[3],q=0,r=d.swingSpeed;c=k[0],e=k[1],f=k[2],g=k[3],bb.animMode(!0);var s,u=function(){return function(){q+=(100-q)/r,k[0]=Math.round(c+q/100*m),k[1]=Math.round(e+q/100*n),k[2]=Math.round(f+q/100*o),k[3]=Math.round(g+q/100*p),q>=99.8&&(q=100),q<100?(bh(k),t()):(bb.done(),bb.animMode(!1),typeof b=="function"&&b.call(bs))}}();t()}function bg(a){bh([a[0]/T,a[1]/U,a[2]/T,a[3]/U]),d.onSelect.call(bs,u(_.getFixed())),bb.enableHandles()}function bh(a){_.setPressed([a[0],a[1]]),_.setCurrent([a[2],
a[3]]),bb.update()}function bi(){return u(_.getFixed())}function bj(){return _.getFixed()}function bk(a){n(a),br()}function bl(){d.disabled=!0,bb.disableHandles(),bb.setCursor("default"),bc.setCursor("default")}function bm(){d.disabled=!1,br()}function bn(){bb.done(),bc.activateHandlers(null,null)}function bo(){G.remove(),A.show(),A.css("visibility","visible"),a(b).removeData("Jcrop")}function bp(a,b){bb.release(),bl();var c=new Image;c.onload=function(){var e=c.width,f=c.height,g=d.boxWidth,h=d.boxHeight;D.width(e).height(f),D.attr("src",a),H.attr("src",a),t(D,g,h),E=D.width(),F=D.height(),H.width(E).height(F),M.width(E+L*2).height(F+L*2),G.width(E).height(F),ba.resize(E,F),bm(),typeof b=="function"&&b.call(bs)},c.src=a}function bq(a,b,c){var e=b||d.bgColor;d.bgFade&&k()&&d.fadeTime&&!c?a.animate({backgroundColor:e},{queue:!1,duration:d.fadeTime}):a.css("backgroundColor",e)}function br(a){d.allowResize?a?bb.enableOnly():bb.enableHandles():bb.disableHandles(),bc.setCursor(d.allowSelect?"crosshair":"default"),bb
.setCursor(d.allowMove?"move":"default"),d.hasOwnProperty("trueSize")&&(T=d.trueSize[0]/E,U=d.trueSize[1]/F),d.hasOwnProperty("setSelect")&&(bg(d.setSelect),bb.done(),delete d.setSelect),ba.refresh(),d.bgColor!=N&&(bq(d.shade?ba.getShades():G,d.shade?d.shadeColor||d.bgColor:d.bgColor),N=d.bgColor),O!=d.bgOpacity&&(O=d.bgOpacity,d.shade?ba.refresh():bb.setBgOpacity(O)),P=d.maxSize[0]||0,Q=d.maxSize[1]||0,R=d.minSize[0]||0,S=d.minSize[1]||0,d.hasOwnProperty("outerImage")&&(D.attr("src",d.outerImage),delete d.outerImage),bb.refresh()}var d=a.extend({},a.Jcrop.defaults),e,f=navigator.userAgent.toLowerCase(),g=/msie/.test(f),h=/msie [1-6]\./.test(f);typeof b!="object"&&(b=a(b)[0]),typeof c!="object"&&(c={}),n(c);var z={border:"none",visibility:"visible",margin:0,padding:0,position:"absolute",top:0,left:0},A=a(b),B=!0;if(b.tagName=="IMG"){if(A[0].width!=0&&A[0].height!=0)A.width(A[0].width),A.height(A[0].height);else{var C=new Image;C.src=A[0].src,A.width(C.width),A.height(C.height)}var D=A.clone().removeAttr("id").
css(z).show();D.width(A.width()),D.height(A.height()),A.after(D).hide()}else D=A.css(z).show(),B=!1,d.shade===null&&(d.shade=!0);t(D,d.boxWidth,d.boxHeight);var E=D.width(),F=D.height(),G=a("<div />").width(E).height(F).addClass(j("holder")).css({position:"relative",backgroundColor:d.bgColor}).insertAfter(A).append(D);d.addClass&&G.addClass(d.addClass);var H=a("<div />"),I=a("<div />").width("100%").height("100%").css({zIndex:310,position:"absolute",overflow:"hidden"}),J=a("<div />").width("100%").height("100%").css("zIndex",320),K=a("<div />").css({position:"absolute",zIndex:600}).dblclick(function(){var a=_.getFixed();d.onDblClick.call(bs,a)}).insertBefore(D).append(I,J);B&&(H=a("<img />").attr("src",D.attr("src")).css(z).width(E).height(F),I.append(H)),h&&K.css({overflowY:"hidden"});var L=d.boundary,M=y().width(E+L*2).height(F+L*2).css({position:"absolute",top:i(-L),left:i(-L),zIndex:290}).mousedown(w),N=d.bgColor,O=d.bgOpacity,P,Q,R,S,T,U,V=!0,W,X,Y;e=l(D);var Z=function(){function a(){var a={},b=["touchstart"
,"touchmove","touchend"],c=document.createElement("div"),d;try{for(d=0;d<b.length;d++){var e=b[d];e="on"+e;var f=e in c;f||(c.setAttribute(e,"return;"),f=typeof c[e]=="function"),a[b[d]]=f}return a.touchstart&&a.touchend&&a.touchmove}catch(g){return!1}}function b(){return d.touchSupport===!0||d.touchSupport===!1?d.touchSupport:a()}return{createDragger:function(a){return function(b){return d.disabled?!1:a==="move"&&!d.allowMove?!1:(e=l(D),W=!0,o(a,m(Z.cfilter(b)),!0),b.stopPropagation(),b.preventDefault(),!1)}},newSelection:function(a){return w(Z.cfilter(a))},cfilter:function(a){return a.pageX=a.originalEvent.changedTouches[0].pageX,a.pageY=a.originalEvent.changedTouches[0].pageY,a},isSupported:a,support:b()}}(),_=function(){function h(d){d=n(d),c=a=d[0],e=b=d[1]}function i(a){a=n(a),f=a[0]-c,g=a[1]-e,c=a[0],e=a[1]}function j(){return[f,g]}function k(d){var f=d[0],g=d[1];0>a+f&&(f-=f+a),0>b+g&&(g-=g+b),F<e+g&&(g+=F-(e+g)),E<c+f&&(f+=E-(c+f)),a+=f,c+=f,b+=g,e+=g}function l(a){var b=m();switch(a){case"ne":return[
b.x2,b.y];case"nw":return[b.x,b.y];case"se":return[b.x2,b.y2];case"sw":return[b.x,b.y2]}}function m(){if(!d.aspectRatio)return p();var f=d.aspectRatio,g=d.minSize[0]/T,h=d.maxSize[0]/T,i=d.maxSize[1]/U,j=c-a,k=e-b,l=Math.abs(j),m=Math.abs(k),n=l/m,r,s,t,u;return h===0&&(h=E*10),i===0&&(i=F*10),n<f?(s=e,t=m*f,r=j<0?a-t:t+a,r<0?(r=0,u=Math.abs((r-a)/f),s=k<0?b-u:u+b):r>E&&(r=E,u=Math.abs((r-a)/f),s=k<0?b-u:u+b)):(r=c,u=l/f,s=k<0?b-u:b+u,s<0?(s=0,t=Math.abs((s-b)*f),r=j<0?a-t:t+a):s>F&&(s=F,t=Math.abs(s-b)*f,r=j<0?a-t:t+a)),r>a?(r-a<g?r=a+g:r-a>h&&(r=a+h),s>b?s=b+(r-a)/f:s=b-(r-a)/f):r<a&&(a-r<g?r=a-g:a-r>h&&(r=a-h),s>b?s=b+(a-r)/f:s=b-(a-r)/f),r<0?(a-=r,r=0):r>E&&(a-=r-E,r=E),s<0?(b-=s,s=0):s>F&&(b-=s-F,s=F),q(o(a,b,r,s))}function n(a){return a[0]<0&&(a[0]=0),a[1]<0&&(a[1]=0),a[0]>E&&(a[0]=E),a[1]>F&&(a[1]=F),[Math.round(a[0]),Math.round(a[1])]}function o(a,b,c,d){var e=a,f=c,g=b,h=d;return c<a&&(e=c,f=a),d<b&&(g=d,h=b),[e,g,f,h]}function p(){var d=c-a,f=e-b,g;return P&&Math.abs(d)>P&&(c=d>0?a+P:a-P),Q&&Math.abs
(f)>Q&&(e=f>0?b+Q:b-Q),S/U&&Math.abs(f)<S/U&&(e=f>0?b+S/U:b-S/U),R/T&&Math.abs(d)<R/T&&(c=d>0?a+R/T:a-R/T),a<0&&(c-=a,a-=a),b<0&&(e-=b,b-=b),c<0&&(a-=c,c-=c),e<0&&(b-=e,e-=e),c>E&&(g=c-E,a-=g,c-=g),e>F&&(g=e-F,b-=g,e-=g),a>E&&(g=a-F,e-=g,b-=g),b>F&&(g=b-F,e-=g,b-=g),q(o(a,b,c,e))}function q(a){return{x:a[0],y:a[1],x2:a[2],y2:a[3],w:a[2]-a[0],h:a[3]-a[1]}}var a=0,b=0,c=0,e=0,f,g;return{flipCoords:o,setPressed:h,setCurrent:i,getOffset:j,moveOffset:k,getCorner:l,getFixed:m}}(),ba=function(){function f(a,b){e.left.css({height:i(b)}),e.right.css({height:i(b)})}function g(){return h(_.getFixed())}function h(a){e.top.css({left:i(a.x),width:i(a.w),height:i(a.y)}),e.bottom.css({top:i(a.y2),left:i(a.x),width:i(a.w),height:i(F-a.y2)}),e.right.css({left:i(a.x2),width:i(E-a.x2)}),e.left.css({width:i(a.x)})}function j(){return a("<div />").css({position:"absolute",backgroundColor:d.shadeColor||d.bgColor}).appendTo(c)}function k(){b||(b=!0,c.insertBefore(D),g(),bb.setBgOpacity(1,0,1),H.hide(),l(d.shadeColor||d.bgColor,1),bb.
isAwake()?n(d.bgOpacity,1):n(1,1))}function l(a,b){bq(p(),a,b)}function m(){b&&(c.remove(),H.show(),b=!1,bb.isAwake()?bb.setBgOpacity(d.bgOpacity,1,1):(bb.setBgOpacity(1,1,1),bb.disableHandles()),bq(G,0,1))}function n(a,e){b&&(d.bgFade&&!e?c.animate({opacity:1-a},{queue:!1,duration:d.fadeTime}):c.css({opacity:1-a}))}function o(){d.shade?k():m(),bb.isAwake()&&n(d.bgOpacity)}function p(){return c.children()}var b=!1,c=a("<div />").css({position:"absolute",zIndex:240,opacity:0}),e={top:j(),left:j().height(F),right:j().height(F),bottom:j()};return{update:g,updateRaw:h,getShades:p,setBgColor:l,enable:k,disable:m,resize:f,refresh:o,opacity:n}}(),bb=function(){function k(b){var c=a("<div />").css({position:"absolute",opacity:d.borderOpacity}).addClass(j(b));return I.append(c),c}function l(b,c){var d=a("<div />").mousedown(s(b)).css({cursor:b+"-resize",position:"absolute",zIndex:c}).addClass("ord-"+b);return Z.support&&d.bind("touchstart.jcrop",Z.createDragger(b)),J.append(d),d}function m(a){var b=d.handleSize,e=l(a,c++
).css({opacity:d.handleOpacity}).addClass(j("handle"));return b&&e.width(b).height(b),e}function n(a){return l(a,c++).addClass("jcrop-dragbar")}function o(a){var b;for(b=0;b<a.length;b++)g[a[b]]=n(a[b])}function p(a){var b,c;for(c=0;c<a.length;c++){switch(a[c]){case"n":b="hline";break;case"s":b="hline bottom";break;case"e":b="vline right";break;case"w":b="vline"}e[a[c]]=k(b)}}function q(a){var b;for(b=0;b<a.length;b++)f[a[b]]=m(a[b])}function r(a,b){d.shade||H.css({top:i(-b),left:i(-a)}),K.css({top:i(b),left:i(a)})}function t(a,b){K.width(Math.round(a)).height(Math.round(b))}function v(){var a=_.getFixed();_.setPressed([a.x,a.y]),_.setCurrent([a.x2,a.y2]),w()}function w(a){if(b)return x(a)}function x(a){var c=_.getFixed();t(c.w,c.h),r(c.x,c.y),d.shade&&ba.updateRaw(c),b||A(),a?d.onSelect.call(bs,u(c)):d.onChange.call(bs,u(c))}function z(a,c,e){if(!b&&!c)return;d.bgFade&&!e?D.animate({opacity:a},{queue:!1,duration:d.fadeTime}):D.css("opacity",a)}function A(){K.show(),d.shade?ba.opacity(O):z(O,!0),b=!0}function B
(){F(),K.hide(),d.shade?ba.opacity(1):z(1),b=!1,d.onRelease.call(bs)}function C(){h&&J.show()}function E(){h=!0;if(d.allowResize)return J.show(),!0}function F(){h=!1,J.hide()}function G(a){a?(X=!0,F()):(X=!1,E())}function L(){G(!1),v()}var b,c=370,e={},f={},g={},h=!1;d.dragEdges&&a.isArray(d.createDragbars)&&o(d.createDragbars),a.isArray(d.createHandles)&&q(d.createHandles),d.drawBorders&&a.isArray(d.createBorders)&&p(d.createBorders),a(document).bind("touchstart.jcrop-ios",function(b){a(b.currentTarget).hasClass("jcrop-tracker")&&b.stopPropagation()});var M=y().mousedown(s("move")).css({cursor:"move",position:"absolute",zIndex:360});return Z.support&&M.bind("touchstart.jcrop",Z.createDragger("move")),I.append(M),F(),{updateVisible:w,update:x,release:B,refresh:v,isAwake:function(){return b},setCursor:function(a){M.css("cursor",a)},enableHandles:E,enableOnly:function(){h=!0},showHandles:C,disableHandles:F,animMode:G,setBgOpacity:z,done:L}}(),bc=function(){function f(b){M.css({zIndex:450}),b?a(document).bind("touchmove.jcrop"
,k).bind("touchend.jcrop",l):e&&a(document).bind("mousemove.jcrop",h).bind("mouseup.jcrop",i)}function g(){M.css({zIndex:290}),a(document).unbind(".jcrop")}function h(a){return b(m(a)),!1}function i(a){return a.preventDefault(),a.stopPropagation(),W&&(W=!1,c(m(a)),bb.isAwake()&&d.onSelect.call(bs,u(_.getFixed())),g(),b=function(){},c=function(){}),!1}function j(a,d,e){return W=!0,b=a,c=d,f(e),!1}function k(a){return b(m(Z.cfilter(a))),!1}function l(a){return i(Z.cfilter(a))}function n(a){M.css("cursor",a)}var b=function(){},c=function(){},e=d.trackDocument;return e||M.mousemove(h).mouseup(i).mouseout(i),D.before(M),{activateHandlers:j,setCursor:n}}(),bd=function(){function e(){d.keySupport&&(b.show(),b.focus())}function f(a){b.hide()}function g(a,b,c){d.allowMove&&(_.moveOffset([b,c]),bb.updateVisible(!0)),a.preventDefault(),a.stopPropagation()}function i(a){if(a.ctrlKey||a.metaKey)return!0;Y=a.shiftKey?!0:!1;var b=Y?10:1;switch(a.keyCode){case 37:g(a,-b,0);break;case 39:g(a,b,0);break;case 38:g(a,0,-b);break;
case 40:g(a,0,b);break;case 27:d.allowSelect&&bb.release();break;case 9:return!0}return!1}var b=a('<input type="radio" />').css({position:"fixed",left:"-120px",width:"12px"}).addClass("jcrop-keymgr"),c=a("<div />").css({position:"absolute",overflow:"hidden"}).append(b);return d.keySupport&&(b.keydown(i).blur(f),h||!d.fixedSupport?(b.css({position:"absolute",left:"-20px"}),c.append(b).insertBefore(D)):b.insertBefore(D)),{watchKeys:e}}();Z.support&&M.bind("touchstart.jcrop",Z.newSelection),J.hide(),br(!0);var bs={setImage:bp,animateTo:bf,setSelect:bg,setOptions:bk,tellSelect:bi,tellScaled:bj,setClass:be,disable:bl,enable:bm,cancel:bn,release:bb.release,destroy:bo,focus:bd.watchKeys,getBounds:function(){return[E*T,F*U]},getWidgetSize:function(){return[E,F]},getScaleFactor:function(){return[T,U]},getOptions:function(){return d},ui:{holder:G,selection:K}};return g&&G.bind("selectstart",function(){return!1}),A.data("Jcrop",bs),bs},a.fn.Jcrop=function(b,c){var d;return this.each(function(){if(a(this).data("Jcrop")){if(
b==="api")return a(this).data("Jcrop");a(this).data("Jcrop").setOptions(b)}else this.tagName=="IMG"?a.Jcrop.Loader(this,function(){a(this).css({display:"block",visibility:"hidden"}),d=a.Jcrop(this,b),a.isFunction(c)&&c.call(d)}):(a(this).css({display:"block",visibility:"hidden"}),d=a.Jcrop(this,b),a.isFunction(c)&&c.call(d))}),this},a.Jcrop.Loader=function(b,c,d){function g(){f.complete?(e.unbind(".jcloader"),a.isFunction(c)&&c.call(f)):window.setTimeout(g,50)}var e=a(b),f=e[0];e.bind("load.jcloader",g).bind("error.jcloader",function(b){e.unbind(".jcloader"),a.isFunction(d)&&d.call(f)}),f.complete&&a.isFunction(c)&&(e.unbind(".jcloader"),c.call(f))},a.Jcrop.defaults={allowSelect:!0,allowMove:!0,allowResize:!0,trackDocument:!0,baseClass:"jcrop",addClass:null,bgColor:"black",bgOpacity:.6,bgFade:!1,borderOpacity:.4,handleOpacity:.5,handleSize:null,aspectRatio:0,keySupport:!0,createHandles:["n","s","e","w","nw","ne","se","sw"],createDragbars:["n","s","e","w"],createBorders:["n","s","e","w"],drawBorders:!0,dragEdges
:!0,fixedSupport:!0,touchSupport:null,shade:null,boxWidth:0,boxHeight:0,boundary:2,fadeTime:400,animationDelay:20,swingSpeed:3,minSelect:[0,0],maxSize:[0,0],minSize:[0,0],onChange:function(){},onSelect:function(){},onDblClick:function(){},onRelease:function(){}}})(jQuery);
/**
*  Ajax Autocomplete for jQuery, version 1.2.7
*  (c) 2013 Tomas Kirda
*
*  Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.
*  For details, see the web site: http://www.devbridge.com/projects/autocomplete/jquery/
*
*/
(function(e){"function"===typeof define&&define.amd?define(["jquery"],e):e(jQuery)})(function(e){function g(a,b){var c=function(){},c={autoSelectFirst:!1,appendTo:"body",serviceUrl:null,lookup:null,onSelect:null,width:"auto",minChars:1,maxHeight:300,deferRequestBy:0,params:{},formatResult:g.formatResult,delimiter:null,zIndex:9999,type:"GET",noCache:!1,onSearchStart:c,onSearchComplete:c,containerClass:"autocomplete-suggestions",tabDisabled:!1,dataType:"text",lookupFilter:function(a,b,c){return-1!==
a.value.toLowerCase().indexOf(c)},paramName:"query",transformResult:function(a){return"string"===typeof a?e.parseJSON(a):a}};this.element=a;this.el=e(a);this.suggestions=[];this.badQueries=[];this.selectedIndex=-1;this.currentValue=this.element.value;this.intervalId=0;this.cachedResponse=[];this.onChange=this.onChangeInterval=null;this.isLocal=this.ignoreValueChange=!1;this.suggestionsContainer=null;this.options=e.extend({},c,b);this.classes={selected:"autocomplete-selected",suggestion:"autocomplete-suggestion"};
this.initialize();this.setOptions(b)}var h={extend:function(a,b){return e.extend(a,b)},createNode:function(a){var b=document.createElement("div");b.innerHTML=a;return b.firstChild}};g.utils=h;e.Autocomplete=g;g.formatResult=function(a,b){var c="("+b.replace(RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\)","g"),"\\$1")+")";return a.value.replace(RegExp(c,"gi"),"<strong>$1</strong>")};g.prototype={killerFn:null,initialize:function(){var a=this,b="."+a.classes.suggestion,c=a.classes.selected,
d=a.options,f;a.element.setAttribute("autocomplete","off");a.killerFn=function(b){0===e(b.target).closest("."+a.options.containerClass).length&&(a.killSuggestions(),a.disableKillerFn())};if(!d.width||"auto"===d.width)d.width=a.el.outerWidth();a.suggestionsContainer=g.utils.createNode('<div class="'+d.containerClass+'" style="position: absolute; display: none;"></div>');f=e(a.suggestionsContainer);f.appendTo(d.appendTo).width(d.width);f.on("mouseover.autocomplete",b,function(){a.activate(e(this).data("index"))});
f.on("mouseout.autocomplete",function(){a.selectedIndex=-1;f.children("."+c).removeClass(c)});f.on("click.autocomplete",b,function(){a.select(e(this).data("index"),!1)});a.fixPosition();if(window.opera)a.el.on("keypress.autocomplete",function(b){a.onKeyPress(b)});else a.el.on("keydown.autocomplete",function(b){a.onKeyPress(b)});a.el.on("keyup.autocomplete",function(b){a.onKeyUp(b)});a.el.on("blur.autocomplete",function(){a.onBlur()});a.el.on("focus.autocomplete",function(){a.fixPosition()})},onBlur:function(){this.enableKillerFn()},
setOptions:function(a){var b=this.options;h.extend(b,a);if(this.isLocal=e.isArray(b.lookup))b.lookup=this.verifySuggestionsFormat(b.lookup);e(this.suggestionsContainer).css({"max-height":b.maxHeight+"px",width:b.width+"px","z-index":b.zIndex})},clearCache:function(){this.cachedResponse=[];this.badQueries=[]},clear:function(){this.clearCache();this.currentValue=null;this.suggestions=[]},disable:function(){this.disabled=!0},enable:function(){this.disabled=!1},fixPosition:function(){var a;"body"===this.options.appendTo&&
(a=this.el.offset(),e(this.suggestionsContainer).css({top:a.top+this.el.outerHeight()+"px",left:a.left+"px"}))},enableKillerFn:function(){e(document).on("click.autocomplete",this.killerFn)},disableKillerFn:function(){e(document).off("click.autocomplete",this.killerFn)},killSuggestions:function(){var a=this;a.stopKillSuggestions();a.intervalId=window.setInterval(function(){a.hide();a.stopKillSuggestions()},300)},stopKillSuggestions:function(){window.clearInterval(this.intervalId)},onKeyPress:function(a){if(!this.disabled&&
!this.visible&&40===a.keyCode&&this.currentValue)this.suggest();else if(!this.disabled&&this.visible){switch(a.keyCode){case 27:this.el.val(this.currentValue);this.hide();break;case 9:case 13:if(-1===this.selectedIndex){this.hide();return}this.select(this.selectedIndex,13===a.keyCode);if(9===a.keyCode&&!1===this.options.tabDisabled)return;break;case 38:this.moveUp();break;case 40:this.moveDown();break;default:return}a.stopImmediatePropagation();a.preventDefault()}},onKeyUp:function(a){var b=this;
if(!b.disabled){switch(a.keyCode){case 38:case 40:return}clearInterval(b.onChangeInterval);if(b.currentValue!==b.el.val())if(0<b.options.deferRequestBy)b.onChangeInterval=setInterval(function(){b.onValueChange()},b.options.deferRequestBy);else b.onValueChange()}},onValueChange:function(){var a;clearInterval(this.onChangeInterval);this.currentValue=this.element.value;a=this.getQuery(this.currentValue);this.selectedIndex=-1;this.ignoreValueChange?this.ignoreValueChange=!1:a.length<this.options.minChars?
this.hide():this.getSuggestions(a)},getQuery:function(a){var b=this.options.delimiter;if(!b)return e.trim(a);a=a.split(b);return e.trim(a[a.length-1])},getSuggestionsLocal:function(a){var b=a.toLowerCase(),c=this.options.lookupFilter;return{suggestions:e.grep(this.options.lookup,function(d){return c(d,a,b)})}},getSuggestions:function(a){var b,c=this,d=c.options,f=d.serviceUrl;(b=c.isLocal?c.getSuggestionsLocal(a):c.cachedResponse[a])&&e.isArray(b.suggestions)?(c.suggestions=b.suggestions,c.suggest()):
c.isBadQuery(a)||(d.params[d.paramName]=a,!1!==d.onSearchStart.call(c.element,d.params)&&(e.isFunction(d.serviceUrl)&&(f=d.serviceUrl.call(c.element,a)),e.ajax({url:f,data:d.ignoreParams?null:d.params,type:d.type,dataType:d.dataType}).done(function(b){c.processResponse(b,a);d.onSearchComplete.call(c.element,a)})))},isBadQuery:function(a){for(var b=this.badQueries,c=b.length;c--;)if(0===a.indexOf(b[c]))return!0;return!1},hide:function(){this.visible=!1;this.selectedIndex=-1;e(this.suggestionsContainer).hide()},
suggest:function(){if(0===this.suggestions.length)this.hide();else{var a=this.options.formatResult,b=this.getQuery(this.currentValue),c=this.classes.suggestion,d=this.classes.selected,f=e(this.suggestionsContainer),g="";e.each(this.suggestions,function(d,e){g+='<div class="'+c+'" data-index="'+d+'">'+a(e,b)+"</div>"});f.html(g).show();this.visible=!0;this.options.autoSelectFirst&&(this.selectedIndex=0,f.children().first().addClass(d))}},verifySuggestionsFormat:function(a){return a.length&&"string"===
typeof a[0]?e.map(a,function(a){return{value:a,data:null}}):a},processResponse:function(a,b){var c=this.options,d=c.transformResult(a,b);d.suggestions=this.verifySuggestionsFormat(d.suggestions);c.noCache||(this.cachedResponse[d[c.paramName]]=d,0===d.suggestions.length&&this.badQueries.push(d[c.paramName]));b===this.getQuery(this.currentValue)&&(this.suggestions=d.suggestions,this.suggest())},activate:function(a){var b=this.classes.selected,c=e(this.suggestionsContainer),d=c.children();c.children("."+
b).removeClass(b);this.selectedIndex=a;return-1!==this.selectedIndex&&d.length>this.selectedIndex?(a=d.get(this.selectedIndex),e(a).addClass(b),a):null},select:function(a,b){var c=this.suggestions[a];c&&(this.el.val(c),this.ignoreValueChange=b,this.hide(),this.onSelect(a))},moveUp:function(){-1!==this.selectedIndex&&(0===this.selectedIndex?(e(this.suggestionsContainer).children().first().removeClass(this.classes.selected),this.selectedIndex=-1,this.el.val(this.currentValue)):this.adjustScroll(this.selectedIndex-
1))},moveDown:function(){this.selectedIndex!==this.suggestions.length-1&&this.adjustScroll(this.selectedIndex+1)},adjustScroll:function(a){var b=this.activate(a),c,d;b&&(b=b.offsetTop,c=e(this.suggestionsContainer).scrollTop(),d=c+this.options.maxHeight-25,b<c?e(this.suggestionsContainer).scrollTop(b):b>d&&e(this.suggestionsContainer).scrollTop(b-this.options.maxHeight+25),this.el.val(this.getValue(this.suggestions[a].value)))},onSelect:function(a){var b=this.options.onSelect;a=this.suggestions[a];
this.el.val(this.getValue(a.value));e.isFunction(b)&&b.call(this.element,a)},getValue:function(a){var b=this.options.delimiter,c;if(!b)return a;c=this.currentValue;b=c.split(b);return 1===b.length?a:c.substr(0,c.length-b[b.length-1].length)+a},dispose:function(){this.el.off(".autocomplete").removeData("autocomplete");this.disableKillerFn();e(this.suggestionsContainer).remove()}};e.fn.autocomplete=function(a,b){return 0===arguments.length?this.first().data("autocomplete"):this.each(function(){var c=
e(this),d=c.data("autocomplete");if("string"===typeof a){if(d&&"function"===typeof d[a])d[a](b)}else d&&d.dispose&&d.dispose(),d=new g(this,a),c.data("autocomplete",d)})}});
// (function($){
//     $(function() {
//         var token = '51fa49542fb2b4206b000004';
//         var key = '48b344a5f1002c6ef5354c9eda3a4a0ff58f2bbc';        
        
//         var city = $( '[name="city"]' );
//         var street = $( '[name="address"]' );
//         var building = $( '[name="building"]' );
//         var buildingAdd = $( '[name="building-add"]' );

//         var map = null;
//         var placemark = null;
//         var map_created = false;

//         var Label = function( obj, query ){
//             var label = '';

//             if(obj.name){
//                 if(obj.typeShort){
//                     label += '<span class="ac-s2">' + obj.typeShort + '. ' + '</span>';
//                 }

//                 if(query.length < obj.name.length){
//                     label += '<span class="ac-s">' + obj.name.substr(0, query.length) + '</span>';
//                     label += '<span class="ac-s2">' + obj.name.substr(query.length, obj.name.length - query.length) + '</span>';
//                 } else {
//                     label += '<span class="ac-s">' + obj.name + '</span>';
//                 }
//             }

//             if(obj.parents){
//                 for(var k = obj.parents.length-1; k>-1; k--){
//                     var parent = obj.parents[k];
//                     if(parent.name){
//                         if(label) label += '<span class="ac-st">, </span>';
//                         label += '<span class="ac-st">' + parent.name + ' ' + parent.typeShort + '.</span>';
//                     }
//                 }
//             }

//             return label;
//         };

//         var MapUpdate = function(){
//             var zoom = 12;
//             var address = '';

//             var cityVal = $.trim(city.val());
//             if(cityVal){
//                 var cityObj = city.data( "kladr-obj" );
//                 if(address) address += ', ';
//                 address += ( cityObj ? (cityObj.typeShort + ' ') : '' ) + cityVal;
//                 zoom = 10;
//             }

//             var streetVal = $.trim(street.val());
//             if(streetVal){
//                 var streetObj = street.data( "kladr-obj" );
//                 if(address) address += ', ';
//                 address += ( streetObj ? (streetObj.typeShort + ' ') : '' ) + streetVal;
//                 zoom = 15;
//             }

//             var buildingVal = $.trim(building.val());
//             if(buildingVal){
//                 var buildingObj = building.data( "kladr-obj" );
//                 if(address) address += ', ';
//                 address += ( buildingObj ? (buildingObj.typeShort + ' ') : '' ) + buildingVal;
//                 zoom = 16;
//             }

//             var buildingAddVal = $.trim(buildingAdd.val());
//             if(buildingAddVal){
//                 if(address) address += ', ';
//                 address += buildingAddVal;
//                 zoom = 16;
//             }

//             if(address && map_created){
//                 $('#map').show();
//                 var geocode = ymaps.geocode(address);
//                 geocode.then(function(res){
//                     map.geoObjects.each(function (geoObject) {
//                             map.geoObjects.remove(geoObject);
//                     });

//                     var position = res.geoObjects.get(0).geometry.getCoordinates();

//                     placemark = new ymaps.Placemark(position, {}, {});

//                     map.geoObjects.add(placemark);
//                     map.setCenter(position, zoom);
//                 });
//             }
//         }

//         city.kladr({
//             token: token,
//             key: key,
//             type: $.ui.kladrObjectType.CITY,
//             withParents: true,
//             label: Label,
//             filter: function(array, term){
//               var newArr = [];
//               for(i=0;i<array.length;i++){
//                 if(array[i].typeShort == "г"){
//                   newArr.push(array[i]);
//                 }
//               }
//               return newArr;
//             },
//             select: function( event, ui ) {
//                 city.data( "kladr-obj", ui.item.obj );
//                 // city.parent().find( 'label' ).text( ui.item.obj.type );
//                 street.kladr( 'option', { parentType: $.ui.kladrObjectType.CITY, parentId: ui.item.obj.id } );
//                 building.kladr( 'option', { parentType: $.ui.kladrObjectType.CITY, parentId: ui.item.obj.id } );
//                 MapUpdate();
//                 $('#ec_cityid').val(ui.item.obj.id);
//             }
//         });

//         street.kladr({
//             token: token,
//             key: key,
//             type: $.ui.kladrObjectType.STREET,
//             label: Label,
//             select: function( event, ui ) {
//                 street.data( "kladr-obj", ui.item.obj );
//                 // street.parent().find( 'label' ).text( ui.item.obj.type );
//                 building.kladr( 'option', { parentType: $.ui.kladrObjectType.CITY, parentId: ui.item.obj.id } );
//                 MapUpdate();
//             }
//         });

//         building.kladr({
//             token: token,
//             key: key,
//             type: $.ui.kladrObjectType.BUILDING,
//             label: Label,
//             select: function( event, ui ) {
//                 building.data( "kladr-obj", ui.item.obj );
//                 MapUpdate();
//             }
//         });

//         city.add(street).add(building).add(buildingAdd).change(function(){
//             MapUpdate();
//         });

//         ymaps.ready(function(){
//             if(map_created) return;
//             map_created = true;

//             map = new ymaps.Map('map', {
//                 center: [55.76, 37.64],
//                 zoom: 12
//             });

//             map.controls.add('smallZoomControl', { top: 5, left: 5 });
//         });
//     });
// })(jQuery);
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
var yamapCity = $(".city_for_map"),
    yamapStreet = $(".street_for_map"),
    yamapBuilding = $(".house_for_map");
var map = null;
var placemark = null;
var map_created = false;

var yamaps = {
  mapInit: function(){

    ymaps.ready(function(){
      
      if(map_created) return;
        map_created = true;
        map = new ymaps.Map('yamap', {
          center: [50.76, 40.64],
          zoom: 12
        });
        map.controls.add('smallZoomControl', { top: 5, left: 5 });
        yamapCity.add(yamapStreet).add(yamapBuilding).keypress(function(){
          yamaps.mapUpdate();
        });
        yamapCity.add(yamapStreet).add(yamapBuilding).change(function(){
          yamaps.mapUpdate();
        });
    });
  },
  mapUpdate: function(){
    var zoom = 12;
    var address = '';

    var cityVal = $.trim(yamapCity.val());
    if(cityVal){
        if(address) address += ', ';
        address += cityVal;
        zoom = 10;
    }

    var streetVal = $.trim(yamapStreet.val());
    if(streetVal){
        if(address) address += ', ';
        address += streetVal;
        zoom = 13;
    }

    var buildingVal = $.trim(yamapBuilding.val());
    if(buildingVal){
        if(address) address += ', ';
        address += buildingVal;
        zoom = 16;
    }

    if(address && map_created){
      $('#yamap').show();
      var geocode = ymaps.geocode(address);
      geocode.then(function(res){
        map.geoObjects.each(function (geoObject) {
          map.geoObjects.remove(geoObject);
        });
        
        var position = res.geoObjects.get(0).geometry.getCoordinates();
        console.log(position);
        placemark = new ymaps.Placemark(position, {}, {});
        //http://api.yandex.ru/maps/jsbox/button_layout
        map.geoObjects.add(placemark);
        map.setCenter(position, zoom);
      });
    }
  }
}



//     $(function() {
//         var token = '51fa49542fb2b4206b000004';
//         var key = '48b344a5f1002c6ef5354c9eda3a4a0ff58f2bbc';        
        
//         var city = $( '[name="city"]' );
//         var street = $( '[name="address"]' );
//         var building = $( '[name="building"]' );
//         var buildingAdd = $( '[name="building-add"]' );


//         var Label = function( obj, query ){
//             var label = '';

//             if(obj.name){
//                 if(obj.typeShort){
//                     label += '<span class="ac-s2">' + obj.typeShort + '. ' + '</span>';
//                 }

//                 if(query.length < obj.name.length){
//                     label += '<span class="ac-s">' + obj.name.substr(0, query.length) + '</span>';
//                     label += '<span class="ac-s2">' + obj.name.substr(query.length, obj.name.length - query.length) + '</span>';
//                 } else {
//                     label += '<span class="ac-s">' + obj.name + '</span>';
//                 }
//             }

//             if(obj.parents){
//                 for(var k = obj.parents.length-1; k>-1; k--){
//                     var parent = obj.parents[k];
//                     if(parent.name){
//                         if(label) label += '<span class="ac-st">, </span>';
//                         label += '<span class="ac-st">' + parent.name + ' ' + parent.typeShort + '.</span>';
//                     }
//                 }
//             }

//             return label;
//         };

//         var 

//         city.kladr({
//             token: token,
//             key: key,
//             type: $.ui.kladrObjectType.CITY,
//             withParents: true,
//             label: Label,
//             filter: function(array, term){
//               var newArr = [];
//               for(i=0;i<array.length;i++){
//                 if(array[i].typeShort == "г"){
//                   newArr.push(array[i]);
//                 }
//               }
//               return newArr;
//             },
//             select: function( event, ui ) {
//                 city.data( "kladr-obj", ui.item.obj );
//                 // city.parent().find( 'label' ).text( ui.item.obj.type );
//                 street.kladr( 'option', { parentType: $.ui.kladrObjectType.CITY, parentId: ui.item.obj.id } );
//                 building.kladr( 'option', { parentType: $.ui.kladrObjectType.CITY, parentId: ui.item.obj.id } );
//                 MapUpdate();
//                 $('#ec_cityid').val(ui.item.obj.id);
//             }
//         });

//         street.kladr({
//             token: token,
//             key: key,
//             type: $.ui.kladrObjectType.STREET,
//             label: Label,
//             select: function( event, ui ) {
//                 street.data( "kladr-obj", ui.item.obj );
//                 // street.parent().find( 'label' ).text( ui.item.obj.type );
//                 building.kladr( 'option', { parentType: $.ui.kladrObjectType.CITY, parentId: ui.item.obj.id } );
//                 MapUpdate();
//             }
//         });

//         building.kladr({
//             token: token,
//             key: key,
//             type: $.ui.kladrObjectType.BUILDING,
//             label: Label,
//             select: function( event, ui ) {
//                 building.data( "kladr-obj", ui.item.obj );
//                 MapUpdate();
//             }
//         });

//         city.add(street).add(building).add(buildingAdd).change(function(){
//             MapUpdate();
//         });

//         ymaps.ready(function(){
//             if(map_created) return;
//             map_created = true;

//             map = new ymaps.Map('map', {
//                 center: [55.76, 37.64],
//                 zoom: 12
//             });

//             map.controls.add('smallZoomControl', { top: 5, left: 5 });
//         });
//     });
// })(jQuery);