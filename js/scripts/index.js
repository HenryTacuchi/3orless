$(document).ready(function(){

	getLanguage();	
	checkConfiguration();
	showLoading(true);
	if(localStorage.noSettings == 0){
		getImagesFromServer();
	}
	LoadBackgroundImages();

	//when click in home screen redirects to Search screen
	$(".home").click(function(){
		window.location = "search.html";
	});

	//show or hide form to redirect to configuration screen
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

	//bring all background images and logo from server
	$(".btn-refresh").click(function(){
		showLoading(true);
		//remove div class item for all images
		$(".item").remove();
		//remove images from local storage
		for (var i = 0; i < localStorage.countImages; i++) {
			localStorage.removeItem("backgroundImage" + (i+1));
		}
		//remove logo image
		localStorage.removeItem("logo");
		
		getImagesFromServer();
	});

	//change type input text form email or password in function of radio button selected
	$("input[name='opt']").change(function(){
		var opt = $('input[name="opt"]:checked').val();
	    if(opt == "email"){
	    	$('.emailPassConfig').attr('type','text');
	    }else{
	    	$('.emailPassConfig').attr('type','password');
	    }
	});

	//validate email or password and redirects to configuration screen
	$(".btnDone").click(function(){
		var opt = $('input[name="opt"]:checked').val();
		var emailPassConfig = $(".emailPassConfig").val();
		var password = localStorage.password;
		var emailUser = localStorage.emailUser;

		//validate input text
		if(emailPassConfig.length>0){
			if($(".noEmailPassConfig").hasClass("show"))
							$(".noEmailPassConfig").removeClass("show").addClass("hide");
			//validate password
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
			}
			//validate email
			else{
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
		}
		else{
			$(".emailPassConfig").focus();
			$(".noEmailPassConfig").removeClass("hide").addClass("show");
			if (localStorage.current_lang == "es") { $(".noEmailPassConfig").text("Complete el campo requerido!"); } 
			else { $(".noEmailPassConfig").text("Please fill the required field!"); }
		}
	});

    //when pages is loaded clear items from local storage
    $(window).on("load", function() {
		showLoading(false);
		clearSearchPage();
		localStorage.orderResults = "";		
    });
});

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
}

//get language from navigator and saved in local storage
function getLanguage(){
    var lang = "";
    lang = navigator.language.split("-");
    localStorage.current_lang = (lang[0]);             
}

//validate if exists configuration data in local storage
function checkConfiguration(){
	//if there is no configuration
	if ((typeof localStorage.storeNo != "undefined" && localStorage.storeNo != null && localStorage.storeNo != "") 
		&& (typeof localStorage.serverId != "undefined" && localStorage.serverId != null && localStorage.serverId != "") 
		&& (typeof localStorage.emailUser != "undefined" && localStorage.emailUser != null && localStorage.emailUser != "")) {
		//stay in home screen
	}else{
		//redirect to configuration screen
		localStorage.noSettings = 0;
		window.location = "config.html";
	}
}

	//show saved background images in home screen
function LoadBackgroundImages() {
	var countItem = 1;
	var template = _.template($("#divItemTemplate").html());
    var html = template({
        itemClass: "item divItem" + countItem
    });
    $(".inside").append(html);
	for (var i = 0; i < localStorage.countImages; i++) {
		template = _.template($("#divImageTemplate").html());
        html = template({
            path: localStorage["backgroundImage"+(i+1)]
        });
        $(".divItem" + countItem).append(html);
    	if(i % 2 == 1 && i != localStorage.countImages-1){
	        countItem++;
    		template = _.template($("#divItemTemplate").html());
	        html = template({
	            itemClass: "item divItem" + countItem
	        });
	        $(".inside").append(html);
    	}
	}   
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

//bring images from server and save in local
function getImagesFromServer(){
	$.ajax({
        type: "GET",
        url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/LoadImages",
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

            var data = result.LoadImagesResult.Images;                
            if (data != null) {
            	var countItem = 0;
        		var sizeData = data.length;   
        		if(sizeData % 2 == 1) localStorage.countImagesOdd = 1;
        		else localStorage.countImagesOdd = 0;

				localStorage.rowCountImages = 2;
				localStorage.columnCountImages = Math.round(sizeData/2);
                $.each(data, function (index, value) {
                    localStorage["backgroundImage"+(countItem+1)] = value;
                    countItem++;
                });                    

            }
            localStorage.noSettings = 1;
            localStorage.countImages = countItem;

            //logo image
            localStorage.logo=result.LoadImagesResult.ImageLogo;
			localStorage.imageServerError = 0
            location.reload();
        },
        error: function (error) {
        	//remove div class item for all images
			$(".item").remove();
			//remove images from local storage
			for (var i = 0; i < localStorage.countImages; i++) {
				localStorage.removeItem("backgroundImage" + (i+1));
			}
			//remove logo image
			localStorage.removeItem("logo");
			if(localStorage.noSettings == 1) localStorage.imageServerError = 1;
        	window.location = "config.html";            	
        }
    });
}