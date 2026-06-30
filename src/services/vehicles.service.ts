import { supabase } from '@/lib/supabase'
import type { Vehicle, VehicleDocument } from '@/types'
import { mockVehicles } from '@/data/mockData'

const USE_MOCK = true

export const vehiclesService = {
  async getByOwner(ownerId: string): Promise<Vehicle[]> {
    if (USE_MOCK) return mockVehicles.filter(v => v.owner_id === ownerId)
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as Vehicle[]
  },

  async getAll(): Promise<Vehicle[]> {
    if (USE_MOCK) return mockVehicles
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as Vehicle[]
  },

  async getById(id: string): Promise<Vehicle | null> {
    if (USE_MOCK) return mockVehicles.find(v => v.id === id) ?? null
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as Vehicle
  },

  async create(vehicle: Omit<Vehicle, 'id' | 'created_at'>): Promise<Vehicle> {
    const { data, error } = await (supabase.from('vehicles') as any)
      .insert(vehicle)
      .select()
      .single()
    if (error) throw error
    return data as Vehicle
  },

  async update(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    const { data, error } = await (supabase.from('vehicles') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Vehicle
  },

  async delete(id: string): Promise<void> {
    const { error } = await (supabase.from('vehicles') as any).delete().eq('id', id)
    if (error) throw error
  },

  async getDocuments(vehicleId: string): Promise<VehicleDocument[]> {
    const { data, error } = await supabase
      .from('vehicle_documents')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('uploaded_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as VehicleDocument[]
  },
}
