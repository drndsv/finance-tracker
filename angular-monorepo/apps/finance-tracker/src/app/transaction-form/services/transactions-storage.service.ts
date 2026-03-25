import { Injectable } from '@angular/core';
import { Transaction } from '../types/transaction.types';

@Injectable({
  providedIn: 'root',
})
export class TransactionsStorageService {
  private readonly storageKey = 'finance-tracker-transactions';

  getTransactions(): Transaction[] {
    const rawTransactions = localStorage.getItem(this.storageKey);

    if (!rawTransactions) {
      return [];
    }

    try {
      return JSON.parse(rawTransactions) as Transaction[];
    } catch {
      return [];
    }
  }

  saveTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();

    transactions.unshift(transaction);

    localStorage.setItem(this.storageKey, JSON.stringify(transactions));
  }

  setTransactions(transactions: Transaction[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(transactions));
  }

  clearTransactions(): void {
    localStorage.removeItem(this.storageKey);
  }
}
