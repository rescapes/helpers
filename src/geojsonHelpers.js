/**
 * Created by Andy Likuski on 2017.05.08
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import buffer from '@turf/buffer';
import union from '@turf/union';
import {toArrayIfNot} from '@rescapes/ramda';
import * as R from 'ramda';
const reduceFeaturesBy = R.reduceBy((acc, feature) => acc.concat(feature), []);
const regex = /(.+)\/\d+/;
// Get the feature by type based on its id
// featuresByType:: Feature f = [f] -> <String, [f]>
export const featureByType = reduceFeaturesBy(feature => R.match(regex, feature.id)[1]);
const FEATURES = 'features';

/**
 * Split geojson by feature type
 * @param {Object} osm Osm
 * @param {Feature[]} osm.features Default []. Features that are way, node, or route according to their id
 * @returns {Object} Copies of the gtfs with a single type of Feature
 * geojsonByType:: geojson g = g -> <String, g>
 */
export const geojsonByType = osm => {
  return R.map(
    // Make a copy of the geojson with the typed features
    featureOfType => R.set(R.lensProp(FEATURES), featureOfType, osm),
    featureByType(R.pathOr([], [FEATURES], osm)) // Reduce by feature type
  );
};


/**
 * Fetch each square of transit and merge the results by feature id
 * concatValues combines are results sets when they return
 * @param {String} k The key of the object being tested.
 * @param {Feature[]} l The left side Features
 * @param {Feature[]} r The right side Features
 * @returns {Object} The concatted features
 */
export const concatFeatures = (k, l, r) => k === FEATURES ? R.concat(l, r) : r;

/**
 * Given a geojson feature collection, buffer it union each feature from the buffer
 * @param {Object} config The config
 * @param {Number} config.radius The radius
 * @param {String} config.units The units
 * @param {Object} geojson Feature Collection to buffer
 * @return {Object} A feature collection  containing one or more features
 */
export const bufferAndUnionGeojson = ({radius, units}, geojson) => {
  const buffered = buffer(geojson, radius, {units});
  const features = R.compose(toArrayIfNot, R.when(R.propEq('type', 'FeatureCollection'), R.prop('features')))(buffered);
  const feature = R.reduce(
    (acc, f) => {
      return !acc ? f : union.default(acc, f);
    },
    null,
    features
  );
  return {type: 'FeatureCollection', features: [feature]};
};