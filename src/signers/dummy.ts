import { AminoSignResponse, StdSignDoc } from "@cosmjs/amino";
import {
  AccountData,
  DirectSignResponse,
  OfflineSigner,
} from "@cosmjs/proto-signing";
import { SignDoc } from "cosmjs-types/cosmos/tx/v1beta1/tx";

import { AddressGroup } from "../types/addressGroup";
import { Signer } from "./signer";
import { SignerType } from "./signerType";

export class DummySigner implements Signer {
  readonly type: SignerType = SignerType.Generic;

  public getAddress(): Promise<string> {
    return Promise.resolve("");
  }

  public getAddressGroup(): Promise<AddressGroup> {
    return Promise.resolve({});
  }

  public getPublicKey(): Promise<string> {
    return Promise.resolve("");
  }

  public initialize(): Promise<boolean> {
    return Promise.resolve(false);
  }

  public getAccounts(): Promise<readonly AccountData[]> {
    return Promise.resolve([]);
  }

  public signDirect(
    signerAddress: string,
    signDoc: SignDoc,
  ): Promise<DirectSignResponse> {
    return Promise.resolve({} as DirectSignResponse);
  }

  public signAlephMessage(
    address: string,
    signable: StdSignDoc,
  ): Promise<AminoSignResponse> {
    return Promise.resolve({} as AminoSignResponse);
  }

  public getOfflineSigner(): OfflineSigner {
    return {} as OfflineSigner;
  }

  public disconnect(): void {
    return;
  }
}
