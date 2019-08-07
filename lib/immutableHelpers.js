'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var R = require('ramda');
var rescapeRamda = require('rescape-ramda');
var immutable = require('immutable');

/**
 * Created by Andy Likuski on 2017.09.04
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/* a
 * Convert the obj to an Immutable if it is not.
 * @param {Object} obj a An Immutable or anything else
 * @returns {Immutable} The object as an immutable
 * toImmutable:: Immutable b = a -> b
 *            :: Immutable b = b -> b
 */

var toImmutable = function toImmutable(obj) {
  return immutable.Iterable.isIterable(obj) ? obj : immutable.fromJS(obj);
};
/**
 * Converts an Immutable to javascript if it's an Immutable
 * @param {Immutable|Object} obj The object to convert.
 * @returns {Object} The object as plain javascript.
 * toJS:: Immutable a = a -> b
 */

var toJS = function toJS(obj) {
  return obj.toJS ? obj.toJS() : obj;
};
/**
 * Convert the Immutable to plain JS if it is not
 * @param {Object} obj The immutable object to convert
 * @returns {Object} The plain JS object
 * fromImmutable:: Immutable b = b -> a
 *              :: a-> a
 */

var fromImmutable = function fromImmutable(obj) {
  return R.ifElse(immutable.Iterable.isIterable, toJS, R.when(Array.isArray, R.map(fromImmutable)))(obj);
};
/** *
 * Creates a partial function that expects a property of an object which in turn returns a function that
 * expects a listOrObj
 * If listOrObj is not already object, the function converts an array to an Immutable keyed by each array items id.
 * If already an object, it just makes it immutable
 * @param listOrObj
 * @returns {Immutable} The immutable
 * mapPropValueAsIndex:: Immutable m = {j, {k, v}} -> m {j, {k, v}}
 *                    :: Immutable m = [{k, v}] -> m {j, {k, v}}
 */

var toImmutableKeyedByProp = R.curry(function (prop, objs) {
  return R.pipe(R.when(Array.isArray, rescapeRamda.mapPropValueAsIndex(prop)), toImmutable)(objs);
});
/**
 * Use immutable to make a deep copy of an object
 * copy:: a -> a
 */

var copy = R.compose(toJS, toImmutable);

exports.copy = copy;
exports.fromImmutable = fromImmutable;
exports.toImmutable = toImmutable;
exports.toImmutableKeyedByProp = toImmutableKeyedByProp;
exports.toJS = toJS;
//# sourceMappingURL=immutableHelpers.js.map
