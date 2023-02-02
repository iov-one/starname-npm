import { Coin } from "@cosmjs/amino";
import { EncodeObject } from "@cosmjs/proto-signing";
import {
  Account as CosmosAccount,
  DeliverTxResponse,
  StargateClient,
} from "@cosmjs/stargate";

import { sortTransactions } from "../logic/sortTransactions";
import { EscrowState } from "../proto/iov/escrow/v1beta1/types";
import { TxType } from "../starnameRegistry";
import { Account, transformAccountResponse } from "../types/account";
import { Amount, toInternalCoins } from "../types/amount";
import { ResponsePage } from "../types/apiPage";
import { ValidatorLogoResponse } from "../types/delegationValidator";
import { Domain, transformDomainResponmse } from "../types/domain";
import {
  ApiEscrow,
  Escrow,
  EscrowObject,
  isEscrowDomainObject,
} from "../types/escrow";
import { Fees, transformFeesResponse } from "../types/fees";
import { Reward } from "../types/rewardsResponse";
import {
  Settings,
  StargateSettingsResponse,
  transformSettingsResponse,
} from "../types/settings";
import { StarnameInfo } from "../types/starnameInfo";
import { TokenLike } from "../types/tokenLike";
import { Transaction } from "../types/transaction";
import { Unbonding } from "../types/unbondingsResponse";
import { Delegation } from "../types/userDelegationsResponse";
import { getIOVAddressForStarname } from "../utils/addressResolver";
import { toStargateTxsQuery } from "../utils/toStargateTxsQuery";
import { ApiConfig } from "./config";
import { getStargateEndpoints } from "./config/stargate";
import { Get } from "./http";
import { Task } from "./task";
import { CosmosAccountResponse } from "./types/stargate/accountResponse";
import { StargateBalanceResponse } from "./types/stargate/balanceResponse";
import { BondStatus } from "./types/stargate/bondStatus";
import { StargateDomainInfoResponse } from "./types/stargate/domainInfoResponse";
import { StargateFeesResponse } from "./types/stargate/feesResponse";
import { GenericApiResponse } from "./types/stargate/genericApiResponse";
import { StargateResolveResponse } from "./types/stargate/resolveResponse";
import { ResourceAccountsResponse } from "./types/stargate/resourceAccountsResponse";
import { StargateRewardsResponse } from "./types/stargate/rewardsResponse";
import {
  StargateBaseTx,
  StargateSearchTxResponse,
} from "./types/stargate/searchTxResponse";
import { StargateTransaction } from "./types/stargate/transaction";
import { StargateTxQuery, defaultTxQueries } from "./types/stargate/txQuery";
import { StargateUserDelegationsResponse } from "./types/stargate/userDelegationsResponse";
import { StargateUserUnbondingsResponse } from "./types/stargate/userUndondingsResponse";
import {
  StargateValidator,
  StargateValidatorResponse,
} from "./types/stargate/validatorResponse";
import { StargateValidatorsResponse } from "./types/stargate/validatorsResponse";
import { Buffer } from "buffer/";
import { Asset } from "../types/asset";

export class StarnameClient {
  private stargateClient: StargateClient | null = null;
  private settings: Settings = {} as Settings;
  private tokens: Record<string, TokenLike> = {};
  private assets: Record<string, Asset> = {};
  private mainAsset: Asset = {} as Asset;
  private fees: Fees = {} as Fees;
  private broker = "";
  private api: ApiConfig = getStargateEndpoints("", "", "");

  private chainId = "";

  public static createOffline(): StarnameClient {
    return new StarnameClient();
  }

