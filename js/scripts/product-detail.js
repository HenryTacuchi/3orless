$(document).ready(function(){

	$(".item-count").text(localStorage.countProductCartItem);
    getProductSelect();

    //cart button redirects to cart items screen
    $(".btn-cart").click(function(){
        window.location = "cart-items.html";
    });

    //home button redirects to home screen
    $(".btn-home").click(function(){
        window.location = "index.html";
    });

    //home button redirects to home screen
    $(".btn-back").click(function(){
        window.history.back();
    });
    $(".btn-add-continue").click(function(){
        //if product has added successfully to cart item, redirects to search screen
        if(addProductCartItem())
            window.location = "search.html";
        else{
            //stay in product detail screen
        }      
    });

    $(".btn-add-finish").click(function(){
       addProductCartItem();
       window.location = "cart-items.html";
    });

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

	//when page is loaded hide loaders
    $(window).on("load", function() {
       showLoading(false);
    });


    function getProductSelect(){
    	showLoading(true);
        $.ajax({
            type: "GET",
            url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/findProductBySC-Color/" + localStorage.resultsProductStyleCodeSelected + "/" + localStorage.resultsProductColorCodeSelected ,            
            async: false,
            contentType: "application/json",
            crossdomain: true,
            success: function (result) {
                //Product Selected                
                var data = result.findNProductByStyleCodeAndColorResult; 
                console.log(data) ;         
                if (data != null) {
                	//PRODUCT SELECT
                	//items
                    $(".txtProductDetail").text(data.shortDescr);
                	$(".txtBrand").text(data.brandName);
                    $(".txtStyleCode").text(data.styleCode);
                	$(".txtStyle").text(data.styleName);
                    $(".txtColorCode").text(data.colorCode);
                	$(".txtRetailPrice").text("$" + data.price);
                    $(".txtOriginalPrice").text("$" + data.productPrice);
                	$(".txtOnHang").text(data.OnHandQty);
                	// 

                	//Images
                	$(".main-img").attr("src",data.listImages[0]);
                    $(".view-1").attr("src",data.listImages[0]);
                    $(".view-2").attr("src",data.listImages[1]);
                    $(".view-3").attr("src",data.listImages[2]);
                    $(".view-4").attr("src",data.listImages[3]);

                    //Size
                    $(".sort-dropdown").text(data.listSize[0]);
                    for (var i = 0; i < data.listSize.length; i++) {
                		var template = _.template($("#listItemTemplate").html());
	                    var html = template({
	                       ItemText:data.listSize[i],
	                       sizeCode:data.listSize[i]
                    });
                    $(".listSize").append(html);
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
                        productPrice: data.suggestedProduct[i].productPrice,

                    });
	                    countProductItem++;
                    $(".related-products").append(html);
                	}

                    $(".related-products").addClass("items-"+ countProductItem);

                }


            },
            error: function (error) {
                alert(error);
            }
        });
    }
    //show or hide image logo
    function showLogo(option){
        if(option){  
            $(".area-logo").show();
        }else{
            $(".area-logo").hide();
        }
    }

$(".view").click(function(){
		 $(".main-img").attr("src",this.src);
    });

$(".size-item").click(function(){
		 console.log($(this).attr("data-value"));
		  $(".sort-dropdown").text($(this).attr("data-value"));
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

function handleError(image){
    image.src = '../img/imNoFound.jpg';
}