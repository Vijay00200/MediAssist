import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDictionaryComponent } from '../mat-dictionary/mat-dictionary.component';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [MatDictionaryComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatTooltipModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [MatDictionaryComponent],
})
export class MatDictionaryModule {}
