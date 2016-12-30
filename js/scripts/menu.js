$(document).ready(function(){

	//disable backbutton
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
        // Register the event listener
        document.addEventListener("backbutton", onBackKeyDown, false);
    }

    // Handle the back button
    //
    function onBackKeyDown() {
    	//do nothing
    }
    
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