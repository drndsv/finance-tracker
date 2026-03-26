import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { TuiButton, TuiHint } from '@taiga-ui/core';

import { AlertService } from '../../shared/services/alert.service';
import { TransactionsStorageService } from '../../shared/services/transactions-storage.service';
import { Transaction } from '../../transaction-form/types/transaction.types';
import { TransactionAmountPipe } from '../pipes/transaction-amount-pipe';

@Component({
  selector: 'app-transaction-history',
  imports: [DatePipe, TransactionAmountPipe, TuiHint, TuiButton],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('transactionItem', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(12px) scale(0.98)',
        }),
        animate(
          '250ms ease-out',
          style({
            opacity: 1,
            transform: 'translateY(0) scale(1)',
          }),
        ),
      ]),
    ]),
  ],
})
export class TransactionHistoryComponent {
  private readonly transactionsStorage = inject(TransactionsStorageService);
  private readonly alerts = inject(AlertService);

  readonly sortedTransactions = computed(() => {
    return [...this.transactionsStorage.transactions()].sort(
      (firstTransaction, secondTransaction) =>
        new Date(secondTransaction.transactionDate).getTime() -
        new Date(firstTransaction.transactionDate).getTime(),
    );
  });

  editTransaction(transaction: Transaction): void {
    this.transactionsStorage.startEditing(transaction);
    this.alerts.info('Вы редактируете транзакцию');
  }

  deleteTransaction(transactionId: string): void {
    this.transactionsStorage.deleteTransaction(transactionId);
    this.alerts.warning('Транзакция удалена');
  }
}
