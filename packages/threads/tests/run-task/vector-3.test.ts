import { test } from '@codemod-utils/tests';

import { runTask } from '../../src/index.js';
import { assertOutput, getDatasets, task } from '../helpers/vector/setup.js';

const MAX_NUM_TASKS_RUNNING = 10;

test('run-task > vector (3)', async function () {
  const numTasks = MAX_NUM_TASKS_RUNNING;
  const datasets = getDatasets(numTasks);

  const output = await runTask(task, datasets);

  assertOutput(output);
});
