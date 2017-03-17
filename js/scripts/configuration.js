// overall delay for disappearance of animations
var delay=2500;

$(document).ready(function(){
	document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        loadCboPrinters();
    }

	if (localStorage.serverId == undefined || localStorage.serverId == ""){
		setLocalCaptions();
	}else{
		setCaptions();
	}
     
    $('.storeNo').bind('keypress', function(event) {
    if(event.which == 13||event.which == 10) {
      $(".serverId").focus();
    }
    });

    $('.emailUser').bind('keypress', function(event) {
    if(event.which == 13||event.which == 10) {
    	if (typeof localStorage.password == "undefined" || localStorage.password == "null") $(".passUser").focus();
    	else $(".oldPass").focus();
    }
    });

    $('.oldPass').bind('keypress', function(event) {
    if(event.which == 13||event.which == 10) {
      $(".passUser").focus();
    }
    });

    $('.passUser').bind('keypress', function(event) {
    if(event.which == 13||event.which == 10) {
      $(".confirmPassUser").focus();
    }
    });

    $('.confirmPassUser').bind('keypress', function(event) {
    if(event.which == 13||event.which == 10) {
      $(".btnFinish").click();
    }
    });

    $('.btn-exit').click(function(){
    	// KioskPlugin.exitKiosk();
    	navigator.app.exitApp();
    });

	$(".storeNo").focus();	

	if (localStorage.flagActivate3orless == 1){
    	$(".check-3orless").addClass("checked");
    	$('.checkbox-control').find('.checkbox').css('background-color',localStorage.colorBackground);
    }else{
    	if ($(".check-3orless").hasClass("checked")) {
    		$(".check-3orless").removeClass("checked");
    	}    	
    }

    if (localStorage.transactionType == undefined || localStorage.transactionType == "salesorder") {
    	$('input:radio[name=opt]').val(['salesorder']);
    }else{
    	$('input:radio[name=opt]').val(['receipt']);
    }

	//check if exists images for home in server
	if(localStorage.imageServerError == 1){
		$(".serverId").focus();
		$(".noServerId").removeClass("hide").addClass("show");
		$(".noServerId").text(localStorage.caption_msgNoServerId);
		if($(".txtMessage").hasClass("success")){
			$(".txtMessage").removeClass("success").addClass("danger");
			$(".btn-mini-img").removeClass("success").addClass("danger").find('span').empty().html('&#xe645');
		}
		else{
			$(".txtMessage").addClass("danger");
			$(".btn-mini-img").addClass("danger").find('span').empty().html('&#xe645');
		}
		$(".validations").removeClass("hide").queue(function(){
		    $(this).delay(delay).addClass("animated fadeInLeft").dequeue();
		});
		// $(".validations").removeClass("hide").addClass("animated fadeInLeft");
		$(".txtMessage").text(localStorage.caption_msgServerConnectionError);
		$(".validations").delay(delay).queue(function(){
		    $(this).addClass("animated fadeOutLeft").dequeue();
		});
		localStorage.imageServerError = 0;
	}

	// show settings stored
	loadData();
	// check if user has configured the password to show or not the textbox old password
	checkPassword();
	
	//save configuration of StoreNo and Server IP
	$(".btnSave").click(function(){	


		$(".validations").addClass("hide");
		$(".validations").removeClass("animated fadeOutLeft");
    	var storeNo= $(".storeNo").val();
		var serverId = $(".serverId").val();
		var checkIP = validateIP();

    	if(storeNo.length>0 && checkIP != -1){
		    saveConfiguration(storeNo.trim(),serverId.trim());
		    $(".settings-1").removeClass('fadeInDown').addClass("fadeOutLeft");
		    $(".settings-2").removeClass("hide").addClass("animated fadeInLeft");
		    $(".emailUser").focus();
		}
		else {
			if (checkIP==-1){
				$(".serverId").focus();
				$(".noServerId").removeClass("hide").addClass("show");

				if (serverId.length==0){
					$(".noServerId").text(localStorage.caption_msgCompleteRequiredField); 
				}else{
					$(".noServerId").text(localStorage.caption_msgIncorrectIPFormat);
				}
			}else{
				if($(".noServerId").hasClass("show"))
					$(".noServerId").removeClass("show").addClass("hide");
			}
			if (storeNo.length==0){
				$(".storeNo").focus();
				$(".noStoreNo").removeClass("hide").addClass("show");
				$(".noStoreNo").text(localStorage.caption_msgCompleteRequiredField);
			}else{
				if($(".noStoreNo").hasClass("show"))
					$(".noStoreNo").removeClass("show").addClass("hide");
			}
			if($(".txtMessage").hasClass("success")){
				$(".txtMessage").removeClass("success").addClass("danger");
				$(".btn-mini-img").removeClass("success").addClass("danger").find('span').empty().html('&#xe645');
			}
			else{
				$(".txtMessage").addClass("danger");
				$(".btn-mini-img").addClass("danger").find('span').empty().html('&#xe645');
			}
			$(".validations").removeClass("hide").addClass("animated fadeInLeft");

			$(".txtMessage").text(localStorage.caption_msgVerifyFields);

			$(".validations").delay(delay).queue(function(){
			    $(this).addClass("animated fadeOutLeft").dequeue();
			});
		}
		
    });

	//Save email and password
    $(".btnFinish").click(function(){
    	localStorage.colorBackground = $(".form-color").val();    
    	$(".txtMessage").text(localStorage.caption_msgVerifyFields);	
		$(".validations").addClass("hide");
		$(".validations").removeClass("animated fadeOutLeft");	
		var checkEmail= validateEmail();
		var storeNo = localStorage.storeNo, serverId = localStorage.serverId, emailUser = localStorage.emailUser, password = localStorage.password;	    

		//if exists old password
	    if ((typeof storeNo != "undefined" && localStorage.storeNo != null) && (typeof serverId != "undefined" && localStorage.serverId != "null") && (typeof password != "undefined" && localStorage.password!="null")) {
	     	// Validate old password
	     	var oldPass=$(".oldPass").val(); 
 			var newPass=$(".passUser").val();
 			var repPass=$(".confirmPassUser").val(); 
 			var emailUser=$(".emailUser").val();

 			//if confirm old password
	     	if (localStorage.password == oldPass){
	     		if($(".noOldPassword").hasClass("show"))
					$(".noOldPassword").removeClass("show").addClass("hide");
     			
     			//if new password is equal than confirm and email has correct format
     			if (newPass == repPass && checkEmail != -1) { 
     				if(newPass.length==0)
     					savePassword(oldPass,emailUser);  
     				else
     					savePassword(newPass.trim(),emailUser);  
     				localStorage.noSettings = 1;
     			}    
     			//if new password is not equal than confirm or email format is wrong 			
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
					$(".txtMessage").text(localStorage.caption_msgVerifyFields);
					$(".validations").delay(delay).queue(function(){
					    $(this).addClass("animated fadeOutLeft").dequeue();
					});
					$(".noConfirmPassUser").removeClass("hide").addClass("show");
					$(".noConfirmPassUser").text(localStorage.caption_msgWrongPasswordConfirmation);
				    $(".confirmPassUser").focus();
				    if (repPass.length==0){
						$(".confirmPassUser").focus();
						$(".noConfirmPassUser").removeClass("hide").addClass("show");
						$(".noConfirmPassUser").text(localStorage.caption_msgCompleteRequiredField);
					}
					if (newPass.length==0){
						$(".passUser").focus();
						$(".noPassUser").removeClass("hide").addClass("show");
						$(".noPassUser").text(localStorage.caption_msgCompleteRequiredField);
					}else{
						if($(".noPassUser").hasClass("show"))
							$(".noPassUser").removeClass("show").addClass("hide");
					}
					if (oldPass.length==0){
						$(".oldPass").focus();
						$(".noOldPassword").removeClass("hide").addClass("show");
						$(".noOldPassword").text(localStorage.caption_msgCompleteRequiredField);
					}
					if (checkEmail==-1){
						$(".emailUser").focus();
						$(".noEmailUser").removeClass("hide").addClass("show");

						if (emailUser.length==0){
							$(".noEmailUser").text(localStorage.caption_msgCompleteRequiredField);
						}else{
							$(".noEmailUser").text(localStorage.caption_msgWrongEmailFormat);
						}
					}else{
						if($(".noEmailUser").hasClass("show"))
							$(".noEmailUser").removeClass("show").addClass("hide");
					}
				}	
	      	}
	      	//if old password is no equal than saved password in local storage
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

	      		$(".txtMessage").text(localStorage.caption_msgVerifyFields);
				$(".validations").delay(delay).queue(function(){
				    $(this).addClass("animated fadeOutLeft").dequeue();
				});
				$(".noOldPassword").removeClass("hide").addClass("show");
				$(".noOldPassword").text(localStorage.caption_msgWrongPassword);
			    $(".oldPass").focus();

			    if (repPass.length==0){
					$(".confirmPassUser").focus();
					$(".noConfirmPassUser").removeClass("hide").addClass("show");
					$(".noConfirmPassUser").text(localStorage.caption_msgCompleteRequiredField); 
				}else{
					if($(".noConfirmPassUser").hasClass("show"))
						$(".noConfirmPassUser").removeClass("show").addClass("hide");
				}
				if (newPass.length==0){
					$(".passUser").focus();
					$(".noPassUser").removeClass("hide").addClass("show");
					$(".noPassUser").text(localStorage.caption_msgCompleteRequiredField);
				}else{
					if($(".noPassUser").hasClass("show"))
						$(".noPassUser").removeClass("show").addClass("hide");
				}
				if (oldPass.length==0){
					$(".oldPass").focus();
					$(".noOldPassword").removeClass("hide").addClass("show");
					$(".noOldPassword").text(localStorage.caption_msgCompleteRequiredField);
				}
				if (checkEmail==-1){
					$(".emailUser").focus();
					$(".noEmailUser").removeClass("hide").addClass("show");

					if (emailUser.length==0){
						$(".noEmailUser").text(localStorage.caption_msgCompleteRequiredField);
					}else{
						$(".noEmailUser").text(localStorage.caption_msgWrongEmailFormat);
					}
				}else{
					if($(".noEmailUser").hasClass("show"))
						$(".noEmailUser").removeClass("show").addClass("hide");
				}
	      	}		     			
      	}
      	//if there is no password in local storage
		else{
			// Check both password new one and repeated one
			var newPass=$(".passUser").val(); 	
			var repPass=$(".confirmPassUser").val(); 
			var emailUser=$(".emailUser").val(); 
			
			if (newPass == repPass && checkEmail != -1 && newPass.length >0) {
			    savePassword(newPass.trim(),emailUser);
			    localStorage.noSettings = 1;
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

				$(".txtMessage").text(localStorage.caption_msgVerifyFields);
				$(".validations").delay(delay).queue(function(){
				    $(this).addClass("animated fadeOutLeft").dequeue();
				});
				$(".noConfirmPassUser").removeClass("hide").addClass("show");
				$(".noConfirmPassUser").text(localStorage.caption_msgWrongPasswordConfirmation);
			    $(".confirmPassUser").focus();

			    if (repPass.length==0){
					$(".confirmPassUser").focus();
					$(".noConfirmPassUser").removeClass("hide").addClass("show");
					$(".noConfirmPassUser").text(localStorage.caption_msgCompleteRequiredField);
				}
				if (newPass.length==0){
					$(".passUser").focus();
					$(".noPassUser").removeClass("hide").addClass("show");
					$(".noPassUser").text(localStorage.caption_msgCompleteRequiredField);
				}else{
					if($(".noPassUser").hasClass("show"))
						$(".noPassUser").removeClass("show").addClass("hide");
				}
				if (checkEmail==-1){
					$(".emailUser").focus();
					$(".noEmailUser").removeClass("hide").addClass("show");

					if (emailUser.length==0){
						$(".noEmailUser").text(localStorage.caption_msgCompleteRequiredField);
					}else{
						$(".noEmailUser").text(localStorage.caption_msgWrongEmailFormat);
					}
				}else{
					if($(".noEmailUser").hasClass("show"))
						$(".noEmailUser").removeClass("show").addClass("hide");
				}
			}
		}	

		// clearSearchPage();
		
    });

    $(document).on("click",".printer-item",function(){
    	$(".printer-dropdown").text($(this).text());
        localStorage.printerName = $(this).text();        
    });

});

