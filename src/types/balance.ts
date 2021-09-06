import { Amount } from "types/amount";

export interface Balance {
  readonly address: string;
  readonly amount: Amount;
}
