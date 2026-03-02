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
    } catch (error) {
      if (!firstCaughtError) {
        firstCaughtError = error as Error;
      }

      // Re-throw to reject `promise`
      throw error;
    } finally {
      tasksRunning.delete(promise);
    }
  }

  async function spawnTasks(): Promise<void> {
    for (const dataset of datasets) {
      // Don't spawn tasks if an error has occurred
      if (firstCaughtError) {
        break;
      }

      // Wait for a task to complete before spawning more
      if (tasksRunning.size >= MAX_NUM_TASKS_RUNNING) {
        try {
          await Promise.race(tasksRunning);
        } catch {
          // Error is caught here, but handled in `runTask`.
          // Continue to process the remaining tasks.
        }
      }

      // Don't use `await` here. Just spawn the task.
      runTask(...dataset).catch(() => {
        // Errors are already handled in `runTask`.
        // This catch is to prevent `unhandled rejection`` warnings.
      });
    }

    try {
      // Wait for all remaining tasks to complete
      if (tasksRunning.size > 0) {
        await Promise.all(tasksRunning);
      }
    } catch {
      // Error is caught here, but `firstCaughtError` has already been
      // defined in `runTask`
    }
  }

  await spawnTasks();

  if (firstCaughtError) {
    throw firstCaughtError as Error;
  }

  return results;
}
