import { assert, test } from '@codemod-utils/tests';

import { invertDoubleColonize } from '../../src/index.js';

test('invert-double-colonize > wrong input', function () {
  assert.strictEqual(invertDoubleColonize(''), '');

  assert.strictEqual(invertDoubleColonize('::'), '/');

  assert.strictEqual(invertDoubleColonize('Ui::'), 'ui/');

  assert.strictEqual(invertDoubleColonize('::Ui'), '/ui');

  assert.strictEqual(invertDoubleColonize('Ui.form.input'), 'ui.form.input');

  assert.strictEqual(invertDoubleColonize('Ui_form_input'), 'ui_form_input');

  assert.strictEqual(invertDoubleColonize('Ui form input'), 'ui form input');
});
