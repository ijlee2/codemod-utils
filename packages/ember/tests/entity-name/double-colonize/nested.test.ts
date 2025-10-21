import { assert, test } from '@codemod-utils/tests';

import { doubleColonize } from '../../../src/index.js';

test('entity-name | double-colonize > nested', function () {
  assert.strictEqual(doubleColonize('ui/form'), 'Ui::Form');
  assert.strictEqual(doubleColonize('ui/form/input'), 'Ui::Form::Input');
  assert.strictEqual(
    doubleColonize('ui/form/submit-button'),
    'Ui::Form::SubmitButton',
  );
  assert.strictEqual(
    doubleColonize('widgets/widget-3/tour-schedule/responsive-image'),
    'Widgets::Widget-3::TourSchedule::ResponsiveImage',
  );
});
