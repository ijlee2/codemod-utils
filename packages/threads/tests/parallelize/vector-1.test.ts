import { test } from '@codemod-utils/tests';

import { parallelize } from '../../src/index.js';
import { assertOutput, getDatasets, task } from '../helpers/vector/index.js';

test('parallelize > vector (1)', async function () {
  const numTasks = 0;
  const datasets = getDatasets(numTasks);

  const output = await parallelize(task, {
    datasets,
    workerFilePath: '../tests/helpers/vector/worker.js',
  });

  assertOutput(output);
});
