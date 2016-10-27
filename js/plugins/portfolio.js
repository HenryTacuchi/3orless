/*
 * Portfolio Plugin for Codrops
 * author: Marcin Dziewulski 
 * url: http://www.mobily.pl or http://playground.mobily.pl
 * inspiration: http://pauljnoble.com
 * last modified: 11.08.2011
 * MIT License
 */


(function($){
    $.fn.portfolio = function(options) {
		var d = {
				image: {
					width: $(window).width(),
					height: $(window).height(),
					margin: 0
				},
				path: {
					width: 10,
					height: 10,
					marginTop: 5,
					marginLeft: 5
				},
				animationSpeed: 2000
		}; // default settings
		
		var s = $.extend({}, d, options); 


		
		
        return this.each(function(){
			var $t = $(this),
				plugin = {
					init: function(){
						this.set.position();
						this.paths.draw();
					},
					set: {
						position: function(){
							$t.find('.item').each(function(i){
								var t = $(this);
								t.css({ left: (s.image.width+s.image.margin)*i+'px' });
								t.find('div').each(function(j){
									var t = $(this);
									t.css({ top: (s.image.height+s.image.margin)*j+'px' });
								});
							});
						}
					},
					paths: {
						draw: function(){
							$t.append($('<div />').addClass('paths'));
							var path = $t.find('.paths'),
								items = $t.find('.item');
							items.each(function(i){
								var t = $(this), div = t.find('div');
								path.append($('<div />').addClass('path'+i).css({
										width: s.path.width+'px', 
										left: (s.path.width+s.path.marginLeft)*i+'px' 
									})
								);
								div.each(function(j){
									$('<a />').attr({ href: '#', rel: j }).css({ 
										width: s.path.width+'px',
										height: s.path.height+'px',
										top: (s.path.height+s.path.marginTop)*j+'px'  
									}).appendTo(path.find('.path'+i))
								});
							});
						}
					},
					position: {
						get: function(element){
							var top = element.position().top,
								left = element.position().left;
							plugin.position.check(top, left);
						},
						check: function(top, left){
							top = (top != 0) ? top-1 : top;
							var items = $t.find('.item'),
								size_left = items.length-1,
								max_left = -size_left*(s.image.width+s.image.margin),
								column = left*size_left/max_left,
								current = items.filter(function(){
									return parseInt($(this).css('left')) == -left;
								}),
								size_top = current.find('div').length-1,
								max_top = -size_top*(s.image.height+s.image.margin),
								row = top*size_top/max_top,
								arrows = $t.find('.arrows'), 
								up = arrows.find('.up'), down = arrows.find('.down'),
								next = arrows.find('.next'), prev = arrows.find('.prev');
							if (left==max_left){ next.hide(); } else { next.show(); }
							if (left<0) { prev.show(); } else { prev.hide(); }
							if (top==max_top){ down.hide(); } else { down.show(); }
							if (top<0) { up.show(); } else { up.hide(); }
							plugin.paths.classes(column, row);
						}
					}
				}

			plugin.init();	
        });

    };

}(jQuery));