//when page is loaded hide loaders
$(window).on("load", function() {
   	showLoading(false);
});

function loadCboPrinters(){
	BTPrinter.list(function(data){
        console.log("Success");
        console.log(data); //list of printer in data array
        
		if(data.length>0){
			if(localStorage.printerName == undefined || localStorage.printerName ==''){
				$(".printer-dropdown").text(data[0]);					
				localStorage.printerName = data[0];
			}					
		    for (var i=0; i<data.length; i++) {
				var template = _.template($("#listPrinterTemplate").html());
			    var html = template({
			       printerName:data[i]
			    });
			    $(".listPrinter").append(html);
			}
		}
    },function(err){
        console.log("Error");
        console.log(err);
    })	 
}

//store data in local storage: StoreNo and ServerId
function saveConfiguration(storeNo, serverId) {
    localStorage.storeNo = storeNo;
    localStorage.serverId = serverId;
    localStorage.transactionType = $('input[name="opt"]:checked').val();    
    if ($(".check-3orless").hasClass("checked")){
    	localStorage.flagActivate3orless = 1;
    }else{
    	localStorage.flagActivate3orless = 0;	
    }
    if($(".validations").hasClass("hide")){
		$(".validations").removeClass("hide").addClass("animated fadeInLeft");
	}
	if($(".txtMessage").hasClass("danger")){
		$(".txtMessage").removeClass("danger").addClass("success");
		$(".btn-mini-img").removeClass("danger").addClass("success").find('span').empty().html('&#xe650');
	}
	else{
		$(".txtMessage").addClass("success");
		$(".btn-mini-img").addClass("success").find('span').empty().html('&#xe650');
	}
	$(".txtMessage").text(localStorage.caption_msgConfigurationSuccess);

    $(".validations").removeClass("show").delay(delay).queue(function(){
	    $(this).addClass("animated fadeOutLeft").dequeue();
	});	    
}

