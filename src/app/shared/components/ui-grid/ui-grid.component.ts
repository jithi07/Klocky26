import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * Responsive CSS grid wrapper.
 * Usage: <ui-grid [cols]="3" [gap]="16">...</ui-grid>
 * Breakpoints: colsSm (mobile), colsMd (tablet), cols (desktop)
 */
@Component({
  selector: 'ui-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="ui-grid" [style]="gridStyle"><ng-content></ng-content></div>`,
  styles: [`
    .ui-grid { display: grid; width: 100%; }
  `],
})
export class UiGridComponent {
  /** Columns on desktop (≥1024px) */
  @Input() cols = 3;
  /** Columns on tablet (≥640px) */
  @Input() colsMd = 2;
  /** Columns on mobile (<640px) */
  @Input() colsSm = 1;
  /** Gap in px */
  @Input() gap = 16;

  get gridStyle() {
    return {
      'grid-template-columns': `repeat(${this.cols}, minmax(0, 1fr))`,
      'gap': `${this.gap}px`,
    };
  }
}
