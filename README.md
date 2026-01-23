# VetManager 360 - Sistema de Gestión Veterinaria

Sistema integral de gestión para clínicas y hospitales veterinarios. Permite gestionar citas, historiales médicos, inventario, facturación, hospitalización y más en una plataforma unificada.

## 🚀 Características

### Módulos Principales

- 📅 **Citas y Agenda**: Gestión completa de citas con calendario visual
- 🐾 **Mascotas**: Registro y seguimiento de pacientes con historial médico
- 👥 **Clientes**: Base de datos de propietarios con información de contacto
- 💊 **Inventario**: Control de productos, medicamentos y movimientos de stock
- 🏥 **Hospitalización**: Gestión de pacientes internados
- 💰 **Facturación**: Órdenes de venta y control de pagos
- 📋 **Servicios**: Catálogo de servicios veterinarios
- 👨‍⚕️ **Personal**: Gestión de staff y especialidades

### Stack Tecnológico

- **Frontend**: Next.js 16 con App Router
- **Lenguaje**: TypeScript para type safety
- **Estilos**: Tailwind CSS + shadcn/ui components
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Estado**: Zustand para state management
- **Formularios**: React Hook Form + Zod validation
- **Tablas**: React Table (TanStack Table)

## 📦 Componentes Disponibles

### Componentes UI Reutilizables

- **AddressInput**: Entrada de direcciones con autocompletado de Google Maps
- **SearchInput**: Búsqueda con persistencia en URL y debounce
- **ResponsiveButton**: Botón adaptativo (desktop: ícono + texto, mobile: solo ícono)
- **AlertConfirmation**: Confirmaciones de eliminación con validación
- **Filters**: Sistema de filtros basado en operadores de Supabase
- **Field**: Sistema de campos de formulario con validación
- **InputGroup**: Grupos de inputs con addons y botones

### Páginas de Demo

Visita `/demo` para ver ejemplos interactivos de todos los componentes.

## 🛠️ Configuración

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd app.vet
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales reales. Las variables necesarias son:

#### Supabase (Requerido)

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

Obtén estas credenciales en [Supabase Dashboard](https://supabase.com/dashboard) > Settings > API

#### Google Maps API (Requerido para AddressInput)

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key
```

Ver instrucciones detalladas en la sección siguiente.

#### Email SMTP (Opcional)

```env
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=resend
SMTP_PASS=tu_smtp_password
SMTP_FROM=no-reply@tudominio.com
```

#### Otras configuraciones

```env
NEXT_PUBLIC_DOMAIN=lvh.me
NEXT_AUTH_URL=http://auth.lvh.me:3000
```

### 4. Configurar Google Maps API

Para usar el componente `AddressInput`:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Places API** y **Maps JavaScript API**
4. Crea una API key en **Credentials**
5. Agrega la API key a tu archivo `.env.local`

### 5. Ejecutar en desarrollo

```bash
pnpm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── (auth)/          # Rutas que requieren autenticación
│   ├── demo/            # Páginas de demostración
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── <feature>/       # Componentes por feature
│   │   ├── <feature>-form.tsx
│   │   ├── <feature>-list.tsx
│   │   ├── <feature>-create.tsx
│   │   ├── <feature>-edit.tsx
│   │   └── <feature>-delete.tsx
│   └── ui/              # Componentes reutilizables
├── hooks/               # Hooks personalizados
├── lib/                 # Utilidades y configuración
├── schemas/             # Esquemas de validación Zod
├── types/               # Tipos TypeScript
└── providers/           # Providers de contexto
```

## 🎨 Sistema de Diseño

### Componentes Base

- Basado en **shadcn/ui** y **Radix UI**
- Tema personalizable con CSS variables
- Soporte para modo oscuro
- Componentes accesibles por defecto

### Instalación de Nuevos Componentes

```bash
pnpm dlx shadcn@latest add <component>
```

### Patrones de Formularios

```typescript
// Usar Field en lugar de FormField
<Field>
  <FieldLabel>Nombre</FieldLabel>
  <FieldContent>
    <Input {...field} />
  </FieldContent>
  <FieldError>{error}</FieldError>
</Field>
```

### Validación con Zod

```typescript
// Correcto
z.email('Formato de email inválido')
z.nonempty('El campo es requerido')

// Para campos opcionales
z.email('Formato de email inválido').optional().or(z.literal(''))
```

## 🧪 Testing y Calidad

### Comandos Disponibles

```bash
# Verificar tipos TypeScript
pnpm run typecheck

# Formatear código con Prettier
pnpm run format

# Linting
pnpm run lint

# Build de producción
pnpm run build
```

### Antes de Commit

Siempre ejecuta antes de hacer commit:

```bash
pnpm run typecheck
pnpm run format
```

## 📚 Documentación de Componentes

### AddressInput

Componente de entrada de direcciones con autocompletado:

```typescript
<AddressInput
  value={address}
  onChange={setAddress}
  onAddressSelect={(place) => console.log(place)}
  placeholder="Buscar dirección..."
  size="md"
  debounceMs={300}
/>
```

### SearchInput

Componente de búsqueda con persistencia en URL:

```typescript
<SearchInput
  placeholder="Buscar..."
  urlKey="search"
  debounceMs={300}
  showShortcuts
/>
```

### ResponsiveButton

Botón que se adapta al dispositivo:

```typescript
<ResponsiveButton
  icon={<Plus />}
  text="Crear Nuevo"
  onClick={handleCreate}
/>
```

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard
3. Despliega automáticamente

### Variables de Entorno en Producción

Asegúrate de configurar todas las variables necesarias:

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 🤝 Contribución

1. Sigue las reglas del proyecto definidas en `.trae/rules/project_rules.md`
2. Usa el sistema de componentes existente
3. Ejecuta `pnpm run typecheck` antes de hacer commit
4. Documenta nuevos componentes en `/demo`

## 📄 Licencia

[Especificar licencia]

---

Para más información sobre componentes específicos, visita la página de demos en `/demo`.
