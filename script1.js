// Mapbox Token (default public)
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsODEwMTciLCJhIjoiY21rZWI2eGg4MDU5NjNscHdxbjhkMTNmciJ9.jdsMukp7zHz3llySNBJs0A';

// Center coordinates for map on load (to change, refer to https://labs.mapbox.com/location-helper)
const center = [22.13452, 7.67653];

//Load new map
const map = new mapboxgl.Map({
    container: 'map',
    zoom: 1.75,
    center: center,
    // pitch: '', [CAN USE FOR 3D MAP VISUALIZATION]
    style: 'mapbox://styles/nadineconsunji/cmmbdfg9r007x01ryckrx8rx8',
    // style: 'mapbox://styles/mapbox/streets-v11',
});

// Test center of map with marker (see lines 4-5)
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
        // Add the 'collapsed' class to the class list of the element
        classes.push('collapsed');

        map.easeTo({
            padding: padding,
            duration: 1000
        });

    }

    // Update the class list on the element
    elem.className = classes.join(' ');

}

// Expands sidebar on map load (remove to keep closed on default load, change nested code to remove the "sliding" appearance)
map.on('load', function () {
    toggleSidebar('left');
});
