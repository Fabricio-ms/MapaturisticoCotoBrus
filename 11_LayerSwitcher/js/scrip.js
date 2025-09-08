async function cargaGeojson(url){
    try {
        const respuesta = await fetch(url)
        if(!respuesta.ok){
            throw new Error(`Error al cargar ${url}: ${respuesta.statusText}`);
        }
        return respuesta.json()
    } 
    catch (error) {
        console.error("Error cargando Geojson:",error);
        return null;
    }
}

async function cargarDatos(){
    try {
        const [
            datosaeropuertos,
            datosdensidad,
            datoscarreteras,
            datosferrocarriles,
            datosrios,
            datosparques,
            datosreservasmarinas
        ] = await Promise.all([
            cargaGeojson('./data/geojson/aeropuertos.geojson'),
            cargaGeojson('./data/geojson/densidad.geojson'),
            cargaGeojson('./data/geojson/carreteras.geojson'),
            cargaGeojson('./data/geojson/ferrocarriles.geojson'),
            cargaGeojson('./data/geojson/rios.geojson'),
            cargaGeojson('./data/geojson/parques.geojson'),
            cargaGeojson('./data/geojson/reservas_marinas.geojson')
        ])

        inicializarMapa(
            datosaeropuertos,
            datosdensidad,
            datoscarreteras,
            datosferrocarriles,
            datosrios,
            datosparques,
            datosreservasmarinas
        )
    } catch (error) {
        console.error("Error en la carga de datos", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarDatos);

function inicializarMapa( datosProvincias,
    datosaeropuertos,
    datosdensidad,
    datoscarreteras,
    datosferrocarriles,
    datosrios,
    datosparques,
    datosreservasmarinas
) {
    // Lógica para inicializar el mapa con las capas cargadas
    const map = L.map("map").setView([8.820282, -82.972441], 10)

    const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}.{x}/{y}.png", {
        attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
    }).addTo(map)

    const satelite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: "ESRI"
    });

    function getColordensidad(d){
        return d > 100 ? "#800026" :
               d > 50  ? "#BD0026" :
               d > 20  ? "#E31A1C" :
               d > 10  ? "#FC4E2A" :
               d > 5   ? "#FD8D3C" :
               d > 2   ? "#FEE08B" :
                          "#FFEDA0";
    }
    function estilodensidad(feature){
        return {
            fillColor: getColordensidad(feature.properties.densidad),
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.5
        }
    }
    function getColorPoblacion(d){
        return d > 1500000 ? "#800026" :
               d > 1000000 ? "#BD0026" :
               d > 500000  ? "#E31A1C" :
               d > 200000  ? "#FC4E2A" :
               d > 100000  ? "#FD8D3C" :
               d > 50000   ? "#FEE08B" :
                             "#FFEDA0";
    }
    function estilopoblacion(feature){
        return {
            fillColor: getColorPoblacion(feature.properties.poblacion),
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: "3",
            fillOpacity: 0.7
        };
    }

    function estiloCarreteras(feature) {
        return {
            color: feature.properties.tipo === "principal" ? "#FF0000" : "#0000FF",
            weight: feature.properties.tipo === "principal" ? 3 : 2,
            opacity: 0.8
        };
    }

    function estiloferrocarriles(feature) {
        return {
            color: "#000000",
            weight: 2,
            opacity: 0.8,
            dashArray: "5,5"
        };
    }

    function estiloaeropuertos(feature) {
        return {
            radius: 5,
            fillColor: "#3388ff",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
    }

    function estilorios(feature) {
        return {
            color: "#0000FF",
            weight: 1.5,
            opacity: 0.7
        }
    }

    function estilosparques(feature) {
        return {
            fillColor: "#00FF00",
            weight: 1,
            opacity: 1,
            color: '#006400',
            fillOpacity: 0.5
        };
    }

    function estilosreservasmarinas(feature) {
        return {
            fillColor: "#00FFFF",
            weight: 1,
            opacity: 1,
            color: '#008080',
            fillOpacity: 0.5
        };
    }

  const provinciasLayer = L.geoJSON(datosProvincias,{
            style: estiloPoblacion,
            onEachFeature: function(feature, layer){
                layer.bindPopup(`<b>${feature.properties.nombre}</b><br>Población: ${feature.properties.poblacion.toLocaleString()} habitantes<br>Área: ${feature.properties.area_km2.toLocaleString()} km²`)
            }
        })
        const densidadLayer = L.geoJSON(datosDensidad, {
            style: estiloDensidad,
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`<b>${feature.properties.nombre}</b><br>Densidad: ${feature.properties.densidad} hab/km²`);
            }
        });
    
        const carreterasLayer = L.geoJSON(datosCarreteras, {
            style: estiloCarreteras,
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`<b>${feature.properties.nombre}</b><br>Tipo: ${feature.properties.tipo}`);
            }
        });
    
        const ferrocarrilesLayer = L.geoJSON(datosFerrocarriles, {
            style: estiloFerrocarriles,
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`<b>${feature.properties.nombre}</b>`);
            }
        });
    
        // Para los aeropuertos, usamos pointToLayer para crear marcadores
        const aeropuertosLayer = L.geoJSON(datosAeropuertos, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, estiloAeropuertos(feature));
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`<b>${feature.properties.nombre}</b>`);
            }
        });
    
        const riosLayer = L.geoJSON(datosRios, {
            style: estiloRios,
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`<b>${feature.properties.nombre}</b>`);
            }
        });
    
        const parquesLayer = L.geoJSON(datosParques, {
            style: estiloParques,
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`<b>${feature.properties.nombre}</b><br>Área: ${feature.properties.area_km2.toLocaleString()} km²`);
            }
        });
    
        const reservasMariasLayer = L.geoJSON(datosReservasMarinas, {
            style: estiloReservas,
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`<b>${feature.properties.nombre}</b><br>Área: ${feature.properties.area_km2.toLocaleString()} km²`);
            }
        });

        const basemap = {
            "Open Street Map": osm,
            "Satelite": satellite
        }

        const overlayMap = {
            "Demografia":{
                "Poblacion": provinciasLayer,
                "Densidad": densidadLayer
            },
            "Infraestructura": {
                "Carreteras": carreterasLayer,
                "Ferrocarriles": ferrocarrilesLayer,
                "Aeropuertos": aeropuertosLayer
            },
            "Medio Natural": {
                "Rios": riosLayer,
                "Parques": parquesLayer,
                "Reservas Marinas": reservasMariasLayer
            }
        }

        const options = {
            //collapsed: false,
            exclusiveGroups: ["Demografia"],
            groupCheckboxes: true
        }

        L.control.groupedLayers(basemap,overlayMap, options).addTo(map)

  }