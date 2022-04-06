HOST = "https://projects.masu.edu.ru/lyamin/lavina_server"
REGISTER = "/register"
CSRF = "/crsf"
LOGIN = "/login"
LOGOUT = "/logout"
WHOAMI = "/whoami"
PLACES = "/places"

function __post(url, data, ondonecallback, onfailcallback = null){
    $.post({
        'url': url,
        'data': data,
        'dataType': 'json'})
    .done(ondonecallback)
    .fail(onfailcallback);
}

function __get(url, ondonecallback, onfailcallback = null){
    $.ajax({
        'url': url,
        'dataType': 'json'})
    .done(ondonecallback)
    .fail(onfailcallback);
}

// load and set CSRFToken
function fetchCsrf(){
    $.ajax({
        url: HOST + CSRF,
        dataType: 'json'
      }).done(function (data){
        console.log("Loaded token: "+data);
        $.ajaxSetup({
           headers: { 'X-CSRFToken':  data["X-CSRFToken"]} 
          });
      });
}

function tryFetchCurrentUser(onuserload, onfail){
    __get(HOST + WHOAMI, onuserload,
    // user is not autheficated
    onfail);
}

function logout(onlogout){
    __get(HOST + LOGOUT, onlogout,
        function(data){
            console.log("something went wrong");
            console.log(data);
        });
}

function register(data, ondonecallback, onfailcallback = null){
    __post(HOST + REGISTER, data, ondonecallback, onfailcallback);
}

function login(data, ondonecallback, onfailcallback = null){
    __post(HOST + LOGIN, data, ondonecallback, onfailcallback);
}

function addPlace(data, ondonecallback, onfailcallback = null){
    __post(HOST + PLACES, data, ondonecallback, onfailcallback);
}

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

fetchCsrf();
