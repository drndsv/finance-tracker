import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { TuiButton, TuiGroup, TuiTextfield } from '@taiga-ui/core';
import {
  TuiBlock, TuiCheckbox,
  TuiChevron,
  TuiDataListWrapper, TuiInputDate, TuiInputNumber,
  TuiRadio,
  TuiSelect, TuiTextarea, TuiTextareaLimit,
} from '@taiga-ui/kit';
import { startWith } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { TuiDay } from '@taiga-ui/cdk';
import { CommentValidatorsDirective } from '../directives/comment-validators.directive';

type TransactionType = 'income' | 'expense';

function notFutureDateValidator(): ValidatorFn {
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

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiBlock,
    TuiRadio,
    TuiButton,
    TuiSelect,
    TuiTextfield,
    TuiDataListWrapper,
    TuiGroup,
    TuiChevron,
    TuiInputNumber,
    TuiCurrencyPipe,
    CurrencyPipe,
    TuiInputDate,
    CommentValidatorsDirective,
    TuiTextarea,
    TuiTextareaLimit,
    TuiCheckbox,
  ],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionFormComponent {
  readonly incomeCategories: string[] = [
    'Зарплата',
    'Премия',
    'Фриланс',
    'Подарок',
    'Кэшбэк',
  ];

  readonly expenseCategories: string[] = [
    'Продукты',
    'Транспорт',
    'Кафе',
    'Развлечения',
    'Жильё',
  ];

  readonly maxDate = TuiDay.currentLocal();

  readonly form = new FormGroup({
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

  readonly typeValue = toSignal(
    this.form.controls.type.valueChanges.pipe(
      startWith(this.form.controls.type.value),
    ),
    { initialValue: this.form.controls.type.value },
  );

  readonly addCommentValue = toSignal(
    this.form.controls.addComment.valueChanges.pipe(
      startWith(this.form.controls.addComment.value),
    ),
    { initialValue: this.form.controls.addComment.value },
  );

  readonly categories = computed(() => {
    if (this.typeValue() === 'income') {
      return this.incomeCategories;
    }

    if (this.typeValue() === 'expense') {
      return this.expenseCategories;
    }

    return [];
  });

  constructor() {
    this.form.controls.type.valueChanges.subscribe(() => {
      this.form.controls.category.setValue(null);
      this.form.controls.category.markAsUntouched();
    });

    this.form.controls.addComment.valueChanges.subscribe((enabled) => {
      if (!enabled) {
        this.form.controls.comment.setValue('');
        this.form.controls.comment.markAsUntouched();
      }
    });
  }

  get typeControl(): FormControl<TransactionType | null> {
    return this.form.controls.type;
  }

  get categoryControl(): FormControl<string | null> {
    return this.form.controls.category;
  }

  get amountControl(): FormControl<number | null> {
    return this.form.controls.amount;
  }

  get transactionDateControl(): FormControl<TuiDay | null> {
    return this.form.controls.transactionDate;
  }

  get commentControl(): FormControl<string> {
    return this.form.controls.comment;
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    console.log('Шаг 5 готов:', this.form.getRawValue());
  }
}
