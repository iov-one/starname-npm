import { Coin as CosmjsCoin } from "@cosmjs/launchpad";

import { TokenLike } from "./tokenLike";

export interface CoinLike {
  amount: number;
  token: TokenLike;
  format(): string;
}

export class Amount implements CoinLike {
  public amount: number;
  public token: TokenLike;

  constructor(amount: number, token: TokenLike) {
    this.amount = amount;
    this.token = token;
  }

  public format(): string {
    const { token } = this;
    const value: number = this.amount / token.subunitsPerUnit;
    const fractionDigits: number = Math.log10(token.subunitsPerUnit);
    return (
      value.toLocaleString(undefined, {
        maximumFractionDigits: fractionDigits,
        minimumFractionDigits: 2,
      }) +
      " " +
      token.ticker
    );
  }

  public getFractionalValue(): number {
    const { token } = this;
    return this.amount / token.subunitsPerUnit;
  }
}

export const toInternalCoins = (
  coins: ReadonlyArray<CosmjsCoin>,
  tokens: Record<string, TokenLike>,
): ReadonlyArray<Amount> => {
  return coins.map(
    (item: CosmjsCoin): Amount =>
      new Amount(Number(item.amount), tokens[item.denom]),
  );
};

export const isAmount = (
  candidates: ReadonlyArray<any>,
): candidates is ReadonlyArray<Amount> => {
  return candidates.every(
    (candidate: any): boolean =>
      candidate !== null && "amount" in candidate && "token" in candidate,
  );
};
