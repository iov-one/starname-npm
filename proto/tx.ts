/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Resource } from "./types";

export const protobufPackage = "starnamed.x.starname.v1beta1";

/** MsgAddAccountCertificate is the message used when a user wants to add new certificates to his account */
export interface MsgAddAccountCertificate {
  /** Domain is the domain of the account */
  domain: string;
  /** Name is the name of the account */
  name: string;
  /** Owner is the owner of the account */
  owner: string;
  /** Payer is the address of the entity that pays the product and transaction fees */
  payer: string;
  /** NewCertificate is the new certificate to add */
  newCertificate: Uint8Array;
}

/** MsgAddAccountCertificateResponse returns an empty response. */
export interface MsgAddAccountCertificateResponse {}

/** MsgDeleteAccountCertificate is the request model used to remove certificates from an account */
export interface MsgDeleteAccountCertificate {
  /** Domain is the domain of the account */
  domain: string;
  /** Name is the name of the account */
  name: string;
  /** Owner is the owner of the account */
  owner: string;
  /** Payer is the address of the entity that pays the product and transaction fees */
  payer: string;
  /** DeleteCertificate is the certificate to delete */
  deleteCertificate: Uint8Array;
}

/** MsgDeleteAccountCertificateResponse returns an empty response. */
export interface MsgDeleteAccountCertificateResponse {}

/** MsgDeleteAccount is the request model used to delete an account */
export interface MsgDeleteAccount {
  /** Domain is the domain of the account */
  domain: string;
  /** Name is the name of the account */
  name: string;
  /** Owner is the owner of the account */
  owner: string;
  /** Payer is the address of the entity that pays the product and transaction fees */
  payer: string;
}

/** MsgDeleteAccountResponse returns an empty response. */
export interface MsgDeleteAccountResponse {}

/** MsgDeleteDomain is the request model to delete a domain */
export interface MsgDeleteDomain {
  /** Domain is the domain of the account */
  domain: string;
  /** Owner is the owner of the account */
  owner: string;
  /** Payer is the address of the entity that pays the product and transaction fees */
  payer: string;
}

/** MsgDeleteDomainResponse returns an empty response. */
export interface MsgDeleteDomainResponse {}

/** MsgRegisterAccount is the request model used to register new accounts */
export interface MsgRegisterAccount {
  /** Domain is the domain of the account */
  domain: string;
  /** Name is the name of the account */
  name: string;
  /** Owner is the owner of the account */
  owner: string;
  /** Payer is the address of the entity that pays the product and transaction fees */
  payer: string;
  /** Broker is the account that facilitated the transaction */
  broker: string;
  /** Registerer is the user who registers this account */
  registerer: string;
  /** Resources are the blockchain addresses of the account */
  resources: Resource[];
}

/** MsgRegisterAccountResponse returns an empty response. */
export interface MsgRegisterAccountResponse {}

/** MsgRegisterDomain is the request used to register new domains */
export interface MsgRegisterDomain {
  name: string;
  admin: string;
  /** Payer is the address of the entity that pays the product and transaction fees */
  payer: string;
  /** Broker is the account that facilitated the transaction */
  broker: string;
  /** DomainType defines the type of the domain */
  domainType: string;
}

/** MsgRegisterDomainResponse returns an empty response. */
export interface MsgRegisterDomainResponse {}

/** MsgRenewAccount is the request model used to renew accounts */
export interface MsgRenewAccount {
  /** Domain is the domain of the account */
  domain: string;
  /** Name is the name of the account */
  name: string;
  /** Signer is the signer of the request */
  signer: string;
  /** Payer is the address of the entity that pays the product and transaction fees */
  payer: string;
}

/** MsgRenewAccountResponse returns an empty response. */
export interface MsgRenewAccountResponse {}

/** MsgRenewDomain is the request model used to renew a domain */
export interface MsgRenewDomain {
  /** Domain is the domain of the account */
  domain: string;
  /** Signer is the signer of the request */
  signer: string;
  /** Payer is the address of the entity that pays the product and transaction fees */
  payer: string;
}

/** MsgRegisterDomain returns an empty response. */
export interface MsgRenewDomainResponse {}

/** MsgReplaceAccountResources is the request model used to renew resources associated with an account */
export interface MsgReplaceAccountResources {
  /** Domain is the domain of the account */
  domain: string;
  /** Name is the name of the account */
  name: string;
  /** Owner is the owner of the account */
  owner: string;
  /** Payer is the address of the entity that pays the product and transaction fees */
  payer: string;
  /** NewResources are the new resources */
  newResources: Resource[];
}

/** MsgReplaceAccountResourcesResponse */
export interface MsgReplaceAccountResourcesResponse {}

/** MsgReplaceAccountMetadata is the function used to set accounts metadata */
export interface MsgReplaceAccountMetadata {
  /** Domain is the domain of the account */
  domain: string;
  /** Name is the name of the account */
  name: string;
  /** Owner is the owner of the account */
  owner: string;
  /** Payer is the address of the entity that pays the product and transaction fees */
  payer: string;
  /**
   * NewMetadataURI is the metadata URI of the account
   * we want to update or insert
   */
  newMetadataUri: string;
}

/** MsgReplaceAccountMetadataResponse returns an empty response. */
export interface MsgReplaceAccountMetadataResponse {}

/** MsgTransferAccount is the request model used to transfer accounts */
export interface MsgTransferAccount {
  /** Domain is the domain of the account */
  domain: string;
  /** Name is the name of the account */
  name: string;
  /** Owner is the owner of the account */
  owner: string;
  /** Payer is the address of the entity that pays the product and transaction fees */
  payer: string;
  /** NewOwner is the new owner of the account */
  newOwner: string;
  /** ToReset if true, removes all old data from account */
  reset: boolean;
}

/** MsgTransferAccountResponse returns an empty response. */
export interface MsgTransferAccountResponse {}

/** MsgTransferDomain is the request model used to transfer a domain */
export interface MsgTransferDomain {
  /** Domain is the name of the domain */
  domain: string;
  /** Owner is the owner of the domain */
  owner: string;
  /** Payer is the address of the entity that pays the product and transaction fees */
  payer: string;
  /** NewAdmin is the  new owner of the domain */
  newAdmin: string;
  /** TransferFlag controls the operations that occurs on a domain's accounts */
  transferFlag: number;
}

