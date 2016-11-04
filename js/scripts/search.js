$(document).ready(function(){
    // initialize swiper
    var swiper = new Swiper('.swiper-container', {        
        pagination:  '.swiper-pagination',
        paginationClickable: true,
        paginationBulletRender: function (swiper, index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
        },
        width: $('main').width(),
        spaceBetween: 0,
    });

    getFiltersFromServer();
    setFilterSelected();
    if(localStorage.productList != undefined) {
        showProductFilter("asc");
        $('.swiper-wrapper').width($('.swiper-slide').width());
    }

    $(".img-logo").attr("src", localStorage.logo);

    $(".btn-home").click(function(){
        window.location = "index.html";
    });

    $(".btnFilter").click(function(){
        localStorage.countProductFiltered = 0;
        localStorage.productList = '{"ProductList":[]}';
        clearSelectedFilters();
        saveSelectedFilters();        
        getProductFilterFromServer();
        // showProductFilter();
    });

    $( ".lowToHigh" ).click(function () {
        showProductFilter("asc");
        showLoadingResults(false);
    })
    $( ".highToLow" ).click(function () {
        showProductFilter("desc");
        showLoadingResults(false);
    })

    //get products filtered from server and storage in local storage
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
                showProductFilter("asc");
            },
            error:function(error) {
                alert("error");
            }
        });
    }

    function showProductFilter(option){
        showLoadingResults(true);
        $(".swiper-slide").remove();
        var productListObject = JSON.parse(localStorage.productList);
                      
        if (localStorage.countProductFiltered >0) {
            showSortArea(true);
            showLogo(false);
            var countProductItem = 0;
            var countSwipe = 0;
            var countRowProduct = 0;
            var sizeData = localStorage.countProductFiltered;   
            var indexIni, indexEnd, increment,condition;
            if(option=="asc"){
                indexIni = 0;
                increment = 1;  
                indexEnd = sizeData - 1;  
            }
            else{
                indexIni = sizeData - 1;
                increment = -1;
                indexEnd = 0;
            }
            for (var i = indexIni; ; i = i + increment) {
                if(countProductItem % 8 == 0){                            
                    var template = _.template($("#swipeTemplate").html());
                    var html = template({
                        Class: "swiper-slide" + (countSwipe+1)
                    });
                    // $(".swiper-wrapper").append(html);
                    swiper.appendSlide(html);
                    countSwipe++;
                }

                if(countProductItem % 4 == 0){                            
                    var template = _.template($("#rowProductTemplate").html());
                    var html = template({
                        Class: "row-product" + (countRowProduct+1)
                    });
                    $(".swiper-slide" + countSwipe).append(html);
                    countRowProduct++;
                }

                template = _.template($("#productItemTemplate").html());                       
                html = template({
                    Class: "product-" + (countProductItem+1),
                    path: productListObject.ProductList[i].imageFile,
                    styleCode: productListObject.ProductList[i].styleCode,
                    styleName: productListObject.ProductList[i].styleName,
                    brandCode: productListObject.ProductList[i].brandCode,
                    brandName: productListObject.ProductList[i].brandName,
                    price: productListObject.ProductList[i].price,
                });
                $(".row-product"+countRowProduct).append(html);
                countProductItem++;
                if(i == indexEnd){
                    break;
                }
            }                                  
        }      
        else{
            showSortArea(false);
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

    function getFiltersFromServer(){
        showLoading(true);
        $.ajax({
            type: "GET",
            url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/GetFilter",            
            async: false,
            contentType: "application/json",
            crossdomain: true,
            success: function (result) {
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

    function showLoading(option){
        if(option){  
            if($(".loader").hasClass("hide"))
                $(".loader").removeClass("hide").addClass("show");
            else
                $(".loader").addClass("show");
        }else{
            if($(".loader").hasClass("show"))
                $(".loader").removeClass("show").addClass("hide");
            else
                $(".loader").addClass("hide");
        }
    }

    function showLoadingResults(option){
        if(option){  
            if($(".loader-results").hasClass("hide"))
                $(".loader-results").removeClass("hide").addClass("show");
            else
                $(".loader-results").addClass("show");
        }else{
            if($(".loader-results").hasClass("show"))
                $(".loader-results").removeClass("show").addClass("hide");
            else
                $(".loader-results").addClass("hide");
        }
    }

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

    function showLogo(option){
        if(option){  
            $(".area-logo").show();
        }else{
            $(".area-logo").hide();
        }
    }

    function showNoResults(option){
        if(option){  
            if($(".notfound").hasClass("hide"))
                $(".notfound").removeClass("hide").addClass("show");
            else
                $(".notfound").addClass("show");
        }else{
            if($(".notfound").hasClass("show"))
                $(".notfound").removeClass("show").addClass("hide");
            else
                $(".notfound").addClass("hide");
        }
    }

    function setFilterSelected(){
        if(localStorage.listBrandFilter != undefined &&
            localStorage.listSizeFilter != undefined &&
            localStorage.listGenderFilter != undefined &&
            localStorage.listClassFilter != undefined){
            showLogo(false);
            var brandFilteredObject = JSON.parse("{" + localStorage.listBrandFilter + "}").Brand;
            var sizeFilteredObject = JSON.parse("{" + localStorage.listSizeFilter + "}").Size;
            var genderFilteredObject = JSON.parse("{" + localStorage.listGenderFilter + "}").Gender;
            var classFilteredObject = JSON.parse("{" + localStorage.listClassFilter + "}").Class;
            
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

function handleError(image){
        // var path = 'file:\\\\'+localStorage.serverId+'\\PublicImages\\Product\\imNoFound.jpg'
        image.src = '../img/imNoFound.jpg';
    }
