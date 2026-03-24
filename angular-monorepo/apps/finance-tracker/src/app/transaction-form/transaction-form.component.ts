import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiBlock, TuiRadio } from '@taiga-ui/kit';
import { TuiButton, TuiGroup } from '@taiga-ui/core';

type TransactionType = 'income' | 'expense';

@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule, TuiBlock, TuiRadio, TuiButton, TuiGroup],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionFormComponent {
  readonly form = new FormGroup({
    type: new FormControl<TransactionType | null>(null, {
      validators: [Validators.required],
    }),
  });

  get typeControl(): FormControl<TransactionType | null> {
    return this.form.controls.type;
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    console.log('Шаг 1 готов:', this.form.getRawValue());
  }
}
