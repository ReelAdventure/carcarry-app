import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { useToast } from '@/components/ui/Toast'
import { currentMockUser } from '@/data/mockData'
import { formatDate } from '@/lib/utils'
import { User, Phone, MapPin, Shield, Bell, Camera, CheckCircle2, LogOut } from 'lucide-react'

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="text-[#FF7700]">{icon}</div>
        <p className="text-white font-bold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{title}</p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function Field({ label, type = 'text', defaultValue, placeholder }: {
  label: string; type?: string; defaultValue?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-[#444] text-[11px] font-bold uppercase tracking-widest mb-2">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        className="w-full text-sm text-white placeholder-[#2A2A2A] px-4 py-3 rounded-xl outline-none transition-all"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,119,0,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,119,0,0.06)' }}
        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' }}
      />
    </div>
  )
}

function Toggle({ label, desc, defaultOn }: { label: string; desc: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn ?? false)
  return (
    <button
      onClick={() => setOn(!on)}
      className="w-full flex items-center justify-between gap-4 p-4 rounded-xl text-left transition-all duration-150"
      style={{
        background: on ? 'rgba(255,119,0,0.04)' : 'rgba(255,255,255,0.02)',
        border: on ? '1px solid rgba(255,119,0,0.12)' : '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div className="flex-1">
        <p className="text-[#ccc] text-sm font-semibold">{label}</p>
        <p className="text-[#333] text-xs mt-0.5">{desc}</p>
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
}

export function ProfilePage() {
  const user = currentMockUser
  const { success } = useToast()

  const handleSave = () => success('Profil mis à jour', 'Vos informations ont été enregistrées.')
  const handlePwd = () => success('Mot de passe modifié', 'Votre mot de passe a été changé avec succès.')

  return (
    <AppLayout user={user} notificationCount={2}>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Mon profil</h1>
        <p className="text-[#444] text-sm">Gérez vos informations et préférences</p>
      </div>

      <div className="max-w-2xl space-y-5">

        {/* ── Profile hero ── */}
        <div
          className="relative rounded-2xl p-6 overflow-hidden"
          style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div
            className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,119,0,0.05) 0%, transparent 70%)' }}
          />
          <div className="flex items-center gap-5">
            <div className="relative group flex-shrink-0">
              <Avatar firstName={user.first_name} lastName={user.last_name} size="xl" />
              <button
                className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(0,0,0,0.6)' }}
              >
                <Camera size={18} className="text-white" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black text-white mb-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-[#555] text-sm">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)', color: '#34d399' }}
                >
                  <CheckCircle2 size={11} /> Compte vérifié
                </div>
                <span className="text-[#2A2A2A] text-xs">Client depuis {formatDate(user.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div
            className="flex gap-6 mt-5 pt-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
          >
            {[
              { label: 'Véhicules', value: '2' },
              { label: 'Demandes', value: '5' },
              { label: 'Interventions', value: '8' },
              { label: 'Membre depuis', value: '2024' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-white font-black text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>{s.value}</p>
                <p className="text-[#333] text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Personal info ── */}
        <Section icon={<User size={16} />} title="Informations personnelles">
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Prénom" defaultValue={user.first_name} />
              <Field label="Nom" defaultValue={user.last_name} />
            </div>
            <Field label="Adresse e-mail" type="email" defaultValue={user.email} />
            <Field label="Téléphone" defaultValue={user.phone} />
            <Button onClick={handleSave}>Enregistrer les modifications</Button>
          </div>
        </Section>

        {/* ── Address ── */}
        <Section icon={<MapPin size={16} />} title="Adresse de prise en charge">
          <div className="space-y-4">
            <Field label="Adresse" defaultValue={user.address} />
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="NPA" defaultValue={user.postal_code} />
              <div className="sm:col-span-2">
                <Field label="Ville" defaultValue={user.city} />
              </div>
            </div>
            <Field label="Canton" defaultValue={user.canton} />
            <p className="text-[#333] text-xs">Cette adresse sera utilisée par défaut pour la prise en charge de vos véhicules.</p>
            <Button onClick={handleSave}>Enregistrer l'adresse</Button>
          </div>
        </Section>

        {/* ── Notifications ── */}
        <Section icon={<Bell size={16} />} title="Préférences de notification">
          <div className="space-y-2.5">
            <Toggle label="Mises à jour des demandes" desc="Email à chaque changement de statut" defaultOn={true} />
            <Toggle label="Rappels MFK et service" desc="Alerte 2 mois avant l'échéance" defaultOn={true} />
            <Toggle label="Rappels pneus saisonniers" desc="Rappel pour le changement été/hiver" defaultOn={false} />
            <Toggle label="Offres et actualités CarCarry" desc="Informations sur nos services et promotions" defaultOn={false} />
          </div>
        </Section>

        {/* ── Security ── */}
        <Section icon={<Shield size={16} />} title="Sécurité">
          <div className="space-y-4">
            <Field label="Mot de passe actuel" type="password" placeholder="••••••••" />
            <Field label="Nouveau mot de passe" type="password" placeholder="••••••••" />
            <Field label="Confirmer le nouveau mot de passe" type="password" placeholder="••••••••" />
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handlePwd}>Changer le mot de passe</Button>
            </div>
          </div>
        </Section>

        {/* ── Danger zone ── */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'rgba(248,113,113,0.03)', border: '1px solid rgba(248,113,113,0.1)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#888] text-sm font-semibold">Déconnexion</p>
              <p className="text-[#333] text-xs mt-0.5">Terminer la session en cours</p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-red-400 transition-all"
              style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.12)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.14)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.08)'}
            >
              <LogOut size={13} /> Déconnexion
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
