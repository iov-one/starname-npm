import "isomorphic-fetch";
const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { SeedPhraseSigner } from "./signers/seedPhrase";
import { StarnameClient } from "./starnameClient";
import { Wallet } from "./wallet";

export const rpcUrl = "http://127.0.0.1:26657";
export const apiUrl = "http://127.0.0.1:1317";

export const createClient = (): Promise<StarnameClient> => {
  return StarnameClient.createConnected(
    rpcUrl,
    apiUrl,
    "" /* validatorsInfoUrl */,
    [
      /* Chain Tokens */
      {
        subunitName: "tiov",
        subunitsPerUnit: 1000000,
        ticker: "IOV",
      },
    ],
    {
      /* Main asset */
      logo: "",
      "starname-uri": "",
      name: "IOV",
      symbol: "IOV",
      "trustwallet-uid": null,
      coingeckoId: null,
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

export const createWallet = async (
  starnameClient: StarnameClient,
): Promise<Wallet> => {
  const signer = new SeedPhraseSigner();
  await signer.initializeRandom();
  const wallet = new Wallet(signer, starnameClient);
  // await addTokensWithFaucet(await wallet.getAddress());
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
