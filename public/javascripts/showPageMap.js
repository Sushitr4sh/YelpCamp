mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/light-v10", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 15, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

const marker1 = new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `
        <h1 class="text-lg font-black">${campground.title}</h1>
        <p>${campground.location}</p>
      `,
    ),
  )
  .addTo(map);
