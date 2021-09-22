import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { searchForm } from '../components/search/search.component';
import { option } from '../custom-types';
import { ApiModule } from './services';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public isLoading = new BehaviorSubject<boolean>(false);

  constructor(
    private medicineClient: ApiModule.MedicinesClient,
    private symptomClient: ApiModule.SymptomsClient,
    private sessionStorageService: SessionStorageService,
    private snackBar: MatSnackBar
  ) {}

  getSymptomsOption(): Observable<option[]> {
    if (!this.sessionStorageService.getItemAsValue<option[]>('symptoms')) {
      this.symptomClient
        .getAllSymptoms()
        .pipe(
          map((symptoms) => {
            return symptoms.map(
              (symptom): option => ({
                key: symptom.symptomId,
                value: symptom.symptomName!,
              })
            );
          })
        )
        .subscribe((Symptoms) => {
          this.updateSymptomsOption(Symptoms);
        });
    }

    return this.sessionStorageService.getItem<option[]>('symptoms')!;
  }

  updateSymptomsOption(symptomOptions: option[]) {
    this.sessionStorageService.setItem<option[]>('symptoms', symptomOptions);
  }

  // addSymptom(symptom: option) {
  //   let symptomOptions =
  //     this.sessionStorageService.getItemAsValue<option[]>('symptoms')!;
  //   symptomOptions.push(symptom);
  //   this.updateSymptomsOption(symptomOptions);
  // }

  getMedicinesOption(): Observable<option[]> {
    if (!this.sessionStorageService.getItemAsValue<option[]>('medicines')) {
      this.medicineClient
        .getAllMedicines()
        .pipe(
          map((medicines) => {
            return medicines.map(
              (medicine): option => ({
                key: medicine.medicineId,
                value: medicine.medicineName!,
              })
            );
          })
        )
        .subscribe((medicines) => {
          this.updateMedicineOption(medicines);
        });
    }

    return this.sessionStorageService.getItem<option[]>('medicines')!;
  }

  // addMedicine(medicine: option) {
  //   let medicineOptions =
  //     this.sessionStorageService.getItemAsValue<option[]>('medicines')!;
  //   medicineOptions.push(medicine);
  //   this.updateMedicineOption(medicineOptions);
  // }

  updateMedicineOption(medicineOptions: option[]) {
    this.sessionStorageService.setItem<option[]>('medicines', medicineOptions);
  }

  resetRemedyInSearchForm() {
    let searchForm =
      this.sessionStorageService.getItemAsValue<searchForm>('recentSearch');
    searchForm.remedies = [];
    this.sessionStorageService.setItem<searchForm>('recentSearch', searchForm);
  }

  openSnackBar(message: string, success: boolean = true) {
    this.snackBar.open(message, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: success ? 'successMsg' : 'errorMsg',
    });
  }
}
