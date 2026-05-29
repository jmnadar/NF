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

export const stores: { name: string; subtitle: string; ciudad: string; shipments: number; pending: number; status: string; badge: string; telefono: string; email: string; numero_bodega: string; tipo_comercio: string; admin: string }[] = [
  { name: 'Swimwear Zona Norte', subtitle: 'Av. del Mar 1234, Local 5', ciudad: 'Tijuana', shipments: 45, pending: 3, status: 'Activo', badge: 'bg-emerald-100 text-emerald-700', telefono: '+52 664 123 4567', email: 'zona.norte@swimwear.mx', numero_bodega: 'BOD-001', tipo_comercio: 'Tienda Física', admin: 'María López' },
  { name: 'Bikini Store Centro', subtitle: 'Calle Real 567, Galería Sur', ciudad: 'Tijuana', shipments: 32, pending: 7, status: 'Pendiente', badge: 'bg-amber-100 text-amber-700', telefono: '+52 664 234 5678', email: 'centro@bikinistore.mx', numero_bodega: 'BOD-002', tipo_comercio: 'Tienda Física', admin: 'Carlos Ruiz' },
  { name: 'Natación Pro', subtitle: 'Blvd. Acuático 890, Local 12', ciudad: 'Mexicali', shipments: 28, pending: 1, status: 'Activo', badge: 'bg-emerald-100 text-emerald-700', telefono: '+52 686 345 6789', email: 'pro@natacion.mx', numero_bodega: 'BOD-003', tipo_comercio: 'Tienda Física', admin: 'Ana García' },
  { name: 'Aqua Sports Mall', subtitle: 'Plaza Marina, Local 34, 2° piso', ciudad: 'Ensenada', shipments: 61, pending: 12, status: 'Pendiente', badge: 'bg-amber-100 text-amber-700', telefono: '+52 646 456 7890', email: 'aqua@sportsmall.mx', numero_bodega: 'BOD-004', tipo_comercio: 'Mall', admin: 'Pedro Martínez' },
  { name: 'Trajes de Baño Elite', subtitle: 'Av. Costera 456, Local 8', ciudad: 'Rosarito', shipments: 19, pending: 0, status: 'Activo', badge: 'bg-emerald-100 text-emerald-700', telefono: '+52 661 567 8901', email: 'elite@trajes.mx', numero_bodega: 'BOD-005', tipo_comercio: 'Tienda Física', admin: 'Laura Sánchez' },
  { name: 'Deep Blue Shop', subtitle: 'Calle Ola 789, Edif. Coral', ciudad: 'Mexicali', shipments: 37, pending: 5, status: 'Activo', badge: 'bg-emerald-100 text-emerald-700', telefono: '+52 686 678 9012', email: 'deepblue@shop.mx', numero_bodega: 'BOD-006', tipo_comercio: 'Tienda Física', admin: 'Jorge Torres' },
]

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

export interface PedidoGuia {
  numero_pedido: string
  estado: 'pendiente' | 'entregado'
  fecha_entrega: string | null
}

export interface GuiaEnvio {
  numero_guia: string
  tienda: string
  estado: 'pendiente' | 'recibido' | 'completo'
  nota: string
  fecha_creacion: string
  fecha_recibido: string | null
  fecha_completado: string | null
  pedidos: PedidoGuia[]
}

export interface EnvioBitacora {
  id: string
  tienda: string
  tipo: 'nueva_guia' | 'guia_recibida' | 'paquete_entregado' | 'guia_completada'
  titulo: string
  mensaje: string
  fecha: string
}

