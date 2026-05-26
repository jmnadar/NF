import { useEffect, useRef, useState } from 'react'
import { X, User, CreditCard, Phone, Mail, MapPin, Home, FileText, PlusCircle } from 'lucide-react'
import { showToast } from 'nextjs-toast-notify'

const reasons = ['Pedido incompleto', 'Reclamo de calidad', 'Devolución', 'Cambio de dirección', 'Solicitud de información']

interface Props {
  onClose: () => void
}

interface FormData {
  name: string
  document: string
  phone: string
  email: string
  city: string
  address: string
}

interface TicketData {
  reason: string
  subject: string
  description: string
}

const initial: FormData = {
  name: '',
  document: '',
  phone: '',
  email: '',
  city: '',
  address: '',
}

const initialTicket: TicketData = {
  reason: '',
  subject: '',
  description: '',
}

export default function CreateClientModal({ onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [form, setForm] = useState<FormData>(initial)
  const [withTicket, setWithTicket] = useState(false)
  const [ticket, setTicket] = useState<TicketData>(initialTicket)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function set<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function setTicketField<K extends keyof TicketData>(field: K, value: TicketData[K]) {
    setTicket(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent, createTicket: boolean) {
    e.preventDefault()
    showToast.success(`Cliente "${form.name || 'Sin nombre'}" creado correctamente${createTicket ? ' con ticket' : ''}`, {
      duration: 4000,
      position: 'top-right',
      transition: 'bounceIn',
      sound: true,
    })
    onClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-elevation-4">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <p className="text-label text-slate-500">Clientes / Nuevo</p>
            <h2 className="mt-1 text-h5 font-semibold text-slate-950">Crear cliente</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-5 scrollbar-thin">
          <section>
            <p className="text-label text-slate-500 mb-3">Información del cliente</p>
            <div className="space-y-4">
              <label className="block space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  Nombre y apellido
                  <span className="text-caption text-amber-600 font-medium">(mín. para e-commerce)</span>
                </span>
                <input
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="P.ej. Distribuidora Norte SA"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500"
                />
              </label>

              <label className="block space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                  Documento
                  <span className="text-caption text-amber-600 font-medium">(mín. para tiendas)</span>
                </span>
                <input
                  value={form.document}
                  onChange={e => set('document', e.target.value)}
                  placeholder="RFC, RUT o cédula"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500"
                />
              </label>

              <label className="block space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  Teléfono
                  <span className="text-caption text-amber-600 font-medium">(mín. para e-commerce)</span>
                </span>
                <input
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder="+52 55 1234 5678"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500"
                />
              </label>

              <label className="block space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  Correo electrónico
                </span>
                <input
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="cliente@correo.com"
                  type="email"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500"
                />
              </label>
            </div>
          </section>

          <section>
            <p className="text-label text-slate-500 mb-3">Dirección</p>
            <div className="space-y-4">
              <label className="block space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  Ciudad
                </span>
                <select
                  value={form.city}
                  onChange={e => set('city', e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-violet-500"
                >
                  <option value="">Selecciona una ciudad</option>
                  <option value="CDMX">CDMX</option>
                  <option value="Guadalajara">Guadalajara</option>
                  <option value="Monterrey">Monterrey</option>
                  <option value="León">León</option>
                  <option value="Puebla">Puebla</option>
                  <option value="Querétaro">Querétaro</option>
                  <option value="Tijuana">Tijuana</option>
                  <option value="Mérida">Mérida</option>
                  <option value="Cancún">Cancún</option>
                  <option value="Veracruz">Veracruz</option>
                  <option value="Otra">Otra</option>
                </select>
              </label>

              <label className="block space-y-1.5 text-body-medium text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Home className="h-3.5 w-3.5 text-slate-400" />
                  Dirección
                </span>
                <input
                  value={form.address}
                  onChange={e => set('address', e.target.value)}
                  placeholder="Calle, número, colonia"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500"
                />
              </label>
            </div>
          </section>

          <hr className="border-slate-100" />

          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-violet-200 hover:bg-violet-50/40">
            <span className="flex items-center gap-2.5 text-body-medium font-semibold text-slate-700">
              <PlusCircle className="h-4 w-4 text-violet-600" />
              Crear ticket para este cliente
            </span>
            <input
              type="checkbox"
              checked={withTicket}
              onChange={e => setWithTicket(e.target.checked)}
              className="h-4 w-4 accent-violet-700"
            />
          </label>

          {withTicket && (
            <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="flex items-center gap-2 text-label text-slate-500">
                <FileText className="h-3.5 w-3.5" />
                Datos del ticket
              </p>
              <label className="block space-y-1.5 text-body-medium text-slate-700">
                <span>Motivo</span>
                <select
                  value={ticket.reason}
                  onChange={e => setTicketField('reason', e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-violet-500"
                >
                  <option value="">Selecciona un motivo</option>
                  {reasons.map(r => <option key={r}>{r}</option>)}
                </select>
              </label>
              <label className="block space-y-1.5 text-body-medium text-slate-700">
                <span>Asunto</span>
                <input
                  value={ticket.subject}
                  onChange={e => setTicketField('subject', e.target.value)}
                  placeholder="Resumen breve del caso"
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500"
                />
              </label>
              <label className="block space-y-1.5 text-body-medium text-slate-700">
                <span>Descripción</span>
                <textarea
                  rows={3}
                  value={ticket.description}
                  onChange={e => setTicketField('description', e.target.value)}
                  placeholder="Explica con detalle qué sucedió"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500"
                />
              </label>
            </section>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-button font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
            {withTicket ? (
              <button
                type="submit"
                onClick={e => handleSubmit(e, true)}
                className="rounded-lg bg-violet-700 px-5 py-2.5 text-button font-semibold text-white transition hover:bg-violet-800"
              >
                Guardar cliente y ticket
              </button>
            ) : (
              <button
                type="submit"
                onClick={e => handleSubmit(e, false)}
                className="rounded-lg bg-violet-700 px-5 py-2.5 text-button font-semibold text-white transition hover:bg-violet-800"
              >
                Guardar cliente
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
