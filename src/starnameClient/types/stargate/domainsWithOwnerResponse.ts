import { StargateDomain } from "./domain";
import { PaginationPage } from "./page";

export interface DomainsWithOwnerResponse {
  domains: ReadonlyArray<StargateDomain>;
  page: PaginationPage;
}
