/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ExternalIdentifierComponent } from '../../../shared/external-identifier/external-identifier.component';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'mifosx-view-fund',
  templateUrl: './view-fund.component.html',
  styleUrls: ['./view-fund.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    FaIconComponent,
    ExternalIdentifierComponent
  ]
})
export class ViewFundComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private route = inject(ActivatedRoute);

  /** Fund data. */
  fundData: any;

  /**
   * Retrieves the charge data from `resolve`.
   * @param {Router} router Router for navigation.
   */
  constructor() {
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe((data: { fundData: any }) => {
      this.fundData = data.fundData;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
