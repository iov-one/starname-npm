import { transformValidUntil } from "../utils/transformValidUntil";
import { Resource } from "./resource";

export interface ApiAccount {
  domain: string;
  name: string;
  owner: string;
  broker: string;
  valid_until: string;
  resources: ReadonlyArray<Resource>;
  certificates: [string];
  metadata_uri: string;
}

export interface Account {
  domain: string;
  name: string;
  owner: string;
  broker: string;
  validUntil: number;
  resources: ReadonlyArray<Resource>;
  certificates: [string];
  metadata_uri: string;
}

export const transformAccountResponse = (account: ApiAccount): Account => {
  return transformValidUntil(account) as Account;
};
