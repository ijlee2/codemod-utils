import { assert, test } from '@codemod-utils/tests';

import { runTask } from '../../../src/-private/index.js';
import { getDatasets, taskThatErrors } from '../../helpers/vector/setup.js';

const MAX_NUM_TASKS_RUNNING = 10;

test('-private | run-worker > vector (error)', async function () {
  const numTasks = MAX_NUM_TASKS_RUNNING;
  const datasets = getDatasets(numTasks);

  await assert.rejects(
    async () => {
      await runTask(taskThatErrors, datasets);
    },
    (error: Error) => {
      return error.message === 'Could not run task-1';
    },
  );
});
