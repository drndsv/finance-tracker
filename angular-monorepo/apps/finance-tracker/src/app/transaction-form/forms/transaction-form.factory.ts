import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TransactionType } from '../types/transaction-form.types';
import { TuiDay } from '@taiga-ui/cdk';
import { notFutureDateValidator } from '../validators/not-future-date.validator';

export function createTransactionForm(): FormGroup<{
  type: FormControl<TransactionType | null>;
  category: FormControl<string | null>;
  amount: FormControl<number | null>;
  transactionDate: FormControl<TuiDay | null>;
  addComment: FormControl<boolean>;
  comment: FormControl<string>;
}> {
  return new FormGroup({
    type: new FormControl<TransactionType | null>(null, {
      validators: [Validators.required],
    }),
    category: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    amount: new FormControl<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(0),
        Validators.max(10_000_000),
      ],
    }),
    transactionDate: new FormControl<TuiDay | null>(null, {
      validators: [Validators.required, notFutureDateValidator()],
    }),
    addComment: new FormControl<boolean>(false, {
      nonNullable: true,
    }),
    comment: new FormControl<string>('', {
      nonNullable: true,
    }),
  });
}
