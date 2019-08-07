import { curry, map, mapObjIndexed, fromPairs, set, lensPath, addIndex, merge, ifElse, equals, always, keys, lensProp, head, view, __ } from 'ramda';
import { mergeDeep, findOneValueByParamsThrowing, reqPathThrowing, reqStrPathThrowing, strPathOr } from 'rescape-ramda';
import PropTypes from 'prop-types';
import { v } from 'rescape-validate';

/**
 * Created by Andy Likuski on 2017.09.29
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var applyDefaultStyles = v(curry(function (defaultConfig, styles) {
  return mergeDeep(defaultConfig, {
    styles: {
      // Defaults can be merged with container props and props defined on the component
      "default": styles
    }
  });
}), [['defaultConfig', PropTypes.shape().isRequired], ['styles', PropTypes.shape().isRequired]], 'applyDefaultStyles');
/**
 * Copies the 'default' region to the keys of the specified regions, removing the default key,
 * and then deep merges.
 * @param {Object} regions keyed by key if an object and valued by region.
 * @returns {Object} The "modified" defaultConfig.regions
 */

var applyDefaultRegion = v(curry(function (defaultRegion, regions) {
  return map(function (region) {
    return mergeDeep(defaultRegion, region);
  }, regions);
}), [['defaultConfig', PropTypes.shape().isRequired], ['regions', PropTypes.oneOfType([PropTypes.shape(), PropTypes.array]).isRequired]], 'applyDefaultRegion');
/**
 * Copies the defaultConfig user keys to the specified users keys, removing the defaultConfig keys
 * This basically clones a template so that it can be merged into each real user
 * The default users of the defaultConfig are copied to the given usersKeys within the defaultConfig,
 * producing a new defaultConfig to merge with the target config
 * @param {Object} defaultConfig The configuration to use
 * @param {Object} defaultUserKeyToUserObjs Maps each default user key of interest to a list of
 * target user keyed objects.
 * E.g.
 * {[APP_ADMIN]: { // this can be an object or list of users
 *  'phil': {...}
 *  'barbara': {...}
 * }
 * {[MANAGER]: { // this can be an object or list of users
 *  'ken': {...}
 *  'billy': {...}
 * }
 * }
 * @returns {Object} The "modified" defaultConfig.users merged into the defaultUserKeyToUserObjs
 */

var mapDefaultUsers = v(curry(function (templateUsers, defaultUserKeyToUsers) {
  return mapObjIndexed( // We can map either an array or object for users
  function (users, templateKey) {
    return map(function (user) {
      return mergeDeep(findOneValueByParamsThrowing({
        templateKey: templateKey
      }, templateUsers), user);
    }, users);
  }, defaultUserKeyToUsers);
}), [['templateUsers', PropTypes.array.isRequired], ['defaultUserKeyToUsers', PropTypes.shape().isRequired]], 'mapDefaultUsers');
/**
 * Converts any number of strings to [{string1: {id: string1}, string2: {id: string2}].
 * This is used for associations when only one or a few are expected.
 * @param {Array} args The keys to transform
 * @returns {Object} The object keyed by ids
 */

var keysAsIdObj = function keysAsIdObj() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return fromPairs(map(function (key) {
    return [key, {
      id: key
    }];
  }, args));
};
/**
 * Apply the given regions to the users. This conveniently sets each user to have access to all given regions
 * in the config. It also sets isSelected to the first region for each user
 * @param {Object} regions An object of regions, the keys are assumed to be the ids
 * @param {Object} users An object keyed by user id and valued by user
 * @returns {Object} users with regions key set to a list of id objects (e.g. [{id: 1}, {id: 2}, ...]
 */

var applyRegionsToUsers = curry(function (regions, users) {
  return map(function (user) {
    return set(lensPath(['regions']), addIndex(map)(function (id, index) {
      return merge({
        id: id
      }, // Set the first region to isSelected true
      ifElse(equals(0), always({
        isSelected: true
      }), always({}))(index));
    }, keys(regions)), user);
  }, users);
}); // export applyUserSettings = (lens, settings)

var wrapLocationsWithFeatures = curry(function (locations, locationFeatures) {
  return mapObjIndexed(function (locationsByType, locationType) {
    return set(lensProp('geojson'), reqPathThrowing(), locationType);
  }, locations);
}); // Get the first user so we can make it the active user for testing

var firstUserLens = function firstUserLens(obj) {
  return lensPath(['users', head(keys(view(lensPath(['users']), obj)))]);
};
/**
 * Parse the apiSettings into a URL
 * @param {Object} apiSettings Contains the following
 * @param {String} apiSettings.protocol Required protocol
 * @param {String} apiSettings.host Required hostname or IP
 * @param {String} apiSettings.port Required port
 * @param {String} apiSettings.path Required path beginning with /
 * @return {string} THe complete URL
 */

var parseApiUrl = function parseApiUrl(apiSettings) {
  var req = reqStrPathThrowing(__, apiSettings);
  var noReq = strPathOr(null, __, apiSettings);
  return "".concat(req('protocol'), "://").concat(req('host')).concat(noReq('port') ? ':' : '').concat(noReq('port') || '').concat(req('path'));
};

export { applyDefaultRegion, applyDefaultStyles, applyRegionsToUsers, firstUserLens, keysAsIdObj, mapDefaultUsers, parseApiUrl, wrapLocationsWithFeatures };
//# sourceMappingURL=configHelpers.js.map
