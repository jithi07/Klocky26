import {
  Component, Input, Output, EventEmitter, forwardRef,
  ChangeDetectionStrategy, ChangeDetectorRef, HostListener, inject
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

export interface MultiSelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'ui-multiselect',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UiMultiSelectComponent),
    multi: true,
  }],
  template: `
    <div class="ui-field">
      <label *ngIf="label" class="ui-label">{{ label }}
        <span class="required" *ngIf="required">*</span>
      </label>

      <div class="ui-select" [class.open]="isOpen" [class.disabled]="disabled"
           (click)="toggle()" tabindex="0"
           (keydown.escape)="close()">
        <!-- chips for selected items -->
        <div class="chips-wrap">
          <ng-container *ngIf="selected.length; else emptyPlaceholder">
            <span class="chip" *ngFor="let s of selected" (click)="$event.stopPropagation(); remove(s)">
              {{ labelOf(s) }}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="3" stroke-linecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </span>
          </ng-container>
          <ng-template #emptyPlaceholder>
            <span class="placeholder">{{ placeholder }}</span>
          </ng-template>
        </div>
        <svg class="chevron" [class.rotate]="isOpen" width="16" height="16"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      <div class="ui-dropdown-menu" *ngIf="isOpen">
        <!-- Search within options -->
        <div class="menu-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="#9ca3af" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input [(ngModel)]="searchTerm" placeholder="Search..." (click)="$event.stopPropagation()" />
        </div>
        <div
          *ngFor="let opt of filtered"
          class="ui-option"
          [class.selected]="isSelected(opt.value)"
          (click)="$event.stopPropagation(); toggleOption(opt)"
        >
          <span class="checkbox" [class.checked]="isSelected(opt.value)">
            <svg *ngIf="isSelected(opt.value)" width="10" height="10" viewBox="0 0 24 24"
                 fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"
                 stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          {{ opt.label }}
        </div>
        <div class="ui-empty" *ngIf="!filtered.length">No matches</div>
      </div>
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
      padding: 6px 14px; background: #fff; cursor: pointer;
      min-height: 44px; transition: border-color .15s, box-shadow .15s;
      gap: 8px;
    }
    .ui-select:focus { outline: none; }
    .ui-select.open {
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79,70,229,.12);
    }
    .ui-select.disabled { background: #f9fafb; opacity: .6; pointer-events: none; }

    .chips-wrap { display: flex; flex-wrap: wrap; gap: 4px; flex: 1; }
    .chip {
      display: flex; align-items: center; gap: 4px;
      background: #ede9fe; color: #4f46e5; border-radius: 20px;
      padding: 2px 8px; font-size: 12px; font-weight: 500;
      cursor: pointer; transition: background .12s;
    }
    .chip:hover { background: #ddd6fe; }
    .placeholder { font-size: 14px; color: #9ca3af; }

    .chevron { color: #9ca3af; transition: transform .2s; flex-shrink: 0; }
    .chevron.rotate { transform: rotate(180deg); }

    .ui-dropdown-menu {
      position: absolute; left: 0; right: 0; top: calc(100% + 4px);
      background: #fff; border: 1.5px solid #e5e7eb; border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,.1); z-index: 200;
      padding: 4px; max-height: 240px; overflow-y: auto;
    }
    .menu-search {
      display: flex; align-items: center; gap: 8px;
      padding: 6px 10px; border-bottom: 1px solid #f3f4f6; margin-bottom: 4px;
    }
    .menu-search input {
      border: none; outline: none; font-size: 13px;
      color: #111827; flex: 1; background: transparent;
    }
    .ui-option {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 12px; border-radius: 7px; font-size: 14px;
      color: #374151; cursor: pointer; transition: background .12s;
    }
    .ui-option:hover { background: #f5f3ff; }
    .ui-option.selected { color: #4f46e5; }

    .checkbox {
      width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid #d1d5db;
      flex-shrink: 0; display: flex; align-items: center; justify-content: center;
      transition: border-color .12s, background .12s;
    }
    .checkbox.checked { border-color: #4f46e5; background: #4f46e5; }

    .ui-empty { padding: 10px 12px; font-size: 13px; color: #9ca3af; text-align: center; }
  `],
})
export class UiMultiSelectComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = 'Select...';
  @Input() options: MultiSelectOption[] = [];
  @Input() required = false;
  @Input() disabled = false;

  isOpen = false;
  selected: any[] = [];
  searchTerm = '';

  private cdr = inject(ChangeDetectorRef);
  onChange = (_: any) => {};
  onTouched = () => {};

  get filtered() {
    const q = this.searchTerm.toLowerCase();
    return q ? this.options.filter(o => o.label.toLowerCase().includes(q)) : this.options;
  }

  labelOf(val: any) { return this.options.find(o => o.value === val)?.label ?? val; }
  isSelected(val: any) { return this.selected.includes(val); }

  toggle() { if (!this.disabled) { this.isOpen = !this.isOpen; } }
  close() { this.isOpen = false; }

  toggleOption(opt: MultiSelectOption) {
    const idx = this.selected.indexOf(opt.value);
    if (idx > -1) this.selected.splice(idx, 1);
    else this.selected.push(opt.value);
    this.onChange([...this.selected]);
    this.cdr.markForCheck();
  }

  remove(val: any) {
    this.selected = this.selected.filter(s => s !== val);
    this.onChange([...this.selected]);
    this.cdr.markForCheck();
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    const host = (e.target as HTMLElement).closest('ui-multiselect');
    if (!host) { this.isOpen = false; this.cdr.markForCheck(); }
  }

  writeValue(val: any[]) { this.selected = Array.isArray(val) ? [...val] : []; this.cdr.markForCheck(); }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
  setDisabledState(d: boolean) { this.disabled = d; }
}
