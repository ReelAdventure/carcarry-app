import { useParams, Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { StatusBadge, UrgencyBadge, Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { currentMockUser, mockVehicles, mockServiceRequests, mockPartners } from '@/data/mockData'
import { formatDate, getCategoryConfig, getStatusConfig } from '@/lib/utils'
import { ArrowLeft, Car, MapPin, Calendar, Phone, CheckCircle2, Clock, Star, MessageSquare, ChevronRight, Copy } from 'lucide-react'
import type { RequestStatus } from '@/types'

const statusSteps: { status: RequestStatus; label: string; desc: string }[] = [
  { status: 'nouveau', label: 'Reçue', desc: 'Demande transmise à CarCarry' },
  { status: 'analyse', label: 'En analyse', desc: 'Notre équipe étudie votre demande' },
  { status: 'devis_en_cours', label: 'Devis en cours', desc: 'Préparation du devis partenaire' },
  { status: 'en_attente_client', label: 'Votre accord', desc: 'En attente de votre validation' },
  { status: 'planifie', label: 'Planifiée', desc: 'Rendez-vous confirmé avec le partenaire' },
  { status: 'pris_en_charge', label: 'Prise en charge', desc: 'Votre véhicule est en route' },
  { status: 'intervention_en_cours', label: 'Intervention', desc: 'Travaux en cours chez le partenaire' },
  { status: 'termine', label: 'Terminée', desc: 'Votre véhicule est prêt !' },
]

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const user = currentMockUser
  const { info } = useToast()
  const request = mockServiceRequests.find(r => r.id === id)
  const vehicles = mockVehicles.filter(v => v.owner_id === user.id)
  const vehicle = vehicles.find(v => v.id === request?.vehicle_id)
  const partner = mockPartners.find(p => p.id === request?.assigned_partner_id)

  if (!request) {
    return (
      <AppLayout user={user}>
        <div className="text-center py-20">
          <p className="text-[#555] mb-4">Demande introuvable</p>
          <Link to="/client/requests"><Button variant="secondary">Retour</Button></Link>
        </div>
      </AppLayout>
    )
  }

  const cat = getCategoryConfig(request.category)
  const currentStepIdx = statusSteps.findIndex(s => s.status === request.status)
  const isTerminated = request.status === 'termine' || request.status === 'annule'
  const isCancelled = request.status === 'annule'

  // Progress percentage
  const progressPct = isTerminated ? 100 : Math.round((currentStepIdx / (statusSteps.length - 1)) * 100)

  return (
    <AppLayout user={user} notificationCount={2}>
      {/* Back */}
      <Link to="/client/requests" className="inline-flex items-center gap-2 text-[#444] hover:text-[#888] text-sm mb-6 transition-colors">
        <ArrowLeft size={15} /> Mes demandes
      </Link>

      {/* ── Hero header ── */}
      <div
        className="relative rounded-2xl p-6 mb-6 overflow-hidden"
        style={{
          background: '#111111',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Top progress bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div
            className="h-full transition-all duration-700"
            style={{
              width: `${progressPct}%`,
              background: isTerminated ? 'linear-gradient(90deg, #34d399, #10b981)' : 'linear-gradient(90deg, #FF7700, #FF9933)',
            }}
          />
        </div>

        <div className="flex items-start gap-4 flex-wrap">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {cat.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {request.title}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#444] text-xs">{cat.label}</span>
              <span className="text-[#2A2A2A]">·</span>
              <span className="text-[#444] text-xs">Créée le {formatDate(request.created_at)}</span>
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <UrgencyBadge urgency={request.urgency} />
              <StatusBadge status={request.status} />
            </div>
          </div>

          {/* Progress % */}
          <div className="text-right flex-shrink-0">
            <p className="text-3xl font-black" style={{
              fontFamily: 'Montserrat, sans-serif',
              color: isTerminated ? '#34d399' : '#FF7700',
            }}>
              {progressPct}%
            </p>
            <p className="text-[#333] text-xs">progression</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* ── Timeline ── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-white font-bold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Suivi de votre demande</p>
            </div>
            <div className="p-6">
              <div className="relative">
                {/* Vertical line */}
                <div
                  className="absolute left-[15px] top-4 bottom-4 w-px"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                />

                <div className="space-y-0">
                  {statusSteps.map((s, i) => {
                    const done = i < currentStepIdx || isTerminated
                    const current = i === currentStepIdx && !isTerminated
                    const future = i > currentStepIdx && !isTerminated

                    return (
                      <div key={s.status} className="flex gap-4 relative pb-6 last:pb-0">
                        {/* Icon */}
                        <div className="flex-shrink-0 z-10">
                          {done ? (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}
                            >
                              <CheckCircle2 size={15} className="text-green-400" />
                            </div>
                          ) : current ? (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{
                                background: 'rgba(255,119,0,0.15)',
                                border: '2px solid #FF7700',
                                boxShadow: '0 0 12px rgba(255,119,0,0.25)',
                              }}
                            >
                              <Clock size={14} className="text-[#FF7700]" />
                            </div>
                          ) : (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                            >
                              <div className="w-2 h-2 rounded-full bg-[#222]" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1 pb-1">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-bold ${done ? 'text-[#888]' : current ? 'text-white' : 'text-[#333]'}`}>
                              {s.label}
                            </p>
                            {current && (
                              <span
                                className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide animate-pulse"
                                style={{ background: 'rgba(255,119,0,0.12)', color: '#FF7700' }}
                              >
                                EN COURS
                              </span>
                            )}
                          </div>
                          <p className={`text-xs mt-0.5 ${done ? 'text-[#333]' : current ? 'text-[#555]' : 'text-[#222]'}`}>
                            {s.desc}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── Details ── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-white font-bold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Détails de la demande</p>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-[#444] text-[10px] font-bold uppercase tracking-widest mb-2">Description</p>
                <p className="text-[#888] text-sm leading-relaxed">{request.description}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                {[
                  { icon: <MapPin size={14} />, label: 'Lieu souhaité', value: request.preferred_location ?? 'Non précisé' },
                  { icon: <Car size={14} />, label: 'Prise en charge', value: request.pickup_needed ? '✓ Oui' : '✗ Non' },
                  { icon: <Calendar size={14} />, label: 'Remplacement', value: request.replacement_vehicle_needed ? '✓ Oui' : '✗ Non' },
                  { icon: <Clock size={14} />, label: 'Dernière màj', value: formatDate(request.updated_at) },
                ].map(d => (
                  <div key={d.label} className="flex items-start gap-2.5">
                    <div className="text-[#333] mt-0.5 flex-shrink-0">{d.icon}</div>
                    <div>
                      <p className="text-[#333] text-xs">{d.label}</p>
                      <p className="text-[#999] text-sm font-semibold">{d.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Message CarCarry ── */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(255,119,0,0.05) 0%, rgba(255,119,0,0.01) 100%)',
              border: '1px solid rgba(255,119,0,0.12)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={14} className="text-[#FF7700]" />
              <p className="text-[#FF7700] text-xs font-bold uppercase tracking-wider">Message de CarCarry</p>
            </div>
            <p className="text-[#555] text-sm leading-relaxed">
              Votre demande est bien reçue et en cours de traitement. Notre équipe vous contactera dans les 24h pour confirmer les détails et planifier l'intervention. Merci de votre confiance.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FF7700] to-[#CC5500] flex items-center justify-center">
                <span className="text-white text-[8px] font-black">CC</span>
              </div>
              <span className="text-[#444] text-xs">Équipe CarCarry · {formatDate(request.updated_at)}</span>
            </div>
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div className="space-y-5">

          {/* Vehicle */}
          {vehicle && (
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <p className="text-white font-bold text-xs" style={{ fontFamily: 'Montserrat, sans-serif' }}>Véhicule</p>
              </div>
              <div className="p-5">
                <Link to={`/client/vehicles/${vehicle.id}`} className="flex items-center gap-3 group">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: 'rgba(255,119,0,0.07)', border: '1px solid rgba(255,119,0,0.12)' }}
                  >
                    🚗
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm group-hover:text-[#FF7700] transition-colors">{vehicle.make} {vehicle.model}</p>
                    <p className="text-[#333] text-xs">{vehicle.license_plate} · {vehicle.year}</p>
                  </div>
                  <ChevronRight size={13} className="text-[#222] group-hover:text-[#FF7700] transition-colors" />
                </Link>
              </div>
            </div>
          )}

          {/* Partner */}
          {partner && (
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <p className="text-white font-bold text-xs" style={{ fontFamily: 'Montserrat, sans-serif' }}>Partenaire assigné</p>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <p className="text-white font-bold text-sm">{partner.name}</p>
                  <Badge variant="gray" className="mt-1">{partner.type}</Badge>
                </div>
                {partner.quality_score && (
                  <div className="flex items-center gap-1.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={12} className={s <= Math.round(partner.quality_score ?? 0) ? 'text-[#FF7700]' : 'text-[#222]'} fill={s <= Math.round(partner.quality_score ?? 0) ? '#FF7700' : 'none'} />
                    ))}
                    <span className="text-[#FF7700] text-xs font-bold ml-1">{partner.quality_score?.toFixed(1)}</span>
                  </div>
                )}
                {partner.phone && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-[#333]" />
                      <p className="text-[#666] text-xs">{partner.phone}</p>
                    </div>
                    <button
                      onClick={() => { navigator.clipboard?.writeText(partner.phone ?? ''); info('Copié !', partner.phone ?? '') }}
                      className="text-[#333] hover:text-[#888] transition-colors"
                    >
                      <Copy size={11} />
                    </button>
                  </div>
                )}
                {partner.city && (
                  <div className="flex items-center gap-2">
                    <MapPin size={12} className="text-[#333]" />
                    <p className="text-[#666] text-xs">{partner.city}, {partner.canton}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact CarCarry */}
          <div
            className="relative rounded-2xl p-5 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,119,0,0.08) 0%, rgba(255,119,0,0.02) 100%)',
              border: '1px solid rgba(255,119,0,0.15)',
            }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none" style={{
              background: 'radial-gradient(circle, rgba(255,119,0,0.1) 0%, transparent 70%)',
            }} />
            <div className="relative">
              <p className="text-white font-bold text-sm mb-1">Une question ?</p>
              <p className="text-[#444] text-xs mb-4 leading-relaxed">
                Notre équipe est disponible pour vous informer sur l'avancement de votre demande.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Phone size={13} /> Contacter CarCarry
              </Button>
            </div>
          </div>

          {/* Reference */}
          <div
            className="rounded-2xl px-5 py-4"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <p className="text-[#333] text-[10px] font-bold uppercase tracking-widest mb-2">Référence</p>
            <div className="flex items-center justify-between">
              <p className="text-[#555] text-xs font-mono">{request.id}</p>
              <button
                onClick={() => { navigator.clipboard?.writeText(request.id); info('Référence copiée') }}
                className="text-[#2A2A2A] hover:text-[#555] transition-colors"
              >
                <Copy size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
