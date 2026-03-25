import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { TransactionsStorageService } from '../../transaction-form/services/transactions-storage.service';
import { Transaction } from '../../transaction-form/types/transaction.types';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transaction-history',
  imports: [DatePipe],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionHistoryComponent {
  private readonly transactionsStorage = inject(TransactionsStorageService);

  readonly transactions = signal<Transaction[]>(
    this.transactionsStorage.getTransactions(),
  );

  readonly sortedTransactions = computed(() => {
    return [...this.transactions()].sort(
      (firstTransaction, secondTransaction) => {
        return (
          new Date(secondTransaction.transactionDate).getTime() -
          new Date(firstTransaction.transactionDate).getTime()
        );
      },
    );
  });
}
