import { Injectable, signal } from '@angular/core';

export interface EnrolledFace {
  id: string;
  name: string;
  descriptor: number[];   // Float32Array serialised as plain array for localStorage
  enrolledAt: string;
}

const STORE_KEY = 'klocky_face_roster_v1';

@Injectable({ providedIn: 'root' })
export class FaceRosterService {

  /** Reactive list of all enrolled faces — updates on enroll/remove */
  readonly roster = signal<EnrolledFace[]>(this._load());

  /** Enrol a new face. Returns the new record. */
  enroll(name: string, descriptor: Float32Array): EnrolledFace {
    const record: EnrolledFace = {
      id: this._uid(),
      name: name.trim(),
      descriptor: Array.from(descriptor),
      enrolledAt: new Date().toISOString(),
    };
    const updated = [...this.roster(), record];
    this._save(updated);
    this.roster.set(updated);
    console.log(`[Klocky Roster] ✅ Enrolled "${record.name}" — Face ID: ${record.id}`);
    return record;
  }

  /** Find the closest matching face. Returns the record + distance, or null if no match (threshold 0.5). */
  recognise(descriptor: Float32Array): { face: EnrolledFace; distance: number } | null {
    const roster = this.roster();
    if (!roster.length) return null;

    let best: EnrolledFace | null = null;
    let bestDist = Infinity;

    for (const face of roster) {
      const enrolled = new Float32Array(face.descriptor);
      const dist = this._euclidean(descriptor, enrolled);
      console.log(`[Klocky Roster] vs "${face.name}" (${face.id}): distance = ${dist.toFixed(4)}`);
      if (dist < bestDist) { bestDist = dist; best = face; }
    }

    if (best && bestDist < 0.5) {
      console.log(`[Klocky Roster] ✅ Recognised: "${best.name}" — distance ${bestDist.toFixed(4)}`);
      return { face: best, distance: bestDist };
    }

    console.log(`[Klocky Roster] ❌ No match — closest distance ${bestDist.toFixed(4)} (threshold 0.5)`);
    return null;
  }

  remove(id: string) {
    const updated = this.roster().filter(f => f.id !== id);
    this._save(updated);
    this.roster.set(updated);
  }

  private _euclidean(a: Float32Array, b: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += (a[i] - b[i]) ** 2;
    return Math.sqrt(sum);
  }

  private _uid(): string {
    return [0, 0, 0, 0]
      .map(() => Math.floor(Math.random() * 0x10000).toString(16).padStart(4, '0').toUpperCase())
      .join('-');
  }

  private _load(): EnrolledFace[] {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch { return []; }
  }

  private _save(faces: EnrolledFace[]) {
    localStorage.setItem(STORE_KEY, JSON.stringify(faces));
  }
}
