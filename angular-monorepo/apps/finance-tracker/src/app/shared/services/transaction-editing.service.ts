import { Injectable, signal } from '@angular/core';

import { Transaction } from '../../transaction-form/types/transaction.types';

@Injectable({
  providedIn: 'root',
})
export class TransactionEditingService {
  readonly editingTransaction = signal<Transaction | null>(null);

  startEditing(transaction: Transaction): void {
    this.editingTransaction.set(transaction);
  }

  cancelEditing(): void {
    this.editingTransaction.set(null);
  }
}
