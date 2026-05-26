export const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Clientes', path: '/clientes' },
  { label: 'Tickets', path: '/tickets' },
  { label: 'Registrar ticket', path: '/tickets/registro' },
  { label: 'Tiendas', path: '/tiendas' },
  { label: 'Configuración', path: '/configuracion' },
]

export type BadgeType = 'success' | 'danger'

export interface Stat {
  label: string
  value: string
  badge: string
  badgeType: BadgeType
  icon: string
}

export const stats: Stat[] = [
  { label: 'Tickets abiertos', value: '248', badge: '+12.4%', badgeType: 'success', icon: 'Mail' },
  { label: 'Clientes activos', value: '1,842', badge: '+3.1%', badgeType: 'success', icon: 'Users' },
  { label: 'Tiendas conectadas', value: '37', badge: '+2', badgeType: 'success', icon: 'Store' },
  { label: 'SLA vencidos', value: '14', badge: '-5', badgeType: 'danger', icon: 'Clock' },
]

export const chartPoints = [
  { day: 'Lun', open: 22, resolved: 16 },
  { day: 'Mar', open: 29, resolved: 23 },
  { day: 'Mié', open: 27, resolved: 25 },
  { day: 'Jue', open: 42, resolved: 32 },
  { day: 'Vie', open: 36, resolved: 34 },
  { day: 'Sáb', open: 18, resolved: 15 },
  { day: 'Dom', open: 14, resolved: 13 },
]

export const recentActivity = [
  { actor: 'Laura M.', action: 'cerró ticket', subject: 'TCK-1042', time: 'hace 4 min' },
  { actor: 'Carlos R.', action: 'creó cliente', subject: 'Distribuidora Norte', time: 'hace 18 min' },
  { actor: 'Sistema', action: 'SLA por vencer', subject: 'TCK-0997', time: 'hace 32 min' },
  { actor: 'Ana P.', action: 'actualizó tienda', subject: 'Sucursal Centro', time: 'hace 1 h' },
  { actor: 'Sistema', action: 'ticket vencido', subject: 'TCK-0981', time: 'hace 2 h' },
]

export const customers = [
  {
    initials: 'DN',
    name: 'Distribuidora Norte SA',
    owner: 'Marcela Pérez',
    email: 'mperez@dn.com',
    phone: '+52 55 1234 5678',
    location: 'CDMX',
    tickets: 4,
    status: 'Activo',
    statusColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    initials: 'CS',
    name: 'Comercializadora Sur',
    owner: 'Iván Rojas',
    email: 'ivan@comersur.mx',
    phone: '+52 33 9876 5432',
    location: 'Guadalajara',
    tickets: 1,
    status: 'Activo',
    statusColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    initials: 'BA',
    name: 'Boutique Aurora',
    owner: 'Lucía Torres',
    email: 'lucia@aurora.mx',
    phone: '+52 81 5544 3322',
    location: 'Monterrey',
    tickets: 7,
    status: 'En riesgo',
    statusColor: 'bg-amber-100 text-amber-700',
  },
  {
    initials: 'TG',
    name: 'TechParts Global',
    owner: 'Andrés Vela',
    email: 'avela@techparts.com',
    phone: '+52 55 2200 1100',
    location: 'CDMX',
    tickets: 0,
    status: 'Inactivo',
    statusColor: 'bg-slate-100 text-slate-700',
  },
  {
    initials: 'MP',
    name: 'Mercado Pacífico',
    owner: 'Sofía Marín',
    email: 'sofia@mpacifico.mx',
    phone: '+52 33 1100 2200',
    location: 'Puerto Vallarta',
    tickets: 2,
    status: 'Activo',
    statusColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    initials: 'Ad',
    name: 'Almacenes del Bajío',
    owner: 'Pedro Quintero',
    email: 'pedro@abajo.mx',
    phone: '+52 477 333 4455',
    location: 'León',
    tickets: 3,
    status: 'Activo',
    statusColor: 'bg-emerald-100 text-emerald-700',
  },
]

