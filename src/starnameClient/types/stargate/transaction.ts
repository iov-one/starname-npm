import { AminoMsg } from "@cosmjs/amino";
import { EncodeObject } from "@cosmjs/proto-signing";
import {
  Attribute,
  Event,
  isAminoMsgBeginRedelegate,
  isMsgDelegateEncodeObject,
  isMsgSendEncodeObject,
  isMsgUndelegateEncodeObject,
} from "@cosmjs/stargate";
import { Log } from "@cosmjs/stargate/build/logs";

import { TxType } from "../../../starnameRegistry";
import { AminoType } from "../../../types/aminoTypes";
import { Amount } from "../../../types/amount";
import { TokenLike } from "../../../types/tokenLike";
import { Transaction } from "../../../types/transaction";
import {
  getEscrow,
  getValidator,
  reverseLookup,
} from "../../../utils/getTransaction";
import { StarnameClient } from "../../index";
import { StargateBaseTx } from "../../types/stargate/searchTxResponse";

export class StargateTransaction {
  static async fromStarnameBaseTx(
    client: StarnameClient,
    baseTx: StargateBaseTx<EncodeObject>,
  ): Promise<Transaction> {
    const { logs } = baseTx;
    const log: Log = logs[0];
    const { events } = log;
    const transfer: Event | undefined = events.find(
      (event: Event) => event.type === "transfer",
    );
    if (transfer === undefined)
      throw new Error("there are not transfers in the log events");
    const attributes: ReadonlyArray<Attribute> = transfer.attributes;
    const amount: Attribute | undefined = attributes.find(
      (attr: Attribute): boolean => attr.key === "amount",
    );
    if (amount === undefined)
      throw new Error("there is no amount in this transfer event");
    const sender: Attribute | undefined = attributes.find(
      (attr: Attribute): boolean => attr.key === "sender",
    );
    if (sender === undefined)
      throw new Error("cannot find a sender for this transfer event");
    const { value } = amount;
    const unit: string = value.replace(/[0-9]+/, "");
    const token: TokenLike | undefined = client.getToken(unit);
    if (token === undefined)
      throw new Error("value has invalid token subunit `" + unit + "'");
    const { tx, timestamp } = baseTx;
    const { body } = tx;
    const { messages, memo } = body;
    const msg = messages[0];
    const {
      auth_info: { fee },
    } = tx;
    return {
      amount: [new Amount(Number(value.replace(unit, "")), token)],
      fee: client.toInternalCoins(fee.amount),
      data: msg.value,
      sender: await reverseLookup(client, sender.value),
      id: baseTx.txhash,
      type: msg.typeUrl,
      time: new Date(timestamp),
      note: memo,
    };
  }

  static async fromSendBaseTx(
    client: StarnameClient,
    baseTx: StargateBaseTx<EncodeObject>,
    sender: string,
  ): Promise<Transaction> {
    const { tx, timestamp } = baseTx;
    const { body } = tx;
    const { messages, memo } = body;
    const message = messages[0];
    const { value } = message;
    const {
      auth_info: { fee },
    } = tx;
    if (!isMsgSendEncodeObject(message))
      throw new Error("cannot parse transaction");

    return {
      amount: client.toInternalCoins(value.amount),
      fee: client.toInternalCoins(fee.amount),
      data: await reverseLookup(client, value.to_address),
      sender: await reverseLookup(client, value.from_address),
      id: baseTx.txhash,
      type:
        sender === value.to_address ? TxType.Virtual.Receive : TxType.Bank.Send,
      note: memo,
      time: new Date(timestamp),
    };
  }

  static async fromRedelegateBaseTx(
    client: StarnameClient,
    baseTx: StargateBaseTx<EncodeObject>,
  ): Promise<Transaction> {
    const { tx, timestamp } = baseTx;
    const { body } = tx;
    const { messages, memo } = body;
    const message = messages[0];
    const { value } = message;
    const aminoMessage: AminoMsg = {
      type: message.typeUrl,
      value: message.value,
    };
    const {
      auth_info: { fee },
    } = tx;
    if (!isAminoMsgBeginRedelegate(aminoMessage)) {
      throw new Error("cannot parse transaction");
    }
    return {
      amount: client.toInternalCoins([value.amount]),
      fee: client.toInternalCoins(fee.amount),
      data: {
        src: await getValidator(client, value.validator_src_address),
        dst: await getValidator(client, value.validator_dst_address),
      },
      sender: await reverseLookup(client, value.delegator_address),
      id: baseTx.txhash,
      type: aminoMessage.type as AminoType,
      time: new Date(timestamp),
      note: memo,
    };
  }

