import {
  Directive, Input, HostListener, ElementRef, Renderer2, inject,
  OnDestroy
} from '@angular/core';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[tooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  @Input('tooltip') text = '';
  @Input() tooltipPosition: TooltipPosition = 'top';
  @Input() tooltipDelay = 200;

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private tip: HTMLElement | null = null;
  private timer: any;

  @HostListener('mouseenter') onEnter() {
    if (!this.text) return;
    this.timer = setTimeout(() => this.show(), this.tooltipDelay);
  }

  @HostListener('mouseleave') onLeave() {
    clearTimeout(this.timer);
    this.hide();
  }

  @HostListener('focus') onFocus() { if (!this.text) return; this.show(); }
  @HostListener('blur')  onBlur()  { this.hide(); }

  private show() {
    this.hide();
    const tip = this.renderer.createElement('div') as HTMLElement;
    tip.className = `ui-tooltip tooltip-${this.tooltipPosition}`;
    tip.textContent = this.text;
    this.renderer.appendChild(document.body, tip);
    this.tip = tip;

    const rect = this.el.nativeElement.getBoundingClientRect();
    const t = tip.getBoundingClientRect();

    const gap = 8;
    let top = 0; let left = 0;

    switch (this.tooltipPosition) {
      case 'top':
        top = rect.top + window.scrollY - t.height - gap;
        left = rect.left + window.scrollX + (rect.width - t.width) / 2;
        break;
      case 'bottom':
        top = rect.bottom + window.scrollY + gap;
        left = rect.left + window.scrollX + (rect.width - t.width) / 2;
        break;
      case 'left':
        top = rect.top + window.scrollY + (rect.height - t.height) / 2;
        left = rect.left + window.scrollX - t.width - gap;
        break;
      case 'right':
        top = rect.top + window.scrollY + (rect.height - t.height) / 2;
        left = rect.right + window.scrollX + gap;
        break;
    }

    tip.style.top = `${top}px`;
    tip.style.left = `${left}px`;

    requestAnimationFrame(() => tip.classList.add('visible'));
  }

  private hide() {
    if (this.tip) {
      this.renderer.removeChild(document.body, this.tip);
      this.tip = null;
    }
  }

  ngOnDestroy() { this.hide(); clearTimeout(this.timer); }
}
