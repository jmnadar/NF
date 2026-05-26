import { useState, useEffect, useMemo } from 'react'
import {
  User, CreditCard, Phone, Mail, MapPin, Calendar, Hash, ShoppingBag,
  Ruler, DollarSign, Store, FileText, MessageSquare, Eye, Paperclip,
  X, Upload, AlertCircle, BadgeCheck, Shield,
} from 'lucide-react'

const ciudades = [
  { id_ciudad: 1, ciudad: 'Bogotá' }, { id_ciudad: 2, ciudad: 'Medellín' },
  { id_ciudad: 3, ciudad: 'Cali' }, { id_ciudad: 4, ciudad: 'Barranquilla' },
  { id_ciudad: 5, ciudad: 'Cartagena' }, { id_ciudad: 6, ciudad: 'Cúcuta' },
  { id_ciudad: 7, ciudad: 'Bucaramanga' }, { id_ciudad: 8, ciudad: 'Pereira' },
  { id_ciudad: 9, ciudad: 'Santa Marta' }, { id_ciudad: 10, ciudad: 'Ibagué' },
  { id_ciudad: 11, ciudad: 'Manizales' }, { id_ciudad: 12, ciudad: 'Villavicencio' },
  { id_ciudad: 13, ciudad: 'Pasto' }, { id_ciudad: 14, ciudad: 'Montería' },
  { id_ciudad: 15, ciudad: 'Neiva' }, { id_ciudad: 16, ciudad: 'Armenia' },
  { id_ciudad: 17, ciudad: 'Sincelejo' }, { id_ciudad: 18, ciudad: 'Valledupar' },
  { id_ciudad: 19, ciudad: 'Tunja' }, { id_ciudad: 20, ciudad: 'Popayán' },
  { id_ciudad: 21, ciudad: 'Riohacha' }, { id_ciudad: 22, ciudad: 'Quibdó' },
  { id_ciudad: 23, ciudad: 'Florencia' }, { id_ciudad: 24, ciudad: 'San José de Cúcuta' },
]

const brands = [
  { id_marcas: 1, nombre_marca: 'Speedo' },
  { id_marcas: 2, nombre_marca: "O'Neill" },
]

const roles = [
  { id: 'super_admin', label: 'Super Administrador' },
  { id: 'admin', label: 'Administrador' },
  { id: 'SPTienda', label: 'SP Tienda' },
  { id: 'user', label: 'Agente' },
]

const requestGroups = [
  {
    groupKey: 'cambio',
    groupLabel: 'Cambio',
    subOptions: [
      { motivoCode: 'change_size', label: 'Talla' },
      { motivoCode: 'change_reference', label: 'Referencia' },
    ],
  },
  {
    groupKey: 'warranty',
    groupLabel: 'Garantía',
    subOptions: [],
  },
  {
    groupKey: 'return',
    groupLabel: 'Retracto',
    subOptions: [],
  },
]

const tallas = [
  { id_talla: 1, nombre_talla: 'XXS' }, { id_talla: 2, nombre_talla: 'XS' },
  { id_talla: 3, nombre_talla: 'S' }, { id_talla: 4, nombre_talla: 'M' },
  { id_talla: 5, nombre_talla: 'L' }, { id_talla: 6, nombre_talla: 'XL' },
  { id_talla: 7, nombre_talla: 'XXL' }, { id_talla: 8, nombre_talla: '3XL' },
  { id_talla: 9, nombre_talla: '28' }, { id_talla: 10, nombre_talla: '30' },
  { id_talla: 11, nombre_talla: '32' }, { id_talla: 12, nombre_talla: '34' },
  { id_talla: 13, nombre_talla: '36' }, { id_talla: 14, nombre_talla: '38' },
  { id_talla: 15, nombre_talla: '40' }, { id_talla: 16, nombre_talla: '42' },
  { id_talla: 17, nombre_talla: '44' }, { id_talla: 18, nombre_talla: '46' },
]

