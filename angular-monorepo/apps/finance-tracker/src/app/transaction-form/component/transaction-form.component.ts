import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { TuiButton, TuiError, TuiGroup, TuiTextfield } from '@taiga-ui/core';
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
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { TuiDay } from '@taiga-ui/cdk';
import { CommentValidatorsDirective } from '../directives/comment-validators.directive';
import { TransactionType } from '../types/transaction-form.types';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '../constants/transaction-categories';
import { TRANSACTION_VALIDATION_ERRORS } from '../constants/transaction-validation-errors';
import { TransactionsStorageService } from '../../shared/services/transactions-storage.service';
import { Transaction } from '../types/transaction.types';
import { createTransactionForm } from '../forms/transaction-form.factory';
import { buildTransactionFromForm } from '../mappers/transaction-form.mapper';
import { parseTransactionDate } from '../utils/transaction-date.util';
import { AlertService } from '../../shared/services/alert.service';

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
  @ViewChild('transactionFormElement')
  private readonly transactionFormElement?: ElementRef<HTMLFormElement>;

  readonly incomeCategories = INCOME_CATEGORIES;
  readonly expenseCategories = EXPENSE_CATEGORIES;
  readonly maxDate = TuiDay.currentLocal();

  private readonly alerts = inject(AlertService);
  private readonly transactionsStorage = inject(TransactionsStorageService);

  private lastPatchedTransactionId: string | null = null;

  readonly editingTransaction = this.transactionsStorage.editingTransaction;
  readonly isEditMode = computed(() => this.editingTransaction() !== null);

  readonly form = createTransactionForm();

  get addCommentValue(): boolean {
    return this.form.controls.addComment.value;
  }

  get categories(): readonly string[] {
    const transactionType = this.form.controls.type.value;

    if (transactionType === 'income') {
      return this.incomeCategories;
    }

    if (transactionType === 'expense') {
      return this.expenseCategories;
    }

    return [];
  }

  constructor() {
    this.initTypeWatcher();
    this.initCommentWatcher();
    this.initEditingEffect();
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

  cancelEdit(): void {
    this.resetFormState();
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const transaction = buildTransactionFromForm(
      this.form.getRawValue(),
      this.editingTransaction(),
    );

    if (this.isEditMode()) {
      this.transactionsStorage.updateTransaction(transaction);
      this.alerts.success('Транзакция успешно обновлена');
    } else {
      this.transactionsStorage.saveTransaction(transaction);
      this.alerts.success('Транзакция успешно сохранена');
    }

    this.resetFormState();
  }

  private initTypeWatcher(): void {
    this.form.controls.type.valueChanges.subscribe(() => {
      this.form.controls.category.setValue(null);
      this.form.controls.category.markAsUntouched();
    });
  }

  private initCommentWatcher(): void {
    this.form.controls.addComment.valueChanges.subscribe((enabled) => {
      if (!enabled) {
        this.form.controls.comment.setValue('');
        this.form.controls.comment.markAsUntouched();
      }
    });
  }

  private initEditingEffect(): void {
    effect(() => {
      const transaction = this.editingTransaction();

      if (!transaction) {
        this.lastPatchedTransactionId = null;
        return;
      }

      if (this.lastPatchedTransactionId === transaction.id) {
        return;
      }

      this.fillFormForEditing(transaction);
      this.lastPatchedTransactionId = transaction.id;

      requestAnimationFrame(() => {
        this.scrollToForm();
      });
    });
  }

  private fillFormForEditing(transaction: Transaction): void {
    this.form.patchValue(
      {
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        transactionDate: parseTransactionDate(transaction.transactionDate),
        addComment: Boolean(transaction.comment),
        comment: transaction.comment,
      },
      { emitEvent: false },
    );

    this.form.updateValueAndValidity({ emitEvent: false });
    this.form.markAsUntouched();
  }

  private resetFormState(): void {
    this.transactionsStorage.cancelEditing();
    this.lastPatchedTransactionId = null;

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

  private scrollToForm(): void {
    this.transactionFormElement?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
