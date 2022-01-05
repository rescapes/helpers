/**
 * Created by Andy Likuski on 2018.06.13
 * Copyright (c) 2018 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {point, lineString} from '@turf/helpers';
import * as R from 'ramda';
import squareGrid from '@turf/square-grid';
import bbox from '@turf/bbox';
import {bufferAndUnionGeojson} from './geojsonHelpers.js';

/**
 * Convert a location to what Google sometimes uses, with lat(), lng()
 * @param {Object} location The location
 * @returns {{lat: function(): *, lng: function(): *}} The location
 */
export const locationToGoogleFunctionalLocation = location => ({lat: () => location[0], lng: () => location[1]});

/**
 * Convert a Google location to a Turf Point
 * @param {Object} location with lat, lng
 * @returns {Object} { geometry : {type: "Point", coordinates: Array(2)} properties : {} type : "Feature" } the point
 */
export const googleLocationToTurfPoint = location => point(R.props(['lng', 'lat'], location));

/**
 * Convert a Google location to a Turf LineString
 * @param {[Object]} locations with lat, lng
 * @returns {Object} { geometry : {type: "LineString", coordinates: Array(2)} properties : {} type : "Feature" }
 */
export const googleLocationToTurfLineString = locations => lineString(R.map(R.props(['lng', 'lat']), locations));


/**
 * Convert a location to a Turf Point with lat, lon
 * @param {[Number]} location a lat, lon
 * @returns {Object} { geometry : {type: "Point", coordinates: Array(2)} properties : {} type : "Feature" }
 */
export const locationToTurfPoint = location => point(R.reverse(location));

/**
 * Converts a Turf point back to a [lat, lon]
 * @param {Object} p The point
 * @return {[Number, Number]} The point
 */
export const turfPointToLocation = p => R.reverse(R.take(2, p.geometry.coordinates));

/**
 * Converts turf's bbox [lon, lat, lon, lat] to Openstreetmap's [lat, lon, lat, lon]
 * @param {[Number]} boundingBox The lon, lat, lon, lat
 * @returns {[Number]} The lat, lon, lat, lon
 */
export const turfBboxToOsmBbox = boundingBox => R.concat(
  R.reverse(R.take(2, boundingBox)),
  R.reverse(R.drop(2, boundingBox))
);

/**
 * Convert an object with lat lng keys or functions to a 2 element array
 * @param {Object} location The location
 * @return {*} The loation
 */
export const googleLocationToLocation = location => R.map(
  R.when(
    R.is(Function),
    f => f()
  ),
  R.props(['lat', 'lng'], location)
);

/**
 * Convert a location object into a lat,lng string
 * @param {Object} location The location
 * @returns {String} the String
 */
export const googleLocationToLatLngString = location => {
  return R.join(',', googleLocationToLocation(location));
};
/**
 * Convert an origin/destination object into a lat,lng string
 * @param {Object} originDestination The origin
 * @returns {String} The String
 */
export const originDestinationToLatLngString = originDestination => {
  return googleLocationToLatLngString(originDestination.geometry.location);
};

/**
 * Uses Turf's squareGrid to extract bounding boxes based on the cellsize and the bounds
 * @param {Object} options The cell options
 * @param {Number} options.cellSize The size of the boxes
 * @param {Number} options.units The units of the boxes. Defaults to kilometers
 * @param {[Number]} bounds The turf bounds [lon, lat, lon, lat]
 * @returns {[[Number]]} Array of turf bboxes [[lon, lat, lon, lat], ...]
 */
export const extractSquareGridBboxesFromBounds = ({cellSize, units}, bounds) => {
  const squareGridOptions = {units: units || 'kilometers'};
  // Use turf's squareGrid function to break up the bbox by cellSize squares
  return R.map(
    polygon => bbox.default(polygon),
    squareGrid(bounds, cellSize, squareGridOptions).features
  );
};

/**
 * Uses Turf's squareGrid to extract square grid geojson features.
 * The features are used as a mask, so any geojson shapes that comes in will be made into squares
 * If the geojson is to small to produce a result with the given cellSize, the cellSize will be divided by 10
 * until a result is produced
 * @param {Object} options The cell options
 * @param {Number} options.cellSize The size of the boxes' sides
 * @param {Number} options.unit The units of the boxes. Defaults to kilometers
 * @param {Object} geojson The turf bounds [lon, lat, lon, lat]
 * @returns {Object} A FeatureCollection with the box features of size cellSize or cellSize / 10, / 100, etc
 * until results are produced
 */
export const extractSquareGridFeatureCollectionFromGeojson = ({cellSize, units}, geojson) => {
  const squareGridOptions = {units: units || 'kilometers', mask: geojson};
  // Because we use a mask, we have to make the bbox significantly bigger than the mask, or else the mask doesn't
  // work. I don't know why--seems like a bug in Turf.
  const box = bbox.default(
    bufferAndUnionGeojson({radius: 10, units: 'kilometers'}, geojson)
  );
  // Use turf's squareGrid function to break up the bbox by cellSize squares
  return R.reduceWhile(
    // Quit if the accumulator has values
    (accum, _) => R.compose(R.not, R.length, R.prop('features'))(accum),
    (accum, currentCellSize) => squareGrid(
      box,
      currentCellSize,
      squareGridOptions
    ),
    {features: []},
    // Assume 10 divisions by 10 is enough to generate some features
    R.times(i => cellSize / Math.pow(2, i), 10)
  );
};


/**
 * Same as extractSquareGridFeatureCollectionFromGeojson but maps each feature to a bbox
 * @param {Object} options The cell options
 * @param {Number} options.cellSize The size of the boxes on 1 side
 * @param {Number} options.unit The units of the boxes. Defaults to kilometers
 * @param {Object} geojson The turf bounds [lon, lat, lon, lat]
 * @returns {[[Number]]} Array of turf bboxes [[lon, lat, lon, lat], ...]
 */
export const extractSquareGridBboxesFromGeojson = ({cellSize, units}, geojson) => {
  return R.map(
    polygon => bbox.default(polygon),
    extractSquareGridFeatureCollectionFromGeojson({cellSize, units}, geojson).features
  );
};
