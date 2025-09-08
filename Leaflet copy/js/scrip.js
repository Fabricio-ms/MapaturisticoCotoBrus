
var map = L.map("map", {
    center: [8.820282, -82.972441],
    zoom: 13,
    minZoom: 3,
    zoomControl: false
});

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var satelite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: 'ESRI'
}).addTo(map);

var marcadorCB = L.marker([8.820282, -82.972441]).addTo(map);

var marcadorPersonalizado = L.icon({
    iconUrl: "img/ambulance.png"
})
var marcadorPersonalizado = L.marker([8.822356, -82.972920], {
    icon: marcadorPersonalizado
}).addTo(map);

marcadorPersonalizado.bindPopup("Servicios de emergencia");

marcadorPersonalizado.bindTooltip("Servicios de emergencia", {
    permanent: false,
    direction: "top"
});

marcadorCB.bindTooltip("<b>Casa de la cultura</b><br>Municipalidad CB", {
    permanent: false,
    direction: "top"
});

marcadorCB.on("click", function(e){
    console.log("marcador clickeado", e.latlng)
})

var baseLayers = {
    "OpenStreetMap": osm,
    "Satelite": satelite
};
var iconR = L.icon({iconUrl:"img/restaurant.png"})
var restaurantes = L.layerGroup([
    L.marker([8.817963, -82.973516], {icon: iconR}).bindPopup("Restaurante1"),
    L.marker([8.821726, -82.974203], {icon: iconR}).bindPopup("Restaurante2"),
]);
var iconG = L.icon({iconUrl:"img/wi-fi-2.png"})
var gasolineras = L.layerGroup([
    L.marker([8.819869, -82.973393], {icon: iconG}).bindPopup("Rio Java"),
    L.marker([8.822842, -82.970965], {icon: iconG}).bindPopup("Trova")
]);

var overLayMaps = {
    "restaurantes": restaurantes,
    "gasolineras": gasolineras
};

osm.addTo(map);
restaurantes.addTo(map);

L.control.layers(baseLayers, overLayMaps, {
    collapsed: true,
}).addTo(map);

L.control.zoom({
    position: "topleft",
    zoomInText: '+',
    zoomOutText: '-',
    zoomInTitle: 'Acercar',
    zoomOutTitle: 'Alejar'
}).addTo(map);

L.control.scale({
    maxWidth: 100,
    position: "bottomleft",
    metric: true,
    imperial: false
}).addTo(map);

