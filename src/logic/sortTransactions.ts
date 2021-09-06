import { Transaction } from "types/transaction";

export const sortTransactions = (
  tx1: Transaction,
  tx2: Transaction,
): number => {
  const { time: t1 } = tx1;
  const { time: t2 } = tx2;
  if (t1 === undefined) {
    return Number.MAX_SAFE_INTEGER;
  } else if (t2 === undefined) {
    return Number.MIN_SAFE_INTEGER;
  }
  // Descending order
  return t2.getTime() - t1.getTime();
};