const tiposComercio = [
  { id_tipo_comercio: 1, nombre_tipo: 'Tienda Física' },
  { id_tipo_comercio: 2, nombre_tipo: 'Ecommerce' },
]

const estados = [
  { id_estado_casos: 1, estados_cambio: 'Abierto' },
  { id_estado_casos: 2, estados_cambio: 'En Proceso' },
  { id_estado_casos: 3, estados_cambio: 'Pendiente' },
  { id_estado_casos: 4, estados_cambio: 'Resuelto' },
  { id_estado_casos: 5, estados_cambio: 'Cerrado' },
  { id_estado_casos: 6, estados_cambio: 'Cancelado' },
]

const agentes = [
  { id: '1', full_name: 'Laura M.' },
  { id: '2', full_name: 'Carlos R.' },
  { id: '3', full_name: 'Ana P.' },
  { id: '4', full_name: 'Diego S.' },
]

interface ClienteForm {
  nombre: string
  apellido: string
  cedula: string
  telefono: string
  email: string
  direccion: string
  ciudad: string
}

interface CompraForm {
  id_numero_pedido: string
  fecha_compra: string
  referencia: string
  id_talla_actual: string
  valor_compra: string
}

interface TicketForm {
  id_marcas: string
  id_motivo_caso: string
  id_sub_motivo: string
  id_usuario: string
  id_talla_actual: string
  id_nueva_talla: string
  nueva_referencia: string
  descripcion: string
  solucion_esperada: string
  observaciones_internas: string
  files: File[]
}

const initialCliente: ClienteForm = {
  nombre: '', apellido: '', cedula: '', telefono: '',
  email: '', direccion: '', ciudad: '',
}

const initialCompra: CompraForm = {
  id_numero_pedido: '', fecha_compra: '', referencia: '',
  id_talla_actual: '', valor_compra: '',
}

const initialTicket: TicketForm = {
  id_marcas: '', id_motivo_caso: '', id_sub_motivo: '',
  id_usuario: '', id_talla_actual: '', id_nueva_talla: '',
  nueva_referencia: '', descripcion: '', solucion_esperada: '',
  observaciones_internas: '', files: [],
}

