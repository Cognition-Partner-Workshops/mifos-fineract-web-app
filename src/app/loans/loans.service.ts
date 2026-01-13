/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';
import { Dates } from 'app/core/utils/dates';
import { SettingsService } from 'app/settings/settings.service';
import { DisbursementData } from './models/loan-account.model';
import {
  NoteData,
  DatatableData,
  GuarantorData,
  CollateralData,
  ChargeData,
  ForeclosureData
} from 'app/shared/models/general.model';

/**
 * Loans service.
 */
@Injectable({
  providedIn: 'root'
})
export class LoansService {
  private http = inject(HttpClient);
  private settingsService = inject(SettingsService);
  private dateUtils = inject(Dates);

  /**
   * @param {string} loanId loanId of the loan.
   * @returns {Observable<any>}
   */
  getLoanChargeTemplateResource(loanId: string): Observable<any> {
    return this.http.get(`/loans/${loanId}/charges/template`);
  }

  getLoanActionTemplate(loanId: string, command: string): Observable<any> {
    let httpParams = new HttpParams().set('command', command);
    // Add associations for specific commands that need delinquency data
    if (command === 'disburse' || command === 'disbursetosavings') {
      httpParams = httpParams.set('associations', 'delinquency');
    }

    return this.http.get(`/loans/${loanId}/transactions/template`, { params: httpParams });
  }

  getLoanTransactionActionTemplate(loanId: string, command: string, transactionId: string): Observable<any> {
    const httpParams = new HttpParams().set('command', command).set('transactionId', transactionId);
    return this.http.get(`/loans/${loanId}/transactions/template`, { params: httpParams });
  }

  getLoanPrepayLoanActionTemplate(loanId: string, transactionDate: string): Observable<any> {
    if (!transactionDate) {
      transactionDate = this.dateUtils.formatDate(this.settingsService.businessDate, this.settingsService.dateFormat);
    }
    const httpParams = new HttpParams()
      .set('command', 'prepayLoan')
      .set('transactionDate', transactionDate)
      .set('locale', this.settingsService.language.code)
      .set('dateFormat', this.settingsService.dateFormat);
    return this.http.get(`/loans/${loanId}/transactions/template`, { params: httpParams });
  }

  getLoanForeclosureActionTemplate(loanId: string): Observable<any> {
    const httpParams = new HttpParams()
      .set('command', 'foreclosure')
      .set('locale', this.settingsService.language.code)
      .set('dateFormat', this.settingsService.dateFormat)
      .set(
        'transactionDate',
        this.dateUtils.formatDate(this.settingsService.businessDate, this.settingsService.dateFormat)
      );
    return this.http.get(`/loans/${loanId}/transactions/template`, { params: httpParams });
  }

  getLoanAccountResource(loanId: string, associations: string): Observable<any> {
    const httpParams = new HttpParams().set('associations', associations);
    return this.http.get(`/loans/${loanId}`, { params: httpParams });
  }

  getGuarantorTemplate(loanId: string): Observable<any> {
    return this.http.get(`/loans/${loanId}/guarantors/template`);
  }

  createNewGuarantor(loanId: string, data: GuarantorData): Observable<unknown> {
    return this.http.post(`/loans/${loanId}/guarantors`, data);
  }

  deleteGuarantor(loanId: string | number, guarantorId: string | number): Observable<unknown> {
    return this.http.delete(`/loans/${loanId}/guarantors/${guarantorId}`);
  }

  deleteLoanAccount(loanId: string | number): Observable<unknown> {
    return this.http.delete(`/loans/${loanId}`);
  }

  getDelinquencyTags(loanId: string): Observable<any> {
    return this.http.get(`/loans/${loanId}/delinquencytags`);
  }

  getDelinquencyData(loanId: string) {
    const httpParams = new HttpParams().set('associations', 'collection').set('exclude', 'guarantors,futureSchedule');
    return this.http.get(`/loans/${loanId}`, { params: httpParams });
  }

  /**
   * Get Loan Delinquency Data for template usage
   * @param {string} loanId Loan Id
   * @returns {Observable<any>}
   */
  getLoanDelinquencyDataForTemplate(loanId: string): Observable<any> {
    const httpParams = new HttpParams().set('associations', 'delinquency');
    return this.http.get(`/loans/${loanId}`, { params: httpParams });
  }

