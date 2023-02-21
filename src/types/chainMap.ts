import { ChainInfo } from "@keplr-wallet/types";

export interface ChainData {
  readonly prefix: string;
  readonly hdPaths: ReadonlyArray<string>;
  readonly symbol: string;
  /**
   * if chain is not native to keplr
   */
  readonly suggestChainConfig?: ChainInfo;
}

export interface ChainMap {
  readonly [chainId: string]: ChainData;
}

export interface ChainLookup extends ChainData {
  readonly chainId: string;
}
