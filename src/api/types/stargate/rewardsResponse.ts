import { Coin } from "@cosmjs/amino";
import { Reward } from "types/rewardsResponse";

export interface StargateRewardsResponse {
  rewards: ReadonlyArray<Reward>;
  total: ReadonlyArray<Coin>;
}
