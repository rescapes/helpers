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

/**
 * Copies the 'default' region to the specified region keys.
 * This basically clones a template so that it can be merged into each real region
 * @param {Object} defaultConfig The defaultConfig being merged into another config
 * The default region of this config is copied to the given regionKeys
 * @param {String[]} regionKeys The region keys to target.
 * @returns {Object} The "modified" defaultConfig
 */
import {applyDefaultRegion, mapDefaultUsers, keysAsIdObj, applyRegionsToUsers} from './configHelpers.js';
import * as R from 'ramda';
import {reqPathThrowing, findOneValueByParamsThrowing} from '@rescapes/ramda';
import {parseApiUrl} from 'configHelpers';

const APP_ADMIN = 'app_admin';
const REGION_MANAGER = 'region_manager';
const REGION_USER = 'region_user';
const REGION_VISITOR = 'region_visitor';

describe('configHelpers', () => {
  const defaultRegion = {
    id: 'aTemplateRegion'
  };

  const defaultUsers = [
    {
      templateKey: APP_ADMIN,
      regions: {}
    },
    {
      templateKey: REGION_MANAGER,
      regions: {}
    },
    {
      templateKey: REGION_USER,
      regions: {}
    },
    {
      templateKey: REGION_VISITOR,
      regions: {}
    }
  ];
  test('applyDefaultRegion', () => {
    const regions = {
      kamchatka: {
        id: 'kamchatka',
        name: 'Kamchatka',
        wildcats: {
          servals: 2
        }
      },
      saskatoon: {
        id: 'saskatoon',
        name: 'Saskatoon',
        crops: ['berries']
      }
    };
    expect(
      R.keys(applyDefaultRegion(defaultRegion, regions).kamchatka).sort()
    ).toEqual(
      R.keys(
        R.mergeRight(
          regions.kamchatka,
          defaultRegion
        )
      ).sort()
    );
  });

  test('mapDefaultUsers', () => {
    const realUsers = {
      linus: {
        permissions: {
          b: 'Security Blanket'
        }
      },
      lucy: {
        permissions: {
          b: 'Psychiatrist'
        }
      },
      pigpen: {
        permissions: {
          b: 'Stink'
        }
      }
    };

    const mergedConfig = mapDefaultUsers(defaultUsers, {
      [REGION_MANAGER]: R.pick(['linus', 'lucy'], realUsers),
      [REGION_USER]: R.pick(['pigpen'], realUsers)
    });

    expect(
      R.keys(reqPathThrowing([REGION_MANAGER, 'linus'], mergedConfig)).sort()
    ).toEqual(
      R.keys(
        R.mergeRight(
          realUsers.linus,
          findOneValueByParamsThrowing({templateKey: REGION_MANAGER}, defaultUsers)
        )
      ).sort()
    );
  });

  test('keyAsIdObj', () => {
    expect(
      keysAsIdObj('smoothie', 'song')
    ).toEqual(
      {
        smoothie: {id: 'smoothie'},
        song: {id: 'song'}
      }
    );
  });

  test('applyRegionsToUsers', () => {
    const regions = {
      a: {id: 'a', name: 'A'},
      b: {id: 'b', name: 'B'}
    };
    const users = {
      y: {id: 'y', name: 'Y'},
      z: {id: 'z', name: 'Z'}
    };
    expect(applyRegionsToUsers(regions, users)).toEqual(
      {
        y: {id: 'y', name: 'Y', regions: [{id: 'a', isSelected: true}, {id: 'b'}]},
        z: {id: 'z', name: 'Z', regions: [{id: 'a', isSelected: true}, {id: 'b'}]}
      }
    );
  });

  test('parseApiUrl', () => {
    expect(parseApiUrl({protocol: 'https', host: 'googoo.dolls', port: 1998, path: '/iris/'})).toEqual(
      'https://googoo.dolls:1998/iris/'
    );
    expect(parseApiUrl({protocol: 'https', host: 'googoo.dolls', port: null, path: '/iris/'})).toEqual(
      'https://googoo.dolls/iris/'
    );
  });
});
