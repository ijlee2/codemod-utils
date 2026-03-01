import { assert, test } from '@codemod-utils/tests';

import { camelize } from '../../src/index.js';

test('entity-name | camelize > nested', function () {
  assert.strictEqual(camelize('ui/form'), 'uiForm');

  assert.strictEqual(camelize('ui/form/input'), 'uiFormInput');

  assert.strictEqual(camelize('ui/form/submit-button'), 'uiFormSubmitButton');

  assert.strictEqual(
    camelize('widgets/widget-3/tour-schedule/responsive-image'),
    'widgetsWidget3TourScheduleResponsiveImage',
  );
});
