// overall delay for disappearance of animations
var delay=2500;
var removeAnimationFlipIn = false;

var page = '';
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

		   showLoading(true); 		   
		   BTPrinter.connect(function(data){
			    console.log("Success Connect");
			    console.log(data);
				BTPrinter.printText(function(data){
					console.log("Success PrintText");
					console.log(data);
					setTimeout(function(){
						BTPrinter.disconnect(function(data){
						    console.log("Success Disconnect");
						    console.log(data);		
							clearSearchPage();	
							showLoading(false);			  	
							window.location = "search3orless.html";
						},function(err){
						    console.log("Error Disconnect");
						    console.log(err);
						    showLoading(false);
						}, localStorage.printerName)
					},3000); 	
				},function(err){
					console.log("Error printText");
					console.log(err);					
					showLoading(false);
				}, page);				
			},function(err){
			    console.log("Error Connect");
			    console.log(err);
			    swal({
				  title: localStorage.caption_modalPrintTitle,
				  text: localStorage.caption_modalPrintText,
				  type: "warning",
				  showCancelButton: true,
				  confirmButtonColor: "#8fbf75",
				  confirmButtonText: localStorage.caption_txtConfirmButtonRetry,
				  cancelButtonColor: "#b9b9b9",
				  cancelButtonText: localStorage.caption_txtCancelButtonFinish,
				  closeOnConfirm: false,
				  closeOnCancel: false
				},
				function(isConfirm){
				  if (isConfirm) {
				    printTicket();
				  } else {
				    clearSearchPage();	
					showLoading(false);			  	
					window.location = "search3orless.html";
				  }
				});
			    showLoading(false);
			}, localStorage.printerName)
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    }
};


