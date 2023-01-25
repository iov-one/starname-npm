import { ApiAccount } from "../types/account";
import { ApiDomain } from "../types/domain";
import { Starname } from "../types/starname";

export const transformValidUntil = (
  value: ApiAccount | ApiDomain,
): Starname => {
  return {
    ...value,
    validUntil: parseInt(value.valid_until) * 1000,
  };
};
