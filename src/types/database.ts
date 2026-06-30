export type UserRole = 'client' | 'carcarry_admin' | 'carcarry_team' | 'partner'

export type FuelType = 'essence' | 'diesel' | 'hybride' | 'electrique' | 'gpl' | 'autre'
export type Transmission = 'manuelle' | 'automatique' | 'semi-automatique'

export type RequestCategory =
  | 'entretien'
  | 'reparation'
  | 'pneus'
  | 'mfk'
  | 'nettoyage'
  | 'carrosserie'
  | 'transport'
  | 'sinistre'
  | 'autre'

export type RequestUrgency = 'basse' | 'normale' | 'haute' | 'urgente'

export type RequestStatus =
  | 'nouveau'
  | 'analyse'
  | 'devis_en_cours'
  | 'en_attente_client'
  | 'planifie'
  | 'pris_en_charge'
  | 'intervention_en_cours'
  | 'termine'
  | 'annule'

export type PartnerType =
  | 'garage'
  | 'pneumatique'
  | 'carrosserie'
  | 'detailing'
  | 'depannage'
  | 'transport'

export type QuoteStatus = 'en_attente' | 'accepte' | 'refuse'

export type InterventionStatus = 'planifie' | 'en_cours' | 'termine' | 'annule'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Profile {
  id: string
  role: UserRole
  first_name: string
  last_name: string
  phone: string
  email: string
  address?: string
  city?: string
  postal_code?: string
  canton?: string
  created_at: string
}

export interface Vehicle {
  id: string
  owner_id: string
  make: string
  model: string
  version?: string
  year: number
  vin?: string
  license_plate: string
  mileage: number
  color?: string
  fuel_type: FuelType
  transmission: Transmission
  purchase_date?: string
  last_service_date?: string
  next_service_date?: string
  last_mfk_date?: string
  next_mfk_date?: string
  notes?: string
  created_at: string
}

export interface VehicleDocument {
  id: string
  vehicle_id: string
  document_type: string
  file_url: string
  file_name: string
  uploaded_at: string
}

export interface ServiceRequest {
  id: string
  client_id: string
  vehicle_id: string
  category: RequestCategory
  urgency: RequestUrgency
  status: RequestStatus
  title: string
  description: string
  preferred_dates?: string[]
  preferred_location?: string
  pickup_needed: boolean
  replacement_vehicle_needed: boolean
  assigned_team_member?: string
  assigned_partner_id?: string
  created_at: string
  updated_at: string
}

export interface RequestPhoto {
  id: string
  request_id: string
  file_url: string
  uploaded_at: string
}

export interface Partner {
  id: string
  name: string
  type: PartnerType
  contact_name?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  postal_code?: string
  canton?: string
  coverage_area?: string
  internal_notes?: string
  average_delay_days?: number
  quality_score?: number
  missions_count: number
  created_at: string
}

export interface PartnerQuote {
  id: string
  request_id: string
  partner_id: string
  amount: number
  currency: string
  description: string
  estimated_duration?: string
  status: QuoteStatus
  document_url?: string
  created_at: string
}

export interface Intervention {
  id: string
  request_id: string
  vehicle_id: string
  partner_id?: string
  start_date?: string
  end_date?: string
  status: InterventionStatus
  final_cost?: number
  summary?: string
  created_at: string
}

export interface InterventionDocument {
  id: string
  intervention_id: string
  document_type: string
  file_url: string
  file_name: string
  uploaded_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  created_at: string
}

export interface ActivityLog {
  id: string
  user_id: string
  entity_type: string
  entity_id: string
  action: string
  details?: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile }
      vehicles: { Row: Vehicle }
      vehicle_documents: { Row: VehicleDocument }
      service_requests: { Row: ServiceRequest }
      request_photos: { Row: RequestPhoto }
      partners: { Row: Partner }
      partner_quotes: { Row: PartnerQuote }
      interventions: { Row: Intervention }
      intervention_documents: { Row: InterventionDocument }
      notifications: { Row: Notification }
      activity_logs: { Row: ActivityLog }
    }
  }
}
