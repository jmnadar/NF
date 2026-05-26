import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Moon, Search, Settings, LogOut, X, AlertTriangle, Info, CheckCircle } from 'lucide-react'
import { account, notifications as mockNotifications } from '../data/mock'
import type { Notification } from '../data/mock'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function roleColor(role: string): string {
  if (role.toLowerCase().includes('admin')) return 'bg-violet-700'
  if (role.toLowerCase().includes('supervisor')) return 'bg-blue-600'
  return 'bg-emerald-600'
}

function NotificationIcon({ type, read }: { type: string; read: boolean }) {
  const cn = read ? 'text-slate-400' : ''
  if (type.includes('SLA') && !type.includes('vencido')) return <AlertTriangle className={`h-3 w-3 ${read ? 'text-slate-400' : 'text-amber-500'}`} />
  if (type.includes('vencido') || type.includes('SLA')) return <X className={`h-3 w-3 ${read ? 'text-slate-400' : 'text-rose-500'}`} />
  if (type.includes('asignado')) return <Info className={`h-3 w-3 ${read ? 'text-slate-400' : 'text-violet-500'}`} />
  return <CheckCircle className={`h-3 w-3 ${read ? 'text-slate-400' : 'text-emerald-500'}`} />
}

export default function Header() {
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const initials = getInitials(account.name)
  const avatarColor = roleColor(account.role)

  return (
    <div className="flex w-full items-center justify-between gap-4 px-4 py-4 sm:px-6 xl:px-8">
      <div className="flex flex-1 items-center gap-4 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-200/60">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="search"
          placeholder="Buscar clientes, tickets, tiendas..."
          className="w-full border-0 bg-transparent text-body-medium text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-full border border-slate-200 bg-white p-2 text-button text-slate-600 transition hover:border-slate-300 hover:text-slate-900">
          <Moon className="h-4 w-4" />
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(v => !v)}
            className={`relative rounded-full border p-2 text-button transition ${
              unreadCount > 0
                ? 'border-violet-200 bg-violet-50 text-violet-600 before:absolute before:-inset-0.5 before:rounded-full before:border-2 before:border-violet-400/40 before:animate-pulse'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            <Bell className={`h-4 w-4 ${unreadCount > 0 ? 'animate-pulse' : ''}`} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-caption font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/50 z-50">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-button font-semibold text-slate-900">Notificaciones</p>
                {unreadCount > 0 && (
                  <button
                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                    className="text-caption text-violet-600 hover:text-violet-700 transition"
                  >
                    Marcar todas leídas
                  </button>
                )}
              </div>
              <div className="max-h-[300px] space-y-1 overflow-y-auto scrollbar-thin">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`rounded-xl p-3 transition ${n.read ? 'hover:bg-slate-50' : 'bg-violet-50/60 hover:bg-violet-50'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 rounded-full p-1.5 ${n.read ? 'bg-slate-100' : 'bg-violet-100'}`}>
                        <NotificationIcon type={n.title} read={n.read} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-body-small leading-tight ${n.read ? 'text-slate-600' : 'font-semibold text-slate-900'}`}>
                          {n.title}
                        </p>
                        <p className="mt-0.5 truncate text-caption text-slate-500">{n.description}</p>
                        <p className="mt-1 text-caption text-slate-400">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(v => !v)}
            className="flex items-center gap-3 rounded-3xl bg-white px-4 py-2 text-slate-900 shadow-sm shadow-slate-200/60 transition hover:bg-slate-50"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${avatarColor} text-h6 font-semibold text-white select-none`}>
              {initials}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-body-large font-semibold leading-tight">{account.name}</p>
              <p className="text-body-small leading-tight text-slate-500">{account.role}</p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50 z-50">
              <div className="mb-1 border-b border-slate-100 px-3 py-2">
                <p className="text-body-small font-semibold text-slate-900">{account.name}</p>
                <p className="text-caption text-slate-500">{account.email}</p>
              </div>
              <button
                onClick={() => { setProfileOpen(false); navigate('/configuracion') }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-body-small text-slate-700 transition hover:bg-slate-100"
              >
                <Settings className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Configuración</span>
              </button>
              <button
                onClick={() => { setProfileOpen(false) }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-body-small text-rose-600 transition hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
