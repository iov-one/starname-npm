import { BroadcastTxSuccess, StdFee } from "@cosmjs/stargate";

export type StargateSignAndPostResult = BroadcastTxSuccess | StdFee;
