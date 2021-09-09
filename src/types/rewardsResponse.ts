import { Coin } from "@cosmjs/amino";

export interface Reward {
  readonly validator_address: string;
  readonly reward: ReadonlyArray<Coin>;
}

export interface RewardsResponse {
  readonly height: string;
  readonly result: {
    readonly rewards: ReadonlyArray<Reward>;
    readonly total: ReadonlyArray<Coin>;
  };
}
