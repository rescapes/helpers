/**
 * Created by Andy Likuski on 2019.10.04
 * Copyright (c) 2019 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {mapObjToValues} from 'rescape-ramda';
import * as R from 'ramda';

/**
 * @deprecated We no longer convert. We simply define graphql as an object with primitives represented by key :true
 * Converts our graphql structure to a regular object so we can filter keys
 * @param {Object} graphqlListStructure The structure
 * @returns {Object} An object representation of graphqlListStructure that can be processed with normal object functions.
 * Use convertToGraphqlStructure to return this to its original form
 */
export const convertFromGraphqlStructure = graphqlListStructure => R.compose(
  R.fromPairs,
  // Flatten the pairs
  pairs => R.chain(R.identity, pairs),
  R.map(item =>
    R.cond([
      // attributes to {attribute: true}. Make it a single pair array item
      [R.is(String), obj => [[ obj, true]]],
      // if object, recurse on object values, which are always arrays
      // return the object as pairs so its key/values are merged with the simple [attribute, true] key/values
      [R.is(Object), obj => R.compose(
        R.toPairs,
        R.map(objValue => convertFromGraphqlStructure(objValue))
      )(obj)],
      // reject all else
      [R.T, badThing => {
        throw Error(`Only expected a string or object but got ${badThing}`);
      }]
    ])(item)
  )
)(graphqlListStructure);

// eslint-disable-next-line valid-jsdoc
/**
 * @deprecated We no longer convert. We simply define graphql as an object with primitives represented by key :true
 * Converts an object created with convertFromGraphqlStructure back to our grapqhl structure
 * @param {Object} obj Result of converting using convertFromGraphqlStructure
 * @returns {[Object|String]} The graphqlListStructure. See the regionStore.js's regionOutputParams for an example
 */
export const convertToGraphqlStructure = obj => R.compose(
  R.identity,
  // Convert the key/values to a single attribute or an object
  mapObjToValues(
    (item, key) => R.cond([
      // Simple attributes. Discard item, it's just true
      [R.is(Boolean), R.always(key)],
      // Item is an Object. Convert key: item to {key: [recurse(item)]}
      [R.is(Object), o => ({[key]: convertToGraphqlStructure(o)})],
      // reject all else
      [R.T, badThing => {
        throw Error(`Only expected a boolean or object but got ${badThing}`);
      }]
    ])(item)
  )
)(obj);
