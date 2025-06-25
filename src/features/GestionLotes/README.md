# 🏭 Gestión de Lotes

Este módulo permite la creación y gestión completa de lotes de producción en el sistema de trazabilidad.

## 📋 Características

### ✨ Funcionalidades Principales

- **Creación de Lotes**: Formulario intuitivo para crear nuevos lotes
- **Gestión de Materias Primas**: Selección y asignación de materias primas base
- **Validaciones en Tiempo Real**: Verificación de cantidades disponibles
- **Estados de Lotes**: Seguimiento del estado de cada lote
- **Estadísticas Visuales**: Dashboard con métricas de lotes
- **Interfaz Responsiva**: Diseño adaptativo para móviles y desktop

### 🎨 Diseño Moderno

- **Material-UI**: Componentes modernos y consistentes
- **Gradientes y Sombras**: Efectos visuales atractivos
- **Iconografía**: Emojis y iconos para mejor UX
- **Animaciones**: Transiciones suaves y feedback visual
- **Colores Temáticos**: Paleta de colores coherente

## 🏗️ Estructura del Proyecto

```
src/features/GestionLotes/
├── components/
│   ├── LoteForm.jsx          # Formulario de creación
│   ├── LoteList.jsx          # Lista de lotes
│   └── LoteStats.jsx         # Estadísticas y métricas
├── hooks/
│   ├── useLotes.js           # Hook para obtener lotes
│   └── useCreateLote.js      # Hook para crear lotes
├── services/
│   └── lotes.service.js      # Servicios de API
├── styles/
│   └── Lotes.css             # Estilos personalizados
├── GestionLotesPage.jsx      # Página principal
└── README.md                 # Esta documentación
```

## 🔧 Componentes

### LoteForm
Formulario completo para crear lotes con:
- Campos de información básica (nombre, fecha, estado)
- Selección de proceso (opcional)
- Selección de pedido (opcional)
- Gestión dinámica de materias primas
- Validaciones en tiempo real
- Feedback visual de errores y éxito

### LoteList
Lista de lotes con:
- Tabla responsiva con información detallada
- Vista de tarjetas para móviles
- Estados visuales con chips de colores
- Acciones de ver y editar
- Ordenamiento por fecha de creación

### LoteStats
Dashboard de estadísticas con:
- Métricas principales (total, pendientes, en proceso, certificados)
- Barras de progreso visuales
- Distribución porcentual por estado
- Iconografía descriptiva

## 📊 Estados de Lotes

| Estado | Color | Descripción |
|--------|-------|-------------|
| Pendiente | ⚠️ Amarillo | Lote creado, esperando procesamiento |
| En Proceso | 🔄 Azul | Lote en transformación |
| Completado | ✅ Verde | Proceso finalizado exitosamente |
| Certificado | ✅ Verde | Lote certificado de calidad |
| No Certificado | ❌ Rojo | Lote rechazado en certificación |

## 🔌 Integración con Backend

### Campos Requeridos
```javascript
{
  Nombre: string,           // Nombre del lote
  FechaCreacion: Date,      // Fecha de creación
  Estado: string,           // Estado inicial
  IdProceso?: number,       // ID del proceso (opcional)
  IdPedido?: number,        // ID del pedido (opcional)
  MateriasPrimas: [         // Array de materias primas
    {
      IdMateriaPrimaBase: number,
      Cantidad: number
    }
  ]
}
```

### Validaciones del Backend
- Verificación de existencia del pedido (si se proporciona)
- Descuento automático de materias primas base
- Registro en log de movimientos
- Transacciones para garantizar consistencia

## 🎯 Flujo de Trabajo

1. **Creación**: Usuario llena el formulario con información del lote
2. **Validación**: Sistema verifica cantidades disponibles
3. **Envío**: Datos se envían al backend con validaciones
4. **Procesamiento**: Backend crea el lote y descuenta materias primas
5. **Confirmación**: Usuario recibe feedback de éxito
6. **Actualización**: Lista se actualiza automáticamente

## 🚀 Uso

### Crear un Lote
1. Navegar a "Gestión de Lotes"
2. Seleccionar pestaña "Crear Lote"
3. Llenar información básica
4. Agregar materias primas necesarias
5. Seleccionar proceso y/o pedido (opcional)
6. Hacer clic en "Crear Lote"

### Ver Lotes
1. Navegar a "Gestión de Lotes"
2. Seleccionar pestaña "Ver Lotes"
3. Revisar estadísticas en la parte superior
4. Explorar lista de lotes en tabla o tarjetas

## 🎨 Personalización

### Temas de Colores
Los colores se pueden personalizar modificando:
- Variables CSS en `Lotes.css`
- Tema de Material-UI en el componente principal
- Props de color en los componentes

### Responsive Design
- **Desktop**: Tabla completa con todas las columnas
- **Tablet**: Tabla adaptada con columnas principales
- **Mobile**: Vista de tarjetas con información esencial

## 🔍 Validaciones

### Frontend
- Campos obligatorios completos
- Cantidades mayores a 0
- No exceder cantidades disponibles
- Fechas válidas
- Selección de materias primas

### Backend
- Existencia de pedido (si aplica)
- Existencia de proceso (si aplica)
- Disponibilidad de materias primas
- Integridad de transacciones

## 📱 Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge
- **Dispositivos**: Desktop, Tablet, Mobile
- **Resoluciones**: 320px - 4K
- **Accesibilidad**: Compatible con lectores de pantalla

## 🛠️ Tecnologías Utilizadas

- **React**: Framework principal
- **Material-UI**: Componentes de UI
- **CSS3**: Estilos personalizados
- **JavaScript ES6+**: Lógica de aplicación
- **Axios**: Cliente HTTP para API

## 🔮 Futuras Mejoras

- [ ] Filtros avanzados por estado y fecha
- [ ] Exportación a PDF/Excel
- [ ] Búsqueda en tiempo real
- [ ] Notificaciones push
- [ ] Historial de cambios
- [ ] Integración con códigos QR
- [ ] Dashboard con gráficos avanzados 