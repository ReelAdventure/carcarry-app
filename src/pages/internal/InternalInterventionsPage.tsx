import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { mockProfiles, mockVehicles, mockInterventions, mockPartners, mockServiceRequests } from '@/data/mockData'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Wrench, ChevronRight, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { InterventionStatus } from '@/types'

const statusConfig: Record<InterventionStatus, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  planifie: { label: 'Planifiée', icon: <Clock size={12} />, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  en_cours: { label: 'En cours', icon: <Wrench size={12} />, color: 'text-[#FF7700]', bg: 'bg-[#FF7700]/10 border-[#FF7700]/20' },
  termine: { label: 'Terminée', icon: <CheckCircle2 size={12} />, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  annule: { label: 'Annulée', icon: <XCircle size={12} />, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
}

export function InternalInterventionsPage() {
  const adminUser = mockProfiles.find(p => p.role === 'carcarry_admin')!
  const totalCost = mockInterventions.reduce((sum, i) => sum + (i.final_cost ?? 0), 0)
  const completed = mockInterventions.filter(i => i.status === 'termine')

  return (
    <AppLayout user={adminUser} notificationCount={3}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Interventions</h1>
        <p className="text-[#B0B0B0] text-sm mt-1">{mockInterventions.length} intervention{mockInterventions.length > 1 ? 's' : ''} enregistrée{mockInterventions.length > 1 ? 's' : ''}</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: mockInterventions.length, color: 'text-white' },
          { label: 'Terminées', value: completed.length, color: 'text-green-400' },
          { label: 'En cours', value: mockInterventions.filter(i => i.status === 'en_cours').length, color: 'text-[#FF7700]' },
          { label: 'Revenus', value: formatCurrency(totalCost), color: 'text-[#FF7700]' },
        ].map(s => (
          <div key={s.label} className="bg-[#1C1C1C] border border-[#2E2E2E] rounded-xl p-4">
            <p className={cn('text-xl font-black', s.color)} style={{ fontFamily: 'Montserrat, sans-serif' }}>{s.value}</p>
            <p className="text-[#5A5A5A] text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#1E1E1E]">
            {[['Véhicule', 'col-span-3'], ['Partenaire', 'col-span-2'], ['Début', 'col-span-2'], ['Fin', 'col-span-2'], ['Coût', 'col-span-2'], ['Statut', 'col-span-1']].map(([h, cls]) => (
              <div key={h} className={cn('text-[#5A5A5A] text-xs font-semibold uppercase tracking-wider', cls)}>{h}</div>
            ))}
          </div>

          <div className="divide-y divide-[#1E1E1E]">
            {mockInterventions.length === 0 ? (
              <div className="py-16 text-center">
                <Wrench size={36} className="text-[#3A3A3A] mx-auto mb-3" />
                <p className="text-[#5A5A5A] text-sm">Aucune intervention enregistrée</p>
              </div>
            ) : (
              mockInterventions.map(inter => {
                const vehicle = mockVehicles.find(v => v.id === inter.vehicle_id)
                const partner = mockPartners.find(p => p.id === inter.partner_id)
                const request = mockServiceRequests.find(r => r.id === inter.request_id)
                const cfg = statusConfig[inter.status]
                return (
                  <Link
                    key={inter.id}
                    to={`/internal/requests/${inter.request_id}`}
                    className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-[#1E1E1E] transition-colors group"
                  >
                    <div className="col-span-10 md:col-span-3 flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#272727] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Wrench size={16} className="text-[#FF7700]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {vehicle ? `${vehicle.make} ${vehicle.model}` : '—'}
                        </p>
                        <p className="text-[#5A5A5A] text-xs">{vehicle?.license_plate ?? '—'}</p>
                      </div>
                    </div>
                    <div className="hidden md:block col-span-2">
                      <p className="text-[#B0B0B0] text-xs truncate">{partner?.name ?? '—'}</p>
                    </div>
                    <div className="hidden md:block col-span-2">
                      <p className="text-[#B0B0B0] text-xs">{formatDate(inter.start_date)}</p>
                    </div>
                    <div className="hidden md:block col-span-2">
                      <p className="text-[#B0B0B0] text-xs">{inter.end_date ? formatDate(inter.end_date) : '—'}</p>
                    </div>
                    <div className="hidden md:block col-span-2">
                      <p className={cn('text-sm font-semibold', inter.final_cost ? 'text-[#FF7700]' : 'text-[#5A5A5A]')}>
                        {inter.final_cost ? formatCurrency(inter.final_cost) : '—'}
                      </p>
                    </div>
                    <div className="col-span-2 md:col-span-1 flex justify-end">
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border', cfg.bg, cfg.color)}>
                        {cfg.icon}{cfg.label}
                      </span>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
