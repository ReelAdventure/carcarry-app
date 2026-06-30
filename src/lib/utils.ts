import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { RequestStatus, RequestUrgency, RequestCategory, PartnerType, FuelType } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatDateRelative(dateStr: string | undefined | null): string {
  if (!dateStr) return '—'
  const now = new Date()
  const d = new Date(dateStr)
  const diff = Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return "Aujourd'hui"
  if (diff === 1) return 'Demain'
  if (diff === -1) return 'Hier'
  if (diff > 0 && diff < 30) return `Dans ${diff} jours`
  if (diff < 0 && diff > -30) return `Il y a ${Math.abs(diff)} jours`
  return formatDate(dateStr)
}

export function formatMileage(km: number): string {
  return `${km.toLocaleString('fr-CH')} km`
}

export function formatCurrency(amount: number, currency = 'CHF'): string {
  return `${currency} ${amount.toLocaleString('fr-CH', { minimumFractionDigits: 2 })}`
}

export function getStatusConfig(status: RequestStatus): { label: string; color: string; bg: string; dot: string } {
  const configs: Record<RequestStatus, { label: string; color: string; bg: string; dot: string }> = {
    nouveau: { label: 'Nouveau', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', dot: 'bg-blue-400' },
    analyse: { label: 'Analyse', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', dot: 'bg-purple-400' },
    devis_en_cours: { label: 'Devis en cours', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', dot: 'bg-yellow-400' },
    en_attente_client: { label: 'En attente client', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', dot: 'bg-orange-400' },
    planifie: { label: 'Planifié', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', dot: 'bg-cyan-400' },
    pris_en_charge: { label: 'Véhicule pris en charge', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', dot: 'bg-indigo-400' },
    intervention_en_cours: { label: 'Intervention en cours', color: 'text-[#FF7700]', bg: 'bg-[#FF7700]/10 border-[#FF7700]/20', dot: 'bg-[#FF7700]' },
    termine: { label: 'Terminé', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', dot: 'bg-green-400' },
    annule: { label: 'Annulé', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-400' },
  }
  return configs[status] ?? { label: status, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20', dot: 'bg-gray-400' }
}

export function getUrgencyConfig(urgency: RequestUrgency): { label: string; color: string; bg: string } {
  const configs: Record<RequestUrgency, { label: string; color: string; bg: string }> = {
    basse: { label: 'Basse', color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' },
    normale: { label: 'Normale', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    haute: { label: 'Haute', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    urgente: { label: 'Urgente', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  }
  return configs[urgency] ?? { label: urgency, color: 'text-gray-400', bg: 'bg-gray-500/10' }
}

export function getCategoryConfig(cat: RequestCategory): { label: string; icon: string } {
  const configs: Record<RequestCategory, { label: string; icon: string }> = {
    entretien: { label: 'Entretien', icon: '🔧' },
    reparation: { label: 'Réparation', icon: '🔨' },
    pneus: { label: 'Pneus', icon: '⚙️' },
    mfk: { label: 'MFK / Expertise', icon: '📋' },
    nettoyage: { label: 'Nettoyage / Detailing', icon: '✨' },
    carrosserie: { label: 'Carrosserie', icon: '🚗' },
    transport: { label: 'Transport / Convoyage', icon: '🚛' },
    sinistre: { label: 'Sinistre', icon: '⚠️' },
    autre: { label: 'Autre', icon: '📌' },
  }
  return configs[cat] ?? { label: cat, icon: '📌' }
}

export function getPartnerTypeConfig(type: PartnerType): { label: string; color: string } {
  const configs: Record<PartnerType, { label: string; color: string }> = {
    garage: { label: 'Garage', color: 'text-blue-400' },
    pneumatique: { label: 'Pneumatique', color: 'text-green-400' },
    carrosserie: { label: 'Carrosserie', color: 'text-purple-400' },
    detailing: { label: 'Detailing', color: 'text-cyan-400' },
    depannage: { label: 'Dépannage', color: 'text-red-400' },
    transport: { label: 'Transport', color: 'text-yellow-400' },
  }
  return configs[type] ?? { label: type, color: 'text-gray-400' }
}

export function getFuelLabel(fuel: FuelType): string {
  const labels: Record<FuelType, string> = {
    essence: 'Essence',
    diesel: 'Diesel',
    hybride: 'Hybride',
    electrique: 'Électrique',
    gpl: 'GPL',
    autre: 'Autre',
  }
  return labels[fuel] ?? fuel
}

export function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function daysUntil(dateStr: string | undefined | null): number | null {
  if (!dateStr) return null
  const now = new Date()
  const d = new Date(dateStr)
  return Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function isDateAlert(dateStr: string | undefined | null, thresholdDays = 30): boolean {
  const days = daysUntil(dateStr)
  if (days === null) return false
  return days <= thresholdDays
}
