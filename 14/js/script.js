//Inicializamos el mapa centrado en Coto Brus
var map = L.map('map').setView([8.794, -82.966], 13);

//Añadimos la capa base de OpenStreetMap
var osm =L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Contador de clics
var controlContador = L.control({position: "topright"})
controlContador.onAdd = function(map){
    this._div = L.DomUtil.create("div", "contador-clics");
    this.update(0)
    return this._div
}
controlContador.update = function(num){

    this._div.innerHTML = "Clics en el mapa:" + num;
}
controlContador.addTo(map);

var contadorclics = 0
map.on("click", function(e){
    contadorclics++
    controlContador.update(contadorclics)

    console.log("Clics en el mapa en:" + e.latlng.toString())
})

//Control para reiniciar contador
var controlReinicio = L.control({position: "topright"})
controlReinicio.onAdd = function(map){
    var div = L.DomUtil.create("div", "boton-destacado");
    div.innerHTML = "Reiniciar contador";
    div.style.marginTop = "10px";

    L.DomEvent.disableClickPropagation(div)
    L.DomEvent.on(div, "click", function(e){
        contadorclics = 0
        controlContador.update(contadorclics)
    })
    return div
}
controlReinicio.addTo(map)

var sitiosTuristicos = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "nombre": "Parque Coto Brus",
                "categoria": "histórico",
                "descripcion": "Parque central de Coto Brus."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-82.971264, 8.820011]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "nombre": "Plaza 500",
                "categoria": "cultural",
                "descripcion": "Centro comercial donde se ubican distintos locales."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-82.970745, 8.824421]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "nombre": "Mirador los pinos",
                "categoria": "natural",
                "descripcion": "Mirador con vistas panorámicas de la ciudad."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-82.963559, 8.820137]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "nombre": "Campo Ferial Coto Brus",
                "categoria": "cultural",
                "descripcion": "Lugar donde se realizan distintas actividades culturales de Coto Brus."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-82.973006, 8.824883]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "nombre": "Finca Cantaros",
                "categoria": "natural",
                "descripcion": "Finca donde se puede observar la flora y fauna local."
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-82.960764, 8.810865]
            }
        }
    ]
};

function getColor(categoria){
    return categoria === "natural" ? "#e41a1c" :
           categoria === "cultural" ? "#377eb8" :
           categoria === "histórico" ? "#ff7f00" :
           "#999999";
}

function estiloNormal(feature){
    return {
        radius: 8,
        fillColor: getColor(feature.properties.categoria),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }
}

function estiloHover(feature){
    return {
        radius: 12,
        fillColor: "#ffeb00",
        color: "#000",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.5
    }
}

// Variable para almacenar el sitio seleccionado actualmente
var sitioSeleccionado = null;

var capaSitios = L.geoJSON(sitiosTuristicos, {
    pointToLayer: function(feature, latlng){
        return L.circleMarker(latlng,estiloNormal(feature))
    },
    // ...existing code...
onEachFeature: function(feature, layer){
    // Mejoramos el contenido del popup con más información
    var contenidoPopup = `
        <div class="info-panel">
            <div class="titulo-sitio"><strong>${feature.properties.nombre}</strong></div>
            <div><b>Categoría:</b> ${feature.properties.categoria}</div>
            <div><b>Descripción:</b> ${feature.properties.descripcion}</div>
        </div>
    `;
    layer.bindPopup(contenidoPopup);

    //Eventos para interactividad
    layer.on("mouseover", function(e){
        this.setStyle(estiloHover(feature));
        this.openPopup();
    });
    layer.on("mouseout", function(e){
        this.setStyle(estiloNormal(feature));
        this.closePopup();
    });
}
}).addTo(map);