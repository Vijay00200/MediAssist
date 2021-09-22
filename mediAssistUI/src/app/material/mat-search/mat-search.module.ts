import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSearchComponent } from './mat-search.component';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [MatSearchComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [MatSearchComponent],
})
export class MatSearchModule {}
