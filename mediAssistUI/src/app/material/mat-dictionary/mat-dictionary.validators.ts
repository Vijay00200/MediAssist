import { AbstractControl } from '@angular/forms';

export class MatDictionaryValidators {
  static required(control: AbstractControl) {
    return control?.value?.key !== undefined
      ? null
      : {
          validateSearch: {
            valid: true,
          },
        };
  }
}
