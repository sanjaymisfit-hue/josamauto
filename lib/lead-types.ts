/* Mirrors the project's own leads/profiles tables — safe for client components */

export type LeadKind =
  | "buying"
  | "test_drive"
  | "booking"
  | "financing"
  | "seller"
  | "import"
  | "general";

export type LeadStatus = "new" | "contacted" | "scheduled" | "won" | "lost";

export interface Lead {
  id: string;
  lead_number: number | null;
  type: LeadKind;
  status: LeadStatus;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  preferred_contact: string;
  vehicle_id: string | null;
  assigned_to: string | null;
  message: string;
  scheduled_date: string | null;
  scheduled_time: string | null;
  national_id_or_dl: string;
  employment_type: string;
  monthly_income_kes: number | null;
  down_payment_kes: number | null;
  loan_period_months: number | null;
  seller_car_make: string;
  seller_car_model: string;
  seller_car_year: number | null;
  seller_car_mileage_km: number | null;
  seller_expected_price_kes: number | null;
  seller_car_images: string[];
  deposit_paid_kes: number | null;
  lost_reason: string;
  source_url: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  role: string;
  avatar_url: string | null;
  is_active: boolean;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  actor_id: string | null;
  action: "created" | "status_change" | "assignment" | "note";
  old_value: string;
  new_value: string;
  note: string;
  created_at: string;
}

export const LEAD_KINDS: { value: LeadKind; label: string }[] = [
  { value: "buying", label: "Buying" },
  { value: "test_drive", label: "Test drive" },
  { value: "booking", label: "Viewing" },
  { value: "financing", label: "Financing" },
  { value: "seller", label: "Seller" },
  { value: "import", label: "Import" },
  { value: "general", label: "General" },
];

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "scheduled", label: "Scheduled" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];
