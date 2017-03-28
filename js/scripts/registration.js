var delay=2500;
var correctnumberFormat = true;
//global functions

  // Datepicker
    //Function to animate the multitouch
      Hammer.plugins.fakeMultitouch();
    //Funtion to get a index of a element
      function getIndexForValue(elem, value) {
        for (var i=0; i<elem.options.length; i++)
          if (elem.options[i].value == value)
      return i;
      }
  //   //Function to add a 0
      function pad(number) {
        if ( number < 10 ) {
          return '0' + number;
        }
      return number;
      }
  //   //Function to set today as the start date
      function update(datetime) {
        $("#date").drum('setIndex', datetime.getDate()-1);
        $("#month").drum('setIndex', datetime.getMonth());
        $("#fullYear").drum('setIndex', getIndexForValue($("#fullYear")[0], datetime.getFullYear()));
      }

$(document).ready(function () {

    setCaptions();
    $('.txtEmail').bind('keypress', function(event) {
    if(event.which == 13||event.which == 10) {
      $("input").blur();
      $(".options").show();
      $(".btn-submit").click();
    }
    });
  
  //load years for brithday modal datepicker
  var dateModal = new Date();
  var actualyear = dateModal.getFullYear();
  for (var i = actualyear; i >= 1940; i--) {
    var template = _.template($("#modalYearTemplate").html());
    var html = template({
        value: i,
        text: i
    });
    $("#fullYear").append(html);
  }

  $("input").focus(function(){
    $(".options").hide();
  });

  $("input").blur(function(){
    $(".options").show();
  });

  $(".txtNumber").focus(function(){
    $(".placeholder").hide();
  });

  $(".txtNumber").focusout(function(){
    if($(".txtNumber").val().length == 0){
      $(".placeholder").show();
      $(".noNumber").removeClass("show").addClass("hide");  
      correctnumberFormat = true;
    }
    else{      
      validatePhone($(".txtNumber").val(),"(xxx)-xxx-xxxx")
    }
  });

  $(".btn-home").click(function(){
        window.location = "menu.html";
    });

//Function to validate  firstName can't be blank
  $('.txtFirstName').on('input', function () {
      var firstName = $('.txtFirstName').val();
      if (firstName) { $('.txtFirstName').removeClass("invalid").addClass("valid"); }
      else {
          $('.txtFirstName').removeClass("valid").addClass("invalid");
      }
  });

//Function to animate 'tab' on firstName
  $('.txtFirstName').bind('keypress', function(event) {
  if(event.which == 13||event.which == 10) {
    $('.txtLastName').focus();
  }
  });

//Function to validate lastName can't be blank
  $('.txtLastName').on('input', function () {
      var lastName = $('.txtLastName').val();
      if (lastName) { $('.txtLastName').removeClass("invalid").addClass("valid"); }
      else {
          $('.txtLastName').removeClass("valid").addClass("invalid");
      }
  });

//Function to animate 'tab' on lastName
    $('.txtLastName').bind('keypress', function(event) {
      if(event.which == 13||event.which == 10) {
        $('.txtNumber').focus();
      }
    });

// Function to autocomplete domain of the email
    $('.txtEmail').emailautocomplete({
        suggClass: "custom-classname", //default: "eac-sugg". your custom classname (optional)
        domains: ["gmail.com","hotmail.com"] // add your own domains
    });

// Function to validate characters of email
    $('.txtEmail').on('input', function () {
        var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        var userEmail = re.test($('.txtEmail').val());
        if (userEmail) { $('.txtEmail').removeClass("invalid").addClass("valid"); }
        else {
            $('.txtEmail').removeClass("valid").addClass("invalid");
        }
    });


//Function to recieve inputs as contact-info
  $(".btn-submit").click(function () {
        
        //obligatory
        var firstName = $('.txtFirstName').val();
        var lastName = $('.txtLastName').val();
        var email = $('.txtEmail').val();
        //optional
        var initialPhoneNumber = $('.txtNumber').val();
        var initialBirthday = $(".txtBirthDate").val();//2-7-1996  10-15-1893
        var phoneNumber = 0;
        var birthday = "02-02-1993";
 
        if (initialPhoneNumber){
            var chainPhoneNumber = initialPhoneNumber.toString();
            chainPhoneNumber = chainPhoneNumber.replace("(", "").replace(")", "").replace(/-/g, "");
            phoneNumber= parseInt(chainPhoneNumber);
        }
        if (initialBirthday) {
            var arr = initialBirthday.split("-");
            birthday = arr[2] + "-" + arr[0] + "-" + arr[1];
        }

        if (firstName && lastName && email && correctnumberFormat) {
           SaveContact(firstName, lastName, phoneNumber, birthday, email);
           // SaveContact(firstName, lastName, phoneNumber, initialBirthday, email);
           if($(".noEmail").hasClass("show"))
                $(".noEmail").removeClass("show").addClass("hide");
           if($(".noNumber").hasClass("show"))
                $(".noNumber").removeClass("show").addClass("hide");
           if($(".noFirstName").hasClass("show"))
                $(".noFirstName").removeClass("show").addClass("hide");
           if($(".noLastName").hasClass("show"))
                $(".noLastName").removeClass("show").addClass("hide");                                              
        }
        else {
            // $("#modalIncompleteData").modal("show");
            if (email.length==0){
              $(".txtEmail").focus();
              $(".noEmail").removeClass("hide").addClass("show");
              $(".noEmail").text(localStorage.caption_msgCompleteRequiredField);
            }else{
              if($(".noEmail").hasClass("show"))
                $(".noEmail").removeClass("show").addClass("hide");
            }
            if (!correctnumberFormat){
              $(".txtNumber").focus();
              $(".noNumber").removeClass("hide").addClass("show");
              $(".noNumber").text(localStorage.caption_msgInsertValidPhoneNumber);
            }else{
              if($(".noNumber").hasClass("show"))
                $(".noNumber").removeClass("show").addClass("hide");
            }
            if (lastName.length==0){
              $(".txtLastName").focus();
              $(".noLastName").removeClass("hide").addClass("show");
              $(".noLastName").text(localStorage.caption_msgCompleteRequiredField);
            }else{
              if($(".noLastName").hasClass("show"))
                $(".noLastName").removeClass("show").addClass("hide");
            }
            if (firstName.length==0){
              $(".txtFirstName").focus();
              $(".noFirstName").removeClass("hide").addClass("show");
              $(".noFirstName").text(localStorage.caption_msgCompleteRequiredField);
            }else{
              if($(".noFirstName").hasClass("show"))
                $(".noFirstName").removeClass("show").addClass("hide");
            }
            if($(".txtMessage").hasClass("success")){
              $(".txtMessage").removeClass("success").addClass("danger");
              $(".btn-mini-img").removeClass("success").addClass("danger").find('span').empty().html('&#xe645');
            }
            else{
              $(".txtMessage").addClass("danger");
              $(".btn-mini-img").addClass("danger").find('span').empty().html('&#xe645');
            }
            $(".validations").removeClass("hide").addClass("animated fadeInLeft");

            $(".txtMessage").text(localStorage.caption_msgVerifyFields);

            $(".validations").delay(delay).queue(function(){
                $(this).addClass("animated fadeOutLeft").dequeue();
            });
        }
    });

//Function to sent the contact-info through webservice
  function SaveContact(firstName, lastName, phoneNumber, birthday, email) {
      var oContact = '{ '+
                            '"FirstName": "'+firstName+'", '+
                            '"LastName": "'+lastName+'", '+
                            '"PhoneNumber": "'+phoneNumber+'", '+
                            '"BirthDay": "'+birthday+'", '+
                            '"Email": "'+email+'"}';
     
      $.ajax({
          type: "POST",
          url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/PostSubscription",
          // async: false,
          contentType: "application/json",
          // data: JSON.stringify(oContact),
          data: oContact,
          crossdomain: true,
          beforeSend:function(){
            showLoading(true);
          },
          complete: function(){
              showLoading(false);
          },
          success: function (result) {
                  if (result == 1) {
                      swal({
                          title: localStorage.caption_modalRegisterConfirmationTitle,
                          text: localStorage.caption_modalRegisterConfirmationText,
                          type: "success",
                          confirmButtonColor: "#8fbf75",
                          confirmButtonText: localStorage.caption_txtConfirmButton,          
                          closeOnConfirm: false
                        },
                        function(isConfirm){
                          showLoading(false);         
                          window.location = "menu.html";
                        });                      
                  }
                  else if (result == 2) {
                      swal({
                          title: localStorage.caption_modalRegisterInformationTitle,
                          text: localStorage.caption_modalRegisterInformationText,
                          type: "warning",
                          confirmButtonColor: "#8fbf75",
                          confirmButtonText: localStorage.caption_txtConfirmButtonRetry,          
                          closeOnConfirm: true
                        });
                  }
                  else if (result == 3) {
                      swal({
                          title: localStorage.caption_modalRegisterInformationTitle,
                          text: localStorage.caption_modalMailNotSendText,
                          type: "warning",
                          confirmButtonColor: "#8fbf75",
                          confirmButtonText: localStorage.caption_txtConfirmButtonRetry,          
                          closeOnConfirm: true
                        });                      
                  }
                  else {
                      swal({
                          title: localStorage.caption_modalRegisterInformationTitle,
                          text: localStorage.caption_modalConnectionErrorText,
                          type: "warning",
                          confirmButtonColor: "#8fbf75",
                          confirmButtonText: localStorage.caption_txtConfirmButtonRetry,          
                          closeOnConfirm: true
                        });
                  }
              
          },
          error: function (error) {
              $("#modalNoConection").modal("show");
          },
      });
  }

//******************************************************************************
//Function to animate 'done' on datepicker
  $('.btn-done').on('click',function(event){
        $('.txtEmail').focus();
  });

//Function to show datepicker selection
  $("select.date").drum({
    onChange : function (elem) {
      var date =new Date();
      var sDay = ($("form[name='date'] select[name='date']"))[0].value;
      date.setDate(sDay);
      var sMonth = ($("form[name='date'] select[name='month']"))[0].value;
      date.setMonth(sMonth);
      var sYear = ($("form[name='date'] select[name='fullYear']"))[0].value;
      date.setFullYear(sYear);
      update(date);
      var format =pad(date.getMonth() +1) + '-' + pad( date.getDate() ) + '-' + date.getFullYear();

      $('.date_header .selection').html(format);
      $(".txtBirthDate").val(format);
    },

  });

$('.txtBirthDate').click(function(){
  $('#modalDatePicker').modal("show");

});
//Call to the function to set today as the start date
  update(new Date());
  //End-function

//Function to keep birthday clean
  $(".txtBirthDate").val("");
  //End-function

});

