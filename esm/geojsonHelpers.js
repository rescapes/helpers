import { reduceBy, match, map, set, lensProp, pathOr, concat } from 'ramda';

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
var reduceFeaturesBy = reduceBy(function (acc, feature) {
  return acc.concat(feature);
}, []);
var regex = /(.+)\/\d+/; // Get the feature by type based on its id
// featuresByType:: Feature f = [f] -> <String, [f]>

var featureByType = reduceFeaturesBy(function (feature) {
  return match(regex, feature.id)[1];
});
var FEATURES = 'features';
/**
 * Split geojson by feature type
 * @param {Object} osm Osm
 * @param {Feature[]} osm.features Default []. Features that are way, node, or route according to their id
 * @returns {Object} Copies of the gtfs with a single type of Feature
 * geojsonByType:: geojson g = g -> <String, g>
 */

var geojsonByType = function geojsonByType(osm) {
  return map( // Make a copy of the geojson with the typed features
  function (featureOfType) {
    return set(lensProp(FEATURES), featureOfType, osm);
  }, featureByType(pathOr([], [FEATURES], osm)) // Reduce by feature type
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

var concatFeatures = function concatFeatures(k, l, r) {
  return k === FEATURES ? concat(l, r) : r;
};

export { concatFeatures, featureByType, geojsonByType };
//# sourceMappingURL=geojsonHelpers.js.map
