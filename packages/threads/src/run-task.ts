const MAX_NUM_TASKS_RUNNING = 10;

export type Task<T extends unknown[], U> = (...dataset: T) => U | Promise<U>;

export async function runTask<T extends unknown[], U>(
  task: Task<T, U>,
  datasets: T[],
): Promise<U[]> {
  const tasksRunning = new Set<U | Promise<U>>();
  const results: U[] = [];

  let firstCaughtError: Error | undefined = undefined;

  async function runTask(...dataset: T): Promise<void> {
    const promise = task(...dataset);
    tasksRunning.add(promise);

    try {
      const result = await promise;
      results.push(result);
    } finally {
      tasksRunning.delete(promise);
    }
  }

  async function spawnTasks(): Promise<void> {
    for (const dataset of datasets) {
      // Wait for a task to complete before spawning more
      if (tasksRunning.size >= MAX_NUM_TASKS_RUNNING) {
        await Promise.race(tasksRunning);
      }

      runTask(...dataset).catch((error) => {
        if (!firstCaughtError) {
          firstCaughtError = error as Error;
        }
      });
    }

    // Wait for all remaining tasks to complete
    if (tasksRunning.size > 0) {
      await Promise.all(tasksRunning);
    }
  }

  await spawnTasks();

  if (firstCaughtError) {
    throw firstCaughtError as Error;
  }

  return results;
}
