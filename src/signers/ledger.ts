import {
  AminoSignResponse,
  encodeSecp256k1Signature,
  serializeSignDoc,
  StdSignDoc,
} from "@cosmjs/amino";
import { fromBase64 } from "@cosmjs/encoding";
import { AccountData, OfflineSigner } from "@cosmjs/proto-signing";
import {
  IovLedgerApp,
  IovLedgerAppAddress,
  IovLedgerAppErrorState,
  isIovLedgerAppAddress,
  isIovLedgerAppSignature,
} from "@iov/ledger-iovns";
import Transport from "@ledgerhq/hw-transport";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { signatureImport } from "secp256k1";
import { MismatchedAddressError, Signer } from "signers/signer";
import { SignerType } from "signers/signerType";

export const DeviceNotConnected = new Error(
  "Please make sure your device is connected, and you have opened the IOV application.",
);
const DEFAULT_ADDRESS_INDEX = 0;
type SignResult = IovLedgerAppAddress | IovLedgerAppErrorState;

export class LedgerSigner implements Signer {
  private ledger: IovLedgerApp | null = null;
  private addressInfo: IovLedgerAppAddress | null = null;
  private chainId = "";
  private transport: Transport | null = null;

  private onSignStartedListener: VoidFunction = () => {};
  private onSignEndedListener: VoidFunction = () => {};

  public type: SignerType = SignerType.Ledger;

  public async initialize(chainId: string, confirm = false): Promise<boolean> {
    const transport: Transport = await TransportWebUSB.create();
    const ledger: IovLedgerApp = new IovLedgerApp(transport);
    const result: IovLedgerAppAddress | IovLedgerAppErrorState =
      await ledger.getAddress(DEFAULT_ADDRESS_INDEX, confirm);
    this.transport = transport;
    this.chainId = chainId;
    if (isIovLedgerAppAddress(result)) {
      this.addressInfo = result;
      this.ledger = ledger;
      // Connect event listeners
      transport.on("disconnect", LedgerSigner.onDisconnect);
    } else {
      await transport.close();
      if (result.returnCode === 28161) {
        throw DeviceNotConnected;
      } else {
        throw new Error(result.errorMessage);
      }
    }
    return true;
  }

  private static onDisconnect(error: any): void {
    if (error.name === "DisconnectedDevice") {
      /* toast.show(locales.LEDGER_DEVICE_DISCONNECTED, ToastType.Error);
      document.dispatchEvent(LogoutEvent);*/
    } else {
      console.warn(error);
    }
  }

  public async getPublicKey(): Promise<string> {
    const { addressInfo } = this;
    if (addressInfo === null) return "";
    const { pubkey } = addressInfo;
    const buffer: Buffer = Buffer.from(pubkey);
    return buffer.toString("base64");
  }

  public async getAddress(): Promise<string> {
    const { addressInfo } = this;
    if (addressInfo === null) return "";
    return addressInfo.address;
  }

  private static makeSignBytes(signable: StdSignDoc): Uint8Array {
    return serializeSignDoc(signable);
  }

  public async signAmino(
    signerAddress: string,
    signDoc: StdSignDoc,
  ): Promise<AminoSignResponse> {
    const { ledger, addressInfo } = this;
    if (addressInfo === null || ledger === null)
      throw new Error("ledger signer not initialized yet");
    const { pubkey } = addressInfo;
    this.onSignStartedListener();
    try {
      const bytes = LedgerSigner.makeSignBytes(signDoc);
      const result: SignResult = await ledger.sign(
        DEFAULT_ADDRESS_INDEX,
        String.fromCharCode(...bytes),
      );
      if (isIovLedgerAppSignature(result)) {
        const signature = encodeSecp256k1Signature(
          pubkey,
          signatureImport(result.signature),
        );

        return {
          signed: signDoc,
          signature: signature,
        };
      } else {
        throw result;
      }
    } finally {
      this.onSignEndedListener();
    }
  }

  public async getAccounts(): Promise<readonly AccountData[]> {
    return [
      {
        address: await this.getAddress(),
        algo: "secp256k1",
        pubkey: fromBase64(await this.getPublicKey()),
      },
    ];
  }

  public disconnect(): void {
    const { transport } = this;
    // Remove the disconnect listener
    if (transport !== null) {
      transport.off("disconnect", LedgerSigner.onDisconnect);
      void transport.close();
    }
  }

  public async signAlephMessage(
    signerAddress: string,
    signDoc: StdSignDoc,
  ): Promise<AminoSignResponse> {
    if ((await this.getAddress()) !== signerAddress) {
      throw MismatchedAddressError;
    }
    return this.signAmino(signerAddress, signDoc);
  }

  public getOfflineSigner(): OfflineSigner {
    return this;
  }

  public setOnSignListeners(
    onStart: VoidFunction,
    onEnd: VoidFunction,
  ): VoidFunction {
    this.onSignStartedListener = onStart;
    this.onSignEndedListener = onEnd;

    return (): void => {
      this.onSignStartedListener = () => {};
      this.onSignEndedListener = () => {};
    };
  }
}
