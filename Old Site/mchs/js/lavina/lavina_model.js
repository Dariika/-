let currentMarker = L.marker([0, 0])
let polyline = null;
let tracedPath = [];
let sameElevationCount = 0;

function onMove(e){
    currentMarker.setLatLng(e.latlng);
}

function onClick(e){
    map.off('mousemove', onMove);
    map.off('click', onClick);
    getElevation([e.latlng.lat, e.latlng.lng], choosePath, function(error){
        console.log(error);
    }); 
}

function choosePath(response){
    let data = response["data"];
    if(tracedPath.length == 0){
        tracedPath.push(data[1][1]);
    }
    else{
        // координаты точки, переданной в api 
        // и ее же координаты, вычисленные через api,
        // могут не совсем совпадать 
        // TODO: убрать когда будет 100% уверенность, что вычисление координат
        // работает всегда правильно
        let error = response["error"];
        if(error[0] > 0.0001 || error[1] > 0.0001){
            console.log("Notice: coords is slightly different");
        }
    }
    // находим самые нижние точки
    // на всякий случай, если все точки выше данной,
    // находим самую близкую точку к данной по высоте 
    let currentElevation = data[1][1]["elevation"];
    let heightDelta = currentElevation;
    let lowestPoints = [];
    let closestPoint = null;
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            // данные о высоте могут быть пусты
            if(data[i][j]["elevation"] == null){
                continue;
            }
            if(i != 1 && 
               j != 1){

               if(data[i][j]["elevation"] == currentElevation){
                    lowestPoints.push(data[i][j]);
               }

               if(Math.abs(data[i][j]["elevation"] - data[1][1]["elevation"]) < heightDelta){
                    heightDelta = Math.abs(data[i][j]["elevation"] - data[1][1]["elevation"]);
                    closestPoint = data[i][j];
                }

            }
            if(data[i][j]["elevation"] < currentElevation){
                lowestPoints = [];
                currentElevation = data[i][j]["elevation"];
                lowestPoints.push(data[i][j]);
            }
           
        }
    }

    // если все точки выше, чем текущая, то переходим к точке, ближайшей по высоте
    let nextPoint = null;
    if(lowestPoints.length == 0){
        nextPoint = closestPoint;
    } else {
        // иначе случайно выбираем одну из нижних точек
        nextPoint = lowestPoints[Math.floor(Math.random() * lowestPoints.length)];
    } 

    tracedPath.push(nextPoint);

    let delta = getDelta(tracedPath.length - 2);
    if(delta.elevationD <= 1){
        sameElevationCount++;
    }
    else{
        sameElevationCount = 0;
    }
    if(sameElevationCount > 10){
        polyline = L.polyline(tracedPath.map((point) => point.coords), {color: 'blue'});
        polyline.addTo(map);
        return;
    }

    $("#trace-status").text(`${tracedPath.length} точек загружено`);
    // рекурсия
    getElevation(nextPoint["coords"], choosePath, function(error){
        console.log(error);
    }); 
}

function getDelta(index){
    return {
        'elevationD': tracedPath[index]["elevation"] - tracedPath[index + 1]["elevation"],
        'latlngD': [tracedPath[index]["coords"][0] - tracedPath[index + 1]["coords"][0],
                    tracedPath[index]["coords"][1] - tracedPath[index + 1]["coords"][1]]
    };
}


$("#add-downhill-marker").click(function(){
    clearMap();
    currentMarker.addTo(map);
    map.on('mousemove', onMove);
    map.on('click', onClick);
});

function clearMap(){
    tracedPath = [];
    if(map.hasLayer(currentMarker)){
        map.removeLayer(currentMarker);
        currentMarker.setLatLng([0, 0]);
    }
    if(polyline != null){
        map.removeLayer(polyline);
        polyline = null;
    }
}

$("#clear-downhill-marker").click(function(){
   clearMap();
});
