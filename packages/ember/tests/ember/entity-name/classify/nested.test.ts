import { assert, test } from '@codemod-utils/tests';

import { classify } from '../../../../src/index.js';

test('utils | ember | entity-name | classify > nested', function () {
  assert.strictEqual(classify('ui/form'), 'UiForm');

  assert.strictEqual(classify('ui/form/input'), 'UiFormInput');

  assert.strictEqual(classify('ui/form/submit-button'), 'UiFormSubmitButton');

  assert.strictEqual(
    classify('widgets/widget-3/tour-schedule/responsive-image'),
    'WidgetsWidget3TourScheduleResponsiveImage',
  );
});
