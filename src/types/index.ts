export * from './database'

export interface NavItem {
  label: string
  href: string
  icon?: string
  badge?: number
}

export interface StatCard {
  label: string
  value: string | number
  icon?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'orange' | 'green' | 'red' | 'gray'
}

export interface KanbanCard {
  id: string
  clientName: string
  vehicleName: string
  category: string
  urgency: string
  createdAt: string
  assignee?: string
  status: string
}

export interface User {
  id: string
  email: string
  role: import('./database').UserRole
  profile?: import('./database').Profile
}

export interface SelectOption {
  value: string
  label: string
}
