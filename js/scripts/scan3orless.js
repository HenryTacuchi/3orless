$(document).ready(function () {

    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        // beforeScan();
        getCameraAuthorizationStatus();
        document.addEventListener("backbutton", onBackKeyDown, true);
    }

    function onBackKeyDown() {
        window.location.href = "search3orless.html";     
    }

});

$(window).load(function(){
    
});

function beforeScan(){
    cordova.plugins.barcodeScanner.scan(function(result){
        localStorage.resultsProductSKUSelected=result.text;
        window.location.href = "product-detail.html";
    },function(error){
        console.log(JSON.stringify(error));
        window.location.href = "search3orless.html";
    });
}

function getCameraAuthorizationStatus(){
    cordova.plugins.diagnostic.getCameraAuthorizationStatus(function(status){
        if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
            console.log("Camera use is authorized");
            beforeScan();
        }else{
            requestCameraAuthorization();        
        }
    }, function(error){
        console.error("The following error occurred: "+error);
    });
}

function requestCameraAuthorization(){
    cordova.plugins.diagnostic.requestCameraAuthorization(function(status){
        console.log("Authorization request for camera use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
        if (status == cordova.plugins.diagnostic.permissionStatus.GRANTED){
            beforeScan();
        }else if(status == cordova.plugins.diagnostic.permissionStatus.DENIED){
            window.location.href = "search3orless.html";
        }
    }, function(error){
        console.error(error);
    });
}