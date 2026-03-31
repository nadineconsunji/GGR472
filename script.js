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
const maxZoom = 7.0;

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

const theme_colours = ['#25d0ff', '#00a6d4', '#026bc2', '#00457d', '#01145e'];

// Add and visualize data layers

map.on('load', () => {

    // Composite index layer

    map.addSource('energy', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/nadineconsunji/GGR472/main/data/energy_index.geojson',
        promoteId: 'OBJECTID'
    });

    const composite_stops = [21, 33, 45, 57, 69];

    map.addLayer({
        id: 'composite_index_layer',
        type: 'fill',
        source: 'energy',
        layout: {
            visibility: 'visible'
        },
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
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1,      // hovered country (fully visible)
                0.5     // all other countries (dimmed)
            ]
        }
    });

    composite_stops.forEach((stop, i) => {
        document.getElementById(`stop_${i}`).textContent = stop;
    });

    // Transition readiness layer

    const readiness_stops = [5, 13.5, 22, 30.5, 39];

    map.addLayer({
        id: 'transition_readiness_layer',
        type: 'fill',
        source: 'energy',
        layout: {
            visibility: 'none'
        },
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
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1,      // hovered country (fully visible)
                0.5     // all other countries (dimmed)
            ]
        }
    });

    // System performance layer
    const performance_stops = [21, 26.5, 32, 37.5, 43];

    map.addLayer({
        id: 'system_performance_layer',
        type: 'fill',
        source: 'energy',
        layout: {
            visibility: 'none'
        },
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
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1,      // hovered country (fully visible)
                0.5     // all other countries (dimmed)
            ]
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

        // Show the selected layer and set activeLayer accordingly
        if (selectedData == 'composite') {
            updateLegend(composite_stops);
            map.setLayoutProperty('composite_index_layer', 'visibility', 'visible');
            activeLayer = 'composite_index_layer';
        } else if (selectedData == 'readiness') {
            updateLegend(readiness_stops);
            map.setLayoutProperty('transition_readiness_layer', 'visibility', 'visible');
            activeLayer = 'transition_readiness_layer';
        } else if (selectedData == 'performance') {
            updateLegend(performance_stops);
            map.setLayoutProperty('system_performance_layer', 'visibility', 'visible');
            activeLayer = 'system_performance_layer';
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

    // Hover
    let hoveredId = null;

    layers.forEach(layer => {
        map.on('mousemove', layer, (e) => {
            if (e.features.length > 0) {

                // Remove hover from previous feature
                if (hoveredId !== null) {
                    map.setFeatureState(
                        { source: map.getLayer(layer).source, id: hoveredId },
                        { hover: false }
                    );
                }

                // Set new hovered feature
                hoveredId = e.features[0].id;

                map.setFeatureState(
                    { source: map.getLayer(layer).source, id: hoveredId },
                    { hover: true }
                );
            }
        });

        map.on('mouseleave', layer, () => {
            if (hoveredId !== null) {
                map.setFeatureState(
                    { source: map.getLayer(layer).source, id: hoveredId },
                    { hover: false }
                );
            }
            hoveredId = null;
        });
    });

    // Popups

    const energy_popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    layers.forEach(layer => {
        map.on('mousemove', layer, function (e) {

            map.getCanvas().style.cursor = 'pointer';

            const feature = e.features[0];
            const featureId = feature.properties.id;
            const coordinates = e.lngLat;

            const ind = feature.properties.composite_index;
            const read = feature.properties.transition_readiness;
            const perf = feature.properties.system_performance;

            energy_popup
                .setLngLat(coordinates)
                .setHTML(`
                <strong>Composite Index: ${ind}</strong><br>
                <strong>Transition Readiness: ${read}</strong><br>
                <strong>System Performance: ${perf}</strong><br>
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
    handleData();
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

// 1) Add event listener which returns map view to original view on button click using flyTo method ---------------------------------------------------------------------------------------------
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: center, // LINES 10-11
        zoom: zoom, // LINE 10, 12
        essential: true
    });
});

// 2) Information button ---------------------------------------------------------------------------------------------
const infopopup = document.getElementById("popup");
const infobutton = document.getElementById("infobutton");
const closeBtn = document.getElementById("closeBtn");

// Open popup
infobutton.addEventListener("click", () => {
    infopopup.style.display = "block";
});

// Close popup
closeBtn.addEventListener("click", () => {
    infopopup.style.display = "none";
});

// Close if clicking outside the box
window.addEventListener("click", (e) => {
    if (e.target === popup) {
        infopopup.style.display = "none";
    }
});

// 3) Information button 2 ---------------------------------------------------------------------------------------------
const infopopup2 = document.getElementById("popup2");
const infobutton2 = document.getElementById("infobutton2");
const closeBtn2 = document.getElementById("closeBtn2");

// Open popup
infobutton2.addEventListener("click", () => {
    infopopup2.style.display = "block";
});

// Close popup
closeBtn2.addEventListener("click", () => {
    infopopup2.style.display = "none";
});

// Close if clicking outside the box
window.addEventListener("click", (e) => {
    if (e.target === infopopup2) {
        infopopup2.style.display = "none";
    }
});

// 4) Combine button ---------------------------------------------------------------------------------------------

// Store selected countries
let selectedFeatures = [];
let combinedActive = false; // Tracks if combined layer is currently active

// Active layer variable (updateS based on toggle logic)
let activeLayer = 'composite_index_layer'; // Example default

// Click event to collect countries
map.on('click', activeLayer, (e) => {
    const feature = e.features[0];

    // Avoid duplicates
    if (!selectedFeatures.some(f => f.id === feature.id)) {
        selectedFeatures.push(feature);
    }

    console.log("Selected features count:", selectedFeatures.length);
});

// Combine button with toggle
document.getElementById('combinebutton').addEventListener('click', () => {
    if (!combinedActive) {
        // --- COMBINE & HIGHLIGHT ---
        if (selectedFeatures.length === 0) {
            alert("No countries selected!");
            return;
        }

        const combinedGeoJSON = turf.combine(turf.featureCollection(selectedFeatures));

        // Add or update Mapbox source
        if (map.getSource('selection')) {
            map.getSource('selection').setData(combinedGeoJSON);
        } else {
            map.addSource('selection', { type: 'geojson', data: combinedGeoJSON });
            map.addLayer({
                id: 'selection_layer',
                type: 'fill',
                source: 'selection',
                paint: { 'fill-color': '#f39c12', 'fill-opacity': 0.5 }
            });
        }

        // Compute average
        const activeProperty = activeLayer === 'composite_index_layer' ? 'composite_index' :
                               activeLayer === 'transition_readiness_layer' ? 'transition_readiness' :
                               'system_performance';

        const values = selectedFeatures.map(f => f.properties[activeProperty]);
        const average = values.reduce((sum, v) => sum + v, 0) / values.length;

        console.log(`Average ${activeProperty}:`, average);
        alert(`Average ${activeProperty}: ${average.toFixed(2)}`);

        combinedActive = true; // Mark as active
    } else {
        // --- REMOVE HIGHLIGHT ---
        if (map.getLayer('selection_layer')) {
            map.removeLayer('selection_layer');
        }
        if (map.getSource('selection')) {
            map.removeSource('selection');
        }

        combinedActive = false; // Reset
        selectedFeatures = []; // Optional: clear selected features
        console.log("Combined highlight cleared");
    }
});     