import "isomorphic-fetch";

import api from "api";
import { SeedPhraseSigner } from "signers/seedPhrase";
import { Wallet } from "wallet";

export const rpcUrl = "http://localhost:26657";
export const apiUrl = "http://localhost:1317";

export const setupTest = async (): Promise<void> => {
  await api.initialize(
    rpcUrl,
    apiUrl,
    "" /* validatorsInfoUrl */,
    {
      IOV: {
        subunitName: "uiov",
        subunitsPerUnit: 1000000000,
        ticker: "IOV",
      },
    } /* tokens */,
    {
      denom: "uiov",
      logo: "",
      "starname-uri": "",
      "caip-19": "",
      name: "IOV",
      symbol: "IOV",
    } /* mainAsset */,
    /* broker */
  );
};

export const addTokensWithFaucet = async (address: string): Promise<void> => {
  const response = await fetch(
    `http://localhost:8080/credit?address=${address}`,
    {
      method: "GET",
    },
  );

  if (response.status !== 200) {
    throw new Error("cannot use the faucet");
  }
};

export const createWallet = async (): Promise<Wallet> => {
  const signer = new SeedPhraseSigner();
  await signer.random();
  const wallet = new Wallet(signer, rpcUrl, {
    gasMap: {
      "/starnamed.x.starname.v1beta1.MsgRenewDomain": 250000,
      "/starnamed.x.starname.v1beta1.MsgReplaceAccountResources": 10000,
      "/starnamed.x.starname.v1beta1.MsgTransferDomain": 250000,
      "cosmos-sdk/MsgSend": 80000,
      "cosmos-sdk/MsgBeginRedelegate": 250000,
      default: 200000,
    },
    gasPrice: {
      denom: "uiov",
      amount: "2",
    },
  });
  await addTokensWithFaucet(await wallet.getAddress());
  return wallet;
};

export const randomName = (): string => {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  return Array(8)
    .fill("")
    .map((): string => {
      const index = Math.floor(Math.random() * characters.length);
      return characters[index];
    })
    .join("");
};
