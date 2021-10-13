import { Coin } from "@cosmjs/amino";

import { PaginationPage } from "./page";

export interface StargateBalanceResponse {
  balances: ReadonlyArray<Coin>;
  pagination: PaginationPage;
}
