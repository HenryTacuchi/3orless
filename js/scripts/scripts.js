$(document).ready(function(){	

	
	//disable backbutton
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
        // Register the event listener
        document.addEventListener("backbutton", onBackKeyDown, false);
        document.addEventListener("menubutton", onMenuKeyDown, false);
        document.addEventListener("pause", onPauseKeyDown, false);
    }

    // Handle the back button
    //
    function onBackKeyDown() {
    	//do nothing
    }

    function onMenuKeyDown() {
    	//do nothing
    	// alert("Menu");
    }

    function onPauseKeyDown() {
    	//do nothing
    	// alert("pause");
    }
    
	$('.itemName').click(function(){		
		// sidebar expand items when you click any category
		if($(this).hasClass('expand'))
			$(this).removeClass('expand');
		else{
			$('.itemName').removeClass('expand');
			$(this).addClass('expand');
		}

	});

	// $('.menu-item').click(function(){
	// 	// if($(".filters-marked").hasClass("hide"))
	// 	// 	$(".filters-mark ed").removeClass("hide").addClass("show");
	// 	// else
	// 	// 	$(".filters-marked").addClass("show");	
	// 	if($(".results").hasClass("hide"))
	// 		$(".results").removeClass("hide").addClass("show");
	// 	else
	// 		$(".results").addClass("show");		
	// 	// add or remove selected class when you click a filter from any category

	// 	if($(this).hasClass('selected')){
	// 		removeFilter($(this));
	// 		$(this).removeClass('selected');
	// 	}else{
	// 		addFilter($(this));
	// 		$(this).addClass('selected');			
	// 	}

	// 	checkFiltersMarked();

	// });

	$('.dropdown-menu li').click(function(){
		// add or remove selected class when you click a filter from any category
		if($('.sort-dropdown').hasClass('lowToHigh')){
			$('.sort-dropdown').removeClass('lowToHigh').addClass($(this).attr('class')).text($(this).text());
		}else{
			$('.sort-dropdown').removeClass('highToLow').addClass($(this).attr('class')).text($(this).text());
		}		
	});


	$('.swiper-wrapper').width($('main').width());


	$(document).on("click", ".filter",function(){
		// actions when you click a filter in filter section
		var data = $(this).attr('data-value');
		$('.menu-item').each(function() {  
	    if ( $(this).attr('data-value') == data ) {
	    		$(this).click();
	    }
	  });

	});
	

});

$(window).load(function(){
	//set colorPicker color
	var pathName = location.href.substring(location.href.lastIndexOf("/")+1);
	if(pathName == "config.html"){
		document.getElementById('valueBtn').jscolor.fromString(localStorage.colorBackground);	
	}
})

function addFilter( element ){
	var random = Math.floor((Math.random()*3)+1);  //random de 1 a 3
	$('.filters-marked').append(
		"<div class='filter filter-"+ random + " animated rubberBand setColor' data-value='"+ element.attr('data-value') +"'>" + element.text() + "</div>"
	);
	setColorApp();
}

function removeFilter(element){
	$('.filter').each(function() {  
    if ( element.attr('data-value') == $(this).attr('data-value') ) {
    		$(this).remove();
    }
  });
}

//add product item to cart
function addProductCartItem(){
	//validate if existst style, color and size
	if(!existsProductCart($(".txtStyleCode").text(),$(".txtColorCode").text(),$(".size-dropdown").text())){
		var product = '{"Product":';
	    localStorage.countProductCartItem++;   

	    product += '{'+    
	                    '"brandName": "' + $(".txtBrand").text() + '",' +
	                    '"colorCode": "' + $(".txtColorCode").text() + '",' +
	                    '"imageFile": "' + $(".main-img").attr("src").replace(/\\/g,"\\\\") + '",' +
	                    '"price": "' + $(".txtRetailPrice").text() + '",' +
	                    '"originalPrice": "' + $(".txtOriginalPrice").text() + '",' +
	                    '"size": "' + $(".size-dropdown").text() + '",' +
	                    '"styleCode": "' + $(".txtStyleCode").text() + '",' +
	                    '"styleName": "' + $(".txtStyle").text() + '"' +
	                    '}}';             
	    localStorage["cartItemProduct"+localStorage.countProductCartItem] = product; 
	    return true;
	}
	else{
		if (localStorage.current_lang == "es") 
			swal({
				title: "Mensaje",
				text:  "El producto ya ha sido agregado!",
				type: "warning",
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "¡Ok, Gracias!"
			});
		else{
			swal({
				title: "Message",
				text:  "Product has been already added!",
				type: "warning",
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Ok, Thanks!"
			});
		}
		return false;
	}
}

//validate if a product has been added to cart
function existsProductCart(searchStyleCode,searchColorCode,size){
	for (var i = 1; i <= localStorage.countProductCartItem; i++) {
		var productObject = JSON.parse(localStorage["cartItemProduct"+i]);
		if(productObject.Product.styleCode == searchStyleCode 
			&& productObject.Product.colorCode == searchColorCode && productObject.Product.size == size)
			return true;
	}
	return false;
}

