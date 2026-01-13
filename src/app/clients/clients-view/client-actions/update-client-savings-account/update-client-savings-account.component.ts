/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

/** Custom Services */
import { ClientsService } from 'app/clients/clients.service';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { Subject, takeUntil } from 'rxjs';

/**
 * Clients Update Savings Account Component
 */
@Component({
  selector: 'mifosx-update-client-savings-account',
  templateUrl: './update-client-savings-account.component.html',
  styleUrls: ['./update-client-savings-account.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS
  ]
})
export class UpdateClientSavingsAccountComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private formBuilder = inject(UntypedFormBuilder);
  private clientsService = inject(ClientsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  /** Client Update Savings Account form. */
  clientSavingsAccountForm: UntypedFormGroup;
  /** Savings Accounts Data */
  savingsAccounts: any;
  /** Client Data */
  clientData: any;

  /**
   * Fetches Client Action Data from `resolve`
   * @param {FormBuilder} formBuilder Form Builder
   * @param {SavingsService} savingsService Savings Service
   * @param {ActivatedRoute} route Activated Route
   * @param {Router} router Router
   */
  constructor() {
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe((data: { clientActionData: any }) => {
      this.clientData = data.clientActionData;
    });
  }

  ngOnInit() {
    this.savingsAccounts = this.clientData.savingAccountOptions;
    this.createClientSavingsAccountForm();
  }

  /**
   * Creates the client update savings account form.
   */
  createClientSavingsAccountForm() {
    this.clientSavingsAccountForm = this.formBuilder.group({
      savingsAccountId: [this.clientData.savingsAccountId]
    });
  }

  /**
   * Submits the form and update savings account for the client.
   */
  submit() {
    this.clientsService
      .executeClientCommand(this.clientData.id, 'updateSavingsAccount', this.clientSavingsAccountForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.router.navigate(['../../'], { relativeTo: this.route });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
