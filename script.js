/*--------------------------------------------------------------------
Initializing map
--------------------------------------------------------------------*/
// Mapbox Token
mapboxgl.accessToken = 'pk.eyJ1IjoibmFkaW5lY29uc3VuamkiLCJhIjoiY21rZWU1djI4MDV6NTNkb29meTJzMW81dSJ9.t6RLssyQkfZODRIMy_ToNQ'; 

// Mapbox Token (default public) - added by Daniel
// mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsODEwMTciLCJhIjoiY21rZWI2eGg4MDU5NjNscHdxbjhkMTNmciJ9.jdsMukp7zHz3llySNBJs0A';

// Center coordinates for map on load (to change, refer to https://labs.mapbox.com/location-helper)
const center = [22.13452, 7.67653]; // SET TO AFRICA

// Initialize map and edit to your preference
const map = new mapboxgl.Map({
    container: 'my-map', // container id in HTML
    style: 'mapbox://styles/nadineconsunji/cmmbdfg9r007x01ryckrx8rx8',
    center: center,  // starting point, longitude/latitude - SEE LINE 10-11
    zoom: 1.75 // starting zoom level
    // pitch: '', [CAN USE FOR 3D MAP VISUALIZATION] 
});

// Test center of map with marker (see lines 10-11) - check if below needs to be changed to add.To(my-map)
// new mapboxgl.Marker().setLngLat(center).addTo(map);

function toggleSidebar(leftsidebar) {

    let elem = document.getElementById(leftsidebar);
    let classes = elem.className.split(' ');
    let collapsed = classes.indexOf('collapsed') !== -1;

    let padding = {};

    if (collapsed) {

        // Developer comment: Remove the 'collapsed' class from the class list of the element, this sets it back to the expanded state.
        classes.splice(classes.indexOf('collapsed'), 1);

        padding[leftsidebar] = 300; // Developer comment: In px, matches the width of the sidebars set in .sidebar CSS class
        map.easeTo({
            padding: padding,
            duration: 1000 // Developer comment: In ms, CSS transition duration property for the sidebar matches this value
        });

    }

    else {

        padding[leftsidebar] = 0;
        // Developer comment: Add the 'collapsed' class to the class list of the element
        classes.push('collapsed');

        map.easeTo({
            padding: padding,
            duration: 1000
        });

    }

    // Developer comment: Update the class list on the element
    elem.className = classes.join(' ');

}

// Expands sidebar on map load (remove to keep closed on default load, change nested code to remove the "sliding" appearance)
map.on('load', function () {
    toggleSidebar('left');
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
        center: [-79.37, 43.7], // CHANGE COORDINATES HERE - "centre"
        zoom: 10.5, // CHANGE ZOOM LEVEL HERE - already corrected see lines 10-11
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