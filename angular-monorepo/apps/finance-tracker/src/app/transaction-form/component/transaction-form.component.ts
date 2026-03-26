import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import {
  TuiAlertService,
  TuiButton, TuiError,
  TuiGroup,
  TuiTextfield,
} from '@taiga-ui/core';
import {
  TuiBlock,
  TuiCheckbox,
  TuiChevron,
  TuiDataListWrapper,
  TuiFieldErrorPipe,
  TuiInputDate,
  TuiInputNumber,
  TuiRadio,
  TuiSelect,
  TuiTextarea,
  TuiTextareaLimit,
  tuiValidationErrorsProvider,
} from '@taiga-ui/kit';
import { startWith } from 'rxjs';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { TuiDay } from '@taiga-ui/cdk';
import { CommentValidatorsDirective } from '../directives/comment-validators.directive';
import { TransactionType } from '../types/transaction-form.types';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '../constants/transaction-categories';
import { notFutureDateValidator } from '../validators/not-future-date.validator';
import { TRANSACTION_VALIDATION_ERRORS } from '../constants/transaction-validation-errors';
import { TransactionsStorageService } from '../services/transactions-storage.service';
import { Transaction } from '../types/transaction.types';

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
    TuiError,
    TuiFieldErrorPipe,
    AsyncPipe,
  ],
  providers: [tuiValidationErrorsProvider(TRANSACTION_VALIDATION_ERRORS)],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionFormComponent {
  readonly incomeCategories = INCOME_CATEGORIES;
  readonly expenseCategories = EXPENSE_CATEGORIES;

  private readonly alerts = inject(TuiAlertService);
  private readonly transactionsStorage = inject(TransactionsStorageService);

  readonly maxDate = TuiDay.currentLocal();

  readonly editingTransaction = this.transactionsStorage.editingTransaction;

  readonly isEditMode = computed(() => this.editingTransaction() !== null);

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

    effect(() => {
      const transaction = this.editingTransaction();

      if (transaction) {
        this.fillFormForEditing(transaction);
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

  private formatTransactionDate(date: TuiDay | null): string {
    if (!date) {
      return '';
    }

    const year = date.year;
    const month = String(date.month + 1).padStart(2, '0');
    const day = String(date.day).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private buildTransaction(): Transaction {
    const formValue = this.form.getRawValue();
    const editingTransaction = this.editingTransaction();

    return {
      id: editingTransaction?.id ?? crypto.randomUUID(),
      type: formValue.type as Transaction['type'],
      category: formValue.category as string,
      amount: formValue.amount as number,
      transactionDate: this.formatTransactionDate(formValue.transactionDate),
      comment: formValue.comment.trim(),
      createdAt: editingTransaction?.createdAt ?? new Date().toISOString(),
    };
  }

  private parseTransactionDate(date: string): TuiDay | null {
    if (!date) {
      return null;
    }

    const [year, month, day] = date.split('-').map(Number);

    if (!year || !month || !day) {
      return null;
    }

    return new TuiDay(year, month - 1, day);
  }

  private fillFormForEditing(transaction: Transaction): void {
    this.form.patchValue({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      transactionDate: this.parseTransactionDate(transaction.transactionDate),
      addComment: Boolean(transaction.comment),
      comment: transaction.comment,
    });

    this.form.markAsUntouched();
  }

  cancelEdit(): void {
    this.resetFormState();
  }

  private resetFormState(): void {
    this.transactionsStorage.cancelEditing();

    this.form.reset({
      type: null,
      category: null,
      amount: null,
      transactionDate: null,
      addComment: false,
      comment: '',
    });

    this.form.markAsUntouched();
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const transaction = this.buildTransaction();

    if (this.isEditMode()) {
      this.transactionsStorage.updateTransaction(transaction);

      this.alerts
        .open('Транзакция успешно обновлена', {
          appearance: 'success',
          label: 'Успех',
        })
        .subscribe();
    } else {
      this.transactionsStorage.saveTransaction(transaction);

      this.alerts
        .open('Транзакция успешно сохранена', {
          appearance: 'success',
          label: 'Успех',
        })
        .subscribe();
    }

    this.resetFormState();
  }
}
