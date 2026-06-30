import { supabase } from '@/lib/supabase'
import type { Partner } from '@/types'
import { mockPartners } from '@/data/mockData'

const USE_MOCK = true

export const partnersService = {
  async getAll(): Promise<Partner[]> {
    if (USE_MOCK) return mockPartners
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('name', { ascending: true })
    if (error) throw error
    return (data ?? []) as Partner[]
  },

  async getById(id: string): Promise<Partner | null> {
    if (USE_MOCK) return mockPartners.find(p => p.id === id) ?? null
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as Partner
  },

  async create(partner: Omit<Partner, 'id' | 'created_at' | 'missions_count'>): Promise<Partner> {
    const { data, error } = await (supabase.from('partners') as any)
      .insert({ ...partner, missions_count: 0 })
      .select()
      .single()
    if (error) throw error
    return data as Partner
  },

  async update(id: string, updates: Partial<Partner>): Promise<Partner> {
    const { data, error } = await (supabase.from('partners') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Partner
  },
}
