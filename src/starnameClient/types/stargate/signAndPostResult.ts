import { DeliverTxResponse, StdFee } from "@cosmjs/stargate";

export type StargateSignAndPostResult = DeliverTxResponse | StdFee;
