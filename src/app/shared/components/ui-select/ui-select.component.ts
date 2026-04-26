import {
  Component, Input, forwardRef, ChangeDetectionStrategy
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

export type SelectOption = string | { label: string; value: any };

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UiSelectComponent),
    multi: true,
  }],
  template: `
    <div class="ui-field" [class.has-error]="error">
      <label *ngIf="label" class="ui-label">{{ label }}
        <span class="required" *ngIf="required">*</span>
      </label>
      <div class="ui-select-wrap">
        <select
          class="ui-select"
          [(ngModel)]="value"
          (ngModelChange)="onChange($event)"
          (blur)="onTouched()"
          [disabled]="disabled"
          [attr.name]="name || null"
        >
          <option *ngIf="placeholder" value="">{{ placeholder }}</option>
          <option *ngFor="let o of options" [ngValue]="optionValue(o)">
            {{ optionLabel(o) }}
          </option>
        </select>
        <svg class="ui-chevron" width="13" height="13" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      <span class="ui-hint" *ngIf="hint && !error">{{ hint }}</span>
      <span class="ui-error" *ngIf="error">{{ error }}</span>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .ui-field { display: flex; flex-direction: column; gap: 4px; }

    .ui-label { font-size: 13px; font-weight: 620; color: #374151; }
    .required { color: #ef4444; margin-left: 2px; }

    .ui-select-wrap {
      position: relative;
    }

    .ui-select {
      width: 100%;
      height: 42px;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      padding: 0 36px 0 14px;
      font-size: 14px;
      color: #1e293b;
      background: #fff;
      appearance: none;
      cursor: pointer;
      outline: none;
      font-family: inherit;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .ui-select:focus {
      border-color: var(--accent, #4f46e5);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent, #4f46e5) 12%, transparent);
    }

    .has-error .ui-select { border-color: #ef4444; }
    .has-error .ui-select:focus { box-shadow: 0 0 0 3px rgba(239, 68, 68, .12); }

    .ui-select:disabled { background: #f9fafb; opacity: .6; cursor: not-allowed; }

    .ui-chevron {
      position: absolute;
      right: 11px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: #94a3b8;
    }

    .ui-hint  { font-size: 12px; color: #6b7280; }
    .ui-error { font-size: 12px; color: #ef4444; }
  `],
})
export class UiSelectComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() options: SelectOption[] = [];
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() error = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() name = '';

  value: any = '';

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(val: any) { this.value = val ?? ''; }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
  setDisabledState(d: boolean) { this.disabled = d; }

  optionValue(o: SelectOption): any {
    return typeof o === 'string' ? o : o.value;
  }
  optionLabel(o: SelectOption): string {
    return typeof o === 'string' ? o : o.label;
  }
}
