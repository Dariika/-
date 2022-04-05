HOST = "https://projects.masu.edu.ru/lyamin/lavina_server"
REGISTER = "/register"
CSRF = "/crsf"
LOGIN = "/login"

// load and set CSRFToken
$.ajax({
  url: HOST + CSRF,
  dataType: 'json'
}).done(function (data){
  console.log("Loaded token: "+data);
  $.ajaxSetup({
     headers: { 'X-CSRFToken':  data["X-CSRFToken"]} 
    });
});

function __post(url, data, ondonecallback, onfailcallback = null){
    $.post({
        'url': url,
        'data': data,
        'dataType': 'json'})
    .done(ondonecallback)
    .fail(onfailcallback);
}

function register(data, ondonecallback, onfailcallback = null){
    __post(HOST + REGISTER, data, ondonecallback, onfailcallback);
}

function login(data, ondonecallback, onfailcallback = null){
    __post(HOST + LOGIN, data, ondonecallback, onfailcallback);
}
