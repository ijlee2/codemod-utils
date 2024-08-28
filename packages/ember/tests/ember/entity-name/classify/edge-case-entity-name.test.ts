import { assert, test } from '@codemod-utils/tests';

import { classify } from '../../../../src/index.js';

test('utils | ember | entity-name | classify > edge case (entity name)', function () {
  assert.strictEqual(classify('tracks'), 'Tracks');
  assert.strictEqual(classify('navigation-menu'), 'NavigationMenu');
  assert.strictEqual(classify('ui/page'), 'UiPage');
  assert.strictEqual(
    classify('widgets/widget-3/tour-schedule/responsive-image'),
    'WidgetsWidget3TourScheduleResponsiveImage',
  );
});
