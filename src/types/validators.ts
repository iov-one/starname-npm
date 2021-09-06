import { FormStatus } from "forms";

export interface ValidatorResult {
  status: FormStatus;
  error: string | undefined;
}

export type ValidatorFn = (value: string) => ValidatorResult;
