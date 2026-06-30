import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextValue {
  toasts: Toast[]
  toast: (t: Omit<Toast, 'id'>) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={17} />,
  error: <XCircle size={17} />,
  warning: <AlertTriangle size={17} />,
  info: <Info size={17} />,
}

const STYLES: Record<ToastType, { icon: string; bar: string; border: string }> = {
  success: {
    icon: 'text-green-400',
    bar: 'linear-gradient(90deg, #34d399, #10b981)',
    border: 'rgba(52,211,153,0.15)',
  },
  error: {
    icon: 'text-red-400',
    bar: 'linear-gradient(90deg, #f87171, #ef4444)',
    border: 'rgba(248,113,113,0.15)',
  },
  warning: {
    icon: 'text-yellow-400',
    bar: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
    border: 'rgba(251,191,36,0.15)',
  },
  info: {
    icon: 'text-blue-400',
    bar: 'linear-gradient(90deg, #60a5fa, #3b82f6)',
    border: 'rgba(96,165,250,0.15)',
  },
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false)
  const style = STYLES[toast.type]

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, toast.duration ?? 4000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="relative overflow-hidden rounded-2xl transition-all duration-300"
      style={{
        background: '#161616',
        border: `1px solid ${style.border}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        maxWidth: '360px',
        width: '100%',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(20px) scale(0.97)',
      }}
    >
      {/* Top color bar */}
      <div className="h-[2px] w-full" style={{ background: style.bar }} />

      <div className="flex items-start gap-3 px-4 py-3.5">
        <span className={style.icon}>{ICONS[toast.type]}</span>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold leading-tight">{toast.title}</p>
          {toast.message && (
            <p className="text-[#555] text-xs mt-0.5 leading-relaxed">{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => { setVisible(false); setTimeout(onDismiss, 300) }}
          className="text-[#333] hover:text-[#888] transition-colors flex-shrink-0 mt-0.5"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(t => t.filter(x => x.id !== id))
  }, [])

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { ...t, id }])
  }, [])

  const success = useCallback((title: string, message?: string) => toast({ type: 'success', title, message }), [toast])
  const error = useCallback((title: string, message?: string) => toast({ type: 'error', title, message }), [toast])
  const warning = useCallback((title: string, message?: string) => toast({ type: 'warning', title, message }), [toast])
  const info = useCallback((title: string, message?: string) => toast({ type: 'info', title, message }), [toast])

  return (
    <ToastContext.Provider value={{ toasts, toast, success, error, warning, info, dismiss }}>
      {children}
      {/* Portal */}
      <div
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 items-end pointer-events-none"
      >
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={() => dismiss(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
