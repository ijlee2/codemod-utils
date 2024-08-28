import { assert, test } from '@codemod-utils/tests';

import { doubleColonize } from '../../../../src/index.js';

test('utils | ember | entity-name | double-colonize > wrong input', function () {
  assert.strictEqual(doubleColonize(''), '');

  assert.strictEqual(doubleColonize('-'), '');

  assert.strictEqual(doubleColonize('/'), '::');

  assert.strictEqual(doubleColonize('ui/'), 'Ui::');

  assert.strictEqual(doubleColonize('/ui'), '::Ui');

  assert.strictEqual(doubleColonize('ui.form.input'), 'Ui.Form.Input');

  assert.strictEqual(doubleColonize('ui_form_input'), 'UiFormInput');

  assert.strictEqual(doubleColonize('ui form input'), 'UiFormInput');
});
