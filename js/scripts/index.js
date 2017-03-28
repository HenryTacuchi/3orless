$(document).ready(function(){

	getLanguage();	
	checkConfiguration();
	showLoading(true);
	getCaptions();
	setCaptions();
    
	if(localStorage.noImageFromServer == 0){
		getImagesFromServer();	
		localStorage.countProductCartItem = 0;
		localStorage.countScannedItem = 0;
		localStorage.existOldCartItem = 0;
	}

	LoadBackgroundImages();

	//when click in home screen redirects to Search screen
	$(".home").click(function(){
		window.location.href = "menu.html";
	});

	//show or hide form to redirect to configuration screen
	$(".btn-config").click(function(){
		if($(".settingsForm").hasClass("hide")){
			$('.emailPassConfig').val("");
			$(".settingsForm").removeClass("hide").addClass("show animated bounceInUp");
		}else{
			if($(".settingsForm").hasClass('show'))
				$(".settingsForm").removeClass("show animated bounceInUp").addClass("animated bounceOutLeft");
			else{				
				$('.emailPassConfig').val("");
				$(".settingsForm").removeClass("animated bounceOutLeft").addClass("show animated bounceInUp");
			}
		}
		$(".emailPassConfig").focus();
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
		getCaptions();
		clearSearchPage();
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
					$(".noEmailPassConfig").text(localStorage.caption_msgWrongPassword);
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
					$(".noEmailPassConfig").text(localStorage.caption_msgWrongEmail);
				}
			}
		}
		else{
			$(".emailPassConfig").focus();
			$(".noEmailPassConfig").removeClass("hide").addClass("show");
			$(".noEmailPassConfig").text(localStorage.caption_msgCompleteRequiredField);
		}
	});

});

//when pages is loaded clear items from local storage
$(window).on("load", function() {
	showLoading(false);
	if(localStorage.threeOrLessOrderResults == undefined) localStorage.threeOrLessOrderResults = "";		
	if(localStorage.kioskOrderResults == undefined) localStorage.kioskOrderResults = "";		
});


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
		localStorage.noImageFromServer = 0;
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
			localStorage.noImageFromServer = 1;
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

function getCaptions(){
	$.ajax({
        type: "GET",
        url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/GetCaptions/"+localStorage.current_lang,
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

            var data = result.getCaptionsResult;                
            if (data != null) {
            	$.each(data, function (index, value) {
            		localStorage["caption_"+value.ObjectName] = value.CaptionText; 
                });      
            }
        },
        error: function (error) {

        }
    });
}

function setCaptions(){
	$(".txtTouchToContinue").text(localStorage.caption_txtTouchToContinue);
	$(".lblPasswordOpt").text(localStorage.caption_lblPasswordOpt);
	$(".lblEmailOpt").text(localStorage.caption_lblEmailOpt);
	$(".lblEmailPassword").text(localStorage.caption_lblEmailPassword);
	$(".btnAccess").text(localStorage.caption_btnAccess);
}


