$(document).ready(function(){
    var swiper;
    $(".item-count").text(localStorage.countProductCartItem);
    getFiltersFromServer();
    setFilterSelected();
    checkFiltersMarked();
    checkOrderResultOption();

    //if there are products filtered in local storage
    if(localStorage.productList != undefined) {
        showProductFilter(localStorage.orderResults);
        $('.swiper-wrapper').width($('.swiper-slide').width());
    }

    //set image logo
    $(".img-logo").attr("src", localStorage.logo);

    //cart button redirects to cart items screen
    $(".btn-cart").click(function(){
        window.location = "cart-items.html";
    });

    //home button redirects to home screen
    $(".btn-home").click(function(){
        window.location = "index.html";
    });

    //save index of product selected and redirect to product detail screen
    // $(".product").click(function(){
    //     var className = this.className;
    //     localStorage.indexProductSelected = className.substring(className.lastIndexOf("-")+1) - 1; 
    //     window.location = "product-detail.html";      
    // });

    //save index of product selected and redirect to product detail screen
    $(document).on("click",".product",function(){
        var className = this.className;
        var indexProductSelected = className.substring(className.lastIndexOf("-")+1) - 1; 
        var productListObject = JSON.parse(localStorage.productList);
        var product = productListObject.ProductList[indexProductSelected];
        localStorage.resultsProductStyleCodeSelected = product.styleCode;
        localStorage.resultsProductColorCodeSelected = product.colorCode;
        window.location = "product-detail.html"; 
    });

    //apply filters and search products 
    $(".btnFilter").click(function(){  
        localStorage.countProductFiltered = 0;
        localStorage.productList = '{"ProductList":[]}';
        clearSelectedFilters();
        saveSelectedFilters();        
        getProductFilterFromServer();
    });

    //order search product results from low to high price
    $(".lowToHigh").click(function () {
        showLoadingResults(true);
        localStorage.orderResults = "asc";
        showProductFilter("asc");
        showLoadingResults(false);
    })

    //order search product results from high to low price
    $(".highToLow").click(function () {
        showLoadingResults(true);
        localStorage.orderResults = "desc";
        showProductFilter("desc");
        showLoadingResults(false);
    })

    //remove all filters
    $(".clear-filters").click(function () {
        $(".filters-marked .filter").each(function(){
            var itemValue = $(this).attr('data-value');
            $(this).click();
            removeFilter($(this));
        })
    })
    
    //when page is loaded hide loaders
    $(window).on("load", function() {
       showLoading(false);
       showLoadingResults(false);
    });

    //observer for loader
    // var target = document.querySelector('.swiper-wrapper');

    // // create an observer instance
    // var observer = new MutationObserver(function(mutations) {
    //   mutations.forEach(function(mutation) {
    //     showLoading(false);
    //   });    
    // });

    // // configuration of the observer:
    // var config = { attributes: true, childList: true, characterData: true }

    // // pass in the target node, as well as the observer options
    // observer.observe(target, config);
});

function checkOrderResultOption(){
    if(localStorage.orderResults != "")
        if(localStorage.orderResults == "asc")
            $('.sort-dropdown').removeClass('highToLow').addClass($(this).attr('class')).text("Low to high");
        else
            $('.sort-dropdown').removeClass('lowToHigh').addClass($(this).attr('class')).text("High to low");
}

//initialize swiper
function initializeSwiper(){
    swiper = new Swiper('.swiper-container', {        
        pagination:  '.swiper-pagination',
        paginationClickable: true,
        paginationBulletRender: function (swiper, index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
        },
        width: $('main').width(),
        spaceBetween: 0,
    });
}

