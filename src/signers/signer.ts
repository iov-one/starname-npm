import { AminoSignResponse, StdSignDoc } from "@cosmjs/amino";
import { OfflineSigner } from "@cosmjs/proto-signing";

import { AddressGroup } from "../types/addressGroup";
import { WalletChains } from "../types/walletChains";
import { SignerType } from "./signerType";

export interface Signer {
  readonly type: SignerType;

  initialize(...args: any[]): Promise<boolean>;

  getAddress(): Promise<string>;

  getAddressGroup(chains: WalletChains): Promise<AddressGroup>;

  getPublicKey(): Promise<string>;

  signAlephMessage(
    address: string,
    signable: StdSignDoc,
  ): Promise<AminoSignResponse>;

  getOfflineSigner(): OfflineSigner;
}

export const MismatchedAddressError = new Error(
  "mismatched signer, refusing to sign",
);
