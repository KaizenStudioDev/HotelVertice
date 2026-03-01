# Informe Técnico: Sistema de Reservas - Boutique Hotel
## Sprints 1 y 2: Análisis, Diseño y Backend Core

Este documento detalla la arquitectura, decisiones de diseño y lógica implementada durante las primeras 6 semanas del proyecto.

---

### 1. Arquitectura Tecnológica
Se ha seleccionado un stack moderno y escalable, alineado con estándares profesionales de la industria:
- **Frontend**: React + Vite + TypeScript (Estructura base lista).
- **Backend**: Node.js v18+ con Express y TypeScript.
- **Base de Datos**: Supabase (PostgreSQL) con soporte nativo para Row Level Security (RLS).
- **Testing**: Vitest + Supertest para asegurar la integridad de la API.

---

### 2. Diseño de Base de Datos (Supabase)
La base de datos se diseñó para ser normalizada y segura. Contamos con 4 tablas principales:

1.  **room_types**: Define las categorías (Estándar, Suite, Familiar), capacidades y precios base.
2.  **rooms**: Representa las 24 habitaciones físicas del hotel, vinculadas a un tipo.
3.  **profiles**: Almacena información extendida de los usuarios (Nombre completo, Rol: guest/receptionist/admin).
4.  **reservations**: Gestiona las reservas, vinculando usuarios con habitaciones y fechas.

**Automatización**:
- Se implementó un **Database Trigger** (`on_auth_user_created`) que crea un perfil automáticamente en la tabla `profiles` cada vez que un usuario se registra en Supabase Auth.

---

### 3. Lógica de Negocio en el Backend
La API sigue el patrón **MVC (Modelo-Vista-Controlador)** de forma significada:

#### A. Gestión de Reservas (Crucial)
Se ha implementado una lógica robusta para evitar solapamientos de fechas. Antes de confirmar una reserva, el sistema verifica:
- `check_in < reserva_existente.check_out` **AND** `check_out > reserva_existente.check_in`.
Esto garantiza matemáticamente que ninguna habitación sea reservada dos veces para el mismo periodo.

#### B. Cálculo Dinámico de Precios
El sistema calcula el `total_price` automáticamente en el servidor:
- `(CheckOut - CheckIn) * PrecioBaseDelTipoDeHabitacion`.
Esto evita que el cliente pueda manipular el precio desde el frontend.

---

### 4. Seguridad y Autenticación
- **Supabase Auth**: Manejo de identidades mediante JWT (JSON Web Tokens).
- **Middleware de Autenticación**: Se creó un middleware `authenticate` que valida el token antes de permitir el acceso a rutas privadas (como crear reservas).
- **RBAC (Control de Acceso Basado en Roles)**: El middleware `authorize` permite restringir acciones específicas (ej. solo el Recepcionista puede hacer Check-in) basándose en el rol guardado en `profiles`.

---

### 5. Calidad del Software (QA)
Siguiendo los requisitos académicos de alta calidad, se implementó una suite de pruebas de integración:
- **Herramientas**: Vitest para el runner y Supertest para simular peticiones HTTP.
- **Cobertura de Código**: Se alcanzó un **76.19%**, superando el objetivo del 70%.
    - Se testearon: Endpoints de Habitaciones, Autenticación (Login/Registro) y Lógica de Reservas (incluyendo errores).

---

### 6. Estándares Profesionales Aplicados
- **ES Modules (ESM)**: Uso de `import/export` nativo de Node.js.
- **TypeScript**: Tipado estricto para evitar errores en tiempo de ejecución.
- **Idempotencia SQL**: El script de base de datos está diseñado para ser ejecutado múltiples veces sin causar errores de duplicidad.
- **Variables de Envío**: Configuración segura mediante archivos `.env`.

---
**Entregables Adjuntos**:
- Carpeta `backend/` con código fuente y tests.
- Carpeta `database/` con el script SQL de inicialización.
- Archivo `task.md` con el control de progreso detallado.