  getDelinquencyActions(loanId: string) {
    return this.http.get(`/loans/${loanId}/delinquency-actions`);
  }

  createDelinquencyActions(loanId: string, delinquencyActions: any) {
    return this.http.post(`/loans/${loanId}/delinquency-actions`, delinquencyActions);
  }

  getDeferredIncomeData(loanId: string) {
    return this.http.get(`/loans/${loanId}/deferredincome`);
  }

  getBuyDownFeeData(loanId: string): Observable<any> {
    return this.http.get(`/loans/${loanId}/buydown-fees`);
  }

  /**
   * Returns the loan template data with specific condition
   * @param loanId Loan Id
   */
  getLoanTemplate(loanId: string): Observable<any> {
    const httpParams = new HttpParams()
      .set('fields', 'id,loanOfficerId,loanOfficerOptions')
      .set('staffInSelectedOfficeOnly', 'true')
      .set('template', 'true');
    return this.http.get(`/loans/${loanId}`, { params: httpParams });
  }

  /**
   * @param {any} loanCharge to apply on a Loan Account.
   * @returns {Observable<any>}
   */
  createLoanCharge(loanId: string, resourceType: string, loanCharge: any): Observable<any> {
    return this.http.post(`/loans/${loanId}/${resourceType}`, loanCharge);
  }

  /**
   * Get Loan Account Details
   * @param loanId Loan Id
   */
  getLoanAccountDetails(loanId: string): Observable<any> {
    return this.http.get(`/loans/${loanId}`);
  }

  /**
   * Get collateral template.
   * @param {string} loanId Loan Id.
   * @returns {Observable<any>}
   */
  getLoanCollateralTemplate(loanId: string): Observable<any> {
    return this.http.get(`/loans/${loanId}/collaterals/template`);
  }

  /**
   * Get collaterals.
   * @param {string} loanId Loan Id.
   * @returns {Observable<any>}
   */
  getLoanCollaterals(loanId: string): Observable<any> {
    return this.http.get(`/loans/${loanId}/collaterals`);
  }

  /**
   * Create Loan Collateral.
   * @param {string} loanId Loan Id.
   * @param {CollateralData} collateralData Collateral Data.
   * @returns {Observable<unknown>}
   */
  createLoanCollateral(loanId: string, collateralData: CollateralData): Observable<unknown> {
    return this.http.post(`/loans/${loanId}/collaterals`, collateralData);
  }

  /**
   * Get Loans details with httpParams
   * @param loanId Loan ID
   */
  getLoanAccountAssociationDetails(loanId: string) {
    const httpParams = new HttpParams().set('associations', 'all').set('exclude', 'guarantors,futureSchedule');
    return this.http.get(`/loans/${loanId}`, { params: httpParams });
  }

  getApproveAssociationsDetails(loanId: string | number): Observable<unknown> {
    const httpParams = new HttpParams().set('associations', 'multiDisburseDetails');
    return this.http.get(`/loans/${loanId}`, { params: httpParams });
  }
  /**
   * @param loanId Loan Id
   * @returns The notes for particular loan
   */
  getLoanNotes(loanId: string): Observable<unknown> {
    return this.http.get(`/loans/${loanId}/notes`);
  }

  /**
   * Adds a note to the particular Loan Id
   * @param loanId Loan ID
   * @param noteData Note Data to be added
   * @returns {Observable<unknown>}
   */
  createLoanNote(loanId: string, noteData: NoteData): Observable<unknown> {
    return this.http.post(`/loans/${loanId}/notes`, noteData);
  }

  /**
   * Edits the Loan Note
   * @param loanId Loan ID
   * @param noteId Note ID
   * @param noteData Note Data
   */
  editLoanNote(loanId: string, noteId: string, noteData: NoteData): Observable<unknown> {
    return this.http.put(`/loans/${loanId}/notes/${noteId}`, noteData);
  }

  /**
   * Deletes the particular Note
   * @param loanId Loan ID
   * @param noteId Note ID
   */
  deleteLoanNote(loanId: string, noteId: string): Observable<unknown> {
    return this.http.delete(`/loans/${loanId}/notes/${noteId}`);
  }

