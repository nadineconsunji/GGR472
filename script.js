/*--------------------------------------------------------------------
Initializing map
--------------------------------------------------------------------*/
// Mapbox Token
mapboxgl.accessToken = 'pk.eyJ1IjoibmFkaW5lY29uc3VuamkiLCJhIjoiY21rZWU1djI4MDV6NTNkb29meTJzMW81dSJ9.t6RLssyQkfZODRIMy_ToNQ'; 

// Mapbox Token (default public) - added by Daniel
// mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsODEwMTciLCJhIjoiY21rZWI2eGg4MDU5NjNscHdxbjhkMTNmciJ9.jdsMukp7zHz3llySNBJs0A';

// Center coordinates for map on load and zoom change(to change, refer to https://labs.mapbox.com/location-helper)
const center = [22.34868, -0.31974];
const zoom = 2.6;

// Initialize map and edit to your preference
const map = new mapboxgl.Map({
    container: 'my-map', // container id in HTML
    style: 'mapbox://styles/nadineconsunji/cmmbdfg9r007x01ryckrx8rx8',
    center: center,  // starting point, longitude/latitude - SEE LINES 10-11
    zoom: zoom, // starting zoom level - SEE LINE 10, 12
    minZoom: 1.6,
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

// THIS IS A TEST (DELETE LATER)
map.on('load', () => {
    map.addSource('TESTdata', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/daniel81017/Lab2/refs/heads/main/TEST(DELETELATER).geojson',
    });

    map.addLayer({
        'id': 'testpoint',
        'type': 'circle',
        'source': 'TESTdata',
        'paint': {
            'circle-width': 100,
            'circle-color': '#22f513'
        },
        'filter': ['==', ['geometry-type'], 'Point'],
    });

    map.on('click', 'testpoint', (e) => {
        map.flyTo({
            center: e.features[0].geometry.coordinates, zoom: 15
        });
    });

    map.on('mouseenter', 'testpoint', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'testpoint', () => {
        map.getCanvas().style.cursor = '';
    });
});

/*--------------------------------------------------------------------
Adding sources and layers
--------------------------------------------------------------------*/

// Add and visualize data layers

    // Composite index layer
    
    map.addSource('comp_index', {
        type: 'geojson',
        data: 'data/energy_index.geojson'
    });

    map.addLayer({
        id: 'comp_index_layer',
        type: 'fill',
        source: 'comp_index',
        visibility: 'visible',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'], ['get', 'composite_index'],
                21, '#c2e699',
                33, '#78c679',
                45, '#31a354',
                57, '#006837',
                69, '#004529'
            ],
            'fill-opacity': 0.75
        }
    });

    document.getElementById('composite')
        .addEventListener('change', function (e) {

            if (e.target.checked) {
                map.setLayoutProperty(
                    'comp_index_layer',
                    'visibility',
                    'visible'
                );
            } else {
                map.setLayoutProperty(
                    'comp_index_layer',
                    'visibility',
                    'none'
                );
            }
        });

    // Transition readiness layer

    map.addSource('trans_readiness', {
        type: 'geojson',
        data: 'data/energy_index.geojson'
    });

    map.addLayer({
        id: 'trans_readiness_layer',
        type: 'fill',
        source: 'trans_readiness',
        visibility: 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'], ['get', 'transition_readiness'],
                5, '#c2e699',
                13.5, '#78c679',
                22, '#31a354',
                30.5, '#006837',
                39, '#004529'
            ],
            'fill-opacity': 0.75
        }
    });

    document.getElementById('readiness')
        .addEventListener('change', function (e) {

            if (e.target.checked) {
                map.setLayoutProperty(
                    'trans_readiness_layer',
                    'visibility',
                    'visible'
                );
            } else {
                map.setLayoutProperty(
                    'trans_readiness_layer',
                    'visibility',
                    'none'
                );
            }
        });

    // System performance layer

    map.addSource('sys_performance', {
        type: 'geojson',
        data: 'data/energy_index.geojson'
    });

    map.addLayer({
        id: 'sys_performance_layer',
        type: 'fill',
        source: 'sys_performance',
        visibility: 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'], ['get', 'system_performance'],
                21, '#c2e699',
                26.5, '#78c679',
                32, '#31a354',
                37.5, '#006837',
                43, '#004529'
            ],
            'fill-opacity': 0.75
        }
    });

    document.getElementById('performance')
        .addEventListener('change', function (e) {

            if (e.target.checked) {
                map.setLayoutProperty(
                    'sys_performance_layer',
                    'visibility',
                    'visible'
                );
            } else {
                map.setLayoutProperty(
                    'sys_performance_layer',
                    'visibility',
                    'none'
                );
            }
        });

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
        center: center, // LINES 10-11
        zoom: zoom, // LINE 10, 12
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