$(document).ready(function(){
	setCaptions();

	if(localStorage.currentFirstNameClient != undefined && localStorage.currentFirstNameClient != "")
		$(".txtFirstName").val(localStorage.currentFirstNameClient);

	if(localStorage.existOldCartItem == 0){
		$(".btn-recover").prop("disabled",true);
	}
	else{
		$(".btn-recover").prop("disabled",false);	
	}

	$('.txtFirstName').bind('keypress', function(event) {
    if(event.which == 13||event.which == 10) {
      $(".section-cart-items").show();
    }
    });


	$("input").focus(function(){
		$(".section-cart-items").hide();
	});

	$("input").blur(function(){
		$(".section-cart-items").show();
	});


    /*FJ*/
    if (Number(localStorage.totalPrice)>0) {
        $(".span-precio-total").text('$'+localStorage.totalPrice);
        $(".detail-total").text('$'+localStorage.totalPrice);
    }else{
        $(".span-precio-total").text('$0.00');
        $(".detail-total").text('$0.00');
    }
    $(".detail-count").text(localStorage.countProductCartItem);
    /*FJ*/
    if(localStorage.countProductCartItem==null ||  localStorage.countProductCartItem==0){
        $(".item-count").addClass("hide");
    }else{
        $(".item-count").text(localStorage.countProductCartItem);
    }
	
	getProductList();

	$(".btn-back").click(function(){
		localStorage.currentFirstNameClient = $(".txtFirstName").val();
		window.history.back();
	});

	//home button redirects to home screen
    $(".btn-home").click(function(){
        localStorage.currentFirstNameClient = $(".txtFirstName").val();
        window.location = "menu.html";
    });

    //clear button redirects to home screen
    $(".btn-clear-cart").click(function(){
    	localStorage.currentFirstNameClient = ""
        //remove all products from cart item and redirect to search screen
        clearSearchPage();
        window.location = "search3orless.html";
    });

    //show products from last cart
    $(".btn-recover").click(function(){
    	for (var i = 1; i <= localStorage.countProductLastCartItem ; i++) {
    		localStorage["cartItemProduct"+i] = localStorage["lastCartItemProduct"+i];
    	}
    	if(localStorage.countProductCartItem > localStorage.countProductLastCartItem){
			for (var i = localStorage.countProductLastCartItem*1 + 1; i <= localStorage.countProductCartItem ; i++) {				
				localStorage.removeItem("lastCartItemProduct"+i);
			}
		}
		
		if (localStorage.countProductLastCartItem == undefined) {
			localStorage.countProductCartItem = 0;
		} else {
			localStorage.countProductCartItem = localStorage.countProductLastCartItem;	
		}

		// window.location.reload();
		$(".items").html("");

		/*FJ*/
	    if(localStorage.countProductCartItem==null ||  localStorage.countProductCartItem==0){
	        $(".item-count").addClass("hide");
	    }else{
	        $(".item-count").text(localStorage.countProductCartItem);
	    }
		getProductList();
		setColorApp();

	    /*FJ*/
	    if (Number(localStorage.totalPrice)>0) {
	        $(".span-precio-total").text('$'+localStorage.totalPrice);
	        $(".detail-total").text('$'+localStorage.totalPrice);
	    }else{
	        $(".span-precio-total").text('$0.00');
	        $(".detail-total").text('$0.00');
	    }

	    $(".detail-count").text(localStorage.countProductCartItem);
	    /*FJ*/
    });

    //done button redirects to home screen
    $(".btn-done").click(function(){
    	localStorage.currentFirstNameClient = $(".txtFirstName").val();
    	$(".btn-done").prop("disabled",true);
    	$(".txtMessage").text(localStorage.caption_msgVerifyFields);
		$(".validations").addClass("hide");
		$(".validations").removeClass("animated fadeOutLeft");
    	var firstName = $(".txtFirstName").val();
    	var orderNumber = "";

    	//if name correct format
		if (firstName.length > 0 && localStorage.countProductCartItem > 0) { 			
			$.ajax({
		        type: "GET",
		        url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/GetNumberOrder/" + localStorage.storeNo ,
		        async: false,
		        contentType: "application/json",
		        crossdomain: true,
		        timeout: 10000,
		        beforeSend: function(){
		        	showLoading(true);
		        },
		        complete: function(){
		        	showLoading(false);
		        },
		        success: function (result) { 
		            if(result != -1){
		            	orderNumber = result;
		            	localStorage.orderNumber = orderNumber;
		            }

		            else
		            	orderNumber = "";
		        },
		        error: function (error) {
	        	    orderNumber = "";	       	
		        }
		    });
		    var messageorder = "";
		    if(orderNumber != ""){
		    	messageorder = localStorage.caption_modalOrderNumber.replace("orderNumber",orderNumber) + "\n";
		    }
			saveLastCartItem();
			swal({
			  title: localStorage.caption_modalTicketTitle,
			  text: messageorder + localStorage.caption_modalTicketText1.replace("firstName",firstName) + "\n" + localStorage.caption_modalTicketText2,
			  type: "success",
			  confirmButtonColor: "#8fbf75",
			  confirmButtonText: localStorage.caption_txtConfirmButton,				  
			  closeOnConfirm: false
			},
			function(){
				if (!(localStorage.printerName == undefined || localStorage.printerName =='')){
					loadPrint();
					printTicket();
				}
				else{
				    clearSearchPage();	
					showLoading(false);			  	
					window.location = "search3orless.html";
				}
			});	    	
		}    
		//if name or email format is wrong 			
	    else{
		    if($(".txtMessage").hasClass("success")){
				$(".txtMessage").removeClass("success").addClass("danger");
				$(".btn-mini-img").removeClass("success").addClass("danger").find('span').empty().html('&#xe645');
			}
			else{
				$(".txtMessage").addClass("danger");
				$(".btn-mini-img").addClass("danger").find('span').empty().html('&#xe645');
			}

			$(".validations").removeClass("hide").addClass("animated fadeInLeft");

			$(".txtMessage").html(localStorage.caption_msgVerifyFields);
			$(".validations").delay(delay).queue(function(){
			    $(this).addClass("animated fadeOutLeft").dequeue();
			});

			if (firstName.length==0){
				$(".txtFirstName").focus();
				$(".noFirstName").removeClass("hide").addClass("show");
				$(".noFirstName").text(localStorage.caption_msgCompleteRequiredField);
			}else{
				if($(".noFirstName").hasClass("show"))
					$(".noFirstName").removeClass("show").addClass("hide");
			}

			if(localStorage.countProductCartItem == 0){
				$(".txtMessage").html(caption_modalProductDetailTitle);
				$(".validations").delay(delay).queue(function(){
				    $(this).addClass("animated fadeOutLeft").dequeue();
				});
			}

		}	
		$(".btn-done").prop("disabled",false);

    });


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

    $(document).on("click",".btn-trash",function(){
    	removeAnimationFlipIn = true;
    	var i,indexDelete = localStorage.countProductCartItem;    	
    	var styleCode = $(this).attr("data-style");
    	var colorCode = $(this).attr("data-color");
    	var size = $(this).attr("data-size");

    	for (i = 1; i <= localStorage.countProductCartItem; i++) {
			var productObject = JSON.parse(localStorage["cartItemProduct"+i]);
			if(productObject.Product.styleCode == styleCode 
				&& productObject.Product.colorCode == colorCode 
				&& productObject.Product.size == size){
				indexDelete = i;

				/*FJ*/
				var temPrice = 0, temOriginalPrice = 0;
			    temPrice = productObject.Product.price.split('$');
			    temPrice = Number(temPrice[1]);
			    temOriginalPrice = productObject.Product.originalPrice.split('$');
			    temOriginalPrice = Number(temOriginalPrice[1]);
				if (localStorage.totalPrice > 0) {
					localStorage.totalPrice = Math.round10((Number(localStorage.totalPrice) - Number(temPrice)), -2);
				}
				if (localStorage.totalOriginalPrice > 0) {
					localStorage.totalOriginalPrice = Math.round10((Number(localStorage.totalOriginalPrice) - Number(temOriginalPrice)), -2);
				}
				/*FJ*/
			}
			if(i>indexDelete){
				localStorage["cartItemProduct"+(i-1)] = localStorage["cartItemProduct"+i];
			}
		}

		
		localStorage.removeItem("cartItemProduct" + localStorage.countProductCartItem);
		if(localStorage.countProductCartItem>0)
			localStorage.countProductCartItem--;

		$(this).parent().parent().removeClass('animated flipInX').addClass('animated fadeOutLeft');
		
		setTimeout(function(){
			$(".items").empty();

		    /*FJ*/
		    if (Number(localStorage.totalPrice)>0) {
		        $(".span-precio-total").text('$'+localStorage.totalPrice);
		        $(".detail-total").text('$'+localStorage.totalPrice);
		    }else{
		        $(".span-precio-total").text('$0.00');
		        $(".detail-total").text('$0.00');
		    }

		    $(".detail-count").text(localStorage.countProductCartItem);
		    /*FJ*/

			$(".item-count").text(localStorage.countProductCartItem);
			getProductList();
			setColorApp();}, 500);
		
    });

});

