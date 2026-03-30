import { Pipe, PipeTransform } from '@angular/core';

import { TransactionType } from '../../transaction-form/types/transaction-form.types';

@Pipe({
  name: 'transactionAmount',
})
export class TransactionAmountPipe implements PipeTransform {
  transform(amount: number, type: TransactionType): string {
    if (amount == null) {
      return '';
    }

    const sign = type === 'income' ? '+' : '-';

    const formattedAmount = new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return `${sign} ${formattedAmount} ₽`;
  }
}
