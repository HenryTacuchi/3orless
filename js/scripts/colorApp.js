$(document).ready(function(){
	setColorApp();


	$('input')
	.focus(function(){
		$(this).css('border-color',localStorage.colorBackground);
	})
	.blur(function(){
		$(this).css('border-color','');
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