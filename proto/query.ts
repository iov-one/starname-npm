/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Domain, Account } from "./types";
import {
  PageRequest,
  PageResponse,
} from "./cosmos/base/query/v1beta1/pagination";

export const protobufPackage = "starnamed.x.starname.v1beta1";

/** QueryDomainRequest is the request type for the Query/Domain RPC method. */
export interface QueryDomainRequest {
  /** Name is the name of the domain. */
  name: string;
}

/** QueryDomainResponse is the response type for the Query/Domain RPC method. */
export interface QueryDomainResponse {
  /** Domain is the information associated with the domain. */
  domain: Domain | undefined;
}

/** QueryDomainAccountsRequest is the request type for the Query/DomainAccounts RPC method. */
export interface QueryDomainAccountsRequest {
  /** Domain is the name of the domain. */
  domain: string;
  pagination: PageRequest | undefined;
}

/** QueryDomainAccountsResponse is the response type for the Query/DomainAccounts RPC method. */
export interface QueryDomainAccountsResponse {
  /** Accounts is the accounts associated with the domain. */
  accounts: Account[];
  page: PageResponse | undefined;
}

/** QueryStarnameRequest is the request type for the Query/Starname RPC method. */
export interface QueryStarnameRequest {
  /** Starname is the of the form account*domain. */
  starname: string;
}

/** QueryStarnameResponse is the response type for the Query/Starname RPC method. */
export interface QueryStarnameResponse {
  /** Account is the information associated with the starname. */
  account: Account | undefined;
}

/** QueryOwnerAccountsRequest is the request type for the Query/OwnerAccounts RPC method. */
export interface QueryOwnerAccountsRequest {
  /** Owner is the owner of accounts. */
  owner: string;
  pagination: PageRequest | undefined;
}

/** QueryOwnerAccountsResponse is the response type for the Query/OwnerAccounts RPC method. */
export interface QueryOwnerAccountsResponse {
  /** Accounts is the accounts associated with owner. */
  accounts: Account[];
  page: PageResponse | undefined;
}

/** QueryOwnerDomainsRequest is the request type for the Query/OwnerDomains RPC method. */
export interface QueryOwnerDomainsRequest {
  /** Owner is the owner of accounts. */
  owner: string;
  pagination: PageRequest | undefined;
}

/** QueryOwnerDomainsResponse is the response type for the Query/OwnerDomains RPC method. */
export interface QueryOwnerDomainsResponse {
  /** Accounts is the accounts associated with owner. */
  domains: Domain[];
  page: PageResponse | undefined;
}

/** QueryResourceAccountsRequest is the request type for the Query/ResourceAccounts RPC method. */
export interface QueryResourceAccountsRequest {
  /** Uri is the uri of the resource. query.pb.gw.to doesn't respect gogoproto.customname, so we're stuck with Uri. */
  uri: string;
  /** Resource is the resource of interest. */
  resource: string;
  pagination: PageRequest | undefined;
}

/** QueryResourceAccountsResponse is the response type for the Query/ResourceAccounts RPC method. */
export interface QueryResourceAccountsResponse {
  /** Accounts are the accounts associated with the resource. */
  accounts: Account[];
  page: PageResponse | undefined;
}

/** QueryBrokerAccountsRequest is the request type for the Query/BrokerAccounts RPC method. */
export interface QueryBrokerAccountsRequest {
  /** Broker is the broker of accounts. */
  broker: string;
  pagination: PageRequest | undefined;
}

/** QueryBrokerAccountsResponse is the response type for the Query/BrokerAccounts RPC method. */
export interface QueryBrokerAccountsResponse {
  /** Accounts is the accounts associated with broker. */
  accounts: Account[];
  page: PageResponse | undefined;
}

/** QueryBrokerDomainsRequest is the request type for the Query/BrokerDomains RPC method. */
export interface QueryBrokerDomainsRequest {
  /** Broker is the broker of accounts. */
  broker: string;
  pagination: PageRequest | undefined;
}

/** QueryBrokerDomainsResponse is the response type for the Query/BrokerDomains RPC method. */
export interface QueryBrokerDomainsResponse {
  /** Accounts is the accounts associated with broker. */
  domains: Domain[];
  page: PageResponse | undefined;
}

const baseQueryDomainRequest: object = { name: "" };

