export interface ChainData {
  readonly prefix: string;
  readonly hdPaths: ReadonlyArray<string>;
  readonly symbol: string;
}

export interface ChainMap {
  readonly [key: string]: ChainData;
}

export interface ChainLookup extends ChainData {
  readonly chainId: string;
}
