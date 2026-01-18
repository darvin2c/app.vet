# Reglas del pryecto

Proyecto saas, en este proyecto implementaremos todo lo que esta dentro del tenant

Para formatear el documento debes de usar prettier

```bash
pnpm typecheck
pnpm format
```

- Antes de terminar de implementar una nueva funcion siempre debes de ejecutar `pnpm typecheck`, y corregir los errores de tipado.

## Estructura de carpetas

```
src/
├── app/
│   ├── (auth)/ # todas las rutas que requieren autenticación, pero son independientes de tenant
│   │   └── ...
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── <feature>/
│   │   ├── <feature>-form.tsx # Dentro de form solo debe de tener los field necesarios para el formulario, no la logica del formulario.
│   │   ├── <feature>-list.tsx
│   │   ├── <feature>-<edit/create>.tsx # debes de usar un `./sheet.tsx` para mostrar el formulario
│   │   ├── <feature>-import.tsx # debes de usar un `./data-import` para mostrar el importador dentro de un Sheet
│   │   ├── <feature>-delete.tsx  # debe de usar ui/alert-confirmation
│   │   ├── <feature>-actions.tsx
│   │   └── <feature>-select.tsx # solo cuando se necesita
│   └── ui/ # componentes reutilizables no deben de ser modificados salvo escepciones.
├── lib/
├── types/
│   └── supabase.types.ts # tipos de supabase
├── schemas/
│   └── <feature>.schema.ts # esquema de la tabla
└── hooks/ # hooks reutilizables
    └── <feature>/
        └── use-<feature>-<action>.ts
```

Los archivos deben de estar siempre dentro de su carpeta de `feature`, excepto los archivos que se encuentren en `ui/`

## Auth

Para el sistema de autenticación se usara supabase auth

- Documentación: https://supabase.com/docs/guides/auth/server-side/nextjs

## Base de datos

Para la base de datos se usara supabase

- los tipos de supabase estaran en `types/supabase.ts`
- se deben de usar los tipos de datos de supabase para las consultas y mutaciones
- _No_ crear mas tipo de datos, salvo sea muy necesario

```typescript
import { Database, Tables, Enums } from './types/supabase.types.ts'

type resource = Tables<'resources'>
```

- hooks de mutaciones deben usar los tipos de datos de supabase `Tables<'resources'>`
- query key debe de ser `[currentTenant?.id, 'resources', ...]`

_correcto_

```typescript
export function useResourceCreate() {
  return useMutation({
    mutationFn: (data: Omit<TablesInsert<'resources'>, 'tenant_id'>)
  })
}

export function useResourceUpdate() {
  return useMutation({
    mutationFn: ({id, data}: {
      id: string
      data: Omit<TablesUpdate<'resources'>, 'tenant_id'>
    })
}

export function useResourceDelete() {
  return useMutation({
    mutationFn: (id: string)
  })
}

export function useResourceList(({
  filters = [],
  search,
  orders = [
    {
      field: 'created_at',
      ascending: false,
      direction: 'desc',
    },
  ],
}: {
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
})) {
  return useQuery({
    queryKey: [currentTenant?.id, 'resources'],
    queryFn: () => ...
  })
}

```

- cada entidad/feature debe de tener su carpeta para los hooks

**incorrecto**

```bat
// hooks
/src/hooks/<feature>/
use-feature-feature2.ts
use-feature-feature2-action.ts
```

**correcto**

```bat
// hooks
/src/hooks/<feature>/
use-feature-action.ts
/src/hooks/<feature2>/
use-feature2-action.ts
```

**Enums**

- Para los enums se usara los tipos de datos de supabase `Enums<'record_type'>`

```typescript
type RecordType = {
  value: Enums<'record_type'>
  label: string
  icon: React.ReactNode
}

export default function useRecordType() {
  const recordTypes = useMemo<RecordType[]>(...)

  const getRecordType = (value: Enums<'record_type'>) => {
   ...
  }

  return {
    recordTypes,
    getRecordType,
  }
}
```

## fetch

Para las consultas y mutaciones de la base de datos se debe de usar react-query en `use-<feature>-<action>.ts`

## Table

- Para tablas o listas debe de usarse react-table

## Delete Form

- Para formularios de eliminación debe de usarse ui/alert-confirmation, y se pedira ingresar una palabra de confirmación

## style

- Se usara los componentes de ui.shadcn y se instalaran los componentes usando `pnpm dlx shadcn@latest add <component>`
- Los estilos de los componentes seran por defecto, solo se modificara en algunas escepciones
- usa la documentación https://ui.shadcn.com/docs/components

## Estados

- Para los estados se usara zustand
- Solo se usara estados globales, unicamente cuando sea necesario

## Forms

- Para los formularios se usara `react-hook-form`
- Para la validación se usara `zod`
- Para los formularios en sheet (paneles laterales) se debe usar el componente `FormSheet` ubicado en `@/components/ui/form-sheet`. Este componente maneja la advertencia de cambios sin guardar y la estructura estándar.

**Correcto**

```typescript
z.email('Formato de email inválido') // para validar correo electronico  y que no este vacio
z.email('Formato de email inválido').optional().or(z.literal('')) // para validar correo electronico y que pueda estar vacio
z.nonempty('El campo es requerido') // para validar que no este vacio
```

