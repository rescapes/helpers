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
  extractSquareGridBboxesFromBounds, extractSquareGridBboxesFromGeojson,
  googleLocationToLocation, googleLocationToTurfPoint,
  locationToGoogleFunctionalLocation,
  turfBboxToOsmBbox
} from './locationHelpers';
import {googleLocationToTurfLineString} from 'locationHelpers';
import * as R from 'ramda';

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
  });

  test('extractSquareGridBboxesFromBounds', () => {
    expect(
      R.length(extractSquareGridBboxesFromBounds({cellSize: 1, units: 'kilometers'}, [-10, 20, -10.1, 20.1]))
    ).toEqual(
      110
    );
  });

  test('extractSquareGridBboxesFromGeojson', () => {
    const geojsonSmall = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          bbox: [
            7.5845753369431765,
            47.54518372603593,
            7.591459663056825,
            47.547407269100255
          ],
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [
                  7.5845753369431765,
                  47.54518372603593
                ],
                [
                  7.591459663056825,
                  47.54518372603593
                ],
                [
                  7.591459663056825,
                  47.547407269100255
                ],
                [
                  7.5845753369431765,
                  47.547407269100255
                ],
                [
                  7.5845753369431765,
                  47.54518372603593
                ]
              ]
            ]
          }
        }
      ]
    };
    expect(
      R.length(extractSquareGridBboxesFromGeojson({cellSize: 1, units: 'kilometers'}, geojsonSmall))
    ).toEqual(
      1
    );
    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [
                  -78.95736694335936,
                  36.02466804934357
                ],
                [
                  -79.02740478515624,
                  36.09849285185278
                ],
                [
                  -79.01641845703125,
                  36.00300704420516
                ],
                [
                  -79.16404724121094,
                  36.039105412048464
                ],
                [
                  -79.03495788574217,
                  35.9529973954962
                ],
                [
                  -79.19357299804688,
                  35.902399875143615
                ],
                [
                  -79.00131225585938,
                  35.89238773935897
                ],
                [
                  -78.9649200439453,
                  35.81836994517017
                ],
                [
                  -78.95942687988281,
                  35.93632047192033
                ],
                [
                  -78.80561828613281,
                  35.90963007449912
                ],
                [
                  -78.98551940917969,
                  35.97856184167139
                ],
                [
                  -78.85848999023438,
                  36.06963726622717
                ],
                [
                  -78.95736694335936,
                  36.02466804934357
                ]
              ]
            ]
          }
        }
      ]
    };
    expect(
      R.length(extractSquareGridBboxesFromGeojson({cellSize: 1, units: 'kilometers'}, geojson))
    ).toEqual(
      350
    );
  });
});
