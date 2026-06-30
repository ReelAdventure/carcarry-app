import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { StatusBadge, UrgencyBadge, Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { mockProfiles, mockVehicles, mockServiceRequests, mockPartners } from '@/data/mockData'
import { formatDate, formatCurrency, getCategoryConfig } from '@/lib/utils'
import { Link } from 'react-router-dom'
import {
  ClipboardList, Star, ChevronRight, Upload, CheckCircle2,
  TrendingUp, Clock, Euro, MapPin, Phone, Mail, Wrench
} from 'lucide-react'
import type { Profile } from '@/types'

const partnerProfile: Profile = {
  id: 'partner-1',
  role: 'partner',
  first_name: 'Pierre',
  last_name: 'Dupuis',
  phone: '+41 26 123 45 67',
  email: 'contact@dupuis-garage.ch',
  city: 'Fribourg',
  postal_code: '1700',
  canton: 'FR',
  created_at: '2023-12-01T08:00:00Z',
}

export function PartnerDashboard() {
  const partner = mockPartners[0] // Garage Dupuis
  const assignedRequests = mockServiceRequests.filter(r => r.assigned_partner_id === partner?.id)
  const completedRequests = assignedRequests.filter(r => r.status === 'termine')
  const activeRequests = assignedRequests.filter(r => r.status !== 'termine' && r.status !== 'annule')

  // All requests including historical
  const allPartnerRequests = mockServiceRequests.filter(
    r => r.assigned_partner_id === partner?.id || ['req-6'].includes(r.id)
  )

  return (
    <AppLayout user={partnerProfile} notificationCount={1}>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[#B0B0B0] text-sm mb-1">Espace partenaire</p>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {partner?.name ?? 'Partenaire CarCarry'}
            </h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star size={14} fill="currentColor" />
                <span className="text-sm font-bold">{partner?.quality_score?.toFixed(1)}</span>
                <span className="text-[#5A5A5A] text-xs">/ 10</span>
              </div>
              <span className="text-[#3A3A3A]">·</span>
              <Badge variant="gray">{partner?.missions_count} missions effectuées</Badge>
              <Badge variant="green">Partenaire certifié</Badge>
            </div>
          </div>
          <Link to="/partner/documents">
            <Button variant="secondary" size="sm" className="gap-2">
              <Upload size={15} />
              Mes documents
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Missions actives',
            value: activeRequests.length.toString(),
            icon: <Wrench size={18} className="text-[#FF7700]" />,
            bg: 'bg-[#FF7700]/10',
          },
          {
            label: 'Missions terminées',
            value: (partner?.missions_count ?? 0).toString(),
            icon: <CheckCircle2 size={18} className="text-green-400" />,
            bg: 'bg-green-500/10',
          },
          {
            label: 'Score qualité',
            value: `${partner?.quality_score?.toFixed(1)}/10`,
            icon: <Star size={18} className="text-yellow-400" fill="currentColor" />,
            bg: 'bg-yellow-500/10',
          },
          {
            label: 'Délai moyen',
            value: `${partner?.average_delay_days ?? '—'}j`,
            icon: <Clock size={18} className="text-blue-400" />,
            bg: 'bg-blue-500/10',
          },
        ].map(stat => (
          <Card key={stat.label} className="p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-white text-xl font-bold">{stat.value}</p>
              <p className="text-[#5A5A5A] text-xs">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Missions list */}
        <div className="lg:col-span-2 space-y-5">
          {/* Active missions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Missions en cours</CardTitle>
                {activeRequests.length > 0 && (
                  <Badge variant="orange">{activeRequests.length} active{activeRequests.length > 1 ? 's' : ''}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {allPartnerRequests.length === 0 ? (
                <div className="py-12 text-center">
                  <ClipboardList size={36} className="text-[#3A3A3A] mx-auto mb-3" />
                  <p className="text-[#5A5A5A] text-sm">Aucune mission en cours</p>
                  <p className="text-[#3A3A3A] text-xs mt-1">CarCarry vous notifiera pour les nouvelles missions</p>
                </div>
              ) : (
                <div className="divide-y divide-[#1E1E1E]">
                  {allPartnerRequests.map(req => {
                    const client = mockProfiles.find(p => p.id === req.client_id)
                    const vehicle = mockVehicles.find(v => v.id === req.vehicle_id)
                    const cat = getCategoryConfig(req.category)
                    return (
                      <Link
                        key={req.id}
                        to={`/partner/missions/${req.id}`}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-[#1E1E1E] transition-colors group"
                      >
                        <div className="w-10 h-10 bg-[#272727] rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">{cat.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{req.title}</p>
                          <p className="text-[#5A5A5A] text-xs mt-0.5">
                            {vehicle ? `${vehicle.make} ${vehicle.model} · ${vehicle.license_plate}` : '—'}
                          </p>
                          <p className="text-[#3A3A3A] text-xs">
                            {client ? `${client.first_name} ${client.last_name[0]}.` : '—'} · {formatDate(req.updated_at ?? req.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <UrgencyBadge urgency={req.urgency} />
                          <StatusBadge status={req.status} />
                          <ChevronRight size={14} className="text-[#3A3A3A] group-hover:text-[#FF7700] transition-colors" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader><CardTitle>Actions rapides</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <Upload size={18} />, label: 'Déposer un devis', color: 'text-[#FF7700]', bg: 'bg-[#FF7700]/10' },
                  { icon: <CheckCircle2 size={18} />, label: 'Mettre à jour statut', color: 'text-green-400', bg: 'bg-green-500/10' },
                  { icon: <Upload size={18} />, label: 'Ajouter documents', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                ].map(action => (
                  <button
                    key={action.label}
                    className="flex flex-col items-center gap-2 py-4 px-3 bg-[#1C1C1C] border border-[#2E2E2E] rounded-xl hover:border-[#3A3A3A] hover:bg-[#242424] transition-all group text-center"
                  >
                    <div className={`w-10 h-10 ${action.bg} rounded-xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <p className="text-[#B0B0B0] text-xs group-hover:text-white transition-colors">{action.label}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Profile card */}
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-[#FF7700]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Wrench size={20} className="text-[#FF7700]" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{partner?.name}</p>
                  <p className="text-[#5A5A5A] text-xs capitalize">{partner?.type}</p>
                  <p className="text-[#3A3A3A] text-xs mt-0.5">Partenaire depuis déc. 2023</p>
                </div>
              </div>
              <div className="space-y-2.5 border-t border-[#1E1E1E] pt-3">
                <div className="flex items-center gap-2 text-xs text-[#B0B0B0]">
                  <MapPin size={13} className="text-[#FF7700] flex-shrink-0" />
                  <span>{partner?.address}, {partner?.city}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#B0B0B0]">
                  <Phone size={13} className="text-[#FF7700] flex-shrink-0" />
                  <span>{partner?.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#B0B0B0]">
                  <Mail size={13} className="text-[#FF7700] flex-shrink-0" />
                  <span className="truncate">{partner?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#B0B0B0]">
                  <MapPin size={13} className="text-[#3A3A3A] flex-shrink-0" />
                  <span className="text-[#5A5A5A]">Zone : {partner?.coverage_area}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card>
            <CardHeader><CardTitle>Performance</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Score qualité', value: `${partner?.quality_score?.toFixed(1)}/10`, pct: (partner?.quality_score ?? 0) * 10, color: 'bg-yellow-400' },
                { label: 'Taux de succès', value: '98%', pct: 98, color: 'bg-green-400' },
                { label: 'Respect délais', value: '95%', pct: 95, color: 'bg-blue-400' },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[#5A5A5A] text-xs">{s.label}</p>
                    <p className="text-white text-xs font-semibold">{s.value}</p>
                  </div>
                  <div className="w-full h-1.5 bg-[#272727] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${s.color} rounded-full transition-all`}
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Revenue this month */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={15} className="text-[#FF7700]" />
              <p className="text-[#B0B0B0] text-xs uppercase tracking-wider">Ce mois</p>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Missions facturées', value: '3' },
                { label: 'CA généré', value: 'CHF 2 850' },
                { label: 'Délai moyen', value: `${partner?.average_delay_days}j` },
                { label: 'Note moyenne', value: `${partner?.quality_score?.toFixed(1)}/10` },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <p className="text-[#5A5A5A] text-xs">{s.label}</p>
                  <p className="text-white text-sm font-semibold">{s.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
