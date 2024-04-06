import { AbstractControl, ValidatorFn } from '@angular/forms';

export function locationValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    let locationRgEx: RegExp = /\D/;
    let valid = control.value && locationRgEx.test(control.value);
    return valid ? null : { account: true };
  };
}
