import {
  AminoSignResponse,
  encodeSecp256k1Pubkey,
  SinglePubkey,
  StdSignDoc,
} from "@cosmjs/amino";
import { fromBase64 } from "@cosmjs/encoding";
import { AccountData, Algo, OfflineSigner } from "@cosmjs/proto-signing";
import { ChainInfo, Keplr, Key } from "@keplr-wallet/types";

import { AddressGroup } from "../types/addressGroup";
import { ChainMap } from "../types/chainMap";
import { MismatchedAddressError, Signer } from "./signer";
import { SignerType } from "./signerType";

declare global {
  interface Window {
    readonly keplr: Keplr;
    readonly getOfflineSigner: (chainId: string) => OfflineSigner;
  }
}

export class KeplrSigner implements Signer {
  public readonly type: SignerType = SignerType.Keplr;
  private publicKey: SinglePubkey | null = null;
  private address: string | null = null;
  private keplr: Keplr | null = null;
  private offlineSigner: OfflineSigner | null = null;

  private chainId = "";

  public async getPublicKey(): Promise<string> {
    const { publicKey } = this;
    if (publicKey === null) return "";
    return publicKey.value;
  }

  public async getAddress(): Promise<string> {
    const { address } = this;
    if (address === null) return "";
    return address;
  }

  public async getAddressGroup(chains: ChainMap): Promise<AddressGroup> {
    const { keplr } = this;
    // enable these chains first
    if (keplr === null) throw new Error("Keplr extension not initialized");
    const chainIds = Object.keys(chains);
    // this data is required for suggesting chain
    const experimentalChains = chainIds.reduce((acc, chainId) => {
      const chainData = chains[chainId];
      if (chainData.suggestChainConfig !== undefined)
        acc[chainId] = chainData.suggestChainConfig;
      return acc;
    }, {} as { [chainId: string]: ChainInfo });

    // these will be permissioned chains
    // add to this array when user approves reading permission
    const readableChainIds = chainIds.filter(
      (_chainId) => experimentalChains[_chainId] === undefined,
    );
    for (const experimentalChainId of Object.keys(experimentalChains)) {
      // wait for user to approve the permission
      await keplr.experimentalSuggestChain(
        experimentalChains[experimentalChainId],
      );
      // now push to readableChainIds
      readableChainIds.push(experimentalChainId);
    }
    await keplr.enable(readableChainIds);
    const resolvedAddressData = await Promise.all(
      readableChainIds.map(async (chainId) => {
        const { bech32Address, algo, pubKey } = await keplr.getKey(chainId);
        return [{ address: bech32Address, algo: algo as Algo, pubkey: pubKey }];
      }),
    );
    return readableChainIds.reduce((addressGroup, chainId, idx) => {
      return { ...addressGroup, [chainId]: resolvedAddressData[idx] };
    }, {} as AddressGroup);
  }

  private static getFeatures(): Array<string> {
    return ["stargate"];
  }

  private static async getKeplr(): Promise<Keplr> {
    if (window.keplr !== undefined) {
      return window.keplr;
    }
    return new Promise<Keplr>((resolve: (keplr: Keplr) => void): void => {
      const timer = setInterval((): void => {
        if (window.keplr !== undefined) {
          resolve(window.keplr);
          clearInterval(timer);
        }
      }, 400);
    });
  }

  public async initialize(config: ChainInfo): Promise<boolean> {
    const keplr = await KeplrSigner.getKeplr();
    const { chainId } = config;
    this.chainId = chainId;
    await keplr.experimentalSuggestChain(config);
    // Now that we suggested the chain let's initialize it
    await keplr.enable(chainId);
    // Create the wallet
    // Extract accounts
    const key: Key = await keplr.getKey(chainId);
    // Export the exportable stuff
    this.publicKey = encodeSecp256k1Pubkey(key.pubKey);
    this.address = key.bech32Address;
    this.keplr = keplr;
    this.offlineSigner = await keplr.getOfflineSignerAuto(chainId);

    return true;
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

  public signAlephMessage(
    signerAddress: string,
    signDoc: StdSignDoc,
  ): Promise<AminoSignResponse> {
    const { address, keplr } = this;
    if (address !== signerAddress) {
      throw MismatchedAddressError;
    } else if (keplr === null) {
      throw new Error("keplr extension not initialized correctly");
    }
    // TODO: better would be to use keplr.signArbitrary after
    // https://github.com/aleph-im/pyaleph/issues/362 has been implemented
    return keplr.signAmino(signDoc.chain_id, signerAddress, signDoc, {
      disableBalanceCheck: true,
      preferNoSetFee: true,
      preferNoSetMemo: true,
    });
  }

  public getOfflineSigner(): OfflineSigner {
    const { offlineSigner } = this;
    if (offlineSigner === null) {
      throw new Error("offline signer not initialized");
    }

    return offlineSigner;
  }

  public disconnect(): void {
    return;
  }
}
