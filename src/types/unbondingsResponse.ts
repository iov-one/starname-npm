export interface Unbonding {
  readonly delegator_address: string;
  readonly validator_address: string;
  readonly entries: ReadonlyArray<{
    readonly initial_balance: string;
    readonly balance: string;
    readonly creation_height: string;
    readonly completion_time: string;
  }>;
}

export interface UnbondingResponse {
  readonly height: string;
  readonly result: ReadonlyArray<Unbonding>;
}