/** MsgTransferDomainResponse returns an empty response. */
export interface MsgTransferDomainResponse {}

const baseMsgAddAccountCertificate: object = {
  domain: "",
  name: "",
  owner: "",
  payer: "",
};

export const MsgAddAccountCertificate = {
  encode(
    message: MsgAddAccountCertificate,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.domain !== "") {
      writer.uint32(10).string(message.domain);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.owner !== "") {
      writer.uint32(26).string(message.owner);
    }
    if (message.payer !== "") {
      writer.uint32(34).string(message.payer);
    }
    if (message.newCertificate.length !== 0) {
      writer.uint32(42).bytes(message.newCertificate);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgAddAccountCertificate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgAddAccountCertificate,
    } as MsgAddAccountCertificate;
    message.newCertificate = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.domain = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.owner = reader.string();
          break;
        case 4:
          message.payer = reader.string();
          break;
        case 5:
          message.newCertificate = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgAddAccountCertificate {
    const message = {
      ...baseMsgAddAccountCertificate,
    } as MsgAddAccountCertificate;
    message.newCertificate = new Uint8Array();
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = String(object.domain);
    } else {
      message.domain = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = String(object.owner);
    } else {
      message.owner = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = String(object.payer);
    } else {
      message.payer = "";
    }
    if (object.newCertificate !== undefined && object.newCertificate !== null) {
      message.newCertificate = bytesFromBase64(object.newCertificate);
    }
    return message;
  },

  toJSON(message: MsgAddAccountCertificate): unknown {
    const obj: any = {};
    message.domain !== undefined && (obj.domain = message.domain);
    message.name !== undefined && (obj.name = message.name);
    message.owner !== undefined && (obj.owner = message.owner);
    message.payer !== undefined && (obj.payer = message.payer);
    message.newCertificate !== undefined &&
      (obj.newCertificate = base64FromBytes(
        message.newCertificate !== undefined
          ? message.newCertificate
          : new Uint8Array(),
      ));
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgAddAccountCertificate>,
  ): MsgAddAccountCertificate {
    const message = {
      ...baseMsgAddAccountCertificate,
    } as MsgAddAccountCertificate;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = object.domain;
    } else {
      message.domain = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = object.owner;
    } else {
      message.owner = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = object.payer;
    } else {
      message.payer = "";
    }
    if (object.newCertificate !== undefined && object.newCertificate !== null) {
      message.newCertificate = object.newCertificate;
    } else {
      message.newCertificate = new Uint8Array();
    }
    return message;
  },
};

const baseMsgAddAccountCertificateResponse: object = {};

export const MsgAddAccountCertificateResponse = {
  encode(
    _: MsgAddAccountCertificateResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgAddAccountCertificateResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgAddAccountCertificateResponse,
    } as MsgAddAccountCertificateResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgAddAccountCertificateResponse {
    const message = {
      ...baseMsgAddAccountCertificateResponse,
    } as MsgAddAccountCertificateResponse;
    return message;
  },

  toJSON(_: MsgAddAccountCertificateResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgAddAccountCertificateResponse>,
  ): MsgAddAccountCertificateResponse {
    const message = {
      ...baseMsgAddAccountCertificateResponse,
    } as MsgAddAccountCertificateResponse;
    return message;
  },
};

const baseMsgDeleteAccountCertificate: object = {
  domain: "",
  name: "",
  owner: "",
  payer: "",
};

export const MsgDeleteAccountCertificate = {
  encode(
    message: MsgDeleteAccountCertificate,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.domain !== "") {
      writer.uint32(10).string(message.domain);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.owner !== "") {
      writer.uint32(26).string(message.owner);
    }
    if (message.payer !== "") {
      writer.uint32(34).string(message.payer);
    }
    if (message.deleteCertificate.length !== 0) {
      writer.uint32(42).bytes(message.deleteCertificate);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgDeleteAccountCertificate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgDeleteAccountCertificate,
    } as MsgDeleteAccountCertificate;
    message.deleteCertificate = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.domain = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.owner = reader.string();
          break;
        case 4:
          message.payer = reader.string();
          break;
        case 5:
          message.deleteCertificate = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgDeleteAccountCertificate {
    const message = {
      ...baseMsgDeleteAccountCertificate,
    } as MsgDeleteAccountCertificate;
    message.deleteCertificate = new Uint8Array();
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = String(object.domain);
    } else {
      message.domain = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = String(object.owner);
    } else {
      message.owner = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = String(object.payer);
    } else {
      message.payer = "";
    }
    if (
      object.deleteCertificate !== undefined &&
      object.deleteCertificate !== null
    ) {
      message.deleteCertificate = bytesFromBase64(object.deleteCertificate);
    }
    return message;
  },

  toJSON(message: MsgDeleteAccountCertificate): unknown {
    const obj: any = {};
    message.domain !== undefined && (obj.domain = message.domain);
    message.name !== undefined && (obj.name = message.name);
    message.owner !== undefined && (obj.owner = message.owner);
    message.payer !== undefined && (obj.payer = message.payer);
    message.deleteCertificate !== undefined &&
      (obj.deleteCertificate = base64FromBytes(
        message.deleteCertificate !== undefined
          ? message.deleteCertificate
          : new Uint8Array(),
      ));
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgDeleteAccountCertificate>,
  ): MsgDeleteAccountCertificate {
    const message = {
      ...baseMsgDeleteAccountCertificate,
    } as MsgDeleteAccountCertificate;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = object.domain;
    } else {
      message.domain = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = object.owner;
    } else {
      message.owner = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = object.payer;
    } else {
      message.payer = "";
    }
    if (
      object.deleteCertificate !== undefined &&
      object.deleteCertificate !== null
    ) {
      message.deleteCertificate = object.deleteCertificate;
    } else {
      message.deleteCertificate = new Uint8Array();
    }
    return message;
  },
};

const baseMsgDeleteAccountCertificateResponse: object = {};

