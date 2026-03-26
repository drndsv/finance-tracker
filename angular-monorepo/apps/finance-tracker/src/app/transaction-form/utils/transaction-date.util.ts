import { TuiDay } from '@taiga-ui/cdk';

export function formatTransactionDate(date: TuiDay | null): string {
  if (!date) {
    return '';
  }

  const year = date.year;
  const month = String(date.month + 1).padStart(2, '0');
  const day = String(date.day).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function parseTransactionDate(date: string): TuiDay | null {
  if (!date) {
    return null;
  }

  const [year, month, day] = date.split('-').map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new TuiDay(year, month - 1, day);
}
