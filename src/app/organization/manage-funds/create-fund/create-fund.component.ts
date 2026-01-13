/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrganizationService } from 'app/organization/organization.service';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'mifosx-create-fund',
  templateUrl: './create-fund.component.html',
  styleUrls: ['./create-fund.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS
  ]
})
export class CreateFundComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private organizationService = inject(OrganizationService);
  private formBuilder = inject(UntypedFormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  /** Charge form. */
  fundForm: UntypedFormGroup;

  ngOnInit() {
    this.createFundForm();
  }

  /**
   * Edit Fund form.
   */
  createFundForm() {
    this.fundForm = this.formBuilder.group({
      name: [
        '',
        Validators.required
      ],
      externalId: ['']
    });
  }

  submit() {
    const payload = this.fundForm.getRawValue();
    this.organizationService
      .createFund(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
