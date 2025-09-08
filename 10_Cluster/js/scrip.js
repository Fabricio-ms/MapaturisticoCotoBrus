
var map = L.map("map").setView([8.822356, -82.972920], 13);

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var locations = [
    [8.823378, -82.972224],
    [8.819638, -82.974671],
    [8.820900, -82.969101],
    [8.820529, -82.970656],
    [8.821271, -82.970914],
    [8.821475, -82.972374],
    [8.822830, -82.970921]
]

var markers = L.markerClusterGroup({
    maxClusterRadius: 80,
    iconCreateFunction: function(cluster){
        return L.divIcon({
            html: "<b>" + cluster.getChildCount() + "</b>",
            className: "marker-cluster",
            iconSize: L.point(40, 40)
        })
    }
})

locations.forEach(coord=>{
    var marker = L.marker(coord)
    //marker.addTo(map)
    markers.addLayer(marker)
});

map.addLayer(markers)
