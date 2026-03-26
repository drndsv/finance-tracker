import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { TransactionsStorageService } from '../../transaction-form/services/transactions-storage.service';
import { TuiRingChart } from '@taiga-ui/addon-charts';
import { tuiSum } from '@taiga-ui/cdk';
import { AsyncPipe } from '@angular/common';
import { TuiAmountPipe } from '@taiga-ui/addon-commerce';
import {
  buildChartItems,
  getActiveChartLabel,
  getActiveChartSum,
  mapChartLabels,
  mapChartValues,
} from '../utils/transaction-statistics.util';
import { TransactionType } from '../../transaction-form/types/transaction-form.types';

@Component({
  selector: 'app-transaction-statistics',
  imports: [AsyncPipe, TuiAmountPipe, TuiRingChart],
  templateUrl: './transaction-statistics.component.html',
  styleUrl: './transaction-statistics.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionStatisticsComponent {
  private readonly transactionsStorage = inject(TransactionsStorageService);

  readonly transactions = this.transactionsStorage.transactions;

  readonly incomeIndex = signal<number>(NaN);
  readonly expenseIndex = signal<number>(NaN);

  readonly incomeItems = computed(() => this.getChartItemsByType('income'));
  readonly expenseItems = computed(() => this.getChartItemsByType('expense'));

  readonly incomeValues = computed(() => mapChartValues(this.incomeItems()));
  readonly expenseValues = computed(() => mapChartValues(this.expenseItems()));

  readonly incomeLabels = computed(() => mapChartLabels(this.incomeItems()));
  readonly expenseLabels = computed(() => mapChartLabels(this.expenseItems()));

  readonly incomeTotal = computed(() => tuiSum(...this.incomeValues()));
  readonly expenseTotal = computed(() => tuiSum(...this.expenseValues()));

  readonly incomeSum = computed(() =>
    getActiveChartSum(
      this.incomeIndex(),
      this.incomeValues(),
      this.incomeTotal(),
    ),
  );

  readonly expenseSum = computed(() =>
    getActiveChartSum(
      this.expenseIndex(),
      this.expenseValues(),
      this.expenseTotal(),
    ),
  );

  readonly incomeLabel = computed(() =>
    getActiveChartLabel(
      this.incomeIndex(),
      this.incomeLabels(),
      'Всего доходов',
    ),
  );

  readonly expenseLabel = computed(() =>
    getActiveChartLabel(
      this.expenseIndex(),
      this.expenseLabels(),
      'Всего расходов',
    ),
  );

  private getChartItemsByType(type: TransactionType) {
    const filteredTransactions = this.transactions().filter(
      (transaction) => transaction.type === type,
    );

    return buildChartItems(filteredTransactions);
  }
}
