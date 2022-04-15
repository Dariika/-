class PlaceEditor{
  
    constructor (map, 
                 onAddHandler, 
                 onUpdateHandler = null, 
                 onDeleteHandler = null,
                 clippingRectangle = null){
        this.polygonCoords = [];
        this.markers = [];
        this.currentPoly = L.polygon(this.polygonCoords, {interactive: false, color: 'blue'});
        this.closePolygon = false;
        this.mode = "";
        this.map = map;
        this.clippingRectangle = clippingRectangle;
        this.onAddHandler = onAddHandler;
        this.onUpdateHandler = onUpdateHandler;
        this.onDeleteHandler = onDeleteHandler;
        this._a = this.__addMoveHandler.bind(this);
        this._b = this.__addClickHandler.bind(this);
        this._c = this.__addRightClick.bind(this);
        this._d = this.__defaultMoveHandler.bind(this);
        this._markerClick = this.__markerOnClick.bind(this);
        this.currentIndex = -1;
        this.editing = false;
    }

    clearPoly(){
        if(this.map.hasLayer(this.currentPoly)){
            this.map.removeLayer(this.currentPoly);
        }
        this.polygonCoords = [];
        this.currentPoly.setLatLngs(this.polygonCoords);
        this.editing = true;
    }

    isPolyDone(){
        return !this.editing && this.currentPoly.getLatLngs()[0].length > 3;
    }

    startAdd(){
        this.mode = "add";
        this.markers.push(L.circleMarker([0, 0]));
        this.markers[0].addTo(map);
        this.currentIndex = 0;
        this.clearPoly();
        this.__installHandlers(this.mode);
    }

    startEdit(polygon){
        this.mode = "update";
        this.polygonCoords = polygon.getLatLngs();
        this.currentPoly = polygon;
        this.__createMarkers(polygon);
    }

    __installHandlers(mode){
        this.map.on('mousemove', this._a);
        this.map.on('click', this._b);
        this.map.on('contextmenu', this._c);
    }

    __removeHandlers(mode){
        this.map.off('mousemove', this._a);
        this.map.off('click', this._b);
        this.map.off('contextmenu', this._c);
    }

    __removeEditHandlers(marker){
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
            this.__removeEditHandlers(e.target);
        }
        else{
            e.target.setStyle({color: 'red'});
            this.currentIndex = index;
            console.log(this.currentIndex);
            this.map.on('mousemove', this._d);
            this.map.on('contextmenu', this._c);
        }
    }

    __createMarkers(polygon){
        for(const coords of polygon.getLatLngs()){
            let marker = L.circleMarker(coords);
            marker.addTo(this.map);
            marker.on('click', this._markerClick);
            this.markers.push(marker);
        }
    }

    __defaultMoveHandler(e){
        let coords = [e.latlng.lat, e.latlng.lng]
        this.markers[this.currentIndex].setLatLng(coords);
        if(this.polygonCoords.length > 1){
            this.polygonCoords[this.currentIndex] = coords;
            this.currentPoly.setLatLngs(this.polygonCoords);
        }
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

    __stopEditing(){
        for(const marker of this.markers){
            this.map.removeLayer(marker);
        }
        this.markers = [];
        this.editing = false;
        return this.currentPoly;
    }

    __addClickHandler(e){

        if(this.clippingRectangle != null && 
           !this.clippingRectangle.getBounds().contains(e.latlng)){
            return;
        }

        if(this.closePolygon){
            this.__removeHandlers(this.mode);
            this.polygonCoords.pop();
            this.onAddHandler(this.__stopEditing());
        }
        else{
            let marker = L.circleMarker(e.latlng);
            marker.addTo(this.map);
            this.markers.push(marker);
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
                this.__removeEditHandlers(currentMarker);
                this.currentIndex = -1;
            }
            this.currentPoly.setLatLngs(this.polygonCoords);
        }
    }

}