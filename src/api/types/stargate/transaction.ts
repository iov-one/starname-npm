import { AminoMsg } from "@cosmjs/amino";
import { EncodeObject } from "@cosmjs/proto-signing";
import {
  isAminoMsgBeginRedelegate,
  isMsgDelegateEncodeObject,
  isMsgSendEncodeObject,
  isMsgUndelegateEncodeObject,
} from "@cosmjs/stargate";
import { Attribute, Event, Log } from "@cosmjs/stargate/build/logs";
import api from "api";
import { StargateBaseTx } from "api/types/stargate/searchTxResponse";
import { TxType } from "starnameRegistry";
import { AminoType } from "types/aminoTypes";
import { Amount } from "types/amount";
import { TokenLike } from "types/tokenLike";
import { Transaction } from "types/transaction";
import { getValidator, reverseLookup } from "utils/getTransaction";

export class StargateTransaction {
  static async fromStarnameBaseTx(
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
    const token: TokenLike | undefined = api.getToken(unit);
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
      fee: api.toInternalCoins(fee.amount),
      data: msg.value,
      sender: await reverseLookup(sender.value),
      id: baseTx.txhash,
      type: msg.typeUrl,
      time: new Date(timestamp),
      note: memo,
    };
  }

  static async fromSendBaseTx(
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
      amount: api.toInternalCoins(value.amount),
      fee: api.toInternalCoins(fee.amount),
      data: await reverseLookup(value.to_address),
      sender: await reverseLookup(value.from_address),
      id: baseTx.txhash,
      type:
        sender === value.to_address ? TxType.Virtual.Receive : TxType.Bank.Send,
      note: memo,
      time: new Date(timestamp),
    };
  }

  static async fromRedelegateBaseTx(
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
      amount: api.toInternalCoins([value.amount]),
      fee: api.toInternalCoins(fee.amount),
      data: {
        src: await getValidator(value.validator_src_address),
        dst: await getValidator(value.validator_dst_address),
      },
      sender: await reverseLookup(value.delegator_address),
      id: baseTx.txhash,
      type: aminoMessage.type as AminoType,
      time: new Date(timestamp),
      note: memo,
    };
  }

  static async fromStakingBaseTx(
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
      amount: api.toInternalCoins([value.amount]),
      fee: api.toInternalCoins(fee.amount),
      data: await getValidator(value.validator_address),
      sender: await reverseLookup(value.delegator_address),
      id: baseTx.txhash,
      type: message.typeUrl,
      time: new Date(timestamp),
      note: memo,
    };
  }
}
