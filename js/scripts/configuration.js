$(document).ready(function(){
	 // localStorage.clear();
	 // alert(localStorage.password);
	// overall delay for disappearance of animations
	var delay=2500;
	// show settings stored
	loadData();
	// check if the user set the password to show or not the textbox old password
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
		}
		else {
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
			$(".validations").delay(delay).queue(function(){
			    $(this).addClass("animated fadeOutLeft").dequeue();
			});
		}
    });

    $(".btnFinish").click(function(){
    	if (localStorage.current_lang == "es") { $(".txtMessage").text("Por favor, verifique los campos e inténtelo nuevamente!"); }
    	else{$(".txtMessage").text("Validation errors occurred. Please confirm the fields and submit it again.!");}
		$(".validations").addClass("hide");
		$(".validations").removeClass("animated fadeOutLeft");	
		var checkEmail= validateEmail();
		var storeNo = localStorage.storeNo, serverId = localStorage.serverId, emailUser = localStorage.emailUser, password = localStorage.password;	    

	    if ((typeof storeNo != "undefined" && localStorage.storeNo != null) && (typeof serverId != "undefined" && localStorage.serverId != "null") && (typeof password != "undefined" && localStorage.password!="null")) {
	     	// Validate old password
	     	var oldPass=$(".oldPass").val(); 
 			var newPass=$(".passUser").val();
 			var repPass=$(".confirmPassUser").val(); 
 			var emailUser=$(".emailUser").val();
	     	if (localStorage.password == oldPass){
	     		if($(".noOldPassword").hasClass("show"))
					$(".noOldPassword").removeClass("show").addClass("hide");
     			if (newPass == repPass && checkEmail != -1) { 
     				if(newPass.length==0)
     					savePassword(oldPass,emailUser);  
     				else
     					savePassword(newPass.trim(),emailUser);  
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
		else{

		// Check both password new one and repeated one
			var newPass=$(".passUser").val(); 	
			var repPass=$(".confirmPassUser").val(); 
			var emailUser=$(".emailUser").val(); 

			if (newPass == repPass && checkEmail != -1 && newPass.length >0) {
			    savePassword(newPass.trim(),emailUser);
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

		
    });

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

	function checkPassword(){
        var password =localStorage.password;

        if (typeof password == "undefined" || localStorage.password == "null") {
        	$(".areaOldPass").removeClass("show").addClass("hide");
        }
        else{        	
        	$(".areaOldPass").removeClass("hide").addClass("show");
        }
	}

	function savePassword(password,emailUser){		
	    localStorage.password = password;
	    localStorage.emailUser = emailUser;
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

	function loadData(){
	    var storeNo = localStorage.storeNo, serverId = localStorage.serverId, emailUser = localStorage.emailUser;
	    if ((typeof storeNo != "undefined" && localStorage.storeNo != null) && (typeof serverId != "undefined" && localStorage.serverId != "null") ) {
	        $(".storeNo").val(localStorage.storeNo);
	        $(".serverId").val(localStorage.serverId);
	        $(".emailUser").val(localStorage.emailUser);
	        $(".oldPass").val(localStorage.password);
	        // var emailUser = localStorage.emailUser;
	        // var checkDom = emailUser.lastIndexOf("@");
         //    var resultDom = emailUser.substring(checkDom + 1);
            //var splitemailUser= emailUser.substring(0,checkDom);
	        // Set the value saved in the db
            // if (existDomain > 0) {
            //     $(".emailUserUser").val(splitemailUser);

            // }
            // else {
            //     $(".emailUserUser").val(emailUser);

            // }
	    }
	}

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

	function validateIP(){
        var serverId=$(".serverId").val();
        var array = serverId.split(".");
        if((typeof array[0] != "undefined" && array[0] != "" && !isNaN(array[0])) && (typeof array[1] != "undefined" && array[1] != "" && !isNaN(array[1])) && (typeof array[2] != "undefined" && array[2] != "" && !isNaN(array[2])) && (typeof array[3] != "undefined" && array[3] != "" && !isNaN(array[3]))){  
        	return serverId;  
        }
        else{ return -1 }
      
    }
});