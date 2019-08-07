'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var rescapeRamda = require('rescape-ramda');

/**
 * Created by Andy Likuski on 2017.06.06
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * Given a task, wraps it in promise and passes it to Jest's expect.
 * With this you can call resolves or rejects depending on whether success or failure is expected:
 * expectTask(task).resolves|rejects
 * @param {Task} task Task wrapped in a Promise and forked
 * @returns {undefined}
 */

var expectTask = function expectTask(task) {
  return expect(rescapeRamda.taskToPromise(task));
};
/**
 * Same as expectTask but expects a rejects so diables debugging
 * @param {Task} task The Task
 * @returns {undefined}
 */

var expectTaskRejected = function expectTaskRejected(task) {
  return expect(rescapeRamda.taskToPromise(task, true));
};
/**
 * Converts an Result to a Promise. Result.Ok calls resolve and Result.Left calls reject
 * @param {Object} result The result
 * @returns {Promise} The promise
 */

var resultToPromise = function resultToPromise(result) {
  return new Promise(function (resolve, reject) {
    return result.map(resolve).mapError(reject);
  });
};

exports.expectTask = expectTask;
exports.expectTaskRejected = expectTaskRejected;
exports.resultToPromise = resultToPromise;
//# sourceMappingURL=testHelpers.js.map