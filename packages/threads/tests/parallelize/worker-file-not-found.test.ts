import { availableParallelism } from 'node:os';

import { assert, test } from '@codemod-utils/tests';

import { parallelize } from '../../src/index.js';
import { getDatasets, task } from '../helpers/vector/setup.js';

const MIN_NUM_TASKS_PER_WORKER = 100;

test('parallelize > vector (worker file not found)', async function () {
  const numTasks = availableParallelism() * MIN_NUM_TASKS_PER_WORKER;
  const datasets = getDatasets(numTasks);

  await assert.rejects(
    async () => {
      await parallelize(task, datasets, {
        importMetaUrl: import.meta.url,
        workerFilePath: '../helpers/vector/work.js',
      });
    },
    (error: Error) => {
      return (
        error.message ===
        'Worker file not found (workerFilePath: ../helpers/vector/work.js)'
      );
    },
  );
});
