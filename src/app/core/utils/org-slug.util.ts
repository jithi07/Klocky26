// ─────────────────────────────────────────────────────────────────────────────
// Org slug format — shared between registration (client-side form validation)
// and authGuard (validating the `:orgSlug` URL param before trusting it).
//
// Lowercase alphanumeric + hyphens, 1–63 chars, no leading/trailing hyphen —
// matches what `POST /api/org/auth/register` derives slugs as.
// ─────────────────────────────────────────────────────────────────────────────

export const ORG_SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$|^[a-z0-9]$/;

export function isValidOrgSlugFormat(slug: string): boolean {
  return ORG_SLUG_PATTERN.test(slug.toLowerCase());
}
