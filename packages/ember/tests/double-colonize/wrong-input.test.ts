import { assert, test } from '@codemod-utils/tests';

import { doubleColonize } from '../../src/index.js';

test('entity-name | double-colonize > wrong input', function () {
  assert.strictEqual(doubleColonize(''), '');

  assert.strictEqual(doubleColonize('-'), '');

  assert.strictEqual(doubleColonize('/'), '::');

  assert.strictEqual(doubleColonize('ui/'), 'Ui::');

  assert.strictEqual(doubleColonize('/ui'), '::Ui');

  assert.strictEqual(doubleColonize('ui.form.input'), 'Ui.form.input');

  assert.strictEqual(doubleColonize('ui_form_input'), 'Ui_form_input');

  assert.strictEqual(doubleColonize('ui form input'), 'Ui form input');
});
