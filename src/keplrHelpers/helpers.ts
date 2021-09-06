import { AccAddress } from "@chainapsis/cosmosjs/common/address";
import { Coin } from "@chainapsis/cosmosjs/common/coin";
import { StdFee } from "@chainapsis/cosmosjs/common/stdTx";
import {
  Coin as CosmjsCoin,
  Msg as CosmjsMsg,
  StdFee as CosmjsStdFee,
} from "@cosmjs/launchpad";

import { KeplrMsg } from "./keplrMessage";

export const toKeplrMessage =
  (
    signer: AccAddress,
    fee: CosmjsStdFee,
    chainId: string,
    memo: string,
    accountNumber: string,
    sequence: string,
  ) =>
  (msg: CosmjsMsg): KeplrMsg => {
    return new KeplrMsg(
      signer,
      msg,
      fee,
      chainId,
      memo,
      accountNumber,
      sequence,
    );
  };

export const toKeplrCoins = (coins: ReadonlyArray<CosmjsCoin>): Coin[] => {
  return coins.map((coin: CosmjsCoin): Coin => {
    return new Coin(coin.denom, coin.amount);
  });
};

export const toKeplrFee = (cosmjsFee: CosmjsStdFee): StdFee => {
  return new StdFee(toKeplrCoins(cosmjsFee.amount), cosmjsFee.gas);
};
