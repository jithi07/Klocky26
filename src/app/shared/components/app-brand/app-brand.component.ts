import { Component, Input } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { IconKlockyLogoComponent } from '../../icons/icon-klocky-logo.component';

export type BrandSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [NgIf, IconKlockyLogoComponent, CommonModule],
  template: `
    <!-- ── Joint-venture mode ── -->
    <div *ngIf="orgName || orgLogoUrl; else klockyOnly"
         class="brand jv"
         [ngClass]="size">

      <!-- ── Org Side ── -->
      <div class="jv-org">
        <ng-container *ngIf="orgLogoUrl; else orgFallback">
          <img [src]="orgLogoUrl"
               [alt]="orgName"
               class="jv-org-img"/>
        </ng-container>

        <ng-template #orgFallback>
          <div class="jv-org-avatar">
            {{ orgName.charAt(0) }}
          </div>
          <span class="jv-org-name">{{ orgName }}</span>
        </ng-template>
      </div>

      <!-- ── Divider ── -->
      <span class="jv-divider"></span>

      <!-- ── App Branding ── -->
      <div class="jv-klocky">
        <icon-klocky-logo [size]="klockyJvIconSize"></icon-klocky-logo>
        <span class="jv-klocky-label">
          {{ appName }}
        </span>
      </div>
    </div>

    <!-- ── Klocky-only mode ── -->
    <ng-template #klockyOnly>
      <div class="brand" [ngClass]="size">
        <icon-klocky-logo [size]="iconSize"></icon-klocky-logo>
        <span *ngIf="showText" class="brand-name">
          {{ appName }}
        </span>
      </div>
    </ng-template>
  `,
  styles: [`
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      user-select: none;
      white-space: nowrap;
    }

    /* ── Size variants ── */
    .xs { gap: 6px; }
    .sm { gap: 8px; }
    .md { gap: 10px; }
    .lg { gap: 12px; }
    .xl { gap: 16px; }

    /* ── App Name ── */
    .brand-name {
      font-weight: 800;
      letter-spacing: -0.4px;
      background: linear-gradient(135deg, #2e9840 0%, #5dc862 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .xs .brand-name { font-size: 13px; }
    .sm .brand-name { font-size: 15px; }
    .md .brand-name { font-size: 18px; }
    .lg .brand-name { font-size: 22px; }
    .xl .brand-name { font-size: 28px; }

    /* ── JV Layout ── */
    .jv-org {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .jv-org-img {
      height: 40px;
      width: auto;
      max-width: 100px;
      object-fit: contain;
      border-radius: 4px;
    }

    .lg .jv-org-img { height: 32px; }
    .xl .jv-org-img { height: 40px; }

    /* ── Org Avatar Fallback ── */
    .jv-org-avatar {
      height: 40px;
      width: 40px;
      border-radius: 6px;
      background: linear-gradient(135deg, #2e9840, #5dc862);
      color: white;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
    }

    .jv-org-name {
      font-size: 14px;
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.2px;
    }

    .lg .jv-org-name { font-size: 16px; }
    .xl .jv-org-name { font-size: 19px; }

    /* ── Divider ── */
    .jv-divider {
      width: 1px;
      height: 22px;
      background: linear-gradient(to bottom, transparent, #d1d5db, transparent);
      flex-shrink: 0;
    }

    /* ── Klocky Section ── */
    .jv-klocky {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .jv-klocky-label {
      font-size: 11px;
      font-weight: 600;
      color: #6b7280;
      letter-spacing: 0.2px;
    }

    @media (max-width: 640px) {
      .jv-org-name { display: none; }
      .jv-klocky-label { display: none; }
      .jv-divider { display: none; }
      .jv-klocky { display: none; }
    }
  `],
})
export class AppBrandComponent {
  /** Size */
  @Input() size: BrandSize = 'xl';

  /** Show text */
  @Input() showText = true;

  /** App Name (NEW) */
  @Input() appName = 'Klock';

  /** Org Name */
  @Input() orgName = '';

  /** Org Logo */
  @Input() orgLogoUrl = '';

  /** Size map */
  private static iconMap: Record<BrandSize, number> = {
    xs: 22,
    sm: 30,
    md: 38,
    lg: 46,
    xl: 58,
  };

  get iconSize(): number {
    return AppBrandComponent.iconMap[this.size];
  }

  get klockyJvIconSize(): number {
    return AppBrandComponent.iconMap[this.size] - 8;
  }
}