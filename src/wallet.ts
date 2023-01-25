import { StdSignature, StdSignDoc } from "@cosmjs/amino";
import { fromBase64 } from "@cosmjs/encoding";
import { OfflineSigner } from "@cosmjs/proto-signing";
import {
  AminoTypes,
  createAuthzAminoConverters,
  createBankAminoConverters,
  createDistributionAminoConverters,
  createFeegrantAminoConverters,
  createGovAminoConverters,
  createIbcAminoConverters,
  createStakingAminoConverters,
  createVestingAminoConverters,
} from "@cosmjs/stargate";
import { SigningStargateClient } from "@cosmjs/stargate/build/signingstargateclient";
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import { MsgWithdrawDelegatorReward } from "cosmjs-types/cosmos/distribution/v1beta1/tx";
import {
  MsgBeginRedelegate,
  MsgDelegate,
  MsgUndelegate,
} from "cosmjs-types/cosmos/staking/v1beta1/tx";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

import { TxRejected } from "./constants/errorCodes";
import { FAVORITE_ASSET_URI } from "./constants/favoriteAssetUri";
import {
  MsgCreateEscrow,
  MsgRefundEscrow,
  MsgTransferToEscrow,
  MsgUpdateEscrow,
} from "./proto/iov/escrow/v1beta1/tx";
import {
  MsgAddAccountCertificate,
  MsgDeleteAccount,
  MsgDeleteAccountCertificate,
  MsgDeleteDomain,
  MsgRegisterAccount,
  MsgRegisterDomain,
  MsgRenewAccount,
  MsgRenewDomain,
  MsgReplaceAccountMetadata,
  MsgReplaceAccountResources,
  MsgTransferAccount,
  MsgTransferDomain,
} from "./proto/iov/starname/v1beta1/tx";
import { Resource } from "./proto/iov/starname/v1beta1/types";
import { Signer } from "./signers/signer";
import { SignerType } from "./signers/signerType";
import { StarnameClient } from "./starnameClient";
import { Task } from "./starnameClient/task";
import { StarnameRegistry, TxType } from "./starnameRegistry";
import { customStarnameAminoTypes } from "./types/aminoTypes";
import { Amount } from "./types/amount";
import { ResponsePage } from "./types/apiPage";
import { AssetResource } from "./types/assetResource";
import { ChainMap } from "./types/chainMap";
import { FeeEstimator } from "./types/feeEstimator";
import { MsgsAndMemo } from "./types/msgsAndMemo";
import { Pager } from "./types/pager";
import { PostTxResult } from "./types/postTxResult";
import { Starname } from "./types/starname";
import { TokenLike } from "./types/tokenLike";
import { Transaction } from "./types/transaction";
import { Tx } from "./types/tx";
import { constructTransferrableObject } from "./utils/constructTransferrableObject";
import { createResourcesFromAddressGroup } from "./utils/createResourcesFromAddressGroup";
import { estimateFee } from "./utils/estimateFee";
import { Buffer } from "buffer/";

export interface WalletOptions {
  readonly feeEstimator: FeeEstimator;
}

export class Wallet {
  private readonly starnameClient: StarnameClient;
  private readonly signer: Signer;
  private readonly feeEstimator: FeeEstimator;

  constructor(signer: Signer, client: StarnameClient, options?: WalletOptions) {
    this.starnameClient = client;
    this.signer = signer;
    this.feeEstimator = options ? options.feeEstimator : estimateFee;
  }

