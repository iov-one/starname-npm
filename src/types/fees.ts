export interface Fees {
  feeCoinDenom: string;
  feeCoinPrice: number;
  feeDefault: number;
  registerAccountClosed: number;
  registerAccountOpen: number;
  transferAccountClosed: number;
  transferAccountOpen: number;
  replaceAccountResources: number;
  addAccountCertificate: number;
  delAccountCertificate: number;
  setAccountMetadata: number;
  registerDomain1: number;
  registerDomain2: number;
  registerDomain3: number;
  registerDomain4: number;
  registerDomain5: number;
  registerDomainDefault: number;
  registerOpenDomainMultiplier: number;
  transferDomainClosed: number;
  transferDomainOpen: number;
  renewDomainOpen: number;
  createEscrow: number;
  updateEscrow: number;
  transferToEscrow: number;
  refundEscrow: number;
}

export interface ApiFees {
  fee_coin_denom: string;
  fee_coin_price: string;
  fee_default: string;
  register_account_closed: string;
  register_account_open: string;
  transfer_account_closed: string;
  transfer_account_open: string;
  replace_account_resources: string;
  add_account_certificate: string;
  del_account_certificate: string;
  set_account_metadata: string;
  register_domain_1: string;
  register_domain_2: string;
  register_domain_3: string;
  register_domain_4: string;
  register_domain_5: string;
  register_domain_default: string;
  register_open_domain_multiplier: string;
  transfer_domain_closed: string;
  transfer_domain_open: string;
  renew_domain_open: string;
  create_escrow: string;
  update_escrow: string;
  transfer_to_escrow: string;
  refund_escrow: string;
}

export interface FeesResponse {
  height: number;
  result: {
    fees: ApiFees;
  };
}

export const transformFeesResponse = (fees: ApiFees): Fees => ({
  feeCoinDenom: fees.fee_coin_denom,
  feeCoinPrice: Number(fees.fee_coin_price),
  feeDefault: Number(fees.fee_default),
  registerAccountClosed: Number(fees.register_account_closed),
  registerAccountOpen: Number(fees.register_account_open),
  transferAccountClosed: Number(fees.transfer_account_closed),
  transferAccountOpen: Number(fees.transfer_account_open),
  replaceAccountResources: Number(fees.replace_account_resources),
  addAccountCertificate: Number(fees.add_account_certificate),
  delAccountCertificate: Number(fees.del_account_certificate),
  setAccountMetadata: Number(fees.set_account_metadata),
  registerDomain1: Number(fees.register_domain_1),
  registerDomain2: Number(fees.register_domain_2),
  registerDomain3: Number(fees.register_domain_3),
  registerDomain4: Number(fees.register_domain_4),
  registerDomain5: Number(fees.register_domain_5),
  registerDomainDefault: Number(fees.register_domain_default),
  registerOpenDomainMultiplier: Number(fees.register_open_domain_multiplier),
  transferDomainClosed: Number(fees.transfer_domain_closed),
  transferDomainOpen: Number(fees.transfer_account_open),
  renewDomainOpen: Number(fees.renew_domain_open),
  createEscrow: Number(fees.create_escrow),
  updateEscrow: Number(fees.update_escrow),
  transferToEscrow: Number(fees.transfer_to_escrow),
  refundEscrow: Number(fees.refund_escrow),
});
