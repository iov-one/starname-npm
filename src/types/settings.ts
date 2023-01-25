export interface StargateSettingsResponse {
  config: ApiSettings;
}

export interface Settings {
  configurer: string;
  validDomainName: string;
  validAccountName: string;
  validUri: string;
  validResource: string;
  domainRenewalPeriod: number;
  domainRenewalCountMax: number;
  domainGracePeriod: number;
  accountRenewalPeriod: number;
  accountRenewalCountMax: number;
  accountGradePeriod: number;
  certificateSizeMax: number;
  certificateCountMax: number;
  metadataSizeMax: number;
  escrowBroker: string;
  escrowCommission: number;
  escrowMaxPeriod: number;
}

export interface ApiSettings {
  configurer: string;
  valid_domain_name: string;
  valid_account_name: string;
  valid_uri: string;
  valid_resource: string;
  domain_renewal_period: string;
  domain_renewal_count_max: number;
  domain_grace_period: string;
  account_renewal_period: string;
  account_renewal_count_max: number;
  account_grace_period: string;
  certificate_size_max: string;
  certificate_count_max: number;
  metadata_size_max: string;
  escrow_broker: string;
  escrow_commission: string;
  escrow_max_period: string;
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
  validUri: config.valid_uri,
  validResource: config.valid_resource,
  domainRenewalPeriod: parseInt(config.domain_renewal_period) * 1000,
  domainRenewalCountMax: config.domain_renewal_count_max,
  domainGracePeriod: parseInt(config.domain_grace_period) * 1000,
  accountRenewalPeriod: parseInt(config.account_renewal_period) * 1000,
  accountRenewalCountMax: config.account_renewal_count_max,
  accountGradePeriod: parseInt(config.account_grace_period) * 1000,
  certificateSizeMax: parseInt(config.certificate_size_max),
  certificateCountMax: config.certificate_count_max,
  metadataSizeMax: parseInt(config.metadata_size_max),
  escrowBroker: config.escrow_broker,
  escrowCommission: Number(config.escrow_commission),
  escrowMaxPeriod: parseInt(config.escrow_max_period) * 1000,
});
