import { AminoMsg } from "@cosmjs/amino";
import {
  isAminoMsgBeginRedelegate,
  isAminoMsgDelegate,
  isAminoMsgUndelegate,
} from "@cosmjs/stargate";
import { Log } from "@cosmjs/stargate/build/logs";

import { StarnameClient } from "../starnameClient";
import { AminoType } from "../types/aminoTypes";
import { Amount } from "../types/amount";
import { Validator } from "../types/delegationValidator";
import { getValidator, reverseLookup } from "../utils/getTransaction";
import { StarnameInfo as StarnameData } from "./starnameInfo";

export interface BaseTx {
  height: number;
  gas_used: string;
  gas_wanted: string;
  logs: ReadonlyArray<Log>;
  raw_log: string;
  timestamp: string;
  tx: AminoMsg;
  txhash: string;
}

export interface RedelegationData {
  readonly src: Validator;
  readonly dst: Validator;
}

export type DelegationData = Validator;

export interface Transaction {
  readonly id: string;
  readonly type: any;
  readonly amount: ReadonlyArray<Amount>;
  readonly data: StarnameData | RedelegationData | DelegationData | string;
  readonly fee: ReadonlyArray<Amount>;
  readonly time: Date;
  readonly note?: string;
  readonly escrowId?: string;
  readonly sender?: string;
  readonly seller?: string;
  readonly buyer?: string;
  readonly updater?: string;
  readonly deadline?: Date;
}

export class Transaction {
  static async fromRedelegateBaseTx(
    starnameClient: StarnameClient,
    baseTx: BaseTx,
  ): Promise<Transaction> {
    const { value: stdTx } = baseTx.tx;
    const {
      fee,
      memo,
      msg: [message],
    } = stdTx;
    const { value } = message;
    if (!isAminoMsgBeginRedelegate(message)) {
      throw new Error("cannot parse transaction");
    }
    return {
      amount: starnameClient.toInternalCoins([value.amount]),
      fee: starnameClient.toInternalCoins(fee.amount),
      data: {
        src: await getValidator(starnameClient, value.validator_src_address),
        dst: await getValidator(starnameClient, value.validator_dst_address),
      },
      sender: await reverseLookup(starnameClient, value.delegator_address),
      id: baseTx.txhash,
      type: message.type as AminoType,
      time: new Date(baseTx.timestamp),
      note: memo,
    };
  }

  static async fromStakingBaseTx(
    starnameClient: StarnameClient,
    baseTx: BaseTx,
  ): Promise<Transaction> {
    const { value: stdTx } = baseTx.tx;
    const {
      fee,
      memo,
      msg: [message],
    } = stdTx;
    const { value } = message;
    if (!isAminoMsgDelegate(message) && !isAminoMsgUndelegate(message)) {
      throw new Error("cannot parse transaction");
    }
    return {
      amount: starnameClient.toInternalCoins([value.amount]),
      fee: starnameClient.toInternalCoins(fee.amount),
      data: await getValidator(starnameClient, value.validator_address),
      sender: await reverseLookup(starnameClient, value.delegator_address),
      id: baseTx.txhash,
      type: message.type as AminoType,
      time: new Date(baseTx.timestamp),
      note: memo,
    };
  }
}

export const isStarnameData = (
  data: StarnameData | any,
): data is StarnameData => {
  if (typeof data !== "object") return false;
  return "name" in data || "domain" in data;
};

export const isDelegationData = (
  data: DelegationData | any,
): data is DelegationData => {
  if (typeof data !== "object") return false;
  if (!("description" in data)) return false;
  return "moniker" in data.description;
};

export const isRedelegationData = (
  data: RedelegationData | any,
): data is RedelegationData => {
  if (typeof data !== "object") return false;
  return (
    "src" in data &&
    "dst" in data &&
    isDelegationData(data.src) &&
    isDelegationData(data.dst)
  );
};
