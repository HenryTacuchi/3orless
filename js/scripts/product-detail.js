$(document).ready(function(){
    var data;

    setCaptions();
    //show or hide options for 3orless or Kiosk
    if(localStorage.flag3orless == 1){
        $(".right-options").show();
        $(".btn-add-continue").show();
        $(".btn-add-finish").show();
    }
    else {
        $(".right-options").hide();
        $(".btn-add-continue").hide();
        $(".btn-add-finish").hide();
    }

    /*FJ*/
    if (Number(localStorage.totalPrice)>0) {
        $(".span-precio-total").text('$'+localStorage.totalPrice);
    }else{
        $(".span-precio-total").text('$0.00');
    }

    /*FJ*/
    if(localStorage.countProductCartItem==null ||  localStorage.countProductCartItem==0){
        $(".item-count").addClass("hide");
    }else{
        $(".item-count").text(localStorage.countProductCartItem);
    }

    getProductSelect();    

    //cart button redirects to cart items screen
    $(".btn-star").click(function(){
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

    //home button redirects to home screen
    $(".btn-home").click(function(){
        window.location = "menu.html";
    });

    //home button redirects to home screen
    $(".btn-back").click(function(){
        localStorage.isComingBack = 1;
        if (localStorage.flag3orless == 0){
            window.location = "searchKiosk.html";
        }else{
            window.location = "search3orless.html";
        }
    });
    $(".btn-add-continue").click(function(){
        //if product has added successfully to cart item, redirects to search screen
        if(addProductCartItem())
            window.location = "search3orless.html";
        else{
            //stay in product detail screen
        }      
    });

    $(".btn-add-finish").click(function(){
        if(addProductCartItem())
            window.location = "cart-items.html";
        else{
            //stay in product detail screen
        }  
    });

    $(".btn-CheckStores").click(function(){
        var title,storeName,address,phone,stockQty;
        var lblAddress,lblPhone,confirmButtonText,textStores;
        var sizeCode = $(".size-dropdown").text();
        var tempColorSelected = localStorage.resultsProductColorCodeSelected.replace("/","-");
        $.ajax({
            type: "GET",
            url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/checkProductStockInOtherStores/" + localStorage.resultsProductStyleCodeSelected + "/" + sizeCode +"/" + tempColorSelected ,            
            async: false,
            contentType: "application/json",
            crossdomain: true,
            timeout: 10000,
            beforeSend: function(){
                showLoading(true);
            },
            complete: function(){
                showLoading(false);
            },
            success: function (result) {
                //Product Selected                
                data = result; 
                if (data != null) {

                    title = localStorage.caption_modalStoreTitle;            
                    lblAddress = localStorage.caption_lblAddress + ":";
                    lblPhone = localStorage.caption_lblNumber + ":";
                    confirmButtonText = localStorage.caption_txtConfirmButton;

                    textStores = "<ul class='storesArea'>";
                        
                    for (var i = 0; i <data.checkProductStockInOtherStoresResult.length; i++) {
                        storeName = data.checkProductStockInOtherStoresResult[i].StoreName;
                        address = data.checkProductStockInOtherStoresResult[i].Address + " " +
                                    data.checkProductStockInOtherStoresResult[i].City + " " +
                                    data.checkProductStockInOtherStoresResult[i].State + " " +
                                    data.checkProductStockInOtherStoresResult[i].ZipCode;
                        phone = data.checkProductStockInOtherStoresResult[i].Phone1;
                        stockQty = data.checkProductStockInOtherStoresResult[i].OnHandQty;
                        textStores += "<li class='row store'>"+
                        "<div class='col-xs-9 center-text'>"+
                            "<div class='text-left'><span class='txtStoreName storeName'>"+storeName+"</span></div>"+
                            "<div class='text-left'><span class='lblAddress'>"+lblAddress+"</span><span class='txtAddress'> "+address+"</span></div>"+
                            "<div class='text-left'><span class='lblPhone'>"+lblPhone+"</span><span class='txtPhone'> "+phone+"</span></div>"+
                          "</div>"+
                          "<div class='col-xs-3 center-text'>"+
                            "<div class='text-right'>"+
                              "<span class='txtStockOtherStore'>"+localStorage.caption_lblOnHand+":</span>"+
                              "<span class='lblStockOtherStore'>"+stockQty+"</span>"+
                            "</div>"+
                          "</div>"+
                          "</li>";
                    }

                    textStores += "</ul>",
                    swal({
                      title: title,
                      text: textStores,
                      confirmButtonColor: "#8fbf75",
                      confirmButtonText: confirmButtonText,          
                      html: true,        
                      closeOnConfirm: true
                    });
                }              

            },
            error: function (error) {
                // alert(error);
            }
        });


        
    })

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


    function getProductSelect(){
        var tempColorSelected;
        var webServiceURL = "";

        if(localStorage.resultsProductSKUSelected == undefined || localStorage.resultsProductSKUSelected == ''){
            tempColorSelected = localStorage.resultsProductColorCodeSelected.replace("/","-");
            webServiceURL = "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/findProductBySC-Color/" + localStorage.resultsProductStyleCodeSelected + "/" + tempColorSelected +"/" + localStorage.storeNo;
        }
        else{
            webServiceURL = "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/FindProductBySkuStore/" + localStorage.resultsProductSKUSelected + "/" + localStorage.storeNo;   
        }

        $.ajax({
            type: "GET",
            url: webServiceURL,
            async: false,
            contentType: "application/json",
            crossdomain: true,
            timeout: 10000,
            beforeSend: function(){
                showLoading(true);
            },
            complete: function(){
                showLoading(false);
            },
            success: function (result) {
                //Product Selected                
                if(localStorage.resultsProductSKUSelected == undefined || localStorage.resultsProductSKUSelected == ''){
                    data = result.findNProductByStyleCodeAndColorResult; 
                }
                else{
                    data = result.findNProductBySkuStoreResult;    
                }
                if (data != null) {

                	//PRODUCT SELECT
                	//items
                    $(".txtProductDetail").text(data.shortDescr);
                    /*FJ*/
                    if (data.shortDescr.length >= 20) {
                        $(".txtProductDetail").css('font-size','18px');
                        $(".btn-CheckStores").css('margin-bottom','10px');
                        $('.productDetail').css('margin','12px 15px');
                        $('.mainImg').css('margin','12px 0px');
                        $('.views').css('margin','12px 15px 12px 0');
                    }
                    /*FJ*/
                	$(".txtBrand").text(data.brandName);
                    $(".txtStyleCode").text(data.styleCode);
                	$(".txtStyle").text(data.styleName);
                    $(".txtColorCode").text(data.colorCode);
                	$(".txtRetailPrice").text("$" + data.price);
                    $(".txtOriginalPrice").text("$" + (data.productPrice).toFixed(2));
                	$(".txtOnHand").text(data.listStock[0]);
                	// 

                	//Images
                	$(".main-img").attr("src",data.listImages[0]);
                    $(".view-1").attr("src",data.listImages[0]);
                    $(".view-2").attr("src",data.listImages[1]);
                    $(".view-3").attr("src",data.listImages[2]);
                    $(".view-4").attr("src",data.listImages[3]);

                    var listclones = "<li class='behind view-2'><img src='"+data.listImages[1]+"'></li> <li class='behind view-3'><img src='"+data.listImages[2]+"'></li> <li class='behind view-4'><img src='"+data.listImages[3]+"'></li>"; 
                    // Clones
                    // $('.list-clones').append(listclones);

                    //Size
                    $(".size-dropdown").text(data.listSize[0]);
                    for (var i = 0; i < data.listSize.length; i++) {
                		var template = _.template($("#listItemTemplate").html());
	                    var html = template({
	                       ItemText:data.listSize[i],
	                      // sizeCode:data.listSize[i]
                          sizeCode: i
                    });
                    $(".listSize").append(html);
                	}

                    //suggested Product
                    if(data.suggestedProduct.length > 0){
                        showMessage(false);
                    }else{
                        showMessage(true);
                    }

                	 var countProductItem = 0;
                	for (var i = 0; i < data.suggestedProduct.length; i++) {
                		var template = _.template($("#productItemTemplate").html());
	                    var html = template({
	                   	Class: "product-" + (countProductItem+1),
			            path: data.suggestedProduct[i].imageFile,
		                styleCode: data.suggestedProduct[i].styleCode,
		                colorCode: data.suggestedProduct[i].colorCode,
		                styleName: data.suggestedProduct[i].styleName,
		                brandCode: data.suggestedProduct[i].brandCode,
		                brandName: data.suggestedProduct[i].brandName,
		                price: data.suggestedProduct[i].price,
                        productPrice: (data.suggestedProduct[i].productPrice).toFixed(2),

                    });
	                    countProductItem++;
                        
                    $(".related-products").append(html);
                	}

                    $(".related-products").addClass("items-"+ countProductItem);
                    localStorage.removeItem("resultsProductSKUSelected");
                }
                else{
                    localStorage.removeItem("resultsProductSKUSelected");
                    if (localStorage.flag3orless == 0) {
                        window.location = "searchKiosk.html";
                    }else{
                        window.location = "search3orless.html";
                    }
                }   
                $(".txtStyleName").text(localStorage.caption_txtStyleName);           

            },
            error: function (error) {
                // alert(error);
            }
        });
    }
    //show or hide image logo
    function showMessage(option){
        if(option){  
            $(".no-related-products").show();
        }else{
            $(".no-related-products").hide();
        }
    }

    $(".view").click(function(){
        $(".main-img").remove();
        $('.figureMainImg').append("<img src='"+this.src+"' alt='Main Img' class='main-img ' onerror='handleError(this)'>");
        setSizeImages();
    });

$(".size-item").click(function(){
	//  $(".sort-dropdown").text($(this).attr("data-value"));
    $(".size-dropdown").text($(this).text());
    $(".txtOnHand").text(data.listStock[$(this).attr("data-value")]);
});


$(".btn-CheckStores").click(function(){
    $("#modalOtherStores").modal("show");
});


//save index of product selected and redirect to product detail screen
$(document).on("click",".product",function(){
	showLoading(true);
	var className = this.className;
	localStorage.resultsProductColorCodeSelected = $(this).find(".colorCode").attr("data-value");
	localStorage.resultsProductStyleCodeSelected = $(this).find(".styleName").attr("data-value");
	window.location = "product-detail.html"; 
    });


});

function setSizeImages(){
    var sizeMainImg = $('.mainImg').height();
    var margin = 20;

    $('.list-clones').height(sizeMainImg-margin).width(sizeMainImg-margin);
    $('.view').height((sizeMainImg-margin*2)/2).width((sizeMainImg-margin*2)/2);

    $('.main-img').height($('.mainImg').height()-margin);
}

function handleError(image){
    if (localStorage.current_lang == "es") {
        image.src = '../img/imNoFound-es.jpg';
    }else{
        image.src = '../img/imNoFound.jpg';
    }
}

$(window).on("load", function() {
    setSizeImages();
    resizeElement();
});

function resizeElement(){
    $('.img-product').height($('.product').width()).width($('.product').width());
    // $('.img-product').width( $('.img-product').height());
}

function setCaptions(){
    $(".lblStyle").text(localStorage.caption_lblStyle);
    $(".lblPrice").text(localStorage.caption_lblPrice);
    $(".lblSize").text(localStorage.caption_lblSize);
    $(".lblOnHand").text(localStorage.caption_lblOnHand);

    $(".lblRelatedProduct").text(localStorage.caption_lblRelatedProduct);
    $(".txtNoRelated").text(localStorage.caption_txtNoRelated);

    $(".btn-back").text(localStorage.caption_btnBack);
    $(".btn-add-continue").text(localStorage.caption_btnAddContinue);
    $(".btn-add-finish").text(localStorage.caption_btnAddFinish);
    $(".btn-CheckStores").text(localStorage.caption_btnCheckStores);
    if(localStorage.flag3orless == 0){
        $(".appName3orless").text(localStorage.caption_option2);
    }else{
        $(".appName3orless").text(localStorage.caption_option3);
    }
}