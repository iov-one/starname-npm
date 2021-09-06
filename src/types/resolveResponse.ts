import { Account, Domain } from "proto/types";

export interface Starname extends Omit<Account, "domain"> {
  readonly domain: Domain;
}
