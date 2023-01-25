import { StdFee } from "@cosmjs/amino";
import { EncodeObject } from "@cosmjs/proto-signing";

export type FeeEstimator = (msgs: ReadonlyArray<EncodeObject>) => StdFee;
