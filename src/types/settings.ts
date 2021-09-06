export interface StargateSettingsResponse {
  config: ApiSettings;
}

export interface Settings {
  configurer: string;
  validDomainName: string;
  validAccountName: string;
  validBlockchainID: string;
  domainRenewalPeriod: number;
  domainRenewalCountMax: number;
  domainGracePeriod: number;
  accountRenewalPeriod: number;
  accountRenewalCountMax: number;
  blockchainTargetMax: number;
  certificateSizeMax: number;
  certificateCountMax: number;
  metadataSizeMax: number;
}

export interface ApiSettings {
  configurer: string;
  valid_domain_name: string;
  valid_account_name: string;
  valid_blockchain_id: string;
  domain_renewal_period: number;
  domain_renewal_count_max: number;
  domain_grace_period: number;
  account_renewal_period: number;
  account_renewal_count_max: number;
  blockchain_target_max: number;
  certificate_size_max: number;
  certificate_count_max: number;
  metadata_size_max: number;
}

export interface SettingsResponse {
  height: number;
  result: {
    configuration: ApiSettings;
  };
}

export const transformSettingsResponse = (config: ApiSettings): Settings => ({
  configurer: config.configurer,
  validDomainName: config.valid_domain_name,
  validAccountName: config.valid_account_name,
  validBlockchainID: config.valid_blockchain_id,
  domainRenewalPeriod: config.domain_renewal_period,
  domainRenewalCountMax: config.domain_renewal_count_max,
  domainGracePeriod: config.domain_grace_period,
  accountRenewalPeriod: config.account_renewal_period,
  accountRenewalCountMax: config.account_renewal_count_max,
  blockchainTargetMax: config.blockchain_target_max,
  certificateSizeMax: config.certificate_size_max,
  certificateCountMax: config.certificate_count_max,
  metadataSizeMax: config.metadata_size_max,
});
