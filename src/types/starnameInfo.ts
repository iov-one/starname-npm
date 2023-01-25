import { Account } from "./account";
import { Domain } from "./domain";

export interface StarnameInfo extends Omit<Account, "domain"> {
  readonly domain: Domain;
}