export const guiasEnvio: GuiaEnvio[] = [
  {
    numero_guia: 'G-2026-001',
    tienda: 'Swimwear Zona Norte',
    estado: 'completo',
    nota: 'Envío regular de inventario',
    fecha_creacion: '2026-05-10 09:30',
    fecha_recibido: '2026-05-12 14:15',
    fecha_completado: '2026-05-14 11:00',
    pedidos: [
      { numero_pedido: 'PO-001', estado: 'entregado', fecha_entrega: '2026-05-12 14:15' },
      { numero_pedido: 'PO-002', estado: 'entregado', fecha_entrega: '2026-05-12 14:15' },
      { numero_pedido: 'PO-003', estado: 'entregado', fecha_entrega: '2026-05-14 11:00' },
    ],
  },
  {
    numero_guia: 'G-2026-002',
    tienda: 'Swimwear Zona Norte',
    estado: 'recibido',
    nota: 'Reposición de temporada',
    fecha_creacion: '2026-05-18 11:00',
    fecha_recibido: '2026-05-20 10:30',
    fecha_completado: null,
    pedidos: [
      { numero_pedido: 'PO-004', estado: 'entregado', fecha_entrega: '2026-05-20 10:30' },
      { numero_pedido: 'PO-005', estado: 'pendiente', fecha_entrega: null },
    ],
  },
  {
    numero_guia: 'G-2026-003',
    tienda: 'Swimwear Zona Norte',
    estado: 'pendiente',
    nota: 'Pedido especial clientes',
    fecha_creacion: '2026-05-25 08:00',
    fecha_recibido: null,
    fecha_completado: null,
    pedidos: [
      { numero_pedido: 'PO-006', estado: 'pendiente', fecha_entrega: null },
      { numero_pedido: 'PO-007', estado: 'pendiente', fecha_entrega: null },
    ],
  },
  {
    numero_guia: 'G-2026-004',
    tienda: 'Bikini Store Centro',
    estado: 'pendiente',
    nota: 'Envío quincenal',
    fecha_creacion: '2026-05-26 10:00',
    fecha_recibido: null,
    fecha_completado: null,
    pedidos: [
      { numero_pedido: 'PO-008', estado: 'pendiente', fecha_entrega: null },
    ],
  },
  {
    numero_guia: 'G-2026-005',
    tienda: 'Natación Pro',
    estado: 'recibido',
    nota: 'Equipo de competencia',
    fecha_creacion: '2026-05-22 07:30',
    fecha_recibido: '2026-05-24 16:00',
    fecha_completado: null,
    pedidos: [
      { numero_pedido: 'PO-009', estado: 'entregado', fecha_entrega: '2026-05-24 16:00' },
    ],
  },
]

export const enviosBitacora: EnvioBitacora[] = [
  { id: 'bit-1', tienda: 'Swimwear Zona Norte', tipo: 'nueva_guia', titulo: 'Nueva guía creada', mensaje: 'Se creó la guía G-2026-003 con 2 paquetes', fecha: '2026-05-25 08:00' },
  { id: 'bit-2', tienda: 'Bikini Store Centro', tipo: 'nueva_guia', titulo: 'Nueva guía creada', mensaje: 'Se creó la guía G-2026-004 con 1 paquete', fecha: '2026-05-26 10:00' },
  { id: 'bit-3', tienda: 'Swimwear Zona Norte', tipo: 'guia_recibida', titulo: 'Guía recibida en tienda', mensaje: 'La guía G-2026-002 fue recibida en la tienda', fecha: '2026-05-20 10:30' },
  { id: 'bit-4', tienda: 'Swimwear Zona Norte', tipo: 'paquete_entregado', titulo: 'Paquete entregado', mensaje: 'PO-004 entregado correctamente', fecha: '2026-05-20 10:30' },
  { id: 'bit-5', tienda: 'Natación Pro', tipo: 'guia_recibida', titulo: 'Guía recibida en tienda', mensaje: 'La guía G-2026-005 fue recibida en la tienda', fecha: '2026-05-24 16:00' },
  { id: 'bit-6', tienda: 'Natación Pro', tipo: 'paquete_entregado', titulo: 'Paquete entregado', mensaje: 'PO-009 entregado correctamente', fecha: '2026-05-24 16:00' },
  { id: 'bit-7', tienda: 'Swimwear Zona Norte', tipo: 'guia_completada', titulo: 'Guía completada', mensaje: 'La guía G-2026-001 se marcó como completa', fecha: '2026-05-14 11:00' },
  { id: 'bit-8', tienda: 'Swimwear Zona Norte', tipo: 'paquete_entregado', titulo: 'Paquete entregado', mensaje: 'PO-003 entregado en el tercer paquete', fecha: '2026-05-14 11:00' },
  { id: 'bit-9', tienda: 'Swimwear Zona Norte', tipo: 'guia_recibida', titulo: 'Guía recibida en tienda', mensaje: 'La guía G-2026-001 fue recibida en la tienda', fecha: '2026-05-12 14:15' },
  { id: 'bit-10', tienda: 'Swimwear Zona Norte', tipo: 'paquete_entregado', titulo: 'Paquete entregado', mensaje: 'PO-001 y PO-002 entregados', fecha: '2026-05-12 14:15' },
  { id: 'bit-11', tienda: 'Swimwear Zona Norte', tipo: 'nueva_guia', titulo: 'Nueva guía creada', mensaje: 'Se creó la guía G-2026-002 con 2 paquetes', fecha: '2026-05-18 11:00' },
  { id: 'bit-12', tienda: 'Swimwear Zona Norte', tipo: 'nueva_guia', titulo: 'Nueva guía creada', mensaje: 'Se creó la guía G-2026-001 con 3 paquetes', fecha: '2026-05-10 09:30' },
]

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