function todayStr() {
  return new Date().toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function generarTicketPreview(role: string, brandId: string): string {
  const seq = String(Math.floor(Math.random() * 900000 + 100000))
  if (role === 'SPTienda') return `SPTK-${seq}`
  const brand = brands.find(b => String(b.id_marcas) === brandId)
  const name = brand?.nombre_marca?.toLowerCase() || ''
  if (name === 'speedo') return `STK-${seq}`
  if (name === "o'neill" || name === 'oneill') return `OTK-${seq}`
  return `TKT-${seq}`
}

export default function TicketRegistrationPage() {
  const [cliente, setCliente] = useState<ClienteForm>(initialCliente)
  const [compra, setCompra] = useState<CompraForm>(initialCompra)
  const [ticket, setTicket] = useState<TicketForm>(initialTicket)
  const [tipoSolicitudGroup, setTipoSolicitudGroup] = useState<string>('')
  const [selectedMotivoCode, setSelectedMotivoCode] = useState<string>('')
  const [files, setFiles] = useState<File[]>([])
  const [dragging, setDragging] = useState(false)
  const [role, setRole] = useState('user')
  const [tipoComercio, setTipoComercio] = useState('')

  function updCliente<K extends keyof ClienteForm>(k: K, v: ClienteForm[K]) {
    setCliente(p => ({ ...p, [k]: v }))
  }
  function updCompra<K extends keyof CompraForm>(k: K, v: CompraForm[K]) {
    setCompra(p => ({ ...p, [k]: v }))
  }
  function updTicket<K extends keyof TicketForm>(k: K, v: TicketForm[K]) {
    setTicket(p => ({ ...p, [k]: v }))
  }

  const isEcommerce = tipoComercio === '2'
  const isRetractoEnabled = isEcommerce

  useEffect(() => {
    if (!isRetractoEnabled && tipoSolicitudGroup === 'return') {
      setTipoSolicitudGroup('')
      setSelectedMotivoCode('')
    }
  }, [isRetractoEnabled])

  useEffect(() => {
    if (ticket.id_marcas && tipoSolicitudGroup) {
      updTicket('id_motivo_caso', selectedMotivoCode)
    }
  }, [selectedMotivoCode])

  const ticketPreview = useMemo(
    () => generarTicketPreview(role, ticket.id_marcas),
    [role, ticket.id_marcas]
  )

  function handleGroupClick(groupKey: string) {
    const group = requestGroups.find(g => g.groupKey === groupKey)
    if (!group) return
    if (group.groupKey === 'return' && !isRetractoEnabled) return

    if (tipoSolicitudGroup === groupKey) {
      setTipoSolicitudGroup('')
      setSelectedMotivoCode('')
      updTicket('id_motivo_caso', '')
      return
    }

    setTipoSolicitudGroup(groupKey)

    if (group.subOptions.length === 1) {
      setSelectedMotivoCode(group.subOptions[0].motivoCode)
      updTicket('id_motivo_caso', group.subOptions[0].motivoCode)
    } else if (group.subOptions.length === 0) {
      setSelectedMotivoCode(groupKey)
      updTicket('id_motivo_caso', groupKey)
    } else {
      setSelectedMotivoCode('')
      updTicket('id_motivo_caso', '')
    }
  }

  function handleSubOptionClick(motivoCode: string) {
    if (selectedMotivoCode === motivoCode) {
      setSelectedMotivoCode('')
      updTicket('id_motivo_caso', '')
    } else {
      setSelectedMotivoCode(motivoCode)
      updTicket('id_motivo_caso', motivoCode)
    }
  }

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false)
    const dropped = Array.from(e.dataTransfer.files)
    setFiles(prev => [...prev, ...dropped])
  }

  function removeFile(i: number) {
    setFiles(prev => prev.filter((_, idx) => idx !== i))
  }

  const currentGroup = requestGroups.find(g => g.groupKey === tipoSolicitudGroup)
  const activeSubOptions = currentGroup?.subOptions || []

  const showTallaFields = selectedMotivoCode === 'change_size'
  const showNuevaReferencia = selectedMotivoCode === 'change_reference'

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div>
        <p className="text-label text-slate-500">Tickets / Nuevo</p>
        <h1 className="mt-3 text-h3 font-semibold text-slate-950">Registrar ticket</h1>
        <p className="mt-2 max-w-2xl text-body-medium text-slate-600">Captura los datos del caso para asignarlo y dar seguimiento.</p>
      </div>

      {/* ── TICKET PREVIEW ── */}
      <div className="rounded-xl border border-violet-200 bg-violet-50/60 px-6 py-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BadgeCheck className="h-6 w-6 text-violet-600" />
            <div>
              <p className="text-label text-violet-600">Número de ticket</p>
              <p className="text-h4 font-bold text-violet-900 tracking-wider">{ticketPreview}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-caption text-slate-500">
            <Shield className="h-3.5 w-3.5" />
            {role === 'SPTienda' ? 'Rol SPTienda — prefijo SPTK' : 'Prefijo determinado por la marca'}
          </div>
        </div>
      </div>

      <form onSubmit={e => e.preventDefault()} className="grid gap-6 xl:grid-cols-[1.5fr_0.85fr]">
        {/* ── COLUMNA PRINCIPAL ────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* ── DATOS DEL CLIENTE ── */}
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
            <div className="mb-5">
              <p className="text-label text-slate-500">Datos del cliente</p>
              <p className="mt-1 text-body-small text-slate-500">Información del cliente asociado al caso.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-slate-400" />Nombre completo</span>
                <div className="grid grid-cols-2 gap-2">
                  <input value={cliente.nombre} onChange={e => updCliente('nombre', e.target.value)} placeholder="Nombre" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
                  <input value={cliente.apellido} onChange={e => updCliente('apellido', e.target.value)} placeholder="Apellido" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
                </div>
              </label>
              <label className="space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5 text-slate-400" />Documento de identidad</span>
                <input value={cliente.cedula} onChange={e => updCliente('cedula', e.target.value)} placeholder="RFC, RUT o cédula" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
              </label>
              <label className="space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-400" />Teléfono</span>
                <input value={cliente.telefono} onChange={e => updCliente('telefono', e.target.value)} placeholder="+52 55 1234 5678" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
              </label>
              <label className="space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-400" />Correo electrónico</span>
                <input value={cliente.email} onChange={e => updCliente('email', e.target.value)} placeholder="cliente@correo.com" type="email" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
              </label>
              <label className="space-y-1.5 text-body-medium text-slate-700 sm:col-span-2">
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400" />Dirección</span>
                <input value={cliente.direccion} onChange={e => updCliente('direccion', e.target.value)} placeholder="Calle, número, colonia, código postal" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
              </label>
              <label className="space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400" />Ciudad</span>
                <select value={cliente.ciudad} onChange={e => updCliente('ciudad', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-violet-500">
                  <option value="">Selecciona una ciudad</option>
                  {ciudades.map(c => <option key={c.id_ciudad} value={c.id_ciudad}>{c.ciudad}</option>)}
                </select>
              </label>
              <label className="space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400" />Fecha de solicitud</span>
                <input value={todayStr()} readOnly className="w-full rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none cursor-not-allowed" />
              </label>
            </div>
          </section>

          {/* ── DATOS DE LA COMPRA ── */}
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
            <div className="mb-5">
              <p className="text-label text-slate-500">Datos de la compra</p>
              <p className="mt-1 text-body-small text-slate-500">Información del pedido o factura asociada.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5"><Hash className="h-3.5 w-3.5 text-slate-400" />N° Factura / Pedido</span>
                <input value={compra.id_numero_pedido} onChange={e => updCompra('id_numero_pedido', e.target.value)} placeholder="ORD-58291" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
              </label>
              <label className="space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400" />Fecha de compra</span>
                <input value={compra.fecha_compra} onChange={e => updCompra('fecha_compra', e.target.value)} type="date" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
              </label>
              <label className="space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5"><ShoppingBag className="h-3.5 w-3.5 text-slate-400" />Referencia(s)</span>
                <input value={compra.referencia} onChange={e => updCompra('referencia', e.target.value)} placeholder="REF-001, REF-002" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
              </label>
              <label className="space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5"><Ruler className="h-3.5 w-3.5 text-slate-400" />Talla</span>
                <select value={compra.id_talla_actual} onChange={e => updCompra('id_talla_actual', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-violet-500">
                  <option value="">Selecciona una talla</option>
                  {tallas.map(t => <option key={t.id_talla} value={t.id_talla}>{t.nombre_talla}</option>)}
                </select>
              </label>
              <label className="space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-slate-400" />Valor de la compra</span>
                <input value={compra.valor_compra} onChange={e => updCompra('valor_compra', e.target.value)} type="number" min="0" step="0.01" placeholder="$ 0.00" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
              </label>
            </div>
          </section>

          {/* ── DESCRIPCIÓN ── */}
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
            <div className="mb-5">
              <p className="text-label text-slate-500">Descripción del caso</p>
              <p className="mt-1 text-body-small text-slate-500">Detalla el motivo, la solución esperada y notas internas.</p>
            </div>
            <div className="space-y-4">
              <label className="space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5 text-slate-400" />Descripción del motivo de la solicitud</span>
                <textarea rows={4} value={ticket.descripcion} onChange={e => updTicket('descripcion', e.target.value)} placeholder="Explica con detalle qué sucedió, cuándo y el contexto del caso." className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-body-medium outline-none focus:border-violet-500 resize-y" />
              </label>
              <label className="space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5 text-slate-400" />Solución deseada</span>
                <textarea rows={3} value={ticket.solucion_esperada} onChange={e => updTicket('solucion_esperada', e.target.value)} placeholder="¿Qué espera el cliente como solución?" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-body-medium outline-none focus:border-violet-500 resize-y" />
              </label>
              <label className="space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5 text-slate-400" />Observaciones internas</span>
                <textarea rows={3} value={ticket.observaciones_internas} onChange={e => updTicket('observaciones_internas', e.target.value)} placeholder="Notas solo para el equipo interno." className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-body-medium outline-none focus:border-violet-500 resize-y" />
              </label>
            </div>
          </section>
        </div>

        {/* ── COLUMNA LATERAL ─────────────────────────────────────────────── */}
        <aside className="space-y-6">
          {/* ── ASIGNAR Y CONFIGURACIÓN DEL TICKET ── */}
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
            <div className="mb-4">
              <p className="text-label text-slate-500">Configuración del ticket</p>
              <p className="mt-1 text-body-small text-slate-500">Rol, marca, canal y agente determinan el prefijo del ticket.</p>
            </div>
            <div className="space-y-4">
              <label className="space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-slate-400" />Rol del usuario</span>
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-violet-500">
                  {roles.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </label>
              <label className="space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5"><Store className="h-3.5 w-3.5 text-slate-400" />Marca</span>
                <select value={ticket.id_marcas} onChange={e => updTicket('id_marcas', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-violet-500">
                  <option value="">Selecciona marca</option>
                  {brands.map(b => <option key={b.id_marcas} value={b.id_marcas}>{b.nombre_marca}</option>)}
                </select>
              </label>
              <label className="space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5"><Store className="h-3.5 w-3.5 text-slate-400" />Canal de compra</span>
                <select value={tipoComercio} onChange={e => setTipoComercio(e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-violet-500">
                  <option value="">Selecciona un canal</option>
                  {tiposComercio.map(tc => <option key={tc.id_tipo_comercio} value={tc.id_tipo_comercio}>{tc.nombre_tipo}</option>)}
                </select>
              </label>
              <label className="space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-slate-400" />Agente</span>
                <select value={ticket.id_usuario} onChange={e => updTicket('id_usuario', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-violet-500">
                  <option value="">Auto-asignar</option>
                  {agentes.map(a => <option key={a.id} value={a.id}>{a.full_name}</option>)}
                </select>
              </label>
            </div>
          </section>

          {/* ── TIPO DE SOLICITUD ── */}
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
            <div className="mb-4">
              <p className="text-label text-slate-500">Tipo de solicitud</p>
              <p className="mt-1 text-body-small text-slate-500">Selecciona el tipo de caso.</p>
            </div>
            <div className="space-y-3">
              {requestGroups.map(group => {
                const isRetracto = group.groupKey === 'return'
                const disabled = isRetracto && !isRetractoEnabled
                const isSelected = tipoSolicitudGroup === group.groupKey
                const hasSubOptions = group.subOptions.length > 0
                return (
                <div key={group.groupKey}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => handleGroupClick(group.groupKey)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-body-medium font-semibold transition ${
                      disabled
                        ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                        : isSelected
                          ? 'border-violet-300 bg-violet-50 text-violet-700'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-violet-200 hover:bg-violet-50/40'
                    }`}
                  >
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[10px] ${
                      isSelected
                        ? 'border-violet-600 bg-violet-600 text-white'
                        : 'border-slate-300 bg-white text-transparent'
                    }`}>✓</span>
                    {group.groupLabel}
                    {isRetracto && (
                      <span className="ml-auto text-caption font-normal text-amber-600">solo e-commerce</span>
                    )}
                  </button>

                  {isSelected && hasSubOptions && (
                    <div className="ml-7 mt-2 space-y-1.5">
                      {group.subOptions.map(sub => (
                        <button
                          key={sub.motivoCode}
                          type="button"
                          onClick={() => handleSubOptionClick(sub.motivoCode)}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-body-small transition w-full text-left ${
                            selectedMotivoCode === sub.motivoCode
                              ? 'bg-violet-100 text-violet-700 font-semibold'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[9px] ${
                            selectedMotivoCode === sub.motivoCode
                              ? 'border-violet-600 bg-violet-600 text-white'
                              : 'border-slate-300'
                          }`}>
                            {selectedMotivoCode === sub.motivoCode ? '✓' : ''}
                          </span>
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                )
              })}
            </div>
          </section>

          {/* ── CAMPOS DINÁMICOS POR TIPO ── */}
          {showTallaFields && (
            <section className="rounded-lg border border-amber-200 bg-amber-50/60 p-6 shadow-sm">
              <p className="text-label text-amber-700 mb-4">Cambio de talla</p>
              <div className="space-y-4">
                <label className="space-y-1.5 text-body-medium text-slate-700">
                  <span>Talla actual</span>
                  <input value={compra.id_talla_actual || ticket.id_talla_actual} onChange={e => updTicket('id_talla_actual', e.target.value)} placeholder="Ej: M" className="w-full rounded-3xl border border-amber-200 bg-white px-4 py-3 outline-none focus:border-amber-500" />
                </label>
                <label className="space-y-1.5 text-body-medium text-slate-700">
                  <span>Nueva talla solicitada</span>
                  <select value={ticket.id_nueva_talla} onChange={e => updTicket('id_nueva_talla', e.target.value)} className="w-full rounded-3xl border border-amber-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-amber-500">
                    <option value="">Selecciona nueva talla</option>
                    {tallas.map(t => <option key={t.id_talla} value={t.id_talla}>{t.nombre_talla}</option>)}
                  </select>
                </label>
              </div>
            </section>
          )}

          {showNuevaReferencia && (
            <section className="rounded-lg border border-amber-200 bg-amber-50/60 p-6 shadow-sm">
              <p className="text-label text-amber-700 mb-4">Cambio de referencia</p>
              <div className="space-y-4">
                <label className="space-y-1.5 text-body-medium text-slate-700">
                  <span>Referencia actual</span>
                  <input value={compra.referencia} readOnly className="w-full rounded-3xl border border-amber-200 bg-amber-100/60 px-4 py-3 text-slate-500 outline-none cursor-not-allowed" />
                </label>
                <label className="space-y-1.5 text-body-medium text-slate-700">
                  <span>Nueva referencia</span>
                  <input value={ticket.nueva_referencia} onChange={e => updTicket('nueva_referencia', e.target.value)} placeholder="REF-003" className="w-full rounded-3xl border border-amber-200 bg-white px-4 py-3 outline-none focus:border-amber-500" />
                </label>
              </div>
            </section>
          )}

          {/* ── ADJUNTAR ARCHIVOS ── */}
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
            <p className="text-label text-slate-500 mb-4">Adjuntar archivos</p>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleFileDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
              className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${
                dragging ? 'border-violet-400 bg-violet-50' : 'border-slate-200 bg-slate-50 hover:border-violet-300 hover:bg-violet-50/30'
              }`}
            >
              <Upload className="h-6 w-6 text-slate-400" />
              <p className="text-body-small text-slate-600">Arrastra archivos aquí o haz clic para subir</p>
              <p className="text-caption text-slate-400">JPG, PNG, WEBP, PDF — máx 10 MB</p>
            </div>
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              className="hidden"
              onChange={e => {
                if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)])
              }}
            />
            {files.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-body-small text-slate-700">
                    <span className="flex items-center gap-2 truncate">
                      <Paperclip className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{f.name}</span>
                      <span className="shrink-0 text-caption text-slate-400">({(f.size / 1024).toFixed(0)} KB)</span>
                    </span>
                    <button type="button" onClick={() => removeFile(i)} className="ml-2 shrink-0 rounded p-0.5 text-slate-400 hover:text-red-500">
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-700 px-5 py-3.5 text-button font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-800 active:bg-violet-900"
          >
            <FileText className="h-4 w-4" />
            Crear ticket
          </button>
        </aside>
      </form>
    </div>
  )
}