export const tickets = [
  { id: 'TCK-1058', client: 'Distribuidora Norte SA', reason: 'Pedido incompleto', status: 'Abierto', due: 'Venció hace 1d', agent: 'Laura M.' },
  { id: 'TCK-1057', client: 'Boutique Aurora', reason: 'Reclamo de calidad', status: 'En curso', due: 'Vence hoy', agent: 'Carlos R.' },
  { id: 'TCK-1056', client: 'Comercializadora Sur', reason: 'Devolución', status: 'Pendiente', due: 'Vence en 2d', agent: 'Ana P.' },
  { id: 'TCK-1055', client: 'Almacenes del Bajío', reason: 'Cambio de dirección', status: 'Resuelto', due: '—', agent: 'Laura M.' },
  { id: 'TCK-1054', client: 'Mercado Pacífico', reason: 'Solicitud de información', status: 'Cerrado', due: '—', agent: 'Sistema' },
  { id: 'TCK-1053', client: 'TechParts Global', reason: 'Pedido incompleto', status: 'Abierto', due: 'Vence en 4d', agent: 'Carlos R.' },
]

export const stores = [
  { name: 'Sucursal Centro', subtitle: 'Swim Premium • CDMX', shipments: 42, pending: 3, status: 'Operativa', badge: 'bg-emerald-100 text-emerald-700' },
  { name: 'Sucursal Polanco', subtitle: 'Swim Premium • CDMX', shipments: 31, pending: 1, status: 'Operativa', badge: 'bg-emerald-100 text-emerald-700' },
  { name: 'Sucursal Andares', subtitle: 'Swim Lite • Guadalajara', shipments: 18, pending: 5, status: 'Atención', badge: 'bg-amber-100 text-amber-700' },
  { name: 'Sucursal Valle Oriente', subtitle: 'Swim Premium • Monterrey', shipments: 27, pending: 0, status: 'Operativa', badge: 'bg-emerald-100 text-emerald-700' },
  { name: 'Outlet Tlaquepaque', subtitle: 'Swim Outlet • Guadalajara', shipments: 9, pending: 0, status: 'Pausada', badge: 'bg-slate-100 text-slate-700' },
  { name: 'Sucursal Bajío', subtitle: 'Swim Premium • León', shipments: 22, pending: 2, status: 'Operativa', badge: 'bg-emerald-100 text-emerald-700' },
]

export const account = {
  name: 'María Álvarez',
  role: 'Súper Administrador',
  email: 'maria@swim.mx',
  phone: '+52 55 4400 5500',
  position: 'Súper Administrador',
}

export const preferences = {
  locale: 'Español (MX)',
  timezone: 'GMT-6 · Ciudad de México',
  dateFormat: 'DD/MM/AAAA',
  currency: 'MXN — Peso',
  notifications: {
    assignedTickets: true,
    upcomingDeadlines: true,
    commentsMentions: true,
    weeklySummary: true,
  },
}

export interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
}

export const notifications: Notification[] = [
  { id: 'n1', title: 'SLA por vencer', description: 'TCK-0997 está próximo a vencer', time: 'hace 32 min', read: false },
  { id: 'n2', title: 'Ticket asignado', description: 'Te asignaron TCK-1058', time: 'hace 1 h', read: false },
  { id: 'n3', title: 'Ticket vencido', description: 'TCK-0981 ha excedido el SLA', time: 'hace 2 h', read: false },
  { id: 'n4', title: 'Cliente registrado', description: 'Distribuidora Norte SA fue creado', time: 'hace 3 h', read: true },
]

export const users = [
  { name: 'María Álvarez', email: 'maria@swim.mx', role: 'Súper Admin', status: 'Activo' },
  { name: 'Carlos Ruiz', email: 'carlos@swim.mx', role: 'Agente', status: 'Activo' },
  { name: 'Ana Pérez', email: 'ana@swim.mx', role: 'Supervisor', status: 'Activo' },
  { name: 'Diego Soto', email: 'diego@swim.mx', role: 'Agente', status: 'Inactivo' },
]

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

function seededRandom(seed: number): () => number {
  let s = seed | 0
  return () => {
    s = (s * 16807) % 2147483647
    if (s <= 0) s += 2147483646
    return (s - 1) / 2147483646
  }
}

export function getDailyMetrics(): DailyMetric[] {
  const rng = seededRandom(73)
  const data: DailyMetric[] = []
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  for (let i = 89; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dow = date.getDay()
    const isWeekend = dow === 0 || dow === 6
    const baseOpen = isWeekend ? 8 : 20
    const baseResolved = isWeekend ? 7 : 16

    data.push({
      date: date.toISOString().split('T')[0],
      opened: baseOpen + Math.round(rng() * 18),
      resolved: baseResolved + Math.round(rng() * 16),
      newClients: 1 + Math.round(rng() * 5),
      activeClients: 1780 + Math.round(rng() * 120),
      storesOnline: 35 + Math.round(rng() * 4),
      slaBreaches: Math.round(rng() * 6),
    })
  }

  return data
}

