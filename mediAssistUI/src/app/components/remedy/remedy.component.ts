import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { option, remedy } from 'src/app/custom-types';
import { MatDictionaryValidators } from 'src/app/material/mat-dictionary/mat-dictionary.validators';
import { ApiModule } from 'src/app/services/services';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-remedy',
  templateUrl: './remedy.component.html',
  styleUrls: ['./remedy.component.css'],
})
export class RemedyComponent implements OnInit {
  form: FormGroup;
  remedyId: number | null;
  dosageId: number | undefined;

  medicineOptions: option[] = [];

  SymptomOptions: option[] = [];

  private _formState!: 'INSERT' | 'UPDATE' | 'VIEW';

  public get formState(): 'INSERT' | 'UPDATE' | 'VIEW' {
    return this._formState;
  }
  public set formState(value: 'INSERT' | 'UPDATE' | 'VIEW') {
    this._formState = value;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private medicineClient: ApiModule.MedicinesClient,
    private symptomClient: ApiModule.SymptomsClient,
    private remedyClient: ApiModule.RemediesClient,
    private commonService: CommonService
  ) {
    const _remedyId = this.route.snapshot.paramMap.get('remedyId');
    this.remedyId = _remedyId ? +_remedyId : null;

    if (this.remedyId) {
      this.formState = 'VIEW';
    } else {
      this.formState = 'INSERT';
    }

    this.form = this.fb.group({
      symptom: new FormControl('', MatDictionaryValidators.required),
      medicine: new FormControl('', MatDictionaryValidators.required),
      dosage: this.fb.group({
        dosagePower: new FormControl(),
        dosageDays: new FormControl(),
        dosageTimes: new FormControl(),
      }),
      notes: new FormControl(),
    });
  }

  async ngOnInit(): Promise<void> {
    this.commonService.getMedicinesOption().subscribe((medicineOptions) => {
      this.medicineOptions = medicineOptions;
    });

    this.commonService.getSymptomsOption().subscribe((SymptomOptions) => {
      this.SymptomOptions = SymptomOptions;
    });

    this.initRemedyForm();
  }

  initRemedyForm() {
    if (this.remedyId)
      this.remedyClient.getRemedyById(this.remedyId).subscribe((resp) => {
        const remedy: remedy = {
          notes: resp.notes,
          remedyId: resp.remedyId,
          dosage: resp.dosage,
          medicineId: resp.medicineId,
          medicine: this.medicineOptions.find(
            (x: option) => x.key === resp.medicineId
          )!,
          symptomId: resp.symptomId,
          symptom: this.SymptomOptions.find(
            (x: option) => x.key === resp.symptomId
          )!,
        };
        this.dosageId = resp.dosage?.dosageId;
        this.form.patchValue(remedy);
        this.form.disable();
      });
  }

  onAddSymptomOption(symptomName: string) {
    this.symptomClient.addSymptom(symptomName).subscribe((symptom) => {
      const newItem = { key: symptom.symptomId, value: symptomName };
      this.SymptomOptions.push(newItem);
      this.form.controls['symptom'].setValue(newItem);
      this.commonService.updateSymptomsOption(this.SymptomOptions);
    });
  }

  onAddMedicineOption(medicineName: string) {
    this.medicineClient.addMedicine(medicineName).subscribe((medicine) => {
      const newItem = {
        key: medicine.medicineId,
        value: medicineName,
      };
      this.medicineOptions.push(newItem);
      this.form.controls['medicine'].setValue(newItem);
      this.commonService.updateMedicineOption(this.medicineOptions);
    });
  }

  onSaveClick() {
    if (this.form.invalid) return;

    this.remedyClient
      .addRemedy(this.getRemedyFormData())
      .subscribe((remedy) => {
        this.commonService.openSnackBar('Remedy Data added Successfully!!');
        this.form.reset();
        this.form.markAsPristine();
      });
  }

  getRemedyFormData(): ApiModule.RemedyDto {
    var dosage = this.form.controls['dosage'].value as ApiModule.IDosageDto;
    dosage.dosageId = this.dosageId;

    var remedy = new ApiModule.RemedyDto({
      remedyId: this.remedyId ?? 0,
      symptomId: this.form.controls['symptom'].value.key as number,
      medicineId: this.form.controls['medicine'].value.key as number,
      notes: this.form.controls['notes'].value as string,
      dosage: new ApiModule.DosageDto(dosage),
    });

    return remedy;
  }

  onBackClick() {
    this.router.navigate(['search'], { state: { showRecentSearch: true } });
  }

  onEditClick() {
    this.formState = 'UPDATE';
    this.form.enable();
  }

  onDeleteClick() {}

  onUpdateClick() {
    if (this.form.invalid) return;

    this.remedyClient.updateRemedy(this.getRemedyFormData()).subscribe(
      (remedy) => {
        this.commonService.openSnackBar('Remedy Data updated Successfully!!');
        this.formState = 'VIEW';
        this.form.disable();
        this.commonService.resetRemedyInSearchForm();
      },
      (error) => {
        this.commonService.openSnackBar('Error while updating data', false);
      }
    );
  }

  onCancelClick() {
    if (this.formState === 'INSERT') {
      this.form.reset();
    } else if (this.formState === 'UPDATE') {
      this.initRemedyForm();
      this.form.disable();
      this.formState = 'VIEW';
    }
  }
}
