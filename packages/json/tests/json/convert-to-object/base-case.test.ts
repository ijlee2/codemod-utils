import { assert, test } from '@codemod-utils/tests';

import { convertToObject } from '../../../src/index.js';

test('json | convert-to-object > base case', function () {
  const devDependencies = new Map([
    ['ember-cli-htmlbars', '^6.1.1'],
    ['ember-test-selectors', '^6.0.0'],
    ['ember-resize-observer-service', '^1.1.0'],
    ['ember-cli-typescript', '^5.2.1'],
    ['ember-modifier', '^3.2.7'],
    ['ember-element-helper', '^0.6.1'],
    ['ember-cli-babel', '^7.26.11'],
  ]);

  const expectedValue = {
    'ember-cli-babel': '^7.26.11',
    'ember-cli-htmlbars': '^6.1.1',
    'ember-cli-typescript': '^5.2.1',
    'ember-element-helper': '^0.6.1',
    'ember-modifier': '^3.2.7',
    'ember-resize-observer-service': '^1.1.0',
    'ember-test-selectors': '^6.0.0',
  };

  assert.deepStrictEqual(convertToObject(devDependencies), expectedValue);
});
