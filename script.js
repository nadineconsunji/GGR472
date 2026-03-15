/*--------------------------------------------------------------------
Initializing map
--------------------------------------------------------------------*/
// Mapbox Token (default public)
mapboxgl.accessToken = 'pk.eyJ1IjoibmFkaW5lY29uc3VuamkiLCJhIjoiY21rZWU1djI4MDV6NTNkb29meTJzMW81dSJ9.t6RLssyQkfZODRIMy_ToNQ'; 

// Initialize map and edit to your preference
const map = new mapboxgl.Map({
    container: 'my-map', // container id in HTML
    style: 'mapbox://styles/nadineconsunji/cmmbdfg9r007x01ryckrx8rx8', 
    center: [-79.37, 43.715],  // starting point, longitude/latitude
    zoom: 10.3 // starting zoom level
});

/*--------------------------------------------------------------------
Adding sources and layers
--------------------------------------------------------------------*/
map.on('load', () => {
    // Resize map accordingly if browser size is changed/minimised 
    map.resize();
});

/*--------------------------------------------------------------------
Adding map controls 
--------------------------------------------------------------------*/
// Search control 
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        countries: "ca" // CHANGE
    })
);

// Add zoom and rotation controls to the top left of the map
map.addControl(new mapboxgl.NavigationControl());

// Add fullscreen option to the map
map.addControl(new mapboxgl.FullscreenControl());

/*--------------------------------------------------------------------
Adding interactivity 
--------------------------------------------------------------------*/

// 1) Add event listener which returns map view to original view on button click using flyTo method
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-79.37, 43.7], // CHANGE COORDINATES HERE
        zoom: 10.5, // CHANGE ZOOM LEVEL HERE
        essential: true
    });
});

// 2) Filter data layer to show selected region of Africa 
let boundaryvalue;

document.getElementById("boundaryfieldset").addEventListener('change',(e) => {   
    boundaryvalue = document.getElementById('boundary').value;

    if (boundaryvalue == 'All') {
        map.setFilter(
            'bikeshare-fill', // CHANGE
            ['has', 'AREA_NAME'] // CHANGE AREA_NAME TO RELEVANT FIELD 
        );
    } else {
        map.setFilter(
            'bikeshare-fill', // CHANGE
            ['==', ['get', 'AREA_NAME'], boundaryvalue] // CHANGE AREA_NAME AND boundaryvalue
        );
    }

});