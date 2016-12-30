var o = {
	init: function(){
		this.portfolio.init();
	},
	portfolio: {
		data: {
		},
		init: function(){
			$('.home').portfolio(o.portfolio.data);
		}
	}
}
$(function(){ o.init(); });

$(window).load(function(){
	
	$('img').width($(window).width()).height($(window).height());
	setInterval(function(){
		move();
	} , 3500);
});




function move(){
	var ran1 = Math.floor(Math.random()*localStorage.columnCountImages); /*columns*/
	var ran2 = Math.floor(Math.random()*localStorage.rowCountImages); /*rows*/

	// if numebr of images is odd, last path have only one child
	if(localStorage.countImagesOdd==1 && ran1 ==localStorage.columnCountImages-1)
		ran2 = 0;

	var t = $('.path'+ran1+' a:nth-child('+(ran2+1)+')'), row = t.attr('rel'), column = t.parent('div').attr('class').split('path')[1], 
		top = row*($(window).height()),
		left = column*($(window).width());

	$('.inside').animate({
		top: -top+'px',
		left: -left+'px'
	}, 1000, function(){


		var items = $('.item'),
		size_left = items.length-1,
		max_left = -size_left*($(window).width()),
		column = left*size_left/max_left,
		current = items.filter(function(){
			return parseInt(t.css('left')) == -left;
		}),
		size_top = current.find('div').length-1,
		max_top = -size_top*($(window).height()),
		row = top*size_top/max_top;

		var anchors = $('.paths').find('a'), anchor = anchors.filter(function(){
			col = t.parent('div').attr('class').split('path')[1], 
			r = t.attr('rel');
			return col == column && r == row;
		});
	});	
	return false;
}