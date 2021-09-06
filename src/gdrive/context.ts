import React from "react";
import { GDriveCustodian } from "signers/gdrive/custodian";

export const GDriveCustodianContext: React.Context<GDriveCustodian> =
  React.createContext<GDriveCustodian>(new GDriveCustodian());
