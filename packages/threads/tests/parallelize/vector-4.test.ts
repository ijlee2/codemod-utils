import { availableParallelism } from 'node:os';

import { test } from '@codemod-utils/tests';

import { parallelize } from '../../src/index.js';
import { assertOutput, getDatasets, task } from '../helpers/vector/index.js';

const MIN_NUM_TASKS_PER_WORKER = 100;

test('parallelize > vector (4)', async function () {
  const numTasks = availableParallelism() * MIN_NUM_TASKS_PER_WORKER;
  const datasets = getDatasets(numTasks);

  const output = await parallelize(task, datasets, {
    importMetaUrl: import.meta.url,
    workerFilePath: '../helpers/vector/worker.js',
  });

  assertOutput(output);
});
