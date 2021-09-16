import { StdSignature, StdSignDoc } from "@cosmjs/amino";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { AminoTypes } from "@cosmjs/stargate";
import { SigningStargateClient } from "@cosmjs/stargate/build/signingstargateclient";
import { StarnameApi } from "api";
import { Task } from "api/task";
import { TxRejected } from "constants/errorCodes";
import { FAVORITE_ASSET_URI } from "constants/favoriteAssetUri";
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import {
  MsgBeginRedelegate,
  MsgDelegate,
  MsgUndelegate,
} from "cosmjs-types/cosmos/staking/v1beta1/tx";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {
  MsgDeleteAccount,
  MsgDeleteDomain,
  MsgRegisterAccount,
  MsgRegisterDomain,
  MsgRenewAccount,
  MsgRenewDomain,
  MsgReplaceAccountMetadata,
  MsgReplaceAccountResources,
  MsgTransferAccount,
  MsgTransferDomain,
} from "proto/tx";
import { Resource } from "proto/types";
import { Signer } from "signers/signer";
import { SignerType } from "signers/signerType";
import { StarnameRegistry, TxType } from "starnameRegistry";
import { AddressGroup } from "types/addressGroup";
import { aminoTypes } from "types/aminoTypes";
import { ResponsePage } from "types/apiPage";
import { Balance } from "types/balance";
import { MsgsAndMemo } from "types/msgsAndMemo";
import { Pager } from "types/pager";
import { PostTxResult } from "types/postTxResult";
import { ResourceInfo } from "types/resourceInfo";
import { TokenLike } from "types/tokenLike";
import { Transaction } from "types/transaction";
import { Tx } from "types/tx";
import { WalletChains } from "types/walletChains";
import { estimateFee, GasConfig } from "utils/estimateFee";

export interface WalletOptions {
  readonly starnameApi: StarnameApi;
  readonly rpcUrl: string;
  readonly gasConfig: GasConfig;
}

export class Wallet {
  private readonly signer: Signer;
  private readonly rpcUrl: string;
  private readonly gasConfig: GasConfig;
  private readonly starnameApi: StarnameApi;

  constructor(signer: Signer, options: WalletOptions) {
    if (!options.starnameApi) {
      throw new Error(
        "cannot create a wallet without access to the API object",
      );
    }
    this.starnameApi = options.starnameApi;
    this.signer = signer;
    this.rpcUrl = options.rpcUrl;
    this.gasConfig = options.gasConfig;
  }

  protected async signAndBroadcast(
    msgsAndMemo: MsgsAndMemo,
  ): Promise<PostTxResult> {
    const { starnameApi } = this;
    if (starnameApi === undefined) {
      throw new Error("wallet not initialized properly");
    }
    try {
      const txRaw = await this.signMsgsAndMemo(msgsAndMemo);
      const bytes = Uint8Array.from(TxRaw.encode(txRaw).finish());
      return starnameApi.rpcPostTx(bytes);
    } catch (exception: any) {
      if (exception.message !== "Request rejected") {
        throw exception;
      } else {
        return {
          transactionHash: "",
          height: 0,
          code: TxRejected,
          rawLog: "",
        };
      }
    }
  }

  private async signWithSigner(
    signer: OfflineSigner,
    msgsAndMemo: MsgsAndMemo,
  ): Promise<TxRaw> {
    const { messages, memo } = msgsAndMemo;
    const address = await this.getAddress();
    const fee = estimateFee(messages, this.gasConfig);
    const registry = new StarnameRegistry();

    const client = await SigningStargateClient.connectWithSigner(
      this.rpcUrl,
      signer,
      {
        registry: registry,
        aminoTypes: new AminoTypes({
          additions: aminoTypes,
          prefix: "star",
        }),
      },
    );

    return await client.sign(address, messages, fee, memo);
  }

