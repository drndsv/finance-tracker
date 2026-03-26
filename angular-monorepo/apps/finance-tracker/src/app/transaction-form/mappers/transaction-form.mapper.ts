import { TransactionType } from '../types/transaction-form.types';
import { TuiDay } from '@taiga-ui/cdk';
import { Transaction } from '../types/transaction.types';
import { formatTransactionDate } from '../utils/transaction-date.util';

interface TransactionFormRawValue {
  type: TransactionType | null;
  category: string | null;
  amount: number | null;
  transactionDate: TuiDay | null;
  addComment: boolean;
  comment: string;
}

export function buildTransactionFromForm(
  formValue: TransactionFormRawValue,
  editingTransaction: Transaction | null,
): Transaction {
  return {
    id: editingTransaction?.id ?? crypto.randomUUID(),
    type: formValue.type as Transaction['type'],
    category: formValue.category as string,
    amount: formValue.amount as number,
    transactionDate: formatTransactionDate(formValue.transactionDate),
    comment: formValue.comment.trim(),
    createdAt: editingTransaction?.createdAt ?? new Date().toISOString(),
  };
}
