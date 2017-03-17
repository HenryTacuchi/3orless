$(document).ready(function(){
	setColorApp();


	$('input')
	.focus(function(){
		$(this).css('border-color',localStorage.colorBackground);
	})
	.blur(function(){
		$(this).css('border-color','');
	});
	$('.focus').css('border-color',localStorage.colorBackground);

	$('.checkbox-control').click(function(){
		if(!$(this).find('.checkbox').hasClass('checked'))
			$(this).find('.checkbox').css('background-color','#ffffff');
		else	{
			if (localStorage.colorBackground == undefined){
				$(this).find('.checkbox').css('background-color','#000066');
			}else{
				$(this).find('.checkbox').css('background-color',localStorage.colorBackground);
			}
		}		
	});
});

//set Color app
function setColorApp(){
	if(localStorage.colorBackground != undefined){    	    
    	$(".setBaColor").css('background-color',localStorage.colorBackground);
    	$(".setColor").css('color',localStorage.colorBackground);
    	$(".setBoColor").css('border-color',localStorage.colorBackground);    	
    }
}