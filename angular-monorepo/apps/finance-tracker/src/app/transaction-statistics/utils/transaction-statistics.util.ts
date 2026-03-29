import { Transaction } from '../../transaction-form/types/transaction.types';
import { ChartItem } from '../types/chart-item.types';

export function buildChartItems(
  transactions: readonly Transaction[],
): ChartItem[] {
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

export function mapChartValues(items: readonly ChartItem[]): number[] {
  return items.map((item) => item.value);
}

export function mapChartLabels(items: readonly ChartItem[]): string[] {
  return items.map((item) => item.label);
}

export function getActiveChartSum(
  index: number,
  values: readonly number[],
  total: number,
): number {
  return (Number.isNaN(index) ? total : values[index]) ?? 0;
}

export function getActiveChartLabel(
  index: number,
  labels: readonly string[],
  fallback: string,
): string {
  return (Number.isNaN(index) ? fallback : labels[index]) ?? '';
}
