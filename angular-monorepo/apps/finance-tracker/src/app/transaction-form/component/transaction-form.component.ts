import { AsyncPipe, CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { TuiDay } from '@taiga-ui/cdk';
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

import { AlertService } from '../../shared/services/alerts/alert.service';
import { TransactionEditingService } from '../../shared/services/transaction-editing.service';
import { TransactionsStorageService } from '../../shared/services/transactions-storage.service';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '../constants/transaction-categories';
import { TRANSACTION_VALIDATION_ERRORS } from '../constants/transaction-validation-errors';
import { CommentValidatorsDirective } from '../directives/comment-validators.directive';
import { createTransactionForm } from '../forms/transaction-form.factory';
import { buildTransactionFromForm } from '../mappers/transaction-form.mapper';
import { Transaction } from '../types/transaction.types';
import { parseTransactionDate } from '../utils/transaction-date.util';

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
  private readonly transactionFormElement = viewChild<
    ElementRef<HTMLFormElement>
  >('transactionFormElement');

  readonly incomeCategories = INCOME_CATEGORIES;
  readonly expenseCategories = EXPENSE_CATEGORIES;
  readonly maxDate = TuiDay.currentLocal();

  private readonly alerts = inject(AlertService);
  private readonly transactionsStorage = inject(TransactionsStorageService);
  private readonly editingService = inject(TransactionEditingService);

  private lastPatchedTransactionId: string | null = null;

  readonly editingTransaction = this.editingService.editingTransaction;
  readonly isEditMode = computed(() => this.editingTransaction() !== null);

  readonly form = createTransactionForm();
  readonly controls = this.form.controls;

  readonly categories = signal<readonly string[]>([]);
  readonly isCommentVisible = signal(false);

  constructor() {
    this.initTypeWatcher();
    this.initCommentWatcher();
    this.initEditingEffect();
    this.syncUiStateFromForm();
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
    this.controls.type.valueChanges.subscribe((type) => {
      this.controls.category.setValue(null);
      this.controls.category.markAsUntouched();
      this.categories.set(this.getCategoriesByType(type));
    });
  }

  private initCommentWatcher(): void {
    this.controls.addComment.valueChanges.subscribe((enabled) => {
      this.isCommentVisible.set(enabled);

      if (!enabled) {
        this.controls.comment.setValue('');
        this.controls.comment.markAsUntouched();
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

    this.syncUiStateFromForm();
    this.form.updateValueAndValidity({ emitEvent: false });
    this.form.markAsUntouched();
  }

  private resetFormState(): void {
    this.editingService.cancelEditing();
    this.lastPatchedTransactionId = null;

    this.form.reset({
      type: null,
      category: null,
      amount: null,
      transactionDate: null,
      addComment: false,
      comment: '',
    });

    this.syncUiStateFromForm();
    this.form.markAsUntouched();
  }

  private syncUiStateFromForm(): void {
    this.categories.set(this.getCategoriesByType(this.controls.type.value));
    this.isCommentVisible.set(this.controls.addComment.value);
  }

  private getCategoriesByType(
    type: 'income' | 'expense' | null,
  ): readonly string[] {
    if (type === 'income') {
      return this.incomeCategories;
    }

    if (type === 'expense') {
      return this.expenseCategories;
    }

    return [];
  }

  private scrollToForm(): void {
    this.transactionFormElement()?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
