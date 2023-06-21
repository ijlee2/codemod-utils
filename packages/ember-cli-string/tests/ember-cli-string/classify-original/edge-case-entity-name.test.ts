import { assert, test } from '@codemod-utils/tests';

import { classifyOriginal } from '../../../src/index.js';

test('utils | ember-cli-string | classify-original > edge case (entity name)', function () {
  assert.strictEqual(classifyOriginal('tracks'), 'Tracks');
  assert.strictEqual(classifyOriginal('navigation-menu'), 'NavigationMenu');
  assert.strictEqual(classifyOriginal('ui/page'), 'Ui/page');
  assert.strictEqual(
    classifyOriginal('widgets/widget-3/tour-schedule/responsive-image'),
    'Widgets/widget3/tourSchedule/responsiveImage',
  );
});
