// overall delay for disappearance of animations
var delay=2500;
// var printerConnection = false;
var loadCboPrinters = {
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
    // function, we must explicitly call 'loadCboPrinters.receivedEvent(...);'
    onDeviceReady: function() {
        loadCboPrinters.receivedEvent('deviceready');    

   			//Bluetooth Printer
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
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    }
};

// var checkPrinterConnection = {
//     // Application Constructor
//     initialize: function() {
//         this.bindEvents();
//     },
//     // Bind Event Listeners
//     //
//     // Bind any events that are required on startup. Common events are:
//     // 'load', 'deviceready', 'offline', and 'online'.
//     bindEvents: function() {
//         document.addEventListener('deviceready', this.onDeviceReady, false);
//     },
//     // deviceready Event Handler
//     //
//     // The scope of 'this' is the event. In order to call the 'receivedEvent'
//     // function, we must explicitly call 'loadCboPrinters.receivedEvent(...);'
//     onDeviceReady: function() {
//         checkPrinterConnection.receivedEvent('deviceready');

//    			//Bluetooth Printer
// 		   	BTPrinter.connect(function(data){
// 			    console.log("Success");
// 			    console.log(data);
// 			    printerConnection = true;
// 			},function(err){
// 			    console.log("Error Connect");
// 			    console.log(err)
// 			    printerConnection = false;
// 			}, localStorage.printerName)					 
//     },
//     // Update DOM on a Received Event
//     receivedEvent: function(id) {
//     }
// };

