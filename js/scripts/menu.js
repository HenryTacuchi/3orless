$(document).ready(function(){

	//set image logo
    $(".logoApp").attr("src", localStorage.logo);
    
	$(".opt3").click(function(){
		localStorage.flag3orless = 1;
		window.location.href = "search3orless.html";
	})

	$(".opt2").click(function(){
		localStorage.flag3orless = 0;
		window.location.href = "searchKiosk.html";
	})

	$(".opt1").click(function(){
		localStorage.flag3orless = 0;
		window.location.href = "registration.html";
	})

	$(".btn-home").click(function(){
		window.location.href = "index.html";
	})
});