  static async fromStakingBaseTx(
    client: StarnameClient,
    baseTx: StargateBaseTx<EncodeObject>,
  ): Promise<Transaction> {
    const { tx, timestamp } = baseTx;
    const { body } = tx;
    const { messages, memo } = body;
    const message = messages[0];
    const { value } = message;
    const {
      auth_info: { fee },
    } = tx;
    if (
      !isMsgDelegateEncodeObject(message) &&
      !isMsgUndelegateEncodeObject(message)
    ) {
      throw new Error("cannot parse transaction");
    }
    return {
      amount: client.toInternalCoins([value.amount]),
      fee: client.toInternalCoins(fee.amount),
      data: await getValidator(client, value.validator_address),
      sender: await reverseLookup(client, value.delegator_address),
      id: baseTx.txhash,
      type: message.typeUrl,
      time: new Date(timestamp),
      note: memo,
    };
  }

  static async fromCreateEscrowBaseTx(
    client: StarnameClient,
    baseTx: StargateBaseTx<EncodeObject>,
  ): Promise<Transaction> {
    const { tx, timestamp, logs } = baseTx;
    const {
      body,
      auth_info: { fee },
    } = tx;
    const { messages, memo } = body;
    const msg = messages[0];
    const { value } = msg;
    const starnameSellPrice = value.price[0];
    const token: TokenLike | undefined = client.getToken(
      starnameSellPrice.denom,
    );
    if (token === undefined)
      throw new Error(
        "price has invalid token subunit '" + starnameSellPrice.denom + "'",
      );
    const log = logs[0];
    const event = log.events.find((e) => e.type.includes("EventCreatedEscrow"));
    if (event === undefined)
      throw new Error("cant find escrow created event in tx");
    const idAttribute = event.attributes.find((attr) => attr.key === "id");
    if (idAttribute === undefined)
      throw new Error("cant find id attributed in create event in tx");
    return {
      amount: [new Amount(Number(starnameSellPrice.amount), token)],
      fee: client.toInternalCoins(fee.amount),
      data: value.object,
      seller: await reverseLookup(client, value.seller),
      id: baseTx.txhash,
      type: msg.typeUrl,
      escrowId: idAttribute.value.replace(/['"]+/g, ""),
      note: memo,
      time: new Date(timestamp),
      deadline: new Date(parseInt(value.deadline) * 1000),
    };
  }

  static async fromUpdateEscrowBaseTx(
    client: StarnameClient,
    baseTx: StargateBaseTx<EncodeObject>,
  ): Promise<Transaction> {
    const { tx, timestamp } = baseTx;
    const {
      body,
      auth_info: { fee },
    } = tx;
    const { messages, memo } = body;
    const msg = messages[0];
    const { value } = msg;
    let showcaseData = `#${value.id}`;
    try {
      const escrowObj = (await getEscrow(client, value.id)).object;
      showcaseData = client.escrowObjectToStarname(escrowObj);
    } catch (error) {
      console.warn("cant find escrow with id:" + value.id);
    }
    const starnameSellPrice = value.price[0];
    const token: TokenLike | undefined = client.getToken(
      starnameSellPrice.denom,
    );
    if (token === undefined)
      throw new Error(
        "price has invalid token subunit '" + starnameSellPrice.denom + "'",
      );
    return {
      amount: [new Amount(Number(starnameSellPrice.amount), token)],
      fee: client.toInternalCoins(fee.amount),
      data: showcaseData,
      seller: await reverseLookup(client, value.seller),
      id: baseTx.txhash,
      type: msg.typeUrl,
      note: memo,
      updater: await reverseLookup(client, value.updater),
      time: new Date(timestamp),
      deadline: new Date(parseInt(value.deadline) * 1000),
    };
  }

  static async fromRefundEscrowBaseTx(
    client: StarnameClient,
    baseTx: StargateBaseTx<EncodeObject>,
  ): Promise<Transaction> {
    const { tx, timestamp } = baseTx;
    const {
      body,
      auth_info: { fee },
    } = tx;
    const { messages, memo } = body;
    const msg = messages[0];
    const { value } = msg;
    return {
      amount: [Amount.fromValue(client, 0)],
      fee: client.toInternalCoins(fee.amount),
      data: value.id,
      sender: await reverseLookup(client, value.sender),
      id: baseTx.txhash,
      type: msg.typeUrl,
      note: memo,
      time: new Date(timestamp),
    };
  }

  static async fromTransferToEscrowBaseTx(
    client: StarnameClient,
    baseTx: StargateBaseTx<EncodeObject>,
  ): Promise<Transaction> {
    const { tx, timestamp } = baseTx;
    const {
      body,
      auth_info: { fee },
    } = tx;
    const { messages, memo } = body;
    const msg = messages[0];
    const { value } = msg;
    const transferAmount = value.amount[0];
    const token: TokenLike | undefined = client.getToken(transferAmount.denom);
    if (token === undefined)
      throw new Error(
        "price has invalid token subunit '" + transferAmount.denom + "'",
      );
    return {
      amount: [new Amount(Number(transferAmount.amount), token)],
      fee: client.toInternalCoins(fee.amount),
      data: `#${value.id}`,
      id: baseTx.txhash,
      type: msg.typeUrl,
      note: memo,
      time: new Date(timestamp),
      buyer: await reverseLookup(client, value.sender),
    };
  }
}
