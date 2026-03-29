export const TRANSACTION_FORM_TEXTS = {
  success: {
    created: 'Транзакция успешно сохранена',
    updated: 'Транзакция успешно обновлена',
  },

  titles: {
    create: 'Добавление транзакции',
    edit: 'Редактирование транзакции',
  },

  labels: {
    type: 'Вид транзакции',
    category: 'Категория транзакции',
    amount: 'Сумма транзакции',
    date: 'Дата транзакции',
    addComment: 'Добавить комментарий',
    comment: 'Комментарий к транзакции',
  },

  placeholders: {
    category: 'Выберите категорию',
    amount: 'Введите сумму',
    date: 'Выберите дату',
    comment: 'Напишите комментарий',
  },

  buttons: {
    save: 'Сохранить',
    saveChanges: 'Сохранить изменения',
    cancel: 'Отмена',
  },

  hints: {
    amount: 'Сумма:',
  },
} as const;
