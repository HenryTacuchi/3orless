$(document).ready(function(){

	$(".ordernumber").text("Order No: " + localStorage.orderNumber);
    $(".clientname").text(localStorage.currentFirstNameClient + " " + localStorage.currentLastNameClient);
   // $(".date").text(data.styleCode);

});