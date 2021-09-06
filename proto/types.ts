/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { StringValue } from "./google/protobuf/wrappers";

export const protobufPackage = "starnamed.x.starname.v1beta1";

/** Resource defines a resource owned by an account */
export interface Resource {
  /** URI defines the ID of the resource */
  uri: string;
  /** Resource is the resource */
  resource: string;
}

/** Domain defines a domain */
export interface Domain {
  /** Name is the name of the domain */
  name: string;
  /** Admin is the owner of the domain */
  admin: Uint8Array;
  broker: Uint8Array;
  /** ValidUntil is a unix timestamp defines the time when the domain will become invalid in seconds */
  validUntil: number;
  /** Type defines the type of the domain */
  type: string;
}

/**
 * Account defines an account that belongs to a domain
 * NOTE: It should not be confused with cosmos-sdk auth account
 * github.com/cosmos/cosmos-sdk/x/auth.Account
 */
export interface Account {
  /** Domain references the domain this account belongs to */
  domain: string;
  /** Name is the name of the account */
  name: string | undefined;
  /** Owner is the address that owns the account */
  owner: Uint8Array;
  /** Broker identifies an entity that facilitated the transaction of the account and can be empty */
  broker: Uint8Array;
  /** ValidUntil defines a unix timestamp of the expiration of the account in seconds */
  validUntil: number;
  /** Resources is the list of resources an account resolves to */
  resources: Resource[];
  /** Certificates contains the list of certificates to identify the account owner */
  certificates: Uint8Array[];
  /** MetadataURI contains a link to extra information regarding the account */
  metadataUri: string;
}

const baseResource: object = { uri: "", resource: "" };

