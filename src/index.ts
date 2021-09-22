export { StarnameClient } from "./api";
export { SignerType } from "./signers/signerType";
export { Wallet } from "./wallet";
export { GDriveCustodian } from "./gdrive/custodian";
export { Task, TaskAbortedError } from "./api/task";
// Signers
export { LedgerSigner } from "./signers/ledger";
export { GoogleSigner } from "./signers/google";
export { DummySigner } from "./signers/dummy";
export { KeplrSigner } from "./signers/keplr";
export { SeedPhraseSigner } from "./signers/seedPhrase";
export { ViewOnlySigner } from "./signers/viewOnly";
export { sortTransactions } from "./logic/sortTransactions";

export { Account, Domain, Resource } from "./proto/types";
export { Amount, isAmount } from "./types/amount";
export { SocialHandleType, isSocialHandleType } from "./types/socialHandleType";
export {
  isFee,
  isTransactionSuccess,
  isTransactionFailure,
} from "./types/postTxResult";
export { estimateFee } from "./utils/estimateFee";
export { TxType } from "./starnameRegistry";
export {
  isDelegationData,
  isRedelegationData,
  isStarnameData,
  Transaction,
} from "./types/transaction";
export { getIOVAddressForStarname } from "./utils/addressResolver";

export { Pager } from "./types/pager";
export {
  getPreferredAsset,
  getTargetsFromResources,
} from "./types/resourceInfo";

export type ResponsePage<T> = import("./types/apiPage").ResponsePage<T>;
export type Signer = import("./signers/signer").Signer;
export type PostTxResult = import("./types/postTxResult").PostTxResult;
export type Validator = import("./types/delegationValidator").Validator;
export type Delegation = import("./types/userDelegationsResponse").Delegation;
export type Unbonding = import("./types/unbondingsResponse").Unbonding;
export type Balance = import("./types/balance").Balance;
export type ResourceInfo = import("./types/resourceInfo").ResourceInfo;
export type Fees = import("./types/fees").Fees;
export type Settings = import("./types/settings").Settings;
export type Starname = import("./types/resolveResponse").Starname;
export type SocialHandle = import("./types/socialHandle").SocialHandle;
export type GasConfig = import("./utils/estimateFee").GasConfig;

export type RedelegationData = import("./types/transaction").RedelegationData;
export type DelegationData = import("./types/transaction").DelegationData;
export type TaskError = import("./api/task").TaskError;
export type GasMap = import("./utils/estimateFee").GasMap;
export type WalletOptions = import("./wallet").WalletOptions;
export type Asset = import("./types/asset").Asset;

export {
  MsgRegisterAccount,
  MsgSignText,
  MsgDeleteAccountCertificate,
  MsgRenewAccount,
  MsgRenewDomain,
  MsgTransferDomain,
  MsgTransferAccount,
  MsgReplaceAccountResources,
  MsgReplaceAccountMetadata,
  MsgDeleteDomain,
  MsgDeleteAccount,
  MsgAddAccountCertificate,
  MsgRegisterDomain,
} from "./proto/tx";
