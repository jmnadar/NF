import { useEffect, useRef, useState } from 'react'
import { X, Mail, Phone, MapPin, ExternalLink, MessageCircle, Pencil, Save, User, CreditCard, Home } from 'lucide-react'
import { tickets } from '../data/mock'
import { showToast } from 'nextjs-toast-notify'

interface Customer {
  initials: string
  name: string
  owner: string
  email: string
  phone: string
  location: string
  tickets: number
  status: string
  statusColor: string
}

interface Props {
  customer: Customer
  onClose: () => void
}

function statusStyle(status: string) {
  switch (status) {
    case 'Abierto':   return 'bg-violet-100 text-violet-700'
    case 'En curso':   return 'bg-rose-100 text-rose-700'
    case 'Pendiente':  return 'bg-amber-100 text-amber-700'
    case 'Resuelto':   return 'bg-emerald-100 text-emerald-700'
    case 'Cerrado':    return 'bg-slate-100 text-slate-700'
    default:           return 'bg-slate-100 text-slate-700'
  }
}

function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

export default function CustomerModal({ customer, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: customer.name, owner: customer.owner, email: customer.email, phone: customer.phone, location: customer.location })

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (editing) setEditing(false); else onClose() } }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, editing])

  useEffect(() => {
    setForm({ name: customer.name, owner: customer.owner, email: customer.email, phone: customer.phone, location: customer.location })
  }, [customer])

  function set<K extends keyof typeof form>(field: K, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSave() {
    showToast.success(`Perfil de "${form.name}" actualizado`, {
      duration: 4000, position: 'top-right', transition: 'bounceIn', sound: true,
    })
    setEditing(false)
  }

  const customerTickets = tickets.filter(t => t.client === customer.name)

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) { if (editing) setEditing(false); else onClose() } }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-elevation-4">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-h6 font-semibold text-violet-700">
              {customer.initials}
            </div>
            <div>
              <p className="text-body-medium font-semibold text-slate-950">{customer.name}</p>
              <p className="text-caption text-slate-500">{customer.owner}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {editing ? (
              <button onClick={handleSave} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-caption font-semibold text-white transition hover:bg-emerald-700">
                <Save className="h-3.5 w-3.5" />
                Guardar
              </button>
            ) : (
              <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-caption font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700">
                <Pencil className="h-3.5 w-3.5" />
                Editar perfil
              </button>
            )}
            <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-6 scrollbar-thin">

          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="text-label text-slate-500">Información de contacto</p>
              {editing && <span className="text-caption text-violet-600 font-medium">Editando...</span>}
            </div>
            {editing ? (
              <div className="space-y-3 text-body-medium text-slate-700">
                <label className="block space-y-1">
                  <span className="flex items-center gap-1.5 text-caption text-slate-500">
                    <User className="h-3 w-3" />
                    Nombre del cliente
                  </span>
                  <input value={form.name} onChange={e => set('name', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
                </label>
                <label className="block space-y-1">
                  <span className="flex items-center gap-1.5 text-caption text-slate-500">
                    <User className="h-3 w-3" />
                    Contacto / Propietario
                  </span>
                  <input value={form.owner} onChange={e => set('owner', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
                </label>
                <label className="block space-y-1">
                  <span className="flex items-center gap-1.5 text-caption text-slate-500">
                    <Mail className="h-3 w-3" />
                    Correo electrónico
                  </span>
                  <input value={form.email} onChange={e => set('email', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
                </label>
                <label className="block space-y-1">
                  <span className="flex items-center gap-1.5 text-caption text-slate-500">
                    <Phone className="h-3 w-3" />
                    Teléfono
                  </span>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
                </label>
                <label className="block space-y-1">
                  <span className="flex items-center gap-1.5 text-caption text-slate-500">
                    <MapPin className="h-3 w-3" />
                    Ubicación
                  </span>
                  <input value={form.location} onChange={e => set('location', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
                </label>
              </div>
            ) : (
              <div className="space-y-3 text-body-medium text-slate-600">
                <a href={`mailto:${customer.email}`} className="flex items-center gap-3 transition hover:text-violet-700">
                  <Mail className="h-4 w-4 shrink-0 text-violet-600" />
                  {customer.email}
                </a>
                <a href={`tel:${customer.phone}`} className="flex items-center gap-3 transition hover:text-violet-700">
                  <Phone className="h-4 w-4 shrink-0 text-violet-600" />
                  {customer.phone}
                </a>
                <p className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 shrink-0 text-violet-600" />
                  {customer.location}
                </p>
              </div>
            )}
          </section>

          <section>
            <p className="text-label text-slate-500 mb-3">Acciones rápidas</p>
            <div className="flex gap-3">
              <a
                href={`mailto:${customer.email}?subject=Contacto%20Swimming%20CRM`}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-button font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
              >
                <Mail className="h-4 w-4 text-violet-600" />
                Enviar correo
              </a>
              <a
                href={`https://wa.me/${cleanPhone(customer.phone)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-button font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                WhatsApp
              </a>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="text-label text-slate-500">Tickets ({customerTickets.length})</p>
            </div>
            {customerTickets.length === 0 ? (
              <p className="text-body-small text-slate-400 py-4 text-center">Sin tickets registrados.</p>
            ) : (
              <div className="space-y-2">
                {customerTickets.map(t => (
                  <div key={t.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-body-small font-semibold text-slate-900">{t.id}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-caption font-semibold ${statusStyle(t.status)}`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="mt-1 text-body-small text-slate-600">{t.reason}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-caption text-slate-400">{t.agent}</p>
                      <p className={`text-caption font-medium ${t.due.includes('Venció') ? 'text-rose-600' : t.due.includes('hoy') ? 'text-amber-600' : 'text-slate-400'}`}>
                        {t.due}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {customerTickets.length > 0 && (
              <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-button font-semibold text-violet-700 transition hover:bg-violet-50">
                Ver todos los tickets
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
          </section>

        </div>
      </div>
    </div>
  )
}
