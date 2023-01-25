import { fromBase64, toBase64 } from "@cosmjs/encoding";
import { AminoConverter, Coin } from "@cosmjs/stargate";

import { Any } from "../proto/google/protobuf/any";
import {
  MsgCreateEscrow,
  MsgRefundEscrow,
  MsgTransferToEscrow,
  MsgUpdateEscrow,
} from "../proto/iov/escrow/v1beta1/tx";
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
} from "../proto/iov/starname/v1beta1/tx";
import { Account, Domain, Resource } from "../proto/iov/starname/v1beta1/types";
import { TxType } from "../starnameRegistry";

export enum AminoType {
  Account = "starname/Account",
  Domain = "starname/Domain",
  RegisterDomain = "starname/RegisterDomain",
  RegisterAccount = "starname/RegisterAccount",
  DeleteDomain = "starname/DeleteDomain",
  DeleteAccount = "starname/DeleteAccount",
  TransferDomain = "starname/TransferDomain",
  TransferAccount = "starname/TransferAccount",
  RenewDomain = "starname/RenewDomain",
  RenewAccount = "starname/RenewAccount",
  ReplaceAccountMetadata = "starname/SetAccountMetadata",
  ReplaceAccountResources = "starname/ReplaceAccountResources",
  AddAccountCertificate = "starname/AddAccountCertificate",
  DeleteAccountCertificate = "starname/DeleteAccountCertificate",
  SignText = "signutil/MsgSignText",
  CreateEscrow = "escrow/CreateEscrow",
  UpdateEscrow = "escrow/UpdateEscrow",
  RefundEscrow = "escrow/RefundEscrow",
  TransferToEscrow = "escrow/TransferToEscrow",
}

interface AminoMsgBase {
  readonly payer?: string;
}

export interface AminoDomain extends AminoMsgBase {
  name: string;
  admin: Uint8Array;
  broker: Uint8Array;
  valid_until: number;
  type: string;
}

export interface AminoAccount extends AminoMsgBase {
  domain: string;
  name: string | undefined;
  owner: Uint8Array;
  broker: Uint8Array;
  valid_until: number;
  resources: Resource[];
  certificates: Uint8Array[];
  metadata_uri: string;
}

export interface AminoMsgRegisterDomain extends AminoMsgBase {
  readonly name: string;
  readonly admin: string;
  readonly domain_type: string;
  readonly broker?: string;
}

export interface AminoMsgRegisterAccount extends AminoMsgBase {
  readonly name?: string;
  readonly domain: string;
  readonly owner: string;
  readonly registerer: string;
  readonly broker?: string;
  readonly resources: Array<Resource>;
}

export interface AminoMsgDeleteDomain extends AminoMsgBase {
  readonly owner: string;
  readonly domain: string;
}

export interface AminoMsgDeleteAccount extends AminoMsgBase {
  readonly name?: string;
  readonly domain: string;
  readonly owner: string;
}

export interface AminoMsgTransferDomain extends AminoMsgBase {
  readonly domain: string;
  readonly owner: string;
  readonly new_admin: string;
  readonly transfer_flag?: number;
}

export interface AminoMsgTransferAccount extends AminoMsgBase {
  readonly name?: string;
  readonly domain: string;
  readonly owner: string;
  readonly new_owner: string;
  readonly reset: boolean;
}

export interface AminoMsgRenewDomain extends AminoMsgBase {
  readonly domain: string;
  readonly signer: string;
}

export interface AminoMsgRenewAccount extends AminoMsgBase {
  readonly domain: string;
  readonly name?: string;
  readonly signer: string;
}

export interface AminoMsgReplaceAccountMetadata extends AminoMsgBase {
  readonly name?: string;
  readonly domain: string;
  readonly owner: string;
  readonly new_metadata_uri: string;
}

export interface AminoMsgReplaceAccountResources extends AminoMsgBase {
  readonly domain: string;
  readonly name?: string;
  readonly new_resources: Array<Resource>;
  readonly owner: string;
}

export interface AminoMsgAddAccountCertificate extends AminoMsgBase {
  readonly domain: string;
  readonly name?: string;
  readonly owner: string;
  readonly payer?: string;
  readonly new_certificate: string;
}

export interface AminoMsgDeleteAccountCertificate extends AminoMsgBase {
  readonly domain: string;
  readonly name?: string;
  readonly owner: string;
  readonly payer?: string;
  readonly delete_certificate: string;
}

