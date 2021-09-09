import { EncodeObject } from "@cosmjs/proto-signing";
import { Coin, StdFee } from "@cosmjs/stargate";
import { TxType } from "starnameRegistry";
import { isKeyOf } from "utils/isKeyOf";

export interface GasConfig {
  readonly gasMap: GasMap;
  readonly gasPrice: Coin;
}

export interface GasMap {
  readonly "/starnamed.x.starname.v1beta1.MsgRenewDomain": number;
  readonly "/starnamed.x.starname.v1beta1.MsgReplaceAccountResources": number;
  readonly "/starnamed.x.starname.v1beta1.MsgTransferDomain": number;
  readonly "cosmos-sdk/MsgSend": number;
  readonly "cosmos-sdk/MsgBeginRedelegate": number;
  readonly default: number;
}

const getResourcesCount = (msg: EncodeObject): number => {
  const { value } = msg;
  if ("newResources" in value) {
    const { newResources } = value;
    return newResources.length;
  } else {
    throw new Error("not a set resources message");
  }
};

export const estimateFee = (
  msgs: ReadonlyArray<EncodeObject>,
  options: GasConfig,
): StdFee => {
  const { gasMap, gasPrice } = options;
  const totalGas = msgs.reduce(
    (totalGas: number, msg: EncodeObject): number => {
      const msgType = msg.typeUrl;
      if (msgType === TxType.Starname.ReplaceAccountResources) {
        const msgGas: number = gasMap[msgType] ?? gasMap.default;
        return Math.max(
          msgGas * getResourcesCount(msg) + gasMap.default / 2,
          gasMap.default / 2,
        );
      } else if (isKeyOf(msgType, gasMap)) {
        return gasMap[msgType];
      } else {
        return gasMap.default;
      }
    },
    0,
  );
  return {
    amount: [
      {
        denom: gasPrice.denom,
        amount: (Number(gasPrice.amount) * totalGas).toFixed(0),
      },
    ],
    gas: totalGas.toFixed(0),
  };
};
