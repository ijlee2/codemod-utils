import { assert, test } from '@codemod-utils/tests';

import { classify } from '../../../../src/index.js';

test('utils | ember | entity-name | classify > wrong input', function () {
  assert.strictEqual(classify(''), '');

  assert.strictEqual(classify('-'), '');

  assert.strictEqual(classify('/'), '');

  assert.strictEqual(classify('ui/'), 'Ui');

  assert.strictEqual(classify('/ui'), 'Ui');

  assert.strictEqual(classify('ui.form.input'), 'Ui.Form.Input');

  assert.strictEqual(classify('ui_form_input'), 'UiFormInput');

  assert.strictEqual(classify('ui form input'), 'UiFormInput');
});
