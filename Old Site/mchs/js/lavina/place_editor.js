class PlaceEditor{
  
    constructor (map, 
                 onAddHandler){
        this.polygonCoords = [];
        this.markers = [];
        this.currentMarker = null;
        this.currentPoly = L.polygon(this.polygonCoords, {interactive: false, color: 'blue'});
        this.closePolygon = false;
        this.mode = "";
        this.map = map;
        this.clippingRectangle = null;
        this.onAddHandler = onAddHandler;
        this._a = this.__addMoveHandler.bind(this);
        this._b = this.__addClickHandler.bind(this);
        this._c = this.__addRightClick.bind(this);
        this._d = this.__defaultMoveHandler.bind(this);
        this._edit = this.__editMoveHandler.bind(this);
        this.__editClick = this.__editClickHandler.bind(this);
        this.__onMarkerMove = this.__markerMove.bind(this);
        this._markerClick = this.__markerOnClick.bind(this);
        this.currentIndex = -1;
        this.editing = false;
    }

    setClippingRectangle(rectangle){
        this.clippingRectangle = rectangle;
    }

    stopEditing(){
        for(const marker of this.markers){
            this.map.removeLayer(marker);
        }
        this.currentMarker = null;
        this.map.removeLayer(this.currentPoly);
        let coords = this.polygonCoords;
        this.polygonCoords = [];
        this.currentPoly.setLatLngs(this.polygonCoords);
        this.__removeHandlers();
        this.markers = [];
        this.polygonCoords = [];
        this.editing = false;
        return coords;
    }

    isPolyDone(){
        return !this.editing && this.currentPoly.getLatLngs()[0].length > 3;
    }

    startAdd(){
        this.mode = "add";
        this.stopEditing();
        this.markers.push(this.__createMarker(0, 0));
        this.currentMarker = this.markers[0];
        this.currentMarker.getTooltip().openTooltip();
        this.currentIndex = 0;
        this.__installHandlers();
    }

    startEdit(polygon){
        this.mode = "update";
        this.polygonCoords = polygon.getLatLngs()[0].map(value => [value.lat, value.lng]);
        this.currentPoly.setLatLngs(this.polygonCoords);
        this.__createMarkers();
        this.map.on('mousemove', this._edit);
        this.currentPoly.addTo(this.map);
    }

    __installHandlers(){
        this.map.on('mousemove', this._a);
        this.map.on('click', this._b);
        this.map.on('contextmenu', this._c);
    }

    __removeHandlers(){
        this.map.off('mousemove', this._a);
        this.map.off('click', this._b);
        this.map.off('contextmenu', this._c);
        this.currentIndex = -1;
        this.map.off('mousemove', this._d);
        this.map.off('mousemove', this._edit);
        this.map.off('contextmenu', this._c);
    }

    __markerOnClick(e){

        if(this.clippingRectangle != null && 
            !this.clippingRectangle.getBounds().contains(e.latlng)){
             return;
        }

        if(this.currentMarker == e.target){
            e.target.setStyle({color: 'blue'});
            this.__removeHandlers();
            this.map.on('mousemove', this._edit);
            this.currentMarker = null;
            this.currentIndex = -1;
        }
        else{
            e.target.setStyle({color: 'red'});
            this.currentMarker = e.target;
            this.currentIndex = this.markers.indexOf(e.target);
            this.map.off('mousemove', this._edit);
            this.map.on('mousemove', this._d);
            this.map.on('contextmenu', this._c);
        }
    }

    __createMarker(lat, lng){
        let marker = L.circleMarker([lat, lng], {color: 'blue'});
        marker.addTo(this.map);
        marker.bindTooltip(this.__coordsToStr({'lat': lat, 'lng': lng}), {'offset': [10,0]});
        return marker;
    }

    
    __createMarkers(){
        for(let latlng of this.polygonCoords){
            let marker = this.__createMarker(latlng[0], latlng[1]);
            marker.on('click', this._markerClick);
            this.markers.push(marker);
        }
    }

    __markerMove(e){
        let coords = [e.latlng.lat, e.latlng.lng]
        this.currentMarker.setLatLng(coords);
        this.currentMarker.setTooltipContent(this.__coordsToStr(e.latlng));
        return coords;
    }

    __defaultMoveHandler(e){
        let coords = this.__markerMove(e);
        if(this.polygonCoords.length > 1){
            this.polygonCoords[this.currentIndex] = coords;
            this.currentPoly.setLatLngs(this.polygonCoords);
        }
    }

    __coordsToStr(latlng, n=5){
        // округление до n знаков после запятой
        let f = Math.pow(10, n);
        return `${Math.round(latlng.lat*f)/f}, `+
               `${Math.round(latlng.lng*f)/f}`;
    }

    __addMoveHandler(e){
        this.__defaultMoveHandler(e);
        if(this.polygonCoords.length > 2 &&
            this.map.latLngToLayerPoint(L.latLng(this.polygonCoords[0]))
            .distanceTo(this.map.latLngToLayerPoint(e.latlng)) <= 20){
            this.closePolygon = true;
            this.markers[this.markers.length - 1].setStyle({color: 'red'});
        }
        else{
            this.closePolygon = false;
            this.markers[this.markers.length - 1].setStyle({color: 'blue'});
        }
    }

    __removeCurrentMarker(){
        if(this.currentMarker != null){
            this.map.removeLayer(this.currentMarker);
            this.currentIndex = -1;
            this.currentMarker = null;
            this.map.off('mousemove', this.__onMarkerMove);
            this.map.off('click', this.__editClick);
        }
    }

    __editClickHandler(e){

        if(this.clippingRectangle != null && 
            !this.clippingRectangle.getBounds().contains(e.latlng)){
             return;
         }

        this.markers.splice(this.currentIndex, 0, this.currentMarker);
        this.polygonCoords.splice(this.currentIndex, 0, [e.latlng.lat, e.latlng.lng]);
        this.currentPoly.setLatLngs(this.polygonCoords);
        this.map.off('mousemove', this.__onMarkerMove);
        this.map.off('mousemove', this._edit);
        this.map.off('click', this.__editClick);
        this.currentMarker.on('click', this._markerClick);
        this.map.on('mousemove', this._d);
        this.map.on('contextmenu', this._c);

    }

    __editMoveHandler(e){

        if(!this.currentPoly.getBounds().contains(e.latlng)){
            this.__removeCurrentMarker();
            return;
        }

        let isOnLine = false;

        for(let i = 0; i < this.polygonCoords.length - 1; i++){

            let lineBounds = L.latLngBounds([
                [ Math.min(this.polygonCoords[i][0], this.polygonCoords[i+1][0]),
                  Math.min(this.polygonCoords[i][1], this.polygonCoords[i+1][1])],
                [ Math.max(this.polygonCoords[i][0], this.polygonCoords[i+1][0]),
                  Math.max(this.polygonCoords[i][1], this.polygonCoords[i+1][1])]
            ]);

            let p = L.point(this.polygonCoords[i+1]);
            let lineVector = p.subtract(this.polygonCoords[i]);
            let lineVectorL = Math.sqrt(lineVector.x*lineVector.x + lineVector.y*lineVector.y);

            if(lineBounds.contains(e.latlng)){
                  
                let currentVector = p.subtract([e.latlng.lat, e.latlng.lng]);
                let currentVectorL = Math.sqrt(currentVector.x*currentVector.x + currentVector.y*currentVector.y);
                let cos_angle = (lineVector.x*currentVector.x + lineVector.y*currentVector.y) / (lineVectorL * currentVectorL);

                if(1 - cos_angle <= 0.001){
                    isOnLine = true;
                    if(this.currentMarker != null){
                        continue;
                    }
                    let marker = this.__createMarker(e.latlng.lat, e.latlng.lng);
                    marker.setStyle({'color': 'red'});
                    marker.getTooltip().openTooltip();
                    this.currentIndex = i + 1;
                    this.currentMarker = marker;
                    this.map.on('mousemove', this.__onMarkerMove);
                    this.map.on('click', this.__editClick);
                    return;
                }
            }
        }

        if(!isOnLine){
            this.__removeCurrentMarker();
        }

    }


    __addClickHandler(e){

        if(this.clippingRectangle != null && 
           !this.clippingRectangle.getBounds().contains(e.latlng)){
            return;
        }

        if(this.closePolygon){
            this.polygonCoords.pop();
            this.map.removeLayer(this.markers.pop());
            this.__removeHandlers();
            this.mode = "update";
            for(let marker of this.markers){
                marker.on('click', this._markerClick);
            }
            this.onAddHandler();
        }
        else{
            let marker = this.__createMarker(e.latlng.lat, e.latlng.lng);
            marker.getTooltip().openTooltip();
            this.markers.push(marker);
            this.currentMarker = marker;
            this.markers[this.currentIndex].closeTooltip();
            this.polygonCoords.push([e.latlng.lat, e.latlng.lng]);
            if(this.polygonCoords.length == 1){
                this.currentPoly.addTo(this.map);
                this.polygonCoords.push([e.latlng.lat, e.latlng.lng]);
            }
            this.currentIndex = this.markers.length - 1;
        }
        this.currentPoly.setLatLngs(this.polygonCoords);
    }

    __addRightClick(){
        if(this.polygonCoords.length > 1){
            let currentMarker = this.markers.splice(this.currentIndex, 1)[0];
            this.map.removeLayer(currentMarker);
            this.polygonCoords.splice(this.currentIndex, 1)[0];
            if(this.polygonCoords.length == 1){
                this.polygonCoords.pop();
                this.map.removeLayer(this.currentPoly);
            }
            if(this.mode == 'add'){
                this.currentIndex = this.markers.length - 1;
                this.currentMarker = this.markers[this.currentIndex];
            }
            else{
                this.__removeHandlers();
                this.currentIndex = -1;
            }
            this.currentPoly.setLatLngs(this.polygonCoords);
        }
    }

}