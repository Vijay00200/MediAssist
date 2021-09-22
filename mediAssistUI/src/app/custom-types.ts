import { Params, RouterLink } from '@angular/router';
import { ApiModule } from './services/services';

interface option {
  key: number;
  value: string;
}

interface optionSet {
  optionSetKey: number;
  optionSetValue: option[];
}

interface menu {
  routerLink: any[];
  queryParams?: Params;
  menuIcon: string;
  menuLabel: string;
}

interface remedy extends ApiModule.IRemedyDto {
  // remedyId: number;
  symptom: option;
  medicine: option;
  // dosage?: {
  //   power: string | undefined;
  //   days: number | undefined;
  //   times: number | undefined;
  // };
  // notes?: string;
}

export { option, menu, optionSet, remedy };
