import { Coin } from "@cosmjs/amino";
import { EncodeObject } from "@cosmjs/proto-signing";
import { Account as CosmosAccount, StargateClient } from "@cosmjs/stargate";
import assetsStarname from "@iov/asset-directory/starname/assets.json";
import { ApiConfig } from "api/config";
import { getStargateEndpoints } from "api/config/stargate";
import { Get } from "api/http";
import { Task } from "api/task";
import { CosmosAccountResponse } from "api/types/stargate/accountResponse";
import { StargateBalanceResponse } from "api/types/stargate/balanceResponse";
import { StargateDomainInfoResponse } from "api/types/stargate/domainInfoResponse";
import { StargateFeesResponse } from "api/types/stargate/feesResponse";
import { StargateResolveResponse } from "api/types/stargate/resolveResponse";
import { ResourceAccountsResponse } from "api/types/stargate/resourceAccountsResponse";
import { StargateRewardsResponse } from "api/types/stargate/rewardsResponse";
import {
  StargateBaseTx,
  StargateSearchTxResponse,
} from "api/types/stargate/searchTxResponse";
import { StargateTransaction } from "api/types/stargate/transaction";
import queries, { StargateTxQuery } from "api/types/stargate/txQuery";
import { StargateUserDelegationsResponse } from "api/types/stargate/userDelegationsResponse";
import { StargateUserUnbondingsResponse } from "api/types/stargate/userUndondingsResponse";
import {
  StargateValidator,
  StargateValidatorResponse,
} from "api/types/stargate/validatorResponse";
import { StargateValidatorsResponse } from "api/types/stargate/validatorsResponse";
import { stargateToQueryString } from "api/utils/stargateToQueryString";
import { sortTransactions } from "logic/sortTransactions";
import { Account, Domain } from "proto/types";
import { TxType } from "starnameRegistry";
import { Amount, toInternalCoins } from "types/amount";
import { ResponsePage } from "types/apiPage";
import { Asset } from "types/asset";
import { Balance } from "types/balance";
import { ValidatorLogoResponse } from "types/delegationValidator";
import { Fees, transformFeesResponse } from "types/fees";
import { Pager } from "types/pager";
import { PostTxResult } from "types/postTxResult";
import { Starname } from "types/resolveResponse";
import {
  Settings,
  StargateSettingsResponse,
  transformSettingsResponse,
} from "types/settings";
import { TokenLike } from "types/tokenLike";
import { Transaction } from "types/transaction";
import { Unbonding } from "types/unbondingsResponse";
import { Delegation } from "types/userDelegationsResponse";
import { getIOVAddressForStarname } from "utils/addressResolver";
import { GenericQuery } from "utils/queryString";

export class StarnameApi {
  private client: StargateClient | null = null;
  private settings: Settings = {} as Settings;
  private tokens: Record<string, TokenLike> = {};
  private assets: Record<string, Asset> = {};
  private mainAsset: Asset = {} as Asset;
  private fees: Fees = {} as Fees;
  private broker = "";
  private api: ApiConfig = getStargateEndpoints("", "", "");

  private chainId = "";

