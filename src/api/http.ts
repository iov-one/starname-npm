import { Block } from "@cosmjs/stargate";
import { Task } from "api/task";

export interface BlockchainError {
  readonly message: string;
  readonly code: number;
  readonly details: ReadonlyArray<string>;
}

const isBlockchainError = (error: any): error is BlockchainError => {
  return "message" in error && "code" in error;
};

export class FetchError implements Error {
  readonly code: number;
  readonly message: string;
  readonly name: string;
  readonly details: ReadonlyArray<string>;

  constructor(code: number, message: string, details: ReadonlyArray<string>) {
    this.code = code;
    this.message = message;
    this.name = "Task Error";
    this.details = details;
  }
}

export const TaskAbortedError: FetchError = new FetchError(-1, "Aborted", [
  "Task Aborted",
]);

const buildResponseBody = <T>(response: Response): Promise<T> => {
  const { headers } = response;
  const contentType = headers.get("content-type");
  if (contentType === null) return response.text() as any;
  if (contentType.includes("application/json")) {
    return response.json();
  } else {
    return response.text() as any;
  }
};

const resolveAllMembers = async (generic: {
  [key: string]: any;
}): Promise<{ [key: string]: any }> => {
  const entries: ReadonlyArray<[string, any]> = Object.entries(generic);
  const resolved: ReadonlyArray<[string, any]> = await Promise.all(
    entries.map(async ([key, value]: [string, any]): Promise<[string, any]> => {
      return [key, await value];
    }),
  );
  return resolved.reduce(
    (
      object: { [key: string]: any },
      entry: [string, any],
    ): { [key: string]: any } => {
      return { ...object, [entry[0]]: entry[1] };
    },
    {},
  );
};

const request = <T>(
  method: string,
  url: string,
  data?: { [key: string]: any },
): Task<T> => {
  const abortController = new AbortController();

  return {
    run: async (): Promise<T> => {
      const resolvedData: { [key: string]: any } | undefined = data
        ? await resolveAllMembers(data)
        : undefined;

      const response = await fetch(url, {
        method: method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(resolvedData),
        signal: abortController.signal,
      });

      if (response.status > 199 && response.status < 300) {
        return buildResponseBody<T>(response);
      } else {
        const error = await response.json();
        if (isBlockchainError(error)) {
          throw new FetchError(error.code, error.message, error.details);
        } else if ("message" in error) {
          throw new Error(error.message);
        } else if ("error" in error) {
          throw new Error(error);
        } else {
          throw new Error(JSON.stringify(error));
        }
      }
    },
    abort: (): void => {
      abortController.abort();
    },
  };
};

export const Get = <T>(url: string): Task<T> => request<T>("GET", url);
export const Post = <T, D = any>(url: string, data: D | Promise<D>): Task<T> =>
  request<T>("POST", url, data);
