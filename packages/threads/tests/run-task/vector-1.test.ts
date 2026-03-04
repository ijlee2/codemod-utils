import { test } from '@codemod-utils/tests';

import { runTask } from '../../src/index.js';
import { assertOutput, getDatasets, task } from '../helpers/vector/setup.js';

test('run-task > vector (1)', async function () {
  const numTasks = 0;
  const datasets = getDatasets(numTasks);

  const output = await runTask(task, datasets);

  assertOutput(output);
});
