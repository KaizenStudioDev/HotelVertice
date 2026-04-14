# Documentación Técnica — Sistema de Gestión de Reservas
## Hotel Vértice · Boutique Hotel Reservation System

**Facultad de Ingeniería y Ciencias Básicas — Ingeniería de Sistemas**  
**Asignatura:** Ingeniería de Software II — G1  
**Periodo:** 2026-1S  

---

## Tabla de Contenidos

1. [Descripción General](#1-descripción-general)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Stack Tecnológico](#3-stack-tecnológico)
4. [Funcionalidades Implementadas](#4-funcionalidades-implementadas)
5. [Estructura del Proyecto](#5-estructura-del-proyecto)
6. [Base de Datos](#6-base-de-datos)
7. [API REST — Endpoints](#7-api-rest--endpoints)
8. [Seguridad](#8-seguridad)
9. [Pruebas](#9-pruebas)
10. [Despliegue](#10-despliegue)
11. [Resumen de Fases / Sprints](#11-resumen-de-fases--sprints)

---

## 1. Descripción General

**Hotel Vértice** es una aplicación web full-stack para la gestión integral de reservas de un hotel boutique de 24 habitaciones, distribuidas en 3 plantas y 3 categorías (Estándar, Suite, Familiar). El sistema permite a huéspedes buscar y reservar habitaciones por fechas con disponibilidad en tiempo real, y a administradores gestionar el inventario, reservas y visualizar ocupación mediante un calendario interactivo.

**URL de producción:** https://hotel-vertice.vercel.app  
**Repositorio:** https://github.com/KaizenStudioDev/HotelVertice

---

## 2. Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENTE (Browser)                    │
│              React 19 + Vite + TypeScript                │
└───────────────────────┬─────────────────────────────────┘
                        │  HTTPS / REST (Axios)
                        ▼
┌─────────────────────────────────────────────────────────┐
│               SERVIDOR (Vercel Serverless)               │
│            Node.js + Express + TypeScript                │
│              api/index.ts  →  /api/*                     │
└───────────────────────┬─────────────────────────────────┘
                        │  Supabase JS Client (service_role)
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  BASE DE DATOS (Supabase)                 │
│         PostgreSQL · Auth · Row Level Security           │
└─────────────────────────────────────────────────────────┘
```

**Patrón:** Monorepo con frontend (SPA) y backend (API REST) desplegados en el mismo dominio de Vercel. El frontend hace peticiones a `/api/*` en el mismo origen, eliminando problemas de CORS en producción.

**Frontend → Backend:** HTTP/REST con Axios. Token JWT enviado en el header `Authorization: Bearer <token>` en cada petición autenticada.

**Backend → Base de datos:** Supabase JS Client con `service_role` key, que bypassa Row Level Security para operaciones administrativas. La RLS protege el acceso directo al cliente.

---

## 3. Stack Tecnológico

### Frontend

| Herramienta | Versión | Uso |
|---|---|---|
| **React** | 19.x | Librería principal de UI |
| **TypeScript** | 5.9.x | Tipado estático |
| **Vite** | 7.x | Bundler y servidor de desarrollo |
| **React Router DOM** | 7.x | Navegación SPA (client-side routing) |
| **Axios** | 1.x | Cliente HTTP para consumir la API |
| **Tailwind CSS** | 3.x | Utilidades CSS, diseño responsive |
| **Framer Motion** | 12.x | Animaciones de entrada/transición de páginas |
| **FullCalendar** | 6.x | Calendario interactivo de disponibilidad |
| **Lucide React** | 0.5x | Iconografía SVG |
| **jsPDF + autotable** | 4.x / 5.x | Generación de comprobantes PDF en el cliente |
| **Zod** | 4.x | Validación de esquemas de datos |
| **Vitest** | 4.x | Runner de pruebas unitarias |
| **Testing Library** | 16.x | Utilidades de testing para componentes React |

### Backend

| Herramienta | Versión | Uso |
|---|---|---|
| **Node.js** | 20.x | Entorno de ejecución |
| **Express** | 4.x | Framework web / API REST |
| **TypeScript** | 5.3.x | Tipado estático |
| **@supabase/supabase-js** | 2.x | Cliente oficial de Supabase |
| **dotenv** | 16.x | Gestión de variables de entorno (local) |
| **cors** | 2.x | Middleware CORS para desarrollo local |
| **tsx** | 4.x | Ejecución directa de TypeScript en desarrollo |
| **Vitest** | 4.x | Pruebas unitarias e integración |
| **Supertest** | 7.x | Pruebas HTTP de endpoints |

### Base de Datos y Autenticación

| Herramienta | Uso |
|---|---|
| **Supabase** | PostgreSQL gestionado + Auth + Row Level Security |
| **PostgreSQL** | Motor relacional |
| **Supabase Auth** | Registro, login, JWT, gestión de sesiones |

### Infraestructura y Despliegue

| Herramienta | Uso |
|---|---|
| **Vercel** | Hosting unificado: static build (frontend) + serverless functions (backend) |
| **GitHub** | Control de versiones y trigger de deploys automáticos |
| **Git** | Control de versiones local |

### Herramientas de Desarrollo

| Herramienta | Uso |
|---|---|
| **Visual Studio Code** | Editor principal |
| **Postman** | Pruebas manuales de endpoints REST |
| **Figma** | Diseño de wireframes y sistema de colores |
| **npm** | Gestión de paquetes |

---

## 4. Funcionalidades Implementadas

### 4.1 Autenticación y Usuarios

- **Registro de usuario** — email, contraseña, nombre completo. Rol asignado por defecto como `guest`. La sesión se almacena vía JWT en `localStorage`.
- **Login / Logout** — autenticación con Supabase Auth, token JWT devuelto por la API y almacenado en el cliente.
- **Roles diferenciados** — tres roles: `guest` (huésped), `receptionist` (recepcionista), `admin` (administrador). El acceso a rutas y funciones está controlado por middleware `authorize()` en el backend.
- **Perfil de usuario** — edición de nombre completo y cambio de contraseña desde la vista `/profile`.

### 4.2 Búsqueda y Disponibilidad de Habitaciones

- **Listado de habitaciones** — visualización de las 24 habitaciones con imagen, tipo, piso, vista, capacidad y precio por noche.
- **Filtros** — filtrado por piso (1, 2, 3) y tipo de vista (Mar, Ciudad, Jardín).
- **Disponibilidad en tiempo real por fechas** — al seleccionar fechas de check-in y check-out, el sistema consulta la tabla `reservations` en Supabase y calcula qué habitaciones tienen reservas confirmadas solapadas con el rango solicitado. Las habitaciones se marcan como "Ocupada" o "Disponible" sin modificar el campo `status` de la tabla `rooms`.
- **Selector de fechas inline** — los inputs de fecha están directamente en la página de habitaciones, actualizando la disponibilidad automáticamente al cambiar.

### 4.3 Flujo de Reserva

El flujo de reserva es un proceso de 4 pasos:

1. **Landing (`/`)** — selección inicial de fechas y número de huéspedes.
2. **Habitaciones (`/rooms`)** — exploración y selección de habitación disponible.
3. **Datos de Reserva (`/booking-details`)** — confirmación de nombre, email, teléfono y número de huéspedes.
4. **Pago (`/payment`)** — confirmación y creación de la reserva en la base de datos mediante `POST /api/reservations`.
5. **Confirmación (`/payment-confirmation`)** — resumen final con opción de descargar comprobante PDF.

El estado del flujo se comparte globalmente a través del `BookingContext` (React Context API).

### 4.4 Prevención de Double-Booking

El backend valida que no existan reservas confirmadas solapadas antes de crear una nueva:

```
check_in de nueva  <  check_out existente
check_out de nueva >  check_in existente
```

Si hay solapamiento, la API retorna HTTP 400 con mensaje de error. Esta validación ocurre exclusivamente en el servidor (no solo en el frontend).

### 4.5 Panel Administrativo (`/admin`)

Accesible únicamente para usuarios con rol `admin`.

- **Vista Resumen (Overview)** — métricas en tiempo real: total de reservas activas, habitaciones libres, habitaciones en mantenimiento, ingresos totales.
- **Vista Reservas** — tabla completa de todas las reservas del hotel con búsqueda por nombre/email/habitación y filtro por estado (confirmada, cancelada). Permite cancelar cualquier reserva.
- **Vista Habitaciones** — listado de las 24 habitaciones con su estado actual y tipo.
- **Enlace al Calendario** — acceso directo a la vista de calendario desde el panel.

### 4.6 Calendario de Disponibilidad (`/calendar`)

Vista de calendario mensual implementada con **FullCalendar** que muestra:

- Todas las reservas del hotel (admin) o solo las del usuario (huésped).
- Eventos coloreados por estado: confirmada (dorado), cancelada (rojo), mantenimiento (gris).
- Filtros por estado: Todas / Confirmadas / Canceladas.
- Estadísticas rápidas: conteo de confirmadas y canceladas.
- Modal de detalle al hacer clic en un evento: número de habitación, tipo, fechas, precio total.
- Vistas disponibles: Mes, Semana, Lista.

### 4.7 Perfil de Usuario (`/profile`)

- **Pestaña Mis Reservas** — historial de reservas del usuario con opción de cancelar reservas activas y descargar comprobante PDF de cada una.
- **Pestaña Datos Personales** — edición de nombre completo.
- **Pestaña Seguridad** — cambio de contraseña.

### 4.8 Generación de PDF

Desde el perfil de usuario y la confirmación de pago, el usuario puede descargar un comprobante de reserva en PDF generado directamente en el cliente con **jsPDF**. El documento incluye:

- Encabezado con nombre del hotel y número de reserva.
- Datos del huésped, habitación, fechas y precio total.
- Estilo visual alineado con la identidad del hotel.

---

## 5. Estructura del Proyecto

```
hotel-vertice/                     ← Raíz del monorepo
├── api/
│   ├── index.ts                   ← Entrada serverless Vercel → Express app
│   └── test.ts                    ← Endpoint de diagnóstico
├── backend/
│   ├── src/
│   │   ├── app.ts                 ← Configuración Express (CORS, middlewares, rutas)
│   │   ├── server.ts              ← Servidor local (app.listen)
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── roomController.ts
│   │   │   └── reservationController.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── roomRoutes.ts
│   │   │   └── reservationRoutes.ts
│   │   ├── middlewares/
│   │   │   └── authMiddleware.ts  ← JWT verify + RBAC authorize()
│   │   └── utils/
│   │       └── supabaseClient.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx                ← Enrutador principal
│   │   ├── main.tsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── MainLayout.tsx
│   │   │   │   └── PageTransition.tsx
│   │   │   └── ui/                ← Design System propio
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── Badge.tsx
│   │   │       ├── Input.tsx
│   │   │       └── Select.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx    ← Sesión global del usuario
│   │   │   ├── BookingContext.tsx ← Estado del flujo de reserva
│   │   │   └── ToastContext.tsx   ← Notificaciones globales
│   │   ├── pages/
│   │   │   ├── Landing.tsx
│   │   │   ├── Rooms.tsx          ← Disponibilidad por fechas
│   │   │   ├── BookingDetails.tsx
│   │   │   ├── Payment.tsx
│   │   │   ├── PaymentConfirmation.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── UserProfile.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── CalendarPage.tsx
│   │   │   └── Features.tsx
│   │   └── services/
│   │       ├── api.ts             ← Cliente HTTP centralizado (Axios)
│   │       └── pdfService.ts      ← Generación de PDF con jsPDF
│   ├── package.json
│   └── vite.config.ts
├── database/
│   └── supabase.sql               ← Schema completo de la BD
├── Docs/                          ← Documentación del proyecto
├── vercel.json                    ← Configuración de despliegue
└── package.json                   ← Package raíz (type: module, engines)
```

---

## 6. Base de Datos

### Modelo Entidad-Relación

```
auth.users (Supabase Auth)
    │ 1
    │ ∞
profiles ──────── id (FK → auth.users)
                  full_name
                  role: guest | receptionist | admin

room_types ─────── id (SERIAL PK)
    │               name: Estándar | Suite | Familiar
    │               base_price (DECIMAL)
    │               capacity
    │ 1
    │ ∞
rooms ──────────── id (SERIAL PK)
    │               room_number (UNIQUE)
    │               type_id (FK → room_types)
    │               floor: 1 | 2 | 3
    │               view_type: Mar | Ciudad | Jardín
    │               status: available | maintenance
    │ 1
    │ ∞
reservations ───── id (UUID PK)
                   user_id (FK → auth.users)
                   room_id (FK → rooms)
                   check_in (DATE)
                   check_out (DATE)
                   status: confirmed | cancelled
                   total_price (DECIMAL)
                   CONSTRAINT: check_out > check_in
```

### Datos de Habitaciones (24 en total)

| Piso | Habitaciones | Tipo | Vista | Precio/noche |
|---|---|---|---|---|
| 1 | 101–108 | Estándar | Ciudad / Jardín | $150,000 |
| 2 | 201–204 | Suite | Mar | $350,000 |
| 2 | 205–208 | Familiar | Jardín | $500,000 |
| 3 | 301–304 | Suite | Mar | $350,000 |
| 3 | 305–308 | Estándar | Ciudad | $150,000 |

### Row Level Security (RLS)

| Tabla | Política |
|---|---|
| `room_types` | Lectura pública |
| `rooms` | Lectura pública |
| `reservations` | SELECT: solo propias reservas (`auth.uid() = user_id`) |
| `reservations` | INSERT: solo el propio usuario (`auth.uid() = user_id`) |
| `profiles` | SELECT: público; UPDATE: solo propio perfil |

> El backend usa `service_role` key, que bypassa RLS. Las políticas protegen el acceso directo desde el cliente.

---

## 7. API REST — Endpoints

Base URL: `https://hotel-vertice.vercel.app/api`

### Autenticación

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/register` | No | Registrar nuevo usuario |
| POST | `/auth/login` | No | Login, retorna JWT |
| GET | `/auth/profile` | JWT | Obtener perfil del usuario |
| PATCH | `/auth/profile` | JWT | Actualizar nombre |
| PATCH | `/auth/password` | JWT | Cambiar contraseña |

### Habitaciones

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/rooms` | No | Listar todas las habitaciones. Acepta `?check_in=YYYY-MM-DD&check_out=YYYY-MM-DD` para disponibilidad por fechas |
| GET | `/rooms/:id` | No | Obtener habitación por ID |

### Reservas

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/reservations` | JWT (user) | Reservas del usuario autenticado |
| POST | `/reservations` | JWT (user) | Crear nueva reserva (con validación anti double-booking) |
| PATCH | `/reservations/:id/cancel` | JWT (user/admin) | Cancelar reserva |
| GET | `/reservations/admin/all` | JWT (admin) | Todas las reservas del hotel |

### Lógica de disponibilidad en `GET /rooms`

Cuando se pasan los parámetros `check_in` y `check_out`:

1. Se obtienen todas las habitaciones.
2. Se consultan reservas confirmadas que se solapan con el rango solicitado.
3. Cada habitación recibe el campo calculado `is_available_for_dates: boolean`.

---

## 8. Seguridad

- **Autenticación JWT** — Supabase Auth emite tokens firmados. El backend los verifica llamando a `supabase.auth.getUser(token)` en cada petición protegida.
- **RBAC (Role-Based Access Control)** — middleware `authorize(['admin'])` en rutas administrativas. El rol se obtiene de `user.user_metadata.role` del JWT.
- **Service Role Key** — la clave `service_role` de Supabase solo existe en el servidor (variable de entorno). Nunca se expone al cliente.
- **CORS** — configurado para permitir solo orígenes específicos en desarrollo local. En producción, frontend y backend comparten dominio, por lo que no aplica CORS.
- **Variables de entorno** — credenciales gestionadas via Vercel Environment Variables. El archivo `.env` está en `.gitignore` y nunca se sube al repositorio.
- **Validación de datos** — el backend valida fechas (check-out > check-in), existencia de habitación y solapamiento de reservas antes de crear cualquier registro.
- **Anti SQL Injection** — todas las consultas usan el ORM de Supabase JS (consultas parametrizadas), eliminando el riesgo de inyección SQL.

---

## 9. Pruebas

### Pruebas Unitarias de Componentes (Frontend)

Ubicadas en `frontend/src/components/ui/`:

- **`Button.test.tsx`** — verifica renderizado correcto, aplicación de variante CSS, estado `disabled`, y disparo del evento `onClick`.
- **`Badge.test.tsx`** — verifica renderizado de texto y variantes de color.

Herramientas: **Vitest** como runner, **@testing-library/react** para render y queries DOM, **jsdom** como entorno de browser simulado.

### Pruebas de Integración (Backend)

Ubicadas en `backend/src/`:

- Pruebas de endpoints con **Supertest** para verificar respuestas HTTP de rutas de rooms y reservations.

### Ejecución

```bash
# Frontend
cd frontend && npm test

# Backend
cd backend && npm test

# Con cobertura (backend)
cd backend && npm run coverage
```

---

## 10. Despliegue

### Plataforma: Vercel (Proyecto único — monorepo)

El sistema se despliega como un único proyecto Vercel que sirve tanto el frontend estático como el backend serverless en el mismo dominio.

### `vercel.json` — Configuración de build y rutas

```json
{
  "buildCommand": "npm install --prefix backend && npm --prefix backend run build && npm install --prefix frontend && npm --prefix frontend run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/index" },
    { "source": "/:path*",     "destination": "/index.html" }
  ]
}
```

### Proceso de build en Vercel

1. `npm install --prefix backend` → instala dependencias del backend
2. `npm --prefix backend run build` → compila TypeScript del backend a `backend/dist/`
3. `npm install --prefix frontend` → instala dependencias del frontend
4. `npm --prefix frontend run build` → compila React + Vite a `frontend/dist/`
5. Vercel toma `frontend/dist/` como salida estática y `api/index.ts` como función serverless

### Variables de entorno en Vercel

| Variable | Descripción |
|---|---|
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (admin) de Supabase |

### Flujo de despliegue continuo

```
Push a rama main (GitHub)
        ↓
Vercel detecta el push automáticamente
        ↓
Ejecuta buildCommand
        ↓
Despliega frontend (CDN) + backend (serverless function)
        ↓
hotel-vertice.vercel.app disponible
```

---

## 11. Resumen de Fases / Sprints

### Sprint 1 — Análisis y Planificación (Semanas 1–3)

**Objetivo:** Definir los requisitos, arquitectura y diseño del sistema.

**Entregables:**
- Levantamiento de requisitos funcionales y no funcionales.
- Diagramas UML: casos de uso, modelo entidad-relación, diagrama de clases.
- Historias de usuario con criterios de aceptación (módulos: Reservas, Operación Hotelera, Administración).
- Wireframes y sistema de diseño en Figma (paleta de colores, tipografías, componentes).
- Definición del stack tecnológico y arquitectura de la solución.
- Schema inicial de la base de datos PostgreSQL en Supabase.

**Decisiones técnicas tomadas:** Monorepo frontend/backend, Supabase como BaaS, despliegue en Vercel.

---

### Sprint 2 — Backend y Base de Datos (Semanas 4–6)

**Objetivo:** Construir la API REST completa y la base de datos funcional.

**Entregables:**
- Base de datos creada en Supabase con tablas: `room_types`, `rooms`, `reservations`, `profiles`.
- 24 habitaciones pre-cargadas con seed script (`backend/seed.ts`).
- API REST con Express y TypeScript:
  - `POST /api/auth/register` y `POST /api/auth/login`
  - `GET /api/rooms`
  - `GET /api/reservations`, `POST /api/reservations`, `PATCH /api/reservations/:id/cancel`
  - `GET /api/reservations/admin/all`
- Middleware de autenticación JWT con Supabase Auth.
- Middleware de autorización RBAC (`authorize(['admin'])`).
- Validación anti double-booking en la creación de reservas.
- Row Level Security activado en Supabase.
- Pruebas de endpoints con Postman y Supertest.

**Commit clave:** `Initial commit: Hotel Reservation System - Backend Sprints 1 & 2`

---

### Sprint 3 — Frontend e Integración (Semanas 7–9)

**Objetivo:** Desarrollar la interfaz completa y conectarla con el backend.

**Entregables:**
- Design System propio: componentes `Button`, `Card`, `Badge`, `Input`, `Select` con variantes.
- Páginas implementadas: Landing, Rooms, BookingDetails, Payment, PaymentConfirmation, Login, Register, UserProfile.
- Context API: `AuthContext`, `BookingContext`, `ToastContext`.
- Flujo de reserva completo de 4 pasos con validación de estado.
- Panel Administrativo (`/admin`) con vistas Overview, Reservas y Habitaciones.
- Animaciones de transición de página con Framer Motion.
- Diseño premium responsive con Tailwind CSS.
- Integración completa frontend ↔ backend con Axios.
- Servicio de PDF (`pdfService.ts`) con jsPDF para comprobantes.
- Pruebas unitarias de componentes UI con Vitest + Testing Library.

**Commit clave:** `feat(frontend): Sprint 3 — UI completa con diseño premium Boutique Hotel`

---

### Sprint 4 — Pruebas y Optimizaciones (Semanas 10–12)

**Objetivo:** Mejorar la calidad del código, seguridad y agregar funcionalidades de reportes.

**Entregables:**
- Correcciones de seguridad en el backend: validación de inputs, manejo de errores robusto.
- RBAC reforzado: verificación de rol en rutas administrativas.
- Auditoría técnica completa con listado de bugs y correcciones (`REPORTE_AUDITORIA_ETAPAS.txt`, `PLAN_CORRECCIONES.txt`).
- Mejoras de calidad de código: tipado más estricto, refactorización de controladores.
- Gestión de perfil de usuario: edición de nombre completo y cambio de contraseña.
- Implementación de FullCalendar (`/calendar`) para vista de disponibilidad mensual por estados.
- Generación de comprobantes PDF mejorada.

**Commit clave:** `fix(backend): Sprint 4 — correcciones de seguridad, RBAC y calidad`

---

### Sprint 5 — Despliegue y Producción (Semanas 13–16)

**Objetivo:** Desplegar el sistema en producción con monitoreo y documentación final.

**Entregables:**
- Adaptación del backend Express para Vercel Serverless (separación `app.ts` / `server.ts`).
- Configuración de monorepo en Vercel con `vercel.json` unificado.
- Resolución de compatibilidad ESM/CommonJS entre módulos del proyecto.
- Pre-compilación del backend TypeScript como parte del pipeline de build.
- Implementación de disponibilidad de habitaciones por fechas (feature final):
  - El endpoint `GET /api/rooms` acepta `?check_in` y `?check_out`.
  - Consulta dinámica a la tabla `reservations` para calcular `is_available_for_dates`.
  - Sin modificación del campo `status` en la tabla `rooms`.
  - Inputs de fecha inline en la página de habitaciones con refetch automático.
- Variables de entorno configuradas en Vercel (Supabase URL y service_role key).
- Despliegue exitoso en https://hotel-vertice.vercel.app.
- Documentación técnica final.

**Commits clave:**
- `chore: prepare project for production deployment`
- `feat(frontend): implement FullCalendar availability calendar`
- `chore: configure single Vercel project for frontend + backend`
- `feat: implement date-based room availability check`

---

*Documento generado para el proyecto semestral de Ingeniería de Software II — 2026-1S*
