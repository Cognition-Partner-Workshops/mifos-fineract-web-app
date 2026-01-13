/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { OptionData } from './option-data.model';

export interface Currency {
  code: string;
  name: string;
  decimalPlaces?: number;
  inMultiplesOf?: number;
  displaySymbol?: string;
  nameCode?: string;
  displayLabel?: string;
}

export interface GLAccount {
  id: number;
  name: string;
  glCode: string;
  description: string;
  nameDecorated?: string;
  disabled: boolean;
  manualEntriesAllowed: boolean;
  type: OptionData;
  usage: OptionData;
  parentId?: number;
}

export interface AccountingMapping {
  id: number;
  name: string;
  glCode: string;
}

export interface ChargeToIncomeAccountMapping {
  charge: Charge;
  incomeAccount: AccountingMapping;
}

export interface PaymentChannelToFundSourceMapping {
  paymentType: PaymentType;
  fundSourceAccount: AccountingMapping;
}

export interface ChargeOffReasonToExpenseAccountMapping {
  chargeOffReasonCodeValueId?: number;
  writeOffReasonCodeValueId?: number;
  expenseAccountId?: number;
  reasonCodeValue?: CodeValue;
  writeOffReasonCodeValue?: CodeValue;
  expenseAccount?: AccountingMapping;
}

export interface AccountMapping {
  codeValueId?: number;
  glAccountId?: number;
  codeValue?: CodeValue;
  glAccount?: AccountingMapping;
}

export interface ClassificationToIncomeAccountMapping {
  classificationCodeValueId?: number;
  incomeAccountId?: number;
  classificationCodeValue?: CodeValue;
  incomeAccount?: AccountingMapping;
}

export interface CodeValue {
  active: boolean;
  description: string;
  id: number;
  mandatory: boolean;
  name: string;
  position?: number;
}

export interface PaymentType {
  id: number;
  name: string;
  isSystemDefined: boolean;
}

export interface PaymentTypeOption {
  id: number;
  name: string;
  description: string;
  isCashPayment: boolean;
  isSystemDefined: boolean;
  position: number;
}

export interface Charge {
  id: number;
  name: string;
  active?: boolean;
  penalty: boolean;
  freeWithdrawal?: boolean;
  freeWithdrawalChargeFrequency?: number;
  restartFrequency?: number;
  restartFrequencyEnum?: number;
  isPaymentType?: boolean;
  currency?: Currency;
  amount?: number;
  chargeTimeType?: OptionData;
  chargeAppliesTo?: OptionData;
  chargeCalculationType?: OptionData;
  chargePaymentMode?: OptionData;
}

export interface Note {
  id: number;
  clientId?: number;
  loanId?: number;
  savingsAccountId?: number;
  noteType: OptionData;
  note: string;
  createdById: number;
  createdByUsername: string;
  createdOn: number[];
  updatedById?: number;
  updatedByUsername?: string;
  updatedOn?: number[];
}

export interface NoteData {
  note: string;
}

export interface Document {
  id: number;
  parentEntityType: string;
  parentEntityId: number;
  name: string;
  fileName: string;
  size: number;
  type: string;
  description?: string;
  location?: string;
  storageType?: number;
}

export interface DocumentData {
  name: string;
  description?: string;
  file?: File;
}

export interface Staff {
  id: number;
  firstname: string;
  lastname: string;
  displayName: string;
  officeId: number;
  officeName: string;
  isLoanOfficer: boolean;
  isActive: boolean;
  joiningDate?: number[];
  externalId?: string;
  mobileNo?: string;
  organisationalRoleParentStaffId?: number;
  organisationalRoleParentStaff?: Staff;
}

export interface Office {
  id: number;
  name: string;
  nameDecorated?: string;
  externalId?: string;
  openingDate: number[];
  hierarchy?: string;
  parentId?: number;
  parentName?: string;
}

export interface Fund {
  id: number;
  name: string;
  externalId?: string;
}

export interface Datatable {
  applicationTableName: string;
  registeredTableName: string;
  columnHeaderData: DatatableColumn[];
}

export interface DatatableColumn {
  columnName: string;
  columnType: string;
  columnLength?: number;
  columnDisplayType: string;
  isColumnNullable: boolean;
  isColumnPrimaryKey: boolean;
  columnValues?: OptionData[];
}

export interface DatatableData {
  [key: string]: string | number | boolean | null;
}

export interface ApiResponse<T> {
  resourceId?: number;
  officeId?: number;
  clientId?: number;
  loanId?: number;
  savingsId?: number;
  groupId?: number;
  changes?: Partial<T>;
}

export interface PagedResponse<T> {
  totalFilteredRecords: number;
  pageItems: T[];
}

export interface CollateralData {
  type: {
    collateralId: number;
    name?: string;
  };
  value: number;
  description?: string;
}

export interface GuarantorData {
  guarantorType: OptionData;
  clientRelationshipType?: OptionData;
  firstname?: string;
  lastname?: string;
  entityId?: number;
  externalId?: string;
  officeName?: string;
  savingsId?: number;
  amount?: number;
  status?: string;
}

export interface ChargeData {
  chargeId: number;
  amount: number;
  dueDate?: string;
  feeOnMonthDay?: string;
  feeInterval?: number;
  id?: number;
}

export interface TransactionData {
  transactionDate: string;
  transactionAmount: number;
  paymentTypeId?: number;
  accountNumber?: string;
  checkNumber?: string;
  routingCode?: string;
  receiptNumber?: string;
  bankNumber?: string;
  note?: string;
  locale: string;
  dateFormat: string;
}

export interface ForeclosureData {
  command: string;
  dateFormat: string;
  locale: string;
  transactionDate: string;
}

export interface SmsMessageFilter {
  id: string | number;
  status: string | number;
  locale: string;
  dateFormat: string;
  fromDate?: string;
  toDate?: string;
}
