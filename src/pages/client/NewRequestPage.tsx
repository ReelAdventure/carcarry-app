import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { currentMockUser, mockVehicles } from '@/data/mockData'
import { ArrowLeft, CheckCircle2, Upload, Car, Wrench, Zap, Star, ChevronRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/Toast'
import type { RequestCategory, RequestUrgency } from '@/types'
import { cn } from '@/lib/utils'
import { formatMileage } from '@/lib/utils'

const categories: { value: RequestCategory; label: string; icon: string; desc: string; color: string }[] = [
  { value: 'entretien', label: 'Entretien', icon: '🔧', desc: 'Révision, vidange, filtres', color: 'rgba(255,119,0,0.08)' },
  { value: 'reparation', label: 'Réparation', icon: '🔨', desc: 'Diagnostic et réparations', color: 'rgba(248,113,113,0.08)' },
  { value: 'pneus', label: 'Pneus', icon: '⚙️', desc: 'Changement et équilibrage', color: 'rgba(96,165,250,0.08)' },
  { value: 'mfk', label: 'MFK / Expertise', icon: '📋', desc: 'Expertise obligatoire', color: 'rgba(167,139,250,0.08)' },
  { value: 'nettoyage', label: 'Nettoyage', icon: '✨', desc: 'Lavage et detailing', color: 'rgba(52,211,153,0.08)' },
  { value: 'carrosserie', label: 'Carrosserie', icon: '🚗', desc: 'Peinture et carrosserie', color: 'rgba(251,191,36,0.08)' },
  { value: 'transport', label: 'Transport', icon: '🚛', desc: 'Livraison et convoyage', color: 'rgba(34,211,238,0.08)' },
  { value: 'sinistre', label: 'Sinistre', icon: '⚠️', desc: 'Accident et assurance', color: 'rgba(248,113,113,0.08)' },
  { value: 'autre', label: 'Autre', icon: '📌', desc: 'Autre besoin', color: 'rgba(255,255,255,0.04)' },
]

const urgencies: {
  value: RequestUrgency; label: string; sub: string; desc: string
  dotColor: string; border: string; activeBg: string
}[] = [
  { value: 'basse', label: 'Basse priorité', sub: 'Quelques semaines', desc: 'Pas urgent, planifiable tranquillement', dotColor: '#888', border: 'rgba(136,136,136,0.2)', activeBg: 'rgba(136,136,136,0.06)' },
  { value: 'normale', label: 'Normale', sub: 'Dans les jours', desc: 'Dans les prochains jours ouvrables', dotColor: '#60a5fa', border: 'rgba(96,165,250,0.25)', activeBg: 'rgba(96,165,250,0.06)' },
  { value: 'haute', label: 'Haute priorité', sub: 'Dès que possible', desc: 'Traitement prioritaire de notre équipe', dotColor: '#FF7700', border: 'rgba(255,119,0,0.3)', activeBg: 'rgba(255,119,0,0.06)' },
  { value: 'urgente', label: '⚡ Urgente', sub: 'Immédiatement', desc: 'Intervention immédiate requise', dotColor: '#f87171', border: 'rgba(248,113,113,0.3)', activeBg: 'rgba(248,113,113,0.06)' },
]

const STEPS = ['Véhicule', 'Service', 'Détails', 'Options']

export function NewRequestPage() {
  const user = currentMockUser
  const vehicles = mockVehicles.filter(v => v.owner_id === user.id)
  const navigate = useNavigate()
  const { success } = useToast()

  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    vehicle_id: '',
    category: '' as RequestCategory | '',
    urgency: 'normale' as RequestUrgency,
    title: '',
    description: '',
    preferred_location: '',
    availability: '',
    pickup_needed: false,
    replacement_vehicle_needed: false,
  })

  const canNext = () => {
    if (step === 0) return !!form.vehicle_id
    if (step === 1) return !!form.category
    if (step === 2) return !!form.title && !!form.description
    return true
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    setSubmitted(true)
    success('Demande envoyée !', 'L\'équipe CarCarry vous contactera rapidement.')
  }

  // ── Confirmation screen ──
  if (submitted) {
    const vehicle = vehicles.find(v => v.id === form.vehicle_id)
    const cat = categories.find(c => c.value === form.category)
    return (
      <AppLayout user={user} notificationCount={2}>
        <div className="max-w-lg mx-auto py-16 text-center animate-fade-in">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 relative"
            style={{ background: 'rgba(52,211,153,0.1)', border: '2px solid rgba(52,211,153,0.2)' }}
          >
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ background: 'rgba(52,211,153,0.3)' }}
            />
            <CheckCircle2 size={44} className="text-green-400 relative z-10" />
          </div>

          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
            style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px #34d399' }} />
            <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Transmise à CarCarry</span>
          </div>

          <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Demande envoyée !
          </h2>
          <p className="text-[#555] text-sm leading-relaxed mb-8 max-w-sm mx-auto">
            Notre équipe analyse votre demande et vous contactera dans les plus brefs délais pour confirmer la prise en charge.
          </p>

          {/* Summary card */}
          <div
            className="rounded-2xl p-5 text-left mb-8"
            style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="text-[#444] text-[10px] font-bold uppercase tracking-widest mb-4">Récapitulatif</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#444]">Véhicule</span>
                <span className="text-white font-semibold">{vehicle ? `${vehicle.make} ${vehicle.model}` : '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#444]">Service</span>
                <span className="text-white font-semibold">{cat?.icon} {cat?.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#444]">Demande</span>
                <span className="text-white font-semibold truncate max-w-[180px]">{form.title}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link to="/client/requests">
              <Button>Voir mes demandes <ChevronRight size={14} /></Button>
            </Link>
            <Link to="/client">
              <Button variant="secondary">Tableau de bord</Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    )
  }

  const selectedVehicle = vehicles.find(v => v.id === form.vehicle_id)
  const selectedCat = categories.find(c => c.value === form.category)

  return (
    <AppLayout user={user} notificationCount={2}>
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <Link to="/client/requests" className="inline-flex items-center gap-2 text-[#444] hover:text-[#888] text-sm mb-6 transition-colors">
          <ArrowLeft size={15} /> Mes demandes
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Nouvelle demande
          </h1>
          <p className="text-[#444] text-sm">Décrivez votre besoin, CarCarry s'occupe du reste.</p>
        </div>

        {/* ── Stepper ── */}
        <div className="flex items-center mb-10">
          {STEPS.map((label, i) => {
            const done = i < step
            const current = i === step
            return (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300"
                    style={done ? {
                      background: 'rgba(52,211,153,0.15)',
                      border: '1px solid rgba(52,211,153,0.3)',
                      color: '#34d399',
                    } : current ? {
                      background: 'linear-gradient(135deg, #FF7700, #CC5F00)',
                      color: '#fff',
                      boxShadow: '0 2px 10px rgba(255,119,0,0.4)',
                    } : {
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: '#333',
                    }}
                  >
                    {done ? '✓' : i + 1}
                  </div>
                  <span
                    className="text-xs font-semibold hidden sm:block transition-colors"
                    style={{ color: current ? '#fff' : done ? '#34d399' : '#333' }}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="flex-1 h-px mx-3 transition-all duration-500"
                    style={{ background: done ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.05)' }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* ── Mini breadcrumb (context) ── */}
        {(selectedVehicle || selectedCat) && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {selectedVehicle && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{ background: 'rgba(255,119,0,0.07)', border: '1px solid rgba(255,119,0,0.12)', color: '#FF7700' }}
              >
                <Car size={11} /> {selectedVehicle.make} {selectedVehicle.model}
              </div>
            )}
            {selectedCat && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#888' }}
              >
                {selectedCat.icon} {selectedCat.label}
              </div>
            )}
          </div>
        )}

        {/* ── Step 0 — Véhicule ── */}
        {step === 0 && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-[#555] text-xs font-bold uppercase tracking-widest mb-4">Quel véhicule ?</p>
            {vehicles.map(v => {
              const sel = form.vehicle_id === v.id
              return (
                <button
                  key={v.id}
                  onClick={() => setForm(f => ({ ...f, vehicle_id: v.id }))}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200"
                  style={{
                    background: sel ? 'rgba(255,119,0,0.06)' : 'rgba(255,255,255,0.02)',
                    border: sel ? '1px solid rgba(255,119,0,0.3)' : '1px solid rgba(255,255,255,0.05)',
                    boxShadow: sel ? '0 0 0 3px rgba(255,119,0,0.06)' : 'none',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: sel ? 'rgba(255,119,0,0.1)' : 'rgba(255,255,255,0.04)' }}
                  >
                    🚗
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold">{v.make} {v.model}</p>
                    <p className="text-[#444] text-sm">{v.license_plate} · {v.year} · {formatMileage(v.mileage)}</p>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                    style={sel ? {
                      background: '#FF7700',
                      border: '2px solid #FF7700',
                    } : {
                      border: '2px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    {sel && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              )
            })}
            <Link to="/client/vehicles/new">
              <button
                className="w-full flex items-center gap-3 p-4 rounded-2xl text-sm text-[#444] hover:text-[#888] transition-colors"
                style={{ border: '2px dashed rgba(255,255,255,0.05)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <Car size={18} className="opacity-40" />
                </div>
                Ajouter un nouveau véhicule
              </button>
            </Link>
          </div>
        )}

        {/* ── Step 1 — Service ── */}
        {step === 1 && (
          <div className="animate-fade-in">
            <p className="text-[#555] text-xs font-bold uppercase tracking-widest mb-4">Type de service</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map(cat => {
                const sel = form.category === cat.value
                return (
                  <button
                    key={cat.value}
                    onClick={() => setForm(f => ({ ...f, category: cat.value }))}
                    className="flex flex-col items-center p-4 rounded-2xl text-center transition-all duration-200 group"
                    style={{
                      background: sel ? cat.color : 'rgba(255,255,255,0.02)',
                      border: sel ? '1px solid rgba(255,119,0,0.3)' : '1px solid rgba(255,255,255,0.05)',
                      boxShadow: sel ? '0 0 0 3px rgba(255,119,0,0.06)' : 'none',
                    }}
                  >
                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200 block">{cat.icon}</span>
                    <p className={cn('text-sm font-bold mb-0.5', sel ? 'text-white' : 'text-[#ccc]')}>{cat.label}</p>
                    <p className="text-[#444] text-[10px] leading-tight">{cat.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Step 2 — Détails ── */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <p className="text-[#555] text-xs font-bold uppercase tracking-widest mb-4">Décrivez votre besoin</p>

            {/* Urgency */}
            <div>
              <p className="text-[#555] text-xs font-bold uppercase tracking-widest mb-3">Niveau d'urgence</p>
              <div className="grid grid-cols-2 gap-2.5">
                {urgencies.map(u => {
                  const sel = form.urgency === u.value
                  return (
                    <button
                      key={u.value}
                      onClick={() => setForm(f => ({ ...f, urgency: u.value }))}
                      className="p-3.5 rounded-xl text-left transition-all duration-200"
                      style={{
                        background: sel ? u.activeBg : 'rgba(255,255,255,0.02)',
                        border: sel ? `1px solid ${u.border}` : '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ background: u.dotColor, boxShadow: sel ? `0 0 6px ${u.dotColor}` : 'none' }} />
                        <p className="text-white text-xs font-bold">{u.label}</p>
                      </div>
                      <p className="text-[#333] text-xs">{u.sub}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[#444] text-[11px] font-bold uppercase tracking-widest mb-2">
                Titre de la demande
              </label>
              <input
                placeholder={`Ex: Révision annuelle ${selectedVehicle ? selectedVehicle.make : 'BMW'} 530d`}
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full text-sm text-white placeholder-[#2A2A2A] px-4 py-3 rounded-xl outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,119,0,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,119,0,0.06)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[#444] text-[11px] font-bold uppercase tracking-widest mb-2">
                Description détaillée
              </label>
              <textarea
                placeholder="Décrivez votre besoin : symptômes observés, historique, attentes particulières..."
                rows={5}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full text-sm text-white placeholder-[#2A2A2A] px-4 py-3 rounded-xl outline-none transition-all resize-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,119,0,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,119,0,0.06)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' }}
              />
            </div>

            {/* Upload zone */}
            <div
              className="rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 border-2 border-dashed"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,119,0,0.25)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'}
            >
              <Upload size={22} className="text-[#2A2A2A] mx-auto mb-2" />
              <p className="text-[#444] text-sm mb-1">Glissez vos photos ici ou cliquez</p>
              <p className="text-[#2A2A2A] text-xs">JPG, PNG, HEIC · Max 10 Mo · Optionnel</p>
            </div>
          </div>
        )}

        {/* ── Step 3 — Options + recap ── */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <p className="text-[#555] text-xs font-bold uppercase tracking-widest mb-4">Préférences & confirmation</p>

            {/* Location + availability */}
            <div className="grid gap-4">
              <div>
                <label className="block text-[#444] text-[11px] font-bold uppercase tracking-widest mb-2">
                  Lieu souhaité (optionnel)
                </label>
                <input
                  placeholder="Ex: Fribourg, Bulle, Romont..."
                  value={form.preferred_location}
                  onChange={e => setForm(f => ({ ...f, preferred_location: e.target.value }))}
                  className="w-full text-sm text-white placeholder-[#2A2A2A] px-4 py-3 rounded-xl outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,119,0,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,119,0,0.06)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>
              <div>
                <label className="block text-[#444] text-[11px] font-bold uppercase tracking-widest mb-2">
                  Disponibilités (optionnel)
                </label>
                <input
                  placeholder="Ex: Lundi ou mardi matin..."
                  value={form.availability}
                  onChange={e => setForm(f => ({ ...f, availability: e.target.value }))}
                  className="w-full text-sm text-white placeholder-[#2A2A2A] px-4 py-3 rounded-xl outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,119,0,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,119,0,0.06)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>
            </div>

            {/* Options toggles */}
            <div className="space-y-2.5">
              {[
                { key: 'pickup_needed' as const, icon: '🚗', label: 'Prise en charge', desc: 'CarCarry vient chercher et dépose votre véhicule à domicile ou au travail' },
                { key: 'replacement_vehicle_needed' as const, icon: '🔑', label: 'Véhicule de remplacement', desc: 'Besoin d\'un véhicule pendant toute la durée de l\'intervention' },
              ].map(opt => {
                const on = form[opt.key]
                return (
                  <button
                    key={opt.key}
                    onClick={() => setForm(f => ({ ...f, [opt.key]: !f[opt.key] }))}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200"
                    style={{
                      background: on ? 'rgba(255,119,0,0.05)' : 'rgba(255,255,255,0.02)',
                      border: on ? '1px solid rgba(255,119,0,0.25)' : '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">{opt.label}</p>
                      <p className="text-[#444] text-xs leading-relaxed mt-0.5">{opt.desc}</p>
                    </div>
                    <div
                      className="w-11 h-6 rounded-full relative transition-all duration-200 flex-shrink-0"
                      style={{ background: on ? '#FF7700' : 'rgba(255,255,255,0.08)' }}
                    >
                      <div
                        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200"
                        style={{ left: on ? '22px' : '2px' }}
                      />
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Recap */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: 'linear-gradient(135deg, rgba(255,119,0,0.06) 0%, rgba(255,119,0,0.02) 100%)',
                border: '1px solid rgba(255,119,0,0.15)',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Star size={13} className="text-[#FF7700]" />
                <p className="text-[#FF7700] text-xs font-bold uppercase tracking-wider">Récapitulatif</p>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Véhicule', value: selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : '—' },
                  { label: 'Service', value: selectedCat ? `${selectedCat.icon} ${selectedCat.label}` : '—' },
                  { label: 'Urgence', value: urgencies.find(u => u.value === form.urgency)?.label ?? '—' },
                  { label: 'Demande', value: form.title || '—' },
                  { label: 'Lieu', value: form.preferred_location || 'Non précisé' },
                  { label: 'Prise en charge', value: form.pickup_needed ? '✓ Oui' : '✗ Non' },
                  { label: 'Remplacement', value: form.replacement_vehicle_needed ? '✓ Oui' : '✗ Non' },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between gap-2">
                    <span className="text-[#444] text-xs">{r.label}</span>
                    <span className="text-[#ccc] text-xs font-semibold text-right truncate max-w-[200px]">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Button
            variant="secondary"
            onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/client/requests')}
          >
            {step === 0 ? 'Annuler' : '← Précédent'}
          </Button>

          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-30"
              style={{
                background: 'linear-gradient(135deg, #FF7700 0%, #CC5F00 100%)',
                boxShadow: canNext() ? '0 2px 12px rgba(255,119,0,0.3)' : 'none',
              }}
            >
              Continuer <ChevronRight size={15} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #FF7700 0%, #CC5F00 100%)',
                boxShadow: '0 2px 12px rgba(255,119,0,0.3)',
              }}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Zap size={15} /> Envoyer la demande
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
