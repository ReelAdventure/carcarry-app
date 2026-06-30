import { supabase } from '@/lib/supabase'
import type { ServiceRequest, RequestStatus } from '@/types'
import { mockServiceRequests } from '@/data/mockData'

const USE_MOCK = true

export const requestsService = {
  async getByClient(clientId: string): Promise<ServiceRequest[]> {
    if (USE_MOCK) return mockServiceRequests.filter(r => r.client_id === clientId)
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as ServiceRequest[]
  },

  async getAll(): Promise<ServiceRequest[]> {
    if (USE_MOCK) return mockServiceRequests
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as ServiceRequest[]
  },

  async getById(id: string): Promise<ServiceRequest | null> {
    if (USE_MOCK) return mockServiceRequests.find(r => r.id === id) ?? null
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as ServiceRequest
  },

  async getByStatus(status: RequestStatus): Promise<ServiceRequest[]> {
    if (USE_MOCK) return mockServiceRequests.filter(r => r.status === status)
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as ServiceRequest[]
  },

  async create(request: Omit<ServiceRequest, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceRequest> {
    const { data, error } = await (supabase.from('service_requests') as any)
      .insert(request)
      .select()
      .single()
    if (error) throw error
    return data as ServiceRequest
  },

  async updateStatus(id: string, status: RequestStatus): Promise<void> {
    const { error } = await (supabase.from('service_requests') as any)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },

  async assignPartner(id: string, partnerId: string): Promise<void> {
    const { error } = await (supabase.from('service_requests') as any)
      .update({ assigned_partner_id: partnerId, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },
}
