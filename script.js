const mapId = 'map';
const initialCoordinates = [37.38283, -5.97317]; 
const map = L.map(mapId).setView(initialCoordinates, 13);


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.marker(initialCoordinates).bindPopup("<b>Sevilla</b><br>Posición inicial del mapa").addTo(map);

const popup = L.popup()
    .setLatLng([37.38283, -5.97317])
    .setContent("Esto es Sevilla.")
    .openOn(map);

const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'


const success = (position)=> {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
}

const errorResponse = (error) => {
    if (error.code == 1) {
        alert("Error: Acceso denegado");
    } else if (error.code == 2) {
        alert("Error: La posición no está disponible");
    }
}

const locationFound = (evento) => {
    L.marker(evento.latlng).addTo(map)
        .bindPopup("Estás aquí.")
        .openPopup();
}
//map.flyTo('locationfound', locationFound);
map.on('locationfound', locationFound);
map.locate({ setView: true, maxZoom: 13 });

navigator.geolocation.getCurrentPosition(success, errorResponse)
  

const CallAPI = async () => {
    try {
        const response = await fetch(url)
        if (response.ok) {
            const data = await response.json()
            return data.features;
        }
    } catch (error) {
    }
}
const paintMap = async () => {
    const results = await CallAPI();
    results.forEach(element => {
        if(element.properties.mag>1){
            variable = mag0;
        const marker = L.marker([element.geometry.coordinates[1], element.geometry.coordinates[0]], `{icon: ${variable}}`).addTo(map);
        
        marker.bindPopup(`Título: ${element.properties.title},<br> Lugar: ${element.properties.place},<br> Tiempo: ${new Date(element.properties.time)},<br> Código: ${element.properties.code},<br> Magnitud: ${element.properties.mag} ${element.properties.magType}`);
    }});
}
const mag0 = L.icon({
    iconUrl: './assets/mag 0.png',
    shadowUrl: './assets/mag 0.png',
    iconSize:     [38, 95], 
    shadowSize:   [50, 64], 
    iconAnchor:   [22, 94], 
    shadowAnchor: [4, 62],  
    popupAnchor:  [-3, -76] 
});

paintMap()