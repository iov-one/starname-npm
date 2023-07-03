import { Coin } from "@cosmjs/amino";
import abbreviate from "../utils/abbreviateNumber";

import { TokenLike } from "./tokenLike";
import { Currency } from "@keplr-wallet/types";

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

  public static fromValue(actualValue: number, token: TokenLike): Amount {
    return new Amount(actualValue * token.subunitsPerUnit, token);
  }

  public static fromCurrency(actualValue: number, currency: Currency): Amount {
    return this.fromValue(actualValue, {
      subunitName: currency.coinMinimalDenom,
      subunitsPerUnit: 10 ** currency.coinDecimals,
      ticker: currency.coinDenom,
    });
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

  public add(amount: Amount): Amount {
    if (this.denom !== amount.denom) {
      throw new Error("Cannot add different tokens");
    }
    return new Amount(this.amount + amount.amount, this.token);
  }

  public sub(amount: Amount): Amount {
    if (this.denom !== amount.denom) {
      throw new Error("Cannot sub different tokens");
    }
    return new Amount(this.amount - amount.amount, this.token);
  }

  public mul(amount: Amount): Amount {
    if (this.denom !== amount.denom) {
      throw new Error("Cannot mul different tokens");
    }
    return new Amount(this.amount * amount.amount, this.token);
  }

  public div(amount: Amount): Amount {
    if (this.denom !== amount.denom) {
      throw new Error("Cannot div different tokens");
    }
    return new Amount(this.amount / amount.amount, this.token);
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
