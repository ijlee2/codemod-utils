import { test } from '@codemod-utils/tests';

import { parallelize } from '../../src/index.js';
import { assertOutput, getDatasets, task } from '../helpers/vector/setup.js';

const MIN_NUM_TASKS_PER_WORKER = 100;

test('parallelize > vector (3)', async function () {
  const numTasks = MIN_NUM_TASKS_PER_WORKER;
  const datasets = getDatasets(numTasks);

  const output = await parallelize(task, datasets, {
    importMetaUrl: import.meta.url,
    workerFilePath: '../helpers/vector/worker.js',
  });

  assertOutput(output);
});
