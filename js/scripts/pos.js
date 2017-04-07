
// overall delay for disappearance of animations
var delay=2500;
var removeAnimationFlipIn = false;

$(document).ready(function(){
    setCaptions();
    
    //Set time to show
    moment.locale(localStorage.current_lang);        
    var interval = setInterval(function() {
        
        $('.systemDate').html(' ' + moment().format('L'));
        $('.systemHour').html(' ' + moment().format('hh:mm:ss a'));
    }, 100);

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

 //    $(".section-form-user input").focus(function(){
	// 	$(".section-cart-items").hide();
	// });

	// $(".section-form-user input").blur(function(){
	// 	$(".section-cart-items").show();
	// });

 //    $(".section-cart-items input").focus(function(){
	// 	$(".section-form-user").hide();
	// 	setSizeCart();
	// });

	// $(".section-cart-items input").blur(function(){
	// 	$(".section-form-user").show();
	// 	setSizeCart();
	// });
	
	if(localStorage.SKUCodeScan=="" || localStorage.SKUCodeScan == undefined){
    	$('#txtScan').focus();
    }else{
		searchProduct(localStorage.SKUCodeScan);
		localStorage.SKUCodeScan="";
    }

	$(".txtEmail").emailautocomplete({
        suggClass: "custom-classname", //default: "eac-sugg". your custom classname (optional)
        domains: ["example.com"] //additional domains (optional)
    });

	$(".btn-scanner").click(function(){
		window.location.href = "scan.html";
	});

	$('.txtScan').on('input',function(){    	

		var txtSKU = $(".txtScan").val();
		if(txtSKU.length ==7){
        	searchProduct(txtSKU);
		}
	});

	/*FJ*/
    if(localStorage.countScannedItem==null ||  localStorage.countScannedItem==0){
        // $(".item-count").addClass("hide");
        showPageElement(".item-count",false);
    }else{
    	showPageElement(".item-count",true);
        $(".item-count").text(localStorage.countScannedItem);
    }
	
	if (localStorage.countScannedItem != NaN && localStorage.countScannedItem != undefined && localStorage.countScannedItem != 0){
		getProductList();
	}

	$(".btn-back").click(function(){
		localStorage.currentFirstNameClient = $(".txtFirstName").val();
        localStorage.currentLastNameClient = $(".txtLastName").val();
        localStorage.currentEmailClient = $(".txtEmail").val();
		window.location = "menu.html";
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
        clearPage();
    });

    //clear car item
    $(".btn-void").click(function(){
    	if (localStorage.countScannedItem > 0) {
    		swal({
				title: "Do you want to clear all items?",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Yes",
				cancelButtonColor: "#b9b9b9",
				cancelButtonText: "Cancel",
				closeOnConfirm: true,
				closeOnCancel: true
			},
			function(isConfirm){
				if (isConfirm) {
					clearPage();
				} 
			});
    	}    	
    });

    //order button redirects to home screen
    $(".btn-order").click(function(){
    	sendOrder();
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
			setColorApp();
		}, 500);
    });


    /* keyboard POS */
    $(document).on('click', '.btn-key-pos', function(){

    	var tecla = $(this).attr('value');    	
    	switch(tecla){
    		case 'bkspc':
    			if ($('.txtScan').val()!='') {
    				var txtScan = $('.txtScan').val();
    				txtScan = txtScan.split('');
    				txtScan.pop();
    				txtScan = txtScan.join('');
		    		$('.txtScan').val(txtScan);
		    	}
    			break;
    		case 'clr':
    			if ($('.txtScan').val()!='') {
    				$('.txtScan').val('');
		    	}
    			break;
    		case 'enter':
    			if ($('.txtScan').val().length == 7) {
    				searchProduct($('.txtScan').val());
    			} else {
    				// alert('Codigo incorrecto');
    				if($(".txtMessage").hasClass("success")){
						$(".txtMessage").removeClass("success").addClass("danger");
						$(".btn-mini-img").removeClass("success").addClass("danger").find('span').empty().html('&#xe645');
					}
					else{
						$(".txtMessage").addClass("danger");
						$(".btn-mini-img").addClass("danger").find('span').empty().html('&#xe645');
					}

					$(".validations").removeClass("hide").addClass("animated fadeInLeft");

					$(".txtMessage").html(localStorage.caption_notfound);
					$(".validations").delay(delay).queue(function(){
					    $(this).addClass("animated fadeOutLeft").dequeue();
					});
    			}
    			break;
    		default:
    			if (!isNaN(tecla)) {
			    	if ($('.txtScan').val()=='') {
			    		$('.txtScan').val(tecla);
			    	} else {
			    		if ($('.txtScan').val().length < 7) {
			    			$('.txtScan').val($('.txtScan').val()+tecla);
			    		}
			    	}
			    }
    			break;
    	}
    });
    /* end keyboard POS*/

    // keyboard payment modal
    $(document).on('click', '.btn-key-pay', function(){

    	var tecla = $(this).attr('value');    	
    	switch(tecla){
    		case 'bkspc':
    			if ($('.txtSelectPayment').val()!='') {
    				var txtScan = $('.txtSelectPayment').val();
    				txtScan = txtScan.split('');
    				txtScan.pop();
    				txtScan = txtScan.join('');
		    		$('.txtSelectPayment').val(txtScan);
		    	}
    			break;
    		case 'clr':
    			if ($('.txtSelectPayment').val()!='') {
    				$('.txtSelectPayment').val('');
		    	}
    			break;
    		case 'enter':
    			// do something
    			break;
    		default:
    			if (!isNaN(tecla)) {
			    	if ($('.txtSelectPayment').val()=='') {
			    		$('.txtSelectPayment').val(tecla);
			    	} else {
			    		if ($('.txtSelectPayment').val().length < 7) {
			    			$('.txtSelectPayment').val($('.txtSelectPayment').val()+tecla);
			    		}
			    	}
			    }
    			break;
    	}
    });
    // END keyboard payment modal

    $('.btn-payment').click(function(){
    	$('#modalPayment').modal('show');
    });


    $('.scrollbar-pos').scrollbar({
    	"autoScrollSize": true,
        "showArrows": true,
        "scrollStep": 80,
        "scrollx": "advanced",
        "scrolly": "advanced",
        "autoUpdate": true
    });


    $(document).on('click', '.product', function(){
		$('.product').removeClass('selected');
		$(this).addClass('selected');
    });

});

