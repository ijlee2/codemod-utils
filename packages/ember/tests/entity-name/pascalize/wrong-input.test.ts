import { assert, test } from '@codemod-utils/tests';

import { pascalize } from '../../../src/index.js';

test('entity-name | pascalize > wrong input', function () {
  assert.strictEqual(pascalize(''), '');

  assert.strictEqual(pascalize('-'), '');

  assert.strictEqual(pascalize('/'), '');

  assert.strictEqual(pascalize('ui/'), 'Ui');

  assert.strictEqual(pascalize('/ui'), 'Ui');

  assert.strictEqual(pascalize('ui.form.input'), 'Ui.form.input');

  assert.strictEqual(pascalize('ui_form_input'), 'Ui_form_input');

  assert.strictEqual(pascalize('ui form input'), 'Ui form input');
});
