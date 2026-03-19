/*--------------------------------------------------------------------
Initializing map
--------------------------------------------------------------------*/
// Mapbox Token
mapboxgl.accessToken = 'pk.eyJ1IjoibmFkaW5lY29uc3VuamkiLCJhIjoiY21rZWU1djI4MDV6NTNkb29meTJzMW81dSJ9.t6RLssyQkfZODRIMy_ToNQ';

// Mapbox Token (default public) - added by Daniel
// mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsODEwMTciLCJhIjoiY21rZWI2eGg4MDU5NjNscHdxbjhkMTNmciJ9.jdsMukp7zHz3llySNBJs0A';

// Center coordinates for map on load and zoom change(to change, refer to https://labs.mapbox.com/location-helper)
// FIX COORDINATES FOR EAST, WEST, AND SOUTH
const center = [22.34868, -0.31974];
const centerEast = [-2.6, 40.3];
const centerWest = [12.9, -1.7];
const centerNorth = [17.5, 19.5];
const centerSouth = [-17.9, 24.9];
const zoom = 2.6;
const minZoom = 2.3;
const maxZoom = 3.0;

// Initialize map and edit to your preference
const map = new mapboxgl.Map({
    container: 'my-map', // container id in HTML
    style: 'mapbox://styles/nadineconsunji/cmmbdfg9r007x01ryckrx8rx8',
    center: center,  // starting point, longitude/latitude - SEE LINES 10-11
    zoom: zoom, // starting zoom level - SEE LINE 10, 12
    minZoom: minZoom,
    maxZoom: maxZoom
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
            center: e.features[0].geometry.coordinates,
            zoom: 15
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

const theme_colours = ['#c2e699', '#78c679', '#31a354', '#006837', '#004529'];

// Add and visualize data layers

map.on('load', () => {

    // Composite index layer

    map.addSource('composite_index', {
        type: 'geojson',
        data: 'data/energy_index.geojson'
    });

    const composite_stops = [21, 33, 45, 57, 69];

    map.addLayer({
        id: 'composite_index_layer',
        type: 'fill',
        source: 'composite_index',
        visibility: 'visible',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'], ['get', 'composite_index'],
                composite_stops[0], theme_colours[0],
                composite_stops[1], theme_colours[1],
                composite_stops[2], theme_colours[2],
                composite_stops[3], theme_colours[3],
                composite_stops[4], theme_colours[4]
            ],
            'fill-opacity': 0.75
        }
    });

    composite_stops.forEach((stop, i) => {
        document.getElementById(`stop_${i}`).textContent = stop;
    });

    // Transition readiness layer

    map.addSource('transition_readiness', {
        type: 'geojson',
        data: 'data/energy_index.geojson'
    });

    const readiness_stops = [5, 13.5, 22, 30.5, 39];

    map.addLayer({
        id: 'transition_readiness_layer',
        type: 'fill',
        source: 'transition_readiness',
        visibility: 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'], ['get', 'transition_readiness'],
                readiness_stops[0], theme_colours[0],
                readiness_stops[1], theme_colours[1],
                readiness_stops[2], theme_colours[2],
                readiness_stops[3], theme_colours[3],
                readiness_stops[4], theme_colours[4]
            ],
            'fill-opacity': 0.75
        }
    });

    // System performance layer

    map.addSource('system_performance', {
        type: 'geojson',
        data: 'data/energy_index.geojson'
    });

    const performance_stops = [21, 26.5, 32, 37.5, 43];

    map.addLayer({
        id: 'system_performance_layer',
        type: 'fill',
        source: 'system_performance',
        visibility: 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'], ['get', 'system_performance'],
                performance_stops[0], theme_colours[0],
                performance_stops[1], theme_colours[1],
                performance_stops[2], theme_colours[2],
                performance_stops[3], theme_colours[3],
                performance_stops[4], theme_colours[4]
            ],
            'fill-opacity': 0.75
        }
    });

    // Legend

    function updateLegend(stops_variable) {
        document.getElementById('stop_0').textContent = stops_variable[0];
        document.getElementById('stop_1').textContent = stops_variable[1];
        document.getElementById('stop_2').textContent = stops_variable[2];
        document.getElementById('stop_3').textContent = stops_variable[3];
        document.getElementById('stop_4').textContent = stops_variable[4];
    }

    // Toggle layers off and on

    const layers = ['composite_index_layer', 'transition_readiness_layer', 'system_performance_layer']

    function handleData() {

        var selectedData = document.getElementById("selections").value;
        layers.forEach(layer => { map.setLayoutProperty(layer, 'visibility', 'none') });

        if (selectedData == 'composite') {
            updateLegend(composite_stops);
            map.setLayoutProperty('composite_index_layer', 'visibility', 'visible');
        } else if (selectedData == 'readiness') {
            updateLegend(readiness_stops);
            map.setLayoutProperty('transition_readiness_layer', 'visibility', 'visible');
        } else if (selectedData == 'performance') {
            updateLegend(performance_stops);
            map.setLayoutProperty('system_performance_layer', 'visibility', 'visible');
        }
    };

    // Event listener to trigger change

    document.getElementById("selections").addEventListener("change", handleData);

    // Filter by region

    function handleRegions() {
        var selectedRegion = document.getElementById("regions").value;

        layers.forEach(layer => {
            if (selectedRegion == 'all') {
                map.setFilter(layer, null);
            } else {
                map.setFilter(layer, ['==', ['get', 'region'], selectedRegion]);
            }
        });

        // Fly to selected region

        if (selectedRegion == 'all') {
            map.flyTo({
                center: center,
                zoom: minZoom
            });
        } else if (selectedRegion == 'east') {
            map.flyTo({
                center: centerEast,
                zoom: maxZoom
            });
        } else if (selectedRegion == 'west') {
            map.flyTo({
                center: centerWest,
                zoom: maxZoom
            });
        } else if (selectedRegion == 'north') {
            map.flyTo({
                center: centerNorth,
                zoom: maxZoom
            });
        } else if (selectedRegion == 'south') {
            map.flyTo({
                center: centerSouth,
                zoom: maxZoom
            });
        } else if (selectedRegion == 'central') {
            map.flyTo({
                center: center,
                zoom: maxZoom
            });
        };
    };

    // Event listener to trigger change

    document.getElementById("regions").addEventListener("change", handleRegions);

    // Popups

    const energy_popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    layers.forEach(layer => {
        map.on('mouseenter', layer, function (e) {

            map.getCanvas().style.cursor = 'pointer';

            const coordinates = e.lngLat;
            const ind = e.features[0].properties.composite_index;
            const read = e.features[0].properties.transition_readiness;
            const perf = e.features[0].properties.system_performance;

            energy_popup
                .setLngLat(coordinates)
                .setHTML(`
                <strong>Composite Index: ${ind}</strong><br>
                <strong>Transition Readiness: ${read}</strong><br>
                <strong>System Performance: ${perf}</strong><br>
                <strong>Click to zoom in</strong>
                `)
                .addTo(map);
        });

        map.on('mouseleave', layer, function () {

            map.getCanvas().style.cursor = '';
            energy_popup.remove();

        });
    });

    // Zoom to country - commenting out because it doesn't work yet

    /* layers.forEach(layer => {
        map.on('click', layer, (e) => {
            const feature = e.features[0];
 
            const bounds = new mapboxgl.LngLatBounds();
 
            const coords = normalizeCoords(feature.geometry);
 
            coords.forEach(polygon => {
                polygon.forEach(ring => {
                    ring.forEach(coord => bounds.extend(coord));
                });
            });
 
            map.fitBounds(bounds, {
                padding: 40,
                duration: 1000
            });
        });
    }); */

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