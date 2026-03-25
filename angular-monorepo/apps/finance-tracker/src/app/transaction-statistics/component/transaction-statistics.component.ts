import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { TransactionsStorageService } from '../../transaction-form/services/transactions-storage.service';
import { TuiRingChart } from '@taiga-ui/addon-charts';
import { Transaction } from '../../transaction-form/types/transaction.types';
import { tuiSum } from '@taiga-ui/cdk';
import { AsyncPipe } from '@angular/common';
import { TuiAmountPipe } from '@taiga-ui/addon-commerce';

interface ChartItem {
  readonly label: string;
  readonly value: number;
}

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

  readonly incomeItems = computed(() =>
    this.buildChartItems(
      this.transactions().filter(
        (transaction) => transaction.type === 'income',
      ),
    ),
  );

  readonly expenseItems = computed(() =>
    this.buildChartItems(
      this.transactions().filter(
        (transaction) => transaction.type === 'expense',
      ),
    ),
  );

  readonly incomeValues = computed(() =>
    this.incomeItems().map((item) => item.value),
  );

  readonly expenseValues = computed(() =>
    this.expenseItems().map((item) => item.value),
  );

  readonly incomeLabels = computed(() =>
    this.incomeItems().map((item) => item.label),
  );

  readonly expenseLabels = computed(() =>
    this.expenseItems().map((item) => item.label),
  );

  readonly incomeTotal = computed(() => tuiSum(...this.incomeValues()));
  readonly expenseTotal = computed(() => tuiSum(...this.expenseValues()));

  readonly incomeSum = computed(() => {
    const index = this.incomeIndex();
    const values = this.incomeValues();

    return (Number.isNaN(index) ? this.incomeTotal() : values[index]) ?? 0;
  });

  readonly expenseSum = computed(() => {
    const index = this.expenseIndex();
    const values = this.expenseValues();

    return (Number.isNaN(index) ? this.expenseTotal() : values[index]) ?? 0;
  });

  readonly incomeLabel = computed(() => {
    const index = this.incomeIndex();
    const labels = this.incomeLabels();

    return (Number.isNaN(index) ? 'Всего доходов' : labels[index]) ?? '';
  });

  readonly expenseLabel = computed(() => {
    const index = this.expenseIndex();
    const labels = this.expenseLabels();

    return (Number.isNaN(index) ? 'Всего расходов' : labels[index]) ?? '';
  });

  private buildChartItems(transactions: readonly Transaction[]): ChartItem[] {
    const grouped = new Map<string, number>();

    for (const transaction of transactions) {
      const currentValue = grouped.get(transaction.category) ?? 0;

      grouped.set(transaction.category, currentValue + transaction.amount);
    }

    return Array.from(grouped.entries()).map(([label, value]) => ({
      label,
      value,
    }));
  }
}
