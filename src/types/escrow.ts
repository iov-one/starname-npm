import { EscrowState } from "../proto/iov/escrow/v1beta1/types";

export interface EscrowDomainObject {
  readonly type: "starname/Domain";
  readonly value: {
    name: string;
    admin: string;
    valid_until: string;
    type: string;
  };
}

export interface EscrowAccountObject {
  domain: string;
  name: string;
  owner: string;
  valid_until: string;
}

export type EscrowObject = EscrowDomainObject | EscrowAccountObject;

export interface ApiEscrow {
  readonly id: string;
  readonly seller: string;
  readonly object: EscrowObject;
  readonly price: [
    {
      denom: string;
      amount: string;
    },
  ];
  readonly state?: EscrowState;
  readonly deadline: string;
  readonly broker_address: string;
  readonly broker_commission: string;
}

export interface Escrow extends ApiEscrow {
  readonly state: EscrowState;
}

export interface ModifiableEscrowFields {
  readonly amount: string;
  readonly deadline: Date;
  readonly seller: string;
}

export const isEscrowDomainObject = (
  obj: EscrowDomainObject | any,
): obj is EscrowDomainObject => {
  return obj.type !== undefined && obj.type === "starname/Domain";
};

export const isEscrowAccountObject = (
  obj: EscrowAccountObject | any,
): obj is EscrowAccountObject => {
  if (
    "domain" in obj &&
    "name" in obj &&
    "owner" in obj &&
    "valid_until" in obj
  ) {
    if (typeof obj.owner === "string" && obj.owner.length > 43) return true;
    return false;
  }
  return false;
};
