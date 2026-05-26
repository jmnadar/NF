import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Phone, MapPin, MessageCircle, Pencil, Save, User, CreditCard, Home, Send, ExternalLink, FileText, Trash2, PlusCircle } from 'lucide-react'
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

type CommsTab = 'email' | 'whatsapp'

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

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const drawerVariants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring', damping: 28, stiffness: 300 } },
  exit: { x: '100%', transition: { type: 'spring', damping: 28, stiffness: 300 } },
}

export default function CustomerDetailDrawer({ customer, onClose }: Props) {
  const navigate = useNavigate()
  const overlayRef = useRef<HTMLDivElement>(null)
  const [editing, setEditing] = useState(false)
  const [commsTab, setCommsTab] = useState<CommsTab>('email')
  const [commsMessage, setCommsMessage] = useState('')
  const [commsSubject, setCommsSubject] = useState('')
  const [form, setForm] = useState({ name: customer.name, owner: customer.owner, email: customer.email, phone: customer.phone, location: customer.location, document: '' })

  useEffect(() => {
    setForm({ name: customer.name, owner: customer.owner, email: customer.email, phone: customer.phone, location: customer.location, document: '' })
  }, [customer])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (editing) setEditing(false); else onClose() } }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, editing])

  function set<K extends keyof typeof form>(field: K, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSave() {
    showToast.success(`Perfil de "${form.name}" actualizado`, {
      duration: 4000, position: 'top-right', transition: 'bounceIn', sound: true,
    })
    setEditing(false)
  }

  function handleSendEmail() {
    showToast.success(`Correo enviado a ${customer.email}`, {
      duration: 4000, position: 'top-right', transition: 'bounceIn', sound: true,
    })
    setCommsSubject('')
    setCommsMessage('')
  }

  function handleOpenWhatsApp() {
    const msg = encodeURIComponent(commsMessage || `Hola ${customer.name}, te escribimos de Swim CRM`)
    window.open(`https://wa.me/${cleanPhone(customer.phone)}?text=${msg}`, '_blank', 'noopener')
  }

  const customerTickets = tickets.filter(t => t.client === customer.name)

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        key="drawer-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.2 }}
        onClick={e => { if (e.target === overlayRef.current) { if (editing) setEditing(false); else onClose() } }}
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]"
      >
        <motion.aside
          key="drawer-panel"
          variants={drawerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={e => e.stopPropagation()}
          className="absolute right-0 top-0 flex h-full w-full max-w-[480px] flex-col bg-white shadow-elevation-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-h6 font-semibold text-violet-700">
                {customer.initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-body-medium font-semibold text-slate-950">{customer.name}</p>
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
                  Editar
                </button>
              )}
              <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 scrollbar-thin">

            <section>
              <div className="flex items-center justify-between mb-3">
                <p className="text-label text-slate-500">Información de contacto</p>
                {editing && <span className="text-caption text-violet-600 font-medium">Editando...</span>}
              </div>
              {editing ? (
                <div className="space-y-3 text-body-medium text-slate-700">
                  <label className="block space-y-1">
                    <span className="flex items-center gap-1.5 text-caption text-slate-500"><User className="h-3 w-3" />Nombre</span>
                    <input value={form.name} onChange={e => set('name', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
                  </label>
                  <label className="block space-y-1">
                    <span className="flex items-center gap-1.5 text-caption text-slate-500"><User className="h-3 w-3" />Contacto</span>
                    <input value={form.owner} onChange={e => set('owner', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
                  </label>
                  <label className="block space-y-1">
                    <span className="flex items-center gap-1.5 text-caption text-slate-500"><CreditCard className="h-3 w-3" />Documento</span>
                    <input value={form.document} onChange={e => set('document', e.target.value)} placeholder="RFC o cédula" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
                  </label>
                  <label className="block space-y-1">
                    <span className="flex items-center gap-1.5 text-caption text-slate-500"><Mail className="h-3 w-3" />Correo</span>
                    <input value={form.email} onChange={e => set('email', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
                  </label>
                  <label className="block space-y-1">
                    <span className="flex items-center gap-1.5 text-caption text-slate-500"><Phone className="h-3 w-3" />Teléfono</span>
                    <input value={form.phone} onChange={e => set('phone', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
                  </label>
                  <label className="block space-y-1">
                    <span className="flex items-center gap-1.5 text-caption text-slate-500"><MapPin className="h-3 w-3" />Ubicación</span>
                    <input value={form.location} onChange={e => set('location', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500" />
                  </label>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-body-medium text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 shrink-0 text-violet-600" />
                    <span className="truncate">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 shrink-0 text-violet-600" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 shrink-0 text-violet-600" />
                    <span className="truncate">{customer.location}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 shrink-0 text-violet-600" />
                    <span className="truncate">{customer.tickets} tickets</span>
                  </div>
                </div>
              )}
            </section>

            <section>
              <p className="text-label text-slate-500 mb-3">Comunicación</p>
              <div className="flex gap-1 rounded-lg bg-slate-100 p-1 mb-4">
                <button
                  onClick={() => setCommsTab('email')}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-caption font-semibold transition ${commsTab === 'email' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </button>
                <button
                  onClick={() => setCommsTab('whatsapp')}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-caption font-semibold transition ${commsTab === 'whatsapp' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </button>
              </div>

              {commsTab === 'email' ? (
                <div className="space-y-3">
                  <label className="block space-y-1 text-body-medium text-slate-700">
                    <span className="text-caption text-slate-500">Asunto</span>
                    <input value={commsSubject} onChange={e => setCommsSubject(e.target.value)} placeholder="Asunto del correo" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500" />
                  </label>
                  <label className="block space-y-1 text-body-medium text-slate-700">
                    <span className="text-caption text-slate-500">Mensaje</span>
                    <textarea value={commsMessage} onChange={e => setCommsMessage(e.target.value)} rows={4} placeholder="Escribe tu mensaje..." className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500" />
                  </label>
                  <button onClick={handleSendEmail} disabled={!customer.email} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-violet-700 px-4 py-2.5 text-button font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50">
                    <Send className="h-4 w-4" />
                    Enviar correo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {!customer.phone ? (
                    <p className="rounded-lg bg-amber-50 px-4 py-3 text-caption font-medium text-amber-700">El cliente no tiene teléfono registrado.</p>
                  ) : (
                    <>
                      <label className="block space-y-1 text-body-medium text-slate-700">
                        <span className="text-caption text-slate-500">Mensaje</span>
                        <textarea value={commsMessage} onChange={e => setCommsMessage(e.target.value)} rows={4} placeholder="Escribe tu mensaje..." className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500" />
                      </label>
                      <button onClick={handleOpenWhatsApp} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-button font-semibold text-white transition hover:bg-emerald-700">
                        <MessageCircle className="h-4 w-4" />
                        Abrir WhatsApp
                      </button>
                    </>
                  )}
                </div>
              )}
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
                <button onClick={() => { onClose(); navigate('/tickets') }} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-button font-semibold text-violet-700 transition hover:bg-violet-50">
                  Ver todos los tickets
                  <ExternalLink className="h-4 w-4" />
                </button>
              )}
            </section>

          </div>
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  )
}
