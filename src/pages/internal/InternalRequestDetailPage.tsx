import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge, UrgencyBadge, Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Select } from '@/components/ui/Input'
import { mockProfiles, mockVehicles, mockServiceRequests, mockPartners } from '@/data/mockData'
import { formatDate, getCategoryConfig, getStatusConfig, getUrgencyConfig } from '@/lib/utils'
import {
  ArrowLeft, Car, MapPin, Phone, Building2,
  User, CheckCircle2, Clock, ChevronDown, Save, AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RequestStatus } from '@/types'

const statusOptions: { value: RequestStatus; label: string }[] = [
  { value: 'nouveau', label: 'Nouveau' },
  { value: 'analyse', label: 'Analyse' },
  { value: 'devis_en_cours', label: 'Devis en cours' },
  { value: 'en_attente_client', label: 'En attente client' },
  { value: 'planifie', label: 'Planifié' },
  { value: 'pris_en_charge', label: 'Véhicule pris en charge' },
  { value: 'intervention_en_cours', label: 'Intervention en cours' },
  { value: 'termine', label: 'Terminé' },
  { value: 'annule', label: 'Annulé' },
]

const statusFlow: RequestStatus[] = [
  'nouveau', 'analyse', 'devis_en_cours', 'en_attente_client',
  'planifie', 'pris_en_charge', 'intervention_en_cours', 'termine',
]

