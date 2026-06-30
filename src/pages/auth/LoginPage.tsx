import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Eye, EyeOff, Car, Shield, Clock, Star, ArrowRight } from 'lucide-react'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<'client' | 'internal' | 'partner'>('client')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    if (role === 'internal') navigate('/internal')
    else if (role === 'partner') navigate('/partner')
    else navigate('/client')
    setLoading(false)
  }

  const features = [
    { icon: <Shield size={16} />, text: 'Partenaires certifiés & vérifiés' },
    { icon: <Clock size={16} />, text: 'Prise en charge & retour à domicile' },
    { icon: <Star size={16} />, text: 'Suivi en temps réel de votre véhicule' },
    { icon: <Car size={16} />, text: 'Véhicule de remplacement disponible' },
  ]

  return (
    <div className="min-h-screen flex" style={{ background: '#080808' }}>
      {/* ── LEFT — Visual panel ── */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-14 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #0E0E0E 0%, #111111 50%, #0A0A0A 100%)',
          borderRight: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {/* Ambient glows */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-10%', right: '-5%',
            width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(255,119,0,0.08) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '5%', left: '-10%',
            width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(255,119,0,0.04) 0%, transparent 65%)',
          }}
        />

        {/* Grid texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Logo */}
        <div className="flex items-center gap-3.5 relative z-10">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #FF7700 0%, #CC5F00 100%)',
              boxShadow: '0 6px 20px rgba(255,119,0,0.4)',
            }}
          >
            <span className="text-white font-black text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>CC</span>
          </div>
          <div>
            <p className="text-white font-bold text-xl leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>CarCarry</p>
            <p className="text-[#333] text-xs tracking-widest uppercase">Conciergerie</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-6 h-px bg-[#FF7700]" />
            <span className="text-[#FF7700] text-xs font-bold uppercase tracking-[0.15em]">Canton de Fribourg, Suisse</span>
          </div>

          <h1
            className="text-5xl font-black leading-[1.1] mb-6 text-white"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Votre véhicule.<br />
            <span style={{
              background: 'linear-gradient(135deg, #FF7700 30%, #FF9933 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Notre expertise.
            </span>
          </h1>

          <p className="text-[#555] text-base leading-relaxed max-w-sm mb-10">
            La plateforme premium qui centralise tous vos services automobiles — entretien, révision, pneus, MFK.
          </p>

          {/* Features */}
          <div className="space-y-3.5">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3.5 group">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                  style={{
                    background: 'rgba(255,119,0,0.08)',
                    border: '1px solid rgba(255,119,0,0.12)',
                    color: '#FF7700',
                  }}
                >
                  {f.icon}
                </div>
                <p className="text-[#555] text-sm group-hover:text-[#888] transition-colors">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex items-center gap-8">
          {[
            { value: '200+', label: 'Véhicules gérés' },
            { value: '12', label: 'Partenaires certifiés' },
            { value: '4.9★', label: 'Note client' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-white font-black text-xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>{s.value}</p>
              <p className="text-[#333] text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT — Form ── */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Subtle top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,119,0,0.3), transparent)' }}
        />

        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF7700 0%, #CC5F00 100%)', boxShadow: '0 4px 14px rgba(255,119,0,0.4)' }}
            >
              <span className="text-white font-black text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>CC</span>
            </div>
            <p className="text-white font-bold text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>CarCarry</p>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Connexion
            </h2>
            <p className="text-[#444] text-sm">Accédez à votre espace CarCarry.</p>
          </div>

          {/* Role switcher */}
          <div
            className="flex gap-1 p-1 rounded-2xl mb-7"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {([
              { key: 'client', label: 'Client' },
              { key: 'internal', label: 'CarCarry' },
              { key: 'partner', label: 'Partenaire' },
            ] as const).map(r => (
              <button
                key={r.key}
                onClick={() => setRole(r.key)}
                className="flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200"
                style={role === r.key ? {
                  background: 'linear-gradient(135deg, #FF7700 0%, #CC5F00 100%)',
                  color: '#fff',
                  boxShadow: '0 2px 10px rgba(255,119,0,0.3)',
                } : { color: '#444' }}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[#444] text-[11px] font-bold uppercase tracking-widest mb-2">
                Adresse e-mail
              </label>
              <input
                type="email"
                placeholder="vous@email.ch"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full text-sm text-white placeholder-[#2E2E2E] px-4 py-3 rounded-xl transition-all duration-200 outline-none"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,119,0,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,119,0,0.06)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' }}
              />
            </div>

            <div>
              <label className="block text-[#444] text-[11px] font-bold uppercase tracking-widest mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full text-sm text-white placeholder-[#2E2E2E] px-4 py-3 pr-11 rounded-xl transition-all duration-200 outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,119,0,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,119,0,0.06)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#333] hover:text-[#888] transition-colors"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-[#FF7700] text-xs hover:opacity-80 transition-opacity">
                Mot de passe oublié ?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              style={{
                background: loading ? '#CC5F00' : 'linear-gradient(135deg, #FF7700 0%, #CC5F00 100%)',
                boxShadow: '0 4px 18px rgba(255,119,0,0.3)',
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connexion en cours...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[#333] text-sm">
            Pas encore de compte ?{' '}
            <Link to="/auth/register" className="text-[#FF7700] hover:opacity-80 font-semibold transition-opacity">
              Créer un compte
            </Link>
          </p>

          {/* Demo hint */}
          <div
            className="mt-6 rounded-2xl p-4"
            style={{
              background: 'linear-gradient(135deg, rgba(255,119,0,0.06) 0%, rgba(255,119,0,0.02) 100%)',
              border: '1px solid rgba(255,119,0,0.12)',
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF7700]" style={{ boxShadow: '0 0 6px #FF7700' }} />
              <p className="text-[#FF7700] text-xs font-bold uppercase tracking-wider">Mode démonstration</p>
            </div>
            <p className="text-[#444] text-xs leading-relaxed">
              Choisissez un rôle (Client, CarCarry ou Partenaire) puis cliquez sur <span className="text-[#888]">Se connecter</span> pour explorer avec les données de démo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
