var checkPrinterConnection = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        // document.addEventListener('deviceready', this.onDeviceReady, false);
        checkPrinterConnection.receivedEvent('deviceready');

            //Bluetooth Printer
            BTPrinter.connect(function(data){
                console.log("Success");
                console.log(data);
                console.log(localStorage.printerName);
                printerConnection = true;
                postMessage(printerConnection);
            },function(err){
                console.log("Error Connect");
                console.log(err)
                console.log(localStorage.printerName);
                printerConnection = false;
            }, localStorage.printerName)
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'loadCboPrinters.receivedEvent(...);'
    onDeviceReady: function() {
   //      checkPrinterConnection.receivedEvent('deviceready');

   // 			//Bluetooth Printer
		 //   	BTPrinter.connect(function(data){
			//     console.log("Success");
			//     console.log(data);
			//     console.log(localStorage.printerName);
			//     printerConnection = true;
			//     postMessage(printerConnection);
			// },function(err){
			//     console.log("Error Connect");
			//     console.log(err)
			//     console.log(localStorage.printerName);
			//     printerConnection = false;
			// }, localStorage.printerName)					 
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    }
};

checkPrinterConnection.initialize();