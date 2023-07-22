/* eslint-disable*/
const locations = JSON.parse(document.getElementById('map').dataset.locations);

let map = L.map('map', {
  zoomControl: false,
  scrollWheelZoom: false,
});

L.control
  .zoom({
    position: 'topright',
  })
  .addTo(map);

L.tileLayer(
  'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
  {
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  },
).addTo(map);

const coordArr = locations.map((el) => [el.coordinates[1], el.coordinates[0]]);

map.fitBounds(coordArr, { padding: [150, 150] });

const pin = L.icon({
  iconUrl: '/img/pin.png',
  iconAnchor: [16, 40],
  className: 'marker',
});
locations.push(locations.shift());
locations.forEach((loc, i) => {
  const marker = L.marker([loc.coordinates[1], loc.coordinates[0]], {
    icon: pin,
  }).addTo(map);

  marker
    .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
      className: 'mapboxgl-popup-content',
      offset: [0, -25],
      // autoClose: false,
    })
    .openPopup();
});
