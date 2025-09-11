import { assert, test } from '@codemod-utils/tests';

import { pascalize } from '../../../src/index.js';

test('entity-name | pascalize > nested', function () {
  assert.strictEqual(pascalize('ui/form'), 'UiForm');

  assert.strictEqual(pascalize('ui/form/input'), 'UiFormInput');

  assert.strictEqual(pascalize('ui/form/submit-button'), 'UiFormSubmitButton');

  assert.strictEqual(
    pascalize('widgets/widget-3/tour-schedule/responsive-image'),
    'WidgetsWidget3TourScheduleResponsiveImage',
  );
});
