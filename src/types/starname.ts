import { Account } from "./account";
import { Domain } from "./domain";

export type Starname = Account | Domain;

export const isDomain = (obj: Domain | any): obj is Domain => {
  if (obj.admin !== undefined && typeof obj.admin === "string") return true;
  return false;
};

export const isAccount = (obj: Account | any): obj is Account => {
  if (obj.owner !== undefined && typeof obj.owner === "string") return true;
  return false;
};
