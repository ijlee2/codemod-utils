import { assert, test } from '@codemod-utils/tests';

import { renamePathByFile } from '../../../src/index.js';

test('files | rename-path-by-file > error handling (no file match)', function () {
  const oldFilePath = 'addon/components/navigation-menu/template.hbs';

  assert.throws(
    () => {
      renamePathByFile(oldFilePath, {
        find: {
          directory: 'addon/components',
          file: 'component',
        },
        replace: (key) => {
          return `addon/components/${key}`;
        },
      });
    },
    (error: Error) => {
      assert.strictEqual(
        error.message,
        "ERROR: The provided path `addon/components/navigation-menu/template.hbs` doesn't match the file pattern `component`.\n",
      );

      return true;
    },
  );
});
