const WEATHER_API_KEY = '5d20f14e98068a911f39ac24389c3aa5';
const INACTIVE_POLYGON_STYLE = { color: 'orange' };
const ACTIVE_POLYGON_STYLE = { color: 'yellow' };

let p = [];
let currentPlace = null;
let oldPolyLatLngs = [];
let allowedRegion = null;
let mode = "";

function addPlaceToMap(i, place){
  place.poly = L.polygon(place.geometry.coordinates, INACTIVE_POLYGON_STYLE);
  place.poly.place_obj = place;
  place.poly.addTo(map);
  place.poly.bindTooltip(place.name, {'permanent': true});
  installPolyHandlers(place.poly);
  updatePlacesList(place, i);
  if(place.heighest_point != null){
    place.marker = L.marker(place.heighest_point.coordinates);
    place.marker.addTo(map)
    place.marker.bindTooltip(`Высота: ${place.heighest_elevation}`);
  }
}

function updatePlaceOnMap(place, data, index){
  place.poly.setLatLngs(data.geometry.coordinates);
  place.poly.addTo(map);
  place.name = data.name;
  place.heighest_point = data.heighest_point;
  place.heighest_elevation = data.heighest_elevation;
  place.poly.setTooltipContent(place.name);
  place.marker.setLatLng(place.heighest_point.coordinates);
  place.marker.setTooltipContent(`Высота: ${place.heighest_elevation}`);
  $(`#place-select option[value=${index}]`).text(place.name);
}

function fetchPlaces(){
    getPlaces(function(data){
        p = data;
        currentPlace = p[0];
        $.each(p, function (i, place) {
           addPlaceToMap(i, place);
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

$("#place-select").on("change", function(){
  showAvalanche(p[this.value]);
});

function updatePlacesList(place, index){
    $('<option />')
        .text(place.name)
        .attr({'value': index})
        .on('change', function () { showAvalanche(place) })
    .appendTo("#place-select");
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
    $("#place-select").prop("value", p.indexOf(place));
}

let placeEditor = new PlaceEditor(map,
  function(){
    $("#place-selected").show();
    $("#add-place-btn").val("Отметить заново");
    $("#submit-place-btn").attr('disabled', false);
});


function removeAllPolyHandlers(){
  // удаляем обработчики у полигонов на время добавления/редактирования
  p.forEach(function(value, index){
    removePolyHandlers(value.poly);
  });
}

$("#add-place-btn").click(function(){
    if(mode == ""){
      mode = "add";
    }
    $("#place-selected").hide();
    removeAllPolyHandlers();
    placeEditor.startAdd();
    $("#submit-place-btn").attr('disabled', true);
});

$("#edit-btn").click(function () {
  // TODO: фильтр
  if(current_user.username != "admin" && currentPlace.owner != current_user.id){
    alert("Вы можете редактировать только свои участки");
    return;
  }
  mode = "update";
  openClosePlaceAddPane();
  // copy
  oldPolyLatLngs = [currentPlace.poly.getLatLngs()[0].map(e => e)];
  removeAllPolyHandlers();
  $("input[name=place-name]").val(currentPlace.name);
  $("#add-place-btn").val("Отметить заново");
  map.removeLayer(currentPlace.poly);
  placeEditor.startEdit(currentPlace.poly);
  $("#submit-place-btn").attr('disabled', false);
});

$(".dobav-toggle").click(openClosePlaceAddPane);

function openClosePlaceAddPane(){
  $("#dobav").toggle();
  placeEditor.stopEditing();
  $("#place-selected").hide();
  $("input[name=place-name]").val("");
  $("#add-place-btn").val("Отметить место на карте");
  $("#submit-place-btn").attr('disabled', true);
  // если старые координаты места не пусты,
  // то пользователь закрывает форму без сохранения (нажал "отмена")
  // надо установить для текущего места старые координаты
  if(oldPolyLatLngs.length > 0){
    currentPlace.poly.setLatLngs(oldPolyLatLngs);
    currentPlace.poly.addTo(map);
    oldPolyLatLngs = [];
  }
}

function onPlaceApiFail(data){
  // TODO:
  if(data.responseJSON != undefined){
    console.log(data);
  }
  alert("Не удалось добавить/изменить");
  placeEditor.stopEditing();
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

    let coords = placeEditor.stopEditing();
     // в geoJson первая точка должна повторяться в конце
    coords.push([coords[0][0], coords[0][1]]);
  
    let data = {'name': placeName, 
            'place_type': 1, 
            'geometry': {
              "type": "Polygon",
              "coordinates": [coords]
            }
          };

    if(mode == "add"){
      addPlace(data,
        function(data){
          // возвращаем обработчики 
           p.forEach(function(value, index){
             installPolyHandlers(value.poly);
           });
           p.push(data);
           addPlaceToMap(p.length-1, data);
           showAvalanche(data);
           openClosePlaceAddPane();
           mode = "";
        },
        onPlaceApiFail);
    }
    else{
      
      updatePlace(currentPlace.id, data, function(data){
        updatePlaceOnMap(currentPlace, 
                        data, 
                        p.indexOf(currentPlace));
        showAvalanche(currentPlace);
        oldPolyLatLngs = [];
        // возвращаем обработчики 
        p.forEach(function(value, index){
          installPolyHandlers(value.poly);
        });
        openClosePlaceAddPane();
      }, onPlaceApiFail)
      mode = "";
    }
    
  });

window.addEventListener("load", function(event) {

  getAllowedRegion(function(data){
    allowedRegion = L.rectangle(data["allowed_region"], {fillOpacity: 0, color: "red"});
    allowedRegion.addTo(map);
    showWeatherAndZoom(allowedRegion);
    placeEditor.setClippingRectangle(allowedRegion);
  });

  fetchPlaces();

});
