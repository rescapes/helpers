import { ifElse, when, map, curry, pipe, compose } from 'ramda';
import { mapPropValueAsIndex } from 'rescape-ramda';
import { Iterable, fromJS } from 'immutable';

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
  return Iterable.isIterable(obj) ? obj : fromJS(obj);
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
  return ifElse(Iterable.isIterable, toJS, when(Array.isArray, map(fromImmutable)))(obj);
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

var toImmutableKeyedByProp = curry(function (prop, objs) {
  return pipe(when(Array.isArray, mapPropValueAsIndex(prop)), toImmutable)(objs);
});
/**
 * Use immutable to make a deep copy of an object
 * copy:: a -> a
 */

var copy = compose(toJS, toImmutable);

export { copy, fromImmutable, toImmutable, toImmutableKeyedByProp, toJS };
//# sourceMappingURL=immutableHelpers.js.map
