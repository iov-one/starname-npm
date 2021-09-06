export interface PagedResponse {
  readonly total_count: number;
  readonly count: number;
  readonly page_number: number;
  readonly page_total: number;
  readonly limit: number;
}

export interface ResponsePage<T> {
  readonly pages: number /* page_total */;
  readonly page: number /* page_number */;
  readonly requested: number /* limit */;
  readonly received: number /* count? */;
  readonly total: number /* total_count */;
  readonly items: ReadonlyArray<T>;
}
