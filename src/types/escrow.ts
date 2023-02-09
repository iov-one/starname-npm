import { Coin } from "@cosmjs/amino";
import { EscrowState } from "../proto/iov/escrow/v1beta1/types";
import { transformValidUntil } from "../utils/transformValidUntil";
import { Account, ApiAccount } from "./account";
import { ApiDomain, Domain } from "./domain";

export interface ApiEscrowDomainObject {
  readonly type: "starname/Domain";
  readonly value: Omit<ApiDomain, "broker">;
}

export type ApiEscrowAccountObject = Omit<
  ApiAccount,
  "broker" | "certificates"
>;

export type ApiEscrowObject = ApiEscrowDomainObject | ApiEscrowAccountObject;

export type EscrowDomainObject = Omit<Domain, "broker">;
export type EscrowAccountObject = Omit<Account, "broker" | "certificates">;
export type EscrowObject = EscrowDomainObject | EscrowAccountObject;

export interface ApiEscrow {
  readonly id: string;
  readonly seller: string;
  readonly object: ApiEscrowObject;
  readonly price: ReadonlyArray<Coin>;
  readonly state?: EscrowState;
  readonly deadline: string;
  readonly broker_address: string;
  readonly broker_commission: string;
}

export interface Escrow {
  readonly id: string;
  readonly seller: string;
  readonly object: EscrowObject;
  readonly price: ReadonlyArray<Coin>;
  readonly state: "open" | "expired";
  readonly deadline: Date;
  readonly brokerAddress: string;
  readonly brokerCommission: number;
}

export const isApiEscrowDomainObject = (
  obj: ApiEscrowObject | any,
): obj is ApiEscrowDomainObject => {
  return obj.type !== undefined && obj.type === "starname/Domain";
};

export const isEscrowDomainObject = (
  obj: EscrowObject | any,
): obj is EscrowDomainObject => {
  if (obj.admin !== undefined && typeof obj.admin === "string") return true;
  return false;
};

export const isEscrowAccountObject = (
  obj: EscrowObject | any,
): obj is EscrowAccountObject => {
  return !isEscrowDomainObject(obj);
};

export const transformEscrowResponse = (escrow: ApiEscrow): Escrow => {
  return {
    id: escrow.id,
    seller: escrow.seller,
    object: isApiEscrowDomainObject(escrow.object)
      ? transformValidUntil(escrow.object.value)
      : transformValidUntil(escrow.object),
    brokerAddress: escrow.broker_address,
    brokerCommission: Number(escrow.broker_commission),
    deadline: new Date(Number(escrow.deadline) * 1000),
    state: escrow.state === undefined ? "open" : "expired",
    price: escrow.price,
  };
};
