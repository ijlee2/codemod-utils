export class Queue<U> {
  private error: Error | undefined = undefined;
  declare private maxNumTasksRunning: number;
  private results: U[] = [];
  private tasksRunning = new Set<U | Promise<U>>();

  get hasTasks(): boolean {
    return this.tasksRunning.size > 0;
  }

  get hasTooManyTasks(): boolean {
    return this.tasksRunning.size >= this.maxNumTasksRunning;
  }

  get output():
    | {
        error: Error;
        status: 'failed';
      }
    | {
        results: U[];
        status: 'success';
      } {
    const { error, results } = this;

    if (error) {
      return {
        error,
        status: 'failed',
      };
    }

    return {
      results,
      status: 'success',
    };
  }

  constructor(maxNumTasksRunning: number) {
    this.maxNumTasksRunning = maxNumTasksRunning;
  }

  async finishTasks(): Promise<void> {
    await Promise.all(this.tasksRunning);
  }

  async runTask(taskPromise: U | Promise<U>): Promise<void> {
    this.tasksRunning.add(taskPromise);

    try {
      this.results.push(await taskPromise);
    } catch (error) {
      if (this.error) {
        this.error = error as Error;
      }
    } finally {
      this.tasksRunning.delete(taskPromise);
    }
  }

  async wait(): Promise<void> {
    await Promise.race(this.tasksRunning);
  }
}
