import { Amount } from "./amount";

export interface Balance {
  readonly address: string;
  readonly amount: Amount;
}
