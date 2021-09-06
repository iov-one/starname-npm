import {
  BroadcastTxFailure,
  BroadcastTxSuccess,
  isBroadcastTxFailure,
  isBroadcastTxSuccess,
  StdFee,
} from "@cosmjs/launchpad";
import { BroadcastTxResult as LaunchpadBroadcastTxResponse } from "@cosmjs/launchpad";
import { BroadcastTxResponse as StargateBroadcastTxResponse } from "@cosmjs/stargate";

export type PostTxResult =
  | StargateBroadcastTxResponse
  | LaunchpadBroadcastTxResponse
  | StdFee;

export const isTransactionSuccess = (
  result: PostTxResult | any,
): result is BroadcastTxSuccess => {
  return isBroadcastTxSuccess(result);
};

export const isTransactionFailure = (
  result: PostTxResult | any,
): result is BroadcastTxFailure => {
  return isBroadcastTxFailure(result);
};

export const isFee = (result: PostTxResult | any): result is StdFee => {
  if (!("gas" in result)) return false;
  if (!("amount" in result)) return false;
  if (!(result.amount instanceof Array)) return false;
  const amount = result.amount;
  if (amount.length === 0) return false;
  return amount.every((item: any): boolean => {
    if (!("amount" in item)) return false;
    return "denom" in item;
  });
};
