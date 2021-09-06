import { PaginationPage } from "./page";
import { StargateValidator } from "./validatorResponse";

export interface StargateValidatorsResponse {
  validators: ReadonlyArray<StargateValidator>;
  pagination: PaginationPage;
}
