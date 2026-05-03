import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Permission {
  module: string;
  action: string;
  key: string;
}

type RoleName = 'admin' | 'hr' | 'manager' | 'employee';

@Component({
  selector: 'app-roles',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class RolesComponent {

  readonly roles: RoleName[] = ['admin', 'hr', 'manager', 'employee'];

  readonly permissions: Permission[] = [
    { module: 'Dashboard',     action: 'View Admin Dashboard',       key: 'dashboard.admin.view'    },
    { module: 'Dashboard',     action: 'View Employee Dashboard',     key: 'dashboard.employee.view' },
    { module: 'Employees',     action: 'View Employee List',          key: 'employees.view'          },
    { module: 'Employees',     action: 'Add / Edit Employee',         key: 'employees.create'        },
    { module: 'Employees',     action: 'Deactivate Employee',         key: 'employees.deactivate'    },
    { module: 'Employees',     action: 'View Org Tree',               key: 'employees.tree.view'     },
    { module: 'Employees',     action: 'Change Reporting Manager',    key: 'employees.mgr.change'    },
    { module: 'Attendance',    action: 'View Own Attendance',         key: 'attendance.own.view'     },
    { module: 'Attendance',    action: 'View Team Attendance',        key: 'attendance.team.view'    },
    { module: 'Attendance',    action: 'View All Attendance',         key: 'attendance.all.view'     },
    { module: 'Attendance',    action: 'Manage Geo-fence Zones',      key: 'attendance.geofence'     },
    { module: 'Attendance',    action: 'Manage Face Scan',            key: 'attendance.facescan'     },
    { module: 'Attendance',    action: 'Manage Shifts & Roster',      key: 'shifts.manage'           },
    { module: 'Leaves',        action: 'Apply for Leave',             key: 'leaves.apply'            },
    { module: 'Leaves',        action: 'Approve / Reject Leave',      key: 'leaves.approve'          },
    { module: 'Leaves',        action: 'View All Leave Requests',     key: 'leaves.all.view'         },
    { module: 'Performance',   action: 'Set Goals for Self',          key: 'perf.goals.self'         },
    { module: 'Performance',   action: 'Manage Team Reviews',         key: 'perf.reviews.team'       },
    { module: 'Performance',   action: 'Manage All Reviews',          key: 'perf.reviews.all'        },
    { module: 'Analytics',     action: 'View HR Reports',             key: 'analytics.hr'            },
    { module: 'Engagement',    action: 'Create / Send Surveys',       key: 'engagement.create'       },
    { module: 'Engagement',    action: 'View Survey Results',         key: 'engagement.results'      },
    { module: 'Recruitment',   action: 'Post Jobs',                   key: 'recruitment.post'        },
    { module: 'Recruitment',   action: 'Manage Candidates',          key: 'recruitment.candidates'  },
    { module: 'Notifications', action: 'Send Notifications',          key: 'notifications.send'      },
    { module: 'Tasks',         action: 'Create / Assign Tasks',       key: 'tasks.create'            },
    { module: 'Roles',         action: 'Manage Roles & Permissions',  key: 'roles.manage'            },
    { module: 'Settings',      action: 'Manage Org Settings',         key: 'settings.manage'         },
  ];

  // Default permission matrix (role → permission key → boolean)
  private _matrix = signal<Record<string, Record<string, boolean>>>({
    admin: Object.fromEntries(this.permissions.map(p => [p.key, true])),
    hr: Object.fromEntries(this.permissions.map(p => [p.key,
      !['employees.deactivate','attendance.geofence','attendance.facescan','roles.manage','settings.manage','analytics.hr'].includes(p.key) ? true :
      ['employees.deactivate','attendance.geofence','attendance.facescan'].includes(p.key) ? false : false
    ])),
    manager: Object.fromEntries(this.permissions.map(p => [p.key,
      ['dashboard.admin.view','dashboard.employee.view','employees.view','employees.tree.view',
       'attendance.own.view','attendance.team.view','leaves.apply','leaves.approve',
       'perf.goals.self','perf.reviews.team','tasks.create','notifications.send'].includes(p.key)
    ])),
    employee: Object.fromEntries(this.permissions.map(p => [p.key,
      ['dashboard.employee.view','attendance.own.view','leaves.apply','perf.goals.self'].includes(p.key)
    ])),
  });

  readonly matrix = this._matrix.asReadonly();

  has(role: RoleName, key: string) {
    return this.matrix()[role]?.[key] ?? false;
  }

  toggle(role: RoleName, key: string) {
    if (role === 'admin' && key === 'roles.manage') return; // can't remove own manage perm
    this._matrix.update(m => ({
      ...m,
      [role]: { ...m[role], [key]: !m[role][key] },
    }));
  }

  saved = signal(false);
  save() {
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }

  get modules() {
    return [...new Set(this.permissions.map(p => p.module))];
  }

  permissionsForModule(mod: string) {
    return this.permissions.filter(p => p.module === mod);
  }

  roleColor(r: RoleName) {
    return { admin:'#7c3aed', hr:'#db2777', manager:'#2563eb', employee:'#475569' }[r];
  }
}
