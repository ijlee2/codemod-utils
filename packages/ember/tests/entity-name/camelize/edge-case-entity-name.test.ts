import { assert, test } from '@codemod-utils/tests';

import { camelize } from '../../../src/index.js';

test('entity-name | camelize > edge case (entity name)', function () {
  assert.strictEqual(camelize('tracks'), 'tracks');
  assert.strictEqual(camelize('navigation-menu'), 'navigationMenu');
  assert.strictEqual(camelize('ui/page'), 'ui/page');
  assert.strictEqual(
    camelize('widgets/widget-3/tour-schedule/responsive-image'),
    'widgets/widget3/tourSchedule/responsiveImage',
  );
});
