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

import * as R from 'ramda';
import {point, lineString} from '@turf/helpers';

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
 * @param {[Number]} bbox The lon, lat, lon, lat
 * @returns {[Number]} The lat, lon, lat, lon
 */
export const turfBboxToOsmBbox = bbox => R.concat(
  R.reverse(R.take(2, bbox)),
  R.reverse(R.drop(2, bbox))
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
export const googleLocationToLatLngString = location => R.join(',', googleLocationToLocation(location));
/**
 * Convert an origin/destination object into a lat,lng string
 * @param {Object} originDestination The origin
 * @returns {String} The String
 */
export const originDestinationToLatLngString = originDestination => googleLocationToLatLngString(originDestination.geometry.location);
