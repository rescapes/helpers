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
import {point, lineString} from '@turf/helpers'

/***
 * Convert a location to what Google sometimes uses, with lat(), lng()
 * @param location
 * @return {{lat: function(): *, lng: function(): *}}
 */
export const locationToGoogleFunctionalLocation = location => ({lat: () => location[0], lng: () => location[1]});

/**
 * Convert a Google location to a Turf Point
 * @param {Object} location with lat, lng
 * @return {Object} { geometry : {type: "Point", coordinates: Array(2)} properties : {} type : "Feature" }
 */
export const googleLocationToTurfPoint = location => point(R.props(['lng', 'lat'], location));

/**
 * Convert a Google location to a Turf LineString
 * @param {[Object]} locations with lat, lng
 * @return {Object} { geometry : {type: "LineString", coordinates: Array(2)} properties : {} type : "Feature" }
 */
export const googleLocationToTurfLineString = locations => lineString(R.map(R.props(['lng', 'lat']), locations));


/**
 * Convert a location to a Turf Point with lat, lon
 * @param {[Number]} location a lat, lon
 * @return {Object} { geometry : {type: "Point", coordinates: Array(2)} properties : {} type : "Feature" }
 */
export const locationToTurfPoint = location => point(R.reverse(location));

/**
 * Converts a Turf point back to a [lat, lon]
 * @param point
 * @return {[Number, Number]}
 */
export const turfPointToLocation = point => R.reverse(R.take(2, point.geometry.coordinates));

/***
 * Convert an object with lat lng keys to a 2 element array
 * @param location
 * @return {*}
 */
export const googleLocationToLocation = location => R.props(['lat', 'lng'], location)

/***
 * Convert a location object into a lat,lng string
 * @param location
 */
export const googleLocationToLatLngString = location => R.join(',', googleLocationToLocation(location));
/***
 * Convert an origin/destination object into a lat,lng string
 * @param originDestination
 */
export const originDestinationToLatLngString = originDestination => googleLocationToLatLngString(originDestination.geometry.location);