import { Injectable, inject } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';

type AlertAppearance = 'success' | 'error' | 'info' | 'warning';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly alerts = inject(TuiAlertService);

  show(
    message: string,
    appearance: AlertAppearance = 'info',
    label = 'Уведомление',
  ): void {
    this.alerts
      .open(message, {
        appearance,
        label,
      })
      .subscribe();
  }

  success(message: string): void {
    this.show(message, 'success', 'Успех');
  }

  error(message: string): void {
    this.show(message, 'error', 'Ошибка');
  }

  info(message: string): void {
    this.show(message, 'info', 'Информация');
  }

  warning(message: string): void {
    this.show(message, 'warning', 'Внимание');
  }
}
