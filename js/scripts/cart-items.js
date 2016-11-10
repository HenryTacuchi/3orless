// overall delay for disappearance of animations
var delay=2500;
var removeAnimationFlipIn = false;
$(document).ready(function(){
	$(".item-count").text(localStorage.countProductCartItem);
	getProductList();

	$(".btn-back").click(function(){
		window.history.back();
	});

	//home button redirects to home screen
    $(".btn-home").click(function(){
        window.location = "index.html";
    });

    //clear button redirects to home screen
    $(".btn-clear-cart").click(function(){
        //remove all products from cart item and redirect to search screen
        clearSearchPage();
        window.location = "search.html";
    });

    //done button redirects to home screen
    $(".btn-done").click(function(){
    	if (localStorage.current_lang == "es") { $(".txtMessage").text("Por favor, verifique los campos e inténtelo nuevamente!"); }
    	else{$(".txtMessage").text("Validation errors occurred. Please confirm the fields and submit it again.!");}
		$(".validations").addClass("hide");
		$(".validations").removeClass("animated fadeOutLeft");
    	var name = $(".txtName").val();
    	var email = $(".txtEmail").val();
    	var checkEmail = validateEmail();

    	//if name and email has correct format
		if (name.length > 0 && checkEmail != -1 && localStorage.countProductCartItem > 0) { 
			$.ajax({
		        type: "GET",
		        url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/PostInfoCusto/" + name + "/" + email,
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

	    	if (localStorage.current_lang == "es") 
				swal("Mensaje!", "N° Orden:50\nGracias "+ name +",\nPor favor, espere que traigamos su orden.!", "success")
			else
				swal("Good job!", "N° Order:50\nThank you "+ name +",\nPlease wait, we are getting your order.!", "success")			
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
			if (name.length==0){
				$(".txtName").focus();
				$(".noName").removeClass("hide").addClass("show");
				if (localStorage.current_lang == "es") { $(".noName").text("Complete el campo requerido!"); }
			}else{
				if($(".noName").hasClass("show"))
					$(".noName").removeClass("show").addClass("hide");
			}

			if(localStorage.countProductCartItem == 0){
				if (localStorage.current_lang == "es") { $(".txtMessage").html("No hay productos agregados.!"); }
				else { $(".txtMessage").html("There are no cart items!"); }
				$(".validations").delay(delay).queue(function(){
				    $(this).addClass("animated fadeOutLeft").dequeue();
				});
			}
		}	


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
