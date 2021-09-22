import { GoogleAuthInfo, Signer, SignerState } from "@iov/gdrive-custodian";

type VoidCallback = () => void;

const SignerUndefinedError = new Error(
  "signer is undefined, did you properly create this instance?",
);

export class GDriveCustodian {
  private authInfo?: GoogleAuthInfo;
  protected signer?: Signer;

  public initialized = true;

  public static create(
    googleClientID: string,
    mnemonicLength: 12 | 24,
    signAuthPath: string,
  ): GDriveCustodian {
    const custodian = new GDriveCustodian();
    custodian.signer = new Signer({
      authorization: {
        path: signAuthPath,
      },
      googleClientID: googleClientID,
      mnemonicLength: mnemonicLength,
    });
    custodian.initialized = false;
    return custodian;
  }

  public attach(): Promise<void> {
    const { signer } = this;
    if (signer === undefined) {
      throw SignerUndefinedError;
    }
    return signer.attach();
  }

  public setStateChangeListener(
    listener: (state: SignerState, data?: any) => void,
  ): void {
    const { signer } = this;
    if (signer === undefined) {
      throw SignerUndefinedError;
    }
    signer.setStateChangeListener(listener);
  }

  public removeStateChangeListener(): void {
    const { signer } = this;
    if (signer === undefined) {
      throw SignerUndefinedError;
    }
    signer.removeStateChangeListener();
  }

  public connect(button: HTMLElement): VoidCallback {
    const { signer } = this;
    if (signer === undefined) {
      throw SignerUndefinedError;
    }
    return signer.connect(button);
  }

  public detach(): void {
    const { signer } = this;
    if (signer === undefined) {
      throw SignerUndefinedError;
    }
    return signer.detach();
  }

  public getSigner(): Signer {
    const { signer } = this;
    if (signer === undefined) {
      throw SignerUndefinedError;
    }
    return signer;
  }

  public getIdToken(): string {
    if (this.initialized) {
      throw new Error("it's the default thing, why do we actually need it?");
    }
    const { authInfo } = this;
    if (authInfo !== undefined) {
      const { accessToken } = authInfo;
      return accessToken.idToken;
    } else {
      throw new Error("did you sign in with google?");
    }
  }

  public setAuthInfo(authInfo: GoogleAuthInfo): void {
    this.authInfo = authInfo;
  }
}
