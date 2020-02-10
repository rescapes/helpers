import { compose, fromPairs, chain, identity, map, cond, is, toPairs, T, always } from 'ramda';
export { concatFeatures, featureByType, geojsonByType } from './geojsonHelpers.js';
export { calculateDistance } from './geospatialHelpers.js';
import { mapObjToValues } from 'rescape-ramda';
import 'immutable';
export { copy, fromImmutable, toImmutable, toImmutableKeyedByProp, toJS } from './immutableHelpers.js';
export { resolveFeatureFromExtent, resolveSvgPoints } from './svgHelpers.js';
export { expectTask, expectTaskRejected, resultToPromise } from './testHelpers.js';
import 'moment';
export { toTimeString } from './timeHelpers.js';
import 'prop-types';
import 'rescape-validate';
export { applyDefaultRegion, applyDefaultStyles, applyRegionsToUsers, firstUserLens, keysAsIdObj, mapDefaultUsers, parseApiUrl, wrapLocationsWithFeatures } from './configHelpers.js';
import { _ as _defineProperty } from './selectorHelpers-bad2120d.js';
export { S as STATUS, a as makeInnerJoinByLensThenFilterSelector, m as mergeStateAndProps, s as status } from './selectorHelpers-bad2120d.js';
import 'folktale/result';
import '@turf/helpers';
import '@turf/square-grid';
import '@turf/bbox';
import '@turf/bbox-polygon';
import '@turf/area';
export { extractSquareGridBboxesFromBounds, extractSquareGridBboxesFromGeojson, extractSquareGridFeatureCollectionFromGeojson, googleLocationToLocation, googleLocationToTurfLineString, googleLocationToTurfPoint, locationToGoogleFunctionalLocation, locationToTurfPoint, originDestinationToLatLngString, turfBboxToOsmBbox, turfPointToLocation } from './locationHelpers.js';

/**
 * Converts our graphql structure to a regular object so we can filter keys
 * @param {Object} graphqlListStructure The structure
 * @returns {Object} An object representation of graphqlListStructure that can be processed with normal object functions.
 * Use convertToGraphqlStructure to return this to its original form
 */

var convertFromGraphqlStructure = function convertFromGraphqlStructure(graphqlListStructure) {
  return compose(fromPairs, // Flatten the pairs
  function (pairs) {
    return chain(identity, pairs);
  }, map(function (item) {
    return cond([// attributes to {attribute: true}. Make it a single pair array item
    [is(String), function (obj) {
      return [[obj, true]];
    }], // if object, recurse on object values, which are always arrays
    // return the object as pairs so its key/values are merged with the simple [attribute, true] key/values
    [is(Object), function (obj) {
      return compose(toPairs, map(function (objValue) {
        return convertFromGraphqlStructure(objValue);
      }))(obj);
    }], // reject all else
    [T, function (badThing) {
      throw Error("Only expected a string or object but got ".concat(badThing));
    }]])(item);
  }))(graphqlListStructure);
}; // eslint-disable-next-line valid-jsdoc

/**
 * Converts an object created with convertFromGraphqlStructure back to our grapqhl structure
 * @param {Object} obj Result of converting using convertFromGraphqlStructure
 * @returns {[Object|String]} The graphqlListStructure. See the regionStore.js's regionOutputParams for an example
 */

var convertToGraphqlStructure = function convertToGraphqlStructure(obj) {
  return compose(identity, // Convert the key/values to a single attribute or an object
  mapObjToValues(function (item, key) {
    return cond([// Simple attributes. Discard item, it's just true
    [is(Boolean), always(key)], // Item is an Object. Convert key: item to {key: [recurse(item)]}
    [is(Object), function (o) {
      return _defineProperty({}, key, convertToGraphqlStructure(o));
    }], // reject all else
    [T, function (badThing) {
      throw Error("Only expected a boolean or object but got ".concat(badThing));
    }]])(item);
  }))(obj);
};

export { convertFromGraphqlStructure, convertToGraphqlStructure };
//# sourceMappingURL=index.js.map
