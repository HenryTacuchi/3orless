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

	$('.dropdown-menu li').click(function(){
		// add or remove selected class when you click a filter from any category
		if($('.sort-dropdown').hasClass('lowToHigh')){
			$('.sort-dropdown').removeClass('lowToHigh').addClass($(this).attr('class')).text($(this).text());
		}else{
			$('.sort-dropdown').removeClass('highToLow').addClass($(this).attr('class')).text($(this).text());
		}		
	});

	$('.checkbox-control').click(function(){
		if(!$(this).find('.checkbox').hasClass('checked'))
			$(this).find('.checkbox').addClass('checked');
		else
			$(this).find('.checkbox').removeClass('checked');
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
		if (localStorage.colorBackground != undefined && localStorage.colorBackground != "") {
		document.getElementById('valueBtn').jscolor.fromString(localStorage.colorBackground);	
		}
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

/* Redondea un Decimal a dos cifras */
(function() {
	/**
	* Ajuste decimal de un número.
	*
	* @param {String}  tipo  El tipo de ajuste.
	* @param {Number}  valor El numero.
	* @param {Integer} exp   El exponente (el logaritmo 10 del ajuste base).
	* @returns {Number} El valor ajustado.
	*/
	function decimalAdjust(type, value, exp) {
		// Si el exp no está definido o es cero...
		if (typeof exp === 'undefined' || +exp === 0) {
			return Math[type](value);
		}
		value = +value;
		exp = +exp;
		// Si el valor no es un número o el exp no es un entero...
		if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
			return NaN;
		}
		// Shift
		value = value.toString().split('e');
		value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
		// Shift back
		value = value.toString().split('e');
		return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
	}

	// Decimal round
	if (!Math.round10) {
		Math.round10 = function(value, exp) {
			return decimalAdjust('round', value, exp);
		};
	}
})();

//add product item to cart
function addProductCartItem(){
	//validate if existst style, color and size
	if(!existsProductCart($(".txtStyleCode").text(),$(".txtColorCode").text(),$(".size-dropdown").text())){
		var product = '{"Product":';
	    localStorage.countProductCartItem++;

	    /*FJ*/
		var totalPrice = 0, totalOriginalPrice = 0;
	    totalPrice = $(".txtRetailPrice").text().split('$');
	    totalPrice = Number(totalPrice[1]);
	    totalOriginalPrice = $(".txtOriginalPrice").text().split('$');
	    totalOriginalPrice = Number(totalOriginalPrice[1]);

	    if (Number(localStorage.countProductCartItem) > 0) {
	    	localStorage.totalPrice = Math.round10((Number(localStorage.totalPrice) + Number(totalPrice)), -2);
	    	localStorage.totalOriginalPrice = Math.round10((Number(localStorage.totalOriginalPrice) + Number(totalOriginalPrice)), -2);
	    } else {
	    	localStorage.totalPrice = Number(totalPrice);
	    	localStorage.totalOriginalPrice = Number(totalOriginalPrice);
	    }
	    /*FJ*/

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
		swal({
			title: localStorage.caption_modalProductAlreadyInsertedTitle,
			text:  localStorage.caption_modalProductAlreadyInsertedText,
			type: "warning",
			confirmButtonColor: "#DD6B55",
			confirmButtonText: localStorage.caption_txtConfirmButton
		});
	}
	return false;
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