//when page is loaded hide loaders
$(window).on("load", function() {
  showLoading(false);
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
            $(".loader").removeClass("show").addClass("hide");
        else
            $(".loader").addClass("hide");
    }
}

function validatePhone(phoneField, format) {
  var num = phoneField.replace(/[^\d]/g,'');
  if(num.length != 10 && num.length != 0) {
      //Alert the user that the phone number entered was invalid.
      // alert('Please enter a valid phone number including area code'); 
      // $(".txtNumber").focus();
      correctnumberFormat = false;
      $(".noNumber").removeClass("hide").addClass("show");
      if (localStorage.current_lang == "es") { $(".noNumber").text("Por favor, ingrese un número válido!"); } 
      else { $(".noNumber").text("Please enter a valid phone number!"); }                  
  } else if (num.length == 0){
    $(".txtNumber").val("");
    $(".placeholder").show();
  } else{
    correctnumberFormat = true;
    $(".noNumber").removeClass("show").addClass("hide");
      //Email was valid.  If format type is set, format the Phone to the desired style.
     switch(format) {
          case '(xxx)-xxx-xxxx': //Format (xxx)-xxx-xxxx
              $(".txtNumber").val("(" + num.substring(0,3) + ") " + num.substring(3, 6) + "-" + num.substring(6));
              break;
          case '1': //Format xxx-xxx-xxxx
              $(".txtNumber").val(num.substring(0,3) + "-" + num.substring(3, 6) + "-" + num.substring(6));
              break;
          default: //Format xxxxxxxxxx
              $(".txtNumber").val(num);
              break;
      }
  }
}

function setCaptions(){
  $(".lblCreateAccount").text(localStorage.caption_lblCreateAccount);
  $(".lblName").html(localStorage.caption_lblNameRequired);
  $(".lblLastName").html(localStorage.caption_lblLastNameRequired);
  $(".lblInstructions").text(localStorage.caption_lblInstructions);
  $(".lblNumber").html(localStorage.caption_lblNumber);
  $(".lblBirthDate").html(localStorage.caption_lblBirthDate);
  $(".appNameRegistration").text(localStorage.caption_option1);
  $(".btnSubmit").text(localStorage.caption_btnSubmit);  
  $(".btnModalDone").text(localStorage.caption_btnModalDone);
  $(".modalTitle").text(localStorage.caption_modalBirthdayTitle);  
  $(".txtEmail").attr('placeholder',localStorage.caption_emailUser);
  $(".lblEmail").html(localStorage.caption_lblEmailRequired);
}
