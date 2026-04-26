import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  IconBellComponent,
  IconSearchComponent,
} from '../../shared/icons';
import { AppBrandComponent } from '../../shared/components/app-brand/app-brand.component';
import { OrgRegisterModalService } from '../../shared/components/org-register-modal/org-register-modal.service';

@Component({
  selector: 'klocky-header',
  standalone: true,
  imports: [
    IconBellComponent,
    IconSearchComponent,
    AppBrandComponent,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  @Input() orgName = '';
  @Input() orgLogoUrl = '';
  @Input() orgAccentColor = '';

  private orgModal = inject(OrgRegisterModalService);

  get isJv(): boolean { return !!this.orgName; }
  get accentColor(): string {
    return this.isJv && this.orgAccentColor ? this.orgAccentColor : '#6366f1';
  }

  openOrgRegister(): void {
    this.orgModal.show();
  }

  isClockedIn = false;

  toggleClock() {
    this.isClockedIn = !this.isClockedIn;
  }
}