import {
  Component, ChangeDetectionStrategy, signal, computed, inject, OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiSelectComponent } from '../../../../shared/components';
import { ToastService } from '../../../../shared/components/ui-toast/toast.service';
import { AttendanceRequestService } from '../../../../core/services/attendance-request.service';
import {
  AttendanceRequestResponse,
  AttendanceRequestType,
  ATTENDANCE_REQUEST_TYPE_LABELS,
} from '../../../../core/models/attendance-request.model';

@Component({
  selector: 'app-attendance-requests',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, UiSelectComponent],
  templateUrl: './attendance-requests.component.html',
  styleUrl: './attendance-requests.component.scss',
})
export class AttendanceRequestsComponent implements OnInit {

  private readonly svc = inject(AttendanceRequestService);
  private readonly toast = inject(ToastService);

  /** Max selectable date — regularization can't be for a future day. */
  readonly todayIso = new Date().toISOString().slice(0, 10);

  // ── Apply form ───────────────────────────────────────────────────
  date     = signal(this.todayIso);
  type     = signal<AttendanceRequestType>('missed_punch');
  clockIn  = signal('');
  clockOut = signal('');
  reason   = signal('');
  submitting = signal(false);

  readonly typeOptions = (Object.keys(ATTENDANCE_REQUEST_TYPE_LABELS) as AttendanceRequestType[])
    .map(v => ({ label: ATTENDANCE_REQUEST_TYPE_LABELS[v], value: v }));

  readonly canSubmit = computed(() =>
    !!this.date() && !!this.clockIn() && this.date() <= this.todayIso && !this.submitting());

  // ── My requests ──────────────────────────────────────────────────
  mine = signal<AttendanceRequestResponse[]>([]);
  loadingMine = signal(true);

  // ── Approvals (managers/HR) ──────────────────────────────────────
  pending = signal<AttendanceRequestResponse[]>([]);
  hasApprovals = computed(() => this.pending().length > 0);
  busyId = signal<string | null>(null);
  rejectTarget = signal<string | null>(null);
  rejectReason = signal('');

  ngOnInit() {
    this.loadMine();
    this.loadPending();
  }

  loadMine() {
    this.loadingMine.set(true);
    this.svc.mine().subscribe({
      next: (rows) => { this.mine.set(rows); this.loadingMine.set(false); },
      error: () => { this.loadingMine.set(false); },
    });
  }

  /** Best-effort — non-managers get 403, which we swallow (no approvals section shown). */
  loadPending() {
    this.svc.pendingApproval().subscribe({
      next: (rows) => this.pending.set(rows),
      error: () => this.pending.set([]),
    });
  }

  submit() {
    if (!this.canSubmit()) return;
    this.submitting.set(true);
    this.svc.create({
      date: this.date(),
      type: this.type(),
      clockIn: this.clockIn(),
      clockOut: this.clockOut() || undefined,
      reason: this.reason() || undefined,
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.toast.success('Request submitted', 'Your attendance request is awaiting approval.');
        this.clockIn.set(''); this.clockOut.set(''); this.reason.set('');
        this.loadMine();
      },
      error: (err) => {
        this.submitting.set(false);
        this.toast.error('Could not submit', err?.error?.message ?? 'The request could not be submitted.');
      },
    });
  }

  cancel(id: string) {
    if (this.busyId()) return;
    this.busyId.set(id);
    this.svc.cancel(id).subscribe({
      next: () => { this.busyId.set(null); this.loadMine(); },
      error: (err) => { this.busyId.set(null); this.toast.error('Could not cancel', err?.error?.message ?? 'Please try again.'); },
    });
  }

  approve(id: string) {
    if (this.busyId()) return;
    this.busyId.set(id);
    this.svc.decision(id, { approve: true }).subscribe({
      next: () => { this._removePending(id); this.busyId.set(null); },
      error: (err) => { this.busyId.set(null); this.toast.error('Could not approve', err?.error?.message ?? 'Please try again.'); },
    });
  }

  openReject(id: string) { this.rejectTarget.set(id); this.rejectReason.set(''); }
  cancelReject()         { this.rejectTarget.set(null); }
  doReject() {
    const id = this.rejectTarget();
    if (!id) return;
    this.busyId.set(id);
    this.svc.decision(id, { approve: false, rejectionReason: this.rejectReason() || undefined }).subscribe({
      next: () => { this._removePending(id); this.rejectTarget.set(null); this.busyId.set(null); },
      error: (err) => { this.busyId.set(null); this.toast.error('Could not reject', err?.error?.message ?? 'Please try again.'); },
    });
  }

  private _removePending(id: string) { this.pending.update(l => l.filter(r => r.id !== id)); }

  typeLabel(t: AttendanceRequestType): string { return ATTENDANCE_REQUEST_TYPE_LABELS[t] ?? t; }
}
