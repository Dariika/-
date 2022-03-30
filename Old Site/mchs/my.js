HOST = "https://projects.masu.edu.ru/lyamin/lavina_server"
REGISTER = "/register"




$("#register-form-submit").click(function(){
    $.post( HOST + REGISTER, $('form#register').serialize(), function(data) {
        console.log(data);
      },
      'json' 
   ),
   function(succes){
    $("#overlay").hide();
   };
});

//created by dmitriy

function on() {
    document.getElementById("overlay").style.display = "block";
  }
  
  function off() {
    document.getElementById("overlay").style.display = "none";
  }

  $("#overlay").hide();

  $("#register-btn").click(function(){
    $("#overlay").toggle();
});