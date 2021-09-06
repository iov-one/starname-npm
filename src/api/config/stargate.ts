import { ApiConfig } from "api/config";

export const getStargateEndpoints = (
  apiUrl: string,
  rpcUrl: string,
  validatorsInfoUrl: string,
): ApiConfig => {
  const starname = `${apiUrl}/starname/v1beta1`;
  const cosmos = `${apiUrl}/cosmos`;

  return {
    apiUrl: apiUrl,
    rpcUrl: rpcUrl,
    config: `${starname}/configuration/params`,
    fees: `${starname}/configuration/fees`,
    queryTransactions: `${cosmos}/tx/v1beta1/txs`,
    account: (address: string): string =>
      `${cosmos}/auth/v1beta1/accounts/${address}`,
    accountStarname: (name: string): string => `${starname}/account/${name}`,
    brokerAccounts: (broker: string): string =>
      `${starname}/accounts/broker/${broker}`,
    domainAccounts: (domain: string): string =>
      `${starname}/accounts/domain/${domain}`,
    resourceAccounts: (uri: string, resource: string): string =>
      `${starname}/accounts/resource/${uri}/${resource}`,
    accountsWithOwner: (owner: string | Promise<string>): string =>
      `${starname}/accounts/owner/${owner}`,
    stakingValidators: `${cosmos}/staking/v1beta1/validators`,
    stakingValidator: (address: string): string =>
      `${cosmos}/staking/v1beta1/validators/${address}`,
    validatorLogo: (identity: string): string =>
      `${validatorsInfoUrl}?fields=pictures&key_suffix=${identity}`,
    userDelegations: (address: string): string =>
      `${cosmos}/staking/v1beta1/delegations/${address}`,
    userUnbondings: (address: string): string =>
      `${cosmos}/staking/v1beta1/delegators/${address}/unbonding_delegations`,
    userTotalRewards: (address: string): string =>
      `${cosmos}/distribution/v1beta1/delegators/${address}/rewards`,
    balances: (address: string): string =>
      `${cosmos}/bank/v1beta1/balances/${address}`,
    domainsWithOwner: (owner: string | Promise<string>): string =>
      `${starname}/domains/owner/${owner}`,
    domainInfo: (domain: string): string => `${starname}/domain/${domain}`,
  };
};
