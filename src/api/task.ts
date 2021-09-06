export interface Task<T> {
  run(): T | Promise<T>;
  abort(): void;
}

export class Task<T> implements Task<T> {
  public static toPromise<T>(task: Task<T>): Promise<T> {
    return task.run();
  }

  public run(): Promise<T> {
    throw new Error("tasks must implement run");
  }

  public abort(): void {
    throw new Error("tasks must implement abort");
  }
}