$(window).load(function(){
    setSizeCart();
    setColorApp();
});

function sendOrder(){
	showLoading(true);
	var bodyJson;
	localStorage.currentFirstNameClient = $(".txtFirstName").val();
    localStorage.currentLastNameClient = $(".txtLastName").val();
    localStorage.currentEmailClient = $(".txtEmail").val();
	$(".btn-order").prop("disabled",true);
	$(".txtMessage").text(localStorage.caption_msgVerifyFields);
	$(".validations").addClass("hide");
	$(".validations").removeClass("animated fadeOutLeft");
	var firstName = $(".txtFirstName").val();
	var lastName = $(".txtLastName").val();
	var email = $(".txtEmail").val();
	var checkEmail = validateEmail();
	var orderNumber = "";
	var urlWebService = "";
	if (localStorage.transactionType == "salesorder"){
		urlWebService = "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/CreateSO/" + localStorage.storeNo + "/" + firstName + "/" + lastName + "/" + email;
	}else{
		urlWebService = "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/CreateReceipt/" + localStorage.storeNo + "/" + firstName + "/" + lastName + "/" + email;
	}

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
	        url: urlWebService,
	        async: true,
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
	            	swal({
						title: localStorage.caption_modalOrderTitle,
						text:  localStorage.caption_modalOrderText1.replace("firstName",firstName) + " \n" + localStorage.caption_modalOrderText2 + "\n" + createSO,
						type: "success",
						confirmButtonColor: "#8fbf75",
						confirmButtonText: localStorage.caption_txtConfirmButton,				  
						closeOnConfirm: true
					},
					function(){
						clearPage();
					});
	            }
	            else{

	            }
	        },
	        error: function (error) {
				console.log(error);    
				swal({
					title: localStorage.caption_modalOrderTitle,
					text:  localStorage.caption_modalOrderError,
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#8fbf75",
					confirmButtonText: localStorage.caption_txtConfirmButtonRetry,
					cancelButtonColor: "#b9b9b9",
					cancelButtonText: localStorage.caption_txtCancelButtonFinish,
					closeOnConfirm: true,
					closeOnCancel: true
				},
				function(isConfirm){
					if (isConfirm) {
						sendOrder();
					} else {						    
						clearPage();
						showLoading(false);			  	
					}
				});
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

		if (checkEmail==-1){
			$(".txtEmail").focus();
			$(".noEmail").removeClass("hide").addClass("show");

			if (email.length==0){
				$(".noEmail").text(localStorage.caption_msgCompleteRequiredField);
			}else{
				$(".noEmail").text(localStorage.caption_msgWrongEmailFormat);
			}
		}else{
			if($(".noEmail").hasClass("show"))
				$(".noEmail").removeClass("show").addClass("hide");
		}

		if (lastName.length==0){
			$(".txtLastName").focus();
			$(".noLastName").removeClass("hide").addClass("show");
			$(".noLastName").text(localStorage.caption_msgCompleteRequiredField);
		}else{
			if($(".noLastName").hasClass("show"))
				$(".noLastName").removeClass("show").addClass("hide");
		}

		if (firstName.length==0){
			$(".txtFirstName").focus();
			$(".noFirstName").removeClass("hide").addClass("show");
			$(".noFirstName").text(localStorage.caption_msgCompleteRequiredField);
		}else{
			if($(".noFirstName").hasClass("show"))
				$(".noFirstName").removeClass("show").addClass("hide");
		}

		if(localStorage.countProductCartItem == 0){
			$(".txtMessage").html(localStorage.caption_modalProductDetailTitle);				
			$(".validations").delay(delay).queue(function(){
			    $(this).addClass("animated fadeOutLeft").dequeue();
			});
		}

	}	
	$(".btn-order").prop("disabled",false);
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
			classAnimated = "animated fadeIn";        	
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
    if (localStorage.countScannedItem > 0) {
    	showPageElement(".item-count",true);
    }else{
    	showPageElement(".item-count",false);
    }
}

