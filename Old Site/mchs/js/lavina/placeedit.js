const WEATHER_API_KEY = '5d20f14e98068a911f39ac24389c3aa5';

let p = [];
let currentPlace = null;
let clippingArea = null;

getClippingArea(function(area){
  clippingArea = area;
  clippingArea.addTo(map);
  showWeatherAndZoom(clippingArea);
});

function fetchPlaces(){
    getPlaces(function(data){
        p = data;
        currentPlace = p[0];
        showAvalanche(currentPlace);
        $.each(p, function (i, place) {
            place.poly = L.polygon(place.geometry.coordinates, { color: 'orange' });
            place.poly.addTo(map);
            updatePlacesList(place, i);
            if(place.heighest_point != null){
              L.marker(place.heighest_point.coordinates).addTo(map)
                  .bindPopup(`Высота: ${place.heighest_elevation}`)
                  .openPopup();
            }
        });
    });
}

function fetchWeather(latlng){
  $.ajax(`https://api.openweathermap.org/data/2.5/weather?lat=${latlng.lat}&lon=${latlng.lng}&appid=${WEATHER_API_KEY}`)
      .done(function(data){
        $('.weather__forecast').html(Math.round(data.main.temp - 273) + '&deg;C');
        $('.weather__icon').html(`<img src="http://openweathermap.org/img/wn/${data.weather[0]['icon']}@2x.png" width=50 height=50>`);
      })
      .fail(function(data){
        console.log("Weather fetch failed");
      });
}

document.querySelector("select").addEventListener('change', function (e) {
  console.log("Changed to: " + e.target.value);
  showAvalanche(p[e.target.value]);
})

function updatePlacesList(place, index){
    $('<option />')
        .text(place.name)
        .attr({'value': index})
        .on('change', function () { showAvalanche(place) })
    .appendTo("select");
}

function showWeatherAndZoom(poly){
  let bounds = poly.getBounds();
  fetchWeather(bounds.getCenter());
  map.fitBounds(bounds);
}

function showAvalanche(place) {
    currentPlace = place;
    showWeatherAndZoom(place.poly);
}

fetchPlaces();

let placeEditor = new PlaceEditor(map,
  function(polygon){
    $("#place-selected").show();
    $("#add-place-btn").val("Отметить заново");
    $("#submit-place-btn").attr('disabled', false);
}, null, null, clippingArea);


$("#add-place-btn").click(function(){
    $("#place-selected").hide();
    placeEditor.startAdd();
    $("#submit-place-btn").attr('disabled', true);
});


$("#edit-btn").click(function () {
  placeEditor.startEdit(polygons[polygons.length - 1]);
});

$(".dobav-toggle").click(openClosePlaceAddPane);

function openClosePlaceAddPane(){
  $("#dobav").toggle();
  placeEditor.clearPoly();
  $("#place-selected").hide();
  $("#add-place-btn").val("Отметить место на карте");
  $("#submit-place-btn").attr('disabled', true);
}

$("#submit-place-btn").click(function(){
    // TODO: 
    let placeName = $("input[name=place-name]").val().trim();
    if(placeName == ""){
      alert("Введите название участка!");
      return;
    }
    if(!placeEditor.isPolyDone()){
      alert("Выберите участок на карте!");
      return;
    }
    let poly = {
      "type": "Polygon",
      "coordinates": [
        placeEditor.currentPoly.getLatLngs()[0].map(value => [value.lat, value.lng])
      ]
    };
    // в geoJson первая точка должна повторяться в конце
    poly.coordinates[0].push([placeEditor.currentPoly.getLatLngs()[0][0].lat, 
                              placeEditor.currentPoly.getLatLngs()[0][0].lng]);
    addPlace(`name=${placeName}&`+
             `place_type=1&`+
             `geometry=${JSON.stringify(poly)}`,
             function(data){
                p.push(data);
                L.polygon(placeEditor.currentPoly.getLatLngs(), {color: "yellow"}).addTo(map);
                openClosePlaceAddPane();
                updatePlacesList(p[p.length-1], p.length-1);
             },
             function(data){
               // TODO:
                alert("Не удалось добавить");
                placeEditor.clearPoly();
             });
  });
