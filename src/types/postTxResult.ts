import { StdFee } from "@cosmjs/amino";
import {
  DeliverTxResponse,
  isDeliverTxFailure,
  isDeliverTxSuccess,
} from "@cosmjs/stargate";

export type PostTxResult = DeliverTxResponse | StdFee;

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

export const isTransactionSuccess = (
  result: PostTxResult | any,
): result is DeliverTxResponse => {
  if (isFee(result)) return false;
  return isDeliverTxSuccess(result);
};

export const isTransactionFailure = (
  result: PostTxResult | any,
): result is DeliverTxResponse => {
  if (isFee(result)) return false;
  return isDeliverTxFailure(result);
};
