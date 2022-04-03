HOST = "https://projects.masu.edu.ru/lyamin/lavina_server"
REGISTER = "/register"

// Creating map options
var mapOptions = {
center: [67.598290, 33.746685],
zoom: 13
}

// Creating a map object
var map = new L.map('map', mapOptions);

// Creating a Layer object

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{ attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
var latlngs = [
[67.594737, 33.733145],
[67.601152, 33.728142],
[67.606744, 33.737543],
[67.607994, 33.769972],
[67.596612, 33.766953],
[67.589208, 33.745564],
[67.590393, 33.736853]
];
var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);

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

let polygons = [];

let placeEditor = new PlaceEditor(map, 
                              onPlaceAdded, 
                              onPlaceUpdated, 
                              onPlaceDeleted);

function onPlaceAdded(polygon){
  polygon.addTo(map);
  polygons.push(polygon);
}

function onPlaceUpdated(place){
  
}

function onPlaceDeleted(place){
  
}

$("#add-btn").click(function(){
   placeEditor.startAdd();
});

$("#edit-btn").click(function(){
  placeEditor.startEdit(polygons[polygons.length - 1]);
});



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