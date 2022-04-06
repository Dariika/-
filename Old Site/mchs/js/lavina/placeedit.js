let p = [];

function fetchPlaces(){
    getPlaces(function(data){
        p = data;
        $.each(p, function (i, place) {
            L.polygon(place.geometry.coordinates, { color: 'orange' }).addTo(map);
            updatePlacesList(place, i);
        });
    });
}

function updatePlacesList(place, index){
    var li = $('<li/>').appendTo('#list_avalanches');
    $('<option />')
        .text(place.name)
        .value(index)
        .on('change', function () { showAvalanche(index) })
    .appendTo("select");
}

fetchPlaces();

function showAvalanche(id) {
    map.setView(p[id].geometry.coordinates[0][0], 12);
    lat = p[id].geometry.coordinates[0][0][0];
    lon = p[id].geometry.coordinates[0][0][1];
    appkey = '5d20f14e98068a911f39ac24389c3aa5';
    title = p[id].name;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appkey}`).then(function (resp) { return resp.json() }).then(function (data) {
        document.querySelector('.weather__title').textContent = title;
        document.querySelector('.weather__forecast').innerHTML = Math.round(data.main.temp - 273) + '&deg;C';
        document.querySelector('.weather__icon').innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0]['icon']}@2x.png" width=50 height=50>`;
    })
        .catch(function () {
        //Обрабатываем ошибки
        });
}

let placeEditor = new PlaceEditor(map,
  function(polygon){
    $("#place-selected").show();
    $("#add-place-btn").val("Отметить заново");
    $("#submit-place-btn").attr('disabled', false);
});


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
