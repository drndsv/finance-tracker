import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiRoot } from '@taiga-ui/core';

import { TransactionFormComponent } from './transaction-form/component/transaction-form.component';
import { TransactionHistoryComponent } from './transaction-history/component/transaction-history.component';
import { TransactionStatisticsComponent } from './transaction-statistics/component/transaction-statistics.component';

@Component({
  imports: [
    RouterModule,
    TuiRoot,
    TransactionFormComponent,
    TransactionHistoryComponent,
    TransactionStatisticsComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {}
