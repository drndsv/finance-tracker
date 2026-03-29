import {
  Directive,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgControl, Validators } from '@angular/forms';

@Directive({
  selector: '[appCommentValidators]',
})
export class CommentValidatorsDirective implements OnChanges {
  private readonly ngControl = inject(NgControl, {
    self: true,
    optional: true,
  });

  @Input({ required: true }) appCommentValidators = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (!('appCommentValidators' in changes) || !this.ngControl?.control) {
      return;
    }

    const control = this.ngControl.control;

    if (this.appCommentValidators) {
      control.setValidators([Validators.required, Validators.maxLength(100)]);
    } else {
      control.clearValidators();
    }

    control.updateValueAndValidity({ emitEvent: false });
  }
}