  public async initialize(
    rpcUrl: string,
    apiUrl: string,
    validatorsInfoUrl: string,
    tokens: Record<string, TokenLike>,
    mainAsset: Asset,
    broker?: string,
  ): Promise<void> {
    this.api = getStargateEndpoints(apiUrl, rpcUrl, validatorsInfoUrl);
    this.tokens = tokens;
    this.settings = await this.loadSettings();
    this.fees = await this.loadFees();
    this.mainAsset = mainAsset;
    const assets: ReadonlyArray<any> = [
      ...(assetsStarname as ReadonlyArray<any>),
    ].sort(({ name: n1 }: Asset, { name: n2 }: Asset): number =>
      n1.localeCompare(n2),
    );
    if (broker) {
      try {
        this.broker = await Task.toPromise(
          getIOVAddressForStarname(this, broker),
        );
      } catch {
        this.broker = "";
      }
    }
    this.assets = assets.reduce(
      (
        previousValue: Record<string, Asset>,
        asset: Asset,
      ): Record<string, Asset> => {
        return { ...previousValue, [asset.symbol]: asset };
      },
      {},
    );
    const client = await StargateClient.connect(rpcUrl);
    this.client = client;
    this.chainId = await client.getChainId();
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

  public getBalance(address: string): Task<ReadonlyArray<Balance>> {
    const task = Get<StargateBalanceResponse>(this.api.balances(address));

    return {
      run: async (): Promise<ReadonlyArray<Balance>> => {
        const { balances }: StargateBalanceResponse = await task.run();
        const result = Array<Balance>();
        if (balances.length > 0) {
          balances.forEach((balance) => {
            const token = this.getToken(balance.denom);
            if (!token) return;
            const amount = new Amount(Number(balance.amount), token);
            result.push({ address, amount });
          });
        } else {
          const token = this.getMainToken();
          const amount = new Amount(0, token);
          result.push({ address, amount });
        }
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
        return accounts.map((account: Account): string =>
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
        return account;
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
        return {
          name: domain.name,
          admin: domain.admin,
          validUntil: Number(domain.validUntil),
          type: domain.type,
          broker: domain.broker,
        };
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
        return accounts;
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
        return accounts;
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

  public getValidators(): Task<ReadonlyArray<StargateValidator>> {
    const task: Task<StargateValidatorsResponse> =
      Get<StargateValidatorsResponse>(this.api.stakingValidators);
    return {
      abort: (): void => {
        task.abort();
      },
      run: async (): Promise<ReadonlyArray<StargateValidator>> => {
        const { validators } = await task.run();
        const resultValidators = [...validators];
        // Increasing order acc to tokens
        return resultValidators.sort((a, b) =>
          Number(a.tokens) < Number(b.tokens) ? 1 : -1,
        );
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

  public getTotalRewards(address: string): Task<ReadonlyArray<Coin>> {
    const task = Get<StargateRewardsResponse>(
      this.api.userTotalRewards(address),
    );

    return {
      abort: (): void => {
        task.abort();
      },
      run: async (): Promise<ReadonlyArray<Coin>> => {
        const { total } = await task.run();
        return total;
      },
    };
  }

  private static convertMessageType(msg: any): EncodeObject {
    const { "@type": type, ...value } = msg;
    return {
      typeUrl: type,
      value: value,
    };
  }

  public rpcPostTx = async (signedTx: Uint8Array): Promise<PostTxResult> => {
    const client: StargateClient | null = this.client;
    if (client !== null) {
      return client.broadcastTx(signedTx);
    } else {
      throw new Error("not initialized");
    }
  };

  public getTransactions = (
    address: string,
    page: Pager,
  ): Task<Record<string, ResponsePage<Transaction>>> => {
    const tasksMap: Record<
      string,
      Task<ResponsePage<Transaction>>
    > = queries.reduce(
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
            page,
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
    starnameApi: StarnameApi,
    address: string,
    query: GenericQuery,
    page: Pager,
  ): Task<ResponsePage<Transaction>> {
    const queryString: string = stargateToQueryString({
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
                    this.toInternalTransaction(starnameApi, address),
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
        StarnameApi.convertMessageType(msg),
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
    starnameApi: StarnameApi,
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
          return StargateTransaction.fromSendBaseTx(
            starnameApi,
            baseTx,
            address,
          );
        case TxType.Starname.RegisterAccount:
          return StargateTransaction.fromStarnameBaseTx(starnameApi, baseTx);
        case TxType.Starname.TransferAccount:
          return StargateTransaction.fromStarnameBaseTx(starnameApi, baseTx);
        case TxType.Starname.DeleteAccount:
          return StargateTransaction.fromStarnameBaseTx(starnameApi, baseTx);
        case TxType.Starname.RenewAccount:
          return StargateTransaction.fromStarnameBaseTx(starnameApi, baseTx);
        case TxType.Starname.RenewDomain:
          return StargateTransaction.fromStarnameBaseTx(starnameApi, baseTx);
        case TxType.Starname.ReplaceAccountMetadata:
          return StargateTransaction.fromStarnameBaseTx(starnameApi, baseTx);
        case TxType.Starname.ReplaceAccountResources:
          return StargateTransaction.fromStarnameBaseTx(starnameApi, baseTx);
        case TxType.Starname.RegisterDomain:
          return StargateTransaction.fromStarnameBaseTx(starnameApi, baseTx);
        case TxType.Starname.TransferDomain:
          return StargateTransaction.fromStarnameBaseTx(starnameApi, baseTx);
        case TxType.Starname.DeleteDomain:
          return StargateTransaction.fromStarnameBaseTx(starnameApi, baseTx);
        case TxType.Staking.Delegate:
          return StargateTransaction.fromStakingBaseTx(starnameApi, baseTx);
        case TxType.Staking.Undelegate:
          return StargateTransaction.fromStakingBaseTx(starnameApi, baseTx);
        case TxType.Staking.BeginRedelegate:
          return StargateTransaction.fromStakingBaseTx(starnameApi, baseTx);

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
   */
  public getStarname(starname: string): Task<Starname> {
    const accountTask: Task<Account> = this.resolveStarname(starname);
    let domainTask: Task<Domain> | null = null;
    return {
      run: async (): Promise<Starname> => {
        const account: Account = await accountTask.run();
        domainTask = this.getDomainInfo(account.domain);
        // Make it a full NameItem
        return {
          ...account,
          domain: await domainTask.run(),
        };
      },
      abort: (): void => {
        if (domainTask !== null) {
          domainTask.abort();
        }
        accountTask.abort();
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

  /**
   * @deprecated('The asset directory should be used')
   */
  public getAssets = (): ReadonlyArray<Asset> => {
    return Object.values(this.assets);
  };

  /**
   * @deprecated('The asset directory should be used')
   */
  public getChains = (): ReadonlyArray<Asset> => {
    return Object.values(this.assets);
  };

  /**
   * @deprecated('This should be a configuration value')
   */
  public getToken = (subunitName: string): TokenLike | undefined => {
    return this.tokens[subunitName];
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
    const chains: Asset[] = Object.values(this.assets);
    return chains.find(
      ({ symbol }: Asset): boolean =>
        symbol.toLowerCase() === ticker.toLocaleLowerCase(),
    );
  };

  public getChainById = (id: string): Asset | undefined => {
    return this.assets[id];
  };

  public getMainToken(): TokenLike {
    const { denom } = this.mainAsset;
    return this.tokens[denom];
  }
}