export function filterByRange<T extends { date: string }>(data: T[], range: TimeRange): T[] {
  if (range === 'todo') return data
  const now = new Date()
  now.setHours(23, 59, 59, 999)
  const ranges: Record<Exclude<TimeRange, 'todo'>, number> = {
    hoy: 1,
    semana: 7,
    mes: 30,
    trimestre: 90,
    semestre: 180,
    año: 365,
  }
  const days = ranges[range]
  const cutoff = new Date(now)
  cutoff.setDate(cutoff.getDate() - days)
  return data.filter(d => new Date(d.date) >= cutoff)
}

export function computeStats(metrics: DailyMetric[]): Stat[] {
  if (metrics.length === 0) return []

  const totalOpened = metrics.reduce((s, d) => s + d.opened, 0)
  const totalResolved = metrics.reduce((s, d) => s + d.resolved, 0)
  const totalSla = metrics.reduce((s, d) => s + d.slaBreaches, 0)
  const last = metrics[metrics.length - 1]
  const first = metrics[0]

  const openDiff = last.opened - first.opened
  const openPct = first.opened > 0 ? (openDiff / first.opened) * 100 : 0
  const resolvedPct = first.resolved > 0 ? ((last.resolved - first.resolved) / first.resolved) * 100 : 0
  const clientDiff = last.activeClients - first.activeClients
  const slaDiff = last.slaBreaches - first.slaBreaches
  const closeRate = totalOpened > 0 ? (totalResolved / totalOpened) * 100 : 0

  return [
    {
      label: 'Tickets abiertos',
      value: totalOpened.toLocaleString(),
      badge: `${openPct >= 0 ? '+' : ''}${openPct.toFixed(1)}%`,
      badgeType: openPct <= 10 ? 'success' : 'danger',
      icon: 'Inbox',
    },
    {
      label: 'Clientes activos',
      value: last.activeClients.toLocaleString(),
      badge: `${clientDiff >= 0 ? '+' : ''}${clientDiff}`,
      badgeType: clientDiff >= 0 ? 'success' : 'danger',
      icon: 'Users',
    },
    {
      label: 'Tickets cerrados',
      value: totalResolved.toLocaleString(),
      badge: `${resolvedPct >= 0 ? '+' : ''}${resolvedPct.toFixed(1)}%`,
      badgeType: resolvedPct >= 0 ? 'success' : 'danger',
      icon: 'CheckCircle',
    },
    {
      label: 'SLA vencidos',
      value: totalSla.toString(),
      badge: `${slaDiff <= 0 ? '' : '+'}${slaDiff}`,
      badgeType: slaDiff <= 0 ? 'success' : 'danger',
      icon: 'Clock',
    },
  ]
}

export interface ActivityItem {
  id: string
  actor: string
  action: string
  subject: string
  timestamp: Date
  timeAgo: string
}

function simpleHash(s: string): number {
  let hash = 0
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function formatTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'hace unos segundos'
  if (mins === 1) return 'hace 1 min'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours === 1) return 'hace 1 h'
  if (hours < 24) return `hace ${hours} h`
  const days = Math.floor(hours / 24)
  return `hace ${days} d`
}

