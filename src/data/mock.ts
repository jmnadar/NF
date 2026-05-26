export type BadgeType = 'success' | 'danger'

export interface Stat {
  label: string
  value: string
  badge: string
  badgeType: BadgeType
  icon: string
}

export const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Clientes', path: '/clientes' },
  { label: 'Tickets', path: '/tickets' },
  { label: 'Registrar ticket', path: '/tickets/registro' },
  { label: 'Tiendas', path: '/tiendas' },
  { label: 'Configuración', path: '/configuracion' },
]

export interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
}

export const notifications: Notification[] = []

export interface ActivityItem {
  id: string
  actor: string
  action: string
  subject: string
  timestamp: Date
  timeAgo: string
}

export const tickets: { id: string; client: string; reason: string; status: string; due: string; agent: string }[] = []

export const customers: { initials: string; name: string; owner: string; email: string; phone: string; location: string; tickets: number; status: string; statusColor: string }[] = []

export const stores: { name: string; subtitle: string; shipments: number; pending: number; status: string; badge: string }[] = []

export const account = {
  name: '',
  role: '',
  email: '',
  phone: '',
  position: '',
}

export const preferences = {
  locale: '',
  timezone: '',
  dateFormat: '',
  currency: '',
  notifications: {
    assignedTickets: false,
    upcomingDeadlines: false,
    commentsMentions: false,
    weeklySummary: false,
  },
}

export const users: { name: string; email: string; role: string; status: string }[] = []

export type TimeRange = 'hoy' | 'semana' | 'mes' | 'trimestre' | 'semestre' | 'año' | 'todo'

export interface DailyMetric {
  date: string
  opened: number
  resolved: number
  newClients: number
  activeClients: number
  storesOnline: number
  slaBreaches: number
}

export function getDailyMetrics(): DailyMetric[] {
  return []
}

export function filterByRange<T extends { date: string }>(data: T[], _range: TimeRange): T[] {
  return data
}

export function computeStats(_metrics: DailyMetric[]): Stat[] {
  return []
}

export function generateRecentActivity(): ActivityItem[] {
  return []
}

export function getAllCustomers() {
  return customers
}
