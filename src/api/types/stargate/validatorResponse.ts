export interface StargateValidator {
  readonly operator_address: string;
  readonly consensus_pubkey: {
    readonly type_url: string;
    readonly value: string;
  };
  readonly jailed: true;
  readonly status: string;
  readonly tokens: string;
  readonly delegator_shares: string;
  readonly description: {
    readonly moniker: string;
    readonly identity: string;
    readonly website: string;
    readonly security_contact: string;
    readonly details: string;
  };
  readonly unbonding_height: string;
  readonly unbonding_time: string;
  readonly commission: {
    readonly commission_rates: {
      readonly rate: string;
      readonly max_rate: string;
      readonly max_change_rate: string;
    };
    readonly update_time: string;
  };
  readonly min_self_delegation: string;
}

export interface StargateValidatorResponse {
  validator: StargateValidator;
}
