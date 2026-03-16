import { test } from '@codemod-utils/tests';

import { runTask } from '../../../src/-private/run-task.js';
import { assertOutput, getDatasets, task } from '../../helpers/vector/setup.js';

const MAX_NUM_TASKS_RUNNING = 10;

test('-private | run-task > vector (5)', async function () {
  const numTasks = 3 * MAX_NUM_TASKS_RUNNING;
  const datasets = getDatasets(numTasks);

  const output = await runTask(task, datasets);

  assertOutput(output);
});
