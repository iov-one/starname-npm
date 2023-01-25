import { StargateValidator } from "../starnameClient/types/stargate/validatorResponse";

export type Validator = StargateValidator;

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
