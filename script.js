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
const centerEast = [35, -5];
const centerWest = [-2, 15];
const centerNorth = [15.5, 19.5];
const centerSouth = [25, -20];
const centerCentral = [22.3, 3];
const zoom = 2.5;
const minZoom = zoom;
const maxZoom = 7.0;

let layers = ['composite_index_layer', 'system_performance_layer', 'transition_readiness_layer'];

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
    let button = document.getElementById("left-toggle").innerHTML= "&larr;";
    
    // elem.classList.toggle("collapsed");
    // let isCollapsed = elem.classList.contains("collapsed");

    let padding = {};

    if (collapsed) { //PREVIOUSLY if(isCollapsed)

        // Developer comment: Remove the 'collapsed' class from the class list of the element, this sets it back to the expanded state.
        classes.splice(classes.indexOf('collapsed'), 1);

        padding[leftsidebar] = 300; // Developer comment: In px, matches the width of the sidebars set in .sidebar CSS class
        map.easeTo({
            padding: padding,
            duration: 1000 // Developer comment: In ms, CSS transition duration property for the sidebar matches this value
        });

        button.innerHTML = "&larr;";

    }

    else {

        padding[leftsidebar] = 0;
        // Developer comment: Add the 'collapsed' class to the class list of the element
        classes.push('collapsed');

        map.easeTo({
            padding: padding,
            duration: 1000
        });

        button.innerHTML = "&rarr;";

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
                0.7     // all other countries (dimmed)
            ]
        }
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
                0.7     // all other countries (dimmed)
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
                0.7     // all other countries (dimmed)
            ]
        }
    });

    // Boundaries

    map.addLayer({
        id: 'boundaries',
        type: 'line',
        source: 'energy',
        layout: {
            visibility: 'visible'
        },
        paint: {
            'line-color': theme_colours[3],
            'line-width': 0.1
        }
    });

    // Legend

    function updateLegend(stops_variable) {
        document.getElementById('stop_0').textContent = stops_variable[0];
        document.getElementById('stop_1').textContent = stops_variable[4];
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
                zoom: 3.3
            });
        } else if (selectedRegion == 'west') {
            map.flyTo({
                center: centerWest,
                zoom: 4
            });
        } else if (selectedRegion == 'north') {
            map.flyTo({
                center: centerNorth,
                zoom: 3.5
            });
        } else if (selectedRegion == 'south') {
            map.flyTo({
                center: centerSouth,
                zoom: 3.5
            });
        } else if (selectedRegion == 'central') {
            map.flyTo({
                center: centerCentral,
                zoom: 3.5
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
            const name = feature.properties.country;

            energy_popup
                .setLngLat(coordinates)
                .setHTML(`
                <strong>${name || 'Country'}</strong><br>
                Composite Index: ${ind}<br>
                Transition Readiness: ${read}<br>
                System Performance: ${perf}<br>
                `)
                .addTo(map);
        });

        map.on('mouseleave', layer, function () {
            map.getCanvas().style.cursor = '';
            energy_popup.remove();
        });
    });

    // Zoom to country

    map.doubleClickZoom.disable();
    layers.forEach(layer => {
        map.on('dblclick', layer, (e) => {
            const feature = e.features[0];

            // Compute the centroid of the polygon
            const centroid = turf.centroid(feature);
            const centerCoordinates = centroid.geometry.coordinates;

            // Fly to the centroid
            map.flyTo({
                center: centerCoordinates,
                zoom: 4,        // adjust zoom as needed
                essential: true
            });

            const name = feature.properties.country;
            const text = feature.properties.text;

            // Create the popup
            new mapboxgl.Popup({
                offset: [400, 350],
                className: 'no-arrow-popup'
            })
                .setLngLat(centerCoordinates)
                .setHTML(`
            <strong>${name || 'Country'}</strong><br><br>
            ${text || 'Text'}<br><br>
            Source: Wikipedia
        `)
                .addTo(map);
        });
    });
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
        countries: "td" // CHANGE
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
    layers.forEach(layer => {
        map.setFilter(layer, null);
    });
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

// 3) Information button 2 and 3 ---------------------------------------------------------------------------------------------
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

