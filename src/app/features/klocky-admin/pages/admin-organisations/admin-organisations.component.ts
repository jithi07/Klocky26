import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrgRecord } from '../admin-dashboard/admin-dashboard.component';

const MOCK_ORGS: OrgRecord[] = [
  { id: '1',  name: 'Acme Technologies',   slug: 'acme',      adminEmail: 'admin@acme.com',            industry: 'Technology',            employeeCount: 142,  plan: 'pro',        status: 'active',    registeredAt: '2025-11-03', country: 'India'          },
  { id: '2',  name: 'Globex Inc',          slug: 'globex',    adminEmail: 'it@globex.com',             industry: 'Finance & Banking',     employeeCount: 530,  plan: 'enterprise', status: 'active',    registeredAt: '2025-09-14', country: 'United States'  },
  { id: '3',  name: 'Stark Industries',    slug: 'stark',     adminEmail: 'tony@stark.io',             industry: 'Manufacturing',         employeeCount: 870,  plan: 'enterprise', status: 'active',    registeredAt: '2025-08-01', country: 'United States'  },
  { id: '4',  name: 'Wayne Enterprises',   slug: 'wayne',     adminEmail: 'hr@wayne.com',              industry: 'Consulting',            employeeCount: 210,  plan: 'pro',        status: 'active',    registeredAt: '2025-12-22', country: 'United Kingdom' },
  { id: '5',  name: 'Initech Corp',        slug: 'initech',   adminEmail: 'admin@initech.biz',         industry: 'Technology',            employeeCount: 48,   plan: 'starter',    status: 'suspended', registeredAt: '2025-10-05', country: 'Canada'         },
  { id: '6',  name: 'Umbrella Healthcare', slug: 'umbrella',  adminEmail: 'ops@umbrella.org',          industry: 'Healthcare',            employeeCount: 320,  plan: 'pro',        status: 'active',    registeredAt: '2026-01-18', country: 'India'          },
  { id: '7',  name: 'Pied Piper',          slug: 'piedpiper', adminEmail: 'richard@piedpiper.com',     industry: 'Technology',            employeeCount: 12,   plan: 'free',       status: 'active',    registeredAt: '2026-02-10', country: 'United States'  },
  { id: '8',  name: 'Dunder Mifflin',      slug: 'dunder',    adminEmail: 'michael@dundermifflin.com', industry: 'Retail & E-commerce',   employeeCount: 65,   plan: 'starter',    status: 'active',    registeredAt: '2026-03-01', country: 'United States'  },
  { id: '9',  name: 'Hooli',              slug: 'hooli',     adminEmail: 'ceo@hooli.xyz',             industry: 'Technology',            employeeCount: 4200, plan: 'enterprise', status: 'active',    registeredAt: '2025-07-14', country: 'United States'  },
  { id: '10', name: 'Prestige Worldwide',  slug: 'prestige',  adminEmail: 'info@prestige.net',         industry: 'Media & Entertainment', employeeCount: 88,   plan: 'starter',    status: 'pending',   registeredAt: '2026-04-20', country: 'Australia'      },
  { id: '11', name: 'Soylent Corp',        slug: 'soylent',   adminEmail: 'admin@soylent.co',          industry: 'Healthcare',            employeeCount: 230,  plan: 'pro',        status: 'active',    registeredAt: '2026-04-01', country: 'Canada'         },
  { id: '12', name: 'Massive Dynamic',     slug: 'massive',   adminEmail: 'nina@massivedynamic.com',   industry: 'Technology',            employeeCount: 1100, plan: 'enterprise', status: 'active',    registeredAt: '2025-06-15', country: 'United States'  },
];

export type OrgPlan = OrgRecord['plan'];
export type OrgStatus = OrgRecord['status'];

@Component({
  selector: 'klocky-admin-organisations',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './admin-organisations.component.html',
  styleUrl: './admin-organisations.component.scss',
})
export class AdminOrganisationsComponent {
  readonly orgs = signal<OrgRecord[]>(MOCK_ORGS);

  readonly search       = signal('');
  readonly statusFilter = signal<'all' | OrgStatus>('all');
  readonly planFilter   = signal<'all' | OrgPlan>('all');

  readonly selectedOrg  = signal<OrgRecord | null>(null);
  readonly showInvite   = signal(false);
  readonly inviteEmail  = signal('');

  // ── Filtered list ─────────────────────────────────────────────
  readonly filtered = computed(() => {
    const q = this.search().toLowerCase();
    const s = this.statusFilter();
    const p = this.planFilter();
    return this.orgs().filter(o => {
      const matchQ = !q || o.name.toLowerCase().includes(q)
                       || o.slug.includes(q)
                       || o.adminEmail.toLowerCase().includes(q)
                       || o.country.toLowerCase().includes(q);
      const matchS = s === 'all' || o.status === s;
      const matchP = p === 'all' || o.plan === p;
      return matchQ && matchS && matchP;
    });
  });

  // ── Stats ─────────────────────────────────────────────────────
  readonly totalOrgs      = computed(() => this.orgs().length);
  readonly activeOrgs     = computed(() => this.orgs().filter(o => o.status === 'active').length);
  readonly suspendedOrgs  = computed(() => this.orgs().filter(o => o.status === 'suspended').length);
  readonly pendingOrgs    = computed(() => this.orgs().filter(o => o.status === 'pending').length);
  readonly enterpriseOrgs = computed(() => this.orgs().filter(o => o.plan === 'enterprise').length);

  // ── Actions ───────────────────────────────────────────────────
  viewOrg(org: OrgRecord): void  { this.selectedOrg.set(org); }
  closeDetail(): void            { this.selectedOrg.set(null); }

  toggleSuspend(org: OrgRecord): void {
    const next = org.status === 'suspended' ? 'active' : 'suspended';
    this.orgs.update(list => list.map(o => o.id === org.id ? { ...o, status: next } : o));
    if (this.selectedOrg()?.id === org.id) {
      this.selectedOrg.set(this.orgs().find(o => o.id === org.id) ?? null);
    }
  }

  setOrgPlan(org: OrgRecord, plan: OrgPlan): void {
    this.orgs.update(list => list.map(o => o.id === org.id ? { ...o, plan } : o));
    if (this.selectedOrg()?.id === org.id) {
      this.selectedOrg.set(this.orgs().find(o => o.id === org.id) ?? null);
    }
  }

  // ── Helpers ───────────────────────────────────────────────────
  planLabel(plan: OrgPlan): string {
    return { free: 'Free', starter: 'Starter', pro: 'Pro', enterprise: 'Enterprise' }[plan];
  }

  onSearch(e: Event): void       { this.search.set((e.target as HTMLInputElement).value); }
  onStatusFilter(e: Event): void { this.statusFilter.set((e.target as HTMLSelectElement).value as any); }
  onPlanFilter(e: Event): void   { this.planFilter.set((e.target as HTMLSelectElement).value as any); }
}