//get products filtered from server, save in local storage and show in results area
function getProductFilterFromServer(){
    var bodyJSON = '{'+
                    localStorage.listBrandFilter + ',' +
                    localStorage.listSizeFilter + ',' +
                    localStorage.listGenderFilter + ',' +
                    localStorage.listClassFilter + '}';
    $.ajax({
        type: "POST",
        url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/ShowProductFilter",
        // async: false,
        contentType: "application/json",
        data: bodyJSON,
        crossdomain: true,
        beforeSend: function(){
            showLoadingResults(true);
        },
        complete: function(){
            showLoadingResults(false);
        },
        success:function(result){
            var data = result.fProdList;                
            var productList = '{"ProductList":[';
            if (data.length >0) {
                localStorage.countProductFiltered = data.length;   

                $.each(data, function (index, value) {
                    var product = '{'+
                                    '"brandCode": "' + value.brandCode + '",' +     
                                    '"brandName": "' + value.brandName + '",' +
                                    '"colorCode": "' + value.colorCode + '",' +
                                    '"imageFile": "' + value.imageFile.replace(/\\/g,"\\\\") + '",' +
                                    '"price": "' + value.price + '",' +
                                    '"originalPrice": "' + value.productPrice + '",' +
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
            localStorage.productList = productList;   
            if(localStorage.orderResults == "")          
                showProductFilter("asc");
            else
                showProductFilter(localStorage.orderResults);
        },
        error:function(error) {
            alert("error");
        }
    });
}

//load product results saved in local storage and show in results area
function showProductFilter(option){
    $(".swiper-slide").remove();
    var productListObject = JSON.parse(localStorage.productList);
                  
    if (localStorage.countProductFiltered >0) {
        initializeSwiper();
        showSortArea(true);
        showOrderOption(true);
        showLogo(false);
        var countProductItem = 0;
        var countSwipe = 0;
        var countRowProduct = 0;
        var sizeData = localStorage.countProductFiltered;   
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
                Class: "product-" + (i+1),
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
                break;
            }
        }                                  
    }      
    else{
        showSortArea(false);
        showOrderOption(false);
        showLogo(true);
        showNoResults(true);
    }
}


//Clear all selected filters from local storage
function clearSelectedFilters(){
    localStorage.removeItem("listBrandFilter");
    localStorage.removeItem("listSizeFilter");
    localStorage.removeItem("listGenderFilter");
    localStorage.removeItem("listClassFilter");
}

//Save all selected filter to local storage
function saveSelectedFilters(){
    var listBrandFilter = '"Brand":[' ;
    var listSizeFilter = '"Size":[' 
    var listGenderFilter = '"Gender":[' 
    var listClassFilter = '"Class":[' 

    var countBrand = 0;
    $('.item-list-brand .menu-item.selected').each(function() {
        listBrandFilter = listBrandFilter + '{"codfFilter":"' + $(this).attr('data-value') + '"},';
        countBrand++;
    });
    if(countBrand>0) listBrandFilter = listBrandFilter.substring(0, listBrandFilter.length - 1);
    listBrandFilter = listBrandFilter + ']';

    var countSize = 0;
    $('.item-list-size .menu-item.selected').each(function() {
        listSizeFilter = listSizeFilter + '{"codfFilter":"' + $(this).attr('data-value') + '"},';
        countSize++;
    });
    if(countSize>0) listSizeFilter = listSizeFilter.substring(0, listSizeFilter.length - 1);
    listSizeFilter = listSizeFilter + ']';

    var countGender = 0;
    $('.item-list-gender .menu-item.selected').each(function() {
        listGenderFilter = listGenderFilter + '{"codfFilter":"' + $(this).attr('data-value') + '"},';
        countGender++;
    });
    if(countGender>0) listGenderFilter = listGenderFilter.substring(0, listGenderFilter.length - 1);
    listGenderFilter = listGenderFilter + ']';

    var countClass = 0;
    $('.item-list-class .menu-item.selected').each(function() {
        listClassFilter = listClassFilter + '{"codfFilter":"' + $(this).attr('data-value') + '"},';
        countClass++;
    });
    if(countClass>0) listClassFilter = listClassFilter.substring(0, listClassFilter.length - 1);
    listClassFilter = listClassFilter + ']';

    localStorage.listBrandFilter = listBrandFilter;
    localStorage.listSizeFilter = listSizeFilter;
    localStorage.listGenderFilter = listGenderFilter;
    localStorage.listClassFilter = listClassFilter; 
}

//bring all available filters from server and show in filter sidebar
function getFiltersFromServer(){
    showLoading(true);
    $.ajax({
        type: "GET",
        url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/GetFilter",            
        async: false,
        contentType: "application/json",
        crossdomain: true,
        success: function (result) {
            //brand filters
            var data = result.Brand;                
            if (data != null) {
                
                $.each(data, function (index, value) {
                    var template = _.template($("#listItemTemplate").html());
                    var html = template({
                        ItemValue: value.codfFilter,
                        ItemText: value.nameFilter
                    });
                    $(".item-list-brand").append(html);
                });               
            }

            //size filters
            var data = result.Size;                
            if (data != null) {
                
                $.each(data, function (index, value) {
                    var template = _.template($("#listItemTemplate").html());
                    var html = template({
                        ItemValue: value.codfFilter,
                        ItemText: value.nameFilter
                    });
                    $(".item-list-size").append(html);
                });               
            }

            //gender filters
            var data = result.Gender;                
            if (data != null) {
                
                $.each(data, function (index, value) {
                    var template = _.template($("#listItemTemplate").html());
                    var html = template({
                        ItemValue: value.codfFilter,
                        ItemText: value.nameFilter
                    });
                    $(".item-list-gender").append(html);
                });               
            }

            //class filters
            var data = result.Class;                
            if (data != null) {
                
                $.each(data, function (index, value) {
                    var template = _.template($("#listItemTemplate").html());
                    var html = template({
                        ItemValue: value.codfFilter,
                        ItemText: value.nameFilter
                    });
                    $(".item-list-class").append(html);
                });               
            }
        },
        error: function (error) {
            alert(error);
        }
    });
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

//show or hide loader for product results
function showLoadingResults(option){
    if(option){  
        if($(".loader-results").hasClass("hide"))
            $(".loader-results").removeClass("hide").addClass("show");
        else
            $(".loader-results").addClass("show");
    }else{
        if($(".loader-results").hasClass("show"))
            $(".loader-results").removeClass("show").addClass("hide").delay(5000);
        else
            $(".loader-results").addClass("hide").delay(5000);
    }
}

//show or hide area to sort product results
function showSortArea(option){
    if(option){  
        if($(".sort-area").hasClass("hide"))
            $(".sort-area").removeClass("hide").addClass("show");
        else
            $(".sort-area").addClass("show");
    }else{
        if($(".sort-area").hasClass("show"))
            $(".sort-area").removeClass("show").addClass("hide");
        else
            $(".sort-area").addClass("hide");
    }
}

//show or hide option to sort product results
function showOrderOption(option){
    if(option){  
        if($(".float-right").hasClass("hide"))
            $(".float-right").removeClass("hide").addClass("show");
        else
            $(".float-right").addClass("show");
    }else{
        if($(".float-right").hasClass("show"))
            $(".float-right").removeClass("show").addClass("hide");
        else
            $(".float-right").addClass("hide");
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

//show or hide No Results text
function showNoResults(option){
    if(option){  
        if($(".notfound").hasClass("hide"))
            $(".notfound").removeClass("hide").addClass("show");
        else
            $(".notfound").addClass("show");
    }else{
        if($(".notfound").hasClass("show"))
            $(".notfound").removeClass("show").addClass("hide").delay(5000);
        else
            $(".notfound").addClass("hide").delay(5000);
    }
}

//load selected filters to show in sidebar
function setFilterSelected(){
    if(localStorage.listBrandFilter != undefined &&
        localStorage.listSizeFilter != undefined &&
        localStorage.listGenderFilter != undefined &&
        localStorage.listClassFilter != undefined){
        showLogo(false);
        
        //check brand selected filters
        var brandFilteredObject = JSON.parse("{" + localStorage.listBrandFilter + "}").Brand;            
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
        var sizeFilteredObject = JSON.parse("{" + localStorage.listSizeFilter + "}").Size;
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
        var genderFilteredObject = JSON.parse("{" + localStorage.listGenderFilter + "}").Gender;
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
        var classFilteredObject = JSON.parse("{" + localStorage.listClassFilter + "}").Class;
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
    if($('.filters-marked').children().length>0){
        showSortArea(true);
        $('.area-logo').hide();
        $('.clear-filters').removeClass('hide').addClass('show animated fadeInRightBig');
    }else{
        showSortArea(false);
        $('.clear-filters').removeClass('show').addClass('hide');
        if(localStorage.countProductFiltered==0)
            $('.area-logo').show();
    }
}

//if exists path image error, show no image
function handleError(image){
    image.src = '../img/imNoFound.jpg';
}
