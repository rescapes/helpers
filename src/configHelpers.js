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

import * as R from 'ramda';
import {moveToKeys, mergeDeep, reqPathThrowing, reqStrPathThrowing} from 'rescape-ramda';
import PropTypes from 'prop-types';
import {v} from 'rescape-validate';

export const applyDefaultStyles = v((defaultConfig, styles) =>
    mergeDeep(
      defaultConfig,
      {
        styles: {
          // Defaults can be merged with container props and props defined on the component
          default: styles
        }
      }
    ),
  [
    ['defaultConfig', PropTypes.shape().isRequired],
    ['styles', PropTypes.shape().isRequired]
  ], 'applyDefaultStyles');

/**
 * Copies the 'default' region to the keys of the specified regions, removing the default key,
 * and then deep merges.
 * @param {Object} regions keyed by key if an object and valued by region.
 * @returns {Object} The "modified" defaultConfig.regions
 */
export const applyDefaultRegion = v((defaultConfig, regions) =>
    mergeDeep(
      moveToKeys(
        R.lensPath([]),
        'default',
        // Keys of obj or string indexes of array
        R.keys(regions),
        reqPathThrowing(['regions'], defaultConfig)
      ),
      regions
    ),
  [
    ['defaultConfig', PropTypes.shape().isRequired],
    ['regions', PropTypes.oneOfType([PropTypes.shape(), PropTypes.array]).isRequired]
  ], 'applyDefaultRegion');

/**
 * Copies the defaultConfig user keys to the specified users keys, removing the defaultConfig keys
 * This basically clones a template so that it can be merged into each real user
 * The default users of the defaultConfig are copied to the given usersKeys within the defaultConfig,
 * producing a new defaultConfig to merge with the target config
 * @param {Object} defaultConfig The configuration to use
 * @param {Object} defaultUserKeyToUserObjs Maps each default user key of interest to a list of
 * target user keyed objects.
 * E.g.  {
 * {[APP_ADMIN]: {
 *  'phil': {...}
 *  'barbara': {...}
 * }
 * {[MANAGER]: {
 *  'ken': {...}
 *  'billy': {...}
 * }
 * }
 * @returns {Object} The "modified" defaultConfig.users merged into the defaultUserKeyToUserObjs
 */
export const mapDefaultUsers = v((defaultConfig, defaultUserKeyToUserObjs) => {
    const defaultUsers = reqPathThrowing(['users'], defaultConfig);
    return R.mapObjIndexed(
      (users, defaultUserKey) => R.map(
        user => mergeDeep(reqPathThrowing([defaultUserKey], defaultUsers), user),
        users
      ),
      defaultUserKeyToUserObjs
    );
  },
  [
    ['defaultConfig', PropTypes.shape().isRequired],
    ['defaultUserKeyToUserKeys', PropTypes.shape().isRequired]
  ], 'mapDefaultUsers'
);

/**
 * Converts any number of strings to [{string1: {id: string1}, string2: {id: string2}].
 * This is used for associations when only one or a few are expected.
 * @param {Array} args The keys to transform
 * @returns {Object} The object keyed by ids
 */
export const keysAsIdObj = (...args) => R.fromPairs(R.map(key => [key, {id: key}], args));


/**
 * Apply the given regions to the users. This conveniently sets each user to have access to all given regions
 * in the config. It also sets isSelected to the first region for each user
 * @param {Object} regions An object of regions, the keys are assumed to be the ids
 * @param {Object} users An object keyed by user id and valued by user
 * @returns {Object} users with regions key set to a list of id objects (e.g. [{id: 1}, {id: 2}, ...]
 */
export const applyRegionsToUsers = (regions, users) =>
  R.map(
    user => R.set(
      R.lensPath(['regions']),
      R.addIndex(R.map)(
        (id, index) => R.merge(
          {id},
          // Set the first region to isSelected true
          R.ifElse(R.equals(0), R.always({isSelected: true}), R.always({}))(index)),
        R.keys(regions)),
      user),
    users);


// export applyUserSettings = (lens, settings)

export const wrapLocationsWithFeatures = (locations, locationFeatures) =>
  R.mapObjIndexed((locationsByType, locationType) =>
      R.set(R.lensProp('geojson'), reqPathThrowing(), locationType),
    locations
  );

// Get the first user so we can make it the active user for testing
export const firstUserLens = obj => R.lensPath(
  ['users',
    R.head(
      R.keys(
        R.view(
          R.lensPath(['users']),
          obj
        )
      )
    )
  ]
);

/**
 * Parse the apiSettings into a URL
 * @param {Object} apiSettings Contains the following
 * @param {String} apiSettings.protocol Required protocol
 * @param {String} apiSettings.host Required hostname or IP
 * @param {String} apiSettings.port Required port
 * @param {String} apiSettings.path Required path beginning with /
 * @return {string} THe complete URL
 */
export const parseApiUrl = apiSettings => {
  const req = reqStrPathThrowing(R.__, apiSettings);
  return `${req('protocol')}://${req('host')}:${req('port')}${req('path')}`;
};