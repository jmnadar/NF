# HISTORIAL DE MODIFICACIONES - FRONTEND (changelogFront.txt)

Este documento registra cronológicamente las modificaciones realizadas sobre el frontend de Swim-CRM, incluyendo nuevos componentes, páginas, lógica de datos, estilos y configuraciones.

---

## [001] Dashboard dinámico con Recharts & KPIs computados
- **Dependencias:** Instalación de Recharts v3.8.1.
- **Componentes Creados:**
  - `charts/TicketsAreaChart.tsx`: Área chart con gradientes violeta/esmeralda y tooltips interactivos.
- **Lógica de Datos (`mock.ts`):**
  - Interfaces: `DailyMetric`, `ActivityItem`, `Notification`, `TimeRange`.
  - Generadores deterministas: `getDailyMetrics()` (90 días), `generateRecentActivity()` (5 items), `getAllCustomers()` (30 registros).
  - Funciones: `filterByRange()`, `computeStats()` (4 KPIs con tendencias).
- **Páginas Modificadas:**
  - `DashboardPage.tsx`: KPIs dinámicos desde métricas filtradas, gráfico con Recharts, feed de actividad con datos reales, saludo dinámico (`Buenos días/tardes/noches`).

## [002] Header con notificaciones y perfil dinámico
- **Componentes Modificados:**
  - `Header.tsx`: Campana de notificaciones con glow pulsante cuando hay no leídas, dropdown de notificaciones con iconos contextuales, avatar dinámico con iniciales y color por rol (admin/supervisor/agent), dropdown de perfil con enlace a configuración y cerrar sesión, cierre al hacer clic fuera.

## [003] Sidebar colapsable con versión dinámica
- **Componentes Modificados:**
  - `Sidebar.tsx`: Colapso/expansión con toggle al lado del nombre "Swimming", versión leída de `package.json`, iconos centrados en modo colapsado, tarjeta de ayuda rediseñada con icono `BookOpen`.

## [004] Sistema de diseño: sombras y scrollbar
- **Estilos (`index.css`):**
  - Variables `--shadow-elevation-1` a `--shadow-elevation-5`.
  - Utilidades `.scrollbar-thin` con estilos webkit.
- **Configuración (`App.tsx`):**
  - Sombra del contenedor principal actualizada a `shadow-elevation-1`.

## [005] Página de Clientes con búsqueda, vistas y paginación
- **Páginas Creadas/Modificadas:**
  - `CustomersPage.tsx`: Buscador por nombre/email/teléfono/ubicación, toggle vista grid/lista, paginación (9 items/página), iconos lucide-react en violeta, tarjetas sin badge de estado, tabla con columnas Cliente/Contacto/Ubicación/Tickets/Acción.
- **Normalización:** Títulos a `text-h3`, botones primarios a `rounded-lg`, todos los contenedores/cards a `rounded-lg`.

## [006] Modal de perfil de cliente con tickets y acciones
- **Componentes Creados:**
  - `CustomerModal.tsx`: Modal con overlay y cierre con Escape. Secciones: cabecera con iniciales/nombre/propietario, información de contacto (email/teléfono/ubicación), acciones rápidas (Enviar correo y WhatsApp con enlaces reales), lista de tickets filtrada por cliente con estado (badge coloreado) y tiempo restante/vencido, botón "Ver todos los tickets".

## [007] Formulario de registro de ticket adaptado a backend y DB
- **Dependencias:** Instalación de `nextjs-toast-notify` v1.61.0.
- **Componentes Creados:**
  - `CreateClientModal.tsx`: Modal de creación de cliente con 6 campos, toggle para crear ticket asociado, toasts de confirmación.
  - `CustomerDetailDrawer.tsx`: Panel lateral deslizable (framer-motion) con datos de cliente, modo edición, tabs de comunicación (Email/WhatsApp), historial de tickets.
- **Componentes Modificados:**
  - `Header.tsx`: Dropdown de notificaciones reemplazado por toasts con `nextjs-toast-notify`.
  - `CustomersPage.tsx`: Vista grid/lista con botones de acción (Editar, Nuevo Ticket), apertura de drawer al hacer clic en tarjeta, eliminación de funcionalidad de borrar/restaurar.
  - `TicketRegistrationPage.tsx` (reescritura completa):
    - **Secciones del PDF:** Datos del cliente, Datos de la compra, Tipo de solicitud (Cambio/Garantía/Retracto), Descripción, Solución deseada, Observaciones internas.
    - **Lógica condicional:** Cambio de talla muestra campos de talla actual/nueva; Cambio de referencia muestra nueva referencia.
    - **Asignación de ticket:** Vista previa del número de ticket (STK/OTK/SPTK/TKT) según rol y marca, siguiendo la lógica del backend.
    - **Canal de compra:** Controla disponibilidad de Retracto (solo e-commerce).
    - **Panel de configuración:** Rol, marca, canal de compra y agente en columna lateral.
    - **Archivos adjuntos:** Drag & drop con validación de tipo/tamaño.
    - **Datos sincronizados con DB:** Códigos reales de `dbo.motivo_contacto` (`change_size`, `change_reference`, `warranty`, `return`), 18 tallas de `dbo.tallas`, 24 ciudades colombianas de `dbo.ciudades`, tipos de comercio (`Tienda Física`=1, `Ecommerce`=2), roles (`super_admin`, `admin`, `SPTienda`, `user`), estados (`Abierto`, `En Proceso`, `Pendiente`, `Resuelto`, `Cerrado`, `Cancelado`).
- **Archivos Modificados:**
  - `src/data/mock.ts`: Limpieza total de datos mock — solo se conservan tipos (`interface`, `type`) y arreglos/objetos vacíos para no romper imports.

---

**Versión actual:** 0.2.0
**Fecha:** 26/05/2026
