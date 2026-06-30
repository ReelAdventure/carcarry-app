import { useState, useEffect } from 'react'
import { X, Bell, CheckCircle2, Clock, AlertTriangle, Zap, Car, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface Notification {
  id: string
  type: 'status' | 'alert' | 'devis' | 'info' | 'done'
  title: string
  message: string
  time: string
  link?: string
  read: boolean
}

const MOCK_NOTIFS: Notification[] = [
  {
    id: 'n1',
    type: 'status',
    title: 'Demande mise à jour',
    message: 'Votre révision BMW 530d est maintenant en cours d\'intervention.',
    time: 'Il y a 2h',
    link: '/client/requests/req-1',
    read: false,
  },
  {
    id: 'n2',
    type: 'devis',
    title: 'Devis disponible',
    message: 'Un devis a été préparé pour votre MFK Audi Q5. Consultez et validez.',
    time: 'Il y a 5h',
    link: '/client/requests/req-2',
    read: false,
  },
  {
    id: 'n3',
    type: 'alert',
    title: 'MFK à prévoir',
    message: 'Votre Audi Q5 (FR 789 012) doit passer la MFK dans moins de 60 jours.',
    time: 'Hier',
    link: '/client/vehicles',
    read: false,
  },
  {
    id: 'n4',
    type: 'done',
    title: 'Intervention terminée',
    message: 'Le changement de pneus de votre Tesla Model 3 est terminé. Votre véhicule est prêt.',
    time: 'Il y a 3 jours',
    link: '/client/requests/req-3',
    read: true,
  },
  {
    id: 'n5',
    type: 'info',
    title: 'Véhicule pris en charge',
    message: 'CarCarry a récupéré votre BMW 530d. L\'intervention commence ce matin.',
    time: 'Il y a 4 jours',
    link: '/client/requests/req-1',
    read: true,
  },
]

const TYPE_CONFIG = {
  status: { icon: <Clock size={14} />, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  alert: { icon: <AlertTriangle size={14} />, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  devis: { icon: <Zap size={14} />, color: '#FF7700', bg: 'rgba(255,119,0,0.1)' },
  info: { icon: <Car size={14} />, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  done: { icon: <CheckCircle2 size={14} />, color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
}

interface Props {
  open: boolean
  onClose: () => void
}

export function NotificationDrawer({ open, onClose }: Props) {
  const [notifs, setNotifs] = useState(MOCK_NOTIFS)
  const [visible, setVisible] = useState(false)
  const unread = notifs.filter(n => !n.read).length

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
    }
  }, [open])

  const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, read: true })))
  const markRead = (id: string) => setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))

  const grouped = {
    today: notifs.filter(n => n.time.includes('h') || n.time.includes('Il y a 2')),
    earlier: notifs.filter(n => !n.time.includes('h') && !n.time.includes('Il y a 2')),
  }

  if (!open && !visible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: 'rgba(0,0,0,0.5)',
          opacity: visible ? 1 : 0,
          backdropFilter: 'blur(2px)',
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col w-full max-w-sm transition-transform duration-300"
        style={{
          background: '#0F0F0F',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,119,0,0.1)', border: '1px solid rgba(255,119,0,0.15)' }}
            >
              <Bell size={15} className="text-[#FF7700]" />
            </div>
            <div>
              <p className="text-white font-bold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Notifications</p>
              {unread > 0 && (
                <p className="text-[#FF7700] text-xs">{unread} non lue{unread > 1 ? 's' : ''}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-[#444] hover:text-[#888] text-xs transition-colors"
              >
                Tout lire
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#333] hover:text-white hover:bg-white/5 transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {notifs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <Bell size={24} className="text-[#222]" />
              </div>
              <p className="text-[#333] text-sm text-center">Aucune notification</p>
            </div>
          ) : (
            <div>
              {/* Today */}
              {grouped.today.length > 0 && (
                <div>
                  <div className="px-5 py-2.5">
                    <p className="text-[#333] text-[10px] font-bold uppercase tracking-widest">Aujourd'hui</p>
                  </div>
                  {grouped.today.map(n => <NotifItem key={n.id} notif={n} onRead={markRead} onClose={onClose} />)}
                </div>
              )}
              {/* Earlier */}
              {grouped.earlier.length > 0 && (
                <div>
                  <div className="px-5 py-2.5 mt-2">
                    <p className="text-[#333] text-[10px] font-bold uppercase tracking-widest">Plus tôt</p>
                  </div>
                  {grouped.earlier.map(n => <NotifItem key={n.id} notif={n} onRead={markRead} onClose={onClose} />)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-4 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <Link
            to="/client/requests"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors text-[#444] hover:text-[#888]"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            Voir toutes mes demandes <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    </>
  )
}

function NotifItem({ notif, onRead, onClose }: { notif: Notification; onRead: (id: string) => void; onClose: () => void }) {
  const cfg = TYPE_CONFIG[notif.type]

  const content = (
    <div
      className="flex gap-3 px-5 py-4 cursor-pointer transition-all duration-150 relative"
      style={{
        background: notif.read ? 'transparent' : 'rgba(255,255,255,0.015)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
      onClick={() => { onRead(notif.id); if (!notif.link) onClose() }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = notif.read ? 'transparent' : 'rgba(255,255,255,0.015)'}
    >
      {/* Unread dot */}
      {!notif.read && (
        <div
          className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
          style={{ background: '#FF7700', boxShadow: '0 0 6px #FF7700' }}
        />
      )}

      {/* Icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: cfg.bg, color: cfg.color }}
      >
        {cfg.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold leading-tight ${notif.read ? 'text-[#888]' : 'text-white'}`}>
          {notif.title}
        </p>
        <p className="text-[#444] text-xs mt-1 leading-relaxed line-clamp-2">{notif.message}</p>
        <p className="text-[#2A2A2A] text-[10px] mt-1.5 font-medium">{notif.time}</p>
      </div>
    </div>
  )

  if (notif.link) {
    return (
      <Link to={notif.link} onClick={() => { onRead(notif.id); onClose() }}>
        {content}
      </Link>
    )
  }
  return content
}
