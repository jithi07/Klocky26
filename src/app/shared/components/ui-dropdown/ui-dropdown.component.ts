import {
  Component, Input, Output, EventEmitter, forwardRef,
  ChangeDetectionStrategy, ChangeDetectorRef, HostListener, inject
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

export interface DropdownOption {
  label: string;
  value: any;
  disabled?: boolean;
}

@Component({
  selector: 'ui-dropdown',
  standalone: true,
  imports: [NgFor, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UiDropdownComponent),
    multi: true,
  }],
  template: `
    <div class="ui-field" [class.has-error]="error">
      <label *ngIf="label" class="ui-label">{{ label }}
        <span class="required" *ngIf="required">*</span>
      </label>

      <div class="ui-select" [class.open]="isOpen" [class.disabled]="disabled"
           (click)="toggle()" tabindex="0" (keydown.enter)="toggle()"
           (keydown.escape)="close()">
        <span class="selected-text" [class.placeholder]="!selectedLabel">
          {{ selectedLabel || placeholder }}
        </span>
        <svg class="chevron" [class.rotate]="isOpen" width="16" height="16"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      <div class="ui-dropdown-menu" *ngIf="isOpen">
        <div
          *ngFor="let opt of options"
          class="ui-option"
          [class.selected]="opt.value === value"
          [class.disabled]="opt.disabled"
          (click)="select(opt)"
        >
          <span class="checkmark" *ngIf="opt.value === value">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                 stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          {{ opt.label }}
        </div>
        <div class="ui-empty" *ngIf="!options.length">No options</div>
      </div>

      <span class="ui-hint" *ngIf="hint && !error">{{ hint }}</span>
      <span class="ui-error" *ngIf="error">{{ error }}</span>
    </div>
  `,
  styles: [`
    :host { display: block; position: relative; }
    .ui-field { display: flex; flex-direction: column; gap: 4px; }
    .ui-label { font-size: 13px; font-weight: 600; color: #374151; }
    .required { color: #ef4444; margin-left: 3px; font-size: 13px; font-weight: 700; position: relative; top: -1px; }

    .ui-select {
      display: flex; align-items: center; justify-content: space-between;
      border: 1.5px solid #d1d5db; border-radius: 10px;
      padding: 10px 14px; background: #fff; cursor: pointer;
      user-select: none; transition: border-color .15s, box-shadow .15s;
    }
    .ui-select:focus { outline: none; }
    .ui-select.open {
      border-color: var(--accent, #0d9488);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent, #0d9488) 12%, transparent);
    }
    .ui-select.disabled { background: #f9fafb; opacity: .6; pointer-events: none; }
    .has-error .ui-select { border-color: #ef4444; }

    .selected-text { font-size: 14px; color: #111827; }
    .selected-text.placeholder { color: #9ca3af; }
    .chevron { color: #9ca3af; transition: transform .2s; flex-shrink: 0; }
    .chevron.rotate { transform: rotate(180deg); }

    .ui-dropdown-menu {
      position: absolute; left: 0; right: 0; top: calc(100% + 4px);
      background: #fff; border: 1.5px solid #e5e7eb; border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,.1); z-index: 200;
      padding: 4px; max-height: 220px; overflow-y: auto;
    }
    .ui-option {
      display: flex; align-items: center; gap: 8px;
      padding: 9px 12px; border-radius: 7px; font-size: 14px;
      color: #374151; cursor: pointer; transition: background .12s;
    }
    .ui-option:hover { background: color-mix(in srgb, var(--accent, #0d9488) 6%, transparent); }
    .ui-option.selected { background: color-mix(in srgb, var(--accent, #0d9488) 10%, transparent); color: var(--accent, #0d9488); font-weight: 600; }
    .ui-option.disabled { opacity: .4; pointer-events: none; }
    .checkmark { display: flex; color: var(--accent, #0d9488); }
    .ui-empty { padding: 10px 12px; font-size: 13px; color: #9ca3af; text-align: center; }

    .ui-hint { font-size: 12px; color: #6b7280; }
    .ui-error { font-size: 12px; color: #ef4444; }
  `],
})
export class UiDropdownComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = 'Select...';
  @Input() options: DropdownOption[] = [];
  @Input() hint = '';
  @Input() error = '';
  @Input() required = false;
  @Input() disabled = false;

  isOpen = false;
  value: any = null;
  private cdr = inject(ChangeDetectorRef);

  get selectedLabel() {
    return this.options.find(o => o.value === this.value)?.label ?? '';
  }

  onChange = (_: any) => {};
  onTouched = () => {};

  toggle() { if (!this.disabled) { this.isOpen = !this.isOpen; } }
  close() { this.isOpen = false; }

  select(opt: DropdownOption) {
    if (opt.disabled) return;
    this.value = opt.value;
    this.onChange(this.value);
    this.onTouched();
    this.isOpen = false;
    this.cdr.markForCheck();
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    const host = (e.target as HTMLElement).closest('ui-dropdown');
    if (!host) { this.isOpen = false; this.cdr.markForCheck(); }
  }

  writeValue(val: any) { this.value = val; this.cdr.markForCheck(); }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
  setDisabledState(d: boolean) { this.disabled = d; }
}
