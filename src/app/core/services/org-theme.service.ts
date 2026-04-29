import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ORG_THEMES } from '../config/org-themes.const';

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
/** Slug used by the Klocky internal team — always maps to the default theme */
export const KLOCKY_TEAM_SLUG = 'klock';

/** localStorage key for persisting the active org slug across page reloads */
const STORAGE_KEY = 'klocky_org_slug';

const THEMES: Record<string, OrgTheme> = ORG_THEMES;

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class OrgThemeService {

  private readonly doc = inject(DOCUMENT) as Document;
  private _current: OrgTheme = THEMES['globex'];

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

    // Persist so the theme survives page reloads
    if (typeof orgSlugOrTheme === 'string') {
      try { localStorage.setItem(STORAGE_KEY, orgSlugOrTheme); } catch { /* SSR / private-mode */ }
    }
  }

  /**
   * Re-apply the last org theme from localStorage.
   * Call this in ShellComponent.ngOnInit so the theme is restored on reload.
   */
  restoreFromStorage(): void {
    try {
      const slug = localStorage.getItem(STORAGE_KEY);
      this.apply(slug ?? 'default');
    } catch {
      this.apply('default');
    }
  }

  /** Reset to the default app theme and clear persisted slug */
  reset(): void {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
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
