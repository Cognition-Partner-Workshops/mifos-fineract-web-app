/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

/** Custom Services */
import { AccountingService } from '../../accounting.service';

/** Custom Components */
import { DeleteDialogComponent } from '../../../shared/delete-dialog/delete-dialog.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { Subject, takeUntil } from 'rxjs';

/**
 * View closure component.
 */
@Component({
  selector: 'mifosx-view-closure',
  templateUrl: './view-closure.component.html',
  styleUrls: ['./view-closure.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    FaIconComponent
  ]
})
export class ViewClosureComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private accountingService = inject(AccountingService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  dialog = inject(MatDialog);

  /** GL Account closure. */
  glAccountClosure: any;

  /**
   * Retrieves the gl account closure data from `resolve`.
   * @param {AccountingService} accountingService Accounting Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {MatDialog} dialog Dialog reference.
   */
  constructor() {
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe((data: { glAccountClosure: any }) => {
      this.glAccountClosure = data.glAccountClosure;
    });
  }

  /**
   * Deletes the gl account closure and redirects to closing entries.
   */
  deleteAccountingClosure() {
    const deleteAccountingClosureDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `accounting closure ${this.glAccountClosure.id}` }
    });
    deleteAccountingClosureDialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response.delete) {
          this.accountingService
            .deleteAccountingClosure(this.glAccountClosure.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.router.navigate(['/accounting/closing-entries']);
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