export function InternalRequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const adminUser = mockProfiles.find(p => p.role === 'carcarry_admin')!
  const request = mockServiceRequests.find(r => r.id === id)
  const [currentStatus, setCurrentStatus] = useState<RequestStatus>(request?.status ?? 'nouveau')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const client = mockProfiles.find(p => p.id === request?.client_id)
  const vehicle = mockVehicles.find(v => v.id === request?.vehicle_id)
  const partner = mockPartners.find(p => p.id === request?.assigned_partner_id)
  const teamMember = mockProfiles.find(p => p.id === request?.assigned_team_member)

  const handleSaveStatus = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!request) {
    return (
      <AppLayout user={adminUser} notificationCount={3}>
        <div className="text-center py-20">
          <p className="text-[#B0B0B0]">Demande introuvable</p>
          <Link to="/internal/requests" className="text-[#FF7700] text-sm mt-4 inline-block hover:underline">← Retour</Link>
        </div>
      </AppLayout>
    )
  }

  const cat = getCategoryConfig(request.category)
  const urgCfg = getUrgencyConfig(request.urgency)
  const currentStepIdx = statusFlow.indexOf(currentStatus)

  return (
    <AppLayout user={adminUser} notificationCount={3}>
      <div className="mb-6 flex items-center justify-between">
        <Link to="/internal/requests" className="flex items-center gap-2 text-[#B0B0B0] hover:text-white text-sm">
          <ArrowLeft size={16} /> Toutes les demandes
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/internal/kanban">
            <Button variant="ghost" size="sm">Vue kanban</Button>
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="bg-[#1C1C1C] border border-[#2E2E2E] rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-14 h-14 bg-[#141414] rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
            {cat.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>{request.title}</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <UrgencyBadge urgency={request.urgency} />
              <StatusBadge status={currentStatus} />
              <Badge variant="gray">{cat.label}</Badge>
              <span className="text-[#5A5A5A] text-xs">Créée le {formatDate(request.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Status management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gestion du statut</CardTitle>
                {saved && <span className="text-green-400 text-xs font-medium flex items-center gap-1"><CheckCircle2 size={12} /> Sauvegardé</span>}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Progress bar */}
              <div className="space-y-3">
                {statusFlow.map((s, i) => {
                  const cfg = getStatusConfig(s)
                  const done = i < currentStepIdx
                  const current = i === currentStepIdx
                  return (
                    <button
                      key={s}
                      onClick={() => setCurrentStatus(s)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all text-left',
                        current ? `${cfg.bg} border-current` : done ? 'border-green-500/20 bg-green-500/5' : 'border-[#2E2E2E] hover:border-[#3A3A3A]'
                      )}
                    >
                      <div className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border',
                        done ? 'bg-green-500/20 border-green-500/40' : current ? `${cfg.bg} border-current` : 'bg-[#141414] border-[#2E2E2E]'
                      )}>
                        {done
                          ? <CheckCircle2 size={14} className="text-green-400" />
                          : current
                          ? <Clock size={12} className={cfg.color} />
                          : <div className="w-2 h-2 rounded-full bg-[#2E2E2E]" />
                        }
                      </div>
                      <span className={cn('text-sm font-medium', done ? 'text-[#5A5A5A]' : current ? cfg.color : 'text-[#5A5A5A]')}>
                        {cfg.label}
                      </span>
                      {current && <span className="ml-auto text-xs font-semibold text-[#FF7700]">ACTUEL</span>}
                    </button>
                  )
                })}
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#2E2E2E]">
                <Select
                  options={statusOptions}
                  value={currentStatus}
                  onChange={e => setCurrentStatus(e.target.value as RequestStatus)}
                  className="flex-1"
                />
                <Button onClick={handleSaveStatus} loading={saving} size="md">
                  <Save size={15} /> Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader><CardTitle>Détails de la demande</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[#B0B0B0] text-sm leading-relaxed">{request.description}</p>
              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-[#2E2E2E]">
                {[
                  { label: 'Lieu souhaité', value: request.preferred_location ?? 'Non précisé', icon: <MapPin size={13} /> },
                  { label: 'Prise en charge', value: request.pickup_needed ? '✓ Oui' : '✗ Non', icon: <Car size={13} /> },
                  { label: 'Véhicule remplacement', value: request.replacement_vehicle_needed ? '✓ Oui' : '✗ Non', icon: <Car size={13} /> },
                  { label: 'Mise à jour', value: formatDate(request.updated_at), icon: <Clock size={13} /> },
                ].map(f => (
                  <div key={f.label} className="flex items-start gap-2">
                    <span className="text-[#5A5A5A] mt-0.5">{f.icon}</span>
                    <div>
                      <p className="text-[#5A5A5A] text-xs">{f.label}</p>
                      <p className="text-white text-sm">{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assignment */}
          <Card>
            <CardHeader><CardTitle>Assignation</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Responsable CarCarry"
                options={mockProfiles
                  .filter(p => p.role === 'carcarry_team' || p.role === 'carcarry_admin')
                  .map(p => ({ value: p.id, label: `${p.first_name} ${p.last_name}` }))}
                defaultValue={request.assigned_team_member ?? ''}
                placeholder="Sélectionner un responsable..."
              />
              <Select
                label="Partenaire"
                options={mockPartners.map(p => ({ value: p.id, label: p.name }))}
                defaultValue={request.assigned_partner_id ?? ''}
                placeholder="Sélectionner un partenaire..."
              />
              <Button variant="secondary" size="sm">
                <Save size={14} /> Enregistrer l'assignation
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Client */}
          {client && (
            <Card>
              <CardHeader><CardTitle>Client</CardTitle></CardHeader>
              <CardContent>
                <Link to={`/internal/clients/${client.id}`} className="flex items-center gap-3 group mb-3">
                  <Avatar firstName={client.first_name} lastName={client.last_name} size="md" />
                  <div>
                    <p className="text-white text-sm font-medium group-hover:text-[#FF7700] transition-colors">{client.first_name} {client.last_name}</p>
                    <p className="text-[#5A5A5A] text-xs">{client.city}, {client.canton}</p>
                  </div>
                </Link>
                {client.phone && (
                  <a href={`tel:${client.phone}`} className="flex items-center gap-2 text-[#B0B0B0] hover:text-[#FF7700] text-xs transition-colors">
                    <Phone size={12} /> {client.phone}
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* Vehicle */}
          {vehicle && (
            <Card>
              <CardHeader><CardTitle>Véhicule</CardTitle></CardHeader>
              <CardContent>
                <Link to={`/internal/vehicles/${vehicle.id}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-[#141414] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Car size={18} className="text-[#FF7700]" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium group-hover:text-[#FF7700] transition-colors">{vehicle.make} {vehicle.model}</p>
                    <p className="text-[#5A5A5A] text-xs">{vehicle.license_plate} · {vehicle.year}</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Partner */}
          {partner && (
            <Card>
              <CardHeader><CardTitle>Partenaire assigné</CardTitle></CardHeader>
              <CardContent>
                <Link to={`/internal/partners/${partner.id}`} className="flex items-center gap-3 group mb-3">
                  <div className="w-10 h-10 bg-[#141414] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 size={18} className="text-[#FF7700]" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium group-hover:text-[#FF7700] transition-colors">{partner.name}</p>
                    <p className="text-[#5A5A5A] text-xs capitalize">{partner.type} · {partner.city}</p>
                  </div>
                </Link>
                {partner.phone && (
                  <a href={`tel:${partner.phone}`} className="flex items-center gap-2 text-[#B0B0B0] hover:text-[#FF7700] text-xs transition-colors">
                    <Phone size={12} /> {partner.phone}
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* Assigned team */}
          {teamMember && (
            <Card>
              <CardHeader><CardTitle>Responsable</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar firstName={teamMember.first_name} lastName={teamMember.last_name} size="sm" />
                  <div>
                    <p className="text-white text-sm font-medium">{teamMember.first_name} {teamMember.last_name}</p>
                    <p className="text-[#5A5A5A] text-xs capitalize">{teamMember.role.replace('_', ' ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Urgent alert */}
          {request.urgency === 'urgente' && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={15} className="text-red-400" />
                <p className="text-red-400 text-sm font-semibold">Demande urgente</p>
              </div>
              <p className="text-[#B0B0B0] text-xs">Cette demande nécessite une intervention rapide.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
