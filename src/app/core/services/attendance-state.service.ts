import { Injectable, OnDestroy, signal } from '@angular/core';

export type GeoStatus = 'idle' | 'locating' | 'watching' | 'error';

@Injectable({ providedIn: 'root' })
export class AttendanceStateService implements OnDestroy {

  // ── Shared state ─────────────────────────────────────────────────────
  isClockedIn   = signal(false);
  geoStatus     = signal<GeoStatus>('idle');
  geoError      = signal('');
  clockInTime   = signal<Date | null>(null);
  clockInFaceId = signal('');
  geoToast      = signal('');

  /** 100 metres movement → auto clock-out */
  readonly MOVE_THRESHOLD_M = 100;
  /** 5 minutes max session → auto clock-out */
  readonly MAX_DURATION_MS  = 5 * 60 * 1000;

  private _watchId: number | null = null;
  private _toastTimer: ReturnType<typeof setTimeout> | null = null;
  private _autoTimer:  ReturnType<typeof setTimeout> | null = null;

  // ── Clock In ─────────────────────────────────────────────────────────
  /**
   * Call after a successful face scan. Pass the formatted face ID string.
   * Starts geo tracking and the 5-minute auto clock-out timer.
   */
  clockIn(faceId: string) {
    this.clockInFaceId.set(faceId);
    this.clockInTime.set(new Date());
    this.isClockedIn.set(true);
    this._startGeo();
    this._startAutoTimer();
    this.showToast(`Clocked in`, 'success');
    console.log(`Clock-In successful. Face ID: ${faceId}`);
  }

  // ── Clock Out ────────────────────────────────────────────────────────
  clockOut(reason: string) {
    const t = this.clockInTime();
    const duration = t ? this._formatDuration(Date.now() - t.getTime()) : '';
    this._stopGeo();
    this._stopAutoTimer();
    this.isClockedIn.set(false);
    this.geoStatus.set('idle');
    this.clockInTime.set(null);
    this.clockInFaceId.set('');
    this.showToast(` Clocked out${duration ? ' · ' + duration : ''}. ${reason}`, 'warn');
    this._sendNotification('Clock-Out', reason || 'You have been clocked out.');
  }

  // ── Manual toggle (header button when already clocked in) ────────────
  manualClockOut() {
    this.clockOut('Manual clock-out.');
  }

  // ── Geo ──────────────────────────────────────────────────────────────
  private _startGeo() {
    if (!navigator.geolocation) {
      this.showToast('⚠ Geolocation not supported — time-based auto clock-out only.', 'warn');
      return;
    }

    this.geoStatus.set('locating');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const origin = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        this.geoStatus.set('watching');

        this._watchId = navigator.geolocation.watchPosition(
          (p) => {
            if (!this.isClockedIn()) return;
            const dist = this._haversineM(origin.lat, origin.lng, p.coords.latitude, p.coords.longitude);
            if (dist > this.MOVE_THRESHOLD_M) {
              this.clockOut(`Moved ${Math.round(dist)}m from clock-in location.`);
            }
          },
          () => { /* GPS glitch — keep watching */ },
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
        );
      },
      (err) => {
        this.geoStatus.set('error');
        const msg = err.code === err.PERMISSION_DENIED
          ? 'Location denied — time-based auto clock-out only.'
          : 'Location unavailable — time-based auto clock-out only.';
        this.showToast(`⚠ ${msg}`, 'warn');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  private _stopGeo() {
    if (this._watchId !== null) {
      navigator.geolocation?.clearWatch(this._watchId);
      this._watchId = null;
    }
  }

  // ── 5-min auto clock-out ─────────────────────────────────────────────
  private _startAutoTimer() {
    this._stopAutoTimer();
    this._autoTimer = setTimeout(() => {
      if (this.isClockedIn()) {
        this.clockOut(' Auto clock-out after 5 minutes.');
      }
    }, this.MAX_DURATION_MS);
  }

  private _stopAutoTimer() {
    if (this._autoTimer !== null) {
      clearTimeout(this._autoTimer);
      this._autoTimer = null;
    }
  }

  // ── Toast ────────────────────────────────────────────────────────────
  showToast(msg: string, _type: string) {
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this.geoToast.set(msg);
    this._toastTimer = setTimeout(() => this.geoToast.set(''), 4500);
  }

  // ── Helpers ──────────────────────────────────────────────────────────
  private _haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private _formatDuration(ms: number): string {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m`;
    if (m > 0) return `${m}m ${s % 60}s`;
    return `${s}s`;
  }

  private _sendNotification(title: string, body: string) {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(p => {
        if (p === 'granted') new Notification(title, { body, icon: '/favicon.ico' });
      });
    }
  }

  ngOnDestroy() {
    this._stopGeo();
    this._stopAutoTimer();
    if (this._toastTimer) clearTimeout(this._toastTimer);
  }
}
