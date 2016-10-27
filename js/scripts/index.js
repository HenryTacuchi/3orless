$(document).ready(function(){

	$(".btn-config").click(function(){
		if($(".settingsForm").hasClass("hide")){
			$('.emailPassConfig').val("");
			$(".settingsForm").removeClass("hide").addClass("show animated bounceInUp");
		}else
			if($(".settingsForm").hasClass('show'))
				$(".settingsForm").removeClass("show animated bounceInUp").addClass("animated bounceOutLeft");
			else{				
				$('.emailPassConfig').val("");
				$(".settingsForm").removeClass("animated bounceOutLeft").addClass("show animated bounceInUp");
			}
	});

	$("input[name='opt']").change(function(){
		var opt = $('input[name="opt"]:checked').val();
	    if(opt == "email"){
	    	$('.emailPassConfig').attr('type','text');
	    }else{
	    	$('.emailPassConfig').attr('type','password');
	    }
	});

	$(".btnDone").click(function(){
		var opt = $('input[name="opt"]:checked').val();
		var emailPassConfig = $(".emailPassConfig").val();
		var password = localStorage.password;
		var emailUser = localStorage.emailUser;
		if(emailPassConfig.length>0){
			if($(".noEmailPassConfig").hasClass("show"))
							$(".noEmailPassConfig").removeClass("show").addClass("hide");
			if(opt == "password" ){
				if(password==emailPassConfig){
					window.location = "config.html";
				}
				else{
					$(".emailPassConfig").focus();
					$(".noEmailPassConfig").removeClass("hide").addClass("show");
					if (localStorage.current_lang == "es") { $(".noEmailPassConfig").text("La contrasena no es correcta!"); } 
					else { $(".noEmailPassConfig").text("Please, check your password again!"); }
				}
			}else {
				if(emailUser==emailPassConfig){
					window.location ="config.html";
				}
				else{
					$(".emailPassConfig").focus();
					$(".noEmailPassConfig").removeClass("hide").addClass("show");
					if (localStorage.current_lang == "es") { $(".noEmailPassConfig").text("El email no es correcto!"); } 
					else { $(".noEmailPassConfig").text("Please, check your email again!"); }
				}
			}
		}else{
			$(".emailPassConfig").focus();
			$(".noEmailPassConfig").removeClass("hide").addClass("show");
			if (localStorage.current_lang == "es") { $(".noEmailPassConfig").text("Complete el campo requerido!"); } 
			else { $(".noEmailPassConfig").text("Please fill the required field!"); }
		}

		
	});
});