  public static async createConnected(
    rpcUrl: string,
    apiUrl: string,
    validatorsInfoUrl: string,
    chainTokens: ReadonlyArray<TokenLike>,
    mainAsset: Asset,
    broker?: string,
    assets?: ReadonlyArray<Asset>,
  ): Promise<StarnameClient> {
    const starnameClient = new StarnameClient();
    starnameClient.api = getStargateEndpoints(
      apiUrl,
      rpcUrl,
      validatorsInfoUrl,
    );
    // FIXME: use the asset directory here right?
    starnameClient.tokens = chainTokens.reduce((prev, curr) => {
      return {
        ...prev,
        [curr.ticker]: curr,
      };
    }, {});
    starnameClient.settings = await starnameClient.loadSettings();
    starnameClient.fees = await starnameClient.loadFees();
    starnameClient.mainAsset = mainAsset;
    if (broker) {
      try {
        starnameClient.broker = await Task.toPromise(
          getIOVAddressForStarname(starnameClient, broker),
        );
      } catch {
        starnameClient.broker = "";
      }
    }
    if (assets) {
      starnameClient.assets = assets
        .slice()
        .sort(({ name: n1 }: Asset, { name: n2 }: Asset): number =>
          n1.localeCompare(n2),
        )
        .reduce(
          (
            previousValue: Record<string, Asset>,
            asset: Asset,
          ): Record<string, Asset> => {
            return { ...previousValue, [asset.symbol]: asset };
          },
          {},
        );
    }
    starnameClient.stargateClient = await StargateClient.connect(rpcUrl);
    starnameClient.chainId = await starnameClient.stargateClient.getChainId();

    return starnameClient;
  }

  private loadSettings = async (): Promise<Settings> => {
    const task: Task<StargateSettingsResponse> = Get<StargateSettingsResponse>(
      this.api.config,
    );
    const response = await task.run();

    return transformSettingsResponse(response.config);
  };

  private async loadFees(): Promise<Fees> {
    const task = Get<StargateFeesResponse>(this.api.fees);
    const response = await task.run();
    return transformFeesResponse(response.fees);
  }

  /**
   * Get the cosmos account for associated with [address]
   * @param address
   */
  public getAccount = async (
    address: string,
  ): Promise<CosmosAccount | undefined> => {
    if (!address) throw new Error("no address provided to getAccount");
    const task: Task<CosmosAccountResponse> = Get<CosmosAccountResponse>(
      this.api.account(address),
    );
    const { account } = await task.run();

    return {
      address: account.address,
      pubkey: account.pub_key,
      accountNumber: Number(account.account_number),
      sequence: Number(account.sequence),
    };
  };

  public getBalance(address: string): Task<ReadonlyArray<Amount>> {
    const task = Get<StargateBalanceResponse>(this.api.balances(address));

    return {
      run: async (): Promise<ReadonlyArray<Amount>> => {
        const { balances }: StargateBalanceResponse = await task.run();
        const result = Array<Amount>();
        balances.forEach((balance) => {
          const token = this.getToken(balance.denom);
          if (!token) return;
          const amount = new Amount(Number(balance.amount), token);
          result.push(amount);
        });
        return result;
      },
      abort: (): void => {
        task.abort();
      },
    };
  }

  public resourceAccounts = (address: string): Task<ReadonlyArray<string>> => {
    const task: Task<ResourceAccountsResponse> = Get<ResourceAccountsResponse>(
      this.api.resourceAccounts(this.mainAsset["starname-uri"], address),
    );

    return {
      run: async (): Promise<ReadonlyArray<string>> => {
        const { accounts } = await task.run();
        return accounts.map((account): string =>
          [account.name, account.domain].join("*"),
        );
      },
      abort: (): void => {
        task.abort();
      },
    };
  };

  public resolveStarname = (starname: string): Task<Account> => {
    const task: Task<StargateResolveResponse> = Get<StargateResolveResponse>(
      this.api.accountStarname(starname),
    );

    return {
      run: async (): Promise<Account> => {
        const { account } = await task.run();
        return transformAccountResponse(account);
      },
      abort: (): void => {
        task.abort();
      },
    };
  };

  public getDomainInfo = (name: string): Task<Domain> => {
    const task: Task<StargateDomainInfoResponse> =
      Get<StargateDomainInfoResponse>(this.api.domainInfo(name));

    return {
      run: async (): Promise<Domain> => {
        const result = await task.run();
        const { domain }: StargateDomainInfoResponse = result;
        return transformDomainResponmse(domain);
      },
      abort: () => task.abort(),
    };
  };

  public getAccountsInDomain = (
    domain: Domain,
    pageSize: number,
    pageNumber: number,
  ): Task<ReadonlyArray<Account>> => {
    const task: Task<ResourceAccountsResponse> = Get<ResourceAccountsResponse>(
      this.urlWithQueries(
        this.api.domainAccounts(domain.name),
        pageSize,
        pageNumber,
      ),
    );

    return {
      run: async (): Promise<ReadonlyArray<Account>> => {
        const { accounts } = await task.run();
        return accounts.map(transformAccountResponse);
      },
      abort: () => task.abort(),
    };
  };

