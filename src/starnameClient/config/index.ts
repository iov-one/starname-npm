type UrlBuilder = (...value: string[]) => string;

export interface ApiConfig {
  readonly apiUrl: string;
  readonly rpcUrl: string;
  readonly config: string;
  readonly fees: string;
  readonly queryTransactions: string;
  readonly brokerAccounts?: UrlBuilder;
  readonly account: UrlBuilder;
  readonly accountStarname: UrlBuilder;
  readonly domainInfo: UrlBuilder;
  readonly domainAccounts: UrlBuilder;
  readonly resourceAccounts: UrlBuilder;
  readonly accountsWithOwner: UrlBuilder;
  readonly stakingValidators: string;
  readonly stakingValidator: UrlBuilder;
  readonly validatorLogo: UrlBuilder;
  readonly userDelegations: UrlBuilder;
  readonly userUnbondings: UrlBuilder;
  readonly userRewards: UrlBuilder;
  readonly balances: UrlBuilder;
  readonly domainsWithOwner: UrlBuilder;
  readonly escrowWithId: UrlBuilder;
  readonly escrows: UrlBuilder;
}
