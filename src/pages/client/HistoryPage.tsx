import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { currentMockUser, mockVehicles, mockInterventions, mockServiceRequests, mockPartners } from '@/data/mockData'
import { formatDate, formatCurrency, getCategoryConfig } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { History, Wrench, CheckCircle2, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function HistoryPage() {
  const user = currentMockUser
  const vehicles = mockVehicles.filter(v => v.owner_id === user.id)
  const myInterventions = mockInterventions.filter(i => vehicles.some(v => v.id === i.vehicle_id))
  const myRequests = mockServiceRequests.filter(r => r.client_id === user.id && r.status === 'termine')
  const totalSpent = myInterventions.reduce((s, i) => s + (i.final_cost ?? 0), 0)

  return (
    <AppLayout user={user} notificationCount={2} showNewRequest>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Historique</h1>
        <p className="text-[#B0B0B0] text-sm mt-1">Toutes vos interventions passées</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Interventions', value: myInterventions.length, color: 'text-white' },
          { label: 'Demandes terminées', value: myRequests.length, color: 'text-green-400' },
          { label: 'Total dépensé', value: totalSpent > 0 ? formatCurrency(totalSpent) : '—', color: 'text-[#FF7700]' },
        ].map(s => (
          <div key={s.label} className="bg-[#1C1C1C] border border-[#2E2E2E] rounded-xl p-4 text-center">
            <p className={cn('text-2xl font-black', s.color)} style={{ fontFamily: 'Montserrat, sans-serif' }}>{s.value}</p>
            <p className="text-[#5A5A5A] text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {myRequests.length === 0 && myInterventions.length === 0 ? (
          <div className="text-center py-16">
            <History size={40} className="text-[#3A3A3A] mx-auto mb-4" />
            <p className="text-[#B0B0B0]">Aucun historique disponible</p>
          </div>
        ) : (
          <>
            {/* Completed requests */}
            {myRequests.length > 0 && (
              <Card>
                <div className="px-6 py-4 border-b border-[#1E1E1E] flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-400" />
                  <h2 className="text-base font-semibold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Demandes terminées</h2>
                </div>
                <CardContent className="p-0">
                  {myRequests.map(req => {
                    const vehicle = vehicles.find(v => v.id === req.vehicle_id)
                    const cat = getCategoryConfig(req.category)
                    return (
                      <Link key={req.id} to={`/client/requests/${req.id}`} className="flex items-center gap-4 px-6 py-4 border-b border-[#1E1E1E] last:border-0 hover:bg-[#1E1E1E] transition-colors group">
                        <div className="w-10 h-10 bg-[#141414] rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                          {cat.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{req.title}</p>
                          <p className="text-[#5A5A5A] text-xs">{vehicle ? `${vehicle.make} ${vehicle.model}` : '—'} · Terminé le {formatDate(req.updated_at)}</p>
                        </div>
                        <ChevronRight size={14} className="text-[#3A3A3A] group-hover:text-[#FF7700] transition-colors" />
                      </Link>
                    )
                  })}
                </CardContent>
              </Card>
            )}

            {/* Interventions */}
            {myInterventions.length > 0 && (
              <Card>
                <div className="px-6 py-4 border-b border-[#1E1E1E] flex items-center gap-2">
                  <Wrench size={16} className="text-[#FF7700]" />
                  <h2 className="text-base font-semibold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Interventions réalisées</h2>
                </div>
                <CardContent className="p-0">
                  {myInterventions.map(inter => {
                    const vehicle = vehicles.find(v => v.id === inter.vehicle_id)
                    const partner = mockPartners.find(p => p.id === inter.partner_id)
                    return (
                      <div key={inter.id} className="flex items-start gap-4 px-6 py-4 border-b border-[#1E1E1E] last:border-0">
                        <div className={cn('w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0', inter.status === 'termine' ? 'bg-green-400' : 'bg-[#FF7700]')} />
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{vehicle ? `${vehicle.make} ${vehicle.model}` : '—'}</p>
                          {inter.summary && <p className="text-[#B0B0B0] text-xs mt-0.5 leading-relaxed">{inter.summary}</p>}
                          <p className="text-[#5A5A5A] text-xs mt-1">
                            {partner ? partner.name : 'Partenaire CarCarry'} · {formatDate(inter.start_date)}
                          </p>
                        </div>
                        {inter.final_cost && (
                          <p className="text-[#FF7700] text-sm font-bold flex-shrink-0">{formatCurrency(inter.final_cost)}</p>
                        )}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}
