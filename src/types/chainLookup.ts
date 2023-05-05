import { ChainData } from "@iov/signer-types";

export interface ChainLookup extends ChainData {
  readonly chainId: string;
}
