import { StdFee } from "@cosmjs/amino";
import { EncodeObject } from "@cosmjs/proto-signing";
import { GasConfig } from "../utils/estimateFee";

export type FeeEstimator = (
  msgs: ReadonlyArray<EncodeObject>,
  gasConfig: GasConfig,
) => StdFee;
