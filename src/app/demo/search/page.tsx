'use client'

import { useState } from 'react'
import { SearchInput } from '@/components/ui/search-input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Filter,
  Settings,
  User,
  Bell,
  Search as SearchIcon,
  ChevronDown,
  Grid3X3,
  List,
} from 'lucide-react'

export default function SearchDemoPage() {
  const [basicValue, setBasicValue] = useState('')
  const [suffixValue, setSuffixValue] = useState('')
  const [shortcutValue, setShortcutValue] = useState('')
  const [loadingValue, setLoadingValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [smallValue, setSmallValue] = useState('')
  const [largeValue, setLargeValue] = useState('')
  const [noClearValue, setNoClearValue] = useState('')
  const [combinedValue, setCombinedValue] = useState('')

  // Nuevos estados para los demos con botones
  const [filterValue, setFilterValue] = useState('')
  const [multiButtonValue, setMultiButtonValue] = useState('')
  const [actionValue, setActionValue] = useState('')
  const [dropdownValue, setDropdownValue] = useState('')
  const [toggleValue, setToggleValue] = useState('')
  const [isGridView, setIsGridView] = useState(false)

  const simulateLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Search Component Demos</h1>
        <p className="text-muted-foreground">
          Ejemplos interactivos del componente Search reutilizable con todas sus
          funcionalidades. Todos los ejemplos guardan automáticamente en la URL
          con diferentes parámetros.
        </p>
      </div>

      {/* Búsqueda Básica */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">1. Búsqueda Básica</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Búsqueda simple con debounce de 300ms por defecto. El valor se
            actualiza en la URL con el parámetro <code>?basic=</code>.
          </p>
        </div>
        <SearchInput
          urlParamName="basic"
          onValueChange={setBasicValue}
          placeholder="Buscar productos..."
        />
        <p className="text-sm text-muted-foreground">
          Valor actual: <span className="font-mono">{basicValue}</span>
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Código:</p>
          <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
            {`<SearchInput
  urlParamName="basic"
  onValueChange={setBasicValue}
  placeholder="Buscar productos..."
/>`}
          </pre>
        </div>
      </section>

      {/* Búsqueda con Suffix */}
      <section className="space-y-4 border-t pt-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            2. Búsqueda con Suffix
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Búsqueda con un badge como suffix. Parámetro URL:{' '}
            <code>?suffix=</code>.
          </p>
        </div>
        <SearchInput
          urlParamName="suffix"
          onValueChange={setSuffixValue}
          placeholder="Buscar con suffix..."
          suffix={<Badge variant="secondary">Pro</Badge>}
        />
        <p className="text-sm text-muted-foreground">
          Valor actual: <span className="font-mono">{suffixValue}</span>
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Código:</p>
          <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
            {`<SearchInput
  urlParamName="suffix"
  onValueChange={setSuffixValue}
  placeholder="Buscar con suffix..."
  suffix={<Badge variant="secondary">Pro</Badge>}
/>`}
          </pre>
        </div>
      </section>

      {/* Búsqueda con Keyboard Shortcut */}
      <section className="space-y-4 border-t pt-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            3. Búsqueda con Atajo de Teclado
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Presiona{' '}
            <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded border">
              Ctrl+K
            </kbd>{' '}
            para enfocar el campo. Parámetro URL: <code>?shortcut=</code>.
          </p>
        </div>
        <SearchInput
          urlParamName="shortcut"
          onValueChange={setShortcutValue}
          placeholder="Presiona Ctrl+K para enfocar..."
          enableShortcut
        />
        <p className="text-sm text-muted-foreground">
          Valor actual: <span className="font-mono">{shortcutValue}</span>
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Código:</p>
          <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
            {`<SearchInput
  urlParamName="shortcut"
  onValueChange={setShortcutValue}
  placeholder="Presiona Ctrl+K para enfocar..."
  enableShortcut
/>`}
          </pre>
        </div>
      </section>

      {/* Búsqueda con Loading */}
      <section className="space-y-4 border-t pt-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            4. Búsqueda con Estado de Carga
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Muestra un spinner de carga. Parámetro URL: <code>?loading=</code>.
          </p>
        </div>
        <div className="space-y-2">
          <SearchInput
            urlParamName="loading"
            onValueChange={setLoadingValue}
            placeholder="Búsqueda con loading..."
            isLoading={isLoading}
          />
          <Button onClick={simulateLoading} disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Simular Loading'}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Valor actual: <span className="font-mono">{loadingValue}</span>
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Código:</p>
          <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
            {`<SearchInput
  urlParamName="loading"
  onValueChange={setLoadingValue}
  placeholder="Búsqueda con loading..."
  isLoading={isLoading}
/>`}
          </pre>
        </div>
      </section>

      {/* Diferentes Tamaños */}
      <section className="space-y-4 border-t pt-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">5. Diferentes Tamaños</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Tamaños disponibles: sm, default, lg. Parámetros URL:{' '}
            <code>?small=</code> y <code>?large=</code>.
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Tamaño Small (sm)</p>
            <SearchInput
              urlParamName="small"
              onValueChange={setSmallValue}
              placeholder="Búsqueda pequeña..."
              size="sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Valor: <span className="font-mono">{smallValue}</span>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Tamaño Large (lg)</p>
            <SearchInput
              urlParamName="large"
              onValueChange={setLargeValue}
              placeholder="Búsqueda grande..."
              size="lg"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Valor: <span className="font-mono">{largeValue}</span>
            </p>
          </div>
        </div>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Código:</p>
          <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
            {`// Tamaño pequeño
<SearchInput size="sm" urlParamName="small" />

// Tamaño grande  
<SearchInput size="lg" urlParamName="large" />`}
          </pre>
        </div>
      </section>

      {/* Sin Botón Clear */}
      <section className="space-y-4 border-t pt-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            6. Sin Botón de Limpiar
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Búsqueda sin el botón X para limpiar. Parámetro URL:{' '}
            <code>?noclear=</code>.
          </p>
        </div>
        <SearchInput
          urlParamName="noclear"
          onValueChange={setNoClearValue}
          placeholder="Sin botón clear..."
          showClear={false}
        />
        <p className="text-sm text-muted-foreground">
          Valor actual: <span className="font-mono">{noClearValue}</span>
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Código:</p>
          <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
            {`<SearchInput
  urlParamName="noclear"
  onValueChange={setNoClearValue}
  placeholder="Sin botón clear..."
  showClear={false}
/>`}
          </pre>
        </div>
      </section>

      {/* Ejemplo Combinado */}
      <section className="space-y-4 border-t pt-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">7. Ejemplo Combinado</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Combinando múltiples características: tamaño grande, suffix, atajo
            de teclado y debounce personalizado. Parámetro URL:{' '}
            <code>?combined=</code>.
          </p>
        </div>
        <SearchInput
          urlParamName="combined"
          onValueChange={setCombinedValue}
          placeholder="Búsqueda avanzada..."
          size="lg"
          enableShortcut
          debounceMs={500}
          suffix={<Badge variant="outline">Advanced</Badge>}
        />
        <p className="text-sm text-muted-foreground">
          Valor actual: <span className="font-mono">{combinedValue}</span>
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Código:</p>
          <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
            {`<SearchInput
  urlParamName="combined"
  onValueChange={setCombinedValue}
  placeholder="Búsqueda avanzada..."
  size="lg"
  enableShortcut
  debounceMs={500}
  suffix={<Badge variant="outline">Advanced</Badge>}
/>`}
          </pre>
        </div>
      </section>

      {/* Información sobre URL State */}
      <section className="space-y-4 border-t pt-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            📌 Información sobre URL State
          </h2>
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>
                Todos los ejemplos guardan automáticamente en la URL:
              </strong>
            </p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
              <li>
                • Cada búsqueda usa un parámetro URL diferente para evitar
                conflictos
              </li>
              <li>• Los valores se mantienen al recargar la página</li>
              <li>• Se puede compartir la URL con los valores de búsqueda</li>
              <li>
                • El debounce solo afecta al callback <code>onValueChange</code>
                , no a la URL
              </li>
              <li>• La URL se actualiza inmediatamente al escribir</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Ejemplos con Botones en Suffix */}
      <section className="space-y-4 border-t pt-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            8. Botón de Filtro en Suffix
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Búsqueda con botón de filtro que simula abrir un panel de filtros.
            Parámetro URL: <code>?filter=</code>.
          </p>
        </div>
        <SearchInput
          urlParamName="filter"
          onValueChange={setFilterValue}
          placeholder="Buscar productos con filtros..."
          suffix={
            <Button
              size="sm"
              variant="ghost"
              onClick={() => alert('Abriendo panel de filtros...')}
            >
              <Filter className="h-4 w-4" />
            </Button>
          }
        />
        <p className="text-sm text-muted-foreground">
          Valor actual: <span className="font-mono">{filterValue}</span>
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Código:</p>
          <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
            {`<SearchInput
  urlParamName="filter"
  onValueChange={setFilterValue}
  placeholder="Buscar productos con filtros..."
  suffix={
    <Button
      size="sm"
      variant="ghost"
      onClick={() => alert('Abriendo panel de filtros...')}
    >
      <Filter className="h-4 w-4" />
    </Button>
  }
/>`}
          </pre>
        </div>
      </section>

      {/* Múltiples Botones */}
      <section className="space-y-4 border-t pt-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            9. Múltiples Botones en Suffix
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Búsqueda con varios botones pequeños para diferentes acciones.
            Parámetro URL: <code>?multibutton=</code>.
          </p>
        </div>
        <SearchInput
          urlParamName="multibutton"
          onValueChange={setMultiButtonValue}
          placeholder="Búsqueda con múltiples acciones..."
          suffix={
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => console.log('Configuración clickeada')}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => console.log('Usuario clickeado')}
              >
                <User className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => console.log('Notificaciones clickeadas')}
              >
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          }
        />
        <p className="text-sm text-muted-foreground">
          Valor actual: <span className="font-mono">{multiButtonValue}</span>
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Código:</p>
          <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
            {`<SearchInput
  urlParamName="multibutton"
  suffix={
    <div className="flex items-center gap-1">
      <Button size="sm" variant="ghost">
        <Settings className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="ghost">
        <User className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="ghost">
        <Bell className="h-4 w-4" />
      </Button>
    </div>
  }
/>`}
          </pre>
        </div>
      </section>

      {/* Botón de Acción */}
      <section className="space-y-4 border-t pt-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            10. Botón de Acción en Suffix
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Búsqueda con botón "Buscar" que ejecuta una acción específica.
            Parámetro URL: <code>?action=</code>.
          </p>
        </div>
        <SearchInput
          urlParamName="action"
          onValueChange={setActionValue}
          placeholder="Escribe y presiona Buscar..."
          suffix={
            <Button
              size="sm"
              onClick={() => {
                if (actionValue) {
                  alert(`Buscando: "${actionValue}"`)
                } else {
                  alert('Ingresa un término de búsqueda')
                }
              }}
            >
              <SearchIcon className="h-4 w-4 mr-1" />
              Buscar
            </Button>
          }
        />
        <p className="text-sm text-muted-foreground">
          Valor actual: <span className="font-mono">{actionValue}</span>
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Código:</p>
          <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
            {`<SearchInput
  urlParamName="action"
  onValueChange={setActionValue}
  placeholder="Escribe y presiona Buscar..."
  suffix={
    <Button
      size="sm"
      onClick={() => {
        if (actionValue) {
          alert(\`Buscando: "\${actionValue}"\`)
        } else {
          alert('Ingresa un término de búsqueda')
        }
      }}
    >
      <SearchIcon className="h-4 w-4 mr-1" />
      Buscar
    </Button>
  }
/>`}
          </pre>
        </div>
      </section>

      {/* Botón Dropdown */}
      <section className="space-y-4 border-t pt-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            11. Botón Dropdown en Suffix
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Búsqueda con botón que simula un menú desplegable de opciones.
            Parámetro URL: <code>?dropdown=</code>.
          </p>
        </div>
        <SearchInput
          urlParamName="dropdown"
          onValueChange={setDropdownValue}
          placeholder="Búsqueda con opciones..."
          suffix={
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const options = ['Productos', 'Usuarios', 'Pedidos', 'Reportes']
                const selected =
                  options[Math.floor(Math.random() * options.length)]
                alert(`Opción seleccionada: ${selected}`)
              }}
            >
              <ChevronDown className="h-4 w-4 mr-1" />
              Opciones
            </Button>
          }
        />
        <p className="text-sm text-muted-foreground">
          Valor actual: <span className="font-mono">{dropdownValue}</span>
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Código:</p>
          <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
            {`<SearchInput
  urlParamName="dropdown"
  onValueChange={setDropdownValue}
  placeholder="Búsqueda con opciones..."
  suffix={
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        const options = ['Productos', 'Usuarios', 'Pedidos']
        const selected = options[Math.floor(Math.random() * options.length)]
        alert(\`Opción seleccionada: \${selected}\`)
      }}
    >
      <ChevronDown className="h-4 w-4 mr-1" />
      Opciones
    </Button>
  }
/>`}
          </pre>
        </div>
      </section>

      {/* Botón Toggle */}
      <section className="space-y-4 border-t pt-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            12. Botón Toggle en Suffix
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Búsqueda con botón toggle que cambia entre vista lista y grid.
            Parámetro URL: <code>?toggle=</code>.
          </p>
        </div>
        <SearchInput
          urlParamName="toggle"
          onValueChange={setToggleValue}
          placeholder="Búsqueda con vista toggle..."
          suffix={
            <Button
              size="sm"
              variant={isGridView ? 'default' : 'outline'}
              onClick={() => {
                setIsGridView(!isGridView)
                console.log(
                  `Vista cambiada a: ${!isGridView ? 'Grid' : 'Lista'}`
                )
              }}
            >
              {isGridView ? (
                <>
                  <Grid3X3 className="h-4 w-4 mr-1" />
                  Grid
                </>
              ) : (
                <>
                  <List className="h-4 w-4 mr-1" />
                  Lista
                </>
              )}
            </Button>
          }
        />
        <p className="text-sm text-muted-foreground">
          Valor actual: <span className="font-mono">{toggleValue}</span> |
          Vista:{' '}
          <span className="font-mono">{isGridView ? 'Grid' : 'Lista'}</span>
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Código:</p>
          <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
            {`const [isGridView, setIsGridView] = useState(false)

<SearchInput
  urlParamName="toggle"
  onValueChange={setToggleValue}
  placeholder="Búsqueda con vista toggle..."
  suffix={
    <Button
      size="sm"
      variant={isGridView ? "default" : "outline"}
      onClick={() => {
        setIsGridView(!isGridView)
        console.log(\`Vista cambiada a: \${!isGridView ? 'Grid' : 'Lista'}\`)
      }}
    >
      {isGridView ? (
        <>
          <Grid3X3 className="h-4 w-4 mr-1" />
          Grid
        </>
      ) : (
        <>
          <List className="h-4 w-4 mr-1" />
          Lista
        </>
      )}
    </Button>
  }
/>`}
          </pre>
        </div>
      </section>

      {/* Props Disponibles */}
      <section className="space-y-4 border-t pt-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">⚙️ Props Disponibles</h2>
          <div className="bg-muted p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Props Principales:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    <code>urlParamName</code> - Nombre del parámetro URL
                  </li>
                  <li>
                    <code>onValueChange</code> - Callback con debounce
                  </li>
                  <li>
                    <code>debounceMs</code> - Tiempo de debounce (300ms)
                  </li>
                  <li>
                    <code>placeholder</code> - Texto placeholder
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Props de UI:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    <code>size</code> - sm | default | lg
                  </li>
                  <li>
                    <code>suffix</code> - Elemento al final
                  </li>
                  <li>
                    <code>isLoading</code> - Muestra spinner
                  </li>
                  <li>
                    <code>showClear</code> - Botón limpiar (true)
                  </li>
                  <li>
                    <code>enableShortcut</code> - Ctrl+K (false)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nuevos demos con botones en el suffix */}
      <section className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            Ejemplos con Botones en el Suffix
          </h2>
          <p className="text-muted-foreground">
            Diferentes formas de usar botones dentro del prop{' '}
            <code>suffix</code> del componente Search.
          </p>
        </div>

        {/* Demo 8: Botón de Filtro */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">8. Botón de Filtro</h3>
            <p className="text-muted-foreground">
              Búsqueda con botón de filtro para abrir opciones avanzadas.
              Parámetro URL: <code>?filter-search=</code>.
            </p>
          </div>

          <SearchInput
            placeholder="Buscar productos..."
            urlParamName="filter-search"
            onValueChange={(value) => {
              setFilterValue(value)
              console.log('Búsqueda con filtro:', value)
            }}
            suffix={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  alert('Abriendo filtros avanzados...')
                  console.log('Filtros abiertos para:', filterValue)
                }}
                className="h-8 px-2"
              >
                <Filter className="h-4 w-4" />
              </Button>
            }
          />

          <div className="text-sm text-muted-foreground">
            <strong>Valor actual:</strong> {filterValue || 'vacío'}
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Código de ejemplo:</h4>
            <pre className="text-sm overflow-x-auto">
              {`<SearchInput
  placeholder="Buscar productos..."
  urlParamName="filter-search"
  onValueChange={(value) => console.log('Búsqueda:', value)}
  suffix={
    <Button
      variant="ghost"
      size="sm"
      onClick={() => alert('Abriendo filtros...')}
      className="h-8 px-2"
    >
      <Filter className="h-4 w-4" />
    </Button>
  }
/>`}
            </pre>
          </div>
        </div>

        {/* Demo 9: Múltiples Botones */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">
              9. Múltiples Botones Pequeños
            </h3>
            <p className="text-muted-foreground">
              Búsqueda con varios botones de acción rápida. Parámetro URL:{' '}
              <code>?multi-buttons=</code>.
            </p>
          </div>

          <SearchInput
            placeholder="Buscar en configuración..."
            urlParamName="multi-buttons"
            onValueChange={(value) => {
              setMultiButtonValue(value)
              console.log('Búsqueda multi-botón:', value)
            }}
            suffix={
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    alert('Configuración abierta')
                    console.log('Settings clicked for:', multiButtonValue)
                  }}
                  className="h-8 px-2"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    alert('Perfil de usuario')
                    console.log('User profile for:', multiButtonValue)
                  }}
                  className="h-8 px-2"
                >
                  <User className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    alert('Notificaciones')
                    console.log('Notifications for:', multiButtonValue)
                  }}
                  className="h-8 px-2"
                >
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            }
          />

          <div className="text-sm text-muted-foreground">
            <strong>Valor actual:</strong> {multiButtonValue || 'vacío'}
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Código de ejemplo:</h4>
            <pre className="text-sm overflow-x-auto">
              {`<SearchInput
  placeholder="Buscar en configuración..."
  urlParamName="multi-buttons"
  suffix={
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" className="h-8 px-2">
        <Settings className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 px-2">
        <User className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 px-2">
        <Bell className="h-4 w-4" />
      </Button>
    </div>
  }
/>`}
            </pre>
          </div>
        </div>

        {/* Demo 10: Botón de Acción */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">10. Botón de Acción</h3>
            <p className="text-muted-foreground">
              Búsqueda con botón "Buscar" para ejecutar la búsqueda manualmente.
              Parámetro URL: <code>?action-search=</code>.
            </p>
          </div>

          <SearchInput
            placeholder="Escribe tu búsqueda..."
            urlParamName="action-search"
            onValueChange={(value) => {
              setActionValue(value)
              console.log('Valor de búsqueda:', value)
            }}
            suffix={
              <Button
                size="sm"
                onClick={() => {
                  if (actionValue.trim()) {
                    alert(`Ejecutando búsqueda: "${actionValue}"`)
                    console.log('Búsqueda ejecutada:', actionValue)
                  } else {
                    alert('Ingresa un término de búsqueda')
                  }
                }}
                className="h-8 px-3"
              >
                <SearchIcon className="h-4 w-4 mr-1" />
                Buscar
              </Button>
            }
          />

          <div className="text-sm text-muted-foreground">
            <strong>Valor actual:</strong> {actionValue || 'vacío'}
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Código de ejemplo:</h4>
            <pre className="text-sm overflow-x-auto">
              {`<SearchInput
  placeholder="Escribe tu búsqueda..."
  urlParamName="action-search"
  onValueChange={(value) => setActionValue(value)}
  suffix={
    <Button
      size="sm"
      onClick={() => {
        if (actionValue.trim()) {
          alert(\`Ejecutando búsqueda: "\${actionValue}"\`)
        }
      }}
      className="h-8 px-3"
    >
      <SearchIcon className="h-4 w-4 mr-1" />
      Buscar
    </Button>
  }
/>`}
            </pre>
          </div>
        </div>

        {/* Demo 11: Botón Dropdown */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">11. Botón Dropdown</h3>
            <p className="text-muted-foreground">
              Búsqueda con botón dropdown para seleccionar categorías. Parámetro
              URL: <code>?dropdown-search=</code>.
            </p>
          </div>

          <SearchInput
            placeholder="Buscar en todas las categorías..."
            urlParamName="dropdown-search"
            onValueChange={(value) => {
              setDropdownValue(value)
              console.log('Búsqueda dropdown:', value)
            }}
            suffix={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const categories = [
                    'Productos',
                    'Usuarios',
                    'Pedidos',
                    'Reportes',
                  ]
                  const selected =
                    categories[Math.floor(Math.random() * categories.length)]
                  alert(`Categoría seleccionada: ${selected}`)
                  console.log(
                    'Dropdown opened for:',
                    dropdownValue,
                    'Selected:',
                    selected
                  )
                }}
                className="h-8 px-3"
              >
                Categoría
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            }
          />

          <div className="text-sm text-muted-foreground">
            <strong>Valor actual:</strong> {dropdownValue || 'vacío'}
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Código de ejemplo:</h4>
            <pre className="text-sm overflow-x-auto">
              {`<SearchInput
  placeholder="Buscar en todas las categorías..."
  urlParamName="dropdown-search"
  onValueChange={(value) => setDropdownValue(value)}
  suffix={
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        // Lógica para mostrar dropdown
        alert('Dropdown abierto')
      }}
      className="h-8 px-3"
    >
      Categoría
      <ChevronDown className="h-4 w-4 ml-1" />
    </Button>
  }
/>`}
            </pre>
          </div>
        </div>

        {/* Demo 12: Botón Toggle */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">12. Botón Toggle</h3>
            <p className="text-muted-foreground">
              Búsqueda con botón toggle para cambiar entre vista de lista y
              grilla. Parámetro URL: <code>?toggle-search=</code>.
            </p>
          </div>

          <SearchInput
            placeholder="Buscar elementos..."
            urlParamName="toggle-search"
            onValueChange={(value) => {
              setToggleValue(value)
              console.log('Búsqueda toggle:', value)
            }}
            suffix={
              <Button
                variant={isGridView ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setIsGridView(!isGridView)
                  const newView = !isGridView ? 'Grilla' : 'Lista'
                  alert(`Vista cambiada a: ${newView}`)
                  console.log(
                    'View toggled to:',
                    newView,
                    'for search:',
                    toggleValue
                  )
                }}
                className="h-8 px-3"
              >
                {isGridView ? (
                  <>
                    <Grid3X3 className="h-4 w-4 mr-1" />
                    Grilla
                  </>
                ) : (
                  <>
                    <List className="h-4 w-4 mr-1" />
                    Lista
                  </>
                )}
              </Button>
            }
          />

          <div className="text-sm text-muted-foreground">
            <strong>Valor actual:</strong> {toggleValue || 'vacío'} |{' '}
            <strong>Vista:</strong> {isGridView ? 'Grilla' : 'Lista'}
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Código de ejemplo:</h4>
            <pre className="text-sm overflow-x-auto">
              {`const [isGridView, setIsGridView] = useState(false)

<SearchInput
  placeholder="Buscar elementos..."
  urlParamName="toggle-search"
  onValueChange={(value) => setToggleValue(value)}
  suffix={
    <Button
      variant={isGridView ? "default" : "outline"}
      size="sm"
      onClick={() => {
        setIsGridView(!isGridView)
        alert(\`Vista: \${!isGridView ? 'Grilla' : 'Lista'}\`)
      }}
      className="h-8 px-3"
    >
      {isGridView ? (
        <>
          <Grid3X3 className="h-4 w-4 mr-1" />
          Grilla
        </>
      ) : (
        <>
          <List className="h-4 w-4 mr-1" />
          Lista
        </>
      )}
    </Button>
  }
/>`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  )
}