$(document).ready(function(){
	// localStorage.clear();

    // $(".emailUser").emailautocomplete({
    //     suggClass: "custom-classname", 
    //     domains: ["realcs.com"] 
    // });
     
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
	//fill dropdown with all available bluetooth printers
	loadCboPrinters.initialize();

	//check if exists images for home in server
	if(localStorage.imageServerError == 1){
		$(".serverId").focus();
		$(".noServerId").removeClass("hide").addClass("show");
		if (localStorage.current_lang == "es") { $(".noServerId").text("Por favor, revise la IP del servidor!"); } 
		else { $(".noServerId").text("Please, check server IP!"); }
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
		if (localStorage.current_lang == "es") 
			{ $(".txtMessage").text("Error de conexión con el servidor. Por favor, verifique la IP!"); } 
		else
			{{ $(".txtMessage").text("Server connection error. Please, check Server IP!"); } }
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

		// $.ajax({
		// 	type: "GET",
	 //        // url: "http://" + serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/Test",
	 //        url: "http://" + serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/GetFilter/" + storeNo,
	 //        // async: false,
	 //        contentType: "application/json",
	 //        crossdomain: true,
	 //        timeout: 10000,
	 //        beforeSend: function(){
	 //            showLoading(true);
	 //        },
	 //        complete: function(){
	 //            showLoading(false);
	 //        },
	 //        success:function(result){
	 //        	checkPrinterConnection.initialize()
	        	if(storeNo.length>0 && checkIP != -1){
				    saveConfiguration(storeNo.trim(),serverId.trim());
				    $(".settings-1").removeClass('fadeInDown').addClass("fadeOutLeft");
				    $(".settings-2").removeClass("hide").addClass("animated fadeInLeft");
				    $(".emailUser").focus();
				}
				else {
					// if (printerConnection == false){
					// 	$(".noPrinter").removeClass("hide").addClass("show");
					// 	if (localStorage.current_lang == "es") { $(".noPrinter").text("No hay conexión con la impresora!"); } 
					// }else{
					// 	if($(".noPrinter").hasClass("show"))
					// 		$(".noPrinter").removeClass("show").addClass("hide");
					// }
					if (checkIP==-1){
						$(".serverId").focus();
						$(".noServerId").removeClass("hide").addClass("show");

						if (serverId.length==0){
							if (localStorage.current_lang == "es") { $(".noServerId").text("Complete el campo requerido!"); } 
						}else{
							if (localStorage.current_lang == "es") { $(".noServerId").text("El formato de IP del servidor es incorrecto!"); } 
							else { $(".noServerId").text("Server IP format is wrong!"); }
						}
					}else{
						if($(".noServerId").hasClass("show"))
							$(".noServerId").removeClass("show").addClass("hide");
					}
					if (storeNo.length==0){
						$(".storeNo").focus();
						$(".noStoreNo").removeClass("hide").addClass("show");
						if (localStorage.current_lang == "es") { $(".noStoreNo").text("Complete el campo requerido!"); } 
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

					if (localStorage.current_lang == "es") { $(".txtMessage").text("Por favor, verifique los campos e inténtelo nuevamente!"); } 
					else { $(".txtMessage").text("Validation errors occurred. Please confirm the fields and submit it again!"); } 

					$(".validations").delay(delay).queue(function(){
					    $(this).addClass("animated fadeOutLeft").dequeue();
					});
				}
    //     	},
	   //      error:function(error) {
	   //      	if($(".txtMessage").hasClass("success")){
				// 	$(".txtMessage").removeClass("success").addClass("danger");
				// 	$(".btn-mini-img").removeClass("success").addClass("danger").find('span').empty().html('&#xe645');
				// }
				// else{
				// 	$(".txtMessage").addClass("danger");
				// 	$(".btn-mini-img").addClass("danger").find('span').empty().html('&#xe645');
				// }
	   //          $(".validations").removeClass("hide").addClass("animated fadeInLeft");

				// if (localStorage.current_lang == "es") { $(".txtMessage").text("No hay conexión con el servidor!"); } 
				// else { $(".txtMessage").text("There is no server conection!"); } 
				// $(".validations").delay(delay).queue(function(){
				//     $(this).addClass("animated fadeOutLeft").dequeue();
				// });
	   //      }
    //     });

  // 			}
		// ], function(err, results) {
		//     // optional callback
		// });
		
    });

	//Save email and password
    $(".btnFinish").click(function(){
    	localStorage.colorBackground = $(".form-color").val();    	
    	if (localStorage.current_lang == "es") { $(".txtMessage").text("Por favor, verifique los campos e inténtelo nuevamente!"); }
    	else{$(".txtMessage").text("Validation errors occurred. Please confirm the fields and submit it again.!");}
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

					if (localStorage.current_lang == "es") { $(".txtMessage").text("Por favor, verifique los campos e inténtelo nuevamente!"); }
					else { $(".txtMessage").text("Validation errors occurred. Please confirm the fields and submit it again!"); } 
					$(".validations").delay(delay).queue(function(){
					    $(this).addClass("animated fadeOutLeft").dequeue();
					});
					$(".noConfirmPassUser").removeClass("hide").addClass("show");
					if (localStorage.current_lang == "es") { $(".noConfirmPassUser").text("La confirmaci\u00f3n de la contrasena no es correcta!"); } 
								else { $(".noConfirmPassUser").text("Please, check your password and confirmation again!"); }
				    $(".confirmPassUser").focus();
				    if (repPass.length==0){
						$(".confirmPassUser").focus();
						$(".noConfirmPassUser").removeClass("hide").addClass("show");
						if (localStorage.current_lang == "es") { $(".noConfirmPassUser").text("Complete el campo requerido!"); } 
					}
					if (newPass.length==0){
						$(".passUser").focus();
						$(".noPassUser").removeClass("hide").addClass("show");
						if (localStorage.current_lang == "es") { $(".noPassUser").text("Complete el campo requerido!"); }
					}else{
						if($(".noPassUser").hasClass("show"))
							$(".noPassUser").removeClass("show").addClass("hide");
					}
					if (oldPass.length==0){
						$(".oldPass").focus();
						$(".noOldPassword").removeClass("hide").addClass("show");
						if (localStorage.current_lang == "es") { $(".noOldPassword").text("Complete el campo requerido!"); } 
					}
					if (checkEmail==-1){
						$(".emailUser").focus();
						$(".noEmailUser").removeClass("hide").addClass("show");

						if (emailUser.length==0){
							if (localStorage.current_lang == "es") { $(".noEmailUser").text("Complete el campo requerido!"); } 
						}else{
							if (localStorage.current_lang == "es") { $(".noEmailUser").text("El formato de email es incorrecto!"); } 
							else { $(".noEmailUser").text("Email format is wrong!"); }
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

				if (localStorage.current_lang == "es") { $(".txtMessage").text("Por favor, verifique los campos e inténtelo nuevamente!"); }
				else { $(".txtMessage").text("Validation errors occurred. Please confirm the fields and submit it again!"); } 
				$(".validations").delay(delay).queue(function(){
				    $(this).addClass("animated fadeOutLeft").dequeue();
				});
				$(".noOldPassword").removeClass("hide").addClass("show");
				if (localStorage.current_lang == "es") { $(".noOldPassword").text("La contrasena no es correcta!"); } 
							else { $(".noOldPassword").text("Please, check your old password again!"); }
			    $(".oldPass").focus();

			    if (repPass.length==0){
					$(".confirmPassUser").focus();
					$(".noConfirmPassUser").removeClass("hide").addClass("show");
					if (localStorage.current_lang == "es") { $(".noConfirmPassUser").text("Complete el campo requerido!"); } 
				}else{
					if($(".noConfirmPassUser").hasClass("show"))
						$(".noConfirmPassUser").removeClass("show").addClass("hide");
				}
				if (newPass.length==0){
					$(".passUser").focus();
					$(".noPassUser").removeClass("hide").addClass("show");
					if (localStorage.current_lang == "es") { $(".noPassUser").text("Complete el campo requerido!"); } 
				}else{
					if($(".noPassUser").hasClass("show"))
						$(".noPassUser").removeClass("show").addClass("hide");
				}
				if (oldPass.length==0){
					$(".oldPass").focus();
					$(".noOldPassword").removeClass("hide").addClass("show");
					if (localStorage.current_lang == "es") { $(".noOldPassword").text("Complete el campo requerido!"); } 
				}
				if (checkEmail==-1){
					$(".emailUser").focus();
					$(".noEmailUser").removeClass("hide").addClass("show");

					if (emailUser.length==0){
						if (localStorage.current_lang == "es") { $(".noEmailUser").text("Complete el campo requerido!"); }
					}else{
						if (localStorage.current_lang == "es") { $(".noEmailUser").text("El formato de email es incorrecto!"); } 
						else { $(".noEmailUser").text("Email format is wrong!"); }
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

				if (localStorage.current_lang == "es") { $(".txtMessage").text("Por favor, verifique los campos e inténtelo nuevamente!"); } 
				else { $(".txtMessage").text("Validation errors occurred. Please confirm the fields and submit it again!"); } 
				$(".validations").delay(delay).queue(function(){
				    $(this).addClass("animated fadeOutLeft").dequeue();
				});
				$(".noConfirmPassUser").removeClass("hide").addClass("show");
				if (localStorage.current_lang == "es") { $(".noConfirmPassUser").text("La confirmaci\u00f3n de la contrasena no es correcta!"); } 
							else { $(".noConfirmPassUser").text("Please, check your password and confirmation again!"); }
			    $(".confirmPassUser").focus();

			    if (repPass.length==0){
					$(".confirmPassUser").focus();
					$(".noConfirmPassUser").removeClass("hide").addClass("show");
					if (localStorage.current_lang == "es") { $(".noConfirmPassUser").text("Complete el campo requerido!"); } 
				}
				if (newPass.length==0){
					$(".passUser").focus();
					$(".noPassUser").removeClass("hide").addClass("show");
					if (localStorage.current_lang == "es") { $(".noPassUser").text("Complete el campo requerido!"); } 
				}else{
					if($(".noPassUser").hasClass("show"))
						$(".noPassUser").removeClass("show").addClass("hide");
				}
				if (checkEmail==-1){
					$(".emailUser").focus();
					$(".noEmailUser").removeClass("hide").addClass("show");

					if (emailUser.length==0){
						if (localStorage.current_lang == "es") { $(".noEmailUser").text("Complete el campo requerido!"); } 
					}else{
						if (localStorage.current_lang == "es") { $(".noEmailUser").text("El formato de email es incorrecto!"); } 
						else { $(".noEmailUser").text("Email format is wrong!"); }
					}
				}else{
					if($(".noEmailUser").hasClass("show"))
						$(".noEmailUser").removeClass("show").addClass("hide");
				}
			}
		}	

		clearSearchPage();
		
    });

    $(document).on("click",".printer-item",function(){
    	$(".printer-dropdown").text($(this).text());
        localStorage.printerName = $(this).text();        
    });


	//when page is loaded hide loaders
    $(window).on("load", function() {
       showLoading(false);
    });

});

//store data in local storage: StoreNo and ServerId
function saveConfiguration(storeNo, serverId) {
    localStorage.storeNo = storeNo;
    localStorage.serverId = serverId;
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
    if (localStorage.current_lang == "es") { $(".txtMessage").text("Configuraci\u00f3n realizada exitosamente!"); } 
    else { $(".txtMessage").text("Configuration set up successfully!"); }

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
    if (localStorage.current_lang == "es") { $(".txtMessage").text("Asignaci\u00f3n de contrase\u00f1a exitosa!"); } 
    else { $(".txtMessage").text("Password set up successfully!"); }

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

// var w;
// function startWorker() {
//     if (typeof(Worker) !== "undefined") {
// 	    if(typeof(w) == "undefined") {
//             w = new Worker("../js/scripts/printFunctions.js");
//         }
//         // w.onmessage = function(event) {
//         //     printerConnection = event.data;
//         // };
//         // w.terminate();
//         // w = undefined;
//         // showLoading(false);
// 	} else {
// 	    alert("Sorry! No Web Worker support..");
// 	}
// }


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

