mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v10', // style URL
    center: campground.geometry.coordinates,
    zoom: 9, // starting zoom
    // projection: 'globe' // display the map as a 3D globe
});
map.addControl(new mapboxgl.NavigationControl());
const marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 5})
        .setHTML(
            `<h3>${campground.title}</h3>`
        )
    )
    .addTo(map);