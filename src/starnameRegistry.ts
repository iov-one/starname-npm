import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import {
  MsgBeginRedelegate,
  MsgDelegate,
  MsgUndelegate,
} from "cosmjs-types/cosmos/staking/v1beta1/tx";

import {
  MsgDeleteAccount,
  MsgDeleteDomain,
  MsgRegisterAccount,
  MsgRegisterDomain,
  MsgRenewAccount,
  MsgRenewDomain,
  MsgReplaceAccountMetadata,
  MsgReplaceAccountResources,
  MsgSignText,
  MsgTransferAccount,
  MsgTransferDomain,
} from "./proto/tx";

export enum Starname {
  RegisterAccount = "/starnamed.x.starname.v1beta1.MsgRegisterAccount",
  RegisterDomain = "/starnamed.x.starname.v1beta1.MsgRegisterDomain",
  TransferAccount = "/starnamed.x.starname.v1beta1.MsgTransferAccount",
  DeleteAccount = "/starnamed.x.starname.v1beta1.MsgDeleteAccount",
  RenewAccount = "/starnamed.x.starname.v1beta1.MsgRenewAccount",
  RenewDomain = "/starnamed.x.starname.v1beta1.MsgRenewDomain",
  ReplaceAccountMetadata = "/starnamed.x.starname.v1beta1.MsgReplaceAccountMetadata",
  ReplaceAccountResources = "/starnamed.x.starname.v1beta1.MsgReplaceAccountResources",
  TransferDomain = "/starnamed.x.starname.v1beta1.MsgTransferDomain",
  DeleteDomain = "/starnamed.x.starname.v1beta1.MsgDeleteDomain",
}

export enum Bank {
  Send = "/cosmos.bank.v1beta1.MsgSend",
}

export enum Staking {
  Undelegate = "/cosmos.staking.v1beta1.MsgUndelegate",
  BeginRedelegate = "/cosmos.staking.v1beta1.MsgBeginRedelegate",
  Delegate = "/cosmos.staking.v1beta1.MsgDelegate",
}

export enum Virtual {
  // Generic query types
  GenericStarname = "/starnamed.x.starname.*",
  GenericDelegation = "/cosmos.staking.v1beta1.Msg(?:Un)?Delegate",
  // Some query helper types
  Receive = "/cosmos.bank.v1beta1.MsgReceive",
}

export enum Aleph {
  SignText = "/aleph.signutil.MsgSignText",
}

export const TxType = { Starname, Bank, Staking, Virtual, Aleph };

const types: { [key: string]: GeneratedType } = {
  // Account
  [Starname.RegisterAccount]: MsgRegisterAccount,
  [Starname.RenewAccount]: MsgRenewAccount,
  [Starname.DeleteAccount]: MsgDeleteAccount,
  [Starname.TransferAccount]: MsgTransferAccount,
  [Starname.ReplaceAccountResources]: MsgReplaceAccountResources,
  [Starname.ReplaceAccountMetadata]: MsgReplaceAccountMetadata,
  // Domain
  [Starname.RegisterDomain]: MsgRegisterDomain,
  [Starname.RenewDomain]: MsgRenewDomain,
  [Starname.TransferDomain]: MsgTransferDomain,
  [Starname.DeleteDomain]: MsgDeleteDomain,
  // Staking
  [Staking.Delegate]: MsgDelegate,
  [Staking.BeginRedelegate]: MsgBeginRedelegate,
  [Staking.Undelegate]: MsgUndelegate,
  // Aleph
  [Aleph.SignText]: MsgSignText,
};

export class StarnameRegistry extends Registry {
  constructor() {
    super(Object.entries(types));
  }
}
