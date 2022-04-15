const WEATHER_API_KEY = '5d20f14e98068a911f39ac24389c3aa5';
const INACTIVE_POLYGON_STYLE = { color: 'orange' };
const ACTIVE_POLYGON_STYLE = { color: 'yellow' };

let p = [];
let currentPlace = null;
let clippingArea = null;

getClippingArea(function(area){
  clippingArea = area;
  clippingArea.addTo(map);
  showWeatherAndZoom(clippingArea);
});

function showPlace(i, place, polyCoords){
  place.poly = L.polygon(polyCoords, INACTIVE_POLYGON_STYLE);
  place.poly.place_obj = place;
  place.poly.addTo(map);
  place.poly.bindTooltip(place.name, {'permanent': true});
  installPolyHandlers(place.poly);
  updatePlacesList(place, i);
  if(place.heighest_point != null){
    L.marker(place.heighest_point.coordinates).addTo(map)
        .bindTooltip(`Высота: ${place.heighest_elevation}`, {'permanent': true});
  }
}

function fetchPlaces(){
    getPlaces(function(data){
        p = data;
        currentPlace = p[0];
        $.each(p, function (i, place) {
           showPlace(i, place, place.geometry.coordinates);
        });
        showAvalanche(currentPlace);
    });
}

function polyHover(e){
  e.target.setStyle(ACTIVE_POLYGON_STYLE);
}

function polyLeave(e){
  if(e.target != currentPlace.poly){
    e.target.setStyle(INACTIVE_POLYGON_STYLE);
  }
}

function polyClick(e){
  showAvalanche(e.target.place_obj);
}

function installPolyHandlers(poly){
  poly.on('mouseover', polyHover);
  poly.on('mouseout', polyLeave);
  poly.on('click', polyClick);
}

function removePolyHandlers(poly){
  poly.off('mouseover', polyHover);
  poly.off('mouseout', polyLeave);
  poly.off('click', polyClick);
}

function fetchWeather(latlng){
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latlng.lat}&lon=${latlng.lng}&appid=${WEATHER_API_KEY}`)
      .then(response => response.json())
      .then(function(data){
        $('.weather__forecast').html(Math.round(data.main.temp - 273) + '&deg;C');
        $('.weather__icon').html(`<img src="http://openweathermap.org/img/wn/${data.weather[0]['icon']}@2x.png" width=50 height=50>`);
      });
}

$("#place-select").click(function(){
  console.log("Changed to: " + this.value);
  showAvalanche(p[this.value]);
});

function updatePlacesList(place, index){
    $('<option />')
        .text(place.name)
        .attr({'value': index})
        .on('change', function () { showAvalanche(place) })
    .appendTo("select");
}

function setCurrentPlace(place){
  currentPlace?.poly.setStyle(INACTIVE_POLYGON_STYLE);
  currentPlace = place;
  currentPlace.poly.setStyle(ACTIVE_POLYGON_STYLE);
}

function showWeatherAndZoom(poly){
  let bounds = poly.getBounds();
  fetchWeather(bounds.getCenter());
  map.fitBounds(bounds);
}

function showAvalanche(place) {
    setCurrentPlace(place);
    showWeatherAndZoom(place.poly);
    $("#place-select").prop("value", p.indexOf(place.place_obj));
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
    // удаляем обработчики у полигонов на время добавления
    p.forEach(function(value, index){
      removePolyHandlers(value.poly);
    })
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
               // возвращаем обработчики 
                p.forEach(function(value, index){
                  installPolyHandlers(value.poly);
                });
                p.push(data);
                showPlace(p.length-1, data, placeEditor.currentPoly.getLatLngs());
                showAvalanche(data);
                openClosePlaceAddPane();
             },
             function(data){
               // TODO:
                alert("Не удалось добавить");
                placeEditor.clearPoly();
             });
  });