//check if exists old password
function checkPassword(){
    var password =localStorage.password;

    if (typeof password == "undefined" || password == "null") {
    	$(".areaOldPass").removeClass("show").addClass("hide");

    	/*FJ*/
    	$('.areaFinish').css('height', '245px');
    	$('.iconPass').css('padding', '80px 25px 80px 0');
    	/*FJ*/
    }
    else{        	
    	$(".areaOldPass").removeClass("hide").addClass("show");

    	/*FJ*/
    	$('.areaFinish').css('height', '318px');
    	$('.iconPass').css('padding', '116px 25px 116px 0');
    	/*FJ*/
    }
}

//store data in local storage: Password and Email
function savePassword(password,emailUser){		
    localStorage.password = password;
    localStorage.emailUser = emailUser;

    //show successfully messages
    if($(".validations").hasClass("hide")){
		$(".validations").removeClass("hide").addClass("animated fadeInLeft");
	}
	if($(".txtMessage").hasClass("danger")){
		$(".txtMessage").removeClass("danger").addClass("success");
		$(".btn-mini-img").removeClass("danger").addClass("success").find('span').empty().html('&#xe650');
	}
	else{
		$(".txtMessage").addClass("success");
		$(".btn-mini-img").addClass("success").find('span').empty().html('&#xe650');
	}
	$(".txtMessage").text(localStorage.caption_msgPasswordSetUpSuccessfully);

    $(".validations").removeClass("show").delay(delay).queue(function(){
	    $(this).addClass("animated fadeOutLeft").dequeue();
	});	 	
	
	//hide messages validation
	if($(".noEmailUser").hasClass("show"))
		$(".noEmailUser").removeClass("show").addClass("hide");
	if($(".noPassUser").hasClass("show"))
		$(".noPassUser").removeClass("show").addClass("hide");
	if($(".noConfirmPassUser").hasClass("show"))
		$(".noConfirmPassUser").removeClass("show").addClass("hide");
	if($(".noOldPassword").hasClass("show"))
		$(".noOldPassword").removeClass("show").addClass("hide");
	setTimeout(function(){ window.location = "index.html"; }, delay);
}

