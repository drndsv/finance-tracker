import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { startWith } from 'rxjs';
import { TuiButton, TuiGroup, TuiTextfield } from '@taiga-ui/core';
import {
  TuiBlock,
  TuiChevron,
  TuiDataListWrapper,
  TuiRadio,
  TuiSelect,
} from '@taiga-ui/kit';

type TransactionType = 'income' | 'expense';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiBlock,
    TuiRadio,
    TuiButton,
    TuiSelect,
    TuiTextfield,
    TuiDataListWrapper,
    TuiGroup,
    TuiChevron,
  ],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionFormComponent {
  readonly incomeCategories: string[] = [
    'Зарплата',
    'Премия',
    'Фриланс',
    'Подарок',
    'Кэшбэк',
  ];

  readonly expenseCategories: string[] = [
    'Продукты',
    'Транспорт',
    'Кафе',
    'Развлечения',
    'Жильё',
  ];

  readonly form = new FormGroup({
    type: new FormControl<TransactionType | null>(null, {
      validators: [Validators.required],
    }),
    category: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
  });

  readonly typeValue = toSignal(
    this.form.controls.type.valueChanges.pipe(
      startWith(this.form.controls.type.value),
    ),
    { initialValue: this.form.controls.type.value },
  );

  readonly categories = computed(() => {
    if (this.typeValue() === 'income') {
      return this.incomeCategories;
    }

    if (this.typeValue() === 'expense') {
      return this.expenseCategories;
    }

    return [];
  });

  constructor() {
    this.form.controls.type.valueChanges.subscribe(() => {
      this.form.controls.category.setValue(null);
      this.form.controls.category.markAsUntouched();
    });
  }

  get typeControl(): FormControl<TransactionType | null> {
    return this.form.controls.type;
  }

  get categoryControl(): FormControl<string | null> {
    return this.form.controls.category;
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    console.log('Шаг 2 готов:', this.form.getRawValue());
  }
}
