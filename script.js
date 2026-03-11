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