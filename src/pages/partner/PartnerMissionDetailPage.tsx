import { useParams, Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { StatusBadge, UrgencyBadge, Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  mockProfiles, mockVehicles, mockServiceRequests,
  mockPartners, mockInterventions
} from '@/data/mockData'
import {
  formatDate, formatMileage, formatCurrency,
  getCategoryConfig, getStatusConfig
} from '@/lib/utils'
import {
  ArrowLeft, Car, User, MapPin, Calendar, Zap,
  FileText, Upload, CheckCircle2, Clock, AlertCircle,
  ChevronRight, Send, Wrench, Phone, Mail
} from 'lucide-react'
import { useState } from 'react'

import type { RequestStatus } from '@/types'

const STATUS_FLOW: RequestStatus[] = [
  'nouveau',
  'analyse',
  'devis_en_cours',
  'en_attente_client',
  'planifie',
  'pris_en_charge',
  'intervention_en_cours',
  'termine',
]

type PartnerProfile = typeof mockProfiles[0]

const partnerUser: PartnerProfile = {
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

export function PartnerMissionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const request = mockServiceRequests.find(r => r.id === id)
  const vehicle = request ? mockVehicles.find(v => v.id === request.vehicle_id) : null
  const client = request ? mockProfiles.find(p => p.id === request.client_id) : null
  const partner = mockPartners[0]
  const intervention = request ? mockInterventions.find(i => i.request_id === request.id) : null

  const [quoteAmount, setQuoteAmount] = useState('')
  const [quoteNotes, setQuoteNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [newStatus, setNewStatus] = useState<RequestStatus>(request?.status ?? 'planifie')

  if (!request) {
    return (
      <AppLayout user={partnerUser} notificationCount={1}>
        <div className="flex flex-col items-center justify-center py-24">
          <AlertCircle size={40} className="text-[#3A3A3A] mb-4" />
          <p className="text-white font-semibold text-lg mb-1">Mission introuvable</p>
          <p className="text-[#5A5A5A] text-sm mb-6">Cette mission n'existe pas ou n'est plus accessible.</p>
          <Link to="/partner">
            <Button variant="secondary">← Retour aux missions</Button>
          </Link>
        </div>
      </AppLayout>
    )
  }

  const cat = getCategoryConfig(request.category)
  const statusCfg = getStatusConfig(request.status)
  const currentStep = STATUS_FLOW.indexOf(request.status as typeof STATUS_FLOW[number])
  const canSubmitQuote = (['analyse', 'devis_en_cours'] as RequestStatus[]).includes(request.status)
  const canUpdateStatus = (['planifie', 'pris_en_charge', 'intervention_en_cours'] as RequestStatus[]).includes(request.status)

  const handleSubmitQuote = () => {
    if (!quoteAmount) return
    setSubmitted(true)
  }

  return (
    <AppLayout user={partnerUser} notificationCount={1}>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/partner"
          className="inline-flex items-center gap-2 text-[#B0B0B0] hover:text-white text-sm mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> Retour aux missions
        </Link>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <span className="text-3xl">{cat.icon}</span>
            <div>
              <p className="text-[#B0B0B0] text-xs uppercase tracking-wider mb-1">{cat.label}</p>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {request.title}
              </h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <StatusBadge status={request.status} />
                <UrgencyBadge urgency={request.urgency} />
                <span className="text-[#3A3A3A] text-xs">#{request.id.split('-')[1]}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canUpdateStatus && (
              <Button variant="primary" size="sm" className="gap-2">
                <CheckCircle2 size={15} />
                Mettre à jour le statut
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Progress steps */}
      <Card className="mb-6 p-5">
        <p className="text-[#5A5A5A] text-xs uppercase tracking-wider mb-4">Progression de la mission</p>
        <div className="flex items-center gap-1 flex-wrap">
          {STATUS_FLOW.map((s, idx) => {
            const cfg = getStatusConfig(s)
            const done = idx < currentStep
            const active = idx === currentStep
            const future = idx > currentStep
            return (
              <div key={s} className="flex items-center gap-1">
                <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'bg-[#FF7700]/15 border border-[#FF7700]/30 text-white'
                    : done
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-[#1C1C1C] border border-[#2E2E2E] text-[#3A3A3A]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#FF7700]' : done ? 'bg-green-400' : 'bg-[#3A3A3A]'}`} />
                  {cfg.label}
                  {done && <CheckCircle2 size={10} className="text-green-400" />}
                </div>
                {idx < STATUS_FLOW.length - 1 && (
                  <ChevronRight size={12} className={done ? 'text-green-400' : 'text-[#2E2E2E]'} />
                )}
              </div>
            )
          })}
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader><CardTitle>Description de la mission</CardTitle></CardHeader>
            <CardContent>
              <p className="text-[#B0B0B0] text-sm leading-relaxed">{request.description}</p>
              {request.pickup_needed && (
                <div className="mt-4 flex items-center gap-2 text-xs text-[#FF7700] bg-[#FF7700]/10 border border-[#FF7700]/20 rounded-lg px-3 py-2">
                  <Car size={14} />
                  Prise en charge du véhicule requise par CarCarry
                </div>
              )}
              {request.replacement_vehicle_needed && (
                <div className="mt-2 flex items-center gap-2 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2">
                  <Car size={14} />
                  Véhicule de remplacement nécessaire pour le client
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vehicle details */}
          {vehicle && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Car size={16} className="text-[#FF7700]" />
                  <CardTitle>Véhicule concerné</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FF7700]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Car size={22} className="text-[#FF7700]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">
                      {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-[#B0B0B0] text-sm">{vehicle.version} · {vehicle.year}</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-3 text-xs">
                      {[
                        { label: 'Plaque', value: vehicle.license_plate },
                        { label: 'Couleur', value: vehicle.color },
                        { label: 'Énergie', value: vehicle.fuel_type },
                        { label: 'Kilométrage', value: formatMileage(vehicle.mileage) },
                        { label: 'Transmission', value: vehicle.transmission },
                        { label: 'VIN', value: vehicle.vin },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-[#5A5A5A]">{label}</p>
                          <p className="text-[#B0B0B0] font-medium">{value ?? '—'}</p>
                        </div>
                      ))}
                    </div>
                    {vehicle.notes && (
                      <div className="mt-3 text-xs text-[#B0B0B0] bg-[#1C1C1C] rounded-lg px-3 py-2 border border-[#2E2E2E]">
                        <span className="text-[#5A5A5A]">Note client : </span>{vehicle.notes}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Intervention details */}
          {intervention && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Wrench size={16} className="text-[#FF7700]" />
                  <CardTitle>Détails de l'intervention</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#5A5A5A] text-xs mb-1">Date de début</p>
                    <p className="text-white text-sm font-medium">{formatDate(intervention.start_date)}</p>
                  </div>
                  {intervention.end_date && (
                    <div>
                      <p className="text-[#5A5A5A] text-xs mb-1">Date de fin</p>
                      <p className="text-white text-sm font-medium">{formatDate(intervention.end_date)}</p>
                    </div>
                  )}
                  {intervention.final_cost && (
                    <div>
                      <p className="text-[#5A5A5A] text-xs mb-1">Coût final</p>
                      <p className="text-[#FF7700] text-sm font-bold">{formatCurrency(intervention.final_cost)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[#5A5A5A] text-xs mb-1">Statut</p>
                    <Badge variant={intervention.status === 'termine' ? 'green' : intervention.status === 'annule' ? 'red' : 'orange'}>
                      {intervention.status === 'termine' ? 'Terminé' : intervention.status === 'en_cours' ? 'En cours' : intervention.status === 'planifie' ? 'Planifié' : 'Annulé'}
                    </Badge>
                  </div>
                </div>
                {intervention.summary && (
                  <div className="mt-4 text-sm text-[#B0B0B0] bg-[#1C1C1C] rounded-lg p-3 border border-[#2E2E2E]">
                    <p className="text-[#5A5A5A] text-xs mb-1">Résumé :</p>
                    {intervention.summary}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quote submission */}
          {canSubmitQuote && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-[#FF7700]" />
                  <CardTitle>Soumettre un devis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="flex flex-col items-center py-8 gap-3">
                    <div className="w-12 h-12 bg-green-500/15 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={24} className="text-green-400" />
                    </div>
                    <p className="text-white font-semibold">Devis soumis avec succès</p>
                    <p className="text-[#5A5A5A] text-sm text-center">
                      CarCarry a reçu votre devis de <span className="text-[#FF7700] font-bold">CHF {quoteAmount}</span>.
                      <br/>Vous serez notifié une fois validé.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="cc-label">Montant du devis (CHF)</label>
                      <input
                        type="number"
                        value={quoteAmount}
                        onChange={e => setQuoteAmount(e.target.value)}
                        placeholder="ex. 450.00"
                        className="cc-input mt-1 w-full"
                      />
                    </div>
                    <div>
                      <label className="cc-label">Notes / détail des prestations</label>
                      <textarea
                        value={quoteNotes}
                        onChange={e => setQuoteNotes(e.target.value)}
                        placeholder="Listez les prestations incluses dans ce devis..."
                        rows={4}
                        className="cc-input mt-1 w-full resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-2 border-t border-[#2E2E2E]">
                      <Button variant="secondary" size="sm" className="gap-2 flex-1 justify-center">
                        <Upload size={15} />
                        Joindre un PDF
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="gap-2 flex-1 justify-center"
                        onClick={handleSubmitQuote}
                      >
                        <Send size={15} />
                        Envoyer le devis
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Status update (for active interventions) */}
          {canUpdateStatus && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-[#FF7700]" />
                  <CardTitle>Mettre à jour le statut</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-[#5A5A5A] text-sm">Informez CarCarry de l'avancement de l'intervention :</p>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as RequestStatus)}
                    className="cc-input w-full"
                  >
                    <option value="planifie">Planifié</option>
                    <option value="intervention_en_cours">Intervention en cours</option>
                    <option value="termine">Terminé</option>
                  </select>
                  <div className="flex gap-3">
                    <textarea
                      placeholder="Commentaire optionnel (ex. pièce en attente de livraison...)"
                      rows={2}
                      className="cc-input flex-1 resize-none text-sm"
                    />
                    <Button variant="primary" size="sm" className="gap-2 self-end">
                      <CheckCircle2 size={15} />
                      Valider
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-[#FF7700]" />
                  <CardTitle>Documents</CardTitle>
                </div>
                <Button variant="secondary" size="sm" className="gap-2">
                  <Upload size={14} />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {request.status === 'termine' ? (
                <div className="space-y-2">
                  {['Rapport d\'intervention', 'Facture finale', 'Photos avant/après'].map((doc, i) => (
                    <div key={doc} className="flex items-center justify-between px-3 py-2.5 bg-[#1C1C1C] rounded-lg border border-[#2E2E2E] group hover:border-[#3A3A3A] transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText size={15} className="text-[#5A5A5A]" />
                        <div>
                          <p className="text-white text-sm">{doc}</p>
                          <p className="text-[#3A3A3A] text-xs">PDF · {(i + 1) * 180}Ko</p>
                        </div>
                      </div>
                      <button className="text-[#FF7700] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Télécharger
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Upload size={28} className="text-[#3A3A3A] mx-auto mb-2" />
                  <p className="text-[#5A5A5A] text-sm">Aucun document pour l'instant</p>
                  <p className="text-[#3A3A3A] text-xs mt-1">Déposez vos rapports et factures ici</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Contact CarCarry */}
          <Card>
            <CardHeader><CardTitle>Contact CarCarry</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#FF7700] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">LF</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Laura Favre</p>
                  <p className="text-[#5A5A5A] text-xs">Gestionnaire de mission</p>
                </div>
              </div>
              <div className="space-y-2 pt-1">
                <a href="tel:+41790000002" className="flex items-center gap-2 text-[#B0B0B0] hover:text-white text-sm transition-colors">
                  <Phone size={14} className="text-[#FF7700]" />
                  +41 79 000 00 02
                </a>
                <a href="mailto:laura@carcarry.ch" className="flex items-center gap-2 text-[#B0B0B0] hover:text-white text-sm transition-colors">
                  <Mail size={14} className="text-[#FF7700]" />
                  laura@carcarry.ch
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Mission info */}
          <Card>
            <CardHeader><CardTitle>Informations mission</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  icon: <Calendar size={14} className="text-[#FF7700]" />,
                  label: 'Créée le',
                  value: formatDate(request.created_at),
                },
                {
                  icon: <Clock size={14} className="text-[#FF7700]" />,
                  label: 'Mise à jour',
                  value: formatDate(request.updated_at ?? request.created_at),
                },
                ...(request.preferred_dates && request.preferred_dates.length > 0 ? [{
                  icon: <Calendar size={14} className="text-[#FF7700]" />,
                  label: 'Dates souhaitées',
                  value: request.preferred_dates.map(d => formatDate(d)).join(', '),
                }] : []),
                ...(request.preferred_location ? [{
                  icon: <MapPin size={14} className="text-[#FF7700]" />,
                  label: 'Localisation',
                  value: request.preferred_location,
                }] : []),
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0">{icon}</span>
                  <div>
                    <p className="text-[#5A5A5A] text-xs">{label}</p>
                    <p className="text-[#B0B0B0] text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Client info (anonymized) */}
          <Card>
            <CardHeader><CardTitle>Client</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-[#272727] rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-[#5A5A5A]" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">
                    {client ? `${client.first_name} ${client.last_name[0]}.` : 'Client CarCarry'}
                  </p>
                  <p className="text-[#5A5A5A] text-xs">{client?.city ?? '—'}</p>
                </div>
              </div>
              <div className="text-xs text-[#3A3A3A] bg-[#1C1C1C] rounded-lg px-3 py-2 border border-[#2E2E2E]">
                Les coordonnées complètes du client sont gérées par CarCarry.
              </div>
            </CardContent>
          </Card>

          {/* Partner info */}
          <Card>
            <CardHeader><CardTitle>Votre société</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: 'Nom', value: partner?.name },
                { label: 'Zone', value: partner?.coverage_area },
                { label: 'Score qualité', value: `${partner?.quality_score?.toFixed(1)}/10` },
                { label: 'Missions totales', value: partner?.missions_count?.toString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-1 border-b border-[#1E1E1E] last:border-0">
                  <p className="text-[#5A5A5A] text-xs">{label}</p>
                  <p className="text-[#B0B0B0] text-xs font-medium">{value ?? '—'}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