function loadPrint(){
	var currentdate = new Date(); 
	var datetime = currentdate.getDate() + "/"
	           + (currentdate.getMonth()+1)  + "/" 
	           + currentdate.getFullYear() + " "  
	           + currentdate.getHours() + ":"  
	           + currentdate.getMinutes() + ":" 
	           + currentdate.getSeconds();
	page = "           NICEKICKS\n"+
						'Ticket N°: ' + localStorage.orderNumber+'\n'+
						localStorage.currentFirstNameClient +'\n'+
						datetime+'\n\n'+
						'Cart Items\n';

	var totalMont=0;
   	var totalRealMont =0;

   	for (var i = 1; i <= localStorage.countProductCartItem; i++) {
		var productObject = JSON.parse(localStorage["cartItemProduct"+i]);
		
		var mont = Number(productObject.Product.price.substring(1));
		var montOriginal = Number(productObject.Product.originalPrice.substring(1));
		totalMont = totalMont + mont;
		totalRealMont = totalRealMont + montOriginal;
		var elementCartItem = 	'- Brand: '+productObject.Product.brandName+'\n'+
								'  Style: '+productObject.Product.styleName+'\n'+
								'  Color: '+productObject.Product.colorCode+'\n'+
								'  Size : '+productObject.Product.size+'\n'+
								'  Price: '+productObject.Product.price+'\n\n';
		page = page + elementCartItem;
	}			
	page = page +   'Total : '+totalMont.toFixed(2)+'\n'+
					'Saving: '+(totalRealMont-totalMont).toFixed(2)+'\n\n\n\n\n';
}

function getProductList(){
	/*FJ*/
	localStorage.totalPrice = 0;
	localStorage.totalOriginalPrice = 0;
	/*FJ*/

	for (var i = 1; i <= localStorage.countProductCartItem; i++) {
		var productObject = JSON.parse(localStorage["cartItemProduct"+i]);
		var classAnimated = "";
		
		/*FJ*/
		var temPrice = 0, temOriginalPrice = 0;
	    temPrice = productObject.Product.price.split('$');
	    temPrice = Number(temPrice[1]);
	    temOriginalPrice = productObject.Product.originalPrice.split('$');
	    temOriginalPrice = Number(temOriginalPrice[1]);
		
	    if (Number(localStorage.countProductCartItem) > 0) {
	    	localStorage.totalPrice = Math.round10((Number(localStorage.totalPrice) + Number(temPrice)), -2);
	    	localStorage.totalOriginalPrice = Math.round10((Number(localStorage.totalOriginalPrice) + Number(temOriginalPrice)), -2);
	    } else {
	    	localStorage.totalPrice = Number(temPrice);
	    	localStorage.totalOriginalPrice = Number(temOriginalPrice);
	    }
		/*FJ*/

		if(!removeAnimationFlipIn){
			classAnimated = "animated flipInX";        	
        }
		template = _.template($("#productCartItemTemplate").html());
        html = template({
            Class: "product-" + (i) + " " + classAnimated,
            path: productObject.Product.imageFile,
            styleCode: productObject.Product.styleCode,
            styleName: productObject.Product.styleName,
            colorCode: productObject.Product.colorCode,
            brandName: productObject.Product.brandName,
            size: productObject.Product.size,
            price: productObject.Product.price,
            sizeCode: productObject.Product.size
        });
        $(".items").append(html);
        $(".txtSize").text(localStorage.caption_lblSize + ":");
        $(".txtStyleName").text(localStorage.caption_txtStyleName + ":");
	}
    localStorage.totalPrice>0 ? $(".detail-total").html("$"+Math.round10(localStorage.totalPrice,-2)) : $(".detail-total").html("$0.00");
    localStorage.totalPrice>0 ? $(".span-total-price").html("$"+Math.round10(localStorage.totalPrice,-2)) : $(".span-total-price").html("$0.00");
}

