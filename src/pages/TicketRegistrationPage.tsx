import { Info, Paperclip, Calendar } from 'lucide-react'

const reasons = ['Pedido incompleto', 'Reclamo de calidad', 'Devolución', 'Cambio de dirección', 'Solicitud de información']
const channels = ['WhatsApp', 'Correo', 'Teléfono', 'Web']
const priorities = ['Baja', 'Media', 'Alta', 'Urgente']

export default function TicketRegistrationPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-label text-slate-500">Tickets / Nuevo</p>
        <h1 className="mt-3 text-h3 font-semibold text-slate-950">Registrar ticket</h1>
        <p className="mt-2 max-w-2xl text-body-medium text-slate-600">Captura los datos del caso para asignarlo y dar seguimiento.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.65fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
          <div className="space-y-4">
            <div>
              <p className="text-label text-slate-500">Datos del cliente</p>
              <p className="mt-2 text-body-small text-slate-600">Selecciona el cliente y la tienda relacionada con el caso.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-body-medium text-slate-700">
                <span>Cliente *</span>
                <input className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" placeholder="Buscar cliente..." />
              </label>
              <label className="space-y-2 text-body-medium text-slate-700">
                <span>Tienda</span>
                <select className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 outline-none focus:border-violet-500">
                  <option>Selecciona...</option>
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-body-medium text-slate-700">
                <span>Contacto</span>
                <input className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" placeholder="Nombre del contacto" />
              </label>
              <label className="space-y-2 text-body-medium text-slate-700">
                <span>Teléfono / Correo</span>
                <input className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" placeholder="+52 55 1234 5678" />
              </label>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <p className="text-label text-slate-500">Detalle del caso</p>
              <p className="mt-2 text-body-small text-slate-600">Describe el motivo y el contexto para el agente asignado.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-body-medium text-slate-700">
                <span>Motivo *</span>
                <select className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 outline-none focus:border-violet-500">
                  <option>Selecciona...</option>
                  {reasons.map((reason) => (
                    <option key={reason}>{reason}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-body-medium text-slate-700">
                <span>Canal de origen</span>
                <select className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 outline-none focus:border-violet-500">
                  <option>WhatsApp</option>
                  {channels.map((channel) => (
                    <option key={channel}>{channel}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-body-medium text-slate-700">
                <span>Pedido / Referencia</span>
                <input className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" placeholder="P.ej. ORD-58291" />
              </label>
              <label className="space-y-2 text-body-medium text-slate-700">
                <span>Fecha de vencimiento</span>
                <div className="relative">
                  <input type="date" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
                  <Calendar className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </label>
            </div>
            <label className="space-y-2 text-body-medium text-slate-700">
              <span>Asunto *</span>
              <input className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" placeholder="Resumen breve del caso" />
            </label>
            <label className="space-y-2 text-body-medium text-slate-700">
              <span>Descripción *</span>
              <textarea rows={6} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-body-medium outline-none focus:border-violet-500" placeholder="Explica con detalle qué sucedió, cuándo y qué espera el cliente."></textarea>
            </label>
            <button className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-3 text-button font-semibold text-slate-700 transition hover:bg-slate-200">
              <Paperclip className="h-4 w-4" /> Adjuntar archivos
            </button>
          </div>
        </div>

        <aside className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-5">
            <p className="text-label text-slate-500">Clasificación</p>
            <div className="grid gap-2">
              <div className="flex flex-wrap gap-2">
                {priorities.map((priority) => (
                  <button key={priority} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-button font-semibold text-slate-700 transition hover:bg-violet-50">
                    {priority}
                  </button>
                ))}
              </div>
              <select className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-600 outline-none focus:border-violet-500">
                <option>Auto-asignar</option>
              </select>
              <input type="text" placeholder="reclamo, mayorista..." className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-body-medium outline-none focus:border-violet-500" />
            </div>
          </div>
          <div className="space-y-3 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <p className="text-label text-slate-500">Notificaciones</p>
              <Info className="h-4 w-4 text-slate-400" />
            </div>
            <div className="space-y-3 text-body-medium text-slate-700">
              {['Notificar al cliente por correo', 'Enviar acuse por WhatsApp', 'Avisar al supervisor de tienda'].map((label) => (
                <label key={label} className="flex items-center justify-between rounded-3xl bg-white px-4 py-3">
                  <span>{label}</span>
                  <input type="checkbox" className="h-4 w-4 accent-violet-700" defaultChecked />
                </label>
              ))}
            </div>
          </div>
          <button className="w-full rounded-lg bg-violet-700 px-5 py-3 text-button font-semibold text-white transition hover:bg-violet-800">
            Crear ticket
          </button>
        </aside>
      </div>
    </div>
  )
}
