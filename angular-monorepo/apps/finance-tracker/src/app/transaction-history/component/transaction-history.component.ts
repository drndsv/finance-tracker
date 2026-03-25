import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { TransactionsStorageService } from '../../transaction-form/services/transactions-storage.service';
import { DatePipe } from '@angular/common';
import { TransactionAmountPipe } from '../pipes/transaction-amount-pipe';
import { TuiHint } from '@taiga-ui/core';

@Component({
  selector: 'app-transaction-history',
  imports: [DatePipe, TransactionAmountPipe, TuiHint],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionHistoryComponent {
  private readonly transactionsStorage = inject(TransactionsStorageService);

  readonly sortedTransactions = computed(() => {
    return [...this.transactionsStorage.transactions()].sort(
      (firstTransaction, secondTransaction) =>
        new Date(secondTransaction.transactionDate).getTime() -
        new Date(firstTransaction.transactionDate).getTime(),
    );
  });
}
