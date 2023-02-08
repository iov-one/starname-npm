import { Account } from "./account";
import { Domain } from "./domain";

export interface StarnameInfo {
  readonly domainInfo: Domain;
  readonly accountInfo: Account | null;
}
