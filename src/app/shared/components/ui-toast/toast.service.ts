import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _id = 0;
  toasts = signal<Toast[]>([]);

  private add(type: ToastType, title: string, message = '', duration = 4000) {
    const id = ++this._id;
    this.toasts.update(list => [...list, { id, type, title, message, duration }]);
    setTimeout(() => this.remove(id), duration);
  }

  success(title: string, message = '') { this.add('success', title, message); }
  error(title: string, message = '')   { this.add('error', title, message); }
  warning(title: string, message = '') { this.add('warning', title, message); }
  info(title: string, message = '')    { this.add('info', title, message); }

  remove(id: number) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
