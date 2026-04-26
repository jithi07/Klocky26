import {
  Component, Input, forwardRef, ChangeDetectionStrategy
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'ui-textarea',
  standalone: true,
  imports: [NgIf, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UiTextareaComponent),
    multi: true,
  }],
  template: `
    <div class="ui-field" [class.has-error]="error">
      <label *ngIf="label" class="ui-label">{{ label }}
        <span class="required" *ngIf="required">*</span>
      </label>
      <textarea
        class="ui-textarea"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [rows]="rows"
        [(ngModel)]="value"
        (ngModelChange)="onChange($event)"
        (blur)="onTouched()"
      ></textarea>
      <div class="ui-footer">
        <span class="ui-hint" *ngIf="hint && !error">{{ hint }}</span>
        <span class="ui-error" *ngIf="error">{{ error }}</span>
        <span class="ui-count" *ngIf="maxLength">{{ value?.length || 0 }}/{{ maxLength }}</span>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .ui-field { display: flex; flex-direction: column; gap: 4px; }
    .ui-label { font-size: 13px; font-weight: 620; color: #374151; }
    .required { color: #ef4444; margin-left: 3px; font-size: 13px; font-weight: 700; position: relative; top: -1px; }

    .ui-textarea {
      border: 1.5px solid #e2e8f0; border-radius: 10px;
      padding: 10px 14px; font-size: 14px; color: #1e293b;
      font-family: inherit; resize: vertical; outline: none;
      transition: border-color .15s, box-shadow .15s;
      background: #fff; min-height: 80px;
    }
    .ui-textarea:focus {
      border-color: var(--accent, #4f46e5);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent, #4f46e5) 12%, transparent);
    }
    .has-error .ui-textarea { border-color: #ef4444; }
    .has-error .ui-textarea:focus { box-shadow: 0 0 0 3px rgba(239,68,68,.12); }
    .ui-textarea::placeholder { color: #9ca3af; }
    .ui-textarea:disabled { background: #f9fafb; opacity: .6; }

    .ui-footer { display: flex; justify-content: space-between; }
    .ui-hint { font-size: 12px; color: #6b7280; }
    .ui-error { font-size: 12px; color: #ef4444; }
    .ui-count { font-size: 12px; color: #9ca3af; margin-left: auto; }
  `],
})
export class UiTextareaComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() error = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() rows = 4;
  @Input() maxLength: number | null = null;

  value: any = '';
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(val: any) { this.value = val ?? ''; }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
  setDisabledState(d: boolean) { this.disabled = d; }
}