  protected async signAndBroadcast(
    msgsAndMemo: MsgsAndMemo,
  ): Promise<PostTxResult> {
    const { starnameClient } = this;
    try {
      // signing
      const txRaw = await this.signMsgsAndMemo(msgsAndMemo);
      // transpile
      const bytes = Uint8Array.from(TxRaw.encode(txRaw).finish());
      // broadcast
      return starnameClient.broadcastTx(bytes);
    } catch (exception: any) {
      if (exception.message !== "Request rejected") {
        throw exception;
      } else {
        return {
          transactionHash: "",
          height: 0,
          code: TxRejected,
          rawLog: "",
          amount: [],
          events: [],
          gas: "",
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
    const fee = this.feeEstimator(messages);
    const registry = new StarnameRegistry();

    const defaultAminoTypes = {
      ...createAuthzAminoConverters(),
      ...createBankAminoConverters(),
      ...createDistributionAminoConverters(),
      ...createGovAminoConverters(),
      ...createStakingAminoConverters(""),
      ...createIbcAminoConverters(),
      ...createFeegrantAminoConverters(),
      ...createVestingAminoConverters(),
    };

    const client = await SigningStargateClient.offline(signer, {
      registry,
      aminoTypes: new AminoTypes({
        ...defaultAminoTypes,
        ...customStarnameAminoTypes,
      }),
    });

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

  public getSigner(): Signer {
    return this.signer;
  }

  public disconnect(): void {
    return this.signer.disconnect();
  }

  public getBalances(): Task<ReadonlyArray<Amount>> {
    let task: Task<ReadonlyArray<Amount>> | null = null;
    return {
      run: async (): Promise<ReadonlyArray<Amount>> => {
        const { starnameClient } = this;
        const signer: Signer = this.getSigner();
        task = starnameClient.getBalance(await signer.getAddress());
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
        const { starnameClient } = this;
        const signer: Signer = this.getSigner();
        task = starnameClient.getTransactions(await signer.getAddress(), page);
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
    targets: ReadonlyArray<AssetResource>,
    profile: ReadonlyArray<Resource>,
    preferredAsset: string,
    memo = "",
  ): Promise<PostTxResult> {
    const address = await this.getAddress();
    const message: Tx<MsgReplaceAccountResources> = {
      typeUrl: TxType.Starname.ReplaceAccountResources,
      value: {
        domain: domain,
        name: "",
        newResources: [
          ...targets.map(
            ({ asset, address }: AssetResource): Resource => ({
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
      memo,
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
    targets: ReadonlyArray<AssetResource>,
    profile: ReadonlyArray<Resource>,
    preferredAsset: string,
    memo = "",
  ): Promise<PostTxResult> {
    const address = await this.getAddress();
    const message: Tx<MsgReplaceAccountResources> = {
      typeUrl: TxType.Starname.ReplaceAccountResources,
      value: {
        domain: domain,
        name: name,
        newResources: this.sanitizeResources([
          ...targets.map(
            ({ asset, address }: AssetResource): Resource => ({
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
      memo,
    });
  }

  public async addAccountCertificate(
    name: string,
    domain: string,
    certificate: string,
    memo = "",
  ): Promise<PostTxResult> {
    const owner = await this.getAddress();
    const addAccountCertificateMsg: Tx<MsgAddAccountCertificate> = {
      typeUrl: TxType.Starname.AddAccountCertificate,
      value: {
        domain,
        name,
        owner,
        newCertificate: fromBase64(Buffer.from(certificate).toString("base64")),
        payer: "",
      },
    };

    return this.signAndBroadcast({
      messages: [addAccountCertificateMsg],
      memo,
    });
  }

  /**
   *
   * @param name
   * @param domain
   * @param b64Certificate - A base64 encoded JSON certificate
   * @returns PostTxResult
   */
  public async deleteAccountCertificate(
    name: string,
    domain: string,
    b64Certificate: string,
    memo = "",
  ): Promise<PostTxResult> {
    const owner = await this.getAddress();
    const deleteAccountCertificateMsg: Tx<MsgDeleteAccountCertificate> = {
      typeUrl: TxType.Starname.DeleteAccountCertificate,
      value: {
        name,
        domain,
        deleteCertificate: fromBase64(b64Certificate),
        owner,
        payer: "",
      },
    };

    return this.signAndBroadcast({
      messages: [deleteAccountCertificateMsg],
      memo,
    });
  }

  public async createEscrow(
    amount: Amount,
    item: Starname,
    deadline: Date,
    memo = "",
  ): Promise<PostTxResult> {
    if (this.getSignerType() === SignerType.Ledger)
      throw new Error("ledger unsupported");
    const address = await this.getAddress();
    const createEscrowMsg: Tx<MsgCreateEscrow> = {
      typeUrl: TxType.Escrow.CreateEscrow,
      value: {
        seller: address,
        feePayer: "",
        price: [...amount.toCoins()],
        deadline: Math.floor(deadline.getTime() / 1000),
        object: constructTransferrableObject(item),
      },
    };
    return this.signAndBroadcast({
      messages: [createEscrowMsg],
      memo,
    });
  }

  public async updateEscrow(
    id: string,
    newAmount: Amount,
    newDeadline: Date,
    newSeller: string,
    memo = "",
  ): Promise<PostTxResult> {
    if (this.getSignerType() === SignerType.Ledger)
      throw new Error("ledger unsupported");
    const address = await this.getAddress();
    const updateEscrowMsg: Tx<MsgUpdateEscrow> = {
      typeUrl: TxType.Escrow.UpdateEscrow,
      value: {
        id,
        feePayer: "",
        price: [...newAmount.toCoins()],
        deadline: Math.floor(newDeadline.getTime() / 1000),
        seller: newSeller,
        updater: address,
      },
    };

    return this.signAndBroadcast({
      messages: [updateEscrowMsg],
      memo,
    });
  }

  public async transferToEscrow(
    id: string,
    amount: Amount,
    memo = "",
  ): Promise<PostTxResult> {
    if (this.getSignerType() === SignerType.Ledger)
      throw new Error("ledger unsupported");

    const address = await this.getAddress();

    const transferToEscrowMsg: Tx<MsgTransferToEscrow> = {
      typeUrl: TxType.Escrow.TransferToEscrow,
      value: {
        id,
        feePayer: "",
        amount: [...amount.toCoins()],
        sender: address,
      },
    };

    return this.signAndBroadcast({
      messages: [transferToEscrowMsg],
      memo,
    });
  }

  public async deleteEscrow(id: string, memo = ""): Promise<PostTxResult> {
    if (this.getSignerType() === SignerType.Ledger)
      throw new Error("ledger unsupported");
    const address = await this.getAddress();
    const refundEscrowMsg: Tx<MsgRefundEscrow> = {
      typeUrl: TxType.Escrow.RefundEscrow,
      value: {
        id,
        sender: address,
        feePayer: "",
      },
    };

    return this.signAndBroadcast({
      messages: [refundEscrowMsg],
      memo,
    });
  }

  public async registerDomain(
    domain: string,
    type: "closed" | "open" = "closed",
    expired = false,
    memo = "",
  ): Promise<PostTxResult> {
    const { starnameClient } = this;
    const address: string = await this.getAddress();
    const message: Tx<MsgRegisterDomain> = {
      typeUrl: TxType.Starname.RegisterDomain,
      value: {
        name: domain,
        admin: address,
        domainType: type,
        payer: "",
        broker: starnameClient.getBroker(),
      },
    };

    return this.signAndBroadcast({
      messages: [
        ...(expired
          ? [
              {
                typeUrl: TxType.Starname.DeleteDomain,
                value: {
                  domain: domain,
                  owner: address,
                  payer: "",
                },
              },
            ]
          : []),
        message,
      ],
      memo,
    });
  }

  public getOtherChainResources = async (
    chains: ChainMap,
  ): Promise<Array<Resource>> => {
    const { signer } = this;

    switch (this.getSignerType()) {
      case SignerType.Keplr:
      case SignerType.Google:
      case SignerType.SeedPhrase: {
        // Now request signer to provide addressGroup ( for chains )
        const addressGroup = await signer.getAddressGroup(chains);
        return createResourcesFromAddressGroup(addressGroup, chains);
      }
      default:
        return [];
    }
  };

  public async registerAccount(
    name: string,
    domain: string,
    chains?: ChainMap,
    expired = false,
    memo = "",
  ): Promise<PostTxResult> {
    const address: string = await this.getAddress();
    const resources: Array<Resource> = [];
    // Set default resource first
    resources.push({
      uri: this.starnameClient.getDefaultAssetURI(),
      resource: address,
    });
    // if require generation of other chain addresses as well
    if (chains) {
      try {
        const otherChainResources = await this.getOtherChainResources(chains);
        resources.push(...otherChainResources);
      } catch (error) {
        console.warn("Failure getting other chain resources");
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
        broker: this.starnameClient.getBroker(),
        payer: "",
      },
    };

    return this.signAndBroadcast({
      messages: [
        ...(expired
          ? [
              {
                typeUrl: TxType.Starname.DeleteAccount,
                value: {
                  domain,
                  name,
                  owner: address,
                  payer: "",
                },
              },
            ]
          : []),
        message,
      ],
      memo,
    });
  }

  public async transferDomain(
    domain: string,
    recipient: string,
    transferFlag: 0 | 1 | 2 = 0,
    memo = "",
  ): Promise<PostTxResult> {
    const message: Tx<MsgTransferDomain> = {
      typeUrl: TxType.Starname.TransferDomain,
      value: {
        domain: domain,
        owner: await this.getAddress(),
        newAdmin: recipient,
        transferFlag,
        payer: "",
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo,
    });
  }

  public async transferAccount(
    name: string,
    domain: string,
    recipient: string,
    reset = true,
    memo = "",
  ): Promise<PostTxResult> {
    const address = await this.getAddress();
    const message: Tx<MsgTransferAccount> = {
      typeUrl: TxType.Starname.TransferAccount,
      value: {
        name: name,
        domain: domain,
        owner: address,
        newOwner: recipient,
        reset,
        payer: "",
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo,
    });
  }

  public async deleteDomain(domain: string, memo = ""): Promise<PostTxResult> {
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
      memo,
    });
  }

  public async deleteAccount(
    name: string,
    domain: string,
    memo = "",
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
      memo,
    });
  }

  public async renewDomain(domain: string, memo = ""): Promise<PostTxResult> {
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
      memo,
    });
  }

  public async renewAccount(
    name: string,
    domain: string,
    memo = "",
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
      memo,
    });
  }

  public async delegateAmount(
    validatorAddress: string,
    amount: Amount,
    memo = "",
  ): Promise<PostTxResult> {
    const address: string = await this.getAddress();
    const message: Tx<MsgDelegate> = {
      typeUrl: TxType.Staking.Delegate,
      value: {
        delegatorAddress: address,
        validatorAddress: validatorAddress,
        amount: amount.toCoins()[0],
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo,
    });
  }

  public async unDelegateAmount(
    validatorAddress: string,
    amount: Amount,
    memo = "",
  ): Promise<PostTxResult> {
    const address: string = await this.getAddress();
    const message: Tx<MsgUndelegate> = {
      typeUrl: TxType.Staking.Undelegate,
      value: {
        delegatorAddress: address,
        validatorAddress: validatorAddress,
        amount: amount.toCoins()[0],
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo,
    });
  }

  public async redelegateAmount(
    validatorSource: string,
    validatorDestination: string,
    amount: Amount,
    memo = "",
  ): Promise<PostTxResult> {
    const address: string = await this.getAddress();
    const message: Tx<MsgBeginRedelegate> = {
      typeUrl: TxType.Staking.BeginRedelegate,
      value: {
        delegatorAddress: address,
        validatorSrcAddress: validatorSource,
        validatorDstAddress: validatorDestination,
        amount: amount.toCoins()[0],
      },
    };

    return this.signAndBroadcast({
      messages: [message],
      memo,
    });
  }

  public async claimReward(
    validatorAddresses: ReadonlyArray<string>,
    memo = "",
  ): Promise<PostTxResult> {
    const address: string = await this.getAddress();
    const composeMessage = (
      validatorAddr: string,
    ): Tx<MsgWithdrawDelegatorReward> => {
      return {
        typeUrl: TxType.Distribution.WithdrawDelegatorReward,
        value: {
          delegatorAddress: address,
          validatorAddress: validatorAddr,
        },
      };
    };

    return this.signAndBroadcast({
      messages: validatorAddresses.map(composeMessage),
      memo,
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
      memo,
    });
  }

  public async setMetadataURI(
    name: string,
    domain: string,
    uri: string | null,
    memo = "",
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
      memo,
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
