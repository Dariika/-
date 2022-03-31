HOST = "https://projects.masu.edu.ru/lyamin/lavina_server"
REGISTER = "/register"

function getPlaces(){
  return [

    {
      "name": "участок 1",
      "geometry" : {
        "type": "Polygon",
        "coordinates": [
          [
            [67.750002, 33.666639], 
            [67.749995, 33.666714], 
            [67.749978, 33.666646], 
            [67.749992, 33.666577], 
            [67.750002, 33.666639]
          ]
        ]
      }
    },

    {
      "name": "участок 2",
      "geometry" : {
        "type": "Polygon",
        "coordinates": [
          [
            [67.750001, 33.666828], 
            [67.749958, 33.666913], 
            [67.749968, 33.666777], 
            [67.750001, 33.666828], 
          ]
        ]
      }
    },

    {
      "name": "участок 3",
      "geometry" : {
        "type": "Polygon",
        "coordinates": [
          [
            [67.750074, 33.666997], 
            [67.750064, 33.667019], 
            [67.750049, 33.666931], 
            [67.750091, 33.666873], 
            [67.750074, 33.666997], 
          ]
        ]
      }
    }
    
  ]
}



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

$("#overlay_img").click(function(){
  $("#overlay").toggle();});