**Incorrecto**

```typescript
z.string().email('Formato de email inválido') // para validar correo electronico  y que no este vacio
```

- `<feature>-form.tsx` debe de tener solo los campos necesarios para el formulario, no la logica del formulario.

**correcto**

```typescript
export function FeatureForm() {
  // context
  const { form } = useFormContext();
  // watcher para validar el campo username
  const username = form.watch('username');
  useEffect(() => {
    // en caso se requiera
  }, [username]);
  return (
    <div>
      <Field>
        <FieldLabel htmlFor="date_of_birth">Fecha de Nacimiento</FieldLabel>
        <FieldContent>
          <Input
            id="date_of_birth"
            type="date"
            {...control.register('date_of_birth')}
          />
        </FieldContent>
        <FieldError errors={[errors.date_of_birth]} />
      </Field>
    </div>
  );
}
```

**Incorrecto**

```typescript
export function FeatureForm() {
  // esto debe de ir a la acción como <feature>-<create/edit>
  const form = useForm<FeatureSchema>({
    resolver: zodResolver(FeatureSchema),
  });
  return (
    <Form {...form}> // esto debe de ir a la acción como <feature>-<create/edit>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"> // esto debe de ir a la acción como <feature>-<create/edit>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```

### PhoneInput — Reglas de uso

- Dónde usar
  - Formularios: usar `PhoneField` con `react-hook-form`.
  - Entrada directa: `PhoneInput` `variant="form"`.
  - Layouts compactos: `PhoneInput` `variant="compact"` o `PhoneCompactField`.
  - Sólo lectura: `PhoneDisplay`.
- Cuándo usar
  - Cuando necesitas emitir E.164 para WhatsApp/SMS/llamadas.
  - Cuando requieres selector de país: habilita `showCountrySelect` y define `defaultCountry`.
  - Evita usarlo en inputs que no requieren formato internacional.
- Regla clave
  - El `input` muestra sólo dígitos nacionales; el prefijo se muestra aparte.
  - `onChange(value, isValid)` emite E.164 (`+<código-país><nacional>`).
  - `value` en E.164 se visualiza como número nacional y sincroniza país.
  - Paste con `+<código-país>` se limpia a dígitos nacionales.
  - Cambiar país no altera los dígitos del `input`; sólo el E.164 emitido.

## Componentes

- Cuando se crea un componente reutilizable, se debe de agregar la forma de uso en `/app/demo`, solo y unicamente de los componentes reutilizables que esten dentro de `../ui`
- las features no deben de estar dentro de `demo`, se debe de solicitar el permiso para agregarla.
- los componentes reutilisables debe de tener todo dentro del mismo archivo o carpeta, tanto sus hooks y sus tipos.

## Botones de Acción

- Para los botones de acción se usara `ui/responsive-button`
- Los botones de acción (Crear, Actualizar, Cancelar, etc.) **NO** deben estar dentro del componente `<feature>-form.tsx`
- Los botones de acción deben estar en los componentes de acción: `<feature>-create.tsx` y `<feature>-edit.tsx`
- En formularios con `sheet.tsx` con el compondente `Sheet`, los botones deben ubicarse en el `SheetFooter`, _no_ usar `drawer.tsx`
- Los componentes de acción manejan la lógica del formulario, estados de carga y envío

## Páginas

- Las páginas deben de tener un `PageBase` para el encabezado y el contenido
- El encabezado debe de tener el título, subtítulo, búsqueda y filtros

```typescript
export default function ResourcePage() {
  // Configuración de filtros
  const filters: FilterConfig[] = [
    ...
  ]

  const orderByConfig: OrderByConfig = {
    columns: [
     ...
    ],
  }

  return (
    <PageBase
      title="..."
      subtitle="..."
      search={
        <SearchInput
          hasSidebarTrigger
          placeholder="..."
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters filters={filters} />
              <OrderBy config={orderByConfig} />
              <ProductCreateButton />
            </ButtonGroup>
          }
        />
      }
    >
      <ResourceList filterConfig={filters} orderByConfig={orderByConfig} />
    </PageBase>
  )
}
```

## Listas

- Para listas se debe de usar `react-table`, y se debe de mostrar tanto en `table`, `cards` y `list`
- Para la vista `cards` se debe de usar el componente `Card`
- Para la vista `list` se debe de usar el componente `ItemGroup`
- Para la vista `table` se debe de usar el componente `Table`

```typescript
// state loading: table-skeleton
if (isLoading) {
}
// state empty: empty
if (patients.length === 0) {
}
```

## Calendar o agenda

- para las fechas y hora debes de usar `date-fns`

## Fechas

- para el uso de fechas se debe de usar `date-fns`, versión mayor a `4.0.0`
- Todas las fecha deben de ser manejadas con timezone, y debe de ser guardadas en UTC.
- Toda interacción con la base de datos debe de ser en UTC, dentro de los hooks se debe de cambiar `date.toUTCString()`
- Todas las fechas mostradas en la interfaz de usuario deben de ser convertidas a la timezone del usuario o del navegador

**Notas**

- antes de finalizar siempre ejecuta `pnpm typecheck`
- Los componentes debe de quedar siempre limpios, eliminar codigo que no se use.

**ui.shadcn**
https://ui.shadcn.com/llms.txt