export const MsgDeleteAccountCertificateResponse = {
  encode(
    _: MsgDeleteAccountCertificateResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgDeleteAccountCertificateResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgDeleteAccountCertificateResponse,
    } as MsgDeleteAccountCertificateResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgDeleteAccountCertificateResponse {
    const message = {
      ...baseMsgDeleteAccountCertificateResponse,
    } as MsgDeleteAccountCertificateResponse;
    return message;
  },

  toJSON(_: MsgDeleteAccountCertificateResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgDeleteAccountCertificateResponse>,
  ): MsgDeleteAccountCertificateResponse {
    const message = {
      ...baseMsgDeleteAccountCertificateResponse,
    } as MsgDeleteAccountCertificateResponse;
    return message;
  },
};

const baseMsgDeleteAccount: object = {
  domain: "",
  name: "",
  owner: "",
  payer: "",
};

export const MsgDeleteAccount = {
  encode(
    message: MsgDeleteAccount,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.domain !== "") {
      writer.uint32(10).string(message.domain);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.owner !== "") {
      writer.uint32(26).string(message.owner);
    }
    if (message.payer !== "") {
      writer.uint32(34).string(message.payer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeleteAccount {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgDeleteAccount } as MsgDeleteAccount;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.domain = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.owner = reader.string();
          break;
        case 4:
          message.payer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgDeleteAccount {
    const message = { ...baseMsgDeleteAccount } as MsgDeleteAccount;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = String(object.domain);
    } else {
      message.domain = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = String(object.owner);
    } else {
      message.owner = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = String(object.payer);
    } else {
      message.payer = "";
    }
    return message;
  },

  toJSON(message: MsgDeleteAccount): unknown {
    const obj: any = {};
    message.domain !== undefined && (obj.domain = message.domain);
    message.name !== undefined && (obj.name = message.name);
    message.owner !== undefined && (obj.owner = message.owner);
    message.payer !== undefined && (obj.payer = message.payer);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgDeleteAccount>): MsgDeleteAccount {
    const message = { ...baseMsgDeleteAccount } as MsgDeleteAccount;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = object.domain;
    } else {
      message.domain = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = object.owner;
    } else {
      message.owner = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = object.payer;
    } else {
      message.payer = "";
    }
    return message;
  },
};

const baseMsgDeleteAccountResponse: object = {};

export const MsgDeleteAccountResponse = {
  encode(
    _: MsgDeleteAccountResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgDeleteAccountResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgDeleteAccountResponse,
    } as MsgDeleteAccountResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgDeleteAccountResponse {
    const message = {
      ...baseMsgDeleteAccountResponse,
    } as MsgDeleteAccountResponse;
    return message;
  },

  toJSON(_: MsgDeleteAccountResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgDeleteAccountResponse>,
  ): MsgDeleteAccountResponse {
    const message = {
      ...baseMsgDeleteAccountResponse,
    } as MsgDeleteAccountResponse;
    return message;
  },
};

const baseMsgDeleteDomain: object = { domain: "", owner: "", payer: "" };

export const MsgDeleteDomain = {
  encode(
    message: MsgDeleteDomain,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.domain !== "") {
      writer.uint32(10).string(message.domain);
    }
    if (message.owner !== "") {
      writer.uint32(18).string(message.owner);
    }
    if (message.payer !== "") {
      writer.uint32(26).string(message.payer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeleteDomain {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgDeleteDomain } as MsgDeleteDomain;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.domain = reader.string();
          break;
        case 2:
          message.owner = reader.string();
          break;
        case 3:
          message.payer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgDeleteDomain {
    const message = { ...baseMsgDeleteDomain } as MsgDeleteDomain;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = String(object.domain);
    } else {
      message.domain = "";
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = String(object.owner);
    } else {
      message.owner = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = String(object.payer);
    } else {
      message.payer = "";
    }
    return message;
  },

  toJSON(message: MsgDeleteDomain): unknown {
    const obj: any = {};
    message.domain !== undefined && (obj.domain = message.domain);
    message.owner !== undefined && (obj.owner = message.owner);
    message.payer !== undefined && (obj.payer = message.payer);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgDeleteDomain>): MsgDeleteDomain {
    const message = { ...baseMsgDeleteDomain } as MsgDeleteDomain;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = object.domain;
    } else {
      message.domain = "";
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = object.owner;
    } else {
      message.owner = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = object.payer;
    } else {
      message.payer = "";
    }
    return message;
  },
};

const baseMsgDeleteDomainResponse: object = {};

export const MsgDeleteDomainResponse = {
  encode(
    _: MsgDeleteDomainResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgDeleteDomainResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgDeleteDomainResponse,
    } as MsgDeleteDomainResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgDeleteDomainResponse {
    const message = {
      ...baseMsgDeleteDomainResponse,
    } as MsgDeleteDomainResponse;
    return message;
  },

  toJSON(_: MsgDeleteDomainResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgDeleteDomainResponse>,
  ): MsgDeleteDomainResponse {
    const message = {
      ...baseMsgDeleteDomainResponse,
    } as MsgDeleteDomainResponse;
    return message;
  },
};

const baseMsgRegisterAccount: object = {
  domain: "",
  name: "",
  owner: "",
  payer: "",
  broker: "",
  registerer: "",
};