//load saved data in local storage
function loadData(){
    var storeNo = localStorage.storeNo, serverId = localStorage.serverId, emailUser = localStorage.emailUser;
    if ((typeof storeNo != "undefined" && localStorage.storeNo != null) && (typeof serverId != "undefined" && localStorage.serverId != "null") ) {
        $(".storeNo").val(localStorage.storeNo);
        $(".serverId").val(localStorage.serverId);
        $(".emailUser").val(localStorage.emailUser);
        $(".oldPass").val(localStorage.password);
        $(".printer-dropdown").text(localStorage.printerName);
    }
}

//check email format

function validateEmail(){
    var email=$(".emailUser").val();
    var errorDomain= (email.match(/.com/g) || []).length;
    var errorSintax= (email.match(/@/g) || []).length;
    var checkDom = email.lastIndexOf("@");
    var resultDom = email.substring(checkDom + 1);
    var whitespaces = email.lastIndexOf(" ");

    if(email.length!=0 && whitespaces==-1 && (errorDomain<=1 && errorSintax==1) && (resultDom!=email && resultDom.trim().length>0 )){  return email;  }
    else{ return -1 }
  
}

//check IP format "number.number.number.number"
function validateIP(){
    var serverId=$(".serverId").val();
    var array = serverId.split(".");
    if((typeof array[0] != "undefined" && array[0] != "" && !isNaN(array[0])) && (typeof array[1] != "undefined" && array[1] != "" && !isNaN(array[1])) && (typeof array[2] != "undefined" && array[2] != "" && !isNaN(array[2])) && (typeof array[3] != "undefined" && array[3] != "" && !isNaN(array[3]))){  
    	return serverId;  
    }
    else{ return -1 }
  
}

