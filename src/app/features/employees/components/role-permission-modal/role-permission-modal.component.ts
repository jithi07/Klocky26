import { Component, ChangeDetectionStrategy, signal, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Permission {
  module: string;
  action: string;
  key: string;
  enabled: boolean;
}

export interface RolePermissions {
  role: string;
  permissions: Permission[];
}

type RoleName = 'admin' | 'hr' | 'manager' | 'employee';

@Component({
  selector: 'app-role-permission-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-permission-modal.component.html',
  styleUrl: './role-permission-modal.component.scss',
})
export class RolePermissionModalComponent implements OnInit {
  // Inputs
  employeeName = input<string>('Employee');
  currentRole = input<RoleName>('employee');
  isOpen = input<boolean>(false);
  
  // Outputs
  close = output<void>();
  saveChanges = output<{ role: RoleName; permissions: string[] }>();
  
  // State
  selectedRole = signal<RoleName>('employee');
  searchQuery = signal('');
  showPermissions = signal(false);
  saved = signal(false);

  readonly roles: { value: RoleName; label: string; color: string }[] = [
    { value: 'admin', label: 'Admin', color: '#7c3aed' },
    { value: 'hr', label: 'HR Manager', color: '#db2777' },
    { value: 'manager', label: 'Manager', color: '#2563eb' },
    { value: 'employee', label: 'Employee', color: '#64748b' },
  ];

  readonly allPermissions: Permission[] = [
    { module: 'Dashboard', action: 'View Admin Dashboard', key: 'dashboard.admin.view', enabled: false },
    { module: 'Dashboard', action: 'View Employee Dashboard', key: 'dashboard.employee.view', enabled: false },
    { module: 'Employees', action: 'View Employee List', key: 'employees.view', enabled: false },
    { module: 'Employees', action: 'Add / Edit Employee', key: 'employees.create', enabled: false },
    { module: 'Employees', action: 'Deactivate Employee', key: 'employees.deactivate', enabled: false },
    { module: 'Employees', action: 'View Org Tree', key: 'employees.tree.view', enabled: false },
    { module: 'Employees', action: 'Change Reporting Manager', key: 'employees.mgr.change', enabled: false },
    { module: 'Attendance', action: 'View Own Attendance', key: 'attendance.own.view', enabled: false },
    { module: 'Attendance', action: 'View Team Attendance', key: 'attendance.team.view', enabled: false },
    { module: 'Attendance', action: 'View All Attendance', key: 'attendance.all.view', enabled: false },
    { module: 'Attendance', action: 'Manage Geo-fence Zones', key: 'attendance.geofence', enabled: false },
    { module: 'Attendance', action: 'Manage Face Recognition', key: 'attendance.facescan', enabled: false },
    { module: 'Attendance', action: 'Manage Shifts & Roster', key: 'shifts.manage', enabled: false },
    { module: 'Leaves', action: 'Apply for Leave', key: 'leaves.apply', enabled: false },
    { module: 'Leaves', action: 'Approve / Reject Leave', key: 'leaves.approve', enabled: false },
    { module: 'Leaves', action: 'View All Leave Requests', key: 'leaves.all.view', enabled: false },
    { module: 'Performance', action: 'Set Goals for Self', key: 'perf.goals.self', enabled: false },
    { module: 'Performance', action: 'Manage Team Reviews', key: 'perf.reviews.team', enabled: false },
    { module: 'Performance', action: 'Manage All Reviews', key: 'perf.reviews.all', enabled: false },
    { module: 'Analytics', action: 'View HR Reports', key: 'analytics.hr', enabled: false },
    { module: 'Engagement', action: 'Create / Send Surveys', key: 'engagement.create', enabled: false },
    { module: 'Engagement', action: 'View Survey Results', key: 'engagement.results', enabled: false },
    { module: 'Recruitment', action: 'Post Jobs', key: 'recruitment.post', enabled: false },
    { module: 'Recruitment', action: 'Manage Candidates', key: 'recruitment.candidates', enabled: false },
    { module: 'Notifications', action: 'Send Notifications', key: 'notifications.send', enabled: false },
    { module: 'Tasks', action: 'Create / Assign Tasks', key: 'tasks.create', enabled: false },
    { module: 'Roles', action: 'Manage Roles & Permissions', key: 'roles.manage', enabled: false },
    { module: 'Settings', action: 'Manage Org Settings', key: 'settings.manage', enabled: false },
  ];

  // Permission presets for each role
  private rolePermissions: Record<RoleName, string[]> = {
    admin: this.allPermissions.map(p => p.key),
    hr: [
      'dashboard.admin.view', 'dashboard.employee.view', 'employees.view', 'employees.create',
      'employees.tree.view', 'employees.mgr.change', 'attendance.own.view', 'attendance.team.view',
      'attendance.all.view', 'shifts.manage', 'leaves.apply', 'leaves.approve', 'leaves.all.view',
      'perf.goals.self', 'perf.reviews.team', 'analytics.hr', 'engagement.create', 'engagement.results',
      'recruitment.post', 'recruitment.candidates', 'notifications.send', 'tasks.create'
    ],
    manager: [
      'dashboard.admin.view', 'dashboard.employee.view', 'employees.view', 'employees.tree.view',
      'attendance.own.view', 'attendance.team.view', 'leaves.apply', 'leaves.approve',
      'perf.goals.self', 'perf.reviews.team', 'tasks.create', 'notifications.send'
    ],
    employee: [
      'dashboard.employee.view', 'attendance.own.view', 'leaves.apply', 'perf.goals.self'
    ],
  };

  permissions = signal<Permission[]>([]);

  ngOnInit() {
    this.selectedRole.set(this.currentRole());
    this.loadPermissions();
  }

  private loadPermissions() {
    const role = this.selectedRole();
    const enabledKeys = this.rolePermissions[role] || [];
    
    this.permissions.set(
      this.allPermissions.map(p => ({
        ...p,
        enabled: enabledKeys.includes(p.key)
      }))
    );
  }

  onRoleChange(role: RoleName) {
    this.selectedRole.set(role);
    this.loadPermissions();
  }

  togglePermission(permission: Permission) {
    this.permissions.update(perms =>
      perms.map(p =>
        p.key === permission.key ? { ...p, enabled: !p.enabled } : p
      )
    );
  }

  get modules() {
    return [...new Set(this.permissions().map(p => p.module))];
  }

  permissionsForModule(module: string) {
    const query = this.searchQuery().toLowerCase();
    return this.permissions().filter(p => 
      p.module === module && 
      (query === '' || p.action.toLowerCase().includes(query))
    );
  }

  getEnabledCountForModule(module: string): number {
    return this.permissionsForModule(module).filter(p => p.enabled).length;
  }

  get enabledCount() {
    return this.permissions().filter(p => p.enabled).length;
  }

  onSave() {
    const enabledPermissions = this.permissions()
      .filter(p => p.enabled)
      .map(p => p.key);
    
    this.saveChanges.emit({
      role: this.selectedRole(),
      permissions: enabledPermissions
    });
    
    this.saved.set(true);
    setTimeout(() => {
      this.saved.set(false);
      this.onClose();
    }, 1500);
  }

  onClose() {
    this.close.emit();
  }
}
