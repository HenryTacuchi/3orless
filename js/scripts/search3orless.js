var swiper;
var removeAllFilter = false;

$(document).ready(function(){
    showLogo(false);
    if (localStorage.totalPrice == undefined || localStorage.totalPrice == NaN) {
        localStorage.totalPrice = 0;
        localStorage.totalOriginalPrice = 0;
    }

    if (localStorage.isComingBack == undefined) {localStorage.isComingBack = 0;}
    
    setCaptions();
    localStorage.removeItem("resultsProductSKUSelected");
    
    showPageElement(".loader",true);
    
    if (localStorage.printerName == undefined || localStorage.printerName ==''){
        $('.btn-printer').css('background-image',"url('../img/catalog/icon-printer-off.svg')");
    }    
    else{
        $('.btn-printer').css('background-image',"url('../img/catalog/icon-printer.svg')");
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

    $(".txtSKU").val("");

    //if there are products filtered in local storage
    if(localStorage.threeOrLessListBrandFilter != undefined
        || localStorage.threeOrLessListSizeFilter != undefined
        || localStorage.threeOrLessListGenderFilter != undefined
        || localStorage.threeOrLessListClassFilter != undefined) {
        showFilters();
    }else{
        getFiltersFromServer();
    }

    setFilterSelected();    

    checkFiltersMarked();
    checkOrderResultOption();

    //set image logo
    $(".img-logo").attr("src", localStorage.logo);

    //cart button redirects to cart items screen
    $(".btn-star").click(function(){
        if(localStorage.countProductCartItem==null ||  localStorage.countProductCartItem==0){
            swal({
                title: localStorage.caption_modalProductDetailTitle,
                text: localStorage.caption_modalProductDetailText,
                type: "info",
                confirmButtonColor: "#8fbf75",
                confirmButtonText: localStorage.caption_txtConfirmButton,                 
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

    //save index of product selected and redirect to product detail screen
    $(document).on("click",".product",function(){
        var indexProductSelected = $(this).data("value")-1;
        var productListObject = JSON.parse(localStorage.threeOrLessProductList);
        var product = productListObject.ProductList[indexProductSelected];
        localStorage.resultsProductStyleCodeSelected = product.styleCode;
        localStorage.resultsProductColorCodeSelected = product.colorCode; 
        localStorage.swiperActiveIndex = swiper.activeIndex;       
        window.location = "product-detail.html"; 
    });

    //clear search product panel 
    $(".btnClearSearch").click(function(){  
        localStorage.removeItem("threeOrLessListBrandFilterChecked");
        localStorage.removeItem("threeOrLessListClassFilterChecked");
        localStorage.removeItem("threeOrLessListGenderFilterChecked");
        localStorage.removeItem("threeOrLessListSizeFilterChecked");
        localStorage.removeItem("threeOrLessProductList");
        localStorage.removeItem("threeOrLessCountProductFiltered");
        localStorage.removeItem("indexProductSelected");
        localStorage.removeItem("resultsProductColorCodeSelected");
        localStorage.removeItem("resultsProductStyleCodeSelected");
        localStorage.threeOrLessOrderResults = "";
        $(".filters-marked .filter").each(function(){
            var itemValue = $(this).attr('data-value');
            $(this).click();
            removeFilter($(this));
        })
        checkFiltersMarked();
        resizeElement($('.swiper-wrapper'));
        showPageElement(".results",false);
        showSortArea(false);
        showPageElement(".filters-marked",false);
        showPageElement(".float-right",false);
        showPageElement(".notfound",false);
        showLogo(true);
        if($('.itemName').hasClass('expand'))
            $('.itemName').removeClass('expand');
        $(".swiper-wrapper").html("");
    });

    $(".txtSKU").on('input',function(){
        var txtSKU = $(".txtSKU").val();
        if (txtSKU.length == 7){
            localStorage.resultsProductSKUSelected = txtSKU;
            window.location = "product-detail.html";    
        }
    });

    $(".btn-recovery").click(function(){
        if(localStorage.countProductLastCartItem==null ||  localStorage.countProductLastCartItem==0){
            swal({
                title: localStorage.caption_modalProductRecoverBagTitle,
                type: "info",
                confirmButtonColor: "#8fbf75",
                confirmButtonText: localStorage.caption_txtConfirmButton,                 
                closeOnConfirm: true
            });
        }else{        
            for (var i = 1; i <= localStorage.countProductLastCartItem ; i++) {
                localStorage["cartItemProduct"+i] = localStorage["lastCartItemProduct"+i];
            }
            if(localStorage.countProductCartItem > localStorage.countProductLastCartItem){
                for (var i = localStorage.countProductLastCartItem*1 + 1; i <= localStorage.countProductCartItem ; i++) {               
                    localStorage.removeItem("lastCartItemProduct"+i);
                }
            }
            
            if (localStorage.countProductLastCartItem == undefined) {
                localStorage.countProductCartItem = 0;
            } else {
                localStorage.countProductCartItem = localStorage.countProductLastCartItem;  
            }
            window.location = "cart-items.html";
        }
    })

    //order search product results from low to high price
    $(".lowToHigh").click(function () {
        showPageElement(".loader-results",true);
        localStorage.threeOrLessOrderResults = "asc";
        showProductFilter("asc");
        showPageElement(".loader-results",false);
        resizeElement($('.swiper-wrapper'));    
    })

    //order search product results from high to low price
    $(".highToLow").click(function () {
        showPageElement(".loader-results",true);
        localStorage.threeOrLessOrderResults = "desc";
        showProductFilter("desc");
        showPageElement(".loader-results",false);
        resizeElement($('.swiper-wrapper'));    
    })

    //remove all filters
    $(".clear-filters").click(function () {
        removeAllFilter = true;

        $(".filters-marked .filter").each(function(){
            var itemValue = $(this).attr('data-value');
            $(this).click();
            removeFilter($(this));
        })
        localStorage.threeOrLessCountProductFiltered = 0;
        localStorage.threeOrLessProductList = '{"ProductList":[]}';
        clearSelectedFilters();
        saveSelectedFilters();        
        getFeaturedProductFilterFromServer();
        removeAllFilter = false;
    })

    $('.menu-item').click(function(){        
        // add or remove selected class when you click a filter from any category

        if($(this).hasClass('selected')){
            removeFilter($(this));
            $(this).removeClass('selected');
        }else{
            addFilter($(this));
            $(this).addClass('selected');           
        }

        checkFiltersMarked();
        
        if($(".results").hasClass("hide"))
            $(".results").removeClass("hide").addClass("show");
        else
            $(".results").addClass("show");  
        localStorage.threeOrLessCountProductFiltered = 0;
        localStorage.threeOrLessProductList = '{"ProductList":[]}';
        clearSelectedFilters();
        saveSelectedFilters();   
        if(removeAllFilter != true){
            getProductFilterFromServer();
        }     

    });
    
    
    $(".btn-scanner").click(function(){
        window.location = "scan3orless.html";
    });
        
});

//when page is loaded hide loaders
$(window).on("load", function() {

    showPageElement(".loader-results",true);
    initializeSwiper();
    //if there are products filtered in local storage
    if(localStorage.threeOrLessProductList != undefined) {
        showProductFilter(localStorage.threeOrLessOrderResults);
        resizeElement($('.swiper-wrapper'));      
        showPageElement(".loader",false);
        showPageElement(".loader-results",false);  
    }  

    if(localStorage.threeOrLessCountProductFiltered == undefined ||
        localStorage.threeOrLessCountProductFiltered == 0){
        getFeaturedProductFilterFromServer();
    }
    // resize Swiper
    resizeElement($('.swiper-wrapper'));
    if (localStorage.swiperActiveIndex != undefined || localStorage.swiperActiveIndex == 0) {
        swiper.slideTo(localStorage.swiperActiveIndex, 1000, false);
    } 
   if(localStorage.threeOrLessCountProductFiltered == undefined)
        $(".filters-marked").addClass("hide");
   if(localStorage.threeOrLessCountProductFiltered==0 || localStorage.threeOrLessCountProductFiltered == undefined)
        $(".results").addClass("hide");
});

function checkOrderResultOption(){
    if(localStorage.threeOrLessOrderResults != "")
        if(localStorage.threeOrLessOrderResults == "asc")
            $(".sort-dropdown").text("$ - $$");
        else
            $(".sort-dropdown").text("$$ - $");
}

//initialize swiper
function initializeSwiper(){
    swiper = new Swiper('.swiper-container', {        
        pagination:  '.swiper-pagination',
        paginationClickable: true,
        width: $('main').width(),
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 0,
        speed: 600,
        resistance : true,
        resistanceRatio: 0.45,
        lazyLoading: true,
        preloadImages: false
    });
}

//get products filtered from server, save in local storage and show in results area
function getFeaturedProductFilterFromServer(){
    $.ajax({
        type: "GET",
        url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/ShowFeaturedProductFilter/" + localStorage.storeNo + "/" + localStorage.flag3orless,
        // async: false,
        contentType: "application/json",
        crossdomain: true,
        timeout: 10000,
        beforeSend: function(){
            setColorApp();
            showPageElement(".loader-results",true);
        },
        complete: function(){
            showPageElement(".loader-results",false);
            setColorApp();
        },
        success:function(result){
            var data = result.showFeaturedProductFilterResult.fProdList;                
            var productList = '{"ProductList":[';
            if (data.length >0) {
                localStorage.threeOrLessCountProductFiltered = data.length;   

                $.each(data, function (index, value) {
                    var product = '{'+
                                        '"brandCode": "' + value.brandCode + '",' +     
                                        '"brandName": "' + value.brandName + '",' +
                                        '"colorCode": "' + value.colorCode + '",' +
                                        '"imageFile": "' + value.imageFile.replace(/\\/g,"\\\\") + '",' +
                                        '"price": "' + value.price + '",' +
                                        '"originalPrice": "' + (value.productPrice).toFixed(2) + '",' +
                                        '"styleCode": "' + value.styleCode + '",' +
                                        '"styleName": "' + value.styleName + '"' +
                                    '},';                               
                    productList = productList + product;  
                });                    
                productList = productList.substring(0, productList.length - 1);
                
            }      
            else{
                countProductFiltered = 0;
            }
            productList = productList + ']}';
            localStorage.threeOrLessProductList = productList;   
            if(localStorage.threeOrLessOrderResults == "")          
                showProductFilter("asc");
            else
                showProductFilter(localStorage.threeOrLessOrderResults);          
        },
        error:function(error) {
            alert("error");
        }
    });
}

//get products filtered from server, save in local storage and show in results area
function getProductFilterFromServer(){
    var bodyJSON = '{'+
                    localStorage.threeOrLessListBrandFilterChecked + ',' +
                    localStorage.threeOrLessListSizeFilterChecked + ',' +
                    localStorage.threeOrLessListGenderFilterChecked + ',' +
                    localStorage.threeOrLessListClassFilterChecked + '}';
    $.ajax({
        type: "POST",
        url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/ShowProductFilter/" + localStorage.storeNo + "/" + localStorage.flag3orless,
        // async: false,
        contentType: "application/json",
        data: bodyJSON,
        crossdomain: true,
        timeout: 10000,
        beforeSend: function(){
            setColorApp();
            showPageElement(".loader-results",true);
        },
        complete: function(){
            showPageElement(".loader-results",false);
            setColorApp();
        },
        success:function(result){
            var data = result.fProdList;                
            var productList = '{"ProductList":[';
            if (data.length >0) {
                localStorage.threeOrLessCountProductFiltered = data.length;   

                $.each(data, function (index, value) {
                    var product = '{'+
                                        '"brandCode": "' + value.brandCode + '",' +     
                                        '"brandName": "' + value.brandName + '",' +
                                        '"colorCode": "' + value.colorCode + '",' +
                                        '"imageFile": "' + value.imageFile.replace(/\\/g,"\\\\") + '",' +
                                        '"price": "' + value.price + '",' +
                                        '"originalPrice": "' + (value.productPrice).toFixed(2) + '",' +
                                        '"styleCode": "' + value.styleCode + '",' +
                                        '"styleName": "' + value.styleName + '"' +
                                    '},';                               
                    productList = productList + product;  
                });                    
                productList = productList.substring(0, productList.length - 1);
                
            }      
            else{
                countProductFiltered = 0;
            }
            productList = productList + ']}';
            localStorage.threeOrLessProductList = productList;   
            if(localStorage.threeOrLessOrderResults == "")          
                showProductFilter("asc");
            else
                showProductFilter(localStorage.threeOrLessOrderResults);        
        },
        error:function(error) {
            alert("error");
        }
    });
}

//load product results saved in local storage and show in results area
function showProductFilter(option){
    swiper.removeAllSlides();
    if ($(".swiper-slide").childElementCount>0){
        swiper.destroy(true, true);
    }
    //hide content of swipe-wrapper for precautions with the dimensions
    $('.swiper-wrapper').hide();
    var productListObject = JSON.parse(localStorage.threeOrLessProductList);
                  
    if (localStorage.threeOrLessCountProductFiltered >0) {
        showPageElement(".results",true);
        setTimeout(function(){ showSortArea(true); }, 1000);  
        showPageElement(".float-right",true);
        showLogo(false);
        var countProductItem = 0;
        var countSwipe = 0;
        var countRowProduct = 0;
        var sizeData = localStorage.threeOrLessCountProductFiltered;   
        var indexIni, indexEnd, increment,condition;

        //order from high to low price
        if(option=="desc"){
            indexIni = sizeData - 1;
            increment = -1;
            indexEnd = 0;
        }
        //order from low to high price
        else{
            indexIni = 0;
            increment = 1;  
            indexEnd = sizeData - 1;  
        }

        for (var i = indexIni; ; i = i + increment) {
            //add slide
            if(countProductItem % 8 == 0){                            
                var template = _.template($("#swipeTemplate").html());
                var html = template({
                    Class: "swiper-slide" + (countSwipe+1)
                });
                swiper.appendSlide(html);
                countSwipe++;
            }

            //add row products to slide
            if(countProductItem % 4 == 0){                            
                var template = _.template($("#rowProductTemplate").html());
                var html = template({
                    Class: "row-product" + (countRowProduct+1)
                });
                $(".swiper-slide" + countSwipe).append(html);
                countRowProduct++;
            }

            //add product to row product
            template = _.template($("#productItemTemplate").html());                       
            html = template({
                // Class: "animated fadeIn product-" + (i+1),
                Class: "animated fadeIn",
                productId: i+1,
                path: productListObject.ProductList[i].imageFile,
                styleCode: productListObject.ProductList[i].styleCode,
                styleName: productListObject.ProductList[i].styleName,
                brandCode: productListObject.ProductList[i].brandCode,
                brandName: productListObject.ProductList[i].brandName,
                price: productListObject.ProductList[i].price,
                originalPrice: productListObject.ProductList[i].originalPrice
            });
            $(".row-product"+countRowProduct).append(html);
            countProductItem++;
            //if all product has added to results area
            if(i == indexEnd){
                $('.swiper-wrapper').show();
                break;
            }
        }                                  
    }      
    else{
        showSortArea(false);
        showPageElement(".results",false);
        showPageElement(".float-right",false);
        showLogo(true);
        showPageElement(".notfound",true);
    }
    
    $(".txtStyleName").text(localStorage.caption_txtStyleName);
}


//Clear all selected filters from local storage
function clearSelectedFilters(){
    localStorage.removeItem("threeOrLessListBrandFilterChecked");
    localStorage.removeItem("threeOrLessListSizeFilterChecked");
    localStorage.removeItem("threeOrLessListGenderFilterChecked");
    localStorage.removeItem("threeOrLessListClassFilterChecked");
}

//Save all selected filter to local storage
function saveSelectedFilters(){
    var listBrandFilterChecked = '"Brand":[' ;
    var listSizeFilterChecked = '"Size":[' 
    var listGenderFilterChecked = '"Gender":[' 
    var listClassFilterChecked = '"Class":[' 

    var countBrand = 0;
    $('.item-list-brand .menu-item.selected').each(function() {
        listBrandFilterChecked = listBrandFilterChecked + '{"codfFilter":"' + $(this).attr('data-value') + '"},';
        countBrand++;
    });
    if(countBrand>0) listBrandFilterChecked = listBrandFilterChecked.substring(0, listBrandFilterChecked.length - 1);
    listBrandFilterChecked = listBrandFilterChecked + ']';

    var countSize = 0;
    $('.item-list-size .menu-item.selected').each(function() {
        listSizeFilterChecked = listSizeFilterChecked + '{"codfFilter":"' + $(this).attr('data-value') + '"},';
        countSize++;
    });
    if(countSize>0) listSizeFilterChecked = listSizeFilterChecked.substring(0, listSizeFilterChecked.length - 1);
    listSizeFilterChecked = listSizeFilterChecked + ']';

    var countGender = 0;
    $('.item-list-gender .menu-item.selected').each(function() {
        listGenderFilterChecked = listGenderFilterChecked + '{"codfFilter":"' + $(this).attr('data-value') + '"},';
        countGender++;
    });
    if(countGender>0) listGenderFilterChecked = listGenderFilterChecked.substring(0, listGenderFilterChecked.length - 1);
    listGenderFilterChecked = listGenderFilterChecked + ']';

    var countClass = 0;
    $('.item-list-class .menu-item.selected').each(function() {
        listClassFilterChecked = listClassFilterChecked + '{"codfFilter":"' + $(this).attr('data-value') + '"},';
        countClass++;
    });
    if(countClass>0) listClassFilterChecked = listClassFilterChecked.substring(0, listClassFilterChecked.length - 1);
    listClassFilterChecked = listClassFilterChecked + ']';

    localStorage.threeOrLessListBrandFilterChecked = listBrandFilterChecked;
    localStorage.threeOrLessListSizeFilterChecked = listSizeFilterChecked;
    localStorage.threeOrLessListGenderFilterChecked = listGenderFilterChecked;
    localStorage.threeOrLessListClassFilterChecked = listClassFilterChecked; 
}

//bring all available filters from server and show in filter sidebar
function getFiltersFromServer(){
    showPageElement(".loader",true);
    $.ajax({
        type: "GET",
        url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/GetFilter/" + localStorage.storeNo + "/" + localStorage.flag3orless,            
        async: false,
        contentType: "application/json",
        crossdomain: true,
        timeout: 10000,
        success: function (result) {
            //brand filters
            var data = result.Brand;
            var brandList = '{"BrandList":[';
            if (data != null && data.length > 0) {

                $.each(data, function (index, value) {
                    var brandFilter = '{'+
                                            '"codfFilter": "' + value.codfFilter + '",' +     
                                            '"nameFilter": "' + value.nameFilter + '"' +
                                        '},';                               
                    brandList = brandList + brandFilter;  
                });                    
                brandList = brandList.substring(0, brandList.length - 1);
                
            }   

            //size filters
            var data = result.Size;                
            var sizeList = '{"SizeList":[';
            if (data != null && data.length > 0) {

                $.each(data, function (index, value) {
                    var sizeFilter = '{'+
                                            '"codfFilter": "' + value.codfFilter + '",' +     
                                            '"nameFilter": "' + value.nameFilter + '"' +
                                        '},';                               
                    sizeList = sizeList + sizeFilter;  
                });                    
                sizeList = sizeList.substring(0, sizeList.length - 1);
                
            }   

            //gender filters
            var data = result.Gender;                
            var genderList = '{"GenderList":[';
            if (data != null && data.length > 0) {

                $.each(data, function (index, value) {
                    var genderFilter = '{'+
                                            '"codfFilter": "' + value.codfFilter + '",' +     
                                            '"nameFilter": "' + value.nameFilter + '"' +
                                        '},';                               
                    genderList = genderList + genderFilter;  
                });                    
                genderList = genderList.substring(0, genderList.length - 1);
                
            }  

            //class filters
            var data = result.Class;                
            var classList = '{"ClassList":[';
            if (data != null && data.length > 0) {

                $.each(data, function (index, value) {
                    var classFilter = '{'+
                                            '"codfFilter": "' + value.codfFilter + '",' +     
                                            '"nameFilter": "' + value.nameFilter + '"' +
                                        '},';                               
                    classList = classList + classFilter;  
                });                    
                classList = classList.substring(0, classList.length - 1);
                
            }  

            brandList = brandList + ']}';
            sizeList = sizeList + ']}';
            genderList = genderList + ']}';
            classList = classList + ']}';
            localStorage.threeOrLessListBrandFilter = brandList;   
            localStorage.threeOrLessListSizeFilter = sizeList;  
            localStorage.threeOrLessListGenderFilter = genderList;  
            localStorage.threeOrLessListClassFilter = classList;  
            showFilters();
        },
        error: function (error) {
            // alert(error);
        }
    });
}

//bring all available filters from server and show in filter sidebar
function showFilters(){
    var listBrandFilterObject = JSON.parse(localStorage.threeOrLessListBrandFilter);
    var listSizeFilterObject = JSON.parse(localStorage.threeOrLessListSizeFilter);
    var listGenderFilterObject = JSON.parse(localStorage.threeOrLessListGenderFilter);
    var listClassFilterObject = JSON.parse(localStorage.threeOrLessListClassFilter);
    showPageElement(".loader",true);
    //brand filters  
    var countBrand = Object.keys(listBrandFilterObject.BrandList).length  
    for (var i = 0; i < countBrand; i++) {
        var template = _.template($("#listItemTemplate").html());
        var html = template({
            ItemValue: listBrandFilterObject.BrandList[i].codfFilter,
            ItemText: listBrandFilterObject.BrandList[i].nameFilter
        });
        $(".item-list-brand").append(html);
    }     

    // //size filters
    var countSize = Object.keys(listSizeFilterObject.SizeList).length;  
    for (var i = 0; i < countSize; i++) {
        var template = _.template($("#listItemTemplate").html());
        var html = template({
            ItemValue: listSizeFilterObject.SizeList[i].codfFilter,
            ItemText: listSizeFilterObject.SizeList[i].nameFilter
        });
        $(".item-list-size").append(html);
    } 

    // //gender filters
    var countGender = Object.keys(listGenderFilterObject.GenderList).length;
    for (var i = 0; i < countGender; i++) {
        var template = _.template($("#listItemTemplate").html());
        var html = template({
            ItemValue: listGenderFilterObject.GenderList[i].codfFilter,
            ItemText: listGenderFilterObject.GenderList[i].nameFilter
        });
        $(".item-list-gender").append(html);
    } 

    // //class filters
    var countClass = Object.keys(listClassFilterObject.ClassList).length;  
    for (var i = 0; i < countClass; i++) {
        var template = _.template($("#listItemTemplate").html());
        var html = template({
            ItemValue: listClassFilterObject.ClassList[i].codfFilter,
            ItemText: listClassFilterObject.ClassList[i].nameFilter
        });
        $(".item-list-class").append(html);
    } 
    showPageElement(".loader",false);
}

//show or hide area to sort product results
function showSortArea(option){
    if(option){  
        if($(".sort-area").hasClass("opaque"))
            $(".sort-area").removeClass("opaque");
    }else{
        if($(".sort-area").hasClass("opaque"))
            $(".sort-area").addClass("opaque");
    }
}

//show or hide image logo
function showLogo(option){
    if(option){  
        $(".area-logo").show();
    }else{
        $(".area-logo").hide();
    }
}

//show or hide html element
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

//load selected filters to show in sidebar
function setFilterSelected(){
    if(localStorage.threeOrLessListBrandFilterChecked != undefined ||
        localStorage.threeOrLessListSizeFilterChecked != undefined ||
        localStorage.threeOrLessListGenderFilterChecked != undefined ||
        localStorage.threeOrLessListClassFilterChecked != undefined){
        showLogo(false);
        
        //check brand selected filters
        var brandFilteredObject = JSON.parse("{" + localStorage.threeOrLessListBrandFilterChecked + "}").Brand;            
        $(".item-list-brand .menu-item").each(function(){
            var itemValue = $(this).attr('data-value');
            for (var i = 0; i < brandFilteredObject.length; i++) {
                var cod = brandFilteredObject[i].codfFilter
                if(itemValue == brandFilteredObject[i].codfFilter){
                    $(this).addClass('selected');
                    addFilter($(this));
                }
            }
        })

        //check size selected filters
        var sizeFilteredObject = JSON.parse("{" + localStorage.threeOrLessListSizeFilterChecked + "}").Size;
        $(".item-list-size .menu-item").each(function(){
            var itemValue = $(this).attr('data-value');
            for (var i = 0; i < sizeFilteredObject.length; i++) {
                var cod = sizeFilteredObject[i].codfFilter
                if(itemValue == sizeFilteredObject[i].codfFilter){
                    $(this).addClass('selected');
                    addFilter($(this));
                }                        
            }
        })

        //check gender selected filters
        var genderFilteredObject = JSON.parse("{" + localStorage.threeOrLessListGenderFilterChecked + "}").Gender;
        $(".item-list-gender .menu-item").each(function(){
            var itemValue = $(this).attr('data-value');
            for (var i = 0; i < genderFilteredObject.length; i++) {
                var cod = genderFilteredObject[i].codfFilter
                if(itemValue == genderFilteredObject[i].codfFilter){
                    $(this).addClass('selected');
                    addFilter($(this));
                }
            }
        })

        //check class selected filters
        var classFilteredObject = JSON.parse("{" + localStorage.threeOrLessListClassFilterChecked + "}").Class;
        $(".item-list-class .menu-item").each(function(){
            var itemValue = $(this).attr('data-value');
            for (var i = 0; i < classFilteredObject.length; i++) {
                var cod = classFilteredObject[i].codfFilter
                if(itemValue == classFilteredObject[i].codfFilter){
                    $(this).addClass('selected');
                    addFilter($(this));
                }
            }
        })
    }
} 

//check if exists filters marked 
function checkFiltersMarked(){
    if($('.filters-marked').children().length>1){
        showPageElement(".filters-marked",true);
        setTimeout(function(){ showSortArea(true); }, 500);        
        $('.area-logo').hide();
        $('.clear-filters').removeClass('hide').addClass('show animated fadeInRightBig');
    }else{
        showPageElement(".filters-marked",false);
        $('.clear-filters').removeClass('show').addClass('hide');
        if(localStorage.kioskCountProductFiltered==0){
            $('.area-logo').show();
            showPageElement(".results",false);
        }
    }
}

//if exists path image error, show no image
function handleError(image){
    if (localStorage.current_lang == "es") {
        image.src = '../img/imNoFound-es.jpg';
    }else{
        image.src = '../img/imNoFound.jpg';
    }
}

function resizeElement(element){
    element.width($('.swiper-slide').width());
    // stretch product by Class
    var resizeProduct;
    if($('.filters-marked').children().length>1){
        resizeProduct = $('main').height() - $('.sort-area').height() - $('.filters-marked').height();
        $('.product').removeClass('stretch');
    }else{
        resizeProduct = $('main').height() - $('.sort-area').height();
        $('.product').addClass('stretch');
    }
    
    $('.swiper-slide').height( resizeProduct );
    $('.img-product').height( $('.img-product').width());
}

function setCaptions(){
    $(".txtGenderFilter").text(localStorage.caption_txtGenderFilter);
    $(".txtBrandFilter").text(localStorage.caption_txtBrandFilter);
    $(".txtTypeFilter").text(localStorage.caption_txtTypeFilter);
    $(".txtSizeFilter").text(localStorage.caption_txtSizeFilter);

    $(".notfound").text(localStorage.caption_notfound);
    $(".lblClearFilters").text(localStorage.caption_lblClearFilters);
    
    $(".txtSortby").text(localStorage.caption_txtSortby);

    if(localStorage.threeOrLessOrderResults == "") $(".sort-dropdown").text(localStorage.caption_lblSelect);

    $(".appName3orless").text(localStorage.caption_option3);
    $(".txtSKU").attr('placeholder',localStorage.caption_lblScanProduct);
}