  public async signMsgsAndMemo(msgsAndMemo: MsgsAndMemo): Promise<TxRaw> {
    const { signer } = this;
    return this.signWithSigner(signer.getOfflineSigner(), msgsAndMemo);
  }

  public getPublicKey(): Promise<string> {
    const { signer } = this;
    return signer.getPublicKey();
  }

  public async getAddress(): Promise<string> {
    const { signer } = this;
    return signer.getAddress();
  }

  private getSigner(): Signer {
    return this.signer;
  }

  public getBalances(): Task<ReadonlyArray<Balance>> {
    let task: Task<ReadonlyArray<Balance>> | null = null;
    return {
      run: async (): Promise<ReadonlyArray<Balance>> => {
        const { starnameApi } = this;
        if (starnameApi === undefined) {
          throw new Error("wallet not initialized properly");
        }
        const signer: Signer = this.getSigner();
        task = starnameApi.getBalance(await signer.getAddress());
        return task.run();
      },
      abort: (): void => {
        if (task !== null) {
          task.abort();
        }
      },
    };
  }

  public getTransactions(
    page: Pager,
  ): Task<Record<string, ResponsePage<Transaction>>> {
    let task: Task<Record<string, ResponsePage<Transaction>>> | null = null;
    return {
      run: async (): Promise<Record<string, ResponsePage<Transaction>>> => {
        const { starnameApi } = this;
        if (starnameApi === undefined) {
          throw new Error("wallet not initialized properly");
        }
        const signer: Signer = this.getSigner();
        task = starnameApi.getTransactions(await signer.getAddress(), page);
        return task.run();
      },
      abort: (): void => {
        if (task !== null) {
          task.abort();
        }
      },
    };
  }

  private static buildPreferredAssetItem(
    preferredAsset: string,
  ): ReadonlyArray<Resource> {
    if (preferredAsset === "") return [];
    return [
      {
        uri: FAVORITE_ASSET_URI,
        resource: preferredAsset,
      },
    ];
  }

  public async replaceDomainResources(
    domain: string,
    targets: ReadonlyArray<ResourceInfo>,
    profile: ReadonlyArray<Resource>,
    preferredAsset: string,
  ): Promise<PostTxResult> {
    const address = await this.getAddress();
    const message: Tx<MsgReplaceAccountResources> = {
      typeUrl: TxType.Starname.ReplaceAccountResources,
      value: {
        domain: domain,
        name: "",
        newResources: [
          ...targets.map(
            ({ asset, address }: ResourceInfo): Resource => ({
              uri: asset["starname-uri"],
              resource: address,
            }),
          ),
          ...Wallet.buildPreferredAssetItem(preferredAsset),
          ...profile,
        ],
        owner: address,
        payer: "",
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo: "",
    });
  }

  private sanitizeResources(
    resources: ReadonlyArray<Resource>,
  ): Array<Resource> {
    return resources
      .map((item: Resource): Resource => {
        const value: string = item.resource;
        return {
          uri: item.uri,
          resource: value.trim(),
        };
      })
      .filter(({ resource: value }: Resource): boolean => value !== "");
  }

  public async replaceAccountResources(
    name: string,
    domain: string,
    targets: ReadonlyArray<ResourceInfo>,
    profile: ReadonlyArray<Resource>,
    preferredAsset: string,
  ): Promise<PostTxResult> {
    const address = await this.getAddress();
    const message: Tx<MsgReplaceAccountResources> = {
      typeUrl: TxType.Starname.ReplaceAccountResources,
      value: {
        domain: domain,
        name: name,
        newResources: this.sanitizeResources([
          ...targets.map(
            ({ asset, address }: ResourceInfo): Resource => ({
              uri: asset["starname-uri"],
              resource: address,
            }),
          ),
          ...Wallet.buildPreferredAssetItem(preferredAsset),
          ...profile,
        ]),
        owner: address,
        payer: "",
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo: "",
    });
  }

