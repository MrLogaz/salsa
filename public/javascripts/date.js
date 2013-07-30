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