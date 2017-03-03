
// overall delay for disappearance of animations
var delay=2500;
var removeAnimationFlipIn = false;

$(document).ready(function(){
	if(localStorage.currentFirstNameClient != undefined && localStorage.currentFirstNameClient != "")
		$(".txtFirstName").val(localStorage.currentFirstNameClient);
	if(localStorage.currentLastNameClient != undefined && localStorage.currentLastNameClient != "")
		$(".txtLastName").val(localStorage.currentLastNameClient);
	if(localStorage.currentEmailClient != undefined && localStorage.currentEmailClient != "")
		$(".txtEmail").val(localStorage.currentEmailClient);

	$('.txtFirstName').bind('keypress', function(event) {
    if(event.which == 13||event.which == 10) {
      $(".txtLastName").focus();
    }
    });

    $('.txtLastName').bind('keypress', function(event) {
    if(event.which == 13||event.which == 10) {
      $(".txtEmail").focus();
    }
    });

    $('.txtEmail').bind('keypress', function(event) {
    if(event.which == 13||event.which == 10) {
    	$(".txtEmail").blur();
      $(".section-cart-items").show();
    }
    });

    $(".section-form-user input").focus(function(){
		$(".section-cart-items").hide();
	});

	$(".section-form-user input").blur(function(){
		$(".section-cart-items").show();
	});

    $(".section-cart-items input").focus(function(){
		$(".section-form-user").hide();
	});

	$(".section-cart-items input").blur(function(){
		$(".section-form-user").show();
	});



	$(".txtEmail").emailautocomplete({
        suggClass: "custom-classname", //default: "eac-sugg". your custom classname (optional)
        domains: ["example.com"] //additional domains (optional)
    });

	$('.txtScan').on('input',function(){    	

		var txtSKU = $(".txtScan").val();
        if (txtSKU.length == 7){
      		$.ajax({
		        type: "GET",
		        url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/FindProductBySkuStoreforSO/" + txtSKU+ "/" + localStorage.storeNo ,
		        async: false,
		        contentType: "application/json",
		        crossdomain: true,
		        timeout: 10000,
		        beforeSend: function(){
		        	$(".validations").addClass("hide");
					$(".validations").removeClass("animated fadeOutLeft");
		        	showLoading(true);
		        },
		        complete: function(){
		        	$(".txtScan").val("");
		        	showLoading(false);
		        },
		        success: function (result) { 
		        	var data = result.findNProductBySkuStoreForSOResult;

		        	if(data != null){		
		        		var product = '{"Product":';
	    				localStorage.countScannedItem++;

	    				/*FJ*/
						var totalPrice = 0, totalOriginalPrice = 0;
					    totalPrice = $(".txtRetailPrice").text().split('$');
					    totalPrice = Number(totalPrice[1]);
					    totalOriginalPrice = $(".txtOriginalPrice").text().split('$');
					    totalOriginalPrice = Number(totalOriginalPrice[1]);

					    if (Number(localStorage.totalPrice) > 0) {
					    	localStorage.totalPrice = Math.round10((Number(localStorage.totalPrice) + Number(totalPrice)), -2);
					    	localStorage.totalOriginalPrice = Math.round10((Number(localStorage.totalOriginalPrice) + Number(totalOriginalPrice)), -2);
					    } else {
					    	localStorage.totalPrice = Number(totalPrice);
					    	localStorage.totalOriginalPrice = Number(totalOriginalPrice);
					    }
					    /*FJ*/

					    product += '{'+    
		                    '"brandName": "' + data.brandName + '",' +
		                    '"colorCode": "' + data.colorCode + '",' +
		                    '"imageFile": "' + data.imageFile.replace(/\\/g,"\\\\") + '",' +
		                    '"price": "' + data.price + '",' +
		                    '"size": "' + data.sizeCode + '",' +
		                    '"styleCode": "' + data.styleCode + '",' +
		                    '"styleName": "' + data.styleName + '",' +
		                    '"sku": "' + txtSKU + '"' +
		                    '}}';             
		    			localStorage["scannedItem"+localStorage.countScannedItem] = product; 
		    			setTimeout(function(){ 
							$(".items").empty();
							getProductList();
							setColorApp();}, 500);
		        	}
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

						if (localStorage.current_lang == "es") { $(".txtMessage").text("No se encontró ningún producto."); } 
						else { $(".txtMessage").text("The product wasn't found."); } 

						$(".validations").delay(delay).queue(function(){
						    $(this).addClass("animated fadeOutLeft").dequeue();
						});
		        	}
		            
		        },
		        error: function (error) {
	        	    //nothing 	
		        }
		    });
        }
	});

	/*FJ*/
    if(localStorage.countScannedItem==null ||  localStorage.countScannedItem==0){
        $(".item-count").addClass("hide");
    }else{
        $(".item-count").text(localStorage.countScannedItem);
    }
	
	getProductList();

	//cart button redirects to cart items screen
    $(".btn-cart").click(function(){
    	if(localStorage.countProductCartItem==null ||  localStorage.countProductCartItem==0){
			swal({
			  title: "El carrito está vacío",
			  text: "Aún no tiene productos en el carrito de compra.",
			  type: "info",
			  confirmButtonColor: "#8fbf75",
			  confirmButtonText: "Entendido",				  
			  closeOnConfirm: true
			});
    	}else{
        	window.location = "cart-items.html";
    	}
    });

 //    $(".btn-keyboard").click(function(){
 //    	var scan = $('.txtScan');
 //    	if(scan.is(":focus")) {
 //    		scan.focusout();
 //    	}else{
 //    		scan.focus();
 //    	}
		
	// });

	$(".btn-back").click(function(){
		localStorage.currentFirstNameClient = $(".txtFirstName").val();
        localStorage.currentLastNameClient = $(".txtLastName").val();
        localStorage.currentEmailClient = $(".txtEmail").val();
		window.history.back();
	});

	//home button redirects to home screen
    $(".btn-home").click(function(){
        localStorage.currentFirstNameClient = $(".txtFirstName").val();
        localStorage.currentLastNameClient = $(".txtLastName").val();
        localStorage.currentEmailClient = $(".txtEmail").val();
        window.location = "menu.html";
    });

    //clear button redirects to home screen
    $(".btn-clear-cart").click(function(){
    	localStorage.currentFirstNameClient = ""
        localStorage.currentLastNameClient = "";
        localStorage.currentEmailClient = "";
        //remove all products from cart item and redirect to search screen
        clearSearchPage();
    });

    //order button redirects to home screen
    $(".btn-order").click(function(){
    	var bodyJson;
    	localStorage.currentFirstNameClient = $(".txtFirstName").val();
        localStorage.currentLastNameClient = $(".txtLastName").val();
        localStorage.currentEmailClient = $(".txtEmail").val();
    	$(".btn-order").prop("disabled",true);
    	if (localStorage.current_lang == "es") { $(".txtMessage").text("Por favor, verifique los campos e inténtelo nuevamente!"); }
    	else{$(".txtMessage").text("Validation errors occurred. Please confirm the fields and submit it again.!");}
		$(".validations").addClass("hide");
		$(".validations").removeClass("animated fadeOutLeft");
    	var firstName = $(".txtFirstName").val();
    	var lastName = $(".txtLastName").val();
    	var email = $(".txtEmail").val();
    	var checkEmail = validateEmail();
    	var orderNumber = "";

    	//if name and email has correct format
		if (firstName.length > 0 && lastName.length > 0 && checkEmail != -1 && localStorage.countScannedItem > 0) { 
			bodyJson = "{" +
								'"holdHeader":' +
										"{" +
											'"total":"' + localStorage.totalPriceScannedItem + '",' +
											'"qty":"' + localStorage.countScannedItem + '"'+
										"}," +
								'"holdLine": [';
			for (var i = 1; i <= localStorage.countScannedItem; i++) {
				var productObject = JSON.parse(localStorage["scannedItem"+i]);
				bodyJson += JSON.stringify(productObject.Product);
				if (i != localStorage.countScannedItem) bodyJson += ",";
			}

			bodyJson += 	"]" +
						"}"
			$.ajax({
		        type: "POST",
		        url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/CreateSO/" + localStorage.storeNo + "/" + firstName + "/" + lastName + "/" + email,
		        async: false,
        		data: bodyJson,
		        contentType: "application/json",
		        crossdomain: true,
		        timeout: 10000,
		        beforeSend: function(){
		        	showLoading(true);
		        },
		        complete: function(){
		        	showLoading(false);
		        },
		        success: function (createSO) {

		            if (createSO != "") {
		            	if (localStorage.current_lang == "es") 
				   			swal({
							  title: "Confirmación de Orden",
							  text:  "Gracias "+ firstName +",\nSu orden ha sido generada correctamente.\n" + createSO,
							  type: "success",
							  confirmButtonColor: "#8fbf75",
							  confirmButtonText: "¡Ok, Genial!",				  
							  closeOnConfirm: false
							},
							function(){
							    clearSearchPage();	
								showLoading(false);			  	
								window.location = "search3orless.html";
							});
						else				
							swal({
							  title: "Order Confirmation",
							  text:  "Thank you "+ firstName +",\nYour order has been successfully generated.\n" + createSO,
							  type: "success",
							  confirmButtonColor: "#8fbf75",
							  confirmButtonText: "Ok, Cool!",				  
							  closeOnConfirm: false
							},
							function(){
							    clearSearchPage();	
								showLoading(false);			  	
								window.location = "search3orless.html";
							});
		            }
		            else{

		            }
		        },
		        error: function (error) {
		        	       console.log(error);    	
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

			if (localStorage.current_lang == "es") { $(".txtMessage").html("Verifique los campos e inténtelo nuevamente!"); }
			$(".validations").delay(delay).queue(function(){
			    $(this).addClass("animated fadeOutLeft").dequeue();
			});

			if (checkEmail==-1){
				$(".txtEmail").focus();
				$(".noEmail").removeClass("hide").addClass("show");

				if (email.length==0){
					if (localStorage.current_lang == "es") { $(".noEmail").text("Complete el campo requerido!"); } 
				}else{
					if (localStorage.current_lang == "es") { $(".noEmail").text("El formato de email es incorrecto!"); } 
					else { $(".noEmail").text("Email format is wrong!"); }
				}
			}else{
				if($(".noEmail").hasClass("show"))
					$(".noEmail").removeClass("show").addClass("hide");
			}

			if (lastName.length==0){
				$(".txtLastName").focus();
				$(".noLastName").removeClass("hide").addClass("show");
				if (localStorage.current_lang == "es") { $(".noLastName").text("Complete el campo requerido!"); }
			}else{
				if($(".noLastName").hasClass("show"))
					$(".noLastName").removeClass("show").addClass("hide");
			}

			if (firstName.length==0){
				$(".txtFirstName").focus();
				$(".noFirstName").removeClass("hide").addClass("show");
				if (localStorage.current_lang == "es") { $(".noFirstName").text("Complete el campo requerido!"); }
			}else{
				if($(".noFirstName").hasClass("show"))
					$(".noFirstName").removeClass("show").addClass("hide");
			}

			if(localStorage.countProductCartItem == 0){
				if (localStorage.current_lang == "es") { $(".txtMessage").html("No hay productos agregados.!"); }
				else { $(".txtMessage").html("There are no cart items!"); }
				$(".validations").delay(delay).queue(function(){
				    $(this).addClass("animated fadeOutLeft").dequeue();
				});
			}

		}	
		$(".btn-order").prop("disabled",false);

    });

    $(document).on("click",".btn-trash",function(){
    	removeAnimationFlipIn = true;
    	var i,indexDelete = localStorage.countScannedItem;
    	// var styleCode = $(this).attr("data-style");
    	// var colorCode = $(this).attr("data-color");    	
    	// var size = $(this).attr("data-size");
    	var sku = $(this).attr("data-sku");
    	var found = false;
    	for (i = 1; i <= localStorage.countScannedItem; i++) {
			var productObject = JSON.parse(localStorage["scannedItem"+i]);
			// if(productObject.Product.styleCode == styleCode 
			// 	&& productObject.Product.colorCode == colorCode
			// 	&& productObject.Product.size == size)
			if(productObject.Product.sku == sku && found == false){
				found = true;
				indexDelete = i;
			}
			if(i>indexDelete){
				localStorage["scannedItem"+(i-1)] = localStorage["scannedItem"+i]
			}
		}
		localStorage.removeItem("scannedItem" + localStorage.countScannedItem--);
		$(this).parent().parent().removeClass('animated flipInX').addClass('animated fadeOutLeft');
		$(".items").delay(2000,function() { $(".items").empty(); });
		
		setTimeout(function(){ 
			$(".items").empty();
			getProductList();
			setColorApp();}, 500);

    });

});

// function loadPrintHTML(){
// 	page = '<html '+
// 				'<head>'+
// 					'<meta http-equiv="content-type" content="text/html; charset=UTF-8">'+
// 					'<title>Order</title>'+	
// 				'</head>'+
// 				'<body>'+
// 					'<div class="headOrder">'+
// 						// '<div class="logo"><img src="' +localStorage.logo+'" alt="logo" width=300  class="logo-company"></div>'+
// 						'<div class="ordernumber">Order No: ' + localStorage.orderNumber+'</div>'+
// 						'<div class="clientname">'+localStorage.currentFirstNameClient + " " + localStorage.currentLastNameClient+'</div>'+
// 						'<div class="date">'+datetime+'</div>'+
// 					'</div>'+
// 					'<div class="cart-items">'+
// 						'<h4 class="lblCart">Cart</h4>'+
// 						'<ul class="list-items">';

// 	var totalMont=0;
//    	var totalRealMont =0;

//    	for (var i = 1; i <= localStorage.countProductCartItem; i++) {
// 		var productObject = JSON.parse(localStorage["cartItemProduct"+i]);
		
// 		var mont = Number(productObject.Product.price.substring(1));
// 		var montOriginal = Number(productObject.Product.originalPrice.substring(1));
// 		totalMont = totalMont + mont;
// 		totalRealMont = totalRealMont + montOriginal;
// 		var elementCartItem = '<li class="item  '+"item-" + (i)+'">'+
// 									'<div class="brandName">'+productObject.Product.brandName+'</div>'+
// 									'<div class="styleName">'+productObject.Product.styleName+'</div>'+
// 									'<div class="color">'+productObject.Product.colorCode+'</div>'+
// 									'<div class="size">'+productObject.Product.size+'</div>'+
// 									'<div class="price">'+productObject.Product.price+'</div>'+
// 								'</li>';
// 		page = page + elementCartItem;
// 	}			
// 	page = page + 	'</ul>'+
// 				'</div>'+
// 				'<div class="footerOrder">'+
// 					'<div class="total">'+totalMont.toFixed(2)+'</div>'+
// 					'<div class="saving">'+(totalRealMont-totalMont).toFixed(2)+'</div>'+
// 				'</div>';	
// }

function loadPrint(){
	var currentdate = new Date(); 
	var datetime = currentdate.getDate() + "/"
	           + (currentdate.getMonth()+1)  + "/" 
	           + currentdate.getFullYear() + " "  
	           + currentdate.getHours() + ":"  
	           + currentdate.getMinutes() + ":" 
	           + currentdate.getSeconds();
	page = "           NICEKICKS\n"+
						'Order No: ' + localStorage.orderNumber+'\n'+
						localStorage.currentFirstNameClient + " " + localStorage.currentLastNameClient+'\n'+
						datetime+'\n\n'+
						'Cart Items\n';

	var totalMont
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

//check email format
function validateEmail(){
    var email=$(".txtEmail").val();
    var errorDomain= (email.match(/.com/g) || []).length;
    var errorSintax= (email.match(/@/g) || []).length;
    var checkDom = email.lastIndexOf("@");
    var resultDom = email.substring(checkDom + 1);
    var whitespaces = email.lastIndexOf(" ");

    if(email.length!=0 && whitespaces==-1 && (errorDomain<=1 && errorSintax==1) && (resultDom!=email && resultDom.trim().length>0 )){  return email;  }
    else{ return -1 }
  
}

function getProductList(){
	var priceCount = 0;
	for (var i = 1; i <= localStorage.countScannedItem; i++) {
		var productObject = JSON.parse(localStorage["scannedItem"+i]);
		var classAnimated = "";
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
            price: "$"+productObject.Product.price,
            sizeCode: productObject.Product.size,
            sku: productObject.Product.sku
        });
        priceCount = Number(priceCount) + Number(productObject.Product.price);
        $(".items").append(html);
	}
    $(".detail-count").html(localStorage.countScannedItem);
    priceCount>0 ? $(".detail-total").html("$"+Math.round10(priceCount,-2)) : $(".detail-total").html("$0.00");
    $(".item-count").html(localStorage.countScannedItem);
    priceCount>0 ? $(".span-total-price").html("$"+Math.round10(priceCount,-2)) : $(".span-total-price").html("$0.00");
    localStorage.totalPriceScannedItem = priceCount;
}

//remove all variables related to search page from local storage
function clearSearchPage(){
	for (var i = 1; i <= localStorage.countScannedItem; i++) {
		localStorage.removeItem("scannedItem" + (i));
	}
	localStorage.countScannedItem = 0;
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

//if exists path image error, show no image
function handleError(image){
    image.src = '../img/imNoFound.jpg';
}