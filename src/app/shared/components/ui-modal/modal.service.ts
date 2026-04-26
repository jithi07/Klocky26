import { Injectable, signal } from '@angular/core';

export interface ModalConfig {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

interface ModalState extends ModalConfig {
  id: number;
  resolve: (confirmed: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private _id = 0;
  state = signal<ModalState | null>(null);

  open(config: ModalConfig = {}): Promise<boolean> {
    return new Promise(resolve => {
      this.state.set({ ...config, id: ++this._id, resolve });
    });
  }

  confirm(config: ModalConfig = {}) {
    return this.open({ confirmLabel: 'Confirm', cancelLabel: 'Cancel', ...config });
  }

  close(confirmed: boolean) {
    const s = this.state();
    if (s) { s.resolve(confirmed); this.state.set(null); }
  }
}
