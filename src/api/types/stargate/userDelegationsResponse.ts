import { Delegation } from "types/userDelegationsResponse";

import { PaginationPage } from "./page";

export interface StargateUserDelegationsResponse {
  delegation_responses: ReadonlyArray<Delegation>;
  pagination: PaginationPage;
}
