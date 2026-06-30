import { useParams, Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { mockProfiles, mockPartners, mockServiceRequests, mockVehicles } from '@/data/mockData'
import { formatDate, getPartnerTypeConfig } from '@/lib/utils'
import { ArrowLeft, Star, Phone, Mail, MapPin, Building2, Wrench, Edit2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function InternalPartnerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const adminUser = mockProfiles.find(p => p.role === 'carcarry_admin')!
  const partner = mockPartners.find(p => p.id === id)
  const missions = mockServiceRequests.filter(r => r.assigned_partner_id === id)

  if (!partner) {
    return (
      <AppLayout user={adminUser} notificationCount={3}>
        <div className="text-center py-20">
          <p className="text-[#B0B0B0]">Partenaire introuvable</p>
          <Link to="/internal/partners" className="text-[#FF7700] text-sm mt-4 inline-block hover:underline">← Retour</Link>
        </div>
      </AppLayout>
    )
  }

  const typeCfg = getPartnerTypeConfig(partner.type)
  const score = partner.quality_score ?? 0
  const completedMissions = missions.filter(m => m.status === 'termine')
  const activeMissions = missions.filter(m => !['termine', 'annule'].includes(m.status))

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(score / 2))

  return (
    <AppLayout user={adminUser} notificationCount={3}>
      <div className="mb-6">
        <Link to="/internal/partners" className="flex items-center gap-2 text-[#B0B0B0] hover:text-white text-sm">
          <ArrowLeft size={16} /> Retour aux partenaires
        </Link>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#1C1C1C] to-[#161616] border border-[#2E2E2E] rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#272727] rounded-2xl flex items-center justify-center border border-[#3A3A3A]">
              <Building2 size={28} className="text-[#FF7700]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>{partner.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="gray" className={typeCfg.color}>{typeCfg.label}</Badge>
                <div className="flex items-center gap-0.5">
                  {stars.map((filled, i) => (
                    <Star key={i} size={13} className={filled ? 'text-yellow-400 fill-yellow-400' : 'text-[#3A3A3A]'} />
                  ))}
                  <span className="text-yellow-400 text-sm font-bold ml-1">{score.toFixed(1)}</span>
                </div>
              </div>
              {partner.contact_name && <p className="text-[#5A5A5A] text-sm mt-1">Contact : {partner.contact_name}</p>}
            </div>
          </div>
          <Button variant="secondary" size="sm">
            <Edit2 size={14} /> Modifier
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#2E2E2E]">
          {[
            { label: 'Missions totales', value: partner.missions_count, color: 'text-white' },
            { label: 'Missions actives', value: activeMissions.length, color: 'text-[#FF7700]' },
            { label: 'Missions terminées', value: completedMissions.length, color: 'text-green-400' },
            { label: 'Délai moyen', value: partner.average_delay_days ? `${partner.average_delay_days}j` : '—', color: 'text-blue-400' },
          ].map(s => (
            <div key={s.label} className="bg-[#141414] rounded-xl p-3">
              <p className={cn('text-xl font-black', s.color)} style={{ fontFamily: 'Montserrat, sans-serif' }}>{s.value}</p>
              <p className="text-[#5A5A5A] text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Missions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Missions assignées</CardTitle>
                {activeMissions.length > 0 && <Badge variant="orange">{activeMissions.length} en cours</Badge>}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {missions.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <Wrench size={32} className="text-[#3A3A3A] mx-auto mb-3" />
                  <p className="text-[#5A5A5A] text-sm">Aucune mission assignée</p>
                </div>
              ) : (
                <div className="divide-y divide-[#1E1E1E]">
                  {missions.map(m => {
                    const vehicle = mockVehicles.find(v => v.id === m.vehicle_id)
                    const client = mockProfiles.find(p => p.id === m.client_id)
                    return (
                      <Link key={m.id} to={`/internal/requests/${m.id}`} className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#1E1E1E] transition-colors group">
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{m.title}</p>
                          <p className="text-[#5A5A5A] text-xs mt-0.5">
                            {vehicle ? `${vehicle.make} ${vehicle.model}` : '—'} · {client ? `${client.first_name} ${client.last_name}` : '—'}
                          </p>
                          <p className="text-[#3A3A3A] text-xs">{formatDate(m.created_at)}</p>
                        </div>
                        <StatusBadge status={m.status} />
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Internal notes */}
          {partner.internal_notes && (
            <Card>
              <CardHeader><CardTitle>Notes internes</CardTitle></CardHeader>
              <CardContent>
                <p className="text-[#B0B0B0] text-sm leading-relaxed">{partner.internal_notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Coordonnées</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: <Phone size={13} />, label: 'Téléphone', value: partner.phone },
                { icon: <Mail size={13} />, label: 'E-mail', value: partner.email },
                { icon: <MapPin size={13} />, label: 'Adresse', value: [partner.address, partner.postal_code, partner.city].filter(Boolean).join(', ') },
                { icon: <MapPin size={13} />, label: 'Zone couverte', value: partner.coverage_area },
              ].map(f => f.value ? (
                <div key={f.label} className="flex items-start gap-2">
                  <span className="text-[#FF7700] mt-0.5 flex-shrink-0">{f.icon}</span>
                  <div>
                    <p className="text-[#5A5A5A] text-xs">{f.label}</p>
                    <p className="text-[#B0B0B0] text-sm">{f.value}</p>
                  </div>
                </div>
              ) : null)}
            </CardContent>
          </Card>

          {/* Quality score visual */}
          <Card className="p-5">
            <p className="text-[#B0B0B0] text-xs uppercase tracking-wider mb-4">Score qualité</p>
            <div className="flex items-end gap-1 mb-2">
              <p className="text-4xl font-black text-[#FF7700]" style={{ fontFamily: 'Montserrat, sans-serif' }}>{score.toFixed(1)}</p>
              <p className="text-[#5A5A5A] text-sm mb-1">/10</p>
            </div>
            <div className="w-full h-2 bg-[#2E2E2E] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#FF7700] to-[#FF9933] rounded-full transition-all" style={{ width: `${score * 10}%` }} />
            </div>
            <p className="text-[#5A5A5A] text-xs mt-2">Basé sur {partner.missions_count} missions</p>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
