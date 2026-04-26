import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

// Direct imports — avoid barrel for Angular compiler compatibility
import { UiInputComponent } from '../../../../shared/components/ui-input/ui-input.component';
import { UiTextareaComponent } from '../../../../shared/components/ui-textarea/ui-textarea.component';
import { UiSearchComponent } from '../../../../shared/components/ui-search/ui-search.component';
import { UiDropdownComponent } from '../../../../shared/components/ui-dropdown/ui-dropdown.component';
import { UiMultiSelectComponent } from '../../../../shared/components/ui-multiselect/ui-multiselect.component';
import { UiRadioGroupComponent } from '../../../../shared/components/ui-radio/ui-radio-group.component';
import { UiToggleComponent } from '../../../../shared/components/ui-toggle/ui-toggle.component';
import { UiChipComponent } from '../../../../shared/components/ui-chip/ui-chip.component';
import { UiCardComponent } from '../../../../shared/components/ui-card/ui-card.component';
import { UiGridComponent } from '../../../../shared/components/ui-grid/ui-grid.component';
import { UiLoaderComponent } from '../../../../shared/components/ui-loader/ui-loader.component';
import { TooltipDirective } from '../../../../shared/components/ui-tooltip/tooltip.directive';
import { UiModalComponent } from '../../../../shared/components/ui-modal/ui-modal.component';
import { ToastService } from '../../../../shared/components/ui-toast/toast.service';
import { ModalService } from '../../../../shared/components/ui-modal/modal.service';

import { IconHomeComponent } from '../../../../shared/icons/icon-home.component';
import { IconEmployeesComponent } from '../../../../shared/icons/icon-employees.component';
import { IconClockComponent } from '../../../../shared/icons/icon-clock.component';
import { IconClockInComponent } from '../../../../shared/icons/icon-clock-in.component';
import { IconClockOutComponent } from '../../../../shared/icons/icon-clock-out.component';
import { IconSettingsComponent } from '../../../../shared/icons/icon-settings.component';
import { IconLogoutComponent } from '../../../../shared/icons/icon-logout.component';
import { IconMenuComponent } from '../../../../shared/icons/icon-menu.component';
import { IconBellComponent } from '../../../../shared/icons/icon-bell.component';
import { IconUserComponent } from '../../../../shared/icons/icon-user.component';
import { IconSearchComponent } from '../../../../shared/icons/icon-search.component';
import { IconPaletteComponent } from '../../../../shared/icons/icon-palette.component';

@Component({
  selector: 'app-ui-components',
  standalone: true,
  imports: [
    FormsModule, NgFor, NgIf,
    // UI Kit
    UiInputComponent, UiTextareaComponent, UiSearchComponent,
    UiDropdownComponent, UiMultiSelectComponent,
    UiRadioGroupComponent, UiToggleComponent,
    UiChipComponent, UiCardComponent, UiGridComponent,
    UiLoaderComponent, TooltipDirective, UiModalComponent,
    // Icons
    IconHomeComponent, IconEmployeesComponent, IconClockComponent,
    IconClockInComponent, IconClockOutComponent, IconSettingsComponent,
    IconLogoutComponent, IconMenuComponent, IconBellComponent,
    IconUserComponent, IconSearchComponent, IconPaletteComponent,
  ],
  templateUrl: './ui-components.component.html',
  styleUrl: './ui-components.component.scss',
})
export class UiComponentsComponent {
  private toast = inject(ToastService);
  private modal = inject(ModalService);

  // Form state
  inputVal = '';
  textareaVal = '';
  dropdownVal = null;
  multiVal: any[] = [];
  radioVal = 'option1';
  toggle1 = false;
  toggle2 = true;
  toggle3 = false;

  // Modal state
  modalOpen = false;
  dangerModalOpen = false;

  dropdownOptions = [
    { label: 'Design', value: 'design' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Product', value: 'product' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'HR', value: 'hr' },
  ];

  multiOptions = [
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Next.js', value: 'nextjs' },
  ];

  radioOptions = [
    { label: 'Monthly', value: 'monthly', hint: 'Billed every month' },
    { label: 'Yearly', value: 'yearly', hint: 'Save 20% annually' },
    { label: 'Lifetime', value: 'lifetime', hint: 'One-time payment' },
  ];

  chips: Array<{ label: string; variant: any }> = [
    { label: 'Active', variant: 'active' },
    { label: 'Inactive', variant: 'inactive' },
    { label: 'In Progress', variant: 'inprogress' },
    { label: 'Success', variant: 'success' },
    { label: 'Danger', variant: 'danger' },
    { label: 'Warning', variant: 'warning' },
    { label: 'Info', variant: 'info' },
  ];

  icons = [
    { name: 'Home', cmp: 'home' },
    { name: 'Employees', cmp: 'employees' },
    { name: 'Clock', cmp: 'clock' },
    { name: 'Clock In', cmp: 'clock-in' },
    { name: 'Clock Out', cmp: 'clock-out' },
    { name: 'Settings', cmp: 'settings' },
    { name: 'Logout', cmp: 'logout' },
    { name: 'Menu', cmp: 'menu' },
    { name: 'Bell', cmp: 'bell' },
    { name: 'User', cmp: 'user' },
    { name: 'Search', cmp: 'search' },
    { name: 'Palette', cmp: 'palette' },
  ];

  loaders: Array<{ variant: any; label: string }> = [
    { variant: 'spinner', label: 'Spinner' },
    { variant: 'dots',    label: 'Dots' },
    { variant: 'bar',     label: 'Progress Bar' },
    { variant: 'pulse',   label: 'Pulse' },
  ];

  onSearch(val: string) { this.inputVal = val; }

  showToast(type: 'success' | 'error' | 'warning' | 'info') {
    const map = {
      success: () => this.toast.success('Success!', 'Action completed successfully.'),
      error:   () => this.toast.error('Error!', 'Something went wrong. Please try again.'),
      warning: () => this.toast.warning('Warning!', 'Please review before proceeding.'),
      info:    () => this.toast.info('Info', 'Here is some helpful information.'),
    };
    map[type]();
  }

  async openConfirm() {
    const ok = await this.modal.confirm({
      title: 'Confirm Action',
      message: 'Are you sure you want to proceed with this action?',
      confirmLabel: 'Yes, proceed',
      cancelLabel: 'Cancel',
    });
    if (ok) this.toast.success('Confirmed', 'Action was confirmed.');
    else this.toast.info('Cancelled', 'Action was cancelled.');
  }

  async openDangerConfirm() {
    const ok = await this.modal.confirm({
      title: 'Delete Record',
      message: 'This action cannot be undone. The record will be permanently deleted.',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep it',
      variant: 'danger',
    });
    if (ok) this.toast.error('Deleted', 'Record has been removed.');
  }
}