export const MsgRegisterAccount = {
  encode(
    message: MsgRegisterAccount,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.domain !== "") {
      writer.uint32(10).string(message.domain);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.owner !== "") {
      writer.uint32(26).string(message.owner);
    }
    if (message.payer !== "") {
      writer.uint32(34).string(message.payer);
    }
    if (message.broker !== "") {
      writer.uint32(42).string(message.broker);
    }
    if (message.registerer !== "") {
      writer.uint32(50).string(message.registerer);
    }
    for (const v of message.resources) {
      Resource.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterAccount {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgRegisterAccount } as MsgRegisterAccount;
    message.resources = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.domain = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.owner = reader.string();
          break;
        case 4:
          message.payer = reader.string();
          break;
        case 5:
          message.broker = reader.string();
          break;
        case 6:
          message.registerer = reader.string();
          break;
        case 7:
          message.resources.push(Resource.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgRegisterAccount {
    const message = { ...baseMsgRegisterAccount } as MsgRegisterAccount;
    message.resources = [];
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = String(object.domain);
    } else {
      message.domain = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = String(object.owner);
    } else {
      message.owner = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = String(object.payer);
    } else {
      message.payer = "";
    }
    if (object.broker !== undefined && object.broker !== null) {
      message.broker = String(object.broker);
    } else {
      message.broker = "";
    }
    if (object.registerer !== undefined && object.registerer !== null) {
      message.registerer = String(object.registerer);
    } else {
      message.registerer = "";
    }
    if (object.resources !== undefined && object.resources !== null) {
      for (const e of object.resources) {
        message.resources.push(Resource.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: MsgRegisterAccount): unknown {
    const obj: any = {};
    message.domain !== undefined && (obj.domain = message.domain);
    message.name !== undefined && (obj.name = message.name);
    message.owner !== undefined && (obj.owner = message.owner);
    message.payer !== undefined && (obj.payer = message.payer);
    message.broker !== undefined && (obj.broker = message.broker);
    message.registerer !== undefined && (obj.registerer = message.registerer);
    if (message.resources) {
      obj.resources = message.resources.map((e) =>
        e ? Resource.toJSON(e) : undefined,
      );
    } else {
      obj.resources = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<MsgRegisterAccount>): MsgRegisterAccount {
    const message = { ...baseMsgRegisterAccount } as MsgRegisterAccount;
    message.resources = [];
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = object.domain;
    } else {
      message.domain = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = object.owner;
    } else {
      message.owner = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = object.payer;
    } else {
      message.payer = "";
    }
    if (object.broker !== undefined && object.broker !== null) {
      message.broker = object.broker;
    } else {
      message.broker = "";
    }
    if (object.registerer !== undefined && object.registerer !== null) {
      message.registerer = object.registerer;
    } else {
      message.registerer = "";
    }
    if (object.resources !== undefined && object.resources !== null) {
      for (const e of object.resources) {
        message.resources.push(Resource.fromPartial(e));
      }
    }
    return message;
  },
};

const baseMsgRegisterAccountResponse: object = {};

export const MsgRegisterAccountResponse = {
  encode(
    _: MsgRegisterAccountResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgRegisterAccountResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgRegisterAccountResponse,
    } as MsgRegisterAccountResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgRegisterAccountResponse {
    const message = {
      ...baseMsgRegisterAccountResponse,
    } as MsgRegisterAccountResponse;
    return message;
  },

  toJSON(_: MsgRegisterAccountResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgRegisterAccountResponse>,
  ): MsgRegisterAccountResponse {
    const message = {
      ...baseMsgRegisterAccountResponse,
    } as MsgRegisterAccountResponse;
    return message;
  },
};

const baseMsgRegisterDomain: object = {
  name: "",
  admin: "",
  payer: "",
  broker: "",
  domainType: "",
};

export const MsgRegisterDomain = {
  encode(
    message: MsgRegisterDomain,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.admin !== "") {
      writer.uint32(18).string(message.admin);
    }
    if (message.payer !== "") {
      writer.uint32(26).string(message.payer);
    }
    if (message.broker !== "") {
      writer.uint32(34).string(message.broker);
    }
    if (message.domainType !== "") {
      writer.uint32(42).string(message.domainType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterDomain {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgRegisterDomain } as MsgRegisterDomain;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.admin = reader.string();
          break;
        case 3:
          message.payer = reader.string();
          break;
        case 4:
          message.broker = reader.string();
          break;
        case 5:
          message.domainType = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgRegisterDomain {
    const message = { ...baseMsgRegisterDomain } as MsgRegisterDomain;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    if (object.admin !== undefined && object.admin !== null) {
      message.admin = String(object.admin);
    } else {
      message.admin = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = String(object.payer);
    } else {
      message.payer = "";
    }
    if (object.broker !== undefined && object.broker !== null) {
      message.broker = String(object.broker);
    } else {
      message.broker = "";
    }
    if (object.domainType !== undefined && object.domainType !== null) {
      message.domainType = String(object.domainType);
    } else {
      message.domainType = "";
    }
    return message;
  },

  toJSON(message: MsgRegisterDomain): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.admin !== undefined && (obj.admin = message.admin);
    message.payer !== undefined && (obj.payer = message.payer);
    message.broker !== undefined && (obj.broker = message.broker);
    message.domainType !== undefined && (obj.domainType = message.domainType);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgRegisterDomain>): MsgRegisterDomain {
    const message = { ...baseMsgRegisterDomain } as MsgRegisterDomain;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    if (object.admin !== undefined && object.admin !== null) {
      message.admin = object.admin;
    } else {
      message.admin = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = object.payer;
    } else {
      message.payer = "";
    }
    if (object.broker !== undefined && object.broker !== null) {
      message.broker = object.broker;
    } else {
      message.broker = "";
    }
    if (object.domainType !== undefined && object.domainType !== null) {
      message.domainType = object.domainType;
    } else {
      message.domainType = "";
    }
    return message;
  },
};

const baseMsgRegisterDomainResponse: object = {};

export const MsgRegisterDomainResponse = {
  encode(
    _: MsgRegisterDomainResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgRegisterDomainResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgRegisterDomainResponse,
    } as MsgRegisterDomainResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgRegisterDomainResponse {
    const message = {
      ...baseMsgRegisterDomainResponse,
    } as MsgRegisterDomainResponse;
    return message;
  },

  toJSON(_: MsgRegisterDomainResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgRegisterDomainResponse>,
  ): MsgRegisterDomainResponse {
    const message = {
      ...baseMsgRegisterDomainResponse,
    } as MsgRegisterDomainResponse;
    return message;
  },
};

const baseMsgRenewAccount: object = {
  domain: "",
  name: "",
  signer: "",
  payer: "",
};

export const MsgRenewAccount = {
  encode(
    message: MsgRenewAccount,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.domain !== "") {
      writer.uint32(10).string(message.domain);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.signer !== "") {
      writer.uint32(26).string(message.signer);
    }
    if (message.payer !== "") {
      writer.uint32(34).string(message.payer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRenewAccount {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgRenewAccount } as MsgRenewAccount;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.domain = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.signer = reader.string();
          break;
        case 4:
          message.payer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgRenewAccount {
    const message = { ...baseMsgRenewAccount } as MsgRenewAccount;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = String(object.domain);
    } else {
      message.domain = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = String(object.signer);
    } else {
      message.signer = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = String(object.payer);
    } else {
      message.payer = "";
    }
    return message;
  },

  toJSON(message: MsgRenewAccount): unknown {
    const obj: any = {};
    message.domain !== undefined && (obj.domain = message.domain);
    message.name !== undefined && (obj.name = message.name);
    message.signer !== undefined && (obj.signer = message.signer);
    message.payer !== undefined && (obj.payer = message.payer);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgRenewAccount>): MsgRenewAccount {
    const message = { ...baseMsgRenewAccount } as MsgRenewAccount;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = object.domain;
    } else {
      message.domain = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = object.signer;
    } else {
      message.signer = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = object.payer;
    } else {
      message.payer = "";
    }
    return message;
  },
};

const baseMsgRenewAccountResponse: object = {};

export const MsgRenewAccountResponse = {
  encode(
    _: MsgRenewAccountResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgRenewAccountResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgRenewAccountResponse,
    } as MsgRenewAccountResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgRenewAccountResponse {
    const message = {
      ...baseMsgRenewAccountResponse,
    } as MsgRenewAccountResponse;
    return message;
  },

  toJSON(_: MsgRenewAccountResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgRenewAccountResponse>,
  ): MsgRenewAccountResponse {
    const message = {
      ...baseMsgRenewAccountResponse,
    } as MsgRenewAccountResponse;
    return message;
  },
};

const baseMsgRenewDomain: object = { domain: "", signer: "", payer: "" };

export const MsgRenewDomain = {
  encode(
    message: MsgRenewDomain,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.domain !== "") {
      writer.uint32(10).string(message.domain);
    }
    if (message.signer !== "") {
      writer.uint32(18).string(message.signer);
    }
    if (message.payer !== "") {
      writer.uint32(26).string(message.payer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRenewDomain {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgRenewDomain } as MsgRenewDomain;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.domain = reader.string();
          break;
        case 2:
          message.signer = reader.string();
          break;
        case 3:
          message.payer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgRenewDomain {
    const message = { ...baseMsgRenewDomain } as MsgRenewDomain;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = String(object.domain);
    } else {
      message.domain = "";
    }
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = String(object.signer);
    } else {
      message.signer = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = String(object.payer);
    } else {
      message.payer = "";
    }
    return message;
  },

  toJSON(message: MsgRenewDomain): unknown {
    const obj: any = {};
    message.domain !== undefined && (obj.domain = message.domain);
    message.signer !== undefined && (obj.signer = message.signer);
    message.payer !== undefined && (obj.payer = message.payer);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgRenewDomain>): MsgRenewDomain {
    const message = { ...baseMsgRenewDomain } as MsgRenewDomain;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = object.domain;
    } else {
      message.domain = "";
    }
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = object.signer;
    } else {
      message.signer = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = object.payer;
    } else {
      message.payer = "";
    }
    return message;
  },
};

const baseMsgRenewDomainResponse: object = {};

export const MsgRenewDomainResponse = {
  encode(
    _: MsgRenewDomainResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgRenewDomainResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgRenewDomainResponse } as MsgRenewDomainResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgRenewDomainResponse {
    const message = { ...baseMsgRenewDomainResponse } as MsgRenewDomainResponse;
    return message;
  },

  toJSON(_: MsgRenewDomainResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgRenewDomainResponse>): MsgRenewDomainResponse {
    const message = { ...baseMsgRenewDomainResponse } as MsgRenewDomainResponse;
    return message;
  },
};

const baseMsgReplaceAccountResources: object = {
  domain: "",
  name: "",
  owner: "",
  payer: "",
};

export const MsgReplaceAccountResources = {
  encode(
    message: MsgReplaceAccountResources,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.domain !== "") {
      writer.uint32(10).string(message.domain);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.owner !== "") {
      writer.uint32(26).string(message.owner);
    }
    if (message.payer !== "") {
      writer.uint32(34).string(message.payer);
    }
    for (const v of message.newResources) {
      Resource.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgReplaceAccountResources {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgReplaceAccountResources,
    } as MsgReplaceAccountResources;
    message.newResources = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.domain = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.owner = reader.string();
          break;
        case 4:
          message.payer = reader.string();
          break;
        case 5:
          message.newResources.push(Resource.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgReplaceAccountResources {
    const message = {
      ...baseMsgReplaceAccountResources,
    } as MsgReplaceAccountResources;
    message.newResources = [];
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = String(object.domain);
    } else {
      message.domain = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = String(object.owner);
    } else {
      message.owner = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = String(object.payer);
    } else {
      message.payer = "";
    }
    if (object.newResources !== undefined && object.newResources !== null) {
      for (const e of object.newResources) {
        message.newResources.push(Resource.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: MsgReplaceAccountResources): unknown {
    const obj: any = {};
    message.domain !== undefined && (obj.domain = message.domain);
    message.name !== undefined && (obj.name = message.name);
    message.owner !== undefined && (obj.owner = message.owner);
    message.payer !== undefined && (obj.payer = message.payer);
    if (message.newResources) {
      obj.newResources = message.newResources.map((e) =>
        e ? Resource.toJSON(e) : undefined,
      );
    } else {
      obj.newResources = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgReplaceAccountResources>,
  ): MsgReplaceAccountResources {
    const message = {
      ...baseMsgReplaceAccountResources,
    } as MsgReplaceAccountResources;
    message.newResources = [];
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = object.domain;
    } else {
      message.domain = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = object.owner;
    } else {
      message.owner = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = object.payer;
    } else {
      message.payer = "";
    }
    if (object.newResources !== undefined && object.newResources !== null) {
      for (const e of object.newResources) {
        message.newResources.push(Resource.fromPartial(e));
      }
    }
    return message;
  },
};

const baseMsgReplaceAccountResourcesResponse: object = {};

export const MsgReplaceAccountResourcesResponse = {
  encode(
    _: MsgReplaceAccountResourcesResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgReplaceAccountResourcesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgReplaceAccountResourcesResponse,
    } as MsgReplaceAccountResourcesResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgReplaceAccountResourcesResponse {
    const message = {
      ...baseMsgReplaceAccountResourcesResponse,
    } as MsgReplaceAccountResourcesResponse;
    return message;
  },

  toJSON(_: MsgReplaceAccountResourcesResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgReplaceAccountResourcesResponse>,
  ): MsgReplaceAccountResourcesResponse {
    const message = {
      ...baseMsgReplaceAccountResourcesResponse,
    } as MsgReplaceAccountResourcesResponse;
    return message;
  },
};

const baseMsgReplaceAccountMetadata: object = {
  domain: "",
  name: "",
  owner: "",
  payer: "",
  newMetadataUri: "",
};

export const MsgReplaceAccountMetadata = {
  encode(
    message: MsgReplaceAccountMetadata,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.domain !== "") {
      writer.uint32(10).string(message.domain);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.owner !== "") {
      writer.uint32(26).string(message.owner);
    }
    if (message.payer !== "") {
      writer.uint32(34).string(message.payer);
    }
    if (message.newMetadataUri !== "") {
      writer.uint32(42).string(message.newMetadataUri);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgReplaceAccountMetadata {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgReplaceAccountMetadata,
    } as MsgReplaceAccountMetadata;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.domain = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.owner = reader.string();
          break;
        case 4:
          message.payer = reader.string();
          break;
        case 5:
          message.newMetadataUri = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgReplaceAccountMetadata {
    const message = {
      ...baseMsgReplaceAccountMetadata,
    } as MsgReplaceAccountMetadata;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = String(object.domain);
    } else {
      message.domain = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = String(object.owner);
    } else {
      message.owner = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = String(object.payer);
    } else {
      message.payer = "";
    }
    if (object.newMetadataUri !== undefined && object.newMetadataUri !== null) {
      message.newMetadataUri = String(object.newMetadataUri);
    } else {
      message.newMetadataUri = "";
    }
    return message;
  },

  toJSON(message: MsgReplaceAccountMetadata): unknown {
    const obj: any = {};
    message.domain !== undefined && (obj.domain = message.domain);
    message.name !== undefined && (obj.name = message.name);
    message.owner !== undefined && (obj.owner = message.owner);
    message.payer !== undefined && (obj.payer = message.payer);
    message.newMetadataUri !== undefined &&
      (obj.newMetadataUri = message.newMetadataUri);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgReplaceAccountMetadata>,
  ): MsgReplaceAccountMetadata {
    const message = {
      ...baseMsgReplaceAccountMetadata,
    } as MsgReplaceAccountMetadata;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = object.domain;
    } else {
      message.domain = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = object.owner;
    } else {
      message.owner = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = object.payer;
    } else {
      message.payer = "";
    }
    if (object.newMetadataUri !== undefined && object.newMetadataUri !== null) {
      message.newMetadataUri = object.newMetadataUri;
    } else {
      message.newMetadataUri = "";
    }
    return message;
  },
};

const baseMsgReplaceAccountMetadataResponse: object = {};

export const MsgReplaceAccountMetadataResponse = {
  encode(
    _: MsgReplaceAccountMetadataResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgReplaceAccountMetadataResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgReplaceAccountMetadataResponse,
    } as MsgReplaceAccountMetadataResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgReplaceAccountMetadataResponse {
    const message = {
      ...baseMsgReplaceAccountMetadataResponse,
    } as MsgReplaceAccountMetadataResponse;
    return message;
  },

  toJSON(_: MsgReplaceAccountMetadataResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgReplaceAccountMetadataResponse>,
  ): MsgReplaceAccountMetadataResponse {
    const message = {
      ...baseMsgReplaceAccountMetadataResponse,
    } as MsgReplaceAccountMetadataResponse;
    return message;
  },
};

const baseMsgTransferAccount: object = {
  domain: "",
  name: "",
  owner: "",
  payer: "",
  newOwner: "",
  reset: false,
};

export const MsgTransferAccount = {
  encode(
    message: MsgTransferAccount,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.domain !== "") {
      writer.uint32(10).string(message.domain);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.owner !== "") {
      writer.uint32(26).string(message.owner);
    }
    if (message.payer !== "") {
      writer.uint32(34).string(message.payer);
    }
    if (message.newOwner !== "") {
      writer.uint32(42).string(message.newOwner);
    }
    if (message.reset === true) {
      writer.uint32(48).bool(message.reset);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgTransferAccount {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgTransferAccount } as MsgTransferAccount;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.domain = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.owner = reader.string();
          break;
        case 4:
          message.payer = reader.string();
          break;
        case 5:
          message.newOwner = reader.string();
          break;
        case 6:
          message.reset = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgTransferAccount {
    const message = { ...baseMsgTransferAccount } as MsgTransferAccount;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = String(object.domain);
    } else {
      message.domain = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = String(object.owner);
    } else {
      message.owner = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = String(object.payer);
    } else {
      message.payer = "";
    }
    if (object.newOwner !== undefined && object.newOwner !== null) {
      message.newOwner = String(object.newOwner);
    } else {
      message.newOwner = "";
    }
    if (object.reset !== undefined && object.reset !== null) {
      message.reset = Boolean(object.reset);
    } else {
      message.reset = false;
    }
    return message;
  },

  toJSON(message: MsgTransferAccount): unknown {
    const obj: any = {};
    message.domain !== undefined && (obj.domain = message.domain);
    message.name !== undefined && (obj.name = message.name);
    message.owner !== undefined && (obj.owner = message.owner);
    message.payer !== undefined && (obj.payer = message.payer);
    message.newOwner !== undefined && (obj.newOwner = message.newOwner);
    message.reset !== undefined && (obj.reset = message.reset);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgTransferAccount>): MsgTransferAccount {
    const message = { ...baseMsgTransferAccount } as MsgTransferAccount;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = object.domain;
    } else {
      message.domain = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = object.owner;
    } else {
      message.owner = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = object.payer;
    } else {
      message.payer = "";
    }
    if (object.newOwner !== undefined && object.newOwner !== null) {
      message.newOwner = object.newOwner;
    } else {
      message.newOwner = "";
    }
    if (object.reset !== undefined && object.reset !== null) {
      message.reset = object.reset;
    } else {
      message.reset = false;
    }
    return message;
  },
};

const baseMsgTransferAccountResponse: object = {};

export const MsgTransferAccountResponse = {
  encode(
    _: MsgTransferAccountResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgTransferAccountResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgTransferAccountResponse,
    } as MsgTransferAccountResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgTransferAccountResponse {
    const message = {
      ...baseMsgTransferAccountResponse,
    } as MsgTransferAccountResponse;
    return message;
  },

  toJSON(_: MsgTransferAccountResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgTransferAccountResponse>,
  ): MsgTransferAccountResponse {
    const message = {
      ...baseMsgTransferAccountResponse,
    } as MsgTransferAccountResponse;
    return message;
  },
};

const baseMsgTransferDomain: object = {
  domain: "",
  owner: "",
  payer: "",
  newAdmin: "",
  transferFlag: 0,
};

export const MsgTransferDomain = {
  encode(
    message: MsgTransferDomain,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.domain !== "") {
      writer.uint32(10).string(message.domain);
    }
    if (message.owner !== "") {
      writer.uint32(18).string(message.owner);
    }
    if (message.payer !== "") {
      writer.uint32(26).string(message.payer);
    }
    if (message.newAdmin !== "") {
      writer.uint32(34).string(message.newAdmin);
    }
    if (message.transferFlag !== 0) {
      writer.uint32(40).int64(message.transferFlag);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgTransferDomain {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgTransferDomain } as MsgTransferDomain;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.domain = reader.string();
          break;
        case 2:
          message.owner = reader.string();
          break;
        case 3:
          message.payer = reader.string();
          break;
        case 4:
          message.newAdmin = reader.string();
          break;
        case 5:
          message.transferFlag = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgTransferDomain {
    const message = { ...baseMsgTransferDomain } as MsgTransferDomain;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = String(object.domain);
    } else {
      message.domain = "";
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = String(object.owner);
    } else {
      message.owner = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = String(object.payer);
    } else {
      message.payer = "";
    }
    if (object.newAdmin !== undefined && object.newAdmin !== null) {
      message.newAdmin = String(object.newAdmin);
    } else {
      message.newAdmin = "";
    }
    if (object.transferFlag !== undefined && object.transferFlag !== null) {
      message.transferFlag = Number(object.transferFlag);
    } else {
      message.transferFlag = 0;
    }
    return message;
  },

  toJSON(message: MsgTransferDomain): unknown {
    const obj: any = {};
    message.domain !== undefined && (obj.domain = message.domain);
    message.owner !== undefined && (obj.owner = message.owner);
    message.payer !== undefined && (obj.payer = message.payer);
    message.newAdmin !== undefined && (obj.newAdmin = message.newAdmin);
    message.transferFlag !== undefined &&
      (obj.transferFlag = message.transferFlag);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgTransferDomain>): MsgTransferDomain {
    const message = { ...baseMsgTransferDomain } as MsgTransferDomain;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = object.domain;
    } else {
      message.domain = "";
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = object.owner;
    } else {
      message.owner = "";
    }
    if (object.payer !== undefined && object.payer !== null) {
      message.payer = object.payer;
    } else {
      message.payer = "";
    }
    if (object.newAdmin !== undefined && object.newAdmin !== null) {
      message.newAdmin = object.newAdmin;
    } else {
      message.newAdmin = "";
    }
    if (object.transferFlag !== undefined && object.transferFlag !== null) {
      message.transferFlag = object.transferFlag;
    } else {
      message.transferFlag = 0;
    }
    return message;
  },
};

const baseMsgTransferDomainResponse: object = {};

export const MsgTransferDomainResponse = {
  encode(
    _: MsgTransferDomainResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): MsgTransferDomainResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgTransferDomainResponse,
    } as MsgTransferDomainResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgTransferDomainResponse {
    const message = {
      ...baseMsgTransferDomainResponse,
    } as MsgTransferDomainResponse;
    return message;
  },

  toJSON(_: MsgTransferDomainResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgTransferDomainResponse>,
  ): MsgTransferDomainResponse {
    const message = {
      ...baseMsgTransferDomainResponse,
    } as MsgTransferDomainResponse;
    return message;
  },
};

/** Msg defines the starname Msg service. */
export interface Msg {
  /** AddAccountCertificate adds a certificate to an Account */
  AddAccountCertificate(
    request: MsgAddAccountCertificate,
  ): Promise<MsgAddAccountCertificateResponse>;
  /** DeleteAccount registers a Domain */
  DeleteAccount(request: MsgDeleteAccount): Promise<MsgDeleteAccountResponse>;
  /** DeleteAccountCertificate deletes a certificate from an account */
  DeleteAccountCertificate(
    request: MsgDeleteAccountCertificate,
  ): Promise<MsgDeleteAccountCertificateResponse>;
  /** DeleteDomain registers a Domain */
  DeleteDomain(request: MsgDeleteDomain): Promise<MsgDeleteDomainResponse>;
  /** RegisterAccount registers an Account */
  RegisterAccount(
    request: MsgRegisterAccount,
  ): Promise<MsgRegisterAccountResponse>;
  /** RegisterDomain registers a Domain */
  RegisterDomain(
    request: MsgRegisterDomain,
  ): Promise<MsgRegisterDomainResponse>;
  /** RenewAccount registers a Domain */
  RenewAccount(request: MsgRenewAccount): Promise<MsgRenewAccountResponse>;
  /** RenewDomain registers a Domain */
  RenewDomain(request: MsgRenewDomain): Promise<MsgRenewDomainResponse>;
  /** ReplaceAccountMetadata registers a Domain */
  ReplaceAccountMetadata(
    request: MsgReplaceAccountMetadata,
  ): Promise<MsgReplaceAccountMetadataResponse>;
  /** ReplaceAccountResources registers a Domain */
  ReplaceAccountResources(
    request: MsgReplaceAccountResources,
  ): Promise<MsgReplaceAccountResourcesResponse>;
  /** TransferAccount registers a Domain */
  TransferAccount(
    request: MsgTransferAccount,
  ): Promise<MsgTransferAccountResponse>;
  /** TransferDomain registers a Domain */
  TransferDomain(
    request: MsgTransferDomain,
  ): Promise<MsgTransferDomainResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.AddAccountCertificate = this.AddAccountCertificate.bind(this);
    this.DeleteAccount = this.DeleteAccount.bind(this);
    this.DeleteAccountCertificate = this.DeleteAccountCertificate.bind(this);
    this.DeleteDomain = this.DeleteDomain.bind(this);
    this.RegisterAccount = this.RegisterAccount.bind(this);
    this.RegisterDomain = this.RegisterDomain.bind(this);
    this.RenewAccount = this.RenewAccount.bind(this);
    this.RenewDomain = this.RenewDomain.bind(this);
    this.ReplaceAccountMetadata = this.ReplaceAccountMetadata.bind(this);
    this.ReplaceAccountResources = this.ReplaceAccountResources.bind(this);
    this.TransferAccount = this.TransferAccount.bind(this);
    this.TransferDomain = this.TransferDomain.bind(this);
  }
  AddAccountCertificate(
    request: MsgAddAccountCertificate,
  ): Promise<MsgAddAccountCertificateResponse> {
    const data = MsgAddAccountCertificate.encode(request).finish();
    const promise = this.rpc.request(
      "starnamed.x.starname.v1beta1.Msg",
      "AddAccountCertificate",
      data,
    );
    return promise.then((data) =>
      MsgAddAccountCertificateResponse.decode(new _m0.Reader(data)),
    );
  }

  DeleteAccount(request: MsgDeleteAccount): Promise<MsgDeleteAccountResponse> {
    const data = MsgDeleteAccount.encode(request).finish();
    const promise = this.rpc.request(
      "starnamed.x.starname.v1beta1.Msg",
      "DeleteAccount",
      data,
    );
    return promise.then((data) =>
      MsgDeleteAccountResponse.decode(new _m0.Reader(data)),
    );
  }

  DeleteAccountCertificate(
    request: MsgDeleteAccountCertificate,
  ): Promise<MsgDeleteAccountCertificateResponse> {
    const data = MsgDeleteAccountCertificate.encode(request).finish();
    const promise = this.rpc.request(
      "starnamed.x.starname.v1beta1.Msg",
      "DeleteAccountCertificate",
      data,
    );
    return promise.then((data) =>
      MsgDeleteAccountCertificateResponse.decode(new _m0.Reader(data)),
    );
  }

  DeleteDomain(request: MsgDeleteDomain): Promise<MsgDeleteDomainResponse> {
    const data = MsgDeleteDomain.encode(request).finish();
    const promise = this.rpc.request(
      "starnamed.x.starname.v1beta1.Msg",
      "DeleteDomain",
      data,
    );
    return promise.then((data) =>
      MsgDeleteDomainResponse.decode(new _m0.Reader(data)),
    );
  }

  RegisterAccount(
    request: MsgRegisterAccount,
  ): Promise<MsgRegisterAccountResponse> {
    const data = MsgRegisterAccount.encode(request).finish();
    const promise = this.rpc.request(
      "starnamed.x.starname.v1beta1.Msg",
      "RegisterAccount",
      data,
    );
    return promise.then((data) =>
      MsgRegisterAccountResponse.decode(new _m0.Reader(data)),
    );
  }

  RegisterDomain(
    request: MsgRegisterDomain,
  ): Promise<MsgRegisterDomainResponse> {
    const data = MsgRegisterDomain.encode(request).finish();
    const promise = this.rpc.request(
      "starnamed.x.starname.v1beta1.Msg",
      "RegisterDomain",
      data,
    );
    return promise.then((data) =>
      MsgRegisterDomainResponse.decode(new _m0.Reader(data)),
    );
  }

  RenewAccount(request: MsgRenewAccount): Promise<MsgRenewAccountResponse> {
    const data = MsgRenewAccount.encode(request).finish();
    const promise = this.rpc.request(
      "starnamed.x.starname.v1beta1.Msg",
      "RenewAccount",
      data,
    );
    return promise.then((data) =>
      MsgRenewAccountResponse.decode(new _m0.Reader(data)),
    );
  }

  RenewDomain(request: MsgRenewDomain): Promise<MsgRenewDomainResponse> {
    const data = MsgRenewDomain.encode(request).finish();
    const promise = this.rpc.request(
      "starnamed.x.starname.v1beta1.Msg",
      "RenewDomain",
      data,
    );
    return promise.then((data) =>
      MsgRenewDomainResponse.decode(new _m0.Reader(data)),
    );
  }

  ReplaceAccountMetadata(
    request: MsgReplaceAccountMetadata,
  ): Promise<MsgReplaceAccountMetadataResponse> {
    const data = MsgReplaceAccountMetadata.encode(request).finish();
    const promise = this.rpc.request(
      "starnamed.x.starname.v1beta1.Msg",
      "ReplaceAccountMetadata",
      data,
    );
    return promise.then((data) =>
      MsgReplaceAccountMetadataResponse.decode(new _m0.Reader(data)),
    );
  }

  ReplaceAccountResources(
    request: MsgReplaceAccountResources,
  ): Promise<MsgReplaceAccountResourcesResponse> {
    const data = MsgReplaceAccountResources.encode(request).finish();
    const promise = this.rpc.request(
      "starnamed.x.starname.v1beta1.Msg",
      "ReplaceAccountResources",
      data,
    );
    return promise.then((data) =>
      MsgReplaceAccountResourcesResponse.decode(new _m0.Reader(data)),
    );
  }

  TransferAccount(
    request: MsgTransferAccount,
  ): Promise<MsgTransferAccountResponse> {
    const data = MsgTransferAccount.encode(request).finish();
    const promise = this.rpc.request(
      "starnamed.x.starname.v1beta1.Msg",
      "TransferAccount",
      data,
    );
    return promise.then((data) =>
      MsgTransferAccountResponse.decode(new _m0.Reader(data)),
    );
  }

  TransferDomain(
    request: MsgTransferDomain,
  ): Promise<MsgTransferDomainResponse> {
    const data = MsgTransferDomain.encode(request).finish();
    const promise = this.rpc.request(
      "starnamed.x.starname.v1beta1.Msg",
      "TransferDomain",
      data,
    );
    return promise.then((data) =>
      MsgTransferDomainResponse.decode(new _m0.Reader(data)),
    );
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array,
  ): Promise<Uint8Array>;
}

declare var self: any | undefined;
declare var window: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

const atob: (b64: string) => string =
  globalThis.atob ||
  ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (const byte of arr) {
    bin.push(String.fromCharCode(byte));
  }
  return btoa(bin.join(""));
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
