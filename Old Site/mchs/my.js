function setDefault() {
  fetch('https://api.openweathermap.org/data/2.5/weather?lat=67.766061&lon=34.132252&appid=5d20f14e98068a911f39ac24389c3aa5').then(function (resp) { return resp.json() }).then(function (data) {

    document.querySelector('.weather__title').textContent = "Мурманская область";
    document.querySelector('.weather__forecast').innerHTML = Math.round(data.main.temp - 273) + '&deg;C';
    document.querySelector('.weather__icon').innerHTML = '<img src="http://openweathermap.org/img/wn/' + data.weather[0]['icon'] + '@2x.png" width=50 height=50>';
  })
    .catch(function () {
      //Обрабатываем ошибки
    });
  map.setView([67.763510, 34.135140], 5);
}

// Creating map options
var mapOptions = {
  center: [67.763510, 34.135140],
  zoom: 9
}

var map = L.map('map', mapOptions);

L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);


setDefault()

$("#reg-toggle").toggleClass('tab-inactive');
$("#in-toggle").toggleClass('tab-active');

$(".vkladki-toggle").click(function(){
  $("#in").toggle();
  $("#reg").toggle();
  $("#reg-toggle").toggleClass('tab-inactive');
  $("#reg-toggle").toggleClass('tab-active');
  $("#in-toggle").toggleClass('tab-active');
  $("#in-toggle").toggleClass('tab-inactive');
});


