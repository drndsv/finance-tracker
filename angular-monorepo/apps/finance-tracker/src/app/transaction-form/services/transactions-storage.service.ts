import { Injectable, signal } from '@angular/core';
import { Transaction } from '../types/transaction.types';

@Injectable({
  providedIn: 'root',
})
export class TransactionsStorageService {
  private readonly storageKey = 'finance-tracker-transactions';

  readonly transactions = signal<Transaction[]>(
    this.readTransactionsFromStorage(),
  );

  getTransactions(): Transaction[] {
    return this.transactions();
  }

  saveTransaction(transaction: Transaction): void {
    const updatedTransactions = [transaction, ...this.transactions()];

    this.transactions.set(updatedTransactions);
    this.saveTransactionsToStorage(updatedTransactions);
  }

  setTransactions(transactions: Transaction[]): void {
    this.transactions.set(transactions);
    this.saveTransactionsToStorage(transactions);
  }

  clearTransactions(): void {
    this.transactions.set([]);
    localStorage.removeItem(this.storageKey);
  }

  private readTransactionsFromStorage(): Transaction[] {
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

  private saveTransactionsToStorage(transactions: Transaction[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(transactions));
  }
}
