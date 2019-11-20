/**
 * Created by Andy Likuski on 2018.06.13
 * Copyright (c) 2018 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {
  googleLocationToLocation, googleLocationToTurfPoint,
  locationToGoogleFunctionalLocation,
  turfBboxToOsmBbox
} from './locationHelpers';
import {googleLocationToTurfLineString} from 'locationHelpers';

describe('locationheleprs', () => {
  test('googleLocationToTurfPoint', () => {
    const location = {
      lat: 38.93237329999999,
      lng: -77.0297374
    };
    expect(googleLocationToTurfPoint(location)).toEqual({
      geometry: {
        coordinates: [-77.0297374, 38.93237329999999],
        type: 'Point'
      }, properties: {}, type: 'Feature'
    });
  });
  test('googleLocationToTurfLineString', () => {
    const locations = [
      {
        lat: 38.93237329999999,
        lng: -77.0297374
      },
      {
        lat: 38.93237329999999,
        lng: -76.0297374
      },
      {
        lat: 37.93237329999999,
        lng: -76.0297374
      }
    ];
    expect(googleLocationToTurfLineString(locations)).toEqual({
      geometry: {
        coordinates: [
          [-77.0297374, 38.93237329999999],
          [-76.0297374, 38.93237329999999],
          [-76.0297374, 37.93237329999999]
        ],
        type: 'LineString'
      }, properties: {}, type: 'Feature'
    });
  });

  test('googleLocationToLocation', () => {
    const location = [
      38.93237329999999,
      -77.0297374
    ];
    expect(googleLocationToLocation(locationToGoogleFunctionalLocation(location))).toEqual(location);
  });

  test('turfBboxToOsmBbox', () => {
    expect(turfBboxToOsmBbox([-10, 20, 10, -20])).toEqual([20, -10, -20, 10]);
  })
});