//show or hide main loader
function showLoading(option){
    if(option){  
        if($(".loader").hasClass("hide"))
            $(".loader").removeClass("hide").addClass("show");
        else
            $(".loader").addClass("show");
    }else{
        if($(".loader").hasClass("show"))
            $(".loader").removeClass("show").addClass("hide").delay(5000);
        else
            $(".loader").addClass("hide").delay(5000);
    }
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
	localStorage.removeItem("threeOrLessOrderResults");
	localStorage.removeItem("kioskListBrandFilter");
	localStorage.removeItem("kioskListClassFilter");
	localStorage.removeItem("kioskListGenderFilter");
	localStorage.removeItem("kioskListSizeFilter");
	localStorage.removeItem("kioskListBrandFilterChecked");
	localStorage.removeItem("kioskListClassFilterChecked");
	localStorage.removeItem("kioskListGenderFilterChecked");
	localStorage.removeItem("kioskListSizeFilterChecked");
	localStorage.removeItem("kioskProductList");
	localStorage.removeItem("kioskCountProductFiltered");
	localStorage.removeItem("kioskOrderResults");
	localStorage.removeItem("indexProductSelected");
	localStorage.removeItem("resultsProductColorCodeSelected");
	localStorage.removeItem("resultsProductStyleCodeSelected");	

	localStorage.removeItem("currentFirstNameClient");
	localStorage.removeItem("currentLastNameClient");
	localStorage.removeItem("currentEmailClient");

	for (var i = 1; i <= localStorage.countProductCartItem; i++) {
		localStorage.removeItem("cartItemProduct" + (i));
	}
	localStorage.countProductCartItem = 0;
	for (var i = 1; i <= localStorage.countScannedItem; i++) {
		localStorage.removeItem("scannedItem" + (i));
	}
	localStorage.countScannedItem = 0;
	localStorage.totalPrice = 0;
	localStorage.totalOriginalPrice = 0;
}