  /**
   * Used For: Close Action, Prepay Loan Action
   * Returns the response of the action
   * @param loanId Loan Id
   * @param data Data
   * @param command Command
   */
  submitLoanActionButton(loanId: string, data: Record<string, unknown>, command: string): Observable<unknown> {
    const httpParams = new HttpParams().set('command', command);
    return this.http.post(`/loans/${loanId}/transactions`, data, { params: httpParams });
  }

  /**
   * Get Re-Age preview with repayment schedule
   * @param loanId Loan Id
   * @param data Re-Age data
   * @returns Observable with repayment schedule preview
   */
  getReAgePreview(
    loanId: string,
    data: Record<string, string | number | boolean | null | undefined>
  ): Observable<unknown> {
    let httpParams = new HttpParams();

    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        httpParams = httpParams.set(key, data[key]!.toString());
      }
    });

    return this.http.get(`/loans/${loanId}/transactions/reage-preview`, { params: httpParams });
  }

  /**
   * Get Re-Amortize preview with repayment schedule
   * @param loanId Loan Id
   * @param data Re-Amortize data
   * @returns Observable with repayment schedule preview
   */
  getReAmortizePreview(
    loanId: string,
    data: Record<string, string | number | boolean | null | undefined>
  ): Observable<unknown> {
    let httpParams = new HttpParams();

    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        httpParams = httpParams.set(key, data[key]!.toString());
      }
    });

    return this.http.get(`/loans/${loanId}/transactions/reamortization-preview`, { params: httpParams });
  }

  getLoanScreenReportsData(): Observable<unknown> {
    const httpParams = new HttpParams().set('entityId', '1').set('typeId', '0');
    return this.http.get(`/templates`, { params: httpParams });
  }

  /**
   * Get Loan Datatables
   */
  getLoanDataTables(): Observable<unknown> {
    const httpParams = new HttpParams().set('apptable', 'm_loan');
    return this.http.get(`/datatables`, { params: httpParams });
  }

  /**
   * Get Loan Datatable
   * @param loanId Loan ID
   * @param datatableName Datatable Name
   */
  getLoanDatatable(loanId: string, datatableName: string): Observable<unknown> {
    const httpParams = new HttpParams().set('genericResultSet', 'true');
    return this.http.get(`/datatables/${datatableName}/${loanId}`, { params: httpParams });
  }

  /**
   * @param loanId Loan Id of loan to get add datatable entry for.
   * @param datatableName Data Table name.
   * @param data Data.
   * @returns {Observable<unknown>}
   */
  addLoanDatatableEntry(loanId: string, datatableName: string, data: DatatableData): Observable<unknown> {
    const httpParams = new HttpParams().set('genericResultSet', 'true');
    return this.http.post(`/datatables/${datatableName}/${loanId}`, data, { params: httpParams });
  }

  /**
   * @param loanId Loan Id of loan to get add datatable entry for.
   * @param datatableName Data Table name.
   * @param data Data.
   * @returns {Observable<unknown>}
   */
  editLoanDatatableEntry(loanId: string, datatableName: string, data: DatatableData): Observable<unknown> {
    const httpParams = new HttpParams().set('genericResultSet', 'true');
    return this.http.put(`/datatables/${datatableName}/${loanId}`, data, { params: httpParams });
  }

  /**
   * @param loanId Loan Id of loan to get add datatable entry for.
   * @param datatableName Data Table name.
   * @returns {Observable<unknown>}
   */
  deleteDatatableContent(loanId: string, datatableName: string): Observable<unknown> {
    const httpParams = new HttpParams().set('genericResultSet', 'true');
    return this.http.delete(`/datatables/${datatableName}/${loanId}`, { params: httpParams });
  }

  /**
   * @param {string | number} loanId Loan Id.
   * @param {string} command Command.
   * @param {Record<string, unknown>} data Data.
   * @returns {Observable<unknown>}
   */
  loanActionButtons(loanId: string | number, command: string, data?: Record<string, unknown>): Observable<unknown> {
    const httpParams = new HttpParams().set('command', command);
    return this.http.post(`/loans/${loanId}`, data, { params: httpParams });
  }

  addInterestPauseToLoan(loanId: string | number, data?: Record<string, unknown>): Observable<unknown> {
    return this.http.post(`/loans/${loanId}/interest-pauses`, data);
  }

  getInterestPausesOfLoan(loanId: string | number): Observable<unknown> {
    return this.http.get(`/loans/${loanId}/interest-pauses`);
  }

  updateInterestPause(loanId: number, variationId: number, data?: Record<string, unknown>): Observable<unknown> {
    return this.http.put(`/loans/${loanId}/interest-pauses/${variationId}`, data);
  }

  deleteInterestPause(loanId: number, variationId: number): Observable<unknown> {
    return this.http.delete(`/loans/${loanId}/interest-pauses/${variationId}`);
  }

  /**
   * @param {string|number} loanId Loan Id.
   * @param {ForeclosureData} foreclosuredata ForeClosure Data
   */
  getForeclosureData(loanId: string | number, foreclosuredata: ForeclosureData): Observable<unknown> {
    const httpParams = new HttpParams()
      .set('command', foreclosuredata.command)
      .set('dateFormat', foreclosuredata.dateFormat)
      .set('locale', foreclosuredata.locale)
      .set('transactionDate', foreclosuredata.transactionDate);
    return this.http.get(`/loans/${loanId}/transactions/template`, { params: httpParams });
  }

  /**
   * @param {string|number} loanId Loan Id
   * @param {Record<string, unknown>} data Data
   */
  loanForclosureData(loanId: string | number, data: Record<string, unknown>): Observable<unknown> {
    const httpParams = new HttpParams().set('command', 'foreclosure');
    return this.http.post(`/loans/${loanId}/transactions`, data, { params: httpParams });
  }

  /**
   * @param {string|number} loanId Loan Id
   * @param {Record<string, unknown>} data Data
   */
  editDisbursements(loanId: string | number, data: Record<string, unknown>): Observable<unknown> {
    return this.http.put(`/loans/${loanId}/disbursements/editDisbursements`, data);
  }

  /**
   * Returns the Reschedule Loans Template
   */
  rescheduleLoanTemplate(): Observable<unknown> {
    return this.http.get('/rescheduleloans/template');
  }

  /**
   * Returns the Loan Reschedule request
   */
  loanRescheduleRequests(loanId: string | number): Observable<unknown> {
    const httpParams = new HttpParams().set('loanId', loanId.toString());
    return this.http.get('/rescheduleloans', { params: httpParams });
  }

  /**
   * Returns the Loan Reschedule request
   */
  applyCommandLoanRescheduleRequests(
    rescheduleId: string | number,
    command: string,
    data: Record<string, unknown>
  ): Observable<unknown> {
    const httpParams = new HttpParams().set('command', command);
    return this.http.post(`/rescheduleloans/${rescheduleId}`, data, { params: httpParams });
  }

  /**
   * Submits Reschedule Data
   * @param {Record<string, unknown>} data Data
   */
  submitRescheduleData(data: Record<string, unknown>): Observable<unknown> {
    const httpParams = new HttpParams().set('command', 'reschedule');
    return this.http.post('/rescheduleloans', data, { params: httpParams });
  }

  /**
   * Gets Loan Account Template
   * @param {string | number} entityId Client or Group ID
   * @param {boolean} isGroup Whether the entity is a group
   * @param {string | number} productId Product ID
   */
  getLoansAccountTemplateResource(
    entityId: string | number,
    isGroup: boolean,
    productId?: string | number
  ): Observable<unknown> {
    let httpParams = new HttpParams().set('activeOnly', 'true').set('staffInSelectedOfficeOnly', 'true');
    httpParams = productId ? httpParams.set('productId', productId.toString()) : httpParams;
    httpParams = isGroup
      ? httpParams.set('groupId', entityId.toString()).set('templateType', 'group')
      : httpParams.set('clientId', entityId.toString()).set('templateType', 'individual');
    return this.http.get('/loans/template', { params: httpParams });
  }

  getLoansAccountAndTemplateResource(loanId: string | number): Observable<unknown> {
    const httpParams = new HttpParams()
      .set('associations', 'charges,collateral,meeting,multiDisburseDetails')
      .set('staffInSelectedOfficeOnly', 'true')
      .set('template', 'true');
    return this.http.get(`/loans/${loanId}`, { params: httpParams });
  }

  /**
   * Get Loans Collateral Template
   * @param {string | number} productId Product ID
   */
  getLoansCollateralTemplateResource(productId: string | number): Observable<unknown> {
    const httpParams = new HttpParams()
      .set('fields', 'id, loanCollateralOptions')
      .set('productId', productId.toString())
      .set('templateType', 'collateral');
    return this.http.get('/loans/template', { params: httpParams });
  }

  /**
   * Creates Loans Account
   * @param {Record<string, unknown>} loanAccount Loan Account
   */
  createLoansAccount(loanAccount: Record<string, unknown>): Observable<unknown> {
    return this.http.post('/loans', loanAccount);
  }

  getLoanDocuments(loanId: string | number): Observable<unknown> {
    return this.http.get(`/loans/${loanId}/documents`);
  }

  downloadLoanDocument(parentEntityId: string, documentId: string): Observable<Blob> {
    return this.http.get(`/loans/${parentEntityId}/documents/${documentId}/attachment`, { responseType: 'blob' });
  }

  deleteLoanDocument(loanId: string | number, documentId: string | number): Observable<unknown> {
    return this.http.delete(`/loans/${loanId}/documents/${documentId}`);
  }

  loadLoanDocument(loanId: string | number, data: FormData): Observable<unknown> {
    return this.http.post(`/loans/${loanId}/documents`, data);
  }

  /**
   * @param clientId Client Id
   * @param clientName Client Name
   * @param fromAccountId Account Id
   * @param locale Locale
   * @param dateFormat Date Format
   * @returns {Observable<unknown>} Standing Instructions
   */
  getStandingInstructions(
    clientId: string,
    clientName: string,
    fromAccountId: string,
    locale: string,
    dateFormat: string
  ): Observable<unknown> {
    const httpParams = new HttpParams()
      .set('clientId', clientId)
      .set('clientName', clientName)
      .set('fromAccountId', fromAccountId)
      .set('fromAccountType', '1')
      .set('locale', locale)
      .set('dateFormat', dateFormat)
      .set('limit', '14')
      .set('offset', '0');
    return this.http.get(`/standinginstructions`, { params: httpParams });
  }

  updateLoansAccount(loanId: string | number, loanData: Record<string, unknown>): Observable<unknown> {
    return this.http.put(`/loans/${loanId}`, loanData);
  }

  getTemplateData(templateId: string | number, loanId: string | number): Observable<string> {
    const httpParams = new HttpParams().set('loanId', loanId.toString());
    return this.http.get(`/templates/${templateId}`, { params: httpParams, responseType: 'text' });
  }

  /**
   * Get Loan Charge Aproval template.
   * @param {string} loanId Loan Id.
   * @returns {Observable<unknown>}
   */
  getLoanApprovalTemplate(loanId: string): Observable<unknown> {
    const httpParams = new HttpParams().set('templateType', 'approval').set('associations', 'delinquency');
    return this.http.get(`/loans/${loanId}/template`, { params: httpParams });
  }

  guarantorAccountResource(loanId: string, clientId: string | number): Observable<unknown> {
    const httpParams = new HttpParams().set('clientId', clientId.toString());
    return this.http.get(`/loans/${loanId}/guarantors/accounts/template`, { params: httpParams });
  }

  /**
   * @param {string} loanId Loan Id
   * @returns {Observable<unknown>} All charges for the loan
   */
  getLoanCharges(loanId: string): Observable<unknown> {
    return this.http.get(`/loans/${loanId}/charges`);
  }

  /**
   * @param {string} accountId loans account Id
   * @param {string} chargeId loans charge Id
   * @returns {Observable<unknown>}
   */
  getLoansAccountCharge(accountId: string, chargeId: string): Observable<unknown> {
    return this.http.get(`/loans/${accountId}/charges/${chargeId}`);
  }

  /**
   * @param {string} accountId Loans Account Id
   * @param {string} command Command
   * @param {Record<string, unknown>} data Data
   * @param {string | number} chargeId Charge Id
   * @returns {Observable<unknown>}
   */
  executeLoansAccountChargesCommand(
    accountId: string,
    command: string,
    data: Record<string, unknown>,
    chargeId: string | number
  ): Observable<unknown> {
    const httpParams = new HttpParams().set('command', command);
    return this.http.post(`/loans/${accountId}/charges/${chargeId}`, data, { params: httpParams });
  }

  /**
   * @param {string} accountId Loans Account Id
   * @param {Record<string, unknown>} data Charge Data
   * @param {string | number} chargeId Charge Id
   * @returns {Observable<unknown>}
   */
  editLoansAccountCharge(
    accountId: string,
    data: Record<string, unknown>,
    chargeId: string | number
  ): Observable<unknown> {
    return this.http.put(`/loans/${accountId}/charges/${chargeId}`, data);
  }

  /**
   * @param {string} accountId Loans Account Id
   * @param {string | number} chargeId Charge Id
   * @returns {Observable<unknown>}
   */
  deleteLoansAccountCharge(accountId: string, chargeId: string | number): Observable<unknown> {
    return this.http.delete(`/loans/${accountId}/charges/${chargeId}`);
  }

  /**
   * @param {string} loanId Loans Account Id
   * @param {string} command Schedule command
   * @param {Record<string, unknown>} payload Payload
   * @returns {Observable<unknown>}
   */
  applyCommandLoanScheduleVariations(
    loanId: string,
    command: string,
    payload: Record<string, unknown>
  ): Observable<unknown> {
    return this.http.post(`/loans/${loanId}/schedule?command=${command}`, payload);
  }

  /**
   * @param {string} accountId Loans Account Id
   * @param {string} transactionId Transaction Id
   * @returns {Observable<unknown>}
   */
  getLoansAccountTransaction(accountId: string, transactionId: string): Observable<unknown> {
    return this.http.get(`/loans/${accountId}/transactions/${transactionId}`);
  }

  /**
   * @param {string} accountId Loans Account Id
   * @param {string} transactionId Transaction Id
   * @returns {Observable<unknown>}
   */
  getLoansAccountTransactionTemplate(accountId: string, transactionId: string): Observable<unknown> {
    const httpParams = new HttpParams().set('template', 'true');
    return this.http.get(`/loans/${accountId}/transactions/${transactionId}`, { params: httpParams });
  }

  /**
   * @param {string} accountId Loans Account Id
   * @param {string} command Command
   * @param {Record<string, unknown>} data Data
   * @param {string | number} transactionId Transaction Id
   * @returns {Observable<unknown>}
   */
  executeLoansAccountTransactionsCommand(
    accountId: string,
    command: string,
    data: Record<string, unknown>,
    transactionId?: string | number
  ): Observable<unknown> {
    const httpParams = new HttpParams().set('command', command);
    if (transactionId) {
      return this.http.post(`/loans/${accountId}/transactions/${transactionId}`, data, { params: httpParams });
    }
    return this.http.post(`/loans/${accountId}/transactions`, data, { params: httpParams });
  }

  /**
   * @param glimId GLIM Id of account to get data for.
   * @param groupId Group Id.
   * @returns {Observable<unknown>} GLIM Account data.
   */
  getGLIMAccountData(glimId: string, groupId: string): Observable<unknown> {
    return this.http.get(`/loans/glimAccount/${glimId}`);
  }

  getGLIMLoanAccountTemplate(groupId: string | number): Observable<unknown> {
    const httpParams = new HttpParams()
      .set('groupId', groupId.toString())
      // Commenting parameter, because it doesn't exist:
      // https://localhost:8443/fineract-provider/swagger-ui/index.html#/Loans/template_10
      //   .set('lendingStrategy', '300')
      .set('templateType', 'jlgbulk');
    return this.http.get('/loans/template', { params: httpParams });
  }

  createGlimAccount(payload: Record<string, unknown>[]): Observable<unknown> {
    return this.http.post('/batches?enclosingTransaction=true', payload);
  }

  calculateLoanSchedule(payload: Record<string, unknown>): Observable<unknown> {
    return this.http.post('/loans?command=calculateLoanSchedule', payload);
  }

  /**
   * @param loansAccount Loan account data used for the request
   * @param loansAccountTemplate Loan account template for getting product default values
   * @param calendarOptions Calendar options
   * @param locale String to send to backend
   * @param dateFormat String with date format to manage dates
   * @returns Object with Loan Account payload data.
   */
  buildLoanRequestPayload(
    loansAccount: any,
    loansAccountTemplate: any,
    calendarOptions: any,
    locale: string,
    dateFormat: string
  ): any {
    const loansAccountData = {
      ...loansAccount,
      charges: (loansAccount.charges ?? [])
        .map((charge: any) => {
          const chargeId = charge.chargeId ?? charge.id;
          if (chargeId == null) {
            return null;
          }
          const mappedCharge: any = {
            chargeId,
            amount: charge.amount
          };
          if (charge.id && charge.id !== chargeId) {
            mappedCharge.id = charge.id;
          }
          if (charge.dueDate) {
            mappedCharge.dueDate = this.dateUtils.formatDate(charge.dueDate, dateFormat);
          }
          if (charge.feeInterval !== undefined) {
            mappedCharge.feeInterval = charge.feeInterval;
          }
          if (charge.feeOnMonthDay !== undefined) {
            mappedCharge.feeOnMonthDay = charge.feeOnMonthDay;
          }
          return mappedCharge;
        })
        .filter(Boolean),
      disbursementData: loansAccount.disbursementData.map((item: any) => ({
        expectedDisbursementDate: this.dateUtils.formatDate(item.expectedDisbursementDate, dateFormat),
        principal: item.principal
      })),
      interestChargedFromDate: this.dateUtils.formatDate(loansAccount.interestChargedFromDate, dateFormat),
      repaymentsStartingFromDate: this.dateUtils.formatDate(loansAccount.repaymentsStartingFromDate, dateFormat),
      submittedOnDate: this.dateUtils.formatDate(loansAccount.submittedOnDate, dateFormat),
      expectedDisbursementDate: this.dateUtils.formatDate(loansAccount.expectedDisbursementDate, dateFormat),
      dateFormat,
      locale
    };

    if (loansAccount.collateral) {
      loansAccountData.collateral = loansAccount.collateral.map((collateralEle: any) => ({
        clientCollateralId: collateralEle.type.collateralId,
        quantity: collateralEle.value
      }));
    }

    if (loansAccountTemplate.clientId && loansAccountTemplate.group?.id) {
      loansAccountData.clientId = loansAccountTemplate.clientId;
      loansAccountData.groupId = loansAccountTemplate.group.id;
      loansAccountData.loanType = 'glim';
    } else if (loansAccountTemplate.clientId) {
      loansAccountData.clientId = loansAccountTemplate.clientId;
      loansAccountData.loanType = 'individual';
    } else {
      loansAccountData.groupId = loansAccountTemplate.group.id;
      loansAccountData.loanType = 'group';
    }

    if (loansAccountData.syncRepaymentsWithMeeting) {
      loansAccountData.calendarId = calendarOptions[0].id;
      delete loansAccountData.syncRepaymentsWithMeeting;
    }

    if (loansAccountData.recalculationRestFrequencyDate) {
      loansAccountData.recalculationRestFrequencyDate = this.dateUtils.formatDate(
        loansAccount.recalculationRestFrequencyDate,
        dateFormat
      );
    }

    if (loansAccountData.interestCalculationPeriodType === 0) {
      loansAccountData.allowPartialPeriodInterestCalculation = false;
    }
    if (!(loansAccountData.isFloatingInterestRate === false)) {
      delete loansAccountData.isFloatingInterestRate;
    }
    if (!loansAccountData.multiDisburseLoan) {
      delete loansAccountData.disbursementData;
    }
    delete loansAccountData.isValid;
    loansAccountData.principal = loansAccountData.principalAmount;
    delete loansAccountData.principalAmount;
    delete loansAccountData.multiDisburseLoan; // this was just added so that disbursement data can be send in the backend

    // In Fineract, the POST and PUT endpoints for /v1/loans have a typo in the field
    // allowPartialPeriodInterestCalculation. Until that is fixed, we need to replace the field name in the payload.
    loansAccountData.allowPartialPeriodInterestCalculation = loansAccountData.allowPartialPeriodInterestCalculation;
    delete loansAccountData.allowPartialPeriodInterestCalculation;
    return loansAccountData;
  }

  saveLoanDisbursementDetailsData(disbursementData: DisbursementData[]): void {
    localStorage.setItem('disbursementData', JSON.stringify(disbursementData));
  }

  getLoanDisbursementDetailsData(): DisbursementData[] {
    return JSON.parse(localStorage.getItem('disbursementData'));
  }
}
