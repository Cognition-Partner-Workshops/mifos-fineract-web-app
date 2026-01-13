/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { MatTabNav, MatTabLink, MatTabNavPanel } from '@angular/material/tabs';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { Subject, takeUntil } from 'rxjs';

/**
 * View Office Component
 */
@Component({
  selector: 'mifosx-view-office',
  templateUrl: './view-office.component.html',
  styleUrls: ['./view-office.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatTabNav,
    MatTabLink,
    RouterLinkActive,
    MatTabNavPanel,
    RouterOutlet
  ]
})
export class ViewOfficeComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private route = inject(ActivatedRoute);

  /** Office datatables data */
  officeDatatables: any;

  /**
   * Fetches office datatables from `resolve`
   * @param {ActivatedRoute} route Activated Route
   */
  constructor() {
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe((data: { officeDatatables: any }) => {
      this.officeDatatables = data.officeDatatables;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
