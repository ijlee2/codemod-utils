import { assert, test } from '@codemod-utils/tests';

import { parallelize } from '../../src/index.js';
import { getDatasets, taskThatErrors } from '../helpers/vector/setup.js';

const MIN_NUM_TASKS_PER_WORKER = 100;

test('parallelize > vector (error)', async function () {
  const numTasks = MIN_NUM_TASKS_PER_WORKER - 1;
  const datasets = getDatasets(numTasks);

  await assert.rejects(
    async () => {
      await parallelize(taskThatErrors, datasets, {
        importMetaUrl: import.meta.url,
        workerFilePath: '../helpers/vector/worker.js',
      });
    },
    (error: Error) => {
      return error.message === 'Could not run task-1';
    },
  );
});
