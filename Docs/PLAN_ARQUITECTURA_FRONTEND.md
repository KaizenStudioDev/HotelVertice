# Análisis y Arquitectura del Frontend - Hotel Vértice

Basado en los diseños de Figma proporcionados, este documento detalla la estructura visual y técnica para implementar el frontend de manera rápida, escalable y mantenible.

## 1. Sistema de Diseño (Design System)

Al extraer los estilos del código provisto por Figma, identificamos un patrón claro de diseño y paleta de colores. Esto nos permite definir variables o constantes globales de CSS/Tailwind que acelerarán el desarrollo en más de un 50%.

### Paleta de Colores
*   **Dorado / Acento (Brand)**: `#D4AF37` (Utilizado para títulos destacados, botones principales de llamado a la acción, iconos y acentos).
*   **Fondo Oscuro / Primario**: `#1A1A2E` (Utilizado para la barra de navegación (Navbar), el pie de página (Footer), fondos de secciones Hero, y textos dentro de botones dorados).
*   **Fondo Claro / Neutro**: `#FFFFFF` (Blanco puro, usado en la mayoría de contenidos, contenedores y tarjetas).
*   **Fondos Secundarios / Grises**: `#F3F3F5` (Fondo de Inputs), `#ECEEF2` (Fondos de secciones para contraste modal) y `rgba(0, 0, 0, 0.05)`.
*   **Alertas y Estados**: Verde (`#00A63E`, `#DCFCE7` para éxito y "Pago Confirmado"), Rojo (`#D4183D` para acciones peligrosas o cancelaciones).

### Tipografía
*   **Títulos, Nombres de Hotel, Encabezados Elegantes**: `Playfair Display`. Le da al sitio un toque de lujo y exclusividad.
*   **Cuerpo de Texto, Botones, Menús, Formularios**: `Inter`. Tipografía moderna y altamente legible para la funcionalidad del sitio.
*   **Elementos especiales (Tickets, IDs)**: `Consolas`.

## 2. Componentes UI Reutilizables (UI Kit)

Para no repetir código y hacer la implementación muy rápida, el primer paso en el código será crear estos "building blocks":

1.  **Botones (`Button`)**:
    *   `primary`: Fondo dorado (`#D4AF37`), texto oscuro (`#1A1A2E`).
    *   `secondary`/`dark`: Fondo oscuro (`#1A1A2E`), texto blanco.
    *   `outline`: Fondo blanco, borde dorado o gris.
2.  **Formularios (`Input`, `Select`, `Checkbox`)**:
    *   Elementos con fondo `#F3F3F5`, sin bordes agresivos, texto gris secundario `#717182` para etiquetas (labels) y negro para el texto introducido (`#0A0A0A`). Bordes redondeados (`10px` o `12px`).
3.  **Tarjetas (`Card`)**: Contenedores blancos con borde de `1px rgba(0, 0, 0, 0.10)` y `border-radius: 16px`. Usados para habitaciones, perfil de usuario, resumen de precios.
4.  **Insignias (`Badge`)**: Pequeños contenedores (ej. estado "Confirmada" o capacidades de habitación).
5.  **Navbar y Footer**: Componentes globales.

## 3. Estructura de Vistas (Pages / Rutas)

Las vistas requeridas según el diseño son:

*   `/` - **Landing Page**: Inicio con el buscador principal, presentación, recomendaciones "Suite Premium", "Oferta Especial".
*   `/login` - **Login**: Pantalla de inicio de sesión de usuario y administrador.
*   `/register` - **Registro**: Crear cuenta de usuario.
*   `/features` - **Características**: Vistas e imágenes del hotel, comodidades (Spa, Gimnasio).
*   `/rooms` - **Selección de Habitaciones**: Lista de habitaciones con filtros (Vistas, Planta).
*   `/booking` - **Detalles de Reserva**: Paso 1 del checkout (datos del huésped).
*   `/payment` - **Pago**: Resumen del precio final, método de pago.
*   `/payment/confirmation` - **Confirmación**: Ticket de compra exitosa.
*   `/profile` - **Perfil de Usuario**: Información personal, mis reservas (historial), seguridad (cambiar contraseña).
*   `/admin` - **Panel de Administración**: Gestión de reservas, habitaciones y reportes.

## 4. Estrategia Técnica de Implementación

Para asegurar un desarrollo fácil y alineado al diseño:

1.  **Tecnologías Clave**: React + Vite + TypeScript.
2.  **Tailwind CSS**: Los diseños de Figma son totalmente compatibles con clases utilitarias de Tailwind. Configurar la paleta de colores y las tipografías mencionadas arriba en `tailwind.config.ts` será el primer paso. Nos ahorrará hacer archivos CSS kilométricos.
3.  **Estado Global del Checkout (Zustand o Context API)**: El flujo `Selección de Habitación -> Detalles Cliente -> Pago` requiere recordar el estado en la memoria del navegador. Una pequeña store para "Reserva Activa" almacenará las fechas, habitación y precio temporalmente hasta confirmarlo en el Backend.
4.  **Rutas React (React Router DOM)**: Para navegar entre los diferentes pasos del checkout sin recargar la página. Peticiones de API a NodeJS usando Axios o Fetch básico.

## 4. Estrategia Técnica de Implementación por Fases

Para garantizar una calidad de producción (pulido) y no dejar ningún detalle por fuera, dividiremos el desarrollo del frontend en las siguientes **Fases Estrictas**:

### Fase 1: Configuración Base y Esqueleto Global
- Inicializar Vite + React + TypeScript.
- Configurar Tailwind CSS, añadiendo la paleta de colores y las fuentes (`Playfair Display` e `Inter`) definidas en el Diseño.
- Configurar React Router DOM y crear la estructura básica de carpetas (`pages`, `components`, `hooks`, `context`).
- Implementar los componentes globales (Layout): **Navbar** y **Footer**, asegurando que sean *responsive*.

### Fase 2: UI Kit (Construcción de Bloques Primitivos)
- Desarrollar `Button` (variantes: primario, secundario, outline).
- Desarrollar `Input`, `Select` y contenedores de formularios reutilizables con validación visual.
- Desarrollar `Card` base y `Badge` (etiquetas de estado).
- *Objetivo: Que ensamblar páginas siguientes sea tan fácil como armar legos.*

### Fase 3: Páginas Informativas y Acceso (Vistas Públicas)
- Construir la **Landing Page** (Hero, secciones destacadas, testimonios).
- Construir la página de **Features** (Servicios, Spa, Gimnasio).
- Construir el flujo de autenticación simple: **Login Page** y **Register Page**.

### Fase 4: El Motor de Reservas (Core Flow)
- Construcción de la vista de **Room Selection** (Filtros, Cards detalladas de habitaciones).
- Construcción de la vista de **Booking Details** (Formulario del huésped).
- Construcción de la vista de **Payment Page** (Desglose de precio, formulario de tarjeta) y **Payment Confirmation**.
- Integración de Zustand o Context API para manejar el *Booking State* (fechas, habitación, totales) fluyendo entre estas páginas.

### Fase 5: Panel Privado (Usuario y Admin)
- Construir el **User Profile** (Mis Reservas, Editar Perfil, Seguridad UI).
- Construir el esqueleto básico del **Admin Dashboard** (Gestión visual de reservas).

### Fase 6: Conexión Final (Integración Backend) y Pulido Mágico
- Reemplazar mock data con conectividad a la API Creada en el Backend (Axios + TanStack Query).
- Añadir micro-animaciones (Hover states, transiciones fluidas de páginas, load states, toast notifications).
- Correcciones finales de diseño responsivo (Mobile-first check).
