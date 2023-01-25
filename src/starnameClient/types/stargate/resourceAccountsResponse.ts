import { ApiAccount } from "../../../types/account";
import { PaginationPage } from "./page";

export interface ResourceAccountsResponse {
  accounts: ReadonlyArray<ApiAccount>;
  page: PaginationPage;
}
