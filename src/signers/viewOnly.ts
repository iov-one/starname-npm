import { AminoSignResponse } from "@cosmjs/amino";
import {
  AccountData,
  DirectSignResponse,
  OfflineSigner,
} from "@cosmjs/proto-signing";
import { AddressGroup, Signer, SignerType } from "@iov/signer-types";

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
    return Promise.resolve(true);
  }

  public getAccounts(): Promise<readonly AccountData[]> {
    return Promise.resolve([]);
  }

  public signDirect(): Promise<DirectSignResponse> {
    throw new Error("This is a view only mode, you cannot sign transactions");
  }

  public signAlephMessage(): Promise<AminoSignResponse> {
    throw new Error("This is a view only mode, you cannot sign transactions");
  }

  public getOfflineSigner(): OfflineSigner {
    throw new Error("This is a view only mode, you cannot sign transactions");
  }

  public disconnect(): void {
    return;
  }
}
