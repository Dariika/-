function setDefault() {
  fetch('http://api.openweathermap.org/data/2.5/weather?lat=67.766061&lon=34.132252&appid=5d20f14e98068a911f39ac24389c3aa5').then(function (resp) { return resp.json() }).then(function (data) {

    document.querySelector('.weather__title').textContent = "Мурманская область";
    document.querySelector('.weather__forecast').innerHTML = Math.round(data.main.temp - 273) + '&deg;C';
    document.querySelector('.weather__icon').innerHTML = '<img src="http://openweathermap.org/img/wn/' + data.weather[0]['icon'] + '@2x.png" width=50 height=50>';
  })
    .catch(function () {
      //Обрабатываем ошибки
    });
  map.setView([67.763510, 34.135140], 9);
}

// Creating map options
var mapOptions = {
  center: [67.763510, 34.135140],
  zoom: 9
}

var map = L.map('map', mapOptions);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);


setDefault()

function getPlaces() {
  return [

    {
      "name": "участок 1",
      "geometry": {
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
      "geometry": {
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
      "geometry": {
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

function onPlaceAdded(polygon) {
  polygon.addTo(map);
  polygons.push(polygon);
}

function onPlaceUpdated(place) {

}

function onPlaceDeleted(place) {

}


$("#edit-btn").click(function () {
  placeEditor.startEdit(polygons[polygons.length - 1]);
});

$("#vixod").click(function(){
  if(user != null){
    logout(onLogout);
  }
});

tryFetchCurrentUser(onUserLoad, onLogout);

function onUserLoad(data){
  current_user = data;
  fetchCsrf();
  $("#register-btn").hide();
  $("#vixod").show();
  if(current_user.group == "regular_user"){
    $("#add").hide();
    $("#dobav").hide();
  }
  else{
    $("#add-pane").show();
  }
  $("#current_user_fio").show();
  $("#current_user_fio").text(`Добрый день, ${current_user.fio}`);

}

function onLogout(data){
    current_user = null;
    fetchCsrf();
    $("#register-btn").show();
    $("#vixod").hide();
    $("#add-pane").hide();
    $("#current_user_fio").hide();
}


$("#register-submit-btn").click(function(){
  register($('#reg-form').serialize(), function(data){
      console.log(data);
      login($('#reg-form')
            .find("input[name=username], input[name=password]").serialize(),
            () => tryFetchCurrentUser(onUserLoad));
      $("#overlay").hide();
  }, function(data){
    console.log("register failed!");
    console.log(data);
  });
});

$("#login-submit-btn").click(function () {
  login($('#login-form').serialize(), function (data) {
    console.log(data);
    tryFetchCurrentUser(onUserLoad);
    $("#overlay").hide();
  }, function(data){
    console.log("login failed");
    console.log(data);
  });
});
//created by dmitriy

$("#overlay").hide();

$("#register-btn").click(function () {
  $("#overlay").toggle();
});

$("#overlay_img").click(function () {
  $("#overlay").toggle();
});

let p = getPlaces();

for (let a in p) {
  L.polygon(p[a].geometry.coordinates, { color: 'orange' }).addTo(map);
}

$.each(p, function (i, item) {

  var li = $('<li/>')
    .appendTo('#list_avalanches');
  $('<a />')
    .text(item.name)
    .attr('href', '#')
    .on('click', function () { showAvalanche(i) })
    .appendTo(li);
})



function showAvalanche(id) {
  map.setView(p[id].geometry.coordinates[0][0], 12);
  lat = p[id].geometry.coordinates[0][0][0];
  lon = p[id].geometry.coordinates[0][0][1];
  appkey = '5d20f14e98068a911f39ac24389c3aa5';
  title = p[id].name;
  fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appkey}`).then(function (resp) { return resp.json() }).then(function (data) {
    document.querySelector('.weather__title').textContent = title;
    document.querySelector('.weather__forecast').innerHTML = Math.round(data.main.temp - 273) + '&deg;C';
    document.querySelector('.weather__icon').innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0]['icon']}@2x.png" width=50 height=50>`;
  })
    .catch(function () {
      //Обрабатываем ошибки
    });
}
