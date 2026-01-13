/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Component, inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from 'app/products/products.service';
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'mifosx-view-range',
  templateUrl: './view-range.component.html',
  styleUrls: ['./view-range.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    FaIconComponent
  ]
})
export class ViewRangeComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private productsService = inject(ProductsService);

  /** Delinquency Range Data. */
  delinquencyRangeData: any;

  constructor() {
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe((data: { delinquencyRange: any }) => {
      this.delinquencyRangeData = data.delinquencyRange;
    });
  }

  deleteDelinquencyRange() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: this.delinquencyRangeData.classification }
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response.delete) {
          this.productsService
            .deleteDelinquencyRange(this.delinquencyRangeData.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.router.navigate(['../'], { relativeTo: this.route });
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
