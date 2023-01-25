import { AminoSignResponse, StdSignDoc } from "@cosmjs/amino";
import { fromBase64 } from "@cosmjs/encoding";
import {
  AccountData,
  DirectSignResponse,
  OfflineSigner,
} from "@cosmjs/proto-signing";
import { Signer as GDriveSigner } from "@iov/gdrive-custodian";
import { SignDoc } from "cosmjs-types/cosmos/tx/v1beta1/tx";

import { AddressGroup } from "../types/addressGroup";
import { ChainMap } from "../types/chainMap";
import { MismatchedAddressError, Signer } from "./signer";
import { SignerType } from "./signerType";

export class GoogleSigner implements Signer {
  public readonly type: SignerType = SignerType.Google;
  private readonly proxySigner: GDriveSigner;

  constructor(proxySigner: GDriveSigner) {
    this.proxySigner = proxySigner;
  }

  public async getPublicKey(): Promise<string> {
    const { proxySigner } = this;
    return proxySigner.getPublicKey();
  }

  public async getAddress(): Promise<string> {
    const { proxySigner } = this;
    return proxySigner.getAddress();
  }

  public getAddressGroup(chains: ChainMap): Promise<AddressGroup> {
    const { proxySigner } = this;
    return proxySigner.getExtraAccounts(chains);
  }

  public initialize(): Promise<boolean> {
    return Promise.resolve(false);
  }

  public async signOut(): Promise<void> {
    const { proxySigner } = this;
    return proxySigner.signOut();
  }

  public isMnemonicSafelyStored(): Promise<boolean> {
    const { proxySigner } = this;
    return proxySigner.isMnemonicSafelyStored();
  }

  public showMnemonic(path: string): Promise<boolean> {
    const { proxySigner } = this;
    return proxySigner.showMnemonic(path);
  }

  public async getAccounts(): Promise<readonly AccountData[]> {
    return [
      {
        address: await this.getAddress(),
        algo: "secp256k1",
        pubkey: fromBase64(await this.getPublicKey()),
      },
    ];
  }

  public async signDirect(
    signerAddress: string,
    signDoc: SignDoc,
  ): Promise<DirectSignResponse> {
    const { proxySigner } = this;
    if (signerAddress !== (await this.getAddress())) {
      throw MismatchedAddressError;
    }

    return proxySigner.sign(signDoc) as Promise<DirectSignResponse>;
  }

  public async signAlephMessage(
    signerAddress: string,
    signDoc: StdSignDoc,
  ): Promise<AminoSignResponse> {
    const { proxySigner } = this;
    if (signerAddress !== (await this.getAddress())) {
      throw MismatchedAddressError;
    }

    return proxySigner.sign(signDoc) as Promise<AminoSignResponse>;
  }

  public getOfflineSigner(): OfflineSigner {
    return this;
  }

  public disconnect(): void {
    this.signOut();
  }
}
