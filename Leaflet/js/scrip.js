
// const map = L.map('map').setView([8.820282, -82.972441], 13);

var map = L.map("map", {
    center: [8.820282, -82.972441],
    zoom: 13,
    minZoom: 3,
    zoomControl: false
});

var osm =L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var cartoDB = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    attribution: 'CARTO'
}).addTo(map);

var satelite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: 'ESRI'
}).addTo(map);

var marcadorCB = L.marker([8.820282, -82.972441]).addTo(map);

var iconoPersonalizado = L.icon({
    iconUrl: "img/ambulance.png"
})
var marcadorPersonalizado = L.marker([8.822356, -82.972920], {
    icon: iconoPersonalizado
}).addTo(map);

marcadorCB.bindTooltip("<b>Casa de la cultura</b><br>Municipalidad CB", {
    permanent: false,
    direction: "top"
});
marcadorCB.on("click", function(e){
    console.log("marcador clickeado", e.latlng)
})

marcadorPersonalizado.bindTooltip("Cruz roja San Vito", {
    permanent: false,
    direction: "top"
})

var baseMaps = ({
    "OpenStreetMap": osm,
    "Carto": cartoDB,
    "Satelite": satelite
}); 

L.control.layers(baseMaps, overLayMaps).addTo(map);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>Mapa Coto Brus</h4>';
}

info.addTo(map);

L.control.zoom({
    position: "topleft",
    zoomInText: "+",
    zoomOutText: "-",
    zoomInTitle: "Acercar",
    zoomOutTitle: "Alejar"
}).addTo(map);

L.control.scale({
    maxWidth: 100,
    metric: true,
    imperial: false,
    position: "bottomleft"
}).addTo(map);

var restaurantes = layerGroup([
    L.marker([8.817963, -82.973516]).bindPopup("Restaurante1"),
    L.marker([8.821726, -82.974203]).bindPopup("Restaurante2"),
   ]);

var gasolineras = L.layerGroup([
    L.marker([8.819869, -82.973393]).bindPopup("Rio Java"),
    L.marker([8.822842, -82.970965]).bindPopup("Trova")    
]);

var overLayMaps = {
    "restaurantes": restaurantes,
    "gasolineras": gasolineras
};

L.control.layers(baseMaps, overLayMaps).addTo(map);
