import {
  GoogleAuthInfo,
  Signer,
  SignerState,
  TwoFactorAuthConfig,
} from "@iov/gdrive-custodian";

type VoidCallback = () => void;

const SignerUndefinedError = new Error(
  "signer is undefined, did you properly create this instance?",
);

export class GDriveCustodian {
  private authInfo?: GoogleAuthInfo;
  protected signer?: Signer;

  public initialized = false;

  public static create(
    googleClientID: string,
    mnemonicLength: 12 | 24,
    signAuthPath: string,
    twoFactorAuthConfig?: TwoFactorAuthConfig,
  ): GDriveCustodian {
    const custodian = new GDriveCustodian();
    custodian.signer = new Signer({
      authorization: {
        path: signAuthPath,
      },
      googleClientID: googleClientID,
      mnemonicLength: mnemonicLength,
      twoFactorAuthUrls: twoFactorAuthConfig,
    });
    custodian.initialized = true;
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

  public connect(): VoidCallback {
    const { signer } = this;
    if (signer === undefined) {
      throw SignerUndefinedError;
    }
    return signer.connect();
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
    if (!this.initialized) {
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
  /**
   * Call this to respond with a token (TOTP) to custodian in order to move forward with login 2FA flow
   * @param token - provided by user (i.e TOTP)
   */
  public authenticateWith2fa(token: string): Promise<void> {
    const { signer } = this;
    if (signer === undefined) {
      throw SignerUndefinedError;
    }
    return signer.authenticate2faUser(
      JSON.stringify({ idToken: this.getIdToken(), token }),
    );
  }

  /**
   * Utility function to validate with 2FA in delicate scenarios
   * This is not required at login flow (implicitly called there)
   * @param token
   * @returns boolean
   */
  public validateWith2fa(token: string): Promise<boolean> {
    const { signer } = this;
    if (signer === undefined) {
      throw SignerUndefinedError;
    }
    return signer.validate2faUser(
      JSON.stringify({ idToken: this.getIdToken(), token }),
    );
  }

  /**
   * Use this to setup authinfo when SignerState === Authenticated
   * @param authInfo
   */
  public setAuthInfo(authInfo: GoogleAuthInfo): void {
    this.authInfo = authInfo;
  }
}
