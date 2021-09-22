import {
  AminoSignResponse,
  Secp256k1HdWallet,
  StdSignDoc,
} from "@cosmjs/amino";
import { stringToPath } from "@cosmjs/crypto";
import {
  AccountData,
  DirectSecp256k1HdWallet,
  DirectSecp256k1HdWalletOptions,
  DirectSignResponse,
  OfflineSigner,
} from "@cosmjs/proto-signing";
import { SignDoc } from "cosmjs-types/cosmos/tx/v1beta1/tx";

import { hdPath } from "../constants/hdPath";
import { AddressGroup } from "../types/addressGroup";
import { WalletChains } from "../types/walletChains";
import { MismatchedAddressError, Signer } from "./signer";
import { SignerType } from "./signerType";

export class SeedPhraseSigner implements Signer {
  readonly type = SignerType.SeedPhrase;
  private directSigner: DirectSecp256k1HdWallet | null = null;
  private aminoSigner: Secp256k1HdWallet | null = null;
  private phrase: string | null = null;

  public async getAddress(): Promise<string> {
    const { directSigner } = this;
    if (directSigner == null) {
      throw new Error("not initialized");
    }
    const accounts = await directSigner.getAccounts();
    if (accounts.length < 1) {
      throw new Error("cannot read signer accounts");
    }
    return accounts[0].address;
  }

  public async getAddressGroup(chains: WalletChains): Promise<AddressGroup> {
    const chainIds = Object.keys(chains);
    const chainProps = Object.values(chains);

    const resolvedAddressData = await Promise.all(
      chainProps.map((option) => {
        return this.getExtraAccounts({
          prefix: option.prefix,
          hdPaths: option.hdPaths.map(stringToPath),
        });
      }),
    );

    return chainIds.reduce((addressGroup, chainId, idx) => {
      return { ...addressGroup, [chainId]: resolvedAddressData[idx] };
    }, {});
  }

  public async getPublicKey(): Promise<string> {
    const { directSigner } = this;
    if (directSigner == null) {
      throw new Error("not initialized");
    }
    const accounts = await directSigner.getAccounts();
    if (accounts.length < 1) {
      throw new Error("cannot read signer accounts");
    }
    const pubKey = accounts[0].pubkey;
    return Buffer.from(pubKey).toString("base64");
  }

  public async random(): Promise<void> {
    this.directSigner = await DirectSecp256k1HdWallet.generate(12, {
      hdPaths: [hdPath],
      prefix: "star",
    });
    this.aminoSigner = await Secp256k1HdWallet.fromMnemonic(
      this.directSigner.mnemonic,
      {
        hdPaths: [hdPath],
        prefix: "star",
      },
    );
  }

  public async initialize(phrase: string): Promise<boolean> {
    this.phrase = phrase;
    this.directSigner = await DirectSecp256k1HdWallet.fromMnemonic(phrase, {
      hdPaths: [hdPath],
      prefix: "star",
    });
    this.aminoSigner = await Secp256k1HdWallet.fromMnemonic(phrase, {
      hdPaths: [hdPath],
      prefix: "star",
    });
    return true;
  }

  public async signDirect(
    signerAddress: string,
    signDoc: SignDoc,
  ): Promise<DirectSignResponse> {
    const { directSigner } = this;
    if (directSigner == null) {
      throw new Error("not initialized");
    }
    const address: string = await this.getAddress();
    if (signerAddress !== address) {
      throw MismatchedAddressError;
    }
    return directSigner.signDirect(address, signDoc);
  }

  public getAccounts(): Promise<readonly AccountData[]> {
    const { directSigner } = this;
    if (directSigner == null) {
      throw new Error("not initialized");
    }
    return directSigner.getAccounts();
  }

  public async getExtraAccounts(
    options: Partial<DirectSecp256k1HdWalletOptions>,
  ): Promise<ReadonlyArray<AccountData>> {
    const { phrase } = this;
    if (phrase === null) {
      throw new Error("signer not initialized");
    }
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(phrase, options);

    return wallet.getAccounts();
  }

  public signAlephMessage(
    address: string,
    signDoc: StdSignDoc,
  ): Promise<AminoSignResponse> {
    const { aminoSigner } = this;
    if (aminoSigner === null) {
      throw new Error("not initialized");
    }
    return aminoSigner.signAmino(address, signDoc);
  }

  public getOfflineSigner(): OfflineSigner {
    return this;
  }
}
