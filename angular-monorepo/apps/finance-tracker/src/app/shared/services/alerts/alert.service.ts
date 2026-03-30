import { Injectable, inject } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';

import { ALERT_LABELS } from './alert.constants';
import { AlertAppearance } from './alert.types';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly alerts = inject(TuiAlertService);

  show(
    message: string,
    appearance: AlertAppearance = 'info',
    label: string = ALERT_LABELS.DEFAULT,
  ): void {
    this.alerts
      .open(message, {
        appearance,
        label,
      })
      .subscribe();
  }

  success(message: string): void {
    this.show(message, 'success', ALERT_LABELS.SUCCESS);
  }

  error(message: string): void {
    this.show(message, 'error', ALERT_LABELS.ERROR);
  }

  info(message: string): void {
    this.show(message, 'info', ALERT_LABELS.INFO);
  }

  warning(message: string): void {
    this.show(message, 'warning', ALERT_LABELS.WARNING);
  }
}