export interface AminoMsgCreateEscrow extends AminoMsgBase {
  readonly seller: string;
  readonly fee_payer: string;
  readonly object: Any | undefined;
  readonly price: Array<Coin>;
  readonly deadline: number;
}

export interface AminoMsgUpdateEscrow extends AminoMsgBase {
  readonly id: string;
  readonly updater: string;
  readonly fee_payer: string;
  readonly seller: string;
  readonly price: Array<Coin>;
  readonly deadline: number;
}

export interface AminoMsgRefundEscrow extends AminoMsgBase {
  readonly id: string;
  readonly sender: string;
  readonly fee_payer: string;
}

export interface AminoMsgTransferToEscrow extends AminoMsgBase {
  readonly id: string;
  readonly sender: string;
  readonly fee_payer: string;
  readonly amount: Array<Coin>;
}

export interface AminoMsgSignText {
  readonly message: string;
  readonly signer: string;
}

const emptyToUndefined = (value: string): string | undefined =>
  value === "" ? undefined : value;

export const customStarnameAminoTypes: { [key: string]: AminoConverter } = {
  [TxType.Starname.Domain]: {
    aminoType: AminoType.Domain,
    toAmino: (value: Domain): AminoDomain => ({
      admin: value.admin,
      broker: value.broker,
      name: value.name,
      type: value.type,
      valid_until: value.validUntil,
      payer: emptyToUndefined(""),
    }),
    fromAmino: (value: AminoDomain): Domain => ({
      admin: value.admin,
      broker: value.broker,
      name: value.name,
      type: value.type,
      validUntil: value.valid_until,
    }),
  },
  [TxType.Starname.Account]: {
    aminoType: AminoType.Account,
    toAmino: (value: Account): AminoAccount => ({
      broker: value.broker,
      certificates: value.certificates,
      domain: value.domain,
      metadata_uri: value.metadataUri,
      name: value.name,
      owner: value.owner,
      resources: value.resources,
      valid_until: value.validUntil,
      payer: emptyToUndefined(""),
    }),
    fromAmino: (value: AminoAccount): Account => ({
      broker: value.broker,
      certificates: value.certificates,
      domain: value.domain,
      metadataUri: value.metadata_uri,
      name: value.name,
      owner: value.owner,
      resources: value.resources,
      validUntil: value.valid_until,
    }),
  },
  [TxType.Starname.RegisterDomain]: {
    aminoType: AminoType.RegisterDomain,
    toAmino: (value: MsgRegisterDomain): AminoMsgRegisterDomain => ({
      admin: value.admin,
      name: value.name,
      domain_type: value.domainType,
      broker: emptyToUndefined(value.broker),
      payer: emptyToUndefined(value.payer),
    }),
    fromAmino: (value: AminoMsgRegisterDomain): MsgRegisterDomain => ({
      admin: value.admin,
      name: value.name,
      domainType: value.domain_type,
      broker: value.broker ?? "",
      payer: value.payer ?? "",
    }),
  },
  [TxType.Starname.RegisterAccount]: {
    aminoType: AminoType.RegisterAccount,
    toAmino: (value: MsgRegisterAccount): AminoMsgRegisterAccount => ({
      domain: value.domain,
      owner: value.owner,
      name: emptyToUndefined(value.name),
      broker: emptyToUndefined(value.broker),
      registerer: value.registerer,
      resources: value.resources,
      payer: emptyToUndefined(value.payer),
    }),
    fromAmino: (value: AminoMsgRegisterAccount): MsgRegisterAccount => ({
      domain: value.domain,
      owner: value.owner,
      name: value.name ?? "",
      broker: value.broker ?? "",
      registerer: value.registerer,
      resources: value.resources,
      payer: value.payer ?? "",
    }),
  },
  [TxType.Starname.DeleteDomain]: {
    aminoType: AminoType.DeleteDomain,
    toAmino: (value: MsgDeleteDomain): AminoMsgDeleteDomain => ({
      owner: value.owner,
      domain: value.domain,
      payer: emptyToUndefined(value.payer),
    }),
    fromAmino: (value: AminoMsgDeleteDomain): MsgDeleteDomain => ({
      owner: value.owner,
      domain: value.domain,
      payer: value.payer ?? "",
    }),
  },
  [TxType.Starname.DeleteAccount]: {
    aminoType: AminoType.DeleteAccount,
    toAmino: (value: MsgDeleteAccount): AminoMsgDeleteAccount => ({
      domain: value.domain,
      name: emptyToUndefined(value.name),
      owner: value.owner,
      payer: emptyToUndefined(value.payer),
    }),
    fromAmino: (value: AminoMsgDeleteAccount): MsgDeleteAccount => ({
      domain: value.domain,
      name: value.name ?? "",
      owner: value.owner,
      payer: value.payer ?? "",
    }),
  },
  [TxType.Starname.RenewAccount]: {
    aminoType: AminoType.RenewAccount,
    toAmino: (value: MsgRenewAccount): AminoMsgRenewAccount => ({
      domain: value.domain,
      name: emptyToUndefined(value.name),
      signer: value.signer,
      payer: emptyToUndefined(value.payer),
    }),
    fromAmino: (value: AminoMsgRenewAccount): MsgRenewAccount => ({
      domain: value.domain,
      name: value.name ?? "",
      signer: value.signer,
      payer: value.payer ?? "",
    }),
  },
  [TxType.Starname.RenewDomain]: {
    aminoType: AminoType.RenewDomain,
    toAmino: (value: MsgRenewDomain): AminoMsgRenewDomain => ({
      domain: value.domain,
      signer: value.signer,
      payer: emptyToUndefined(value.payer),
    }),
    fromAmino: (value: AminoMsgRenewDomain): MsgRenewDomain => ({
      domain: value.domain,
      signer: value.signer,
      payer: value.payer ?? "",
    }),
  },
  [TxType.Starname.TransferAccount]: {
    aminoType: AminoType.TransferAccount,
    toAmino: (value: MsgTransferAccount): AminoMsgTransferAccount => ({
      name: emptyToUndefined(value.name),
      domain: value.domain,
      owner: value.owner,
      reset: value.reset,
      new_owner: value.newOwner,
      payer: emptyToUndefined(value.payer),
    }),
    fromAmino: (value: AminoMsgTransferAccount): MsgTransferAccount => ({
      name: value.name ?? "",
      domain: value.domain,
      owner: value.owner,
      reset: value.reset,
      newOwner: value.new_owner,
      payer: value.payer ?? "",
    }),
  },
  [TxType.Starname.TransferDomain]: {
    aminoType: AminoType.TransferDomain,
    toAmino: (value: MsgTransferDomain): AminoMsgTransferDomain => ({
      domain: value.domain,
      owner: value.owner,
      new_admin: value.newAdmin,
      transfer_flag: value.transferFlag !== 0 ? value.transferFlag : undefined,
      payer: emptyToUndefined(value.payer),
    }),
    fromAmino: (value: AminoMsgTransferDomain): MsgTransferDomain => ({
      domain: value.domain,
      owner: value.owner,
      newAdmin: value.new_admin,
      transferFlag: value.transfer_flag ?? 0,
      payer: value.payer ?? "",
    }),
  },
  [TxType.Starname.ReplaceAccountResources]: {
    aminoType: AminoType.ReplaceAccountResources,
    toAmino: (
      value: MsgReplaceAccountResources,
    ): AminoMsgReplaceAccountResources => ({
      name: emptyToUndefined(value.name),
      domain: value.domain,
      owner: value.owner,
      new_resources: value.newResources,
      payer: emptyToUndefined(value.payer),
    }),
    fromAmino: (
      value: AminoMsgReplaceAccountResources,
    ): MsgReplaceAccountResources => ({
      name: value.name ?? "",
      domain: value.domain,
      owner: value.owner,
      newResources: value.new_resources,
      payer: value.payer ?? "",
    }),
  },
  [TxType.Starname.ReplaceAccountMetadata]: {
    aminoType: AminoType.ReplaceAccountMetadata,
    toAmino: (
      value: MsgReplaceAccountMetadata,
    ): AminoMsgReplaceAccountMetadata => ({
      name: emptyToUndefined(value.name),
      domain: value.domain,
      owner: value.owner,
      new_metadata_uri: value.newMetadataUri,
      payer: emptyToUndefined(value.payer),
    }),
    fromAmino: (
      value: AminoMsgReplaceAccountMetadata,
    ): MsgReplaceAccountMetadata => ({
      name: value.name ?? "",
      domain: value.domain,
      owner: value.owner,
      newMetadataUri: value.new_metadata_uri,
      payer: value.payer ?? "",
    }),
  },
  [TxType.Starname.AddAccountCertificate]: {
    aminoType: AminoType.AddAccountCertificate,
    toAmino: (
      value: MsgAddAccountCertificate,
    ): AminoMsgAddAccountCertificate => ({
      name: emptyToUndefined(value.name),
      domain: value.domain,
      owner: value.owner,
      payer: emptyToUndefined(value.payer),
      new_certificate: toBase64(value.newCertificate),
    }),
    fromAmino: (
      value: AminoMsgAddAccountCertificate,
    ): MsgAddAccountCertificate => ({
      name: value.name ?? "",
      domain: value.domain,
      owner: value.owner,
      newCertificate: fromBase64(value.new_certificate),
      payer: value.payer ?? "",
    }),
  },
  [TxType.Starname.DeleteAccountCertificate]: {
    aminoType: AminoType.DeleteAccountCertificate,
    toAmino: (
      value: MsgDeleteAccountCertificate,
    ): AminoMsgDeleteAccountCertificate => ({
      name: emptyToUndefined(value.name),
      domain: value.domain,
      owner: value.owner,
      payer: emptyToUndefined(value.payer),
      delete_certificate: toBase64(value.deleteCertificate),
    }),
    fromAmino: (
      value: AminoMsgDeleteAccountCertificate,
    ): MsgDeleteAccountCertificate => ({
      name: value.name ?? "",
      domain: value.domain,
      owner: value.owner,
      deleteCertificate: fromBase64(value.delete_certificate),
      payer: value.payer ?? "",
    }),
  },
  [TxType.Aleph.SignText]: {
    aminoType: AminoType.SignText,
    toAmino: (value: MsgSignText): AminoMsgSignText => ({
      message: value.message,
      signer: value.signer,
    }),
    fromAmino: (value: AminoMsgSignText): MsgSignText => ({
      message: value.message,
      signer: value.signer,
    }),
  },
  [TxType.Escrow.CreateEscrow]: {
    aminoType: AminoType.CreateEscrow,
    toAmino: (value: MsgCreateEscrow): AminoMsgCreateEscrow => ({
      deadline: value.deadline,
      fee_payer: value.feePayer,
      object: value.object,
      price: value.price,
      seller: value.seller,
      payer: emptyToUndefined(""),
    }),
    fromAmino: (value: AminoMsgCreateEscrow): MsgCreateEscrow => ({
      deadline: value.deadline,
      feePayer: value.fee_payer,
      object: value.object,
      price: value.price,
      seller: value.seller,
    }),
  },
  [TxType.Escrow.UpdateEscrow]: {
    aminoType: AminoType.UpdateEscrow,
    toAmino: (value: MsgUpdateEscrow): AminoMsgUpdateEscrow => ({
      deadline: value.deadline,
      fee_payer: value.feePayer,
      price: value.price,
      seller: value.seller,
      payer: emptyToUndefined(""),
      id: value.id,
      updater: value.updater,
    }),
    fromAmino: (value: AminoMsgUpdateEscrow): MsgUpdateEscrow => ({
      deadline: value.deadline,
      feePayer: value.fee_payer,
      price: value.price,
      seller: value.seller,
      id: value.id,
      updater: value.updater,
    }),
  },
  [TxType.Escrow.RefundEscrow]: {
    aminoType: AminoType.RefundEscrow,
    toAmino: (value: MsgRefundEscrow): AminoMsgRefundEscrow => ({
      fee_payer: value.feePayer,
      id: value.id,
      sender: value.sender,
      payer: emptyToUndefined(""),
    }),
    fromAmino: (value: AminoMsgRefundEscrow): MsgRefundEscrow => ({
      feePayer: value.fee_payer,
      id: value.id,
      sender: value.sender,
    }),
  },
  [TxType.Escrow.TransferToEscrow]: {
    aminoType: AminoType.TransferToEscrow,
    toAmino: (value: MsgTransferToEscrow): AminoMsgTransferToEscrow => ({
      amount: value.amount,
      fee_payer: value.feePayer,
      id: value.id,
      sender: value.sender,
      payer: emptyToUndefined(""),
    }),
    fromAmino: (value: AminoMsgTransferToEscrow): MsgTransferToEscrow => ({
      amount: value.amount,
      feePayer: value.fee_payer,
      id: value.id,
      sender: value.sender,
    }),
  },
};
