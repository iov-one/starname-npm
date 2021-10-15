import { StargateValidator } from "../starnameClient/types/stargate/validatorResponse";

export type Validator = LaunchPadValidator | StargateValidator;

export interface LaunchPadValidator {
  readonly operator_address: string;
  readonly consensus_pubkey: string;
  readonly jailed: boolean;
  readonly status: number;
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

export interface SingleValidatorResponse {
  readonly height: string;
  readonly result: Validator;
}

export interface ValidatorResponse {
  readonly height: string;
  readonly result: Array<Validator>;
}

export interface ValidatorLogoResponse {
  readonly status: {
    readonly code: number;
    readonly name: string;
  };
  readonly them: Array<{
    readonly id: string;
    readonly pictures: {
      readonly primary: {
        readonly url: string;
        readonly source: string | null;
      };
    };
  }>;
}
