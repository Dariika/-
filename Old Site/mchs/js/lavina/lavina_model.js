let currentMarker = L.marker([0, 0])
let polyline = null;
let polyline2 = null;
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
    exp([e.latlng.lat, e.latlng.lng]);
}

function choosePath(response){
    let data = response["data"];
    if(tracedPath.length == 0){
        tracedPath.push(data[1][1]);
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
        polyline = L.polyline(tracedPath.map((point) => point.coords), {color: 'red'});
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

$("#calculate-current").click(function(){
    getElevation(currentPlace.heighest_point.coordinates, choosePath, function(error){
        console.log(error);
    }); 
});

function exp(coords){
    let fraction = $("#fraction").val();
    if(polyline2 != null){
        map.removeLayer(polyline2);
        polyline = null;
    }
    elevationExp(coords, fraction, function(data){
        if(data[1].length == 0){
            alert("Нет данных");
            return;
        }
        coords = [data[0][0]]
        polyline2 = L.polyline(coords, {color: 'magenta'});
        polyline2.addTo(map);
        schedule_timer(1, data, coords, polyline2);

    }, function(error){
        alert("Ошибка!");
    });
}

$("#exp").click(function(){
    exp(currentPlace.heighest_point.coordinates);
});

function schedule_timer(i, data, coords, polyline){
    if(data[1].length < i)
        return;
    coords.push(data[0][i]);
    let info = data[1][i-1];
    let fps = 1000 / 60;
    let speedCoff = 0.01;
    let frames = Math.round(info.time * speedCoff * 1000 / fps);
    if(frames == 0){
        let timerId = setTimeout(function (){
            coords[coords.length-1] = data[0][i];
            polyline.setLatLngs(coords);
            schedule_timer(++i, data, coords, polyline);
        }, fps);
        return;
    }
    let deltaX = (data[0][i][0] - data[0][i - 1][0]) * 10000 / frames;
    let deltaY = (data[0][i][1] - data[0][i - 1][1]) * 10000/ frames;
    let frameCounter = 0;
    let timerId = setTimeout(function drawFrame(){
        coords[coords.length-1][0] = (deltaX*frameCounter + data[0][i - 1][0] * 10000) / 10000;
        coords[coords.length-1][1] = (deltaY*frameCounter + data[0][i - 1][1] * 10000) / 10000;
        polyline.setLatLngs(coords);
        frameCounter++;
        if(frameCounter < frames){
            timerId = setTimeout(drawFrame, fps);
        }
        else{
            clearTimeout(timerId);
            schedule_timer(++i, data, coords, polyline);
        }
    }, fps);
}

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
    if(polyline2 != null){
        map.removeLayer(polyline2);
        polyline2 = null;
    }
}

$("#clear-downhill-marker").click(function(){
   clearMap();
});
