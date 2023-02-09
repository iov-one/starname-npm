import { transformValidUntil } from "../utils/transformValidUntil";

export type DomainType = "open" | "closed";

export interface ApiDomain {
  name: string;
  admin: string;
  broker: string;
  valid_until: string;
  type: DomainType;
}

export interface Domain {
  name: string;
  admin: string;
  broker: string;
  validUntil: number;
  type: DomainType;
}

export const transformDomainResponmse = (domain: ApiDomain): Domain => {
  return transformValidUntil(domain);
};
