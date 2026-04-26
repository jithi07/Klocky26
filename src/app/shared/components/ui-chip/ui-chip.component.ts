import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

export type ChipVariant = 'active' | 'inactive' | 'inprogress' | 'default' |
  'success' | 'danger' | 'warning' | 'info';

@Component({
  selector: 'ui-chip',
  standalone: true,
  imports: [NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="ui-chip" [class]="'chip-' + variant" [class.dismissible]="dismissible">
      <!-- Status dot -->
      <span class="dot" *ngIf="showDot"></span>
      <ng-content></ng-content>
      <!-- Dismiss button -->
      <button *ngIf="dismissible" class="dismiss" (click)="dismissed.emit()" type="button">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="3" stroke-linecap="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </span>
  `,
  styles: [`
    .ui-chip {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 10px; border-radius: 20px;
      font-size: 12px; font-weight: 600; letter-spacing: .2px;
      white-space: nowrap; line-height: 1.6;
    }

    /* ── Variants ── */
    .chip-active    { background: #dcfce7; color: #15803d; }
    .chip-inactive  { background: #f3f4f6; color: #6b7280; }
    .chip-inprogress{ background: #fef3c7; color: #b45309; }
    .chip-default   { background: #ede9fe; color: #4f46e5; }
    .chip-success   { background: #dcfce7; color: #15803d; }
    .chip-danger    { background: #fee2e2; color: #dc2626; }
    .chip-warning   { background: #fef3c7; color: #d97706; }
    .chip-info      { background: #e0f2fe; color: #0369a1; }

    /* ── Status dot ── */
    .dot {
      width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
    }
    .chip-active .dot     { background: #15803d; }
    .chip-inactive .dot   { background: #9ca3af; }
    .chip-inprogress .dot {
      background: #f59e0b;
      animation: pulse 1.4s ease-in-out infinite;
    }
    .chip-default .dot   { background: #4f46e5; }
    .chip-success .dot   { background: #15803d; }
    .chip-danger .dot    { background: #dc2626; }
    .chip-warning .dot   { background: #d97706; }
    .chip-info .dot      { background: #0369a1; }

    /* ── Dismiss ── */
    .dismiss {
      display: flex; align-items: center; border: none; background: none;
      cursor: pointer; color: currentColor; opacity: .7; padding: 0; margin-left: 2px;
    }
    .dismiss:hover { opacity: 1; }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50%       { transform: scale(1.4); opacity: .6; }
    }
  `],
})
export class UiChipComponent {
  @Input() variant: ChipVariant = 'default';
  @Input() showDot = true;
  @Input() dismissible = false;
  @Output() dismissed = new EventEmitter<void>();
}
