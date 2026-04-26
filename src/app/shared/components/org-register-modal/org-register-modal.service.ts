import { Injectable, signal } from '@angular/core';

export interface OrgRegisterForm {
  companyName: string;
  legalName: string;
  employeeCount: string;
  industry: string;
  country: string;
  timezone: string;
}

@Injectable({ providedIn: 'root' })
export class OrgRegisterModalService {
  readonly open = signal<boolean>(false);

  show(): void {
    this.open.set(true);
  }

  close(result: OrgRegisterForm | null): void {
    this.open.set(false);
    if (result) {
      console.log('[OrgRegister] submitted:', result);
    }
  }
}
