import { GasConfig } from "./estimateFee";

export const defaultGasConfig: GasConfig = {
  gasMap: {
    "/starnamed.x.starname.v1beta1.MsgRenewDomain": 250000,
    "/starnamed.x.starname.v1beta1.MsgReplaceAccountResources": 10000,
    "/starnamed.x.starname.v1beta1.MsgTransferDomain": 250000,
    "cosmos-sdk/MsgSend": 80000,
    "cosmos-sdk/MsgBeginRedelegate": 250000,
    default: 200000,
  },
  gasPrice: {
    denom: "uiov",
    amount: "2",
  },
};