export const Resource = {
  encode(
    message: Resource,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.uri !== "") {
      writer.uint32(10).string(message.uri);
    }
    if (message.resource !== "") {
      writer.uint32(18).string(message.resource);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Resource {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseResource } as Resource;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.uri = reader.string();
          break;
        case 2:
          message.resource = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Resource {
    const message = { ...baseResource } as Resource;
    if (object.uri !== undefined && object.uri !== null) {
      message.uri = String(object.uri);
    } else {
      message.uri = "";
    }
    if (object.resource !== undefined && object.resource !== null) {
      message.resource = String(object.resource);
    } else {
      message.resource = "";
    }
    return message;
  },

  toJSON(message: Resource): unknown {
    const obj: any = {};
    message.uri !== undefined && (obj.uri = message.uri);
    message.resource !== undefined && (obj.resource = message.resource);
    return obj;
  },

  fromPartial(object: DeepPartial<Resource>): Resource {
    const message = { ...baseResource } as Resource;
    if (object.uri !== undefined && object.uri !== null) {
      message.uri = object.uri;
    } else {
      message.uri = "";
    }
    if (object.resource !== undefined && object.resource !== null) {
      message.resource = object.resource;
    } else {
      message.resource = "";
    }
    return message;
  },
};

const baseDomain: object = { name: "", validUntil: 0, type: "" };

export const Domain = {
  encode(
    message: Domain,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.admin.length !== 0) {
      writer.uint32(18).bytes(message.admin);
    }
    if (message.broker.length !== 0) {
      writer.uint32(26).bytes(message.broker);
    }
    if (message.validUntil !== 0) {
      writer.uint32(32).int64(message.validUntil);
    }
    if (message.type !== "") {
      writer.uint32(42).string(message.type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Domain {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDomain } as Domain;
    message.admin = new Uint8Array();
    message.broker = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.admin = reader.bytes();
          break;
        case 3:
          message.broker = reader.bytes();
          break;
        case 4:
          message.validUntil = longToNumber(reader.int64() as Long);
          break;
        case 5:
          message.type = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Domain {
    const message = { ...baseDomain } as Domain;
    message.admin = new Uint8Array();
    message.broker = new Uint8Array();
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    if (object.admin !== undefined && object.admin !== null) {
      message.admin = bytesFromBase64(object.admin);
    }
    if (object.broker !== undefined && object.broker !== null) {
      message.broker = bytesFromBase64(object.broker);
    }
    if (object.validUntil !== undefined && object.validUntil !== null) {
      message.validUntil = Number(object.validUntil);
    } else {
      message.validUntil = 0;
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = String(object.type);
    } else {
      message.type = "";
    }
    return message;
  },

  toJSON(message: Domain): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.admin !== undefined &&
      (obj.admin = base64FromBytes(
        message.admin !== undefined ? message.admin : new Uint8Array(),
      ));
    message.broker !== undefined &&
      (obj.broker = base64FromBytes(
        message.broker !== undefined ? message.broker : new Uint8Array(),
      ));
    message.validUntil !== undefined && (obj.validUntil = message.validUntil);
    message.type !== undefined && (obj.type = message.type);
    return obj;
  },

  fromPartial(object: DeepPartial<Domain>): Domain {
    const message = { ...baseDomain } as Domain;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    if (object.admin !== undefined && object.admin !== null) {
      message.admin = object.admin;
    } else {
      message.admin = new Uint8Array();
    }
    if (object.broker !== undefined && object.broker !== null) {
      message.broker = object.broker;
    } else {
      message.broker = new Uint8Array();
    }
    if (object.validUntil !== undefined && object.validUntil !== null) {
      message.validUntil = object.validUntil;
    } else {
      message.validUntil = 0;
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    } else {
      message.type = "";
    }
    return message;
  },
};

const baseAccount: object = { domain: "", validUntil: 0, metadataUri: "" };

export const Account = {
  encode(
    message: Account,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.domain !== "") {
      writer.uint32(10).string(message.domain);
    }
    if (message.name !== undefined) {
      StringValue.encode(
        { value: message.name! },
        writer.uint32(18).fork(),
      ).ldelim();
    }
    if (message.owner.length !== 0) {
      writer.uint32(26).bytes(message.owner);
    }
    if (message.broker.length !== 0) {
      writer.uint32(34).bytes(message.broker);
    }
    if (message.validUntil !== 0) {
      writer.uint32(40).int64(message.validUntil);
    }
    for (const v of message.resources) {
      Resource.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    for (const v of message.certificates) {
      writer.uint32(58).bytes(v!);
    }
    if (message.metadataUri !== "") {
      writer.uint32(66).string(message.metadataUri);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Account {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAccount } as Account;
    message.resources = [];
    message.certificates = [];
    message.owner = new Uint8Array();
    message.broker = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.domain = reader.string();
          break;
        case 2:
          message.name = StringValue.decode(reader, reader.uint32()).value;
          break;
        case 3:
          message.owner = reader.bytes();
          break;
        case 4:
          message.broker = reader.bytes();
          break;
        case 5:
          message.validUntil = longToNumber(reader.int64() as Long);
          break;
        case 6:
          message.resources.push(Resource.decode(reader, reader.uint32()));
          break;
        case 7:
          message.certificates.push(reader.bytes());
          break;
        case 8:
          message.metadataUri = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Account {
    const message = { ...baseAccount } as Account;
    message.resources = [];
    message.certificates = [];
    message.owner = new Uint8Array();
    message.broker = new Uint8Array();
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = String(object.domain);
    } else {
      message.domain = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = undefined;
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = bytesFromBase64(object.owner);
    }
    if (object.broker !== undefined && object.broker !== null) {
      message.broker = bytesFromBase64(object.broker);
    }
    if (object.validUntil !== undefined && object.validUntil !== null) {
      message.validUntil = Number(object.validUntil);
    } else {
      message.validUntil = 0;
    }
    if (object.resources !== undefined && object.resources !== null) {
      for (const e of object.resources) {
        message.resources.push(Resource.fromJSON(e));
      }
    }
    if (object.certificates !== undefined && object.certificates !== null) {
      for (const e of object.certificates) {
        message.certificates.push(bytesFromBase64(e));
      }
    }
    if (object.metadataUri !== undefined && object.metadataUri !== null) {
      message.metadataUri = String(object.metadataUri);
    } else {
      message.metadataUri = "";
    }
    return message;
  },

  toJSON(message: Account): unknown {
    const obj: any = {};
    message.domain !== undefined && (obj.domain = message.domain);
    message.name !== undefined && (obj.name = message.name);
    message.owner !== undefined &&
      (obj.owner = base64FromBytes(
        message.owner !== undefined ? message.owner : new Uint8Array(),
      ));
    message.broker !== undefined &&
      (obj.broker = base64FromBytes(
        message.broker !== undefined ? message.broker : new Uint8Array(),
      ));
    message.validUntil !== undefined && (obj.validUntil = message.validUntil);
    if (message.resources) {
      obj.resources = message.resources.map((e) =>
        e ? Resource.toJSON(e) : undefined,
      );
    } else {
      obj.resources = [];
    }
    if (message.certificates) {
      obj.certificates = message.certificates.map((e) =>
        base64FromBytes(e !== undefined ? e : new Uint8Array()),
      );
    } else {
      obj.certificates = [];
    }
    message.metadataUri !== undefined &&
      (obj.metadataUri = message.metadataUri);
    return obj;
  },

  fromPartial(object: DeepPartial<Account>): Account {
    const message = { ...baseAccount } as Account;
    message.resources = [];
    message.certificates = [];
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = object.domain;
    } else {
      message.domain = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = undefined;
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = object.owner;
    } else {
      message.owner = new Uint8Array();
    }
    if (object.broker !== undefined && object.broker !== null) {
      message.broker = object.broker;
    } else {
      message.broker = new Uint8Array();
    }
    if (object.validUntil !== undefined && object.validUntil !== null) {
      message.validUntil = object.validUntil;
    } else {
      message.validUntil = 0;
    }
    if (object.resources !== undefined && object.resources !== null) {
      for (const e of object.resources) {
        message.resources.push(Resource.fromPartial(e));
      }
    }
    if (object.certificates !== undefined && object.certificates !== null) {
      for (const e of object.certificates) {
        message.certificates.push(e);
      }
    }
    if (object.metadataUri !== undefined && object.metadataUri !== null) {
      message.metadataUri = object.metadataUri;
    } else {
      message.metadataUri = "";
    }
    return message;
  },
};

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