//remove all variables related to search page from local storage
function clearPage(){
	localStorage.currentFirstNameClient = ""
    localStorage.currentLastNameClient = "";
    localStorage.currentEmailClient = "";
	for (var i = 1; i <= localStorage.countScannedItem; i++) {
		localStorage.removeItem("scannedItem" + (i));
	}
	localStorage.countScannedItem = 0;
    setTimeout(function(){ 
		$(".items").empty();
		getProductList();
		setColorApp();
	}, 100);
    // window.location = "pos.html"
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

function setSizeCart(){
	// $('.items').height(0);
	setTimeout(function() {
        // $(".items").animate({
        //     height: $('.cart-items').height(),
        //     'padding-bottom':$('.tfooter').outerHeight()
        // }, 500);
    }, 100 );
	// setTimeout(function(){ $('.items').height($('.cart-items').height() - 50); }, 100);	
}

//if exists path image error, show no image
function handleError(image){
    if (localStorage.current_lang == "es") {
        image.src = '../img/imNoFound-es.jpg';
    }else{
        image.src = '../img/imNoFound.jpg';
    }
}
function searchProduct(txtSKU){
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
						$(".product-" + (localStorage.countScannedItem)).addClass("selected");
						var height = 0;
						$('.product').each(function(i, value){
						    height += parseInt($(this).height());
						});
						$('.items-section').animate({ scrollTop: height }, 500, 'swing');
						setColorApp();
					}, 1000);
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

					$(".txtMessage").text(localStorage.caption_notfound);

					$(".validations").delay(delay).queue(function(){
					    $(this).addClass("animated fadeOutLeft").dequeue();
					});
	        	}
	            
	        },
	        error: function (error) {
        	    //nothing 	
        	    alert(JSON.stringify(error));
	        }
	    });
    }
}

function showPageElement(element,option){
    if(option){  
        if($(element).hasClass("hide"))
            $(element).removeClass("hide").addClass("show");
        else
            $(element).addClass("show");
    }else{
        if($(element).hasClass("show"))
            $(element).removeClass("show").addClass("hide");
        else
            $(element).addClass("hide");
    }
}

function setCaptions(){
	$(".lblCompleteFields").text(localStorage.caption_lblCompleteFields);
	$(".lblName").html(localStorage.caption_lblNameRequired);
	$(".lblLastName").html(localStorage.caption_lblLastNameRequired);
	$(".btn-back").text(localStorage.caption_btnBack);
	$(".btn-clear-cart").text(localStorage.caption_btnClearCart);
	$(".btn-order").text(localStorage.caption_btnOrder);
	$(".txtEmail").attr('placeholder',localStorage.caption_txtEmail);
	$(".detail-count-text1").text(localStorage.caption_detailCountText1);
	$(".detail-count-text2").text(localStorage.caption_detailCountText2);
	$(".appNameScanItem").text(localStorage.caption_option4);
	$(".txtScan").attr('placeholder',localStorage.caption_lblScanProduct);
	$(".lblEmail").html(localStorage.caption_lblEmailRequired);
}