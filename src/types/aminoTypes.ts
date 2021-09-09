import { AminoConverter } from "@cosmjs/stargate";
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
} from "proto/tx";
import { Resource } from "proto/types";
import { TxType } from "starnameRegistry";

export enum AminoType {
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
  SignText = "signutil/MsgSignText",
}

interface AminoMsgBase {
  readonly payer?: string;
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

export interface AminoMsgSignText {
  readonly message: string;
  readonly signer: string;
}

const emptyToUndefined = (value: string): string | undefined =>
  value === "" ? undefined : value;

export const aminoTypes: { [key: string]: AminoConverter } = {
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
};
