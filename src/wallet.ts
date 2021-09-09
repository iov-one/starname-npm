import { StdSignature, StdSignDoc } from "@cosmjs/amino";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { AminoTypes } from "@cosmjs/stargate";
import { SigningStargateClient } from "@cosmjs/stargate/build/signingstargateclient";
import api from "api";
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
import { Signer } from "signers/signer";
import { SignerType } from "signers/signerType";
import { StarnameRegistry, TxType } from "starnameRegistry";
import { aminoTypes } from "types/aminoTypes";
import { ResponsePage } from "types/apiPage";
import { Balance } from "types/balance";
import { StdMap } from "types/map";
import { MsgsAndMemo } from "types/msgsAndMemo";
import { Pager } from "types/pager";
import { PostTxResult } from "types/postTxResult";
import { Resource, ResourceInfo } from "types/resourceInfo";
import { TokenLike } from "types/tokenLike";
import { Transaction } from "types/transaction";
import { Tx } from "types/tx";
import { estimateFee, GasConfig } from "utils/estimateFee";

export class Wallet {
  private readonly signer: Signer;
  private readonly rpcUrl: string;
  private readonly gasConfig: GasConfig;

  constructor(signer: Signer, rpcUrl: string, options: GasConfig) {
    this.signer = signer;
    this.rpcUrl = rpcUrl;
    this.gasConfig = options;
  }

  protected async signAndBroadcast(
    msgsAndMemo: MsgsAndMemo,
  ): Promise<PostTxResult> {
    try {
      const txRaw = await this.signMsgsAndMemo(msgsAndMemo);
      const bytes = Uint8Array.from(TxRaw.encode(txRaw).finish());
      return api.rpcPostTx(bytes);
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

    return client.sign(address, messages, fee, memo);
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

  public async getBalances(): Promise<ReadonlyArray<Balance>> {
    const signer: Signer = this.getSigner();
    const task = api.getBalance(await signer.getAddress());
    return task.run();
  }

  public async getTransactions(
    page: Pager,
  ): Promise<StdMap<ResponsePage<Transaction>>> {
    const signer: Signer = this.getSigner();
    const task = api.getTransactions(await signer.getAddress(), page);
    return task.run();
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
    const address: string = await this.getAddress();
    const message: Tx<MsgRegisterDomain> = {
      typeUrl: TxType.Starname.RegisterDomain,
      value: {
        name: domain,
        admin: address,
        domainType: type,
        payer: "",
        broker: api.getBroker(),
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo: "",
    });
  }

  public async registerAccount(
    name: string,
    domain: string,
  ): Promise<PostTxResult> {
    const address: string = await this.getAddress();
    const message: Tx<MsgRegisterAccount> = {
      typeUrl: TxType.Starname.RegisterAccount,
      value: {
        domain: domain,
        name: name,
        owner: address,
        registerer: address,
        resources: [
          {
            uri: api.getDefaultAssetURI(),
            resource: address,
          },
        ],
        broker: api.getBroker(),
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
