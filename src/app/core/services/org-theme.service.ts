import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

// ─────────────────────────────────────────────────────────────────────────────
// OrgTheme — the colour contract every organisation provides
// ─────────────────────────────────────────────────────────────────────────────
export interface OrgTheme {
  /** Main brand colour (hex) e.g. "#0d9488" */
  accent: string;
  /** Darker shade of accent for gradients */
  accentDark: string;
  /** Light/pale variant for text & icons on dark backgrounds */
  textAccent: string;
  /** Even lighter pale variant for heading gradients */
  textAccentPale: string;
  /** Dark page background tinted toward the accent */
  pageBg: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Built-in presets — swap or extend as organisations are onboarded
// ─────────────────────────────────────────────────────────────────────────────
const THEMES: Record<string, OrgTheme> = {
  /** Default app theme — Deep Teal / Viridian */
  default: {
    accent:          '#0d9488',
    accentDark:      '#0a6b63',
    textAccent:      '#5eead4',
    textAccentPale:  '#99f6e4',
    pageBg:          '#c3d7d4',
  },

  /** ── HARDCODED ORG THEMES ────────────────────────────────────────────── *
   *  Replace "acme" / "globex" keys with real org slugs or IDs from your    *
   *  backend. Later this entire map can be fetched via API and cached.       *
   * ──────────────────────────────────────────────────────────────────────── */

  /** Acme Corp — deep indigo */
  acme: {
    accent:          '#4f46e5',
    accentDark:      '#3730a3',
    textAccent:      '#a5b4fc',
    textAccentPale:  '#c7d2fe',
    pageBg:          '#07080f',
  },

  /** Globex Inc — warm amber */
  globex: {
    accent:          '#d97706',
    accentDark:      '#b45309',
    textAccent:      '#fcd34d',
    textAccentPale:  '#fde68a',
    pageBg:          '#0d0a03',
  },

  /** Stark Industries — rose */
  stark: {
    accent:          '#e11d48',
    accentDark:      '#be123c',
    textAccent:      '#fda4af',
    textAccentPale:  '#fecdd3',
    pageBg:          '#0d0408',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class OrgThemeService {

  private readonly doc = inject(DOCUMENT) as Document;
  private _current: OrgTheme = THEMES['default'];

  // ── Apply by org slug / id ──────────────────────────────────────────────

  /**
   * Call this after login, once you know the org's slug.
   * Pass a slug that matches a key in THEMES, or a full OrgTheme object.
   *
   * @example
   *   orgThemeService.apply('acme');
   *   orgThemeService.apply({ accent: '#7c3aed', ... });
   */
  apply(orgSlugOrTheme: string | OrgTheme): void {
    const theme: OrgTheme = typeof orgSlugOrTheme === 'string'
      ? (THEMES[orgSlugOrTheme] ?? THEMES['default'])
      : orgSlugOrTheme;

    this._current = theme;
    this._writeCssVars(theme);
  }

  /** Reset to the default app theme */
  reset(): void {
    this.apply('default');
  }

  get current(): OrgTheme {
    return this._current;
  }

  // ── Private ─────────────────────────────────────────────────────────────

  private _writeCssVars(t: OrgTheme): void {
    const root = this.doc.documentElement;
    const rgb = this._hexToRgb(t.accent);
    const rgbLight = this._hexToRgb(t.textAccent);

    root.style.setProperty('--th-page-bg',          t.pageBg);
    root.style.setProperty('--th-accent',            t.accent);
    root.style.setProperty('--th-accent-dark',       t.accentDark);
    root.style.setProperty('--th-text-accent',       t.textAccent);
    root.style.setProperty('--th-text-accent-pale',  t.textAccentPale);

    // RGB channel tokens for rgba() usage in SCSS
    root.style.setProperty('--th-ar', String(rgb.r));
    root.style.setProperty('--th-ag', String(rgb.g));
    root.style.setProperty('--th-ab', String(rgb.b));
    root.style.setProperty('--th-lr', String(rgbLight.r));
    root.style.setProperty('--th-lg', String(rgbLight.g));
    root.style.setProperty('--th-lb', String(rgbLight.b));

    // Keep the shared --accent in sync so ui-input/select/toggle update too
    root.style.setProperty('--accent', t.accent);
  }

  private _hexToRgb(hex: string): { r: number; g: number; b: number } {
    const clean = hex.replace('#', '');
    const int   = parseInt(clean, 16);
    return {
      r: (int >> 16) & 255,
      g: (int >> 8)  & 255,
      b:  int        & 255,
    };
  }
}