  private urlWithQueries = (
    url: string,
    pageSize?: number,
    pageNumber?: number,
  ): string => {
    return (
      url +
      (pageSize ? `?pagination.limit=${pageSize}` : "") +
      (pageNumber ? `&pagination.offset=${pageNumber}` : "")
    );
  };

  public getAccountsWithResource = (
    uri: string,
    resource: string,
  ): Task<ReadonlyArray<Account>> => {
    const task = Get<ResourceAccountsResponse>(
      this.api.resourceAccounts(uri, resource),
    );

    return {
      abort: () => {
        task.abort();
      },
      run: async (): Promise<ReadonlyArray<Account>> => {
        const { accounts } = await task.run();
        return accounts.map(transformAccountResponse);
      },
    };
  };

  public getAccountsWithOwner = (
    owner: string,
    pageSize?: number,
    pageNumber?: number,
  ): Task<ReadonlyArray<Account>> => {
    const task: Task<ResourceAccountsResponse> = Get<ResourceAccountsResponse>(
      this.urlWithQueries(
        this.api.accountsWithOwner(owner),
        pageSize,
        pageNumber,
      ),
    );
    return {
      run: async (): Promise<ReadonlyArray<Account>> => {
        const { accounts } = await task.run();
        return accounts.map(transformAccountResponse);
      },
      abort: (): void => task.abort(),
    };
  };

  public getValidator(address: string): Task<StargateValidator> {
    const task: Task<StargateValidatorResponse> =
      Get<StargateValidatorResponse>(this.api.stakingValidator(address));
    return {
      abort: (): void => {
        task.abort();
      },
      run: async (): Promise<StargateValidator> => {
        const { validator } = await task.run();
        return validator;
      },
    };
  }

  public getValidators(
    bondStatus?: BondStatus,
  ): Task<ReadonlyArray<StargateValidator>> {
    const task: Task<StargateValidatorsResponse> =
      Get<StargateValidatorsResponse>(
        `${this.api.stakingValidators}` +
          (bondStatus !== undefined ? `?status=${BondStatus[bondStatus]}` : ""),
      );
    return {
      abort: (): void => {
        task.abort();
      },
      run: async (): Promise<ReadonlyArray<StargateValidator>> => {
        const { validators } = await task.run();
        return validators;
      },
    };
  }

  public getUserDelegations(
    delegatorAddress: string,
  ): Task<ReadonlyArray<Delegation>> {
    const task = Get<StargateUserDelegationsResponse>(
      this.api.userDelegations(delegatorAddress),
    );

    return {
      abort: (): void => {
        task.abort();
      },

      run: async (): Promise<ReadonlyArray<Delegation>> => {
        const { delegation_responses } = await task.run();
        return delegation_responses;
      },
    };
  }

  public getUnbondings(address: string): Task<ReadonlyArray<Unbonding>> {
    const task = Get<StargateUserUnbondingsResponse>(
      this.api.userUnbondings(address),
    );

    return {
      abort: (): void => {
        task.abort();
      },
      run: async (): Promise<ReadonlyArray<Unbonding>> => {
        const { unbonding_responses } = await task.run();
        return unbonding_responses;
      },
    };
  }

  public getUserRewards(address: string): Task<ReadonlyArray<Reward>> {
    const task = Get<StargateRewardsResponse>(this.api.userRewards(address));

    return {
      abort: (): void => {
        task.abort();
      },
      run: async (): Promise<ReadonlyArray<Reward>> => {
        const { rewards } = await task.run();
        return rewards;
      },
    };
  }

  public getEscrowWithId(escrowId: string): Task<Escrow> {
    const task = Get<GenericApiResponse<{ escrow: ApiEscrow }>>(
      this.api.escrowWithId(escrowId),
    );
    return {
      run: async (): Promise<Escrow> => {
        const {
          result: { escrow },
        } = await task.run();
        return {
          ...escrow,
          state:
            escrow.state === undefined
              ? EscrowState.ESCROW_STATE_OPEN
              : escrow.state,
        };
      },
      abort: (): void => task.abort(),
    };
  }

