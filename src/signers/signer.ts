import { AminoSignResponse, StdSignDoc } from "@cosmjs/amino";
import { OfflineSigner } from "@cosmjs/proto-signing";

import { AddressGroup } from "../types/addressGroup";
import { ChainMap } from "../types/chainMap";
import { SignerType } from "./signerType";

export interface Signer {
  readonly type: SignerType;

  /**
   * Must be called to properly initialize the instance
   * @param args
   */
  initialize(...args: any[]): Promise<boolean>;

  disconnect(): void;

  getAddress(): Promise<string>;

  getAddressGroup(chains: ChainMap): Promise<AddressGroup>;

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
