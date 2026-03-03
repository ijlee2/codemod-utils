import { assert, test } from '@codemod-utils/tests';

import { invertDoubleColonize } from '../../src/index.js';

test('invert-double-colonize > nested', function () {
  assert.strictEqual(invertDoubleColonize('Ui::Form'), 'ui/form');

  assert.strictEqual(invertDoubleColonize('Ui::Form::Input'), 'ui/form/input');

  assert.strictEqual(
    invertDoubleColonize('Ui::Form::SubmitButton'),
    'ui/form/submit-button',
  );

  assert.strictEqual(
    invertDoubleColonize('Widgets::Widget-3::TourSchedule::ResponsiveImage'),
    'widgets/widget-3/tour-schedule/responsive-image',
  );

  assert.strictEqual(
    invertDoubleColonize('Rezept::ÄpfelUndÖl'),
    'rezept/äpfel-und-öl',
  );
});
