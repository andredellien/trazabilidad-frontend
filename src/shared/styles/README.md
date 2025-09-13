# Sistema de Diseño Centralizado

Este sistema de diseño centraliza todos los componentes, colores, tipografías y estilos para mantener consistencia visual en toda la aplicación.

## Componentes Disponibles

### Button
```jsx
import Button from '../shared/components/Button';

// Variantes
<Button variant="primary">Primario</Button>
<Button variant="secondary">Secundario</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="success">Éxito</Button>
<Button variant="error">Error</Button>
<Button variant="warning">Advertencia</Button>

// Tamaños
<Button size="sm">Pequeño</Button>
<Button size="md">Mediano</Button>
<Button size="lg">Grande</Button>
<Button size="xl">Extra Grande</Button>

// Estados
<Button loading>Cargando...</Button>
<Button disabled>Deshabilitado</Button>
<Button fullWidth>Ancho completo</Button>
```

### Input
```jsx
import Input from '../shared/components/Input';

<Input
  label="Nombre"
  placeholder="Ingresa tu nombre"
  value={value}
  onChange={handleChange}
  error="Este campo es requerido"
  help="Información adicional"
/>
```

### Select
```jsx
import Select from '../shared/components/Select';

<Select
  label="Seleccionar opción"
  placeholder="Elige una opción"
  options={[
    { value: '1', label: 'Opción 1' },
    { value: '2', label: 'Opción 2' }
  ]}
  value={value}
  onChange={handleChange}
/>
```

### Alert
```jsx
import Alert from '../shared/components/Alert';

<Alert type="success">Operación exitosa</Alert>
<Alert type="error">Ha ocurrido un error</Alert>
<Alert type="warning">Advertencia importante</Alert>
<Alert type="info">Información adicional</Alert>

// Con título
<Alert type="success" title="Éxito">
  La operación se completó correctamente
</Alert>
```

### Card
```jsx
import Card from '../shared/components/Card';

<Card title="Título de la tarjeta">
  Contenido de la tarjeta
</Card>

// Con footer
<Card 
  title="Título" 
  footer={<Button>Acción</Button>}
>
  Contenido
</Card>
```

### Table
```jsx
import Table from '../shared/components/Table';

const columns = [
  { key: 'name', header: 'Nombre' },
  { key: 'email', header: 'Email' },
  { 
    key: 'actions', 
    header: 'Acciones',
    render: (value, row) => <Button size="sm">Editar</Button>
  }
];

<Table columns={columns} data={data} />
```

### Badge
```jsx
import Badge from '../shared/components/Badge';

<Badge variant="success">Activo</Badge>
<Badge variant="error">Inactivo</Badge>
<Badge variant="warning">Pendiente</Badge>
<Badge variant="info">Información</Badge>
```

## Variables CSS

El sistema usa variables CSS para mantener consistencia:

```css
:root {
  /* Colores principales */
  --primary-color: #007c64;
  --primary-hover: #036a55;
  --primary-light: #d9f9ee;
  
  /* Colores de estado */
  --success-color: #046c4e;
  --error-color: #b91c1c;
  --warning-color: #d97706;
  --info-color: #1e40af;
  
  /* Tipografía */
  --font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  
  /* Espaciado */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
}
```

## Clases de Utilidad

### Espaciado
- `mb-1`, `mb-2`, `mb-3`, `mb-4`, `mb-5`, `mb-6` - Margen inferior
- `mt-1`, `mt-2`, `mt-3`, `mt-4`, `mt-5` - Margen superior
- `p-1`, `p-2`, `p-3`, `p-4`, `p-5` - Padding
- `space-y-1`, `space-y-2`, `space-y-3`, `space-y-4` - Espaciado vertical entre elementos

### Layout
- `flex`, `flex-col`, `flex-1` - Flexbox
- `items-center`, `justify-center`, `justify-between` - Alineación
- `gap-1`, `gap-2`, `gap-3`, `gap-4` - Espaciado entre elementos flex
- `w-full`, `h-full` - Ancho y alto completo
- `max-w-md`, `max-w-2xl` - Ancho máximo
- `mx-auto` - Centrado horizontal

### Tipografía
- `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl` - Tamaños de texto
- `font-bold`, `font-semibold`, `font-medium` - Pesos de fuente
- `text-center`, `text-left`, `text-right` - Alineación de texto
- `text-primary`, `text-secondary`, `text-muted` - Colores de texto

### Colores de fondo
- `bg-primary`, `bg-secondary`, `bg-success`, `bg-error`, `bg-warning` - Fondos

## Migración

Para migrar componentes existentes:

1. Reemplaza botones HTML por el componente `Button`
2. Reemplaza inputs HTML por el componente `Input`
3. Reemplaza selects HTML por el componente `Select`
4. Reemplaza alertas/mensajes por el componente `Alert`
5. Usa las clases de utilidad para espaciado y layout
6. Mantén el color principal `#007c64` para consistencia

## Beneficios

- **Consistencia**: Todos los componentes tienen el mismo estilo
- **Mantenibilidad**: Cambios centralizados se aplican a toda la app
- **Escalabilidad**: Fácil agregar nuevos componentes siguiendo el patrón
- **Accesibilidad**: Componentes con mejores prácticas de accesibilidad
- **Performance**: CSS optimizado y componentes reutilizables