  public async registerDomain(
    domain: string,
    type: "closed" | "open" = "closed",
  ): Promise<PostTxResult> {
    const { starnameApi } = this;
    if (starnameApi === undefined) {
      throw new Error("wallet not initialized properly");
    }
    const address: string = await this.getAddress();
    const message: Tx<MsgRegisterDomain> = {
      typeUrl: TxType.Starname.RegisterDomain,
      value: {
        name: domain,
        admin: address,
        domainType: type,
        payer: "",
        broker: starnameApi.getBroker(),
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo: "",
    });
  }

  private createResourcesFromAddressGroup = (
    addressGroup: AddressGroup,
    chains: WalletChains,
  ): Array<Resource> => {
    const resources: Array<Resource> = Object.keys(addressGroup).map(
      (chainId) => {
        const symbol = chains[chainId].symbol;
        return {
          uri: `asset:${symbol.toLowerCase()}`,
          // signers sends it on 0th index
          resource: addressGroup[chainId][0].address,
        };
      },
    );
    return resources;
  };

  private getOtherChainResources = async (
    chains: WalletChains,
  ): Promise<Array<Resource>> => {
    switch (this.getSignerType()) {
      case SignerType.Keplr:
      case SignerType.Google:
      case SignerType.SeedPhrase: {
        // Now request signer to provide addressGroup ( for chains )
        try {
          const addressGroup = await this.signer.getAddressGroup(chains);
          const resources = this.createResourcesFromAddressGroup(
            addressGroup,
            chains,
          );
          return resources;
        } catch (error) {
          console.warn(error);
        }
        break;
      }
      default:
        return [];
    }
    return [];
  };

  public async registerAccount(
    name: string,
    domain: string,
    chains?: WalletChains,
  ): Promise<PostTxResult> {
    const address: string = await this.getAddress();
    const resources: Array<Resource> = [];
    // Set default resource first
    resources.push({
      uri: this.starnameApi.getDefaultAssetURI(),
      resource: address,
    });
    // if require generation of other chain addresses as well
    if (chains) {
      try {
        const otherChainResources = await this.getOtherChainResources(chains);
        resources.push(...otherChainResources);
      } catch (error) {
        console.warn("Failure getting otherChainResources");
      }
    }

    const message: Tx<MsgRegisterAccount> = {
      typeUrl: TxType.Starname.RegisterAccount,
      value: {
        domain: domain,
        name: name,
        owner: address,
        registerer: address,
        resources: resources,
        broker: this.starnameApi.getBroker(),
        payer: "",
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo: "",
    });
  }

  public async transferDomain(
    domain: string,
    recipient: string,
  ): Promise<PostTxResult> {
    const message: Tx<MsgTransferDomain> = {
      typeUrl: TxType.Starname.TransferDomain,
      value: {
        domain: domain,
        owner: await this.getAddress(),
        newAdmin: recipient,
        transferFlag: 0,
        payer: "",
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo: "",
    });
  }

  public async transferAccount(
    name: string,
    domain: string,
    recipient: string,
  ): Promise<PostTxResult> {
    const address = await this.getAddress();
    const message: Tx<MsgTransferAccount> = {
      typeUrl: TxType.Starname.TransferAccount,
      value: {
        name: name,
        domain: domain,
        owner: address,
        newOwner: recipient,
        reset: true,
        payer: "",
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo: "",
    });
  }

  public async deleteDomain(domain: string): Promise<PostTxResult> {
    const address: string = await this.getAddress();
    const message: Tx<MsgDeleteDomain> = {
      typeUrl: TxType.Starname.DeleteDomain,
      value: {
        domain: domain,
        owner: address,
        payer: "",
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo: "",
    });
  }

  public async deleteAccount(
    name: string,
    domain: string,
  ): Promise<PostTxResult> {
    const address: string = await this.getAddress();
    const message: Tx<MsgDeleteAccount> = {
      typeUrl: TxType.Starname.DeleteAccount,
      value: {
        name: name,
        domain: domain,
        owner: address,
        payer: "",
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo: "",
    });
  }

