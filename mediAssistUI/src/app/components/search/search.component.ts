import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { option, optionSet, remedy } from 'src/app/custom-types';
import { FormFieldValue } from 'src/app/material/mat-search/mat-search.component';
import { CommonService } from 'src/app/services/common.service';
import { ApiModule } from 'src/app/services/services';
import { SessionStorageService } from 'src/app/services/session-storage.service';

export type searchForm = {
  remedies: remedy[];
  formValue: any;
};

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, OnDestroy {
  form: FormGroup;

  searchByOptions: option[] = [
    { key: 1, value: 'Symptom' },
    { key: 2, value: 'Medicine' },
  ];

  medicineOptions: option[] = [];

  SymptomOptions: option[] = [];

  optionSets: optionSet[] = [];

  remedies: remedy[] = [];

  canChangeRemedies: boolean = true;

  constructor(
    private fb: FormBuilder,
    private remedyClient: ApiModule.RemediesClient,
    private sessionStorageService: SessionStorageService,
    private location: Location,
    private commonService: CommonService,
    private ref: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      search: new FormControl(''),
    });

    this.form.controls['search'].valueChanges.subscribe(() => {
      if (this.canChangeRemedies) this.remedies = [];
    });
  }

  async ngOnInit() {
    this.commonService.getMedicinesOption().subscribe((medicineOptions) => {
      this.medicineOptions = medicineOptions;
      this.optionSets.splice(1, 0, {
        optionSetKey: 2,
        optionSetValue: this.medicineOptions,
      });
    });

    this.commonService.getSymptomsOption().subscribe((SymptomOptions) => {
      this.SymptomOptions = SymptomOptions;
      this.optionSets.splice(0, 0, {
        optionSetKey: 1,
        optionSetValue: this.SymptomOptions,
      });
    });

    // this.optionSets = [
    //   { optionSetKey: 1, optionSetValue: this.SymptomOptions },
    //   { optionSetKey: 2, optionSetValue: this.medicineOptions },
    // ];
    let locationState = this.location.getState() as any;
    if (locationState?.showRecentSearch) {
      this.canChangeRemedies = false;
      this.initFromStorage(
        this.sessionStorageService.getItemAsValue<searchForm>('recentSearch')
      );
    } else {
      setTimeout(() => {
        this.ref.markForCheck();
        this.canChangeRemedies = true;
      }, 500);
    }
  }

  private initFromStorage(storageData: searchForm) {
    this.commonService.isLoading.next(true);
    this.remedies = storageData.remedies;
    setTimeout(() => {
      this.form.patchValue(storageData.formValue);
      this.canChangeRemedies = true;
      this.commonService.isLoading.next(false);
      if (this.remedies.length === 0) {
        this.onSearchClick();
      }
    }, 500);
  }

  ngOnDestroy(): void {
    this.sessionStorageService.setItem<searchForm>('recentSearch', {
      remedies: this.remedies,
      formValue: this.form.value,
    });
  }

  getSearchedCondition() {
    const searchCondition = this.form.controls['search']
      .value as FormFieldValue;
    return searchCondition;
  }

  onSearchClick() {
    const searchCondition = this.getSearchedCondition();
    if (searchCondition)
      this.remedyClient
        .searchRemedies(
          searchCondition.scope === 2 ? searchCondition.query.key : null,
          searchCondition.scope === 1 ? searchCondition.query.key : null,
          1,
          10
        )
        .subscribe((remedies) => {
          this.remedies = remedies.map(
            (remedy): remedy => ({
              remedyId: remedy.remedyId,
              medicineId: remedy.medicineId,
              medicine: this.medicineOptions.find(
                (x: option) => x.key === remedy.medicineId
              )!,
              symptomId: remedy.symptomId,
              symptom: this.SymptomOptions.find(
                (x: option) => x.key === remedy.symptomId
              )!,
              dosage: remedy.dosage,
            })
          );
        });
  }
}
