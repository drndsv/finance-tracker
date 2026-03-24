import { TuiRoot } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';

@Component({
  imports: [
    RouterModule,
    TuiRoot,
    TransactionFormComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {}
