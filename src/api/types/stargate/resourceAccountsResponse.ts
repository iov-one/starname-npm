import { Account } from "proto/types";

import { PaginationPage } from "./page";

export interface ResourceAccountsResponse {
  accounts: ReadonlyArray<Account>;
  page: PaginationPage;
}