const infopopup3 = document.getElementById("popup3");
const infobutton3 = document.getElementById("infobutton3");
const closeBtn3 = document.getElementById("closeBtn3");

// Open popup
infobutton3.addEventListener("click", () => {
    infopopup3.style.display = "block";
});

// Close popup
closeBtn3.addEventListener("click", () => {
    infopopup3.style.display = "none";
});

// Close if clicking outside the box
window.addEventListener("click", (e) => {
    if (e.target === infopopup3) {
        infopopup3.style.display = "none";
    }
});

// 4) Combine countries ---------------------------------------------------------------------------------------------

// Store selected countries
function onCountryClick(e) {
    const feature = e.features[0];

    // Avoid duplicates
    if (!selectedFeatures.some(f => f.id === feature.id)) {
        selectedFeatures.push(feature);

        const selectedGeoJSON = {
            type: 'FeatureCollection',
            features: selectedFeatures
        };

        // If source already exists, update it
        if (map.getSource('selected_countries')) {
            map.getSource('selected_countries').setData(selectedGeoJSON);
        } else {
            // If not, add source
            map.addSource('selected_countries', {
                type: 'geojson',
                data: selectedGeoJSON
            });

            // Add line layer for boundaries
            map.addLayer({
                id: 'selected_boundaries',
                type: 'fill',
                source: 'selected_countries',
                paint: {
                    'fill-color': '#00092d',
                    'fill-opacity': 1
                }
            });
        }
    }

    console.log("Selected features count:", selectedFeatures.length);
};

// Select countries only when checkbox is checked
function handleCountrySelection(isChecked) {

    // Define list
    selectedFeatures = [];

    layers.forEach(layer => {
        if (isChecked) {
            map.on('click', layer, onCountryClick);
        } else {
            map.off('click', layer, onCountryClick);
        }
    });
};

// Checkbox event listener
document.getElementById('select').addEventListener('change', function () {

    // Remove old selection
    if (activePopup) {
        activePopup.remove();
        activePopup = null;
    }
    if (map.getLayer('selected_boundaries')) {
        map.removeLayer('selected_boundaries');
    }
    if (map.getSource('selected_countries')) {
        map.removeSource('selected_countries');
    }
    handleCountrySelection(this.checked);
});

let activePopup;

// Display average for selected countries
document.getElementById('combinebutton').addEventListener('click', () => {

    // Return error for no selection
    if (selectedFeatures.length === 0) {
        alert("No countries selected!");
        return;
    }

    // Combine selected
    const combinedGeoJSON = turf.combine(turf.featureCollection(selectedFeatures));

    // Compute averages
    const indValues = selectedFeatures.map(f => f.properties['composite_index']);
    const perfValues = selectedFeatures.map(f => f.properties['system_performance']);
    const readValues = selectedFeatures.map(f => f.properties['transition_readiness']);

    const indAverage = indValues.reduce((sum, v) => sum + v, 0) / indValues.length;
    const perfAverage = perfValues.reduce((sum, v) => sum + v, 0) / perfValues.length;
    const readAverage = readValues.reduce((sum, v) => sum + v, 0) / readValues.length;

    // Configure popups by selected layer
    var activeProperty = document.getElementById("selections").value;
    const selectCentroid = turf.centroid(combinedGeoJSON);

    const config = {
        composite: {
            label: 'composite index',
            value: indAverage
        },
        readiness: {
            label: 'transition readiness',
            value: readAverage
        },
        performance: {
            label: 'system performance',
            value: perfAverage
        }
    };

    const current = config[activeProperty];

    // Display popup
    if (current) {
        activePopup = new mapboxgl.Popup({ className: 'no-arrow-popup' })
            .setLngLat(selectCentroid.geometry.coordinates)
            .setHTML(`
                <strong>Average ${current.label}:<br>
                ${current.value.toFixed(2)}</strong><br><br>
                You have calculated the average ${current.label} for ${selectedFeatures.length} selected countries.
            `)
            .addTo(map);
    }

    // Turn select off
    layers.forEach(layer => {
        map.off('click', layer, onCountryClick);
    });

    // Uncheck select checkbox
    document.getElementById('select').checked = false;

    // Empty list of selected countries
    selectedFeatures = [];
});