export interface Delegation {
  delegator_address: string;
  validator_address: string;
  shares: string;
  balance: {
    denom: string;
    amount: string;
  };
}

export interface UserDelegationsResponse {
  height: string;
  result: ReadonlyArray<Delegation>;
}
