$(document).ready(function(){
	setCaptions();
	//set image logo
    $(".logoApp").attr("src", localStorage.logo);
    
	$(".opt4").click(function(){
		localStorage.flag3orless = 0;
		window.location.href = "pos.html";
	});
    
	$(".opt3").click(function(){
		localStorage.flag3orless = 1;
		window.location.href = "search3orless.html";
	});

	$(".opt2").click(function(){
		localStorage.flag3orless = 0;
		window.location.href = "searchKiosk.html";
	});

	$(".opt1").click(function(){
		localStorage.flag3orless = 0;
		window.location.href = "registration.html";
	});

	$(".btn-home").click(function(){
		window.location.href = "index.html";
	});

	if (localStorage.flagActivate3orless == 0){
		showPageElement(".opt3",false);		
	}else{
		showPageElement(".opt3",true);
	}
});

function setCaptions(){
	$(".option1").text(localStorage.caption_option1);
	$(".option2").text(localStorage.caption_option2);
	$(".option3").text(localStorage.caption_option3);
	$(".option4").text(localStorage.caption_option4);
}

//show or hide html element
function showPageElement(element,option){
    if(option){  
        if($(element).hasClass("hide"))
            $(element).removeClass("hide");
    }else{
        if($(element).hasClass("show"))
            $(element).removeClass("show").addClass("hide");
        else
            $(element).addClass("hide");
    }
}