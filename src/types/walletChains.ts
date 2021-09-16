export interface WalletOptions {
  prefix: string;
  hdPaths: ReadonlyArray<string>;
  symbol: string;
  keplrNode?: string;
}

export interface WalletChains {
  [key: string]: WalletOptions;
}
