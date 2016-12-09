var app = {
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
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
        if(cordova.platformId = 'android'){

			// cordova.plugins.printer.check(function (avail, count) {
		 //    	alert(avail ? 'Found ' + count + ' services' : 'No');
			// });
			// location.href = "print.html";
			var page = location.href;
			cordova.plugins.printer.print(page, { duplex: 'long' }, function (res) {
			    alert(res ? 'Done' : 'Canceled');
			});
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        // console.log('Received Event: ' + id);
    }
};

$(document).ready(function(){

	$(".ordernumber").text("Order No: " + localStorage.orderNumber);
    $(".clientname").text(localStorage.currentFirstNameClient + " " + localStorage.currentLastNameClient);
   // $(".date").text(data.styleCode);

   	var totalMont=0;
   	var totalRealMont =0;

   	for (var i = 1; i <= localStorage.countProductCartItem; i++) {
		var productObject = JSON.parse(localStorage["cartItemProduct"+i]);
		
		var mont = Number(productObject.Product.price.substring(1));
		var montOriginal = Number(productObject.Product.originalPrice.substring(1));
		totalMont = totalMont + mont;
		totalRealMont = totalRealMont + montOriginal;
		template = _.template($("#cartItemTemplate").html());                       
        html = template({
            Class: "item-" + (i),
            styleName: productObject.Product.styleName,
            colorCode: productObject.Product.colorCode,
            brandName: productObject.Product.brandName,
            size: productObject.Product.size,
            price: productObject.Product.price
        });
        $(".list-items").append(html);
	}

	$(".total").text("Total: $" + totalMont.toFixed(2));
	$(".saving").text("Your savings: $" + (totalRealMont - totalMont).toFixed(2));
	app.initialize();
	clearSearchPage();

});

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
	for (var i = 1; i <= localStorage.countProductCartItem; i++) {
		localStorage.removeItem("cartItemProduct" + (i));
	}
	localStorage.countProductCartItem = 0;
}
