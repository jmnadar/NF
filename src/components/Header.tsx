import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Moon, Search, Settings, LogOut } from 'lucide-react'
import { account, notifications as mockNotifications } from '../data/mock'
import type { Notification } from '../data/mock'
import { showToast } from 'nextjs-toast-notify'

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

function toastType(title: string): 'success' | 'error' | 'warning' | 'info' {
  if (title.includes('SLA') && !title.includes('vencido')) return 'warning'
  if (title.includes('vencido') || title.includes('SLA')) return 'error'
  if (title.includes('asignado')) return 'info'
  return 'success'
}

export default function Header() {
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const profileRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleBellClick() {
    const unread = notifications.filter(n => !n.read)
    unread.forEach(n => {
      showToast[toastType(n.title)](n.description, {
        duration: 5000,
        position: 'top-right',
        transition: 'bounceIn',
        icon: '',
        sound: true,
      })
    })
    if (unread.length > 0) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }
  }

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

        <button
          onClick={handleBellClick}
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
