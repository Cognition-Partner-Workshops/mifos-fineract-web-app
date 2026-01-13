/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

/** Custom Services */
import { ProductsService } from 'app/products/products.service';
import { SettingsService } from 'app/settings/settings.service';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'mifosx-edit-collateral',
  templateUrl: './edit-collateral.component.html',
  styleUrls: ['./edit-collateral.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS
  ]
})
export class EditCollateralComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private productsService = inject(ProductsService);
  private formBuilder = inject(UntypedFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private settingsService = inject(SettingsService);

  /** Colalteral Data */
  collateralData: any;
  /** Collateral Template */
  collateralTemplateData: any;
  /** Collateral Form */
  collateralForm: UntypedFormGroup;

  /**
   * Retrieves the Collateral Data from `resolve`
   * @param {ProductsService} productsService Products Service.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {SettingsService} settingsService Settings Service.
   */
  constructor() {
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe((data: { collateral: any; collateralTemplate: any }) => {
      this.collateralData = data.collateral;
      this.collateralTemplateData = data.collateralTemplate;
    });
  }

  ngOnInit(): void {
    this.editCollateralForm();
  }

  /**
   * Edit Collateral Form
   */
  editCollateralForm() {
    this.collateralForm = this.formBuilder.group({
      name: [
        this.collateralData.name,
        Validators.required
      ],
      quality: [
        this.collateralData.quality,
        Validators.required
      ],
      unitType: [
        this.collateralData.unitType,
        Validators.required
      ],
      basePrice: [
        this.collateralData.basePrice,
        Validators.required
      ],
      pctToBase: [
        this.collateralData.pctToBase,
        Validators.required
      ],
      currency: [
        this.collateralData.currency,
        Validators.required
      ]
    });
  }

  /**
   * Submits the updated Collateral Form
   */
  submit() {
    const collateral = this.collateralForm.value;
    collateral.locale = this.settingsService.language.code;
    this.productsService
      .updateCollateral(this.collateralData.id.toString(), collateral)
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
