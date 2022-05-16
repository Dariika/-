HOST = "https://projects.masu.edu.ru/lyamin/lavina_server"
REGISTER = "/register"
CSRF = "/crsf"
LOGIN = "/login"
LOGOUT = "/logout"
WHOAMI = "/whoami"
PLACES = "/places"
ELEVATION = "/elevation_around"
ALLOWED_REGION = "/allowed_region"

function __post(url, data, ondonecallback, onfailcallback = null){
    $.post({
        'url': url,
        'data': data,
        'dataType': 'json'})
    .done(ondonecallback)
    .fail(onfailcallback);
}

function __encodePost(data){
    let params = [];
    for(const [key, value] of Object.entries(data)){
        params.push(`${key}=${typeof value != 'object' ? 
                                    value.toString(): JSON.stringify(value)}`);
    }
    return params.join("&");
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
    __post(HOST + PLACES, __encodePost(data), ondonecallback, onfailcallback);
}

function updatePlace(id, data, ondonecallback, onfailcallback = null){
    $.ajax({'url': HOST + PLACES + `/${id}`, 'method': "PUT", "data": __encodePost(data)})
        .done(ondonecallback)
        .fail(onfailcallback);
}

function getPlaces(ondonecallback, type_id = 1, onfailcallback = null) {
    __get(HOST + PLACES+`?type_id=${type_id}`, ondonecallback, onfailcallback);
}

function getElevation(latlng, ondonecallback, onfailcallback = null){
    __get(HOST + ELEVATION + `/${latlng[0]}/${latlng[1]}`, ondonecallback, onfailcallback)
}

function getAllowedRegion(ondonecallback, onfailcallback = null){
    __get(HOST + ALLOWED_REGION, ondonecallback, onfailcallback)
}

fetchCsrf();
