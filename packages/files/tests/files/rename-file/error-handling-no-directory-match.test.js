import { assert, test } from '@codemod-utils/tests';

import { renameFile } from '../../../src/index.js';

test('files | rename-file > error handling (no directory match)', function () {
  const oldFilePath = 'app/components/navigation-menu/component.js';

  assert.throws(
    () => {
      renameFile(oldFilePath, {
        find: {
          directory: 'addon/components',
          file: 'component',
        },
        replace: (key) => {
          return `addon/components/${key}`;
        },
      });
    },
    (error) => {
      assert.strictEqual(
        error.message,
        "ERROR: The provided path `app/components/navigation-menu/component.js` doesn't match the directory pattern `addon/components`.\n",
      );

      return true;
    },
  );
});
