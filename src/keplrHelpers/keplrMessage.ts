import { AccAddress } from "@chainapsis/cosmosjs/common/address";
import { Msg } from "@chainapsis/cosmosjs/core/tx";
import { makeSignDoc, serializeSignDoc } from "@cosmjs/amino";
import { Msg as CosmjsMsg, StdFee } from "@cosmjs/launchpad";

export class KeplrMsg extends Msg {
  private readonly messages: CosmjsMsg;
  private readonly fee: StdFee;
  private readonly chainId: string;
  private readonly memo: string;
  private readonly accountNumber: string;
  private readonly sequence: string;
  private readonly signer: AccAddress;

  constructor(
    signer: AccAddress,
    sourceMsg: CosmjsMsg,
    fee: StdFee,
    chainId: string,
    memo: string,
    accountNumber: string,
    sequence: string,
  ) {
    super();
    this.signer = signer;
    this.messages = sourceMsg;
    this.fee = fee;
    this.chainId = chainId;
    this.memo = memo;
    this.accountNumber = accountNumber;
    this.sequence = sequence;
  }

  public getSignBytes = (): Uint8Array => {
    return serializeSignDoc(
      makeSignDoc(
        [this.messages],
        this.fee,
        this.chainId,
        this.memo,
        this.accountNumber,
        this.sequence,
      ),
    );
  };

  public getSigners = (): AccAddress[] => {
    return [this.signer];
  };

  public validateBasic(): void {}
}
