const map = L.map("map").setView([8.822356, -82.972920], 13);

//Añadimos capas base
const baseLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Nuevo control

var CenterControl = L.control.extend({
    options: {
        position: "topleft"
    },
     onAdd: function(map){
        var container = L.DomUtil.create("div","")

        container.style.backgroundColor = "white"
        container.style.width = "30px"
        container.style.height = "30px"
        container.innerHTML = "<span style='font-size: 20px; line-height: 30px; text-align: center; display: block;'>🔧</span>"

        L.DomEvent.disableClickPropagation(container)

        container.onclick = function(){
            map.setView([8.822356, -82.972920], 18);
        }

        return container;
    }
})

map.addControl(new CenterControl());