# Manual de Usuario — Hotel Vértice

> Sistema de Reservas en Línea · Boutique Hotel

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Acceso al Sistema](#2-acceso-al-sistema)
   - 2.1 [Registro de nueva cuenta](#21-registro-de-nueva-cuenta)
   - 2.2 [Inicio de sesión](#22-inicio-de-sesión)
3. [Página Principal](#3-página-principal)
4. [Nuestros Servicios](#4-nuestros-servicios)
5. [Buscar y Seleccionar Habitaciones](#5-buscar-y-seleccionar-habitaciones)
   - 5.1 [Filtrar habitaciones](#51-filtrar-habitaciones)
   - 5.2 [Tipos de habitación y precios](#52-tipos-de-habitación-y-precios)
6. [Proceso de Reserva](#6-proceso-de-reserva)
   - 6.1 [Datos de la reserva](#61-datos-de-la-reserva)
   - 6.2 [Pago](#62-pago)
   - 6.3 [Confirmación](#63-confirmación)
7. [Mi Perfil](#7-mi-perfil)
   - 7.1 [Mis Reservas](#71-mis-reservas)
   - 7.2 [Información Personal](#72-información-personal)
   - 7.3 [Seguridad](#73-seguridad)
8. [Calendario de Disponibilidad](#8-calendario-de-disponibilidad)
9. [Panel de Recepción](#9-panel-de-recepción) *(Rol: Recepcionista)*
10. [Panel de Administrador](#10-panel-de-administrador) *(Rol: Administrador)*
11. [Roles y Permisos](#11-roles-y-permisos)
12. [Preguntas Frecuentes](#12-preguntas-frecuentes)

---

## 1. Introducción

**Hotel Vértice** es un sistema web de reservas para un hotel boutique de lujo. Permite a los huéspedes buscar habitaciones disponibles, realizar reservas en línea, gestionar su perfil y descargar recibos. El personal del hotel (recepcionistas y administradores) dispone de paneles de control específicos para gestionar todas las operaciones del establecimiento.

**Tecnología:** Aplicación web responsiva accesible desde cualquier navegador moderno (Chrome, Firefox, Edge, Safari).

---

## 2. Acceso al Sistema

### 2.1 Registro de nueva cuenta

Para crear una cuenta de huésped:

1. Haz clic en **"Regístrate"** en la barra de navegación o en el botón que aparece en la pantalla de inicio de sesión.
2. Completa el formulario con los siguientes datos:
   - **Nombre Completo** (ej. *Juan Pérez*)
   - **Correo Electrónico** (ej. *juan@ejemplo.com*)
   - **Contraseña** (mínimo 8 caracteres)
   - **Confirmar Contraseña**
3. Acepta los *Términos y Condiciones* y la *Política de Privacidad* marcando la casilla.
4. Pulsa **"Crear Cuenta"**.

> ✅ Si el registro es exitoso, serás redirigido automáticamente a tu perfil.

### 2.2 Inicio de sesión

1. Haz clic en **"Iniciar Sesión"** en la barra de navegación.
2. Introduce tu **Correo Electrónico** y **Contraseña**.
3. Opcionalmente, marca **"Recordarme"** para mantener la sesión activa.
4. Pulsa **"Iniciar Sesión"**.

> ℹ️ Si olvidaste tu contraseña, utiliza el enlace **"¿Olvidaste tu contraseña?"** en la misma página.

---

## 3. Página Principal

La página de inicio (`/`) muestra:

- **Sección Hero:** Imagen principal del hotel con el eslogan y un acceso directo a la selección de habitaciones.
- **Buscador de disponibilidad:** Formulario con tres campos:
  - 📅 **Check-in** — Fecha de llegada (mínimo: hoy).
  - 📅 **Check-out** — Fecha de salida (mínimo: día siguiente al check-in).
  - 👤 **Huéspedes** — Número de personas (entre 1 y 4).
  
  Pulsa **"Buscar"** para ver las habitaciones disponibles para esas fechas.

- **Destacados de habitaciones:** Vista rápida de los tres tipos disponibles (Estándar, Suite Premium, Suite Familiar) con precio por noche.
- Botón **"Ver todas las habitaciones"** para acceder al catálogo completo.

---

## 4. Nuestros Servicios

Accede a la sección **Servicios** (`/features`) para conocer las instalaciones del hotel:

| Servicio | Descripción |
|---|---|
| 🧖 **Spa y Relajación** | Masajes terapéuticos, circuito de aguas y saunas. |
| 🍽️ **Alta Cocina** | Restaurante dirigido por chefs premiados con fusión local e internacional. |
| 🏋️ **Gimnasio Premium** | Equipos de última generación, entrenadores personales y clases 24 h. |
| 📶 **Wi-Fi Rápido** | Conexión de alta velocidad en todas las instalaciones. |
| 🚗 **Valet Parking** | Servicio de aparcamiento incluido. |
| 🐾 **Pet Friendly** | Admitimos mascotas. |
| 🛎️ **Room Service 24 h** | Servicio a la habitación disponible las 24 horas. |

---

## 5. Buscar y Seleccionar Habitaciones

Accede a la sección **Habitaciones** (`/rooms`) directamente desde el menú o tras pulsar "Buscar" en la página principal.

### 5.1 Filtrar habitaciones

En la parte superior de la página encontrarás los siguientes controles:

| Filtro | Opciones |
|---|---|
| **Check-in / Check-out** | Modifica las fechas directamente en esta página; el listado se actualiza automáticamente. |
| **Planta** | Todas / Piso 1 / Piso 2 / Piso 3 |
| **Vista** | Cualquiera / Vista al Mar / Vista Ciudad / Vista Jardín |

> 🔄 Si no se encuentran habitaciones con los filtros aplicados, aparece un botón **"Limpiar Filtros"** para restablecer la búsqueda.

### 5.2 Tipos de habitación y precios

| Tipo | Capacidad | Precio base |
|---|---|---|
| **Estándar** | Hasta 2 huéspedes | Desde **$120 / noche** |
| **Suite** (Premium) | Hasta 2 huéspedes | Desde **$250 / noche** |
| **Familiar** | Hasta 4 huéspedes | Desde **$320 / noche** |

Cada tarjeta de habitación muestra:
- Imagen, tipo y número de habitación.
- Planta y tipo de vista (badge).
- Capacidad máxima.
- Estado de disponibilidad: **Disponible** (verde) o **No disponible** (rojo).
- Precio por noche.
- Botón **"Seleccionar"** (desactivado si la habitación no está disponible).

> 🔒 Para seleccionar una habitación debes estar **identificado**. Si no lo estás, el sistema te redirigirá automáticamente a la página de inicio de sesión.

---

## 6. Proceso de Reserva

El proceso de reserva consta de tres pasos:

### 6.1 Datos de la Reserva

Tras seleccionar una habitación se abre el formulario de datos (`/booking-details`):

- **Nombre Completo**
- **Correo Electrónico**
- **Teléfono**
- **Número de Huéspedes** (1–4)

En el panel lateral derecho verás el **Resumen de la Reserva**:
- Habitación seleccionada
- Fechas de check-in y check-out
- Precio total calculado automáticamente (`noches × precio por noche`)

Pulsa **"Continuar al Pago"** para avanzar.  
Pulsa **"Cambiar Habitación"** para volver al catálogo.

### 6.2 Pago

En la pantalla de pago (`/payment`) se muestra:

- **Método de pago:** Tarjeta de crédito/débito predeterminada (modo demostración).
- **Resumen final** con noches totales, precio por noche e impuestos incluidos.
- Botón **"Confirmar Pago de $X"** para procesar la reserva.

> ⚠️ Esta aplicación es una demostración académica. No se realizará ningún cargo real a ninguna tarjeta.

### 6.3 Confirmación

Una vez confirmado el pago (`/payment-confirmation`) verás:

- ✅ Mensaje de confirmación con tu nombre y correo electrónico.
- **Código de reserva** (formato `HV-XXXXXXXX`).
- Estado del pago: **Completado**.
- Importe total pagado.

Acciones disponibles:
- 📄 **"Bajar Recibo"** — Descarga un PDF con todos los detalles de la reserva.
- 🏠 **"Continuar"** — Regresa a la página principal.

---

## 7. Mi Perfil

Accede a tu perfil (`/profile`) desde la barra de navegación (icono de usuario o tu nombre). Requiere haber iniciado sesión.

### 7.1 Mis Reservas

Lista todas tus reservas con:
- Código de reserva (8 primeros caracteres del ID).
- Número de habitación.
- Fechas de check-in y check-out.
- Estado: **CONFIRMED** (verde), **CANCELLED** (rojo), etc.
- Importe total.
- Botón **"Descargar Recibo"** → genera un PDF individual para esa reserva.

> ℹ️ Si no tienes reservas, aparecerá el mensaje *"No tienes reservas aún."*

### 7.2 Información Personal

Permite editar tu **Nombre Completo**. El correo electrónico se muestra como campo de solo lectura.

1. Modifica el campo **Nombre Completo**.
2. Pulsa **"Guardar Cambios"**.

### 7.3 Seguridad

Permite cambiar tu contraseña:

1. Introduce la **Nueva Contraseña** (mínimo 8 caracteres).
2. Repite la contraseña en **Confirmar Nueva Contraseña**.
3. Pulsa **"Actualizar Contraseña"**.

> ❌ Si las contraseñas no coinciden o tienen menos de 8 caracteres, el sistema mostrará un mensaje de error.

Para **Cerrar Sesión**, haz clic en el botón correspondiente al final del menú lateral.

---

## 8. Calendario de Disponibilidad

Accede al calendario (`/calendar`) desde el menú o desde el botón **"Ver Calendario"** en los paneles de personal.

- Visualiza todas las reservas en formato de **calendario mensual, semanal o de lista**.
- Haz clic sobre cualquier evento para ver el detalle: habitación, tipo, fechas y total.
- Filtra por estado: **Todas / Confirmadas / Canceladas**.

**Código de colores:**

| Color | Significado |
|---|---|
| 🟡 Dorado | Reserva confirmada |
| 🔴 Rojo | Reserva cancelada |
| ⚫ Gris | Habitación en mantenimiento |
| 🟢 Verde | Disponible |

> 👤 Como **huésped**, solo verás tus propias reservas.  
> 👥 Como **recepcionista o administrador**, verás todas las reservas del hotel.

---

## 9. Panel de Recepción

*(Disponible solo para usuarios con rol **Recepcionista**. Ruta: `/receptionist`)*

El Panel de Recepción está diseñado para gestionar las operaciones diarias del hotel.

### Indicadores en tiempo real

Al acceder se muestran cuatro métricas del día actual:

| Métrica | Descripción |
|---|---|
| **Check-ins Hoy** | Reservas confirmadas con entrada hoy. |
| **Check-outs Hoy** | Reservas confirmadas con salida hoy. |
| **Reservas Activas** | Total de reservas con estado *confirmado*. |
| **Habitaciones Libres** | Habitaciones con estado *disponible*. |

### Pestañas de navegación

| Pestaña | Contenido |
|---|---|
| **Hoy** | Dos columnas: *Check-ins de Hoy* y *Check-outs de Hoy*, con el número de habitación, tipo y fechas. |
| **Reservas** | Tabla completa de todas las reservas con buscador (por ID o número de habitación) y botón de cancelación. |
| **Habitaciones** | Mapa visual del estado de todas las habitaciones (verde = disponible, rojo = ocupada/mantenimiento). |

### Cancelar una reserva

1. Ve a la pestaña **Reservas**.
2. Localiza la reserva (usa el buscador si es necesario).
3. Pulsa el botón **"Cancelar"** en la columna *Acción*.
4. Confirma la acción en el diálogo de confirmación.

> ✅ Solo se pueden cancelar reservas con estado *Confirmada*.

---

## 10. Panel de Administrador

*(Disponible solo para usuarios con rol **Administrador**. Ruta: `/admin`)*

El Panel de Administrador ofrece una visión global del hotel con funcionalidades adicionales de gestión.

### Indicadores globales

| Métrica | Descripción |
|---|---|
| **Reservas Activas** | Total de reservas confirmadas en el sistema. |
| **Habitaciones Libres** | Habitaciones disponibles en este momento. |
| **Ocupación** | Porcentaje de ocupación del hotel. |
| **Ingresos Totales** | Suma de todos los importes de reservas confirmadas. |

### Pestañas de navegación

| Pestaña | Contenido |
|---|---|
| **General** | Indicadores clave + tabla de *Actividad Reciente* (últimas 8 reservas). |
| **Reservas** | Tabla completa con buscador (por ID, habitación o usuario) y filtro por estado. Permite cancelar reservas confirmadas. |
| **Habitaciones** | Mapa visual del estado de las 24 habitaciones del hotel. |

Desde la cabecera del panel también está disponible el acceso directo al **Calendario** de disponibilidad.

---

## 11. Roles y Permisos

El sistema implementa un control de acceso basado en roles (RBAC):

| Función | Huésped | Recepcionista | Administrador |
|---|:---:|:---:|:---:|
| Ver página principal y servicios | ✅ | ✅ | ✅ |
| Buscar habitaciones disponibles | ✅ | ✅ | ✅ |
| Crear una reserva | ✅ | ✅ | ✅ |
| Ver sus propias reservas | ✅ | ✅ | ✅ |
| Descargar recibo PDF | ✅ | ✅ | ✅ |
| Editar perfil y contraseña | ✅ | ✅ | ✅ |
| Ver calendario (reservas propias) | ✅ | — | — |
| Panel de Recepción | ❌ | ✅ | ❌ |
| Ver calendario (todas las reservas) | ❌ | ✅ | ✅ |
| Cancelar cualquier reserva | ❌ | ✅ | ✅ |
| Panel de Administrador | ❌ | ❌ | ✅ |
| Ver ingresos totales y ocupación | ❌ | ❌ | ✅ |

> ℹ️ Los roles son asignados desde la base de datos (`profiles.role`). El registro público crea siempre cuentas con rol **guest**.

---

## 12. Preguntas Frecuentes

**¿Puedo modificar las fechas de una reserva ya confirmada?**  
En este momento el sistema no permite modificar una reserva existente. Deberías cancelarla y crear una nueva.

**¿Cómo cancelo mi reserva?**  
Accede a **Mi Perfil → Mis Reservas**. Actualmente la cancelación desde el panel de huésped no está disponible; ponte en contacto con recepción o el administrador del hotel.

**¿El pago es real?**  
No. Esta aplicación es una demostración académica. Ningún dato de tarjeta es procesado ni se realiza ningún cobro real.

**¿Puedo reservar para más de 4 personas?**  
El sistema permite un máximo de 4 huéspedes por habitación. Para grupos más grandes, contacta directamente con el hotel.

**¿Dónde veo el recibo de mi reserva?**  
En **Mi Perfil → Mis Reservas**, cada reserva tiene un botón **"Descargar Recibo"** que genera un PDF con todos los detalles. También puedes descargarlo en la pantalla de confirmación tras realizar el pago.

**No recuerdo mi contraseña. ¿Qué hago?**  
En la página de inicio de sesión, haz clic en **"¿Olvidaste tu contraseña?"** y sigue las instrucciones enviadas a tu correo electrónico.

**¿Qué significa el estado "Pendiente" en una reserva?**  
Una reserva en estado *Pendiente* está en proceso de confirmación. Una vez procesado el pago correctamente, el estado cambia a *Confirmada*.

---

*Manual generado para el sistema Hotel Vértice · Versión 1.0*
