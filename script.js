/*------------------------------------------------------------------------------------------------------------------------
1.1) Initializing map
------------------------------------------------------------------------------------------------------------------------*/

// Mapbox Token
mapboxgl.accessToken = 'pk.eyJ1IjoibmFkaW5lY29uc3VuamkiLCJhIjoiY21rZWU1djI4MDV6NTNkb29meTJzMW81dSJ9.t6RLssyQkfZODRIMy_ToNQ';

// Mapbox Token (default public) - added by Daniel
// mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsODEwMTciLCJhIjoiY21rZWI2eGg4MDU5NjNscHdxbjhkMTNmciJ9.jdsMukp7zHz3llySNBJs0A';

// Center coordinates for map on load and zoom change(to change, refer to https://labs.mapbox.com/location-helper)
const center = [22.34868, -0.31974];
const centerEast = [35, -5];
const centerWest = [-2, 15];
const centerNorth = [15.5, 19.5];
const centerSouth = [25, -20];
const centerCentral = [22.3, 3];
const zoom = 2.5;
const minZoom = zoom;
const maxZoom = 7.0;

// Initialize map and edit to your preference
const map = new mapboxgl.Map({
    container: 'my-map', // container id in HTML
    style: 'mapbox://styles/nadineconsunji/cmmbdfg9r007x01ryckrx8rx8',
    // The following variables have been defined above
    center: center,
    zoom: zoom,
    minZoom: minZoom,
    maxZoom: maxZoom
});

/*------------------------------------------------------------------------------------------------------------------------
1.2) Adding interactivity to sidebar
------------------------------------------------------------------------------------------------------------------------*/

// Function to collapse sidebar on click
function toggleSidebar(leftsidebar) {

    let elem = document.getElementById(leftsidebar);
    let classes = elem.className.split(' ');
    let collapsed = classes.indexOf('collapsed') !== -1;
    let button = document.getElementById("left-toggle");

    let padding = {};

    if (collapsed) {
        // Developer comment: Remove the 'collapsed' class from the class list of the element, this sets it back to the expanded state.
        classes.splice(classes.indexOf('collapsed'), 1);

        padding[leftsidebar] = 300; // Developer comment: In px, matches the width of the sidebars set in .sidebar CSS class
        map.easeTo({
            padding: padding,
            duration: 1000 // Developer comment: In ms, CSS transition duration property for the sidebar matches this value
        });

        button.innerText = "⇦";
    }

    else {

        padding[leftsidebar] = 0;
        // Developer comment: Add the 'collapsed' class to the class list of the element
        classes.push('collapsed');

        map.easeTo({
            padding: padding,
            duration: 1000
        });

        button.innerText = "⇨";
    }

    // Developer comment: Update the class list on the element
    elem.className = classes.join(' ');
}

// Expands sidebar on map load (remove to keep closed on default load, change nested code to remove the "sliding" appearance)
map.on('load', function () {
    toggleSidebar('left');
});

/*--------------------------------------------------------------------------------------------------
2) Adding sources and layers, and changing layer display based on user interactions
--------------------------------------------------------------------------------------------------*/

// 2.1) Defining lists and arrays used in all layers

// List of composite layers. Most layer interactions go inside a 'for each' loop
let layers = ['composite_index_layer', 'system_performance_layer', 'transition_readiness_layer', 'technology_layer'];

// Defining theme colours based on CATF brand colours
const theme_colours = ['#25d0ff', '#00a6d4', '#026bc2', '#00457d', '#01145e'];

// Boolean fill opacity, with greater opacity on hover
const fillOpacity = [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    1,      // hovered country (fully visible)
    0.7     // all other countries (dimmed)
];

// 2.2) Adding layers and interactivity

