import { assert, test } from '@codemod-utils/tests';

import { camelize } from '../../../../src/index.js';

test('utils | ember | entity-name | camelize > wrong input', function () {
  assert.strictEqual(camelize(''), '');

  assert.strictEqual(camelize('-'), '');

  assert.strictEqual(camelize('/'), '');

  assert.strictEqual(camelize('ui/'), 'ui');

  assert.strictEqual(camelize('/ui'), 'ui');

  assert.strictEqual(camelize('ui.form.input'), 'ui.form.input');

  assert.strictEqual(camelize('ui_form_input'), 'ui_form_input');

  assert.strictEqual(camelize('ui form input'), 'ui form input');
});
