import { TxType } from "../../../starnameRegistry";

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

export const defaultTxQueries = [
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
  (address: string): any => {
    return {
      parameters: {
        message: {
          module: "distribution",
        },
        transfer: {
          recipient: address,
        },
      },
      type: TxType.Distribution.WithdrawDelegatorReward,
    };
  },
  (address: string): any => {
    return {
      parameters: {
        message: {
          action: TxType.Escrow.CreateEscrow,
          sender: address,
        },
      },
      type: TxType.Escrow.CreateEscrow,
    };
  },
  (address: string): any => {
    return {
      parameters: {
        message: {
          action: TxType.Escrow.UpdateEscrow,
          sender: address,
        },
      },
      type: TxType.Escrow.UpdateEscrow,
    };
  },
  (address: string): any => {
    return {
      parameters: {
        message: {
          action: TxType.Escrow.RefundEscrow,
          sender: address,
        },
      },
      type: TxType.Escrow.RefundEscrow,
    };
  },
  (address: string): any => {
    return {
      parameters: {
        message: {
          action: TxType.Escrow.TransferToEscrow,
        },
        transfer: {
          recipient: address,
        },
      },
      type: TxType.Escrow.TransferToEscrow,
    };
  },
];
