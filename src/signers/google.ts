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

const SignerNotInitialized = "Signer not initialized";

export class GoogleSigner implements Signer {
  public readonly type: SignerType = SignerType.Google;
  private signer: GDriveSigner | null = null;

  public async getPublicKey(): Promise<string> {
    const { signer } = this;
    if (!signer) throw new Error(SignerNotInitialized);
    return signer.getPublicKey();
  }

  public async getAddress(): Promise<string> {
    const { signer } = this;
    if (!signer) throw new Error(SignerNotInitialized);
    return signer.getAddress();
  }

  public getAddressGroup(chains: ChainMap): Promise<AddressGroup> {
    const { signer } = this;
    if (!signer) throw new Error(SignerNotInitialized);
    return signer.getExtraAccounts(chains);
  }

  public async initialize(signer: GDriveSigner): Promise<boolean> {
    this.signer = signer;
    return true;
  }

  public async signOut(): Promise<void> {
    const { signer } = this;
    if (!signer) throw new Error(SignerNotInitialized);
    return signer.signOut();
  }

  public isMnemonicSafelyStored(): Promise<boolean> {
    const { signer } = this;
    if (!signer) throw new Error(SignerNotInitialized);
    return signer.isMnemonicSafelyStored();
  }

  public showMnemonic(path: string): Promise<boolean> {
    const { signer } = this;
    if (!signer) throw new Error(SignerNotInitialized);
    return signer.showMnemonic(path);
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
    const { signer } = this;
    if (!signer) throw new Error(SignerNotInitialized);
    if (signerAddress !== (await this.getAddress())) {
      throw MismatchedAddressError;
    }
    return signer.sign(signDoc) as Promise<DirectSignResponse>;
  }

  public async signAlephMessage(
    signerAddress: string,
    signDoc: StdSignDoc,
  ): Promise<AminoSignResponse> {
    const { signer } = this;
    if (!signer) throw new Error(SignerNotInitialized);

    if (signerAddress !== (await this.getAddress())) {
      throw MismatchedAddressError;
    }
    return signer.sign(signDoc) as Promise<AminoSignResponse>;
  }

  public getOfflineSigner(): OfflineSigner {
    return this;
  }

  public disconnect(): void {
    this.signOut();
  }
}
