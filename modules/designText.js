exports.toHtml = function(text, callback){
  textHtml = text.replace(/\r\n/g,"<br />");
  callback(textHtml);
};