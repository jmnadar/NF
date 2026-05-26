# Swim CRM — Especificación Completa del Backend

> **Documento creado para:** Agente IA constructor de backend / reporte técnico
> **Versión del CRM:** v1.8.0
> **Fecha:** 2026-05-15
> **Objetivo:** Describir con máximo detalle la arquitectura del backend, todos los controladores, rutas, servicios, middleware, utilidades, schemas de validación, templates de email y patrones de diseño para permitir su reconstrucción fiel.

---

## Tabla de Contenidos

1. [Stack Tecnológico](#1-stack-tecnológico)
2. [Arquitectura del Backend](#2-arquitectura-del-backend)
3. [Punto de Entrada (server.ts)](#3-punto-de-entrada-serverts)
4. [Configuración de Base de Datos](#4-configuración-de-base-de-datos)
5. [Middleware de Autenticación y Autorización](#5-middleware-de-autenticación-y-autorización)
6. [Middleware de Validación (Zod)](#6-middleware-de-validación-zod)
7. [Controladores Completos](#7-controladores-completos)
8. [Rutas y Endpoints](#8-rutas-y-endpoints)
9. [Servicios](#9-servicios)
10. [Utilidades](#10-utilidades)
11. [Schemas de Validación (Zod)](#11-schemas-de-validación-zod)
12. [Templates de Email](#12-templates-de-email)
13. [Manejo de Archivos](#13-manejo-de-archivos)
14. [Sistema de Notificaciones](#14-sistema-de-notificaciones)
15. [Sistema de Comunicaciones](#15-sistema-de-comunicaciones)
16. [Gestión de Usuarios](#16-gestión-de-usuarios)
17. [Seguridad y Hardening](#17-seguridad-y-hardening)
18. [Logging y Auditoría](#18-logging-y-auditoría)
19. [Rate Limiting](#19-rate-limiting)
20. [Variables de Entorno](#20-variables-de-entorno)
21. [Patrones de Diseño](#21-patrones-de-diseño)
22. [Consideraciones para Reconstrucción](#22-consideraciones-para-reconstrucción)

---

## 1. Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| **Node.js** | 20.x (Docker: node:20-slim) | Runtime del servidor |
| **Express** | 4.x | Framework web HTTP |
| **TypeScript** | 5.x | Tipado estático |
| **mssql (tedious)** | Latest | Driver de conexión a SQL Server |
| **bcrypt** | Latest | Hash de contraseñas (12 salt rounds) |
| **jsonwebtoken** | Latest | Generación y verificación de JWT |
| **Zod** | Latest | Validación de esquemas de request |
| **Helmet** | Latest | Cabeceras de seguridad HTTP |
| **CORS** | Latest | Control de orígenes cruzados |
| **cookie-parser** | Latest | Parseo de cookies HTTP |
| **express-rate-limit** | Latest | Rate limiting por endpoint |
| **Morgan** | Latest | Logging de peticiones HTTP |
| **Winston** | Latest | Logging estructurado con rotación |
| **winston-daily-rotate-file** | Latest | Rotación diaria de logs |
| **dotenv** | Latest | Variables de entorno |
| **multer** | Latest | Manejo de uploads de archivos |
| **nodemailer** | Latest | Envío de correos vía SMTP |
| **uuid** | Latest | Generación de UUIDs |

---

## 2. Arquitectura del Backend

### Estructura de Directorios

```
backend/
├── database/
│   ├── swimming_all_db.sql              # Script master (crear DB completa)
│   ├── 003_add_sptienda_rls_rules.sql   # Migración RLS avanzada para SPTienda
│   └── migrations/
│       ├── 001_add_numero_pedido_to_pedidos_guia.sql
│       └── 002_add_user_id_to_notificaciones.sql
├── src/
│   ├── config/
│   │   └── db.ts                        # Configuración de conexión SQL Server + RLS
│   ├── controllers/                     # 12 controladores
│   │   ├── auth.controller.ts           # Login, registro, reset password
│   │   ├── comms.controller.ts          # Configuración de comunicaciones
│   │   ├── customers.controller.ts      # CRUD de clientes
│   │   ├── email.controller.ts          # Envío de emails (legacy)
│   │   ├── files.controller.ts          # Upload/download de archivos
│   │   ├── guias.controller.ts          # Gestión de guías de envío
│   │   ├── marcas.controller.ts         # Gestión de marcas
│   │   ├── notifications.controller.ts  # Notificaciones internas
│   │   ├── pedidos.controller.ts        # Gestión de pedidos
│   │   ├── tickets.controller.ts        # CRUD de tickets + dashboard stats
│   │   ├── tiendas.controller.ts        # CRUD de tiendas
│   │   └── user.controller.ts           # Gestión de usuarios, roles, permisos
│   ├── middleware/
│   │   ├── auth.ts                      # authenticate + authorize
│   │   └── validate.ts                  # Validación con Zod
│   ├── routes/                          # 11 archivos de rutas
│   │   ├── auth.routes.ts
│   │   ├── comms.routes.ts
│   │   ├── customers.routes.ts
│   │   ├── files.routes.ts
│   │   ├── guias.routes.ts
│   │   ├── marcas.routes.ts
│   │   ├── notifications.routes.ts
│   │   ├── pedidos.routes.ts
│   │   ├── tickets.routes.ts
│   │   ├── tiendas.routes.ts
│   │   └── user.routes.ts
│   ├── schemas/
│   │   ├── auth.schema.ts               # Schemas Zod de auth
│   │   └── ticket.schema.ts             # Schemas Zod de tickets
│   ├── services/
│   │   ├── email.service.ts             # Servicio de email (SMTP + Resend)
│   │   └── notification.service.ts      # Servicio de notificaciones
│   ├── templates/                       # 5 templates HTML de emails
│   │   ├── invitation.html
│   │   ├── password-reset.html
│   │   ├── registration-confirmation.html
│   │   ├── guia-notification.html
│   │   └── ticket-assigned.html
│   ├── utils/
│   │   ├── jwt.ts                       # Generación/verificación de JWT
│   │   ├── audit.ts                     # Logging de auditoría
│   │   └── logger.ts                    # Config de Winston
│   ├── check_db.ts                      # Script de verificación de DB
│   └── server.ts                        # Punto de entrada (Express app)
├── uploads/                             # Almacenamiento local de archivos
├── logs/                                # Logs de Winston (rotación diaria)
├── Dockerfile
├── .env
└── package.json
```

### Patrón de Diseño

- **Controller-Route-Separation**: Cada dominio tiene su controlador y archivo de rutas
- **RLS Context Pattern**: TODAS las queries pasan por `executeWithRLS()` que establece `SESSION_CONTEXT` antes de ejecutar
- **Transaction-based RLS**: Las operaciones complejas usan transacciones para mantener el contexto RLS
- **OUTPUT clause**: Los INSERT/UPDATE usan `OUTPUT INSERTED.*` para retornar datos creados sin queries adicionales
- **Lazy Import**: Servicios se importan dinámicamente cuando se necesitan (ej: `NotificationService`)
- **Dynamic SQL Building**: Queries se construyen dinámicamente con filtros opcionales

---

## 3. Punto de Entrada (server.ts)

### Configuración Express

```typescript
const app = express();
const PORT = process.env.PORT || 3000;
```

### Middlewares Globales (en orden)

| Orden | Middleware | Propósito |
|---|---|---|
| 1 | `morgan('combined', { stream: logger })` | Logging de peticiones HTTP (CAL-01) |
| 2 | `helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } })` | Cabeceras de seguridad HTTP (SEC-04) |
| 3 | `cors({ origin: allowedOrigins, credentials: true })` | Control de orígenes cruzados (SEC-01) |
| 4 | `cookieParser()` | Parseo de cookies |
| 5 | `express.json()` | Parseo de JSON bodies |

### Rate Limiting

| Endpoint | Window | Max Requests | Propósito |
|---|---|---|---|
| `/api/auth/login` | 15 min | 20 (prod) / 0 (dev) | Prevenir fuerza bruta |
| `/api/auth/register` | 15 min | 20 (prod) / 0 (dev) | Prevenir spam de registros |
| `/api/auth/forgot-password` | 15 min | 20 (prod) / 0 (dev) | Prevenir spam de resets |
| `/api/*` (general) | 15 min | 500 (prod) / 0 (dev) | Rate limit general |

### Rutas Registradas

```typescript
// Nivel superior
app.get('/api/roles', authenticate, getRoles);
app.get('/api/permissions', authenticate, getPermissions);
app.get('/api/users', authenticate, getUsers);

// Montadas por módulo
app.use('/api/auth',           authRoutes);
app.use('/api/customers',      customersRoutes);
app.use('/api/tickets',        ticketsRoutes);
app.use('/api/tiendas',        tiendasRoutes);
app.use('/api/guias',          guiasRoutes);
app.use('/api/marcas',         marcasRoutes);
app.use('/api/pedidos',        pedidosRoutes);
app.use('/api/files',          filesRoutes);
app.use('/api/notifications',  notificationsRoutes);
app.use('/api/users',          userRoutes);
app.use('/api/comms',          commsRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
```

### Error Handler Global (SEC-07)

```typescript
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  const message = process.env.NODE_ENV === 'production' 
    ? 'Error interno del servidor.' 
    : err.message || 'Error interno del servidor.';
  res.status(err.status || 500).json({ 
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});
```

### Manejo de Promesas No Capturadas

```typescript
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection at:', reason);
});
```

### SEC-03: Acceso a Archivos

- **Removido** el acceso estático público a `/uploads`
- Los archivos se sirven mediante el endpoint protegido `/api/files/download/:filename`

---

## 4. Configuración de Base de Datos

### Conexión (db.ts)

```typescript
const dbConfig: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',          // SEC-02
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
  },
};

const poolPromise = new sql.ConnectionPool(dbConfig).connect();
```

### Función `setRLSContext(request, userId, userRole, tiendaId)`

Establece el contexto de seguridad en un request existente:

```typescript
request.input('RLS_UserId', sql.UniqueIdentifier, userId);
request.input('RLS_UserRole', sql.NVarChar(100), userRole);
request.input('RLS_TiendaId', sql.UniqueIdentifier, tiendaId);

await request.query(`
  EXEC sp_set_session_context @key = N'UserId', @value = @RLS_UserId;
  EXEC sp_set_session_context @key = N'UserRole', @value = @RLS_UserRole;
  EXEC sp_set_session_context @key = N'TiendaId', @value = @RLS_TiendaId;
`);
```

### Función `executeWithRLS(userId, role, queryOrAction, params, tiendaId)`

**Patrón 1: Query simple (batch)**

```typescript
const request = pool.request();
params.forEach(p => request.input(p.name, p.type, p.value));
request.input('RLS_UserId', sql.UniqueIdentifier, userId);
request.input('RLS_UserRole', sql.NVarChar(100), role);
request.input('RLS_TiendaId', sql.UniqueIdentifier, tiendaId);

const batch = `
  EXEC sp_set_session_context @key = N'UserId', @value = @RLS_UserId;
  EXEC sp_set_session_context @key = N'UserRole', @value = @RLS_UserRole;
  EXEC sp_set_session_context @key = N'TiendaId', @value = @RLS_TiendaId;
  ${queryOrAction}
`;
return request.query(batch);
```

**Patrón 2: Función callback (transacción)**

```typescript
const transaction = new sql.Transaction(pool);
await transaction.begin();
try {
  const request = transaction.request();
  // Set context
  request.input('RLS_UserId', sql.UniqueIdentifier, userId);
  request.input('RLS_UserRole', sql.NVarChar(100), role);
  request.input('RLS_TiendaId', sql.UniqueIdentifier, tiendaId);
  await request.query(`EXEC sp_set_session_context...`);
  
  const result = await queryOrAction(request, transaction);
  await transaction.commit();
  return result;
} catch (err) {
  await transaction.rollback();
  throw err;
}
```

---

## 5. Middleware de Autenticación y Autorización

### `authenticate`

```typescript
export const authenticate = (req, res, next): void => {
  // 1. Buscar token en cookies (SEC-05)
  let token = req.cookies?.token;

  // 2. Si no existe, buscar en Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  // 3. Si no hay token → 401
  if (!token) {
    res.status(401).json({ error: 'Acceso no autorizado. Token requerido.' });
    return;
  }

  // 4. Verificar token
  try {
    const decoded = verifyToken(token);
    req.user = decoded;  // { userId, email, role, roleId }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};
```

### `authorize(...allowedRoles)`

```typescript
export const authorize = (...allowedRoles: string[]) => {
  return (req, res, next): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Acceso no autorizado.' });
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Acceso denegado. No tienes permisos suficientes.' });
      return;
    }
    next();
  };
};
```

### Tipos de Request

```typescript
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;  // { userId, email, role, roleId }
}

export interface FileRequest extends AuthenticatedRequest {
  file?: any;  // Multer file
}
```

---

## 6. Middleware de Validación (Zod)

### `validate(schema)`

```typescript
export const validate = (schema: ZodSchema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: 'Error de validación',
          details: err.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      return res.status(500).json({ error: 'Error interno durante la validación' });
    }
  };
};
```

### Uso en Rutas

```typescript
router.post('/', validate(createTicketSchema), createTicket);
router.put('/:id', validate(updateTicketSchema), updateTicket);
router.post('/login', validate(loginSchema), login);
router.post('/register', validate(registerSchema), register);
```

---

## 7. Controladores Completos

### 7.1 auth.controller.ts

| Función | Método | Ruta | Descripción |
|---|---|---|---|
| `register` | POST | `/api/auth/register` | Registro de usuario (primero = super_admin) |
| `login` | POST | `/api/auth/login` | Login → cookie HttpOnly con JWT |
| `logout` | POST | `/api/auth/logout` | Logout → limpia cookie |
| `getMe` | GET | `/api/auth/me` | Perfil del usuario actual |
| `getFirstUser` | GET | `/api/auth/first-user` | Verifica si es el primer usuario |
| `forgotPassword` | POST | `/api/auth/forgot-password` | Solicita reset de contraseña |
| `resetPassword` | POST | `/api/auth/reset-password` | Establece nueva contraseña con token |

**`register` - Flujo Completo:**
1. Verificar existencia de email (bypass RLS con `super_admin` context)
2. Si `total_users === 0` → rol = `super_admin`, sino → rol = `user`
3. Hash de contraseña con bcrypt (12 rounds)
4. Insertar perfil con `SESSION_CONTEXT` en el mismo batch
5. Generar JWT → `res.cookie('token', jwt, { httpOnly: true, secure, sameSite: 'lax', maxAge: 24h })`
6. Log de auditoría
7. Enviar email de confirmación

**`login` - Flujo Completo:**
1. Buscar usuario por email
2. Verificar bloqueo (`lockout_until`)
3. `bcrypt.compare(password, password_hash)`
4. Si inválido → incrementar `failed_attempts`, bloquear si >= 3 (15 min)
5. Si válido → reset intentos, actualizar `last_login`, activar tienda si aplica
6. Generar JWT → cookie HttpOnly
7. Log de auditoría

**Bloqueo de Cuenta:**
- 3 intentos fallidos → `lockout_until = now + 15 min`
- Mensaje: "Has superado el límite de intentos. Cuenta bloqueada por 15 minutos."

---

### 7.2 tickets.controller.ts

| Función | Método | Ruta | Descripción |
|---|---|---|---|
| `getNextTicketNumber` | GET | `/api/tickets/next-number` | Previsualizar próximo número sin consumir secuencia |
| `getTickets` | GET | `/api/tickets` | Listar tickets con filtros y paginación |
| `getTicketById` | GET | `/api/tickets/:id` | Detalle de ticket + soluciones |
| `createTicket` | POST | `/api/tickets` | Crear ticket |
| `updateTicket` | PUT | `/api/tickets/:id` | Actualizar ticket |
| `deleteTicket` | DELETE | `/api/tickets/:id` | Eliminar ticket (admin/super_admin) |
| `addSolucion` | POST | `/api/tickets/:id/soluciones` | Agregar solución a ticket |
| `getTicketLookups` | GET | `/api/tickets/lookups` | Lookups (marcas, motivos, estados, tallas, ciudades, tipos_comercio) |
| `getDashboardStats` | GET | `/api/tickets/dashboard/stats` | Stats del dashboard |

**`getTickets` - Filtros Soportados:**
- `q`: Búsqueda libre (ticket_numero, nombre, apellido, cédula)
- `estado`: Filtrar por estado (id_estado_casos)
- `marca`: Filtrar por marca (id_marcas)
- `motivo`: Filtrar por motivo (id_motivo_caso)
- `startDate`: Fecha inicio
- `endDate`: Fecha fin
- `nearExpiry=true`: Tickets próximos a vencer (5 días, no cerrados)
- `page`: Paginación (default: 1)
- `limit`: Por página (default: 50)

**`getNextTicketNumber` - Lógica:**
- Si rol = `SPTienda` → `SPTK-{next}`
- Si marca = `speedo` → `STK-{next}`
- Si marca = `o'neill` → `OTK-{next}`
- Otro → `TKT-{next}`
- Usa `CURRENT VALUE FOR + 1` (no consume secuencia)

**`createTicket` - Flujo:**
1. Determinar prefijo según rol/marca
2. Consumir secuencia (`NEXT VALUE FOR`)
3. INSERT con `OUTPUT INSERTED.*`
4. Notificar agente asignado (lazy import NotificationService)

**`TICKET_BASE_SELECT` - JOINs:**
```sql
FROM dbo.tickets t
LEFT JOIN dbo.customers c ON t.id_cliente = c.id_cliente
LEFT JOIN dbo.marcas m ON t.id_marcas = m.id_marcas
LEFT JOIN dbo.motivo_contacto mc ON t.id_motivo_caso = mc.id_motivo_caso
LEFT JOIN dbo.sub_motivos sm ON t.id_sub_motivo = sm.id_sub_motivo
LEFT JOIN dbo.estados_casos ec ON t.id_estado_caso = ec.id_estado_casos
LEFT JOIN dbo.tallas ta ON t.id_talla_actual = ta.id_talla
LEFT JOIN dbo.tallas tn ON t.id_nueva_talla = tn.id_talla
LEFT JOIN dbo.profiles p ON t.id_usuario = p.id
LEFT JOIN dbo.profiles pc ON t.created_by = pc.id
```

**`getDashboardStats` - Rango de Tiempo:**
- `hoy`: Desde inicio del día
- `semana`: Últimos 7 días
- `mes`: Desde inicio del mes
- `año`: Desde inicio del año
- `todo`: Sin filtro

**Stats retornados:**
- `customers`: Count de clientes únicos
- `openTickets`: Tickets no cerrados/cancelados
- `closedTickets`: Tickets cerrados
- `nearExpiry`: Tickets próximos a vencer (5 días)
- `commonRes`: Motivos más frecuentes (agrupados)
- `avgTimeRes`: Tickets cerrados con fechas (para cálculo de tiempo promedio)
- `chartRes`: Últimos 100 tickets ordenados por fecha

---

### 7.3 customers.controller.ts

| Función | Método | Ruta | Descripción |
|---|---|---|---|
| `getCustomers` | GET | `/api/customers` | Listar clientes con filtros y paginación |
| `getCustomerById` | GET | `/api/customers/:id` | Detalle de cliente |
| `createCustomer` | POST | `/api/customers` | Crear cliente |
| `updateCustomer` | PUT | `/api/customers/:id` | Actualizar cliente |
| `deleteCustomer` | DELETE | `/api/customers/:id` | Soft-delete (deleted_at) |
| `restoreCustomer` | PUT | `/api/customers/:id/restore` | Restaurar cliente |
| `getCustomerTickets` | GET | `/api/customers/:id/tickets` | Tickets de un cliente |

**`getCustomers` - Filtros:**
- `q`: Búsqueda (nombre, apellido, cédula, email)
- `storeType`: Filtrar por tipo de comercio (`all`, `none`, o id)
- `includeDeleted`: `true` incluye clientes dados de baja
- `page`, `limit`: Paginación

**`BASE_SELECT` - JOINs:**
```sql
FROM dbo.customers c
LEFT JOIN dbo.ciudades ci ON c.id_ciudad = ci.id_ciudad
LEFT JOIN dbo.profiles pc ON c.created_by = pc.id
LEFT JOIN dbo.tiendas tc ON pc.tienda_id = tc.id
LEFT JOIN dbo.tipos_comercio tcom ON c.id_tipo_comercio = tcom.id_tipo_comercio
```
- Incluye subquery: `(SELECT COUNT(*) FROM dbo.tickets t WHERE t.id_cliente = c.id_cliente) AS ticket_count`

**Soft Delete:**
- `deleted_at = SYSDATETIMEOFFSET()` (no DELETE físico)
- Queries excluyen `deleted_at IS NOT NULL` por defecto
- Restaurar: `deleted_at = NULL`

**`createCustomer` - Detección de duplicados:**
- Si `err.number === 2627 || err.number === 2601` → 409 "Ya existe un cliente con esa cédula"

---

### 7.4 tiendas.controller.ts

| Función | Método | Ruta | Descripción |
|---|---|---|---|
| `getTiendas` | GET | `/api/tiendas` | Listar tiendas |
| `createTienda` | POST | `/api/tiendas` | Crear tienda |
| `updateTienda` | PUT | `/api/tiendas/:id` | Actualizar tienda |

**`getTiendas` - JOINs:**
```sql
SELECT t.*, m.nombre_marca as marca_nombre, tcom.nombre_tipo as nombre_tipo_comercio
FROM dbo.tiendas t
LEFT JOIN dbo.marcas m ON t.id_marcas = m.id_marcas
LEFT JOIN dbo.tipos_comercio tcom ON t.id_tipo_comercio = tcom.id_tipo_comercio
ORDER BY t.created_at DESC
```

---

### 7.5 guias.controller.ts

| Función | Método | Ruta | Descripción |
|---|---|---|---|
| `getGuiasByTienda` | GET | `/api/guias/tienda/:tiendaId` | Guías de una tienda con pedidos |
| `createGuia` | POST | `/api/guias` | Crear guía con pedidos + notificar |
| `updateGuiaStatus` | PUT | `/api/guias/:id/status` | Actualizar estado de guía + pedidos |
| `updatePedidoStatus` | PUT | `/api/guias/pedido/:id` | Actualizar estado de pedido individual |
| `deleteGuia` | DELETE | `/api/guias/:id` | Eliminar guía |

**`getGuiasByTienda` - Flujo:**
1. Obtener guías de la tienda
2. Para cada guía, obtener sus pedidos (nested query)
3. Mapear `created_at` → `fecha_creacion` para compatibilidad frontend

**`createGuia` - Flujo:**
1. Obtener datos de la tienda
2. INSERT guía con `OUTPUT INSERTED.*`
3. INSERT pedidos asociados (loop)
4. Notificar vía `NotificationService.notifyNuevaGuia()`

**`updateGuiaStatus` - Estados:**
- `recibido` → Set `fecha_recibido = SYSDATETIMEOFFSET()`
- `completo` → Set `fecha_completado = SYSDATETIMEOFFSET()`
- Si `pedidos_estados` viene → actualizar cada pedido
- Si pedido → `entregado` → crear notificación `paquete_entregado`

---

### 7.6 pedidos.controller.ts

| Función | Método | Ruta | Descripción |
|---|---|---|---|
| `createPedido` | POST | `/api/pedidos` | Crear pedido individual |

**Validación:** `guia_id` y `numero_pedido` son requeridos

---

### 7.7 marcas.controller.ts

| Función | Método | Ruta | Descripción |
|---|---|---|---|
| `getMarcas` | GET | `/api/marcas` | Listar marcas |

---

### 7.8 notifications.controller.ts

| Función | Método | Ruta | Descripción |
|---|---|---|---|
| `getUnreadNotifications` | GET | `/api/notifications/unread` | Top 20 notificaciones no leídas |
| `markAsRead` | PUT | `/api/notifications/:id/read` | Marcar como leída |
| `markAllAsRead` | PUT | `/api/notifications/read-all` | Marcar todas como leídas |
| `createNotification` | POST | `/api/notifications` | Crear notificación |
| `notifyGuia` | POST | `/api/notifications/guia` | Notificar guía (legacy) |
| `sendEmail` | POST | `/api/notifications/email` | Enviar email (legacy) |

---

### 7.9 user.controller.ts

| Función | Método | Ruta | Descripción |
|---|---|---|---|
| `inviteUser` | POST | `/api/users/invite` | Invitar usuario (admin) |
| `deleteUser` | DELETE | `/api/users/:userId` | Eliminar usuario (admin) |
| `getRoles` | GET | `/api/users/roles` | Listar roles |
| `getPermissions` | GET | `/api/users/permissions` | Listar permisos |
| `getUsers` | GET | `/api/users` | Listar usuarios |
| `getUserPermissions` | GET | `/api/users/:userId/permissions` | Permisos de usuario |
| `updateUserPermissions` | PUT | `/api/users/:userId/permissions` | Actualizar permisos |
| `updateUserRole` | PUT | `/api/users/:userId/role` | Cambiar rol |
| `updateUserProfile` | PUT | `/api/users/:userId/profile` | Actualizar perfil |
| `updateUserPassword` | PUT | `/api/users/:userId/password` | Cambiar contraseña |

**`inviteUser` - Flujo Completo:**
1. Verificar email no existe
2. Verificar rol existe
3. Si rol = `SPTienda` → validar `storeName` requerido
4. Generar `userId`, `tempPassword` (UUID), hash
5. **Transacción:**
   - INSERT perfil (tienda_id = NULL temporalmente)
   - Si SPTienda: INSERT tienda → obtener storeId → UPDATE perfil con tienda_id
   - INSERT permisos personalizados (si vienen)
6. Commit transacción
7. Generar token de invitación (24h)
8. Enviar email de invitación
9. Log de auditoría

**`deleteUser` - Flujo Completo (10 pasos en transacción):**
1. Si SPTienda → desvincular perfiles de tienda → DELETE tienda
2. Desvincular tiendas (admin_id, created_by = NULL)
3. Desvincular guías (created_by = NULL)
4. Desvincular tickets (id_usuario = NULL)
5. Desvincular soluciones (id_usuario = NULL)
6. Desvincular clientes (created_by = NULL)
7. DELETE permisos del usuario
8. Anonimizar audit_log (user_id = NULL)
9. DELETE rate limits
10. DELETE perfil

**Validación:** No puedes eliminarte a ti mismo

---

### 7.10 comms.controller.ts

| Función | Método | Ruta | Auth | Descripción |
|---|---|---|---|---|
| `getMarcasComms` | GET | `/api/comms/marcas` | Auth | Marcas con datos de contacto |
| `updateMarcaComms` | PUT | `/api/comms/marcas/:id` | super_admin | Actualizar datos de contacto |
| `getTemplates` | GET | `/api/comms/templates` | Auth | Templates (filtros: id_marca, tipo) |
| `createTemplate` | POST | `/api/comms/templates` | super_admin | Crear template |
| `updateTemplate` | PUT | `/api/comms/templates/:id` | super_admin | Actualizar template |
| `deleteTemplate` | DELETE | `/api/comms/templates/:id` | super_admin | Eliminar template |
| `sendEmailComm` | POST | `/api/comms/send-email` | Auth | Enviar email |
| `getEnvSettings` | GET | `/api/comms/settings` | super_admin | Leer configuraciones .env |
| `updateEnvSettings` | PUT | `/api/comms/settings` | super_admin | Actualizar .env en runtime |

**`getTemplates` - Filtros:**
- `id_marca`: Filtrar por marca (incluye templates globales con `id_marca IS NULL`)
- `tipo`: Filtrar por canal (`email` o `whatsapp`)

**`updateEnvSettings` - Keys Permitidas:**
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- Actualiza `process.env` en runtime después de escribir el archivo

---

### 7.11 files.controller.ts

| Función | Método | Ruta | Descripción |
|---|---|---|---|
| `uploadFile` | POST | `/api/files/upload` | Subir archivo de ticket |
| `uploadEvidence` | POST | `/api/files/evidence` | Subir evidencia de entrega |
| `getTicketFiles` | GET | `/api/files/ticket/:ticketId` | Archivos de un ticket |
| `downloadFile` | GET | `/api/files/download/:filename` | Descarga segura (con RLS) |
| `deleteFile` | DELETE | `/api/files/:id` | Eliminar archivo |

**Configuración de Multer:**
- **Storage:** `diskStorage` en `uploads/` directory
- **Filename:** `{timestamp}_{uuid}.{ext}`
- **Allowed MIME Types:** `image/jpeg`, `image/png`, `image/webp`, `application/pdf`
- **Max File Size:** 10 MB

**`downloadFile` - Seguridad (SEC-03):**
1. Verificar archivo existe en `ticket_archivos` o `pedido_evidencias` vía RLS
2. Si no existe → 404 "Archivo no encontrado o acceso denegado"
3. Si existe → `res.download(filePath, originalName)`

---

### 7.12 email.controller.ts (Legacy)

| Función | Método | Ruta | Descripción |
|---|---|---|---|
| `sendEmail` | POST | `/api/notifications/email` | Enviar email con auditoría |

*Nota: Este controlador es legacy. El envío de emails se maneja ahora en `comms.controller.ts` y `notification.service.ts`*

---

## 8. Rutas y Endpoints

### 8.1 auth.routes.ts

| Método | Ruta | Middleware | Handler |
|---|---|---|---|
| GET | `/api/auth/first-user` | — | `getFirstUser` |
| POST | `/api/auth/register` | `validate(registerSchema)` | `register` |
| POST | `/api/auth/login` | `validate(loginSchema)` | `login` |
| POST | `/api/auth/logout` | — | `logout` |
| GET | `/api/auth/me` | `authenticate` | `getMe` |
| POST | `/api/auth/forgot-password` | `validate(forgotPasswordSchema)` | `forgotPassword` |
| POST | `/api/auth/reset-password` | `validate(resetPasswordSchema)` | `resetPassword` |

### 8.2 tickets.routes.ts

| Método | Ruta | Middleware | Handler |
|---|---|---|---|
| GET | `/api/tickets/lookups` | `authenticate` | `getTicketLookups` |
| GET | `/api/tickets/dashboard/stats` | `authenticate` | `getDashboardStats` |
| GET | `/api/tickets/next-number` | `authenticate` | `getNextTicketNumber` |
| GET | `/api/tickets` | `authenticate` | `getTickets` |
| GET | `/api/tickets/:id` | `authenticate` | `getTicketById` |
| POST | `/api/tickets` | `authenticate` + `validate(createTicketSchema)` | `createTicket` |
| PUT | `/api/tickets/:id` | `authenticate` + `validate(updateTicketSchema)` | `updateTicket` |
| DELETE | `/api/tickets/:id` | `authenticate` | `deleteTicket` |
| POST | `/api/tickets/:id/soluciones` | `authenticate` | `addSolucion` |

### 8.3 customers.routes.ts

| Método | Ruta | Middleware | Handler |
|---|---|---|---|
| GET | `/api/customers` | `authenticate` | `getCustomers` |
| GET | `/api/customers/:id` | `authenticate` | `getCustomerById` |
| POST | `/api/customers` | `authenticate` | `createCustomer` |
| PUT | `/api/customers/:id` | `authenticate` | `updateCustomer` |
| DELETE | `/api/customers/:id` | `authenticate` | `deleteCustomer` |
| PUT | `/api/customers/:id/restore` | `authenticate` | `restoreCustomer` |
| GET | `/api/customers/:id/tickets` | `authenticate` | `getCustomerTickets` |

### 8.4 user.routes.ts

| Método | Ruta | Middleware | Handler |
|---|---|---|---|
| GET | `/api/users/roles` | `authenticate` | `getRoles` |
| GET | `/api/users/permissions` | `authenticate` | `getPermissions` |
| PUT | `/api/users/:userId/profile` | `authenticate` | `updateUserProfile` |
| PUT | `/api/users/:userId/password` | `authenticate` | `updateUserPassword` |
| GET | `/api/users` | `authenticate` | `getUsers` |
| POST | `/api/users/invite` | `authenticate` + `authorize('super_admin', 'admin')` | `inviteUser` |
| GET | `/api/users/:userId/permissions` | `authenticate` + `authorize('super_admin', 'admin')` | `getUserPermissions` |
| PUT | `/api/users/:userId/permissions` | `authenticate` + `authorize('super_admin', 'admin')` | `updateUserPermissions` |
| PUT | `/api/users/:userId/role` | `authenticate` + `authorize('super_admin', 'admin')` | `updateUserRole` |
| DELETE | `/api/users/:userId` | `authenticate` + `authorize('super_admin', 'admin')` | `deleteUser` |

### 8.5 comms.routes.ts

| Método | Ruta | Middleware | Handler |
|---|---|---|---|
| GET | `/api/comms/marcas` | `authenticate` | `getMarcasComms` |
| PUT | `/api/comms/marcas/:id` | `authenticate` + `authorize('super_admin')` | `updateMarcaComms` |
| GET | `/api/comms/templates` | `authenticate` | `getTemplates` |
| POST | `/api/comms/templates` | `authenticate` + `authorize('super_admin')` | `createTemplate` |
| PUT | `/api/comms/templates/:id` | `authenticate` + `authorize('super_admin')` | `updateTemplate` |
| DELETE | `/api/comms/templates/:id` | `authenticate` + `authorize('super_admin')` | `deleteTemplate` |
| POST | `/api/comms/send-email` | `authenticate` | `sendEmailComm` |
| GET | `/api/comms/settings` | `authenticate` + `authorize('super_admin')` | `getEnvSettings` |
| PUT | `/api/comms/settings` | `authenticate` + `authorize('super_admin')` | `updateEnvSettings` |

### 8.6 notifications.routes.ts

| Método | Ruta | Middleware | Handler |
|---|---|---|---|
| GET | `/api/notifications/unread` | `authenticate` | `getUnreadNotifications` |
| PUT | `/api/notifications/read-all` | `authenticate` | `markAllAsRead` |
| PUT | `/api/notifications/:id/read` | `authenticate` | `markAsRead` |
| POST | `/api/notifications` | `authenticate` | `createNotification` |
| POST | `/api/notifications/guia` | `authenticate` | `notifyGuia` |
| POST | `/api/notifications/email` | `authenticate` | `sendEmail` |

### 8.7 files.routes.ts

| Método | Ruta | Middleware | Handler |
|---|---|---|---|
| POST | `/api/files/upload` | `authenticate` + `uploadMiddleware` | `uploadFile` |
| POST | `/api/files/evidence` | `authenticate` + `uploadMiddleware` | `uploadEvidence` |
| GET | `/api/files/ticket/:ticketId` | `authenticate` | `getTicketFiles` |
| GET | `/api/files/download/:filename` | `authenticate` | `downloadFile` |
| DELETE | `/api/files/:id` | `authenticate` | `deleteFile` |

### 8.8 tiendas.routes.ts

| Método | Ruta | Middleware | Handler |
|---|---|---|---|
| GET | `/api/tiendas` | `authenticate` | `getTiendas` |
| POST | `/api/tiendas` | `authenticate` | `createTienda` |
| PUT | `/api/tiendas/:id` | `authenticate` | `updateTienda` |

### 8.9 guias.routes.ts

| Método | Ruta | Middleware | Handler |
|---|---|---|---|
| GET | `/api/guias/tienda/:tiendaId` | `authenticate` | `getGuiasByTienda` |
| POST | `/api/guias` | `authenticate` | `createGuia` |
| PUT | `/api/guias/pedido/:id` | `authenticate` | `updatePedidoStatus` |
| PUT | `/api/guias/:id/status` | `authenticate` | `updateGuiaStatus` |

### 8.10 marcas.routes.ts

| Método | Ruta | Middleware | Handler |
|---|---|---|---|
| GET | `/api/marcas` | `authenticate` | `getMarcas` |

### 8.11 pedidos.routes.ts

| Método | Ruta | Middleware | Handler |
|---|---|---|---|
| POST | `/api/pedidos` | `authenticate` | `createPedido` |

---

## 9. Servicios

### 9.1 EmailService (email.service.ts)

**Configuración:**
```typescript
private static transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true' || port === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});
```

**Prioridad de Proveedores:**
1. **SMTP** (si `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` están configurados)
2. **Resend API** (si `RESEND_API_KEY` está configurado)
3. **Sin proveedor** → retorna `{ success: false, error: 'No email provider configured' }`

**Métodos:**

| Método | Parámetros | Descripción |
|---|---|---|
| `sendEmail({ to, subject, html })` | EmailPayload | Envía email vía SMTP o Resend |
| `getInvitationHtml(name, url)` | string, string | Template de invitación |
| `getPasswordResetHtml(name, url)` | string, string | Template de reset password |
| `getGuiaNotificationHtml(storeName, guiaNumber, pedidosCount, pedidosList)` | 4 strings | Template de guía de envío |
| `getTicketAssignedHtml(data)` | AgentData | Template de ticket asignado |
| `getRegistrationConfirmationHtml(name, email)` | string, string | Template de confirmación de registro |

**Sistema de Templates:**
- Directorio: `src/templates/`
- Reemplazo de placeholders: `{{key}}` → valor
- Templates disponibles: `invitation.html`, `password-reset.html`, `registration-confirmation.html`, `guia-notification.html`, `ticket-assigned.html`

---

### 9.2 NotificationService (notification.service.ts)

**Métodos:**

| Método | Parámetros | Descripción |
|---|---|---|
| `notify({ userId, tipo, titulo, mensaje, metadata, rolesDestino, sendEmail, emailSubject, emailHtml })` | NotificationConfig | Crea notificación + envía email opcional |
| `notifyNuevaGuia(tiendaId, guiaId, numeroGuia, pedidos)` | 4 params | Notifica nueva guía a tienda + admins |
| `notifyTicketAssigned(ticketId, userId, ticketInfo)` | 3 params | Notifica ticket asignado a agente |

**`notify` - Flujo:**
1. INSERT notificación en BD (bypass RLS con `admin` context)
2. Si `sendEmail = true`:
   - Obtener email del usuario (si `userId` proporcionado)
   - Enviar email vía `EmailService.sendEmail()`
3. Errores no bloquean el flujo principal (try/catch silencioso)

**`notifyNuevaGuia` - Destinatarios:**
- Admin de la tienda (notificación + email)
- Super admins y admins (notificación solo)

**`notifyTicketAssigned` - Destinatarios:**
- Agente asignado (notificación + email)
- Admins y SPTienda (notificación solo)

---

## 10. Utilidades

### 10.1 JWT (jwt.ts)

```typescript
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  roleId: string;
}

export const generateToken = (payload: any, expiresIn: string = JWT_EXPIRES_IN): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
```

**Validación:** Si `JWT_SECRET` no está definido → `throw new Error('FATAL ERROR')`

---

### 10.2 Audit (audit.ts)

```typescript
export const logAudit = async (userId, userRole, action, details, ipAddress?, userAgent?): Promise<void> => {
  await executeWithRLS(userId, userRole, async (request) => {
    await request
      .input('user_id', sql.UniqueIdentifier, userId)
      .input('action', sql.NVarChar, action)
      .input('details', sql.NVarChar, JSON.stringify(details))
      .input('ip_address', sql.NVarChar, ipAddress)
      .input('user_agent', sql.NVarChar, userAgent)
      .query(`INSERT INTO dbo.audit_log (user_id, action, details, ip_address, user_agent) VALUES (...)`);
  });
};
```

**Nota:** Errores de auditoría no bloquean el flujo principal (try/catch silencioso)

---

### 10.3 Logger (logger.ts)

**Configuración Winston:**

| Transport | Nivel | Archivo | Retención |
|---|---|---|---|
| DailyRotateFile | `error` | `logs/error-YYYY-MM-DD.log` | 30 días |
| DailyRotateFile | `debug` (dev) / `info` (prod) | `logs/combined-YYYY-MM-DD.log` | 30 días |
| Console | `debug` | stdout | Solo en desarrollo |

**Formato:**
- Timestamp: `YYYY-MM-DD HH:mm:ss`
- JSON para archivos
- Colorizado para consola
- Stack traces incluidos

---

## 11. Schemas de Validación (Zod)

### 11.1 auth.schema.ts

```typescript
export const loginSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'El email es requerido').email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'El email es requerido').email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    full_name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').optional(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'El email es requerido').email('Email inválido'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'El token es requerido'),
    newPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  }),
});
```

### 11.2 ticket.schema.ts

```typescript
export const createTicketSchema = z.object({
  body: z.object({
    cliente_id: z.string().uuid('ID de cliente inválido'),
    asunto: z.string().min(5, 'El asunto debe tener al menos 5 caracteres'),
    descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    prioridad: z.enum(['Baja', 'Media', 'Alta', 'Urgente']).optional(),
    categoria: z.string().optional(),
  }),
});

export const updateTicketSchema = z.object({
  body: z.object({
    asunto: z.string().min(5).optional(),
    descripcion: z.string().min(10).optional(),
    prioridad: z.enum(['Baja', 'Media', 'Alta', 'Urgente']).optional(),
    estado: z.string().optional(),
    agente_asignado_id: z.string().uuid().nullable().optional(),
  }),
});
```

**Nota:** Los schemas de tickets parecen estar desactualizados respecto a los campos reales que usa el controlador. El controlador usa campos como `id_cliente`, `id_marcas`, `id_motivo_caso`, etc. directamente sin validación Zod.

---

## 12. Templates de Email

### 12.1 invitation.html

- **Header:** Azul (`#0070f3`) con "Swim CRM"
- **Contenido:** Bienvenida + botón "Configurar mi cuenta"
- **Placeholders:** `{{name}}`, `{{url}}`
- **Footer:** Copyright 2026 + nota de correo automático
- **Valididad del enlace:** 24 horas

### 12.2 password-reset.html

- **Estructura:** Similar a invitation
- **Placeholders:** `{{name}}`, `{{url}}`
- **Botón:** "Restablecer contraseña"

### 12.3 registration-confirmation.html

- **Placeholders:** `{{name}}`, `{{email}}`
- **Contenido:** Confirmación de registro exitoso

### 12.4 guia-notification.html

- **Placeholders:** `{{storeName}}`, `{{guiaNumber}}`, `{{pedidosCount}}`, `{{pedidosList}}`
- **Contenido:** Detalle de guía de envío con lista de pedidos

### 12.5 ticket-assigned.html

- **Placeholders:** `{{agentName}}`, `{{ticketNumber}}`, `{{clientName}}`, `{{brandName}}`, `{{reason}}`, `{{description}}`, `{{ticketUrl}}`
- **Contenido:** Detalle completo del ticket asignado con link directo

---

## 13. Manejo de Archivos

### Configuración de Multer

```typescript
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}_${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido.'));
    }
  },
});
```

### Endpoints de Archivos

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/files/upload` | POST | Subir archivo de ticket (multer + metadata en BD) |
| `/api/files/evidence` | POST | Subir evidencia de entrega (pedido_evidencias) |
| `/api/files/ticket/:ticketId` | GET | Listar archivos de un ticket |
| `/api/files/download/:filename` | GET | Descarga segura (verifica RLS) |
| `/api/files/:id` | DELETE | Eliminar archivo (filesystem + BD) |

### Seguridad de Archivos (SEC-03)

- **Sin acceso público** a `/uploads` (removido `express.static`)
- **Descarga segura** vía `/api/files/download/:filename`:
  1. Verifica archivo existe en BD vía RLS
  2. Si no existe → 404
  3. Si existe → `res.download(filePath, originalName)`
- **Eliminación segura:** Borra archivo físico + metadata en BD

---

## 14. Sistema de Notificaciones

### Tipos de Notificación

| Tipo | Descripción | Destino | Email |
|---|---|---|---|
| `ticket_asignado` | Ticket asignado a agente | user_id del agente | Sí |
| `nueva_guia` | Nueva guía creada | Admin de tienda + admins | Sí (tienda) |
| `guia_recibida` | Guía recibida en tienda | Roles destino | No |
| `paquete_entregado` | Paquete entregado | Admins | No |

### Flujo de Notificación

```
1. Evento ocurre (ej: crear guía, asignar ticket)
2. NotificationService.notify() llamado
3. INSERT en dbo.notificaciones (bypass RLS con admin context)
4. Si sendEmail = true → obtener email del usuario → EmailService.sendEmail()
5. Frontend hace polling cada 5 min a /api/notifications/unread
```

### Polling del Frontend

- **Intervalo:** 5 minutos (`setInterval` de 300000ms)
- **Endpoint:** `GET /api/notifications/unread`
- **Respuesta:** Top 20 notificaciones no leídas ordenadas por `created_at DESC`

---

## 15. Sistema de Comunicaciones

### Marcas con Datos de Contacto

**Tabla:** `dbo.marcas`
**Campos de comunicación:**
- `whatsapp_numero`: Número sin '+' para enlace wa.me
- `email_remitente`: Correo remitente de la marca
- `telefono_soporte`: Teléfono de atención al cliente

### Templates de Comunicación

**Tabla:** `dbo.config_comunicaciones`
**Campos:**
- `id_marca`: NULL = global (todas las marcas)
- `tipo`: 'email' o 'whatsapp'
- `nombre`: Nombre descriptivo
- `asunto`: Solo para email
- `contenido`: Con placeholders `{{nombre}}`, `{{apellido}}`, etc.
- `activo`: BIT

### Envío de Emails desde el Drawer

1. Usuario selecciona marca remitente
2. Opcionalmente selecciona plantilla
3. Placeholders se interpolan con datos del cliente
4. `POST /api/comms/send-email` → `EmailService.sendEmail()`

### Gestión de Configuraciones (.env)

**Solo super_admin puede:**
- Leer configuraciones actuales (`GET /api/comms/settings`)
- Actualizar configuraciones (`PUT /api/comms/settings`)
- Las variables se actualizan en `process.env` en runtime

---

## 16. Gestión de Usuarios

### Flujo de Invitación

```
1. Admin envía: email, fullName, roleId, storeName?, permissions[]
2. Backend verifica email no existe
3. Genera userId, tempPassword (UUID), hash bcrypt
4. Transacción:
   a. INSERT perfil
   b. Si SPTienda: INSERT tienda → UPDATE perfil con tienda_id
   c. INSERT permisos personalizados
5. Commit
6. Genera inviteToken (24h)
7. Envía email con link: /reset-password?token={inviteToken}
8. Usuario hace click → establece contraseña → activa tienda
```

### Flujo de Eliminación

```
1. Verificar no es auto-eliminación
2. Transacción (10 pasos):
   a. Si SPTienda: desvincular perfiles → DELETE tienda
   b. Desvincular tiendas (admin_id, created_by)
   c. Desvincular guías
   d. Desvincular tickets
   e. Desvincular soluciones
   f. Desvincular clientes
   g. DELETE permisos
   h. Anonimizar audit_log
   i. DELETE rate limits
   j. DELETE perfil
3. Commit
4. Log de auditoría
```

### Permisos

**Sistema de permisos:**
- `dbo.permissions`: Definiciones de permisos
- `dbo.role_permissions`: Permisos por rol
- `dbo.user_permissions`: Permisos personalizados por usuario

**Permisos existentes:**
- `tickets:view`, `tickets:create`, `tickets:edit`, `tickets:delete`
- `customers:view`, `customers:create`, `customers:edit`, `customers:delete`
- `dashboard:view`
- `admin:users`

---

## 17. Seguridad y Hardening

### Medidas Implementadas

| Medida | Descripción | Referencia |
|---|---|---|
| **Cookies HttpOnly** | JWT en cookie HttpOnly (no localStorage) | SEC-05 |
| **Helmet** | Cabeceras de seguridad HTTP | SEC-04 |
| **CORS estricto** | Orígenes permitidos vía `ALLOWED_ORIGINS` | SEC-01 |
| **Cifrado DB** | `encrypt: true` en producción | SEC-02 |
| **Archivos protegidos** | Sin acceso público a `/uploads` | SEC-03 |
| **Descarga segura** | Endpoint con auth + RLS | SEC-03 |
| **Error boundary** | No expone stack traces en producción | SEC-07 |
| **Rate limiting** | Auth: 20 req/15min, API: 500 req/15min | — |
| **Validación Zod** | Esquemas en rutas críticas | CAL-02 |
| **Logging estructurado** | Winston + Morgan con rotación | CAL-01 |
| **RLS en SQL Server** | Aislamiento de datos por rol/tienda | — |
| **Bcrypt 12 rounds** | Hash de contraseñas | — |
| **Account lockout** | 3 intentos → 15 min bloqueo | — |
| **Audit log** | Registro de acciones sensibles con IP + user-agent | — |
| **Triggers de protección** | Previene eliminación de super_admin | — |

---

## 18. Logging y Auditoría

### Logging de Peticiones (Morgan)

- **Formato:** `combined` (Apache combined log format)
- **Stream:** Redirigido a Winston logger
- **Información:** IP, método, URL, status, tamaño, referer, user-agent

### Logging de Aplicación (Winston)

| Nivel | Uso |
|---|---|
| `error` | Errores críticos |
| `warn` | Advertencias |
| `info` | Información general (producción) |
| `debug` | Debugging (desarrollo) |

### Auditoría (audit_log)

**Acciones auditadas:**
- `user_registered`, `user_login`
- `user_invited`, `user_deleted`, `user_role_updated`
- `user_permissions_updated`, `user_profile_updated`, `user_password_updated`
- `password_changed`
- `notify_guia`, `send_email`

**Datos registrados:**
- `user_id`, `action`, `details` (JSON), `ip_address`, `user_agent`, `created_at`

**Limpieza automática:** Registros > 90 días eliminados por `usp_cleanup_system`

---

## 19. Rate Limiting

### Configuración

```typescript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: isDev ? 0 : 20,       // 0 = deshabilitado en dev
  skip: () => isDev,
  message: { error: 'Demasiados intentos de autenticación. Inténtalo de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 0 : 500,
  skip: () => isDev,
  message: { error: 'Demasiadas peticiones. Inténtalo de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});
```

### Endpoints Protegidos

| Endpoint | Limiter | Max (prod) |
|---|---|---|
| `/api/auth/login` | authLimiter | 20 req/15min |
| `/api/auth/register` | authLimiter | 20 req/15min |
| `/api/auth/forgot-password` | authLimiter | 20 req/15min |
| `/api/*` (general) | apiLimiter | 500 req/15min |

---

## 20. Variables de Entorno

### Backend (.env)

| Variable | Descripción | Ejemplo | Requerida |
|---|---|---|---|
| `PORT` | Puerto del servidor | `3000` | No (default: 3000) |
| `DB_USER` | Usuario de SQL Server | `sa` | Sí |
| `DB_PASSWORD` | Contraseña de SQL Server | `your_password` | Sí |
| `DB_NAME` | Nombre de la base de datos | `SwimmingCRM` | Sí |
| `DB_SERVER` | Servidor de SQL Server | `localhost` | No (default: localhost) |
| `DB_PORT` | Puerto de SQL Server | `1433` | No (default: 1433) |
| `DB_ENCRYPT` | Cifrado de conexión | `true` | No |
| `DB_TRUST_CERT` | Confiar en certificado | `true` | No |
| `JWT_SECRET` | Secreto para JWT | `your_secret` | Sí |
| `JWT_EXPIRES_IN` | Expiración del token | `8h` | No (default: 8h) |
| `SITE_URL` | URL del frontend | `http://localhost:5173` | No (default: localhost:3001) |
| `ALLOWED_ORIGINS` | Orígenes CORS permitidos | `http://localhost:5173` | No |
| `RESEND_API_KEY` | API key de Resend | `re_xxx` | No (si usa SMTP) |
| `RESEND_FROM_EMAIL` | Email remitente de Resend | `no-reply@swimmingcrm.com` | No |
| `SMTP_HOST` | Host SMTP | `smtp.example.com` | No (si usa Resend) |
| `SMTP_PORT` | Puerto SMTP | `587` | No (default: 587) |
| `SMTP_SECURE` | Conexión segura SMTP | `true` | No |
| `SMTP_USER` | Usuario SMTP | `user@example.com` | No |
| `SMTP_PASS` | Contraseña SMTP | `password` | No |
| `SMTP_FROM` | Email remitente SMTP | `no-reply@swimmingcrm.com` | No |
| `EMAIL_PROVIDER` | Proveedor de email | `resend` o `smtp` | No |
| `NODE_ENV` | Entorno | `development` / `production` | No |
| `FRONTEND_URL` | URL del frontend para links en emails | `http://localhost:5173` | No |

---

## 21. Patrones de Diseño

### 21.1 RLS Context Pattern

Todas las queries pasan por `executeWithRLS()` que establece `SESSION_CONTEXT` antes de ejecutar. Esto asegura que las políticas de Row-Level Security de SQL Server se apliquen correctamente.

### 21.2 Transaction-based RLS

Para operaciones complejas que requieren múltiples queries, se usa una transacción para mantener el contexto RLS en el pool de conexiones:

```typescript
const transaction = new sql.Transaction(pool);
await transaction.begin();
try {
  const request = transaction.request();
  // Set context + execute queries
  await transaction.commit();
} catch (err) {
  await transaction.rollback();
  throw err;
}
```

### 21.3 OUTPUT Clause Pattern

Los INSERT/UPDATE usan `OUTPUT INSERTED.*` para retornar los datos creados/actualizados sin necesidad de una query adicional:

```sql
INSERT INTO dbo.tickets (...)
OUTPUT INSERTED.id_ticket, INSERTED.ticket_numero, INSERTED.fecha_creacion_ticket
VALUES (...)
```

### 21.4 Lazy Import Pattern

Los servicios se importan dinámicamente cuando se necesitan para evitar circular dependencies y mejorar el tiempo de inicio:

```typescript
const { NotificationService } = await import('../services/notification.service');
```

### 21.5 Dynamic SQL Building

Las queries se construyen dinámicamente con filtros opcionales:

```typescript
const filters: string[] = [];
const params: { name: string; type: any; value: any }[] = [];

if (q) {
  filters.push(`(t.ticket_numero LIKE @q OR c.nombre LIKE @q)`);
  params.push({ name: 'q', type: sql.NVarChar, value: `%${q}%` });
}

const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
```

### 21.6 COALESCE Pattern para Updates Parciales

Los UPDATE usan `COALESCE` para permitir actualizaciones parciales sin sobreescribir campos no proporcionados:

```sql
UPDATE dbo.tickets
SET
  id_estado_caso = COALESCE(@id_estado_caso, id_estado_caso),
  descripcion = COALESCE(@descripcion, descripcion)
WHERE id_ticket = @id
```

### 21.7 Controller-Route Separation

Cada dominio tiene su controlador y archivo de rutas separados:

```
controllers/
  tickets.controller.ts
routes/
  tickets.routes.ts
```

### 21.8 Middleware Chain

Los middlewares se aplican en cadena:

```typescript
router.post('/', authenticate, validate(createTicketSchema), createTicket);
```

---

## 22. Consideraciones para Reconstrucción

### 22.1 Notas Importantes

1. **SQL Server es el motor de base de datos.** No usar PostgreSQL, MySQL ni otros.
2. **RLS es nativo de SQL Server** usando `SESSION_CONTEXT` + security policies.
3. **Las cookies HttpOnly** manejan autenticación, NO localStorage.
4. **`executeWithRLS()`** es CRÍTICO — todas las queries deben usarlo.
5. **El patrón de transacciones** asegura que el contexto RLS persista en el pool.
6. **TypeScript** es estricto — todos los tipos deben estar definidos.
7. **Zod** valida los schemas de request en rutas críticas.
8. **Winston** maneja logging con rotación de archivos.
9. **Rate limiting** se deshabilita en desarrollo (`NODE_ENV !== 'production'`).
10. **Los archivos** se almacenan localmente en `uploads/` con metadata en BD.

### 22.2 Convenciones de Código

- **Imports**: Rutas relativas desde `src/`
- **Naming**: camelCase para funciones/variables, PascalCase para clases
- **Tipado**: Interfaces TypeScript para todos los request/response
- **Errores**: `res.status(500).json({ error: '...' })`
- **Respuestas exitosas**: `{ data: ..., message: ... }` o `{ data: ..., pagination: ... }`
- **Validación**: Zod schemas en `schemas/` directory
- **Logging**: `console.error` para errores, Winston para logging estructurado

### 22.3 Dependencias Críticas

```json
{
  "express": "4.x",
  "mssql": "latest",
  "bcrypt": "latest",
  "jsonwebtoken": "latest",
  "zod": "latest",
  "helmet": "latest",
  "cors": "latest",
  "cookie-parser": "latest",
  "express-rate-limit": "latest",
  "morgan": "latest",
  "winston": "latest",
  "winston-daily-rotate-file": "latest",
  "dotenv": "latest",
  "multer": "latest",
  "nodemailer": "latest",
  "uuid": "latest"
}
```

### 22.4 Estructura de Respuestas de API

**Éxito:**
```json
{
  "data": { ... },
  "message": "Operación exitosa",
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 50,
    "totalPages": 2
  }
}
```

**Error:**
```json
{
  "error": "Mensaje de error descriptivo"
}
```

**Validación:**
```json
{
  "error": "Error de validación",
  "details": [
    { "path": "body.email", "message": "Email inválido" }
  ]
}
```

### 22.5 Flujo de Autenticación Completo

```
1. POST /auth/login → { email, password }
2. Query → SELECT profiles JOIN roles WHERE email = @email
3. bcrypt.compare(password, password_hash)
4. Si inválido → increment failed_attempts, lockout si >= 3
5. Si válido → generateToken({ userId, email, role, roleId })
6. res.cookie('token', jwt, { httpOnly, secure, sameSite, maxAge })
7. Query → UPDATE profiles SET failed_attempts=0, lockout_until=NULL, last_login=now
8. Si tienda_id → UPDATE tiendas SET is_active=1
9. Audit → INSERT INTO audit_log
10. Retorna { user: { id, email, full_name, role } }
```

### 22.6 Flujo de Creación de Ticket Completo

```
1. POST /api/tickets → { id_cliente, id_marcas, id_motivo_caso, ... }
2. executeWithRLS(userId, role, query, params)
3. Query → Determina prefijo según rol/marca
4. Query → NEXT VALUE FOR seq_ticket_xxx
5. Query → INSERT INTO tickets (ticket_numero, ...)
6. OUTPUT INSERTED.* → Retorna ticket creado
7. Lazy import → NotificationService.notifyTicketAssigned()
8. Retorna { data: createdTicket, message: 'Ticket creado exitosamente.' }
```

### 22.7 Patrón de Manejo de Errores

```typescript
try {
  const result = await executeWithRLS(userId, role, query, params);
  res.json({ data: result.recordset });
} catch (err: any) {
  console.error('Error en [función]:', err);
  res.status(500).json({ error: 'Error interno del servidor.' });
}
```

### 22.8 Migraciones

| Archivo | Propósito |
|---|---|
| `swimming_all_db.sql` | Script master (crear BD completa desde cero) |
| `003_add_sptienda_rls_rules.sql` | RLS avanzado para SPTienda |
| `migrations/001_add_numero_pedido_to_pedidos_guia.sql` | Agregar columnas `numero_pedido` y `nota` |
| `migrations/002_add_user_id_to_notificaciones.sql` | Agregar `user_id` a notificaciones |

---

## Apéndice A: Códigos de Estado HTTP

| Código | Significado | Uso |
|---|---|---|
| 200 | OK | Operación exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Validación fallida o parámetros inválidos |
| 401 | Unauthorized | Token inválido o faltante |
| 403 | Forbidden | Permisos insuficientes |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Recurso duplicado (ej: cédula existente) |
| 500 | Internal Server Error | Error interno del servidor |

---

## Apéndice B: Historial de Versiones Relevante para Backend

| Versión | Cambios Backend Significativos |
|---|---|
| v1.8.0 | Refactorización de estados de tickets, limpieza de código |
| v1.7.0 | Campos `fecha_compra`, `valor_compra`, `solucion_esperada` en tickets |
| v1.6.0 | RLS para SPTienda, KPIs seguros por tienda |
| v1.5.0 | Cookies HttpOnly, Helmet, CORS, Zod validation, logging, error boundary |
| v1.4.0 | `config_comunicaciones`, controlador `comms.controller.ts` |
| v1.3.0 | `tipos_comercio`, JOINs complejos en customers.controller |
| v1.2.0 | Asignación de agentes, notificaciones automatizadas, plantillas dinámicas |
| v1.1.0-B | Migración a API REST, almacenamiento local de archivos |
| v1.0.0 | Migración a SQL Server, JWT propio, RLS nativo, 23 tablas |
| v0.2.9 | Magic bytes validation, rate limiting, auditoría |
| v0.2.6 | Notificaciones, ImageLightbox, KPI "Próximos a Vencer" |
| v0.2.5 | SharedTicketModal, ruteo seguro |
| v0.2.1-B | Desacoplamiento de Supabase |
| v0.2.1 | Módulo de tiendas, edge function notify-guia |
| v0.2.0 | Módulo de clientes, KPIs en tiempo real |
| v0.1.6 | Servicio de email Resend, gestión de usuarios |

---

> **Fin del documento.** Este archivo contiene toda la información necesaria para reconstruir el backend del CRM Swim con fidelidad completa. Cualquier duda adicional debe consultarse con el código fuente directamente.
