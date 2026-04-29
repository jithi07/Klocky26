export interface DemoRequest {
  id: string;
  fullName: string;
  workEmail: string;
  phone: string;
  companyName: string;
  teamSize: string;
  message: string;
  submittedAt: string;
  status: 'new' | 'contacted' | 'scheduled' | 'completed' | 'declined';
}
