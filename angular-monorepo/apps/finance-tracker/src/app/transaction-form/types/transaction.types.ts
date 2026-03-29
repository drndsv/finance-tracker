import { TransactionType } from './transaction-form.types';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  transactionDate: string;
  comment: string;
  createdAt: string;
}
