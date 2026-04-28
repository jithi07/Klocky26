import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'klocky-org-lookup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './org-lookup.component.html',
  styleUrl: './org-lookup.component.scss',
})
export class OrgLookupComponent {
  @Output() found = new EventEmitter<void>();
  @Output() register = new EventEmitter<void>();

  orgInput = '';
  loading = false;
  error = '';

  constructor(private state: AuthStateService) {}

  async proceed(): Promise<void> {
    if (!this.orgInput.trim() || this.loading) return;
    this.error = '';
    this.loading = true;
    await this.delay(900);
    this.loading = false;

    const slug = this.orgInput.trim().toLowerCase().replace(/\s+/g, '-');
    this.state.setOrg(slug, this.orgInput.trim());
    this.found.emit();
  }

  private delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
}