export const QueryDomainRequest = {
  encode(
    message: QueryDomainRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryDomainRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryDomainRequest } as QueryDomainRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryDomainRequest {
    const message = { ...baseQueryDomainRequest } as QueryDomainRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    return message;
  },

  toJSON(message: QueryDomainRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  fromPartial(object: DeepPartial<QueryDomainRequest>): QueryDomainRequest {
    const message = { ...baseQueryDomainRequest } as QueryDomainRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    return message;
  },
};

const baseQueryDomainResponse: object = {};

export const QueryDomainResponse = {
  encode(
    message: QueryDomainResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.domain !== undefined) {
      Domain.encode(message.domain, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryDomainResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryDomainResponse } as QueryDomainResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.domain = Domain.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryDomainResponse {
    const message = { ...baseQueryDomainResponse } as QueryDomainResponse;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = Domain.fromJSON(object.domain);
    } else {
      message.domain = undefined;
    }
    return message;
  },

  toJSON(message: QueryDomainResponse): unknown {
    const obj: any = {};
    message.domain !== undefined &&
      (obj.domain = message.domain ? Domain.toJSON(message.domain) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<QueryDomainResponse>): QueryDomainResponse {
    const message = { ...baseQueryDomainResponse } as QueryDomainResponse;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = Domain.fromPartial(object.domain);
    } else {
      message.domain = undefined;
    }
    return message;
  },
};

const baseQueryDomainAccountsRequest: object = { domain: "" };

export const QueryDomainAccountsRequest = {
  encode(
    message: QueryDomainAccountsRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.domain !== "") {
      writer.uint32(10).string(message.domain);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryDomainAccountsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryDomainAccountsRequest,
    } as QueryDomainAccountsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.domain = reader.string();
          break;
        case 2:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryDomainAccountsRequest {
    const message = {
      ...baseQueryDomainAccountsRequest,
    } as QueryDomainAccountsRequest;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = String(object.domain);
    } else {
      message.domain = "";
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryDomainAccountsRequest): unknown {
    const obj: any = {};
    message.domain !== undefined && (obj.domain = message.domain);
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryDomainAccountsRequest>,
  ): QueryDomainAccountsRequest {
    const message = {
      ...baseQueryDomainAccountsRequest,
    } as QueryDomainAccountsRequest;
    if (object.domain !== undefined && object.domain !== null) {
      message.domain = object.domain;
    } else {
      message.domain = "";
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryDomainAccountsResponse: object = {};

export const QueryDomainAccountsResponse = {
  encode(
    message: QueryDomainAccountsResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.accounts) {
      Account.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.page !== undefined) {
      PageResponse.encode(message.page, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryDomainAccountsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryDomainAccountsResponse,
    } as QueryDomainAccountsResponse;
    message.accounts = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accounts.push(Account.decode(reader, reader.uint32()));
          break;
        case 2:
          message.page = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryDomainAccountsResponse {
    const message = {
      ...baseQueryDomainAccountsResponse,
    } as QueryDomainAccountsResponse;
    message.accounts = [];
    if (object.accounts !== undefined && object.accounts !== null) {
      for (const e of object.accounts) {
        message.accounts.push(Account.fromJSON(e));
      }
    }
    if (object.page !== undefined && object.page !== null) {
      message.page = PageResponse.fromJSON(object.page);
    } else {
      message.page = undefined;
    }
    return message;
  },

  toJSON(message: QueryDomainAccountsResponse): unknown {
    const obj: any = {};
    if (message.accounts) {
      obj.accounts = message.accounts.map((e) =>
        e ? Account.toJSON(e) : undefined,
      );
    } else {
      obj.accounts = [];
    }
    message.page !== undefined &&
      (obj.page = message.page ? PageResponse.toJSON(message.page) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryDomainAccountsResponse>,
  ): QueryDomainAccountsResponse {
    const message = {
      ...baseQueryDomainAccountsResponse,
    } as QueryDomainAccountsResponse;
    message.accounts = [];
    if (object.accounts !== undefined && object.accounts !== null) {
      for (const e of object.accounts) {
        message.accounts.push(Account.fromPartial(e));
      }
    }
    if (object.page !== undefined && object.page !== null) {
      message.page = PageResponse.fromPartial(object.page);
    } else {
      message.page = undefined;
    }
    return message;
  },
};

const baseQueryStarnameRequest: object = { starname: "" };

export const QueryStarnameRequest = {
  encode(
    message: QueryStarnameRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.starname !== "") {
      writer.uint32(10).string(message.starname);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryStarnameRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryStarnameRequest } as QueryStarnameRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.starname = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryStarnameRequest {
    const message = { ...baseQueryStarnameRequest } as QueryStarnameRequest;
    if (object.starname !== undefined && object.starname !== null) {
      message.starname = String(object.starname);
    } else {
      message.starname = "";
    }
    return message;
  },

  toJSON(message: QueryStarnameRequest): unknown {
    const obj: any = {};
    message.starname !== undefined && (obj.starname = message.starname);
    return obj;
  },

  fromPartial(object: DeepPartial<QueryStarnameRequest>): QueryStarnameRequest {
    const message = { ...baseQueryStarnameRequest } as QueryStarnameRequest;
    if (object.starname !== undefined && object.starname !== null) {
      message.starname = object.starname;
    } else {
      message.starname = "";
    }
    return message;
  },
};

const baseQueryStarnameResponse: object = {};

export const QueryStarnameResponse = {
  encode(
    message: QueryStarnameResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.account !== undefined) {
      Account.encode(message.account, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryStarnameResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryStarnameResponse } as QueryStarnameResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.account = Account.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryStarnameResponse {
    const message = { ...baseQueryStarnameResponse } as QueryStarnameResponse;
    if (object.account !== undefined && object.account !== null) {
      message.account = Account.fromJSON(object.account);
    } else {
      message.account = undefined;
    }
    return message;
  },

  toJSON(message: QueryStarnameResponse): unknown {
    const obj: any = {};
    message.account !== undefined &&
      (obj.account = message.account
        ? Account.toJSON(message.account)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryStarnameResponse>,
  ): QueryStarnameResponse {
    const message = { ...baseQueryStarnameResponse } as QueryStarnameResponse;
    if (object.account !== undefined && object.account !== null) {
      message.account = Account.fromPartial(object.account);
    } else {
      message.account = undefined;
    }
    return message;
  },
};

const baseQueryOwnerAccountsRequest: object = { owner: "" };

export const QueryOwnerAccountsRequest = {
  encode(
    message: QueryOwnerAccountsRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.owner !== "") {
      writer.uint32(10).string(message.owner);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryOwnerAccountsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryOwnerAccountsRequest,
    } as QueryOwnerAccountsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.owner = reader.string();
          break;
        case 2:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryOwnerAccountsRequest {
    const message = {
      ...baseQueryOwnerAccountsRequest,
    } as QueryOwnerAccountsRequest;
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = String(object.owner);
    } else {
      message.owner = "";
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryOwnerAccountsRequest): unknown {
    const obj: any = {};
    message.owner !== undefined && (obj.owner = message.owner);
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryOwnerAccountsRequest>,
  ): QueryOwnerAccountsRequest {
    const message = {
      ...baseQueryOwnerAccountsRequest,
    } as QueryOwnerAccountsRequest;
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = object.owner;
    } else {
      message.owner = "";
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryOwnerAccountsResponse: object = {};

export const QueryOwnerAccountsResponse = {
  encode(
    message: QueryOwnerAccountsResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.accounts) {
      Account.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.page !== undefined) {
      PageResponse.encode(message.page, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryOwnerAccountsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryOwnerAccountsResponse,
    } as QueryOwnerAccountsResponse;
    message.accounts = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accounts.push(Account.decode(reader, reader.uint32()));
          break;
        case 2:
          message.page = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryOwnerAccountsResponse {
    const message = {
      ...baseQueryOwnerAccountsResponse,
    } as QueryOwnerAccountsResponse;
    message.accounts = [];
    if (object.accounts !== undefined && object.accounts !== null) {
      for (const e of object.accounts) {
        message.accounts.push(Account.fromJSON(e));
      }
    }
    if (object.page !== undefined && object.page !== null) {
      message.page = PageResponse.fromJSON(object.page);
    } else {
      message.page = undefined;
    }
    return message;
  },

  toJSON(message: QueryOwnerAccountsResponse): unknown {
    const obj: any = {};
    if (message.accounts) {
      obj.accounts = message.accounts.map((e) =>
        e ? Account.toJSON(e) : undefined,
      );
    } else {
      obj.accounts = [];
    }
    message.page !== undefined &&
      (obj.page = message.page ? PageResponse.toJSON(message.page) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryOwnerAccountsResponse>,
  ): QueryOwnerAccountsResponse {
    const message = {
      ...baseQueryOwnerAccountsResponse,
    } as QueryOwnerAccountsResponse;
    message.accounts = [];
    if (object.accounts !== undefined && object.accounts !== null) {
      for (const e of object.accounts) {
        message.accounts.push(Account.fromPartial(e));
      }
    }
    if (object.page !== undefined && object.page !== null) {
      message.page = PageResponse.fromPartial(object.page);
    } else {
      message.page = undefined;
    }
    return message;
  },
};

const baseQueryOwnerDomainsRequest: object = { owner: "" };

export const QueryOwnerDomainsRequest = {
  encode(
    message: QueryOwnerDomainsRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.owner !== "") {
      writer.uint32(10).string(message.owner);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryOwnerDomainsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryOwnerDomainsRequest,
    } as QueryOwnerDomainsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.owner = reader.string();
          break;
        case 2:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryOwnerDomainsRequest {
    const message = {
      ...baseQueryOwnerDomainsRequest,
    } as QueryOwnerDomainsRequest;
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = String(object.owner);
    } else {
      message.owner = "";
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryOwnerDomainsRequest): unknown {
    const obj: any = {};
    message.owner !== undefined && (obj.owner = message.owner);
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryOwnerDomainsRequest>,
  ): QueryOwnerDomainsRequest {
    const message = {
      ...baseQueryOwnerDomainsRequest,
    } as QueryOwnerDomainsRequest;
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = object.owner;
    } else {
      message.owner = "";
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryOwnerDomainsResponse: object = {};

export const QueryOwnerDomainsResponse = {
  encode(
    message: QueryOwnerDomainsResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.domains) {
      Domain.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.page !== undefined) {
      PageResponse.encode(message.page, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryOwnerDomainsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryOwnerDomainsResponse,
    } as QueryOwnerDomainsResponse;
    message.domains = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.domains.push(Domain.decode(reader, reader.uint32()));
          break;
        case 2:
          message.page = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryOwnerDomainsResponse {
    const message = {
      ...baseQueryOwnerDomainsResponse,
    } as QueryOwnerDomainsResponse;
    message.domains = [];
    if (object.domains !== undefined && object.domains !== null) {
      for (const e of object.domains) {
        message.domains.push(Domain.fromJSON(e));
      }
    }
    if (object.page !== undefined && object.page !== null) {
      message.page = PageResponse.fromJSON(object.page);
    } else {
      message.page = undefined;
    }
    return message;
  },

  toJSON(message: QueryOwnerDomainsResponse): unknown {
    const obj: any = {};
    if (message.domains) {
      obj.domains = message.domains.map((e) =>
        e ? Domain.toJSON(e) : undefined,
      );
    } else {
      obj.domains = [];
    }
    message.page !== undefined &&
      (obj.page = message.page ? PageResponse.toJSON(message.page) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryOwnerDomainsResponse>,
  ): QueryOwnerDomainsResponse {
    const message = {
      ...baseQueryOwnerDomainsResponse,
    } as QueryOwnerDomainsResponse;
    message.domains = [];
    if (object.domains !== undefined && object.domains !== null) {
      for (const e of object.domains) {
        message.domains.push(Domain.fromPartial(e));
      }
    }
    if (object.page !== undefined && object.page !== null) {
      message.page = PageResponse.fromPartial(object.page);
    } else {
      message.page = undefined;
    }
    return message;
  },
};

const baseQueryResourceAccountsRequest: object = { uri: "", resource: "" };

export const QueryResourceAccountsRequest = {
  encode(
    message: QueryResourceAccountsRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.uri !== "") {
      writer.uint32(10).string(message.uri);
    }
    if (message.resource !== "") {
      writer.uint32(18).string(message.resource);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryResourceAccountsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryResourceAccountsRequest,
    } as QueryResourceAccountsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.uri = reader.string();
          break;
        case 2:
          message.resource = reader.string();
          break;
        case 3:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryResourceAccountsRequest {
    const message = {
      ...baseQueryResourceAccountsRequest,
    } as QueryResourceAccountsRequest;
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
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryResourceAccountsRequest): unknown {
    const obj: any = {};
    message.uri !== undefined && (obj.uri = message.uri);
    message.resource !== undefined && (obj.resource = message.resource);
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryResourceAccountsRequest>,
  ): QueryResourceAccountsRequest {
    const message = {
      ...baseQueryResourceAccountsRequest,
    } as QueryResourceAccountsRequest;
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
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryResourceAccountsResponse: object = {};

export const QueryResourceAccountsResponse = {
  encode(
    message: QueryResourceAccountsResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.accounts) {
      Account.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.page !== undefined) {
      PageResponse.encode(message.page, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryResourceAccountsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryResourceAccountsResponse,
    } as QueryResourceAccountsResponse;
    message.accounts = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accounts.push(Account.decode(reader, reader.uint32()));
          break;
        case 2:
          message.page = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryResourceAccountsResponse {
    const message = {
      ...baseQueryResourceAccountsResponse,
    } as QueryResourceAccountsResponse;
    message.accounts = [];
    if (object.accounts !== undefined && object.accounts !== null) {
      for (const e of object.accounts) {
        message.accounts.push(Account.fromJSON(e));
      }
    }
    if (object.page !== undefined && object.page !== null) {
      message.page = PageResponse.fromJSON(object.page);
    } else {
      message.page = undefined;
    }
    return message;
  },

  toJSON(message: QueryResourceAccountsResponse): unknown {
    const obj: any = {};
    if (message.accounts) {
      obj.accounts = message.accounts.map((e) =>
        e ? Account.toJSON(e) : undefined,
      );
    } else {
      obj.accounts = [];
    }
    message.page !== undefined &&
      (obj.page = message.page ? PageResponse.toJSON(message.page) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryResourceAccountsResponse>,
  ): QueryResourceAccountsResponse {
    const message = {
      ...baseQueryResourceAccountsResponse,
    } as QueryResourceAccountsResponse;
    message.accounts = [];
    if (object.accounts !== undefined && object.accounts !== null) {
      for (const e of object.accounts) {
        message.accounts.push(Account.fromPartial(e));
      }
    }
    if (object.page !== undefined && object.page !== null) {
      message.page = PageResponse.fromPartial(object.page);
    } else {
      message.page = undefined;
    }
    return message;
  },
};

const baseQueryBrokerAccountsRequest: object = { broker: "" };

export const QueryBrokerAccountsRequest = {
  encode(
    message: QueryBrokerAccountsRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.broker !== "") {
      writer.uint32(10).string(message.broker);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryBrokerAccountsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryBrokerAccountsRequest,
    } as QueryBrokerAccountsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.broker = reader.string();
          break;
        case 2:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryBrokerAccountsRequest {
    const message = {
      ...baseQueryBrokerAccountsRequest,
    } as QueryBrokerAccountsRequest;
    if (object.broker !== undefined && object.broker !== null) {
      message.broker = String(object.broker);
    } else {
      message.broker = "";
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryBrokerAccountsRequest): unknown {
    const obj: any = {};
    message.broker !== undefined && (obj.broker = message.broker);
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryBrokerAccountsRequest>,
  ): QueryBrokerAccountsRequest {
    const message = {
      ...baseQueryBrokerAccountsRequest,
    } as QueryBrokerAccountsRequest;
    if (object.broker !== undefined && object.broker !== null) {
      message.broker = object.broker;
    } else {
      message.broker = "";
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryBrokerAccountsResponse: object = {};

export const QueryBrokerAccountsResponse = {
  encode(
    message: QueryBrokerAccountsResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.accounts) {
      Account.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.page !== undefined) {
      PageResponse.encode(message.page, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryBrokerAccountsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryBrokerAccountsResponse,
    } as QueryBrokerAccountsResponse;
    message.accounts = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accounts.push(Account.decode(reader, reader.uint32()));
          break;
        case 2:
          message.page = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryBrokerAccountsResponse {
    const message = {
      ...baseQueryBrokerAccountsResponse,
    } as QueryBrokerAccountsResponse;
    message.accounts = [];
    if (object.accounts !== undefined && object.accounts !== null) {
      for (const e of object.accounts) {
        message.accounts.push(Account.fromJSON(e));
      }
    }
    if (object.page !== undefined && object.page !== null) {
      message.page = PageResponse.fromJSON(object.page);
    } else {
      message.page = undefined;
    }
    return message;
  },

  toJSON(message: QueryBrokerAccountsResponse): unknown {
    const obj: any = {};
    if (message.accounts) {
      obj.accounts = message.accounts.map((e) =>
        e ? Account.toJSON(e) : undefined,
      );
    } else {
      obj.accounts = [];
    }
    message.page !== undefined &&
      (obj.page = message.page ? PageResponse.toJSON(message.page) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryBrokerAccountsResponse>,
  ): QueryBrokerAccountsResponse {
    const message = {
      ...baseQueryBrokerAccountsResponse,
    } as QueryBrokerAccountsResponse;
    message.accounts = [];
    if (object.accounts !== undefined && object.accounts !== null) {
      for (const e of object.accounts) {
        message.accounts.push(Account.fromPartial(e));
      }
    }
    if (object.page !== undefined && object.page !== null) {
      message.page = PageResponse.fromPartial(object.page);
    } else {
      message.page = undefined;
    }
    return message;
  },
};

const baseQueryBrokerDomainsRequest: object = { broker: "" };

export const QueryBrokerDomainsRequest = {
  encode(
    message: QueryBrokerDomainsRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.broker !== "") {
      writer.uint32(10).string(message.broker);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryBrokerDomainsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryBrokerDomainsRequest,
    } as QueryBrokerDomainsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.broker = reader.string();
          break;
        case 2:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryBrokerDomainsRequest {
    const message = {
      ...baseQueryBrokerDomainsRequest,
    } as QueryBrokerDomainsRequest;
    if (object.broker !== undefined && object.broker !== null) {
      message.broker = String(object.broker);
    } else {
      message.broker = "";
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryBrokerDomainsRequest): unknown {
    const obj: any = {};
    message.broker !== undefined && (obj.broker = message.broker);
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryBrokerDomainsRequest>,
  ): QueryBrokerDomainsRequest {
    const message = {
      ...baseQueryBrokerDomainsRequest,
    } as QueryBrokerDomainsRequest;
    if (object.broker !== undefined && object.broker !== null) {
      message.broker = object.broker;
    } else {
      message.broker = "";
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryBrokerDomainsResponse: object = {};

export const QueryBrokerDomainsResponse = {
  encode(
    message: QueryBrokerDomainsResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.domains) {
      Domain.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.page !== undefined) {
      PageResponse.encode(message.page, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): QueryBrokerDomainsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryBrokerDomainsResponse,
    } as QueryBrokerDomainsResponse;
    message.domains = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.domains.push(Domain.decode(reader, reader.uint32()));
          break;
        case 2:
          message.page = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryBrokerDomainsResponse {
    const message = {
      ...baseQueryBrokerDomainsResponse,
    } as QueryBrokerDomainsResponse;
    message.domains = [];
    if (object.domains !== undefined && object.domains !== null) {
      for (const e of object.domains) {
        message.domains.push(Domain.fromJSON(e));
      }
    }
    if (object.page !== undefined && object.page !== null) {
      message.page = PageResponse.fromJSON(object.page);
    } else {
      message.page = undefined;
    }
    return message;
  },

  toJSON(message: QueryBrokerDomainsResponse): unknown {
    const obj: any = {};
    if (message.domains) {
      obj.domains = message.domains.map((e) =>
        e ? Domain.toJSON(e) : undefined,
      );
    } else {
      obj.domains = [];
    }
    message.page !== undefined &&
      (obj.page = message.page ? PageResponse.toJSON(message.page) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryBrokerDomainsResponse>,
  ): QueryBrokerDomainsResponse {
    const message = {
      ...baseQueryBrokerDomainsResponse,
    } as QueryBrokerDomainsResponse;
    message.domains = [];
    if (object.domains !== undefined && object.domains !== null) {
      for (const e of object.domains) {
        message.domains.push(Domain.fromPartial(e));
      }
    }
    if (object.page !== undefined && object.page !== null) {
      message.page = PageResponse.fromPartial(object.page);
    } else {
      message.page = undefined;
    }
    return message;
  },
};

/** Query defines the gRPC querier service. */
export interface Query {
  /** Domain gets a starname's domain info. */
  Domain(request: QueryDomainRequest): Promise<QueryDomainResponse>;
  /** DomainAccounts gets accounts associated with a given domain. */
  DomainAccounts(
    request: QueryDomainAccountsRequest,
  ): Promise<QueryDomainAccountsResponse>;
  /** Starname gets all the information associated with a starname. */
  Starname(request: QueryStarnameRequest): Promise<QueryStarnameResponse>;
  /** OwnerAccounts gets accounts associated with a given owner. */
  OwnerAccounts(
    request: QueryOwnerAccountsRequest,
  ): Promise<QueryOwnerAccountsResponse>;
  /** OwnerDomains gets domains associated with a given owner. */
  OwnerDomains(
    request: QueryOwnerDomainsRequest,
  ): Promise<QueryOwnerDomainsResponse>;
  /** ResourceAccounts gets accounts associated with a given resource. */
  ResourceAccounts(
    request: QueryResourceAccountsRequest,
  ): Promise<QueryResourceAccountsResponse>;
  /** BrokerAccounts gets accounts associated with a given broker. */
  BrokerAccounts(
    request: QueryBrokerAccountsRequest,
  ): Promise<QueryBrokerAccountsResponse>;
  /** BrokerDomains gets domains associated with a given broker. */
  BrokerDomains(
    request: QueryBrokerDomainsRequest,
  ): Promise<QueryBrokerDomainsResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Domain = this.Domain.bind(this);
    this.DomainAccounts = this.DomainAccounts.bind(this);
    this.Starname = this.Starname.bind(this);
    this.OwnerAccounts = this.OwnerAccounts.bind(this);
    this.OwnerDomains = this.OwnerDomains.bind(this);
    this.ResourceAccounts = this.ResourceAccounts.bind(this);
    this.BrokerAccounts = this.BrokerAccounts.bind(this);
    this.BrokerDomains = this.BrokerDomains.bind(this);
  }
  Domain(request: QueryDomainRequest): Promise<QueryDomainResponse> {
    const data = QueryDomainRequest.encode(request).finish();
    const promise = this.rpc.request(
      "starnamed.x.starname.v1beta1.Query",
      "Domain",
      data,
    );
    return promise.then((data) =>
      QueryDomainResponse.decode(new _m0.Reader(data)),
    );
  }

  DomainAccounts(
    request: QueryDomainAccountsRequest,
  ): Promise<QueryDomainAccountsResponse> {
    const data = QueryDomainAccountsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "starnamed.x.starname.v1beta1.Query",
      "DomainAccounts",
      data,
    );
    return promise.then((data) =>
      QueryDomainAccountsResponse.decode(new _m0.Reader(data)),
    );
  }

  Starname(request: QueryStarnameRequest): Promise<QueryStarnameResponse> {
    const data = QueryStarnameRequest.encode(request).finish();
    const promise = this.rpc.request(
      "starnamed.x.starname.v1beta1.Query",
      "Starname",
      data,
    );
    return promise.then((data) =>
      QueryStarnameResponse.decode(new _m0.Reader(data)),
    );
  }

  OwnerAccounts(
    request: QueryOwnerAccountsRequest,
  ): Promise<QueryOwnerAccountsResponse> {
    const data = QueryOwnerAccountsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "starnamed.x.starname.v1beta1.Query",
      "OwnerAccounts",
      data,
    );
    return promise.then((data) =>
      QueryOwnerAccountsResponse.decode(new _m0.Reader(data)),
    );
  }

  OwnerDomains(
    request: QueryOwnerDomainsRequest,
  ): Promise<QueryOwnerDomainsResponse> {
    const data = QueryOwnerDomainsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "starnamed.x.starname.v1beta1.Query",
      "OwnerDomains",
      data,
    );
    return promise.then((data) =>
      QueryOwnerDomainsResponse.decode(new _m0.Reader(data)),
    );
  }

  ResourceAccounts(
    request: QueryResourceAccountsRequest,
  ): Promise<QueryResourceAccountsResponse> {
    const data = QueryResourceAccountsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "starnamed.x.starname.v1beta1.Query",
      "ResourceAccounts",
      data,
    );
    return promise.then((data) =>
      QueryResourceAccountsResponse.decode(new _m0.Reader(data)),
    );
  }

  BrokerAccounts(
    request: QueryBrokerAccountsRequest,
  ): Promise<QueryBrokerAccountsResponse> {
    const data = QueryBrokerAccountsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "starnamed.x.starname.v1beta1.Query",
      "BrokerAccounts",
      data,
    );
    return promise.then((data) =>
      QueryBrokerAccountsResponse.decode(new _m0.Reader(data)),
    );
  }

  BrokerDomains(
    request: QueryBrokerDomainsRequest,
  ): Promise<QueryBrokerDomainsResponse> {
    const data = QueryBrokerDomainsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "starnamed.x.starname.v1beta1.Query",
      "BrokerDomains",
      data,
    );
    return promise.then((data) =>
      QueryBrokerDomainsResponse.decode(new _m0.Reader(data)),
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

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