  public async renewDomain(domain: string): Promise<PostTxResult> {
    const message: Tx<MsgRenewDomain> = {
      typeUrl: TxType.Starname.RenewDomain,
      value: {
        domain: domain,
        signer: await this.getAddress(),
        payer: "",
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo: "",
    });
  }

  public async renewAccount(
    name: string,
    domain: string,
  ): Promise<PostTxResult> {
    const address = await this.getAddress();
    const message: Tx<MsgRenewAccount> = {
      typeUrl: TxType.Starname.RenewAccount,
      value: {
        domain: domain,
        name: name,
        signer: address,
        payer: "",
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo: "",
    });
  }

  public async delegateAmount(
    validatorAddress: string,
    amount: number,
    token: TokenLike,
    memo = "",
  ): Promise<PostTxResult> {
    const address: string = await this.getAddress();
    const uiov: number = amount * token.subunitsPerUnit;
    const message: Tx<MsgDelegate> = {
      typeUrl: TxType.Staking.Delegate,
      value: {
        delegatorAddress: address,
        validatorAddress: validatorAddress,
        amount: {
          amount: uiov.toFixed(0),
          denom: token.subunitName,
        },
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo: memo,
    });
  }

  public async unDelegateAmount(
    validatorAddress: string,
    amount: number,
    token: TokenLike,
    memo = "",
  ): Promise<PostTxResult> {
    const address: string = await this.getAddress();
    const uiov: number = amount * token.subunitsPerUnit;
    const message: Tx<MsgUndelegate> = {
      typeUrl: TxType.Staking.Undelegate,
      value: {
        delegatorAddress: address,
        validatorAddress: validatorAddress,
        amount: {
          amount: uiov.toFixed(0),
          denom: token.subunitName,
        },
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo: memo,
    });
  }

  public async redelegateAmount(
    validatorSource: string,
    validatorDestination: string,
    amount: number,
    token: TokenLike,
    memo = "",
  ): Promise<PostTxResult> {
    const address: string = await this.getAddress();
    const uiov: number = amount * token.subunitsPerUnit;
    const message: Tx<MsgBeginRedelegate> = {
      typeUrl: TxType.Staking.BeginRedelegate,
      value: {
        delegatorAddress: address,
        validatorSrcAddress: validatorSource,
        validatorDstAddress: validatorDestination,
        amount: {
          amount: uiov.toFixed(0),
          denom: token.subunitName,
        },
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo: memo,
    });
  }

  public async sendPayment(
    token: TokenLike,
    recipient: string,
    amount: number,
    memo = "",
  ): Promise<PostTxResult> {
    const address: string = await this.getAddress();
    const uiov: number = amount * token.subunitsPerUnit;
    const message: Tx<MsgSend> = {
      typeUrl: TxType.Bank.Send,
      value: {
        fromAddress: address,
        toAddress: recipient,
        amount: [
          {
            amount: uiov.toFixed(0),
            denom: token.subunitName,
          },
        ],
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo: memo,
    });
  }

  public async setMetadataURI(
    name: string,
    domain: string,
    uri: string | null,
  ): Promise<PostTxResult> {
    const address = await this.getAddress();
    const message: Tx<MsgReplaceAccountMetadata> = {
      typeUrl: TxType.Starname.ReplaceAccountMetadata,
      value: {
        domain: domain,
        name: name,
        newMetadataUri: uri !== null ? uri : "",
        owner: address,
        payer: "",
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo: "",
    });
  }

  public getSignerType(): SignerType {
    const { signer } = this;
    return signer.type;
  }

  public async signAlephMessage(signDoc: StdSignDoc): Promise<StdSignature> {
    const { signer } = this;
    const response = await signer.signAlephMessage(
      await this.getAddress(),
      signDoc,
    );

    return response.signature;
  }
}
