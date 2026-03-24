import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TuiDay } from '@taiga-ui/cdk';

export function notFutureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as TuiDay | null;

    if (!value) {
      return null;
    }

    const today = TuiDay.currentLocal();

    if (value.daySame(today) || value.dayBefore(today)) {
      return null;
    }

    return { futureDate: true };
  };
}