export function generateRecentActivity(): ActivityItem[] {
  const now = Date.now()
  const items: ActivityItem[] = []
  let idx = 0

  for (const ticket of tickets) {
    const mins = (simpleHash(ticket.id + 't') % 240) + 2
    const date = new Date(now - mins * 60000)
    const actionMap: Record<string, string> = {
      Abierto: 'abrió ticket',
      'En curso': 'está gestionando',
      Pendiente: 'reasignó ticket',
      Resuelto: 'resolvió ticket',
      Cerrado: 'cerró ticket',
    }
    items.push({
      id: `act-${idx++}`,
      actor: ticket.agent,
      action: actionMap[ticket.status] || 'actualizó ticket',
      subject: ticket.id,
      timestamp: date,
      timeAgo: formatTimeAgo(date),
    })
  }

  for (const c of customers) {
    const mins = (simpleHash(c.name) % 600) + 10
    const date = new Date(now - mins * 60000)
    items.push({
      id: `act-${idx++}`,
      actor: c.owner,
      action: simpleHash(c.name) % 3 === 0 ? 'actualizó cliente' : 'registró cliente',
      subject: c.name,
      timestamp: date,
      timeAgo: formatTimeAgo(date),
    })
  }

  const sla1mins = (simpleHash('sla1') % 120) + 5
  const sla1date = new Date(now - sla1mins * 60000)
  items.push({
    id: `act-${idx++}`,
    actor: 'Sistema',
    action: 'SLA por vencer',
    subject: tickets[0]?.id ?? 'TCK-0000',
    timestamp: sla1date,
    timeAgo: formatTimeAgo(sla1date),
  })

  const sla2mins = (simpleHash('sla2') % 200) + 30
  const sla2date = new Date(now - sla2mins * 60000)
  items.push({
    id: `act-${idx++}`,
    actor: 'Sistema',
    action: 'ticket vencido',
    subject: tickets[3]?.id ?? 'TCK-0000',
    timestamp: sla2date,
    timeAgo: formatTimeAgo(sla2date),
  })

  return items
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5)
}

const bizNames = [
  'Distribuidora', 'Comercializadora', 'Grupo', 'Corporativo', 'Industrias',
  'Servicios', 'Almacenes', 'Boutique', 'TechParts', 'Mercado',
  'Suministros', 'Productos', 'Soluciones', 'Integral', 'Global',
]
const bizSuffix = [
  'Norte', 'Sur', 'Centro', 'Oriente', 'Poniente',
  'del Valle', 'Industrial', 'Premium', 'Express', 'Pro',
  'Digital', 'del Pacífico', 'del Golfo', 'del Bajío', 'Mayorista',
]
const firstNames = [
  'María', 'Carlos', 'Ana', 'José', 'Laura', 'Miguel', 'Sofía', 'Jorge',
  'Valentina', 'Andrés', 'Camila', 'Fernando', 'Isabella', 'Ricardo', 'Ximena',
  'Daniel', 'Paula', 'Alejandro', 'Gabriela', 'Roberto',
]
const lastNames = [
  'Pérez', 'García', 'Rodríguez', 'Martínez', 'López', 'González',
  'Hernández', 'Morales', 'Castillo', 'Reyes', 'Torres', 'Flores',
  'Ramírez', 'Vargas', 'Cruz',
]
const cities = [
  'CDMX', 'Guadalajara', 'Monterrey', 'León', 'Puebla',
  'Querétaro', 'Tijuana', 'Mérida', 'Cancún', 'Veracruz',
]

export function getAllCustomers(): typeof customers {
  const rng = seededRandom(97)
  const extra: typeof customers = []
  const usedNames = new Set(customers.map(c => c.name))

  for (let i = 0; i < 24; i++) {
    const biz = bizNames[Math.floor(rng() * bizNames.length)]
    const suffix = bizSuffix[Math.floor(rng() * bizSuffix.length)]
    let name = `${biz} ${suffix}`
    if (usedNames.has(name)) name += ` ${String.fromCharCode(65 + i)}`
    usedNames.add(name)

    const fn = firstNames[Math.floor(rng() * firstNames.length)]
    const ln = lastNames[Math.floor(rng() * lastNames.length)]
    const owner = `${fn} ${ln}`
    const initials = fn[0] + ln[0]
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}@${biz.toLowerCase().slice(0, 4)}.mx`
    const phone = `+52 ${55 + Math.floor(rng() * 3)} ${1000 + Math.floor(rng() * 9000)} ${1000 + Math.floor(rng() * 9000)}`
    const location = cities[Math.floor(rng() * cities.length)]
    const tickets = Math.floor(rng() * 10)
    const statuses = ['Activo', 'En riesgo', 'Inactivo']
    const status = statuses[Math.floor(rng() * 3)]
    const statusColors: Record<string, string> = {
      Activo: 'bg-emerald-100 text-emerald-700',
      'En riesgo': 'bg-amber-100 text-amber-700',
      Inactivo: 'bg-slate-100 text-slate-700',
    }

    extra.push({
      initials,
      name,
      owner,
      email,
      phone,
      location,
      tickets,
      status,
      statusColor: statusColors[status],
    })
  }

  return [...customers, ...extra]
}