function setCaptions(){
	$(".lblConfig").text(localStorage.caption_lblConfig);
	$(".lblStoreNo").html(localStorage.caption_lblStoreNo);
	$(".storeNo").attr('placeholder',localStorage.caption_storeNo);
	$(".lblServerId").html(localStorage.caption_lblServerId);
	$(".serverId").attr('placeholder',localStorage.caption_serverId);
	$(".lblPrinter").html(localStorage.caption_lblPrinter);
	$(".btnSave").text(localStorage.caption_btnSave);
	$(".lblEmail").html(localStorage.caption_lblEmail);
	$(".emailUser").attr('placeholder',localStorage.caption_emailUser);
	$(".lblOldPassword").html(localStorage.caption_lblOldPassword);
	$(".lblPassword").html(localStorage.caption_lblPassword);
	$(".lblConfirmPassword").html(localStorage.caption_lblConfirmPassword);
	$(".btnFinish").text(localStorage.caption_btnFinish);
	$(".lblSetColor").text(localStorage.caption_lblSetColor);
	$(".lblStoreSettings").text(localStorage.caption_lblStoreSettings);
	$(".lblAccountSettings").text(localStorage.caption_lblAccountSettings);
	$(".lblShow3orless").text(localStorage.caption_lblActivateThreeOrLess);
	$(".lblTransactionType").text(localStorage.caption_lblTransactionType);
	$(".lblSalesorder").text(localStorage.caption_lblSO);
	$(".lblReceipt").text(localStorage.caption_lblReceipt);
}

function setLocalCaptions(){
	if (localStorage.current_lang == "es"){
		$(".lblConfig").text("Configuración");
		$(".lblStoreNo").html("N° Tienda<span>*</span>");
		$(".storeNo").attr('placeholder',"Ingrese el número de tienda");
		$(".lblServerId").html("IP del Servidor<span>*</span>");
		$(".serverId").attr('placeholder',"Ingrese la IP del servidor");
		$(".lblPrinter").html("Impresora<span>*</span>");
		$(".btnSave").text("Guardar");
		$(".lblEmail").html("Correo Electrónico<span>*</span>");
		$(".emailUser").attr('placeholder',"contacto@email.com");
		$(".lblOldPassword").html("Contraseña anterior<span>*</span>");
		$(".lblPassword").html("Nueva Contraseña<span>*</span>");
		$(".lblConfirmPassword").html("Confirmar Contraseña<span>*</span>");
		$(".btnFinish").text("Finalizar");
		$(".lblSetColor").text("Establecer Color");
		$(".lblStoreSettings").text("Configuración de la Tienda");
		$(".lblAccountSettings").text("Configuración de la Cuenta");
		$(".lblShow3orless").text("Activar módulo TRES O MENOS");
		$(".lblTransactionType").text("Tipo de Transacción");
		$(".lblSalesorder").text("Orden de Venta");
		$(".lblReceipt").text("Factura");
		localStorage.caption_msgCompleteRequiredField = "Complete el campo requerido!";
		localStorage.caption_msgIncorrectIPFormat = "El formato de IP del servidor es incorrecto!";
		localStorage.caption_msgVerifyFields = "Por favor, verifique los campos e inténtelo nuevamente!";
		localStorage.caption_msgWrongPasswordConfirmation = "La confirmación de la contrasena no es correcta!";
		localStorage.caption_msgWrongEmailFormat = "El formato de email es incorrecto!";
		localStorage.caption_msgWrongPassword = "La contrasena no es correcta!";
		localStorage.caption_msgConfigurationSuccess = "Configuración realizada exitosamente!";
		localStorage.caption_msgPasswordSetUpSuccessfully = "Asignación de contraseña exitosa!";
	}else{
		localStorage.caption_msgIncorrectIPFormat = "Server IP format is wrong!";
		localStorage.caption_msgWrongPasswordConfirmation = "Password confirmation is wrong!";
		localStorage.caption_msgWrongEmailFormat = "Wrong email format!";
		localStorage.caption_msgWrongPassword = "Password is incorrect!";
		localStorage.caption_msgConfigurationSuccess = "Successfully configuration!";
		localStorage.caption_msgPasswordSetUpSuccessfully = "Successfully password assign!";
	}
}