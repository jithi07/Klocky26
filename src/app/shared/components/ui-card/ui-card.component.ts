import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ui-card" [class]="'shadow-' + shadow" [class.hoverable]="hoverable" [class.bordered]="bordered">
      <!-- Header slot -->
      <div class="card-header" *ngIf="title || hasHeaderSlot">
        <div class="card-title-wrap">
          <h3 class="card-title" *ngIf="title">{{ title }}</h3>
          <p class="card-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
        </div>
        <div class="card-header-actions">
          <ng-content select="[card-actions]"></ng-content>
        </div>
      </div>
      <!-- Body -->
      <div class="card-body" [class.no-padding]="noPadding">
        <ng-content></ng-content>
      </div>
      <!-- Footer slot -->
      <div class="card-footer">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .ui-card {
      background: #fff; border-radius: 14px; overflow: hidden;
      transition: box-shadow .2s, transform .2s;
    }
    .shadow-none  { box-shadow: none; }
    .shadow-sm    { box-shadow: 0 1px 4px rgba(0,0,0,.07); }
    .shadow-md    { box-shadow: 0 4px 16px rgba(0,0,0,.08); }
    .shadow-lg    { box-shadow: 0 8px 32px rgba(0,0,0,.1); }

    .bordered { border: 1.5px solid #e5e7eb; }
    .hoverable:hover { box-shadow: 0 8px 28px rgba(79,70,229,.12); transform: translateY(-2px); }

    .card-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      padding: 18px 20px 0; gap: 10px;
    }
    .card-title {
      margin: 0; font-size: 15px; font-weight: 700; color: #111827;
    }
    .card-subtitle {
      margin: 3px 0 0; font-size: 13px; color: #6b7280;
    }
    .card-header-actions { flex-shrink: 0; display: flex; align-items: center; gap: 8px; }

    .card-body { padding: 18px 20px; }
    .card-body.no-padding { padding: 0; }

    .card-footer {
      padding: 0 20px 16px;
      display: flex; gap: 8px; align-items: center;
    }
    .card-footer:empty { display: none; }
  `],
})
export class UiCardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() shadow: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() hoverable = false;
  @Input() bordered = false;
  @Input() noPadding = false;
  hasHeaderSlot = true;
}
