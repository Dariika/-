HOST = "http://localhost:8000"
REGISTER = "/register"

$(".register-pane").hide();

$("#register-btn").click(function(){
    $(".register-pane").toggle();
});

$("#register-form-submit").click(function(){
    $.post( HOST + REGISTER, $('form#register').serialize(), function(data) {
        console.log(data);
      },
      'json' 
   ),
   function(succes){
    $(".register-pane").toggle();
   };
});