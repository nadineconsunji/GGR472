# Energy Transition Readiness in Africa

## Credits

This map was developed for the CATF website by Geography and Planning students at the University of Toronto as part of the Sandbox Initiative. Special thanks to Professor Lindsey Smith (UofT) and Brian Mukhaya (CATF) for their support.

## Purpose

Contingent on the replacement of dummy data in the future, the web map will showcase Africa’s capacity for an energy transition from fossil fuels to clean technologies, on a country and regional level.

Broadly, the web map would be used to identify which countries or regions in Africa have a higher capacity to achieve a clean energy transition. This information can be utilized to support organisations, policy-makers and planners to decide where to focus efforts and resources to increase energy transition readiness or construct clean energy technologies. Similarly, takeaways from the web map can inspire future research directions surrounding why certain countries or regions have a higher capacity to achieve a clean energy transition than others. 

## Usage

Basic navigation features, positioned in the top right corner, include zooming in and out and searching locations with a geocoder. The map also has tabs, which allow the user to switch between composite indices and technology-specific scores, and dropdown menues, which can be used to toggle between the relevant indices and technologies.

On a country level, hovering the mouse over a country allows users to see its individual composite index, transition readiness and system performance scores while double clicking on a country allows a user to zoom to its geographic extent and returns a short, written summary of the country’s existing energy infrastructure and potential for a clean energy transition.

On a regional level, the map contains a region filter to allow the user to focus on specific regions in Africa, return to original view, and calculate the average score of a user-defined region by ticking the ‘new selection’ box, clicking on countries of interest, and clicking the ‘calculate average’ button.

## Adding to the map

### Adding dummy data and replacing data

To add dummy data into the table, download the geojson file from the 'data' folder, open in geojson.io or Excel, and add values. Alternatively, merge with other existing data using code or this open-source geodata merger on GitHub: https://funkeinteraktiv.github.io/geo-data-merger/

### Visualizing layers

Theme colours have already been defined for ease of access.

To visualize additional layers, follow the logic outlined by comments in the 'script.js' file, and continue using theme colours to ensure that the website aligns with other pages published by the CATF.

Once a new layer is created, add it to the array 'layers' to preserve the functionality of the map.

### Areas for improvement

Existing data can be updated as the CATF attains composite and technology-specific scores for other countries. This would increase the accuracy of information the map was displaying, allowing for improved conclusions to be drawn about regional and country-level clean energy transition capacity in Africa.

Additionally, data regarding the specific location of current clean technologies could be added to display the geographical clustering of energy sources and supplement the existing visualisation of clean energy transition capacity in countries.

Other improvements include:

- Limiting the geocoder to only search for areas within the African continent to narrow the focus of the map
- Adding more cohesive written summaries for all countries based on both data collected from the CATF and information from peer-reviewed studies
- Using a data file with more precise African country boundaries.

Ultimately, we suggest embedding the web map onto the CATF website alongside a more detailed explanations on data sourcing and score calculation.