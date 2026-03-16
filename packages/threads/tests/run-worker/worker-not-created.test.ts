import { assert, test } from '@codemod-utils/tests';

import { runWorker } from '../../src/index.js';
import { task } from '../helpers/vector/setup.js';

test('run-worker > worker not created', function () {
  assert.throws(
    () => {
      runWorker(task);
    },
    (error: Error) => {
      return (
        error.message ===
        `Cannot destructure property 'datasets' of 'workerData' as it is null.`
      );
    },
  );
});
