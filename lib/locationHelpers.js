'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var R = require('ramda');
var helpers = require('@turf/helpers');

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
  return helpers.point(R.props(['lng', 'lat'], location));
};
/**
 * Convert a Google location to a Turf LineString
 * @param {[Object]} locations with lat, lng
 * @returns {Object} { geometry : {type: "LineString", coordinates: Array(2)} properties : {} type : "Feature" }
 */

var googleLocationToTurfLineString = function googleLocationToTurfLineString(locations) {
  return helpers.lineString(R.map(R.props(['lng', 'lat']), locations));
};
/**
 * Convert a location to a Turf Point with lat, lon
 * @param {[Number]} location a lat, lon
 * @returns {Object} { geometry : {type: "Point", coordinates: Array(2)} properties : {} type : "Feature" }
 */

var locationToTurfPoint = function locationToTurfPoint(location) {
  return helpers.point(R.reverse(location));
};
/**
 * Converts a Turf point back to a [lat, lon]
 * @param {Object} p The point
 * @return {[Number, Number]} The point
 */

var turfPointToLocation = function turfPointToLocation(p) {
  return R.reverse(R.take(2, p.geometry.coordinates));
};
/**
 * Convert an object with lat lng keys or functions to a 2 element array
 * @param {Object} location The location
 * @return {*} The loation
 */

var googleLocationToLocation = function googleLocationToLocation(location) {
  return R.map(R.when(R.is(Function), function (f) {
    return f();
  }), R.props(['lat', 'lng'], location));
};
/**
 * Convert a location object into a lat,lng string
 * @param {Object} location The location
 * @returns {String} the String
 */

var googleLocationToLatLngString = function googleLocationToLatLngString(location) {
  return R.join(',', googleLocationToLocation(location));
};
/**
 * Convert an origin/destination object into a lat,lng string
 * @param {Object} originDestination The origin
 * @returns {String} The String
 */

var originDestinationToLatLngString = function originDestinationToLatLngString(originDestination) {
  return googleLocationToLatLngString(originDestination.geometry.location);
};

exports.googleLocationToLatLngString = googleLocationToLatLngString;
exports.googleLocationToLocation = googleLocationToLocation;
exports.googleLocationToTurfLineString = googleLocationToTurfLineString;
exports.googleLocationToTurfPoint = googleLocationToTurfPoint;
exports.locationToGoogleFunctionalLocation = locationToGoogleFunctionalLocation;
exports.locationToTurfPoint = locationToTurfPoint;
exports.originDestinationToLatLngString = originDestinationToLatLngString;
exports.turfPointToLocation = turfPointToLocation;
//# sourceMappingURL=locationHelpers.js.map
