import { useParams, useNavigate } from 'react-router-dom'
import { stores, guiasEnvio, enviosBitacora } from '../data/mock'
import { ArrowLeft, MapPin, Phone, Mail, Warehouse, Store as StoreIcon, User, Package, Clock, Truck, Notebook, CheckCircle2, Circle, CircleDot, FileText } from 'lucide-react'

const badgeEstado = (estado: string) => {
  switch (estado) {
    case 'completo': return 'bg-emerald-100 text-emerald-700'
    case 'recibido': return 'bg-blue-100 text-blue-700'
    default: return 'bg-amber-100 text-amber-700'
  }
}

const iconoBitacora = (tipo: string) => {
  switch (tipo) {
    case 'nueva_guia': return <FileText className="h-4 w-4" />
    case 'guia_recibida': return <Truck className="h-4 w-4" />
    case 'guia_completada': return <CheckCircle2 className="h-4 w-4" />
    case 'paquete_entregado': return <Package className="h-4 w-4" />
    default: return <Circle className="h-4 w-4" />
  }
}

const colorBitacora = (tipo: string) => {
  switch (tipo) {
    case 'nueva_guia': return 'bg-violet-100 text-violet-700'
    case 'guia_recibida': return 'bg-blue-100 text-blue-700'
    case 'guia_completada': return 'bg-emerald-100 text-emerald-700'
    case 'paquete_entregado': return 'bg-amber-100 text-amber-700'
    default: return 'bg-slate-100 text-slate-700'
  }
}

export default function StoreDetailPage() {
  const { nombre } = useParams()
  const navigate = useNavigate()
  const store = stores.find((s) => s.name === decodeURIComponent(nombre ?? ''))

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <StoreIcon className="mb-4 h-16 w-16 text-slate-300" />
        <h2 className="text-h4 font-semibold text-slate-950">Tienda no encontrada</h2>
        <p className="mt-2 text-body-small text-slate-500">La tienda que buscas no existe.</p>
        <button
          onClick={() => navigate('/tiendas')}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-violet-700 px-5 py-3 text-button font-semibold text-white transition hover:bg-violet-800"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a tiendas
        </button>
      </div>
    )
  }

  const guias = guiasEnvio.filter((g) => g.tienda === store.name)
  const bitacora = enviosBitacora.filter((b) => b.tienda === store.name).sort((a, b) => b.fecha.localeCompare(a.fecha))

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/tiendas')}
        className="inline-flex items-center gap-2 text-body-small text-slate-500 transition hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a tiendas
      </button>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-violet-100 text-2xl text-violet-700">
              🏬
            </div>
            <div>
              <h1 className="text-h3 font-semibold text-slate-950">{store.name}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-body-small text-slate-500">
                <MapPin className="h-3.5 w-3.5" /> {store.subtitle}
              </p>
            </div>
          </div>
          <span className={`self-start rounded-full px-4 py-1.5 text-xs font-semibold ${store.badge}`}>{store.status}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 lg:col-span-2">
          <h2 className="text-h5 font-semibold text-slate-950">Información general</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-label text-slate-400">Ciudad</p>
                <p className="text-body-small font-medium text-slate-950">{store.ciudad}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <Warehouse className="h-4 w-4" />
              </div>
              <div>
                <p className="text-label text-slate-400">Bodega</p>
                <p className="text-body-small font-medium text-slate-950">{store.numero_bodega}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-label text-slate-400">Teléfono</p>
                <p className="text-body-small font-medium text-slate-950">{store.telefono}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-label text-slate-400">Email</p>
                <p className="text-body-small font-medium text-slate-950">{store.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <StoreIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-label text-slate-400">Tipo de comercio</p>
                <p className="text-body-small font-medium text-slate-950">{store.tipo_comercio}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-label text-slate-400">Administrador</p>
                <p className="text-body-small font-medium text-slate-950">{store.admin}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Package className="h-4 w-4" />
              </div>
              <div>
                <p className="text-label text-slate-400">Envíos</p>
                <p className="text-h3 font-semibold text-slate-950">{store.shipments}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-label text-slate-400">Pendientes</p>
                <p className="text-h3 font-semibold text-slate-950">{store.pending}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-violet-700" />
          <h2 className="text-h5 font-semibold text-slate-950">Paquetes de envíos</h2>
          <span className="ml-auto rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">{guias.length} guías</span>
        </div>

        <div className="mt-5 space-y-4">
          {guias.map((guia) => (
            <details key={guia.numero_guia} className="group rounded-lg border border-slate-200 open:border-violet-200 open:ring-1 open:ring-violet-500/20">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                    <Notebook className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-body-small font-semibold text-slate-950">{guia.numero_guia}</p>
                    <p className="text-caption text-slate-400">{guia.fecha_creacion}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeEstado(guia.estado)}`}>{guia.estado}</span>
                  <span className="hidden text-caption text-slate-400 sm:inline">{guia.pedidos.length} paquetes</span>
                </div>
              </summary>
              <div className="border-t border-slate-100 px-5 py-4">
                {guia.nota && <p className="mb-3 text-caption text-slate-500">{guia.nota}</p>}
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-caption text-slate-400">
                      <th className="pb-2 font-medium">Pedido</th>
                      <th className="pb-2 font-medium">Estado</th>
                      <th className="pb-2 font-medium">Fecha entrega</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guia.pedidos.map((pedido) => (
                      <tr key={pedido.numero_pedido} className="border-t border-slate-50 text-body-small text-slate-700">
                        <td className="py-2.5 font-medium text-slate-950">{pedido.numero_pedido}</td>
                        <td className="py-2.5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${pedido.estado === 'entregado' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {pedido.estado === 'entregado' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CircleDot className="h-3.5 w-3.5" />}
                            {pedido.estado}
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-400">{pedido.fecha_entrega ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {guia.fecha_recibido && (
                  <p className="mt-3 text-caption text-slate-400">Recibido: {guia.fecha_recibido}</p>
                )}
                {guia.fecha_completado && (
                  <p className="text-caption text-slate-400">Completado: {guia.fecha_completado}</p>
                )}
              </div>
            </details>
          ))}
          {guias.length === 0 && (
            <p className="py-6 text-center text-body-small text-slate-400">No hay guías de envío para esta tienda.</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-violet-700" />
          <h2 className="text-h5 font-semibold text-slate-950">Bitácora de envíos</h2>
        </div>

        <div className="mt-5 space-y-0">
          {bitacora.map((evento, i) => (
            <div key={evento.id} className="relative flex gap-4 pb-6 last:pb-0">
              {i < bitacora.length - 1 && (
                <div className="absolute left-[18px] top-10 h-full w-px bg-slate-200" />
              )}
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${colorBitacora(evento.tipo)}`}>
                {iconoBitacora(evento.tipo)}
              </div>
              <div className="flex-1 pt-1">
                <p className="text-body-small font-semibold text-slate-950">{evento.titulo}</p>
                <p className="text-caption text-slate-500">{evento.mensaje}</p>
                <p className="mt-0.5 text-caption text-slate-400">{evento.fecha}</p>
              </div>
            </div>
          ))}
          {bitacora.length === 0 && (
            <p className="py-6 text-center text-body-small text-slate-400">No hay eventos registrados para esta tienda.</p>
          )}
        </div>
      </div>
    </div>
  )
}