  public getEscrows(
    seller?: string,
    state?: "open" | "expired",
    starname?: string,
    pageStart?: number,
    pageLength?: number,
  ): Task<ReadonlyArray<Escrow>> {
    const params = new URLSearchParams();
    if (seller) params.set("seller", seller);
    if (state) params.set("state", state);
    if (starname)
      params.set(
        "object",
        Buffer.from(
          starname.indexOf("*") === 0
            ? starname.slice(1)
            : starname.split("*").reverse().join("*"),
        ).toString("hex"),
      );
    if (pageStart) params.set("pagination_start", pageStart.toString());
    if (pageLength) params.set("pagination_length", pageLength.toString());
    const stringedSearchParams = params.toString();
    const task = Get<
      GenericApiResponse<{ escrows: ReadonlyArray<ApiEscrow> | null }>
    >(
      this.api.escrows(
        ...(stringedSearchParams ? [`?${stringedSearchParams}`] : []),
      ),
    );
    return {
      run: async (): Promise<ReadonlyArray<Escrow>> => {
        const { result } = await task.run();
        // api only return escrows with state expired
        // and only cares for open or expired
        return result.escrows
          ? result.escrows.map((_es) => {
              return {
                ..._es,
                state:
                  _es.state === undefined
                    ? EscrowState.ESCROW_STATE_OPEN
                    : _es.state,
              };
            })
          : [];
      },
      abort: (): void => task.abort(),
    };
  }

  public escrowObjectToStarname(object: EscrowObject): string {
    if (isEscrowDomainObject(object)) {
      return `*${object.value.name}`;
    } else {
      return `${object.name}*${object.domain}`;
    }
  }

  private static convertMessageType(msg: any): EncodeObject {
    const { "@type": type, ...value } = msg;
    return {
      typeUrl: type,
      value: value,
    };
  }

  public broadcastTx = async (
    signedTx: Uint8Array,
  ): Promise<DeliverTxResponse> => {
    const client: StargateClient | null = this.stargateClient;
    if (client !== null) {
      return client.broadcastTx(signedTx);
    } else {
      throw new Error("not initialized");
    }
  };

  public getTransactions = (
    address: string,
  ): Task<Record<string, ResponsePage<Transaction>>> => {
    const tasksMap: Record<
      string,
      Task<ResponsePage<Transaction>>
    > = defaultTxQueries.reduce(
      (
        map: Record<string, Task<ResponsePage<Transaction>>>,
        createQuery: (address: string) => StargateTxQuery,
      ): Record<string, Task<ResponsePage<Transaction>>> => {
        const concreteQuery: StargateTxQuery = createQuery(address);
        return {
          ...map,
          [concreteQuery.type]: this.getTransactionsWithQuery(
            this,
            address,
            concreteQuery.parameters,
          ),
        };
      },
      {},
    );
    return {
      run: async (): Promise<Record<string, ResponsePage<Transaction>>> => {
        const entries: [string, Task<ResponsePage<Transaction>>][] =
          Object.entries<Task<ResponsePage<Transaction>>>(tasksMap);
        const awaitedEntries: [string, ResponsePage<Transaction>][] =
          await Promise.all(
            entries.map(
              async ([key, task]: [
                string,
                Task<ResponsePage<Transaction>>,
              ]): Promise<[string, ResponsePage<Transaction>]> => [
                key,
                await task.run(),
              ],
            ),
          );
        return Object.fromEntries<ResponsePage<Transaction>>(awaitedEntries);
      },
      abort: (): void => {
        const tasks: ReadonlyArray<Task<ResponsePage<Transaction>>> =
          Object.values(tasksMap);
        // Abort all tasks
        tasks.forEach((task: Task<ResponsePage<Transaction>>): void =>
          task.abort(),
        );
      },
    };
  };

