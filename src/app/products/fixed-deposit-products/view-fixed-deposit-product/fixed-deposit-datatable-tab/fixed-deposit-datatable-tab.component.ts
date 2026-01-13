/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntityDatatableTabComponent } from '../../../../shared/tabs/entity-datatable-tab/entity-datatable-tab.component';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'mifosx-fixed-deposit-datatable-tab',
  templateUrl: './fixed-deposit-datatable-tab.component.html',
  styleUrls: ['./fixed-deposit-datatable-tab.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    EntityDatatableTabComponent
  ]
})
export class FixedDepositDatatableTabComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private route = inject(ActivatedRoute);

  entityId: string;
  entityDatatable: any;
  multiRowDatatableFlag: boolean;

  constructor() {
    this.entityId = this.route.parent.parent.snapshot.paramMap.get('productId');

    this.route.data.pipe(takeUntil(this.destroy$)).subscribe((data: { fixedDepositDatatable: any }) => {
      this.entityDatatable = data.fixedDepositDatatable;
      this.multiRowDatatableFlag = this.entityDatatable.columnHeaders[0].columnName === 'id' ? true : false;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
