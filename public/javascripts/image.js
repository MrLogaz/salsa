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