  // FIXME: Pagination incomplete
  private getTransactionsWithQuery(
    starnameClient: StarnameClient,
    address: string,
    query: Record<string, unknown>,
  ): Task<ResponsePage<Transaction>> {
    const queryString: string = toStargateTxsQuery({
      ...query,
    });
    const url: string = this.api.queryTransactions + `?${queryString}`;
    const task = Get<StargateSearchTxResponse>(url);
    return {
      abort: (): void => {
        task.abort();
      },
      run: async (): Promise<ResponsePage<Transaction>> => {
        const response = await task.run();
        const { tx_responses } = response;
        const convertedTxs = this.convertResponseTxsToStargateTxs(tx_responses);
        const { total } = response.pagination;
        const total_count = total ? Number(total) : 0;
        return {
          pages: 1,
          page: 1,
          requested: 30,
          received: total_count,
          total: total_count,
          items: tx_responses
            ? (
                await Promise.all(
                  convertedTxs.map(
                    this.toInternalTransaction(starnameClient, address),
                  ),
                )
              ).sort(sortTransactions)
            : [],
        };
      },
    };
  }

  // This is done to make this compatible with older implementation
  private convertResponseTxsToStargateTxs(
    txs: ReadonlyArray<StargateBaseTx<any>>,
  ): ReadonlyArray<StargateBaseTx<EncodeObject>> {
    return txs.map((oldUrlTypeTx) => {
      const { tx, ...fields } = oldUrlTypeTx;
      const { body, ...txFields } = tx;
      const { messages, ...bodyFields } = body;
      // We need to modify structure of messages as the one coming in API
      // response is way different from ENCODE Object,
      // if should resemble encode object, so that we can further pass it
      // to check type of tx by encodeObject check functions
      const typeConvertedMsgs = messages.map((msg) =>
        StarnameClient.convertMessageType(msg),
      );
      // Inject modified message ( structure) to body
      // Then other fields from tx
      const modifiedTx = { ...fields } as StargateBaseTx<EncodeObject>;
      modifiedTx.tx = {
        body: { messages: typeConvertedMsgs, ...bodyFields },
        ...txFields,
      };

      return modifiedTx;
    });
  }

  public toInternalCoins(coins: ReadonlyArray<Coin>): ReadonlyArray<Amount> {
    return toInternalCoins(coins, this.tokens);
  }

  public toInternalTransaction(
    client: StarnameClient,
    address: string,
  ): (baseTx: StargateBaseTx<EncodeObject>) => Promise<Transaction> {
    return async (
      baseTx: StargateBaseTx<EncodeObject>,
    ): Promise<Transaction> => {
      const {
        tx: {
          body: { messages },
        },
      } = baseTx;
      const message = messages[0];
      switch (message.typeUrl) {
        case TxType.Bank.Send:
          return StargateTransaction.fromSendBaseTx(client, baseTx, address);
        case TxType.Escrow.CreateEscrow:
          return StargateTransaction.fromCreateEscrowBaseTx(client, baseTx);
        case TxType.Escrow.RefundEscrow:
          return StargateTransaction.fromRefundEscrowBaseTx(client, baseTx);
        case TxType.Escrow.TransferToEscrow:
          return StargateTransaction.fromTransferToEscrowBaseTx(client, baseTx);
        case TxType.Escrow.UpdateEscrow:
          return StargateTransaction.fromUpdateEscrowBaseTx(client, baseTx);
        case TxType.Starname.RegisterAccount:
          return StargateTransaction.fromStarnameBaseTx(client, baseTx);
        case TxType.Starname.TransferAccount:
          return StargateTransaction.fromStarnameBaseTx(client, baseTx);
        case TxType.Starname.DeleteAccount:
          return StargateTransaction.fromStarnameBaseTx(client, baseTx);
        case TxType.Starname.RenewAccount:
          return StargateTransaction.fromStarnameBaseTx(client, baseTx);
        case TxType.Starname.RenewDomain:
          return StargateTransaction.fromStarnameBaseTx(client, baseTx);
        case TxType.Starname.ReplaceAccountMetadata:
          return StargateTransaction.fromStarnameBaseTx(client, baseTx);
        case TxType.Starname.ReplaceAccountResources:
          return StargateTransaction.fromStarnameBaseTx(client, baseTx);
        case TxType.Starname.RegisterDomain:
          return StargateTransaction.fromStarnameBaseTx(client, baseTx);
        case TxType.Starname.TransferDomain:
          return StargateTransaction.fromStarnameBaseTx(client, baseTx);
        case TxType.Starname.DeleteDomain:
          return StargateTransaction.fromStarnameBaseTx(client, baseTx);
        case TxType.Starname.AddAccountCertificate:
          return StargateTransaction.fromStarnameBaseTx(client, baseTx);
        case TxType.Starname.DeleteAccountCertificate:
          return StargateTransaction.fromStarnameBaseTx(client, baseTx);
        case TxType.Staking.Delegate:
          return StargateTransaction.fromStakingBaseTx(client, baseTx);
        case TxType.Staking.Undelegate:
          return StargateTransaction.fromStakingBaseTx(client, baseTx);
        case TxType.Staking.BeginRedelegate:
          return StargateTransaction.fromRedelegateBaseTx(client, baseTx);

        default:
          throw new Error("unknown transaction type: " + message.typeUrl);
      }
    };
  }

  public getChainId(): string {
    return this.chainId;
  }

  public isValidStarname(value: string): boolean {
    const { validAccountName } = this.settings;
    const re = new RegExp(validAccountName);
    return re.test(value);
  }

  public getValidatorLogo(
    baseUrl: string,
    identity: string,
  ): Task<{ identity: string; url?: string }> {
    const task: Task<ValidatorLogoResponse> = Get<ValidatorLogoResponse>(
      `${baseUrl}?fields=pictures&key_suffix=${identity}`,
    );
    return {
      abort: (): void => {
        task.abort();
      },
      run: async (): Promise<{ identity: string; url?: string }> => {
        const response: ValidatorLogoResponse = await task.run();
        // Increasing order acc to tokens
        if (response.status.code !== 0) return { identity };
        return {
          identity: identity,
          url: response.them[0].pictures.primary.url,
        };
      },
    };
  }

  /**
   * Query a starname from the blockchain.
   * @param {string} starname - The starname you want to lookup
   *
   * On success a `Starname` object is returned with all the relevant
   * information like the resources associated with `starname`
   *
   * On failure, if the accounts was not found a `FetchError` is thrown
   * with code `3`.
   * Look for message in error to know which query actually failed
   */
  public getStarnameInfo(starname: string): Task<StarnameInfo> {
    if (starname.split("*").length !== 2)
      throw new Error("Not a valid starname");
    const domain = starname.split("*")[1];
    let accountTask: Task<Account> | null = null;
    const domainTask: Task<Domain> = this.getDomainInfo(domain);
    return {
      run: async (): Promise<StarnameInfo> => {
        // run domain task first as there is no meaning of a account with a real domain
        const domainInfo = await domainTask.run();
        accountTask = this.resolveStarname(starname);
        return {
          ...(await accountTask.run()),
          domain: domainInfo,
        };
      },
      abort: (): void => {
        domainTask.abort();
        if (accountTask !== null) {
          accountTask.abort();
        }
      },
    };
  }

  public getDefaultAssetURI(): string {
    const { mainAsset } = this;
    return mainAsset["starname-uri"];
  }

  public getBroker(): string {
    return this.broker;
  }

  public getAssets = (): ReadonlyArray<Asset> => {
    return Object.values(this.assets);
  };

  public getTokenBySymbol = (symbol: string): TokenLike | undefined => {
    return this.tokens[symbol];
  };

  public getToken = (subunitName: string): TokenLike | undefined => {
    const tokens = Object.values(this.tokens);
    return tokens.find(
      (_t) => _t.subunitName.toUpperCase() === subunitName.toUpperCase(),
    );
  };

  public getFees = (): Fees => {
    return this.fees;
  };

  public getSettings = (): Settings => {
    return this.settings;
  };

  public getAssetByUri = (uri: string): Asset | undefined => {
    const assets: ReadonlyArray<Asset> = Object.values(this.assets);
    return assets.find(
      (chain: Asset): boolean => chain["starname-uri"] === uri,
    );
  };

  public getAssetByTicker = (ticker: string): Asset | undefined => {
    return this.assets[ticker];
  };

  public getMainToken(): TokenLike {
    const { tokens } = this;
    const { symbol } = this.mainAsset;
    if (symbol === undefined) throw new Error("StarnameClient not initialized");
    const found = Object.values(tokens).find((token: TokenLike): boolean => {
      return token.ticker.toLowerCase() === symbol.toLowerCase();
    });
    if (found !== undefined) {
      return found;
    } else {
      throw new Error("cannot find main token");
    }
  }
}
