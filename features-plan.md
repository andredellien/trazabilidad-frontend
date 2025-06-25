# 🧠 Plan de Nuevos Features y Cambios

## Contexto General

Antes de implementar nada, analiza completamente todo el sistema: front-end, back-end y base de datos (DB.sql).

Voy a realizar una serie de cambios y nuevas funcionalidades en mi sistema. Algunas funcionalidades existentes serán modificadas, otras serán nuevas y abarcarán partes no mencionadas en este plan, por eso debes analizar el proyecto entero y entender cuales funcionalidades nuevas o modificadas haran que se requiera modificar otras existentes.

Quiero que tomes en cuenta todas las relaciones entre entidades, controladores, servicios, vistas y esquemas de base de datos.

Una vez que hayas analizado todo el proyecto, iré activando estos bloques uno por uno.

---

## 🔧 Lista de Bloques Funcionales

---

### 🔹 Bloque 1: Módulo de Proveedores

Antes, el proveedor era solo un campo dentro del formulario de creación de materia prima. Ahora debe convertirse en un módulo independiente.

**Objetivo:**
- Crear modelo, controlador y vistas CRUD para proveedores.
- El campo proveedor en “materia prima” debe pasar a ser un selector dinámico desde esta nueva tabla.
- Crear componentes necesarios en el front end utilizando el servicio api.js y crea las rutas necesarias y agrega la nueva seccion al sidebar

---

### 🔹 Bloque 2: Mejora en creación de usuarios

Actualmente el campo “cargo” se llena automáticamente con “operador”.

**Objetivo:**
- Agregar el campo “cargo” al formulario de creación de usuario.
- El campo debe ser obligatorio y permitir elegir: operador, cliente, admin, etc.
- Actualizar validaciones y almacenamiento.

---

### 🔹 Bloque 3: Crear pedido (visible solo para clientes)

Nuevo feature para usuarios con cargo “cliente”.

**Objetivo:**
- Crear modelo, controlador y vistas CRUD para Pedido.
- Crear componentes necesarios en el front end utilizando el servicio api.js y crea las rutas necesarias y agrega la nueva seccion al sidebar
- Formulario para crear un pedido y asociarlo al id del usuario logueado.
- Listado donde el usuario con cargo "cliente" pueda ver sus pedidos.
- Solo debe ser visible para usuarios con cargo “cliente”.

---

### 🔹 Bloque 4: Gestión de pedidos (admin/operador)

Nuevo feature para gestionar pedidos.

**Objetivo:**
- Ver lista de pedidos.
- Botón “Solicitar materia prima”, que abre un modal.
- En el modal, permitir agregar múltiples materias primas con:
  - nombre, cantidad, unidad (kg/lts), proveedor y lo que tenga la tabla materia prima
  - estado inicial: “solicitado”.
- Botón “Crear lote”, que abre un modal para crear lote y asociar al cliente del pedido.

---

### 🔹 Bloque 5: Recepción de materia prima

Nuevo módulo para recibir materias primas en estado “solicitado”.

**Objetivo:**
- Listar materias primas con estado “solicitado”.
- Al hacer clic, abrir un modal con:
  - ¿Recepción conforme? (sí/no)
  - Campo de firma (dibujo)
- Al enviar:
  - Guardar firma
  - Si conforme = sí → estado: “almacenada”
  - Si conforme = no → estado: “rechazada”

---

### 🔹 Bloque 6: Actualizar módulo materia prima

**Objetivo:**
- En el listado de materias primas, mostrar solo las que estén en estado “almacenada”.

---

### 🔹 Bloque 7: Feature de Almacenaje de lotes certificados

Nuevo feature para almacenar lotes certificados.

**Objetivo:**
- Listar lotes con estado “certificado”.
- Al hacer clic, mostrar modal con:
  - Lugar de almacenaje
  - Condición de almacenamiento
- Al guardar, actualizar estado del lote a “almacenado”.

---

### 🔹 Bloque 8: Entrega para clientes

Nuevo feature para usuarios con cargo “cliente”.

**Objetivo:**
- Listar lotes en estado “almacenado” cuyo cliente final sea el usuario logueado.
- Al hacer clic:
  - Campo entrega conforme (sí/no)
  - Campo de firma (dibujo)
- Al guardar:
  - Si sí → estado: “entregado”
  - Si no → estado: “rechazado”

---


### 🔹 Bloque 9: Transformacion feature materia prima

**Objetivo:**

Debemos transformar la seccion de materia prima y necesito que analices el backend y base de datos (DB.sql) para ver que cambios seran necesarios, despues nos preocupamos por el frontend

- Materia Prima tendra 3 secciones

---La primera seccion sera creacion de materia prima base, donde se crearan las materias primas base solo con nombre, unidad, cantidad = 0 por defecto. Esta materia prima base sera donde se ira agregando cada vez que se solicite materia prima y descontando cada vez que se cree un lote con la catidad de materia prima, se debe poder ver un log de adiciones y sustraciones de materia prima
---La segunda seccion sera solicitud de materia prima, donde se crearan solicitudes de materia prima (seleccion de materia prima base, cantidad, selecion de proveedor, estado = solicitada, unidad = unidad de materia prima base, fecha de recepcion = null, fecha de solicitud = hoy, recepcion conforme = null, firma recepcion = null)
---La tercera seccion sera recepcion de materia prima, donde habra un listado de materias prima con estado solicitada, y se dara click para llenar lo campos (fecha de recepcion = hoy, estado = recibida, recepcion conforme =  verdadero / falso, firma de recepcion = cargar dibujo) si recepcion conforme = verdadero se agrega a la materia prima base escogida
 

 -POR HACER

 -- Mejorar UI global y hacerla concistente
 -- Mejora de sidebar 
 -- Mejora componente de Gestion de pedidos
 -- CLIENTE
 --- Crear componente Dashboard
 --- Mejorar componente Mis Pedidos 

