import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface OrgRecord {
  id: string;
  name: string;
  slug: string;
  adminEmail: string;
  industry: string;
  employeeCount: number;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'pending';
  registeredAt: string;
  country: string;
}

// Mock data — replace with API calls
const MOCK_ORGS: OrgRecord[] = [
  { id: '1',  name: 'Acme Technologies',    slug: 'acme',     adminEmail: 'admin@acme.com',        industry: 'Technology',         employeeCount: 142, plan: 'pro',        status: 'active',    registeredAt: '2025-11-03', country: 'India'          },
  { id: '2',  name: 'Globex Inc',           slug: 'globex',   adminEmail: 'it@globex.com',          industry: 'Finance & Banking',  employeeCount: 530, plan: 'enterprise', status: 'active',    registeredAt: '2025-09-14', country: 'United States'  },
  { id: '3',  name: 'Stark Industries',     slug: 'stark',    adminEmail: 'tony@stark.io',          industry: 'Manufacturing',      employeeCount: 870, plan: 'enterprise', status: 'active',    registeredAt: '2025-08-01', country: 'United States'  },
  { id: '4',  name: 'Wayne Enterprises',    slug: 'wayne',    adminEmail: 'hr@wayne.com',           industry: 'Consulting',         employeeCount: 210, plan: 'pro',        status: 'active',    registeredAt: '2025-12-22', country: 'United Kingdom' },
  { id: '5',  name: 'Initech Corp',         slug: 'initech',  adminEmail: 'admin@initech.biz',      industry: 'Technology',         employeeCount: 48,  plan: 'starter',    status: 'suspended', registeredAt: '2025-10-05', country: 'Canada'         },
  { id: '6',  name: 'Umbrella Healthcare',  slug: 'umbrella', adminEmail: 'ops@umbrella.org',       industry: 'Healthcare',         employeeCount: 320, plan: 'pro',        status: 'active',    registeredAt: '2026-01-18', country: 'India'          },
  { id: '7',  name: 'Pied Piper',           slug: 'piedpiper',adminEmail: 'richard@piedpiper.com',  industry: 'Technology',         employeeCount: 12,  plan: 'free',       status: 'active',    registeredAt: '2026-02-10', country: 'United States'  },
  { id: '8',  name: 'Dunder Mifflin',       slug: 'dunder',   adminEmail: 'michael@dundermifflin.com', industry: 'Retail & E-commerce',employeeCount: 65,  plan: 'starter',    status: 'active',    registeredAt: '2026-03-01', country: 'United States'  },
  { id: '9',  name: 'Hooli',               slug: 'hooli',    adminEmail: 'ceo@hooli.xyz',          industry: 'Technology',         employeeCount: 4200,plan: 'enterprise', status: 'active',    registeredAt: '2025-07-14', country: 'United States'  },
  { id: '10', name: 'Prestige Worldwide',   slug: 'prestige', adminEmail: 'info@prestige.net',      industry: 'Media & Entertainment', employeeCount: 88, plan: 'starter',   status: 'pending',   registeredAt: '2026-04-20', country: 'Australia'      },
];

@Component({
  selector: 'klocky-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  readonly orgs = signal<OrgRecord[]>(MOCK_ORGS);
  readonly search = signal('');
  readonly statusFilter = signal<'all' | OrgRecord['status']>('all');

  // ── Stats ─────────────────────────────────────────────────────
  readonly totalOrgs       = computed(() => this.orgs().length);
  readonly activeOrgs      = computed(() => this.orgs().filter(o => o.status === 'active').length);
  readonly suspendedOrgs   = computed(() => this.orgs().filter(o => o.status === 'suspended').length);
  readonly totalEmployees  = computed(() => this.orgs().reduce((s, o) => s + o.employeeCount, 0));
  readonly newThisMonth    = computed(() => {
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return this.orgs().filter(o => o.registeredAt.startsWith(ym)).length;
  });

  // ── Filtered list ──────────────────────────────────────────────
  readonly filtered = computed(() => {
    const q = this.search().toLowerCase();
    const s = this.statusFilter();
    return this.orgs().filter(o => {
      const matchSearch = !q || o.name.toLowerCase().includes(q) || o.slug.includes(q) || o.adminEmail.toLowerCase().includes(q);
      const matchStatus = s === 'all' || o.status === s;
      return matchSearch && matchStatus;
    });
  });

  // ── Actions ───────────────────────────────────────────────────
  selectedOrg = signal<OrgRecord | null>(null);

  viewOrg(org: OrgRecord): void { this.selectedOrg.set(org); }
  closeDetail(): void { this.selectedOrg.set(null); }

  toggleSuspend(org: OrgRecord): void {
    this.orgs.update(list =>
      list.map(o => o.id === org.id
        ? { ...o, status: o.status === 'suspended' ? 'active' : 'suspended' }
        : o
      )
    );
    if (this.selectedOrg()?.id === org.id) {
      this.selectedOrg.set(this.orgs().find(o => o.id === org.id) ?? null);
    }
  }

  // ── Helpers ───────────────────────────────────────────────────
  planLabel(plan: OrgRecord['plan']): string {
    return { free: 'Free', starter: 'Starter', pro: 'Pro', enterprise: 'Enterprise' }[plan];
  }

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  onStatusFilter(event: Event): void {
    this.statusFilter.set((event.target as HTMLSelectElement).value as any);
  }
}
