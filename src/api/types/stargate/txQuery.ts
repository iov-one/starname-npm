import { TxType } from "starnameRegistry";

export interface StargateTxQuery {
  parameters: {
    message: {
      module: "starname" | "bank";
    };
    transfer?: {
      recipient?: string;
      sender?: string;
    };
  };
  type: string;
}

const queries = [
  (address: string): StargateTxQuery => {
    return {
      parameters: {
        message: {
          module: "bank",
        },
        transfer: {
          recipient: address,
        },
      },
      type: TxType.Virtual.Receive,
    };
  },
  (address: string): any => {
    return {
      parameters: {
        message: {
          module: "bank",
        },
        transfer: {
          sender: address,
        },
      },
      type: TxType.Bank.Send,
    };
  },
  (address: string): any => {
    return {
      parameters: {
        message: {
          module: "starname",
        },
        transfer: {
          sender: address,
        },
      },
      type: TxType.Virtual.GenericStarname,
    };
  },
  (address: string): any => {
    return {
      parameters: {
        message: {
          module: "staking",
          sender: address,
        },
      },
      type: TxType.Virtual.GenericDelegation,
    };
  },
];

export default queries;
