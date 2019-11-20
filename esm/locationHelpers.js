import { props, map, reverse, take, concat, drop, when, is, join } from 'ramda';
import { point, lineString } from '@turf/helpers';
import squareGrid from '@turf/square-grid';
import bbox from '@turf/bbox';

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
/**
 * Convert a location to what Google sometimes uses, with lat(), lng()
 * @param {Object} location The location
 * @returns {{lat: function(): *, lng: function(): *}} The location
 */

var locationToGoogleFunctionalLocation = function locationToGoogleFunctionalLocation(location) {
  return {
    lat: function lat() {
      return location[0];
    },
    lng: function lng() {
      return location[1];
    }
  };
};
/**
 * Convert a Google location to a Turf Point
 * @param {Object} location with lat, lng
 * @returns {Object} { geometry : {type: "Point", coordinates: Array(2)} properties : {} type : "Feature" } the point
 */

var googleLocationToTurfPoint = function googleLocationToTurfPoint(location) {
  return point(props(['lng', 'lat'], location));
};
/**
 * Convert a Google location to a Turf LineString
 * @param {[Object]} locations with lat, lng
 * @returns {Object} { geometry : {type: "LineString", coordinates: Array(2)} properties : {} type : "Feature" }
 */

var googleLocationToTurfLineString = function googleLocationToTurfLineString(locations) {
  return lineString(map(props(['lng', 'lat']), locations));
};
/**
 * Convert a location to a Turf Point with lat, lon
 * @param {[Number]} location a lat, lon
 * @returns {Object} { geometry : {type: "Point", coordinates: Array(2)} properties : {} type : "Feature" }
 */

var locationToTurfPoint = function locationToTurfPoint(location) {
  return point(reverse(location));
};
/**
 * Converts a Turf point back to a [lat, lon]
 * @param {Object} p The point
 * @return {[Number, Number]} The point
 */

var turfPointToLocation = function turfPointToLocation(p) {
  return reverse(take(2, p.geometry.coordinates));
};
/**
 * Converts turf's bbox [lon, lat, lon, lat] to Openstreetmap's [lat, lon, lat, lon]
 * @param {[Number]} boundingBox The lon, lat, lon, lat
 * @returns {[Number]} The lat, lon, lat, lon
 */

var turfBboxToOsmBbox = function turfBboxToOsmBbox(boundingBox) {
  return concat(reverse(take(2, boundingBox)), reverse(drop(2, boundingBox)));
};
/**
 * Convert an object with lat lng keys or functions to a 2 element array
 * @param {Object} location The location
 * @return {*} The loation
 */

var googleLocationToLocation = function googleLocationToLocation(location) {
  return map(when(is(Function), function (f) {
    return f();
  }), props(['lat', 'lng'], location));
};
/**
 * Convert a location object into a lat,lng string
 * @param {Object} location The location
 * @returns {String} the String
 */

var googleLocationToLatLngString = function googleLocationToLatLngString(location) {
  return join(',', googleLocationToLocation(location));
};
/**
 * Convert an origin/destination object into a lat,lng string
 * @param {Object} originDestination The origin
 * @returns {String} The String
 */

var originDestinationToLatLngString = function originDestinationToLatLngString(originDestination) {
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

var extractSquareGridBboxesFromBounds = function extractSquareGridBboxesFromBounds(_ref, bounds) {
  var cellSize = _ref.cellSize,
      units = _ref.units;
  var squareGridOptions = {
    units: units || 'kilometers'
  }; // Use turf's squareGrid function to break up the bbox by cellSize squares

  return map(function (polygon) {
    return bbox(polygon);
  }, squareGrid(bounds, cellSize, squareGridOptions).features);
};
/**
 * Uses Turf's squareGrid to extract bounding boxes based on the cellsize and the geojson features.
 * The features are used as a mask, so any geojson shapes that comes in will be maded in to squares
 * @param {Object} options The cell options
 * @param {Number} options.cellSize The size of the boxes
 * @param {Number} options.unit The units of the boxes. Defaults to kilometers
 * @param {Object} geojson The turf bounds [lon, lat, lon, lat]
 * @returns {[[Number]]} Array of turf bboxes [[lon, lat, lon, lat], ...]
 */

var extractSquareGridBboxesFromGeojson = function extractSquareGridBboxesFromGeojson(_ref2, geojson) {
  var cellSize = _ref2.cellSize,
      units = _ref2.units;
  var squareGridOptions = {
    units: units || 'kilometers',
    mask: geojson
  }; // Use turf's squareGrid function to break up the bbox by cellSize squares

  return map(function (polygon) {
    return bbox(polygon);
  }, squareGrid(bbox(geojson), cellSize, squareGridOptions).features);
};

export { extractSquareGridBboxesFromBounds, extractSquareGridBboxesFromGeojson, googleLocationToLatLngString, googleLocationToLocation, googleLocationToTurfLineString, googleLocationToTurfPoint, locationToGoogleFunctionalLocation, locationToTurfPoint, originDestinationToLatLngString, turfBboxToOsmBbox, turfPointToLocation };
//# sourceMappingURL=locationHelpers.js.map
