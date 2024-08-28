import { assert, test } from '@codemod-utils/tests';

import { doubleColonize } from '../../../../src/index.js';

test('utils | ember | entity-name | double-colonize > edge case (entity name)', function () {
  assert.strictEqual(doubleColonize('tracks'), 'Tracks');
  assert.strictEqual(doubleColonize('navigation-menu'), 'NavigationMenu');
  assert.strictEqual(doubleColonize('ui/page'), 'Ui::Page');
  assert.strictEqual(
    doubleColonize('widgets/widget-3/tour-schedule/responsive-image'),
    'Widgets::Widget3::TourSchedule::ResponsiveImage',
  );
});
