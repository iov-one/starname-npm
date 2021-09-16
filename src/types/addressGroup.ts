import { AccountData } from "@cosmjs/proto-signing";

export interface AddressGroup {
  [key: string]: ReadonlyArray<AccountData>;
}
