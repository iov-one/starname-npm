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

export class ViewOnlySigner implements Signer {
  public readonly type: SignerType = SignerType.ViewOnly;

  private readonly address: string;

  constructor(address: string) {
    this.address = address;
  }

  public async getPublicKey(): Promise<string> {
    return "";
  }

  public async getAddress(): Promise<string> {
    return this.address;
  }

  public async getAddressGroup(): Promise<AddressGroup> {
    return Promise.resolve({});
  }

  public async initialize(): Promise<boolean> {
    return true;
  }

  public getAccounts(): Promise<readonly AccountData[]> {
    return Promise.resolve([]);
  }

  public signDirect(
    address: string,
    signDoc: SignDoc,
  ): Promise<DirectSignResponse> {
    throw new Error("This is a view only mode, you cannot sign transactions");
  }

  public signAlephMessage(
    address: string,
    signable: StdSignDoc,
  ): Promise<AminoSignResponse> {
    throw new Error("This is a view only mode, you cannot sign transactions");
  }

  public getOfflineSigner(): OfflineSigner {
    throw new Error("This is a view only mode, you cannot sign transactions");
  }
}
