import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { defaultRegistryTypes } from "@cosmjs/stargate";

import {
  MsgCreateEscrow,
  MsgRefundEscrow,
  MsgTransferToEscrow,
  MsgUpdateEscrow,
} from "./proto/iov/escrow/v1beta1/tx";
import {
  MsgAddAccountCertificate,
  MsgDeleteAccount,
  MsgDeleteAccountCertificate,
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
} from "./proto/iov/starname/v1beta1/tx";
import { Account, Domain, Resource } from "./proto/iov/starname/v1beta1/types";

export enum Starname {
  // base types
  Account = "/starnamed.x.starname.v1beta1.Account",
  Domain = "/starnamed.x.starname.v1beta1.Domain",
  Resource = "/starnamed.x.starname.v1beta1.Resource",
  // tx
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
  AddAccountCertificate = "/starnamed.x.starname.v1beta1.MsgAddAccountCertificate",
  DeleteAccountCertificate = "/starnamed.x.starname.v1beta1.MsgDeleteAccountCertificate",
}

export enum Escrow {
  CreateEscrow = "/starnamed.x.escrow.v1beta1.MsgCreateEscrow",
  UpdateEscrow = "/starnamed.x.escrow.v1beta1.MsgUpdateEscrow",
  TransferToEscrow = "/starnamed.x.escrow.v1beta1.MsgTransferToEscrow",
  RefundEscrow = "/starnamed.x.escrow.v1beta1.MsgRefundEscrow",
}

export enum Bank {
  Send = "/cosmos.bank.v1beta1.MsgSend",
}

export enum Staking {
  Undelegate = "/cosmos.staking.v1beta1.MsgUndelegate",
  BeginRedelegate = "/cosmos.staking.v1beta1.MsgBeginRedelegate",
  Delegate = "/cosmos.staking.v1beta1.MsgDelegate",
}

export enum Distribution {
  WithdrawDelegatorReward = "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
}

export enum Virtual {
  // Generic escrow types
  GenericEscrow = "/starnamed.x.escrow.*",
  // Generic query types
  GenericStarname = "/starnamed.x.starname.*",
  GenericDelegation = "/cosmos.staking.v1beta1.Msg(?:Un)?Delegate",
  // Some query helper types
  Receive = "/cosmos.bank.v1beta1.MsgReceive",
}

export enum Aleph {
  SignText = "/aleph.signutil.MsgSignText",
}

export const TxType = {
  Starname,
  Bank,
  Staking,
  Distribution,
  Virtual,
  Aleph,
  Escrow,
};

const types: { [key: string]: GeneratedType } = {
  // Account
  [Starname.Account]: Account,
  [Starname.RegisterAccount]: MsgRegisterAccount,
  [Starname.RenewAccount]: MsgRenewAccount,
  [Starname.DeleteAccount]: MsgDeleteAccount,
  [Starname.TransferAccount]: MsgTransferAccount,
  [Starname.ReplaceAccountResources]: MsgReplaceAccountResources,
  [Starname.ReplaceAccountMetadata]: MsgReplaceAccountMetadata,
  [Starname.AddAccountCertificate]: MsgAddAccountCertificate,
  [Starname.DeleteAccountCertificate]: MsgDeleteAccountCertificate,

  // Domain
  [Starname.Domain]: Domain,
  [Starname.RegisterDomain]: MsgRegisterDomain,
  [Starname.RenewDomain]: MsgRenewDomain,
  [Starname.TransferDomain]: MsgTransferDomain,
  [Starname.DeleteDomain]: MsgDeleteDomain,

  [Starname.Resource]: Resource,
  // Escrow
  [Escrow.CreateEscrow]: MsgCreateEscrow,
  [Escrow.UpdateEscrow]: MsgUpdateEscrow,
  [Escrow.TransferToEscrow]: MsgTransferToEscrow,
  [Escrow.RefundEscrow]: MsgRefundEscrow,
  // Aleph
  [Aleph.SignText]: MsgSignText,
};

export class StarnameRegistry extends Registry {
  constructor() {
    super(defaultRegistryTypes.concat(Object.entries(types)));
  }
}
