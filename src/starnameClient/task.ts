import { FetchError } from "../starnameClient/http";

export interface Task<T> {
  run(): Promise<T>;
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

export type TaskError = Error;

export const TaskAbortedError: FetchError = new FetchError(-1, "Aborted", [
  "Task Aborted",
]);
