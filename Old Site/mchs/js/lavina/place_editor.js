class PlaceEditor{
  
    constructor (map, 
                 onAddHandler){
        this.polygonCoords = [];
        this.markers = [];
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
        this.markers.push(L.circleMarker([0, 0]));
        this.markers[0].addTo(map);
        this.markers[0].bindTooltip(`0`, {'offset': [10,0]}).openTooltip();
        this.currentIndex = 0;
        this.__installHandlers();
    }

    startEdit(polygon){
        this.mode = "update";
        this.polygonCoords = polygon.getLatLngs()[0].map(value => [value.lat, value.lng]);
        this.currentPoly.setLatLngs(this.polygonCoords);
        this.__createMarkers();
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
        this.map.off('contextmenu', this._c);
    }

    __markerOnClick(e){

        if(this.clippingRectangle != null && 
            !this.clippingRectangle.getBounds().contains(e.latlng)){
             return;
        }

        let index = this.markers.indexOf(e.target);
        if(this.currentIndex == index){
            e.target.setStyle({color: 'blue'});
            this.__removeHandlers();
        }
        else{
            e.target.setStyle({color: 'red'});
            this.currentIndex = index;
            this.map.on('mousemove', this._d);
            this.map.on('contextmenu', this._c);
        }
    }

    __createMarkers(){
        for(let latlng of this.polygonCoords){
            let marker = L.circleMarker(latlng);
            marker.addTo(this.map);
            marker.on('click', this._markerClick);
            marker.bindTooltip(this.__coordsToStr({lat: latlng[0], lng: latlng[1]}),{'offset': [10,0]});
            this.markers.push(marker);
        }
    }

    __defaultMoveHandler(e){
        let coords = [e.latlng.lat, e.latlng.lng]
        this.markers[this.currentIndex].setLatLng(coords);
        this.markers[this.currentIndex].setTooltipContent(this.__coordsToStr(e.latlng));
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
        // todo
        if(this.polygonCoords.length > 2 &&
            e.latlng.distanceTo(this.polygonCoords[0]) < 50){
            this.closePolygon = true;
            this.markers[this.markers.length - 1].setStyle({color: 'red'});
        }
        else{
            this.closePolygon = false;
            this.markers[this.markers.length - 1].setStyle({color: 'blue'});
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
            let marker = L.circleMarker(e.latlng);
            marker.bindTooltip(this.__coordsToStr(e.latlng),{'offset': [10,0]}).openTooltip();
            marker.addTo(this.map);
            this.markers.push(marker);
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
            }
            else{
                this.__removeHandlers();
                this.currentIndex = -1;
            }
            this.currentPoly.setLatLngs(this.polygonCoords);
        }
    }

}