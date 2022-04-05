// Creating map options
var mapOptions = {
center: [67.763510, 34.135140],
zoom: 9
}

window.onload = function(){
  if (current_user !== null){
    print_us.innerHTML="Здравствуйте "+current_user.username;
    document.getElementById('vixod').style.display = 'block';
    document.getElementById('register-btn').style.display = 'none';
  }
}


// Creating a map object
var map = L.map('map', mapOptions);

// Creating a Layer object

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{ attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);


function getPlaces(){
  return [

    {
      "name": "участок 1",
      "geometry" : {
        "type": "Polygon",
        "coordinates": [
          [
            [67.594737, 33.733145],
            [67.601152, 33.728142],
            [67.606744, 33.737543],
            [67.607994, 33.769972],
            [67.596612, 33.766953],
            [67.589208, 33.745564],
            [67.590393, 33.736853]
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
            [67.834847, 33.801198], 
            [67.837821, 33.814425], 
            [67.824867, 33.844060], 
            [67.821973, 33.817643], 
            [67.821973, 33.817643], 
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


$("#edit-btn").click(function(){
  placeEditor.startEdit(polygons[polygons.length - 1]);
});


tryFetchCurrentUser(onUserLoad, onLogout);

function onUserLoad(data){
  current_user = data;
  fetchCsrf();
  // проверка group, скрытие кнопок
}

function onLogout(data){
    current_user = null;
    fetchCsrf();
    // скрытие кнопок для неавторизванного пользователя
}

//  для выхода: вызвать logout(onLogout);
// user при этом должен быть не null

$("#register-submit-btn").click(function(){
  register($('#reg-form').serialize(), function(data){
      console.log(data);
      tryFetchCurrentUser(onUserLoad);
      $("#overlay").hide();
  }, function(data){
    console.log("register failed!");
    console.log(data);
  });
});

$("#login-submit-btn").click(function(){
  login($('#login-form').serialize(), function(data){
    console.log(data);
    tryFetchCurrentUser(onUserLoad);
    current_user = data;
    $("#overlay").hide();
  }, function(data){
    console.log("login failed");
    console.log(data);
  });
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

let p = getPlaces()

for (let a in p){
  L.polygon(p[a].geometry.coordinates, {color: 'red'}).addTo(map);
}

$.each(p, function(i,item){

  var li = $('<li/>')
  .appendTo('#list_avalanches');
  $('<a />')
  .text(item.name)
  .attr('href', '#')
  .on('click', function(){showAvalanche(i)})
  .appendTo(li);  
})



function showAvalanche(id){
  console.log(p[id].geometry.coordinates[0][0])
  map.setView(p[id].geometry.coordinates[0][0], 12);
}

