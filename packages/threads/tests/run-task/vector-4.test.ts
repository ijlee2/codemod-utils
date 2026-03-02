import { test } from '@codemod-utils/tests';

import { runTask } from '../../src/index.js';
import { assertOutput, getDatasets, task } from '../helpers/vector/index.js';

const MAX_NUM_TASKS_RUNNING = 10;

test('run-task > vector (4)', async function () {
  const numTasks = MAX_NUM_TASKS_RUNNING + 1;
  const datasets = getDatasets(numTasks);

  const output = await runTask(task, datasets);

  assertOutput(output);
});
