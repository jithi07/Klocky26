import {
  Component, Input, forwardRef, ChangeDetectionStrategy
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

export interface RadioOption {
  label: string;
  value: any;
  hint?: string;
  disabled?: boolean;
}

@Component({
  selector: 'ui-radio-group',
  standalone: true,
  imports: [NgFor, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UiRadioGroupComponent),
    multi: true,
  }],
  template: `
    <div class="ui-field">
      <label *ngIf="label" class="ui-label">{{ label }}<span class="required" *ngIf="required">*</span></label>
      <div class="radio-group" [class.horizontal]="direction === 'horizontal'">
        <label
          *ngFor="let opt of options"
          class="radio-item"
          [class.checked]="value === opt.value"
          [class.disabled]="opt.disabled"
          (click)="!opt.disabled && select(opt.value)"
        >
          <span class="radio-dot" [class.checked]="value === opt.value">
            <span class="inner-dot"></span>
          </span>
          <span class="radio-text">
            <span class="radio-label">{{ opt.label }}</span>
            <span class="radio-hint" *ngIf="opt.hint">{{ opt.hint }}</span>
          </span>
        </label>
      </div>
    </div>
  `,
  styles: [`
    .ui-field { display: flex; flex-direction: column; gap: 6px; }
    .ui-label { font-size: 13px; font-weight: 600; color: #374151; }
    .required { color: #ef4444; margin-left: 3px; font-size: 13px; font-weight: 700; position: relative; top: -1px; }

    .radio-group { display: flex; flex-direction: column; gap: 8px; }
    .radio-group.horizontal { flex-direction: row; flex-wrap: wrap; gap: 16px; }

    .radio-item {
      display: flex; align-items: flex-start; gap: 10px;
      cursor: pointer; user-select: none;
    }
    .radio-item.disabled { opacity: .45; pointer-events: none; }

    .radio-dot {
      width: 18px; height: 18px; border-radius: 50%;
      border: 2px solid #d1d5db; flex-shrink: 0; margin-top: 1px;
      display: flex; align-items: center; justify-content: center;
      transition: border-color .15s;
    }
    .radio-dot.checked { border-color: var(--accent, #0d9488); }

    .inner-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--accent, #0d9488); transform: scale(0);
      transition: transform .15s cubic-bezier(.34,1.56,.64,1);
    }
    .radio-dot.checked .inner-dot { transform: scale(1); }

    .radio-text { display: flex; flex-direction: column; gap: 1px; }
    .radio-label { font-size: 14px; color: #111827; }
    .radio-hint { font-size: 12px; color: #6b7280; }
  `],
})
export class UiRadioGroupComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() options: RadioOption[] = [];
  @Input() direction: 'vertical' | 'horizontal' = 'vertical';
  @Input() required = false;

  value: any = null;
  onChange = (_: any) => {};
  onTouched = () => {};

  select(val: any) {
    this.value = val;
    this.onChange(val);
    this.onTouched();
  }

  writeValue(val: any) { this.value = val; }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
}
