import { EncodeObject } from "@cosmjs/proto-signing";
import { StdFee } from "@cosmjs/stargate";
import config from "config";
import { TxType } from "signers/starnameRegistry";
import { isKeyOf } from "utils/isKeyOf";

const getResourcesCount = (msg: EncodeObject): number => {
  const { value } = msg;
  if ("newResources" in value) {
    const { newResources } = value;
    return newResources.length;
  } else {
    throw new Error("not a set resources message");
  }
};

export const estimateFee = (msgs: ReadonlyArray<EncodeObject>): StdFee => {
  const { gasMap, gasPrice } = config;
  const totalGas = msgs.reduce(
    (totalGas: number, msg: EncodeObject): number => {
      const msgType = msg.typeUrl;
      if (msgType === TxType.Starname.ReplaceAccountResources) {
        const msgGas: number | undefined = gasMap[msgType];
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
