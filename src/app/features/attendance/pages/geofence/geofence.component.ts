import {
  Component, ChangeDetectionStrategy, signal, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface GeoZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  active: boolean;
  address: string;
}

@Component({
  selector: 'app-geofence',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './geofence.component.html',
  styleUrl: './geofence.component.scss',
})
export class GeofenceComponent implements OnDestroy {

  readonly zones = signal<GeoZone[]>([
    { id:'z1', name:'Headquarters',   lat:12.9716, lng:77.5946, radiusMeters:100, active:true,  address:'MG Road, Bengaluru 560001' },
    { id:'z2', name:'Branch Office',  lat:19.0760, lng:72.8777, radiusMeters:150, active:true,  address:'BKC, Mumbai 400051'         },
    { id:'z3', name:'Remote Hub',     lat:28.6139, lng:77.2090, radiusMeters:200, active:false, address:'Connaught Place, Delhi'     },
  ]);

  showAddForm = signal(false);
  editId = signal<string | null>(null);

  newZone = signal<Partial<GeoZone>>({ name:'', lat: 0, lng: 0, radiusMeters: 100, active: true, address:'' });

  // Geolocation state
  locating = signal(false);
  locError = signal<string | null>(null);
  locGranted = signal(false);

  private _watchId: number | null = null;

  /** Ask browser for current position to fill the form */
  useMyLocation() {
    if (!navigator.geolocation) {
      this.locError.set('Geolocation is not supported by this browser.');
      return;
    }
    this.locating.set(true);
    this.locError.set(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.newZone.update(z => ({
          ...z,
          lat: parseFloat(pos.coords.latitude.toFixed(6)),
          lng: parseFloat(pos.coords.longitude.toFixed(6)),
        }));
        this.locating.set(false);
        this.locGranted.set(true);
      },
      (err) => {
        this.locating.set(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:    this.locError.set('Location access denied. Please allow permission and try again.'); break;
          case err.POSITION_UNAVAILABLE: this.locError.set('Location unavailable. Try entering coordinates manually.'); break;
          default:                       this.locError.set('Could not get location. Please enter coordinates manually.');
        }
      },
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  }

  saveZone() {
    const z = this.newZone();
    if (!z.name?.trim()) return;
    const zone: GeoZone = {
      id: this.editId() ?? 'z' + Date.now(),
      name: z.name!.trim(),
      lat: Number(z.lat) || 0,
      lng: Number(z.lng) || 0,
      radiusMeters: Math.max(10, Number(z.radiusMeters) || 100),
      active: z.active ?? true,
      address: z.address?.trim() ?? '',
    };

    if (this.editId()) {
      this.zones.update(list => list.map(x => x.id === zone.id ? zone : x));
    } else {
      this.zones.update(list => [...list, zone]);
    }
    this.resetForm();
  }

  editZone(zone: GeoZone) {
    this.editId.set(zone.id);
    this.newZone.set({ ...zone });
    this.showAddForm.set(true);
  }

  deleteZone(id: string) {
    this.zones.update(list => list.filter(z => z.id !== id));
  }

  toggleActive(id: string) {
    this.zones.update(list => list.map(z => z.id === id ? { ...z, active: !z.active } : z));
  }

  resetForm() {
    this.newZone.set({ name:'', lat:0, lng:0, radiusMeters:100, active:true, address:'' });
    this.showAddForm.set(false);
    this.editId.set(null);
    this.locError.set(null);
    this.locGranted.set(false);
  }

  patchName(v: string)        { this.newZone.update(z => ({ ...z, name: v })); }
  patchAddress(v: string)     { this.newZone.update(z => ({ ...z, address: v })); }
  patchLat(v: string)         { this.newZone.update(z => ({ ...z, lat: +v })); }
  patchLng(v: string)         { this.newZone.update(z => ({ ...z, lng: +v })); }
  patchRadius(v: string)      { this.newZone.update(z => ({ ...z, radiusMeters: Math.max(10, +v) })); }
  patchActive(v: boolean)     { this.newZone.update(z => ({ ...z, active: v })); }

  /** Scale radius to a CSS circle diameter in px (max 240px for 500m) */
  radiusCircle(r: number): number {
    return Math.min(240, Math.max(40, (r / 500) * 240));
  }

  ngOnDestroy() {
    if (this._watchId !== null) navigator.geolocation?.clearWatch(this._watchId);
  }
}
