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

  readonly editingTransaction = signal<Transaction | null>(null);

  getTransactions(): Transaction[] {
    return this.transactions();
  }

  saveTransaction(transaction: Transaction): void {
    const updatedTransactions = [transaction, ...this.transactions()];

    this.transactions.set(updatedTransactions);
    this.saveTransactionsToStorage(updatedTransactions);
  }

  updateTransaction(updatedTransaction: Transaction): void {
    const updatedTransactions = this.transactions().map((transaction) =>
      transaction.id === updatedTransaction.id
        ? updatedTransaction
        : transaction,
    );

    this.transactions.set(updatedTransactions);
    this.saveTransactionsToStorage(updatedTransactions);
  }

  deleteTransaction(transactionId: string): void {
    const updatedTransactions = this.transactions().filter(
      (transaction) => transaction.id !== transactionId,
    );

    if (this.editingTransaction()?.id === transactionId) {
      this.editingTransaction.set(null);
    }

    this.transactions.set(updatedTransactions);
    this.saveTransactionsToStorage(updatedTransactions);
  }

  startEditing(transaction: Transaction): void {
    this.editingTransaction.set(transaction);
  }

  cancelEditing(): void {
    this.editingTransaction.set(null);
  }

  setTransactions(transactions: Transaction[]): void {
    this.transactions.set(transactions);
    this.saveTransactionsToStorage(transactions);
  }

  clearTransactions(): void {
    this.transactions.set([]);
    this.editingTransaction.set(null);
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