map.on('load', () => {

    /*-----------------------------------------------------------------------------------------
    2.2.1) Load 3 layers for overall indices tab
    -----------------------------------------------------------------------------------------*/

    // Source for overall indices
    map.addSource('energy', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/nadineconsunji/GGR472/main/data/energy_index.geojson',
        promoteId: 'OBJECTID'
    });

    // 1) Composite index layer
    const composite_stops = [21, 33, 45, 57, 69];

    map.addLayer({
        id: 'composite_index_layer',
        type: 'fill',
        source: 'energy',
        layout: {
            visibility: 'none'
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
            'fill-opacity': fillOpacity
        }
    });

    // 2) Transition readiness layer
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
            'fill-opacity': fillOpacity
        }
    });

    // 3) System performance layer
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
            'fill-opacity': fillOpacity
        }
    });

    /*-----------------------------------------------------------------------------------------
    2.2.2) Load 1 layer for specific technologies tab
    -----------------------------------------------------------------------------------------*/

    // Dynamic layer for technology
    const technology_stops = [21, 69];

    map.addLayer({
        id: 'technology_layer',
        type: 'fill',
        source: 'energy', // CHANGE SOURCE ONCE DUMMY DATA IS CREATED
        layout: {
            visibility: 'visible'
        },
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'], ['get', 'solar'],
                technology_stops[0], theme_colours[0],
                technology_stops[1], theme_colours[4]
            ],
            'fill-opacity': fillOpacity // THE HOVER DOES NOT WORK
        }
    });

    /*-----------------------------------------------------------------------------------------
    2.2.2.1) Change data display on specific technologies tab
    -----------------------------------------------------------------------------------------*/

    function handleTechTest(selectedTech) {

        // Update selected technology variable
        var selectedTech = document.getElementById("tech_select").value;

        // Compute min and max
        const values = map.querySourceFeatures('energy')
            .map(f => f.properties[selectedTech])
            .filter(v => v != null);

        const min = Math.min(...values);
        const max = Math.max(...values);

        // Update legend
        document.getElementById('tech_stop_0').textContent = min;
        document.getElementById('tech_stop_1').textContent = max;

        // Update layer fill
        map.setPaintProperty('technology_layer', 'fill-color', [
            'interpolate',
            ['linear'],
            ['get', selectedTech],
            min, theme_colours[0],
            max, theme_colours[4]
        ]);
    }
    
    const techSelect = document.getElementById("tech_select");

    if (techSelect) {
        techSelect.addEventListener("change", () => {
            const selectedTech = document.getElementById("tech_select").value;
            handleTechTest(selectedTech);
        });
    };

    /*-----------------------------------------------------------------------------------------
    2.2.3) Load layer to display boundaries
    -----------------------------------------------------------------------------------------*/

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

    /*-----------------------------------------------------------------------------------------
    2.3.1) Change data display on overall indices tab
    -----------------------------------------------------------------------------------------*/

    // Legend
    function updateLegend(stops_variable) {
        document.getElementById('stop_0').textContent = stops_variable[0];
        document.getElementById('stop_1').textContent = stops_variable[4];
    }

    // Change overall index displayed when data selected
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

    // Visualizes current layer on map load
    handleData();

    // Event listener to trigger change in data display
    document.getElementById("selections").addEventListener("change", handleData);

    /*-----------------------------------------------------------------------------------------
    2.4) Functions that apply to multiple layers
    -----------------------------------------------------------------------------------------*/

    // 2.4.1) Filter by region and zoom to region ---------------------------------------------

    // Function to filter by region
    function handleRegions() {

        // Store selected region in a variable
        var selectedRegion = document.getElementById("regions").value;

        // Add filter to all layers
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

    // Event listener to trigger region function
    document.getElementById("regions").addEventListener("change", handleRegions);

    // 2.4.2) Increase country opacity on hover -------------------------------------------------

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

    // 2.4.3) Create popups on hover -------------------------------------------------------------

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

    // 2.4.4) Zoom to country and display panels with text --------------------------------------------

    // Disable existing zoom settings
    map.doubleClickZoom.disable();

    // Define popup to start
    let country_popup = null;

    // Create popups
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
            country_popup = new mapboxgl.Popup({
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

    // Function to close popups
    function closeCountryPopup() {
        if (country_popup) {
            country_popup.remove();
        }
    }

    // Close popups on the following interactions
    map.on("dragstart", closeCountryPopup);
    map.on("zoomstart", closeCountryPopup);

});

/*------------------------------------------------------------------------------------------------
3) Resize map
------------------------------------------------------------------------------------------------*/

map.on('load', () => {
    // Resize map accordingly if browser size is changed/minimised 
    map.resize();
});

/*------------------------------------------------------------------------------------------------
4) Adding map controls 
------------------------------------------------------------------------------------------------*/
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

/*------------------------------------------------------------------------------------------------
5) Adding interactivity 
------------------------------------------------------------------------------------------------*/

// 5.1) Add event listener which returns map view to original view on button click using flyTo method ---------------------------------------------------------------------------------------------
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

// 5.2) Information button ---------------------------------------------------------------------------------------------
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

// 5.3) Information button 2 and 3 ---------------------------------------------------------------------------------------------
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

/* ----------------------------------------------------------------------------------------------------------------
6) Calculate averages for selected countries
----------------------------------------------------------------------------------------------------------------- */

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