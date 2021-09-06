import { defaultBech32Config } from "@chainapsis/cosmosjs/core/bech32Config";
import {
  AminoSignResponse,
  encodeSecp256k1Pubkey,
  SinglePubkey,
  StdSignDoc,
} from "@cosmjs/amino";
import { fromBase64 } from "@cosmjs/encoding";
import { AccountData, OfflineSigner } from "@cosmjs/proto-signing";
import { Keplr, Key } from "@keplr-wallet/types";
import api from "api";
import { MismatchedAddressError, Signer } from "signers/signer";
import { SignerType } from "signers/signerType";

interface GasPriceStep {
  readonly low: number;
  readonly average: number;
  readonly high: number;
}

export interface KeplrConfig {
  readonly symbol: string;
  readonly denom: string;
  readonly rpcUrl: string;
  readonly apiUrl: string;
  readonly coinType: number;
  readonly gasPriceStep: GasPriceStep;
}

declare global {
  interface Window {
    readonly keplr: Keplr;
    readonly getOfflineSigner: (chainId: string) => any;
  }
}

export class KeplrSigner implements Signer {
  public readonly type: SignerType = SignerType.Keplr;
  private publicKey: SinglePubkey | null = null;
  private address: string | null = null;
  private keplr: Keplr | null = null;
  private offlineSigner: OfflineSigner | null = null;

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

  public async initialize(config: KeplrConfig): Promise<boolean> {
    const keplr = await KeplrSigner.getKeplr();
    const chainId: string = api.getChainId();
    const coin = {
      coinDenom: config.symbol,
      coinMinimalDenom: config.denom,
      coinDecimals: 6,
    };
    const bech32Config = defaultBech32Config("star");
    await keplr.experimentalSuggestChain({
      chainId: chainId,
      chainName: chainId,
      rpc: config.rpcUrl,
      rest: config.apiUrl,
      stakeCurrency: {
        ...coin,
        coinDenom: "stake",
        coinMinimalDenom: "ustake",
      },
      bip44: {
        coinType: config.coinType,
      },
      features: KeplrSigner.getFeatures(),
      bech32Config: bech32Config,
      currencies: [coin],
      feeCurrencies: [coin],
      coinType: config.coinType,
      gasPriceStep: config.gasPriceStep,
    });
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

    const chainId = api.getChainId();

    return keplr.signAmino(chainId, signerAddress, signDoc);
  }

  public getOfflineSigner(): OfflineSigner {
    const { offlineSigner } = this;
    if (offlineSigner === null) {
      throw new Error("offline signer not initialized");
    }

    return offlineSigner;
  }
}
