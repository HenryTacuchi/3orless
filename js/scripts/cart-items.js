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

	if(localStorage.existOldCartItem == 0){
		$(".btn-recover").prop("disabled",true);
	}
	else{
		$(".btn-recover").prop("disabled",false);	
	}

	$("input").focus(function(){
		$(".section-cart-items").hide();
	});

	$("input").blur(function(){
		$(".section-cart-items").show();
	});

	$(".txtEmail").emailautocomplete({
        suggClass: "custom-classname", //default: "eac-sugg". your custom classname (optional)
        domains: ["example.com"] //additional domains (optional)
    });

	$(".item-count").text(localStorage.countProductCartItem);
	
	getProductList();

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
        window.location = "index.html";
    });

    //clear button redirects to home screen
    $(".btn-clear-cart").click(function(){
    	localStorage.currentFirstNameClient = ""
        localStorage.currentLastNameClient = "";
        localStorage.currentEmailClient = "";
        //remove all products from cart item and redirect to search screen
        clearSearchPage();
        window.location = "search.html";
    });

    //show products from last cart
    $(".btn-recover").click(function(){
    	$(".txtFirstName").val("");
    	$(".txtLastName").val("");
    	$(".txtEmail").val("");
    	for (var i = 1; i <= localStorage.countProductLastCartItem ; i++) {
    		localStorage["cartItemProduct"+i] = localStorage["lastCartItemProduct"+i];
    	}
    	if(localStorage.countProductCartItem > localStorage.countProductLastCartItem){
			for (var i = localStorage.countProductLastCartItem*1 + 1; i <= localStorage.countProductCartItem ; i++) {				
				localStorage.removeItem("lastCartItemProduct"+i);
			}
		}
		localStorage.countProductCartItem = localStorage.countProductLastCartItem;
		// window.location.reload();
		$(".items").html("");
		$(".item-count").text(localStorage.countProductCartItem);
		getProductList();
    });

    //done button redirects to home screen
    $(".btn-done").click(function(){
    	localStorage.currentFirstNameClient = $(".txtFirstName").val();
        localStorage.currentLastNameClient = $(".txtLastName").val();
        localStorage.currentEmailClient = $(".txtEmail").val();
    	$(".btn-done").prop("disabled",true);
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
		if (firstName.length > 0 && lastName.length > 0 && checkEmail != -1 && localStorage.countProductCartItem > 0) { 
			$.ajax({
		        type: "GET",
		        url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/PostInfoCusto/" + firstName + "/" + lastName + "/" + email,
		        async: false,
		        contentType: "application/json",
		        crossdomain: true,
		        beforeSend: function(){
		        	showLoading(true);
		        },
		        complete: function(){
		        	showLoading(false);
		        },
		        success: function (result) {

		            var data = result  
		        },
		        error: function (error) {
		        	           	
		        }
		    });

		    $.ajax({
		        type: "GET",
		        url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/GetNumberOrder/" + localStorage.storeNo ,
		        async: false,
		        contentType: "application/json",
		        crossdomain: true,
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
		    	if(localStorage.current_lang == "es")
		    		messageorder = "<b>N° Orden:"+orderNumber+"</b>\n";
		    	else
		    		messageorder = "<b>N° Order:"+orderNumber+"</b>\n";
		    }
			saveLastCartItem();
	    	if (localStorage.current_lang == "es") 
	   			swal({
				  title: "Confirmación de Orden",
				  text: messageorder + "Gracias "+ firstName +",\nPor favor, espere que traigamos su orden.",
				  type: "success",
				  confirmButtonColor: "#DD6B55",
				  confirmButtonText: "¡Ok, Genial!",
				  closeOnConfirm: false
				},
				function(){
				  	clearSearchPage();
				  	window.location = "print.html"; 
					//window.location = "search.html";
				});
			else				
				swal({
				  title: "Order Confirmation",
				  text: messageorder + "Thank you "+ firstName +",\nPlease wait, we are getting your order.",
				  type: "success",
				  confirmButtonColor: "#DD6B55",
				  confirmButtonText: "Ok, Cool!",
				  closeOnConfirm: false
				},
				function(){
				  	clearSearchPage();
				  	window.location = "print.html"; 
					//window.location = "search.html";
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
		$(".btn-done").prop("disabled",false);


    });

    $(document).on("click",".btn-trash",function(){
    	removeAnimationFlipIn = true;
    	var i,indexDelete = localStorage.countProductCartItem;
    	var styleCode = $(this).attr("data-style");
    	var colorCode = $(this).attr("data-color");    	
    	for (i = 1; i <= localStorage.countProductCartItem; i++) {
			var productObject = JSON.parse(localStorage["cartItemProduct"+i]);
			if(productObject.Product.styleCode == styleCode 
				&& productObject.Product.colorCode == colorCode)
				indexDelete = i;
			if(i>indexDelete){
				localStorage["cartItemProduct"+(i-1)] = localStorage["cartItemProduct"+i]
			}
		}
		localStorage.removeItem("cartItemProduct" + localStorage.countProductCartItem--);
		$(this).parent().parent().removeClass('animated flipInX').addClass('animated fadeOutLeft');
		// $(".items").delay(2000,function() { $(".items").empty(); alert(1);});
		// // $(".items").delay(2000,function() { $(".items").empty(); });
		
		setTimeout(function(){ 
			$(".items").empty(); 
			$(".item-count").text(localStorage.countProductCartItem);
			getProductList();}, 500);
    });

});



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
	for (var i = 1; i <= localStorage.countProductCartItem; i++) {
		var productObject = JSON.parse(localStorage["cartItemProduct"+i]);
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
            price: productObject.Product.price
        });
        $(".items").append(html);
	}
}

//remove all variables related to search page from local storage
function clearSearchPage(){
	localStorage.removeItem("listBrandFilter");
	localStorage.removeItem("listClassFilter");
	localStorage.removeItem("listGenderFilter");
	localStorage.removeItem("listSizeFilter");
	localStorage.removeItem("productList");
	localStorage.removeItem("countProductFiltered");
	localStorage.removeItem("indexProductSelected");
	localStorage.removeItem("resultsProductColorCodeSelected");
	localStorage.removeItem("resultsProductStyleCodeSelected");
	for (var i = 1; i <= localStorage.countProductCartItem; i++) {
		localStorage.removeItem("cartItemProduct" + (i));
	}
	localStorage.countProductCartItem = 0;
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
