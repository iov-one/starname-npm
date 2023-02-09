import { Coin } from "@cosmjs/amino";
import abbreviate from "../utils/abbreviateNumber";

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

  public static fromValue(value: number, token: TokenLike): Amount {
    return new Amount(value * token.subunitsPerUnit, token);
  }

  public format(abbrv = false, hideTicker = false): string {
    const { token } = this;
    const value: number = this.amount / token.subunitsPerUnit;
    const fractionDigits: number = Math.log10(token.subunitsPerUnit);
    return (
      (abbrv
        ? abbreviate(value, 2, 0)
        : value.toLocaleString(undefined, {
            maximumFractionDigits: fractionDigits,
            minimumFractionDigits: 2,
          })) + (hideTicker ? "" : ` ${token.ticker}`)
    );
  }

  public getFractionalValue(): number {
    const { token } = this;
    return this.amount / token.subunitsPerUnit;
  }

  public get symbol(): string {
    return this.token.ticker;
  }

  public get denom(): string {
    return this.token.subunitName;
  }

  public toCoins(): ReadonlyArray<Coin> {
    return [
      {
        amount: Math.round(this.amount).toString(),
        denom: this.token.subunitName,
      },
    ];
  }
}

export const isAmount = (
  candidates: ReadonlyArray<any>,
): candidates is ReadonlyArray<Amount> => {
  return candidates.every(
    (candidate: any): boolean =>
      candidate !== null && "amount" in candidate && "token" in candidate,
  );
};