//remove all variables related to search page from local storage
function clearSearchPage(){
	localStorage.removeItem("threeOrLessListBrandFilter");
	localStorage.removeItem("threeOrLessListClassFilter");
	localStorage.removeItem("threeOrLessListGenderFilter");
	localStorage.removeItem("threeOrLessListSizeFilter");
	localStorage.removeItem("threeOrLessListBrandFilterChecked");
	localStorage.removeItem("threeOrLessListClassFilterChecked");
	localStorage.removeItem("threeOrLessListGenderFilterChecked");
	localStorage.removeItem("threeOrLessListSizeFilterChecked");
	localStorage.removeItem("threeOrLessProductList");
	localStorage.removeItem("threeOrLessCountProductFiltered");
	localStorage.threeOrLessOrderResults = "";
	localStorage.removeItem("indexProductSelected");
	localStorage.removeItem("resultsProductColorCodeSelected");
	localStorage.removeItem("resultsProductStyleCodeSelected");
	localStorage.removeItem("currentFirstNameClient");

	for (var i = 1; i <= localStorage.countProductCartItem; i++) {
		localStorage.removeItem("cartItemProduct" + (i));
	}
	localStorage.countProductCartItem = 0;
	/*FJ*/
	localStorage.totalPrice = 0;
	localStorage.totalOriginalPrice = 0;
	/*FJ*/
}

//show loader
function showLoading(option){
	//show
	if(option){  
		if($(".loader").hasClass("hide"))
			$(".loader").removeClass("hide").addClass("show");
		else
			$(".loader").addClass("show");
	}
	//hide
	else{
		if($(".loader").hasClass("show"))
			$(".loader").removeClass("show").addClass("hide");
		else
			$(".loader").addClass("hide");
	}
}

//save a copy of last cart item
function saveLastCartItem(){
	//if not exists old cart item, just copy products from new cart item
	if(localStorage.existOldCartItem == 0){
		for (var i = 1; i <= localStorage.countProductCartItem; i++) {
			localStorage["lastCartItemProduct"+i] = localStorage["cartItemProduct"+i];
		}
		localStorage.countProductLastCartItem = localStorage.countProductCartItem;
	}
	//copy new products and remove old product from cart item
	else{
		for (var i = 1; i <= localStorage.countProductCartItem; i++) {
			localStorage["lastCartItemProduct"+i] = localStorage["cartItemProduct"+i];
		}
		if(localStorage.countProductLastCartItem > localStorage.countProductCartItem){
			for (var i = localStorage.countProductCartItem*1 + 1; i <= localStorage.countProductLastCartItem ; i++) {				
				localStorage.removeItem("lastCartItemProduct"+i);
			}
		}
		localStorage.countProductLastCartItem = localStorage.countProductCartItem;
	}
	localStorage.existOldCartItem = 1;
}

function printTicket(){
	$.ajax({
        type: "GET",
        url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/Test",
        // async: false,
        contentType: "application/json",
        crossdomain: true,
        timeout: 10000,
        beforeSend: function(){
        	showLoading(true);
        },
        complete: function(){
        	// showLoading(false);
        },
        success: function (result) { 
            app.initialize()
        },
        error: function (error) {    	
        }
    });
}

$(window).load(function(){
    setSizeCart();
    setColorApp();
});

function setSizeCart(){
	$('.items').height($('.cart-items').height() - 50);
}

function setCaptions(){
	$(".lblCompleteFields").text(localStorage.caption_lblCompleteFields);
	$(".lblName").html(localStorage.caption_lblNameRequired);
	$(".lblLastName").html(localStorage.caption_lblLastNameRequired);
	$(".lblCartItems").text(localStorage.caption_lblCartItems);
	$(".btn-back").text(localStorage.caption_btnBack);
	$(".btn-clear-cart").text(localStorage.caption_btnClearCart);
	$(".btn-recover").text(localStorage.caption_btnRecover);
	$(".btn-done").text(localStorage.caption_btnDone);
	$(".txtEmail").attr('placeholder',localStorage.caption_txtEmail);
	$(".detail-count-text1").text(localStorage.caption_detailCountBagText1);
	$(".detail-count-text2").text(localStorage.caption_detailCountBagText2);
	$(".appName3orless").text(localStorage.caption_option3);
}
