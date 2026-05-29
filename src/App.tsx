import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Home, Users, FileText, PlusCircle, Store, Settings2 } from 'lucide-react'
import DashboardPage from './pages/DashboardPage'
import CustomersPage from './pages/CustomersPage'
import TicketsPage from './pages/TicketsPage'
import TicketRegistrationPage from './pages/TicketRegistrationPage'
import StoresPage from './pages/StoresPage'
import StoreDetailPage from './pages/StoreDetailPage'
import SettingsPage from './pages/SettingsPage'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: Home },
  { label: 'Clientes', path: '/clientes', icon: Users },
  { label: 'Tickets', path: '/tickets', icon: FileText },
  { label: 'Registrar ticket', path: '/tickets/registro', icon: PlusCircle },
  { label: 'Tiendas', path: '/tiendas', icon: Store },
  { label: 'Configuración', path: '/configuracion', icon: Settings2 },
]

function App() {
  const location = useLocation()
  return (
    <div className="min-h-screen bg-slate-950 text-slate-900 text-body-medium">
      <div className="lg:flex">
        <Sidebar items={navItems} />
        <div className="flex-1">
          <div className="m-5 rounded-[2rem] bg-white shadow-elevation-1">
            <div className="sticky top-0 z-30 rounded-t-[2rem] bg-white/95 backdrop-blur-xl">
              <Header />
            </div>
            <main className="px-4 py-6 sm:px-6 xl:px-8">
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/clientes" element={<CustomersPage />} />
                <Route path="/tickets" element={<TicketsPage />} />
                <Route path="/tickets/registro" element={<TicketRegistrationPage />} />
                <Route path="/tiendas" element={<StoresPage />} />
                <Route path="/tiendas/:nombre" element={<StoreDetailPage />} />
                <Route path="/configuracion/*" element={<SettingsPage />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
