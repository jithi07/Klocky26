import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'ui-search',
  standalone: true,
  imports: [FormsModule, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ui-search" [class.focused]="focused">
      <!-- Search icon -->
      <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
      <input
        class="ui-search-input"
        type="search"
        [placeholder]="placeholder"
        [(ngModel)]="value"
        (ngModelChange)="searched.emit($event)"
        (focus)="focused = true"
        (blur)="focused = false"
      />
      <!-- Clear button -->
      <button *ngIf="value" class="clear-btn" (click)="clear()" type="button">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .ui-search {
      display: flex; align-items: center; gap: 8px;
      border: 1.5px solid #d1d5db; border-radius: 24px;
      background: #f9fafb; padding: 0 14px;
      transition: border-color .15s, box-shadow .15s, background .15s;
    }
    .ui-search.focused {
      border-color: #4f46e5; background: #fff;
      box-shadow: 0 0 0 3px rgba(79,70,229,.12);
    }
    .search-icon { color: #9ca3af; flex-shrink: 0; }
    .ui-search.focused .search-icon { color: #4f46e5; }

    .ui-search-input {
      flex: 1; border: none; outline: none; background: transparent;
      font-size: 14px; color: #111827; padding: 9px 0;
    }
    .ui-search-input::placeholder { color: #9ca3af; }
    .ui-search-input::-webkit-search-cancel-button { display: none; }

    .clear-btn {
      display: flex; align-items: center; border: none; background: none;
      cursor: pointer; color: #9ca3af; padding: 2px; border-radius: 50%;
    }
    .clear-btn:hover { color: #374151; }
  `],
})
export class UiSearchComponent {
  @Input() placeholder = 'Search...';
  @Output() searched = new EventEmitter<string>();

  value = '';
  focused = false;

  clear() {
    this.value = '';
    this.searched.emit('');
  }
}
