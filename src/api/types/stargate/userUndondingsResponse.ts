import { Unbonding } from "types/unbondingsResponse";

import { PaginationPage } from "./page";

export interface StargateUserUnbondingsResponse {
  unbonding_responses: ReadonlyArray<Unbonding>;
  pagination: PaginationPage;
}
