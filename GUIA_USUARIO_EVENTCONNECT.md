# EventConnect - Guía de Usuario y Manual de Funcionalidades

## 📋 Tabla de Contenidos

1. [Introducción General](#introducción-general)
2. [Descripción General del Sistema](#descripción-general-del-sistema)
3. [Módulos Principales](#módulos-principales)
4. [Módulos Avanzados](#módulos-avanzados)
5. [Guías Paso a Paso](#guías-paso-a-paso)
6. [Gestión de Perfiles y Roles](#gestión-de-perfiles-y-roles)

---

## Introducción General

### ¿Qué es EventConnect y qué problema resuelve?

**EventConnect** es una plataforma integral de gestión para empresas de alquiler de equipos y servicios para eventos. Soluciona los principales desafíos operativos y comerciales del sector:

#### Problemas Resueltos:

- **📦 Gestión Ineficiente de Inventario**: Control centralizado de activos, productos y stock en tiempo real
- **📅 Dificultad en la Asignación de Reservas**: Sistema automático de disponibilidad y optimización de reservas
- **💳 Fallos en Facturación**: Emisión automática de facturas y trazabilidad de pagos
- **🚚 Logística Desorganizada**: Seguimiento de entregas con geolocalización y evidencia fotográfica
- **📊 Falta de Inteligencia de Negocios**: Analytics avanzados y predicción de demanda
- **🔐 Riesgos de Cumplimiento**: Auditoría completa y gestión de privacidad de datos

#### Beneficios Clave:

✅ **Automatización Total**: Reduce tareas manuales hasta 70%
✅ **Mayor Rentabilidad**: Optimiza disponibilidad y reduce costos operativos
✅ **Experiencia de Cliente Mejorada**: Portal auto-servicio y comunicación en tiempo real
✅ **Escalabilidad**: Crece sin aumentar costos administrativos
✅ **Cumplimiento Normativo**: Auditoría, privacidad y trazabilidad completa

---

## Descripción General del Sistema

### Interfaz Principal

Al ingresar a EventConnect, verá:

1. **Dashboard Personalizado**: Adaptado a su rol (Administrador, Operario, Cliente)
2. **Menú Lateral Inteligente**: Acceso rápido a módulos relevantes
3. **Notificaciones en Tiempo Real**: Alertas de reservas, pagos y mantenimientos
4. **Panel de Control**: Métricas, gráficos y KPIs principales

### Roles del Sistema

| Rol | Acceso | Responsabilidades |
|-----|--------|------------------|
| **SuperAdmin** | Acceso total | Configuración del sistema, gestión de usuarios, integraciones |
| **Admin-Proveedor** | Módulos operacionales | Inventario, reservas, reportes, facturación |
| **Operario** | Tareas específicas | Registro de activos, mantenimiento, entregas, recepción |
| **Cliente** | Portal limitado | Ver reservas, solicitar cotizaciones, pagar, contactar soporte |

---

## Módulos Principales

### 1. 📦 Gestión de Inventario

#### 1.1 Activos (Equipos)

**¿Qué es?**
Un activo es cualquier equipo, maquinaria o bien que la empresa alquila a clientes (sillas, mesas, proyectores, sonido, etc.).

**¿Para qué sirve?**
- Control total del ciclo de vida del equipo
- Seguimiento de estado, ubicación y mantenimiento
- Información de depreciación y rentabilidad

**Características:**

| Funcionalidad | Descripción |
|---------------|-------------|
| **Código QR** | Identificación única mediante código de barras escaneble |
| **Estados** | Disponible, En Alquiler, En Mantenimiento, Dañado, Descartado |
| **Ubicación** | Control de bodega y ubicación específica |
| **Hoja de Vida** | Historial completo: compra, mantenimientos, reparaciones, traslados |
| **Depreciación** | Cálculo automático del valor residual |
| **Foto/Especificaciones** | Documentación visual y técnica del activo |

**¿Cómo se usa? (Administrador)**

```
Panel > Inventario > Activos > Nuevo Activo
├─ Datos Básicos
│  ├─ Nombre del equipo
│  ├─ Código (se genera automáticamente)
│  └─ Categoría (Sonido, Iluminación, etc.)
├─ Especificaciones
│  ├─ Marca, Modelo, Año
│  └─ Peso, Dimensiones
├─ Valores
│  ├─ Costo de compra
│  ├─ Precio de alquiler diario
│  └─ Vida útil esperada
└─ Asignación Inicial
   └─ Bodega y ubicación
```

---

#### 1.2 Productos

**¿Qué es?**
Productos de consumo o servicios que se venden o alquilan (bebidas, decoraciones, servicio de instalación, etc.).

**¿Para qué sirve?**
- Gestión de stock separada de activos reutilizables
- Control de unidades mínimas y máximas
- Integración con facturación

**Estados y Stock:**
- ✅ Disponible: En stock suficiente
- ⚠️ Stock Bajo: Cercano al mínimo
- ❌ Agotado: Sin stock disponible
- 🔄 En Pedido: Orden pendiente de llegada

---

#### 1.3 Categorías

**¿Qué es?**
Agrupación lógica de activos y productos por tipo.

**Ejemplos de Categorías:**
- Sonido y Audio (Parlantes, Micrófonos, Amplificadores)
- Iluminación (Reflectores, Spots, Decorativa)
- Mobiliario (Sillas, Mesas, Carpas)
- Servicios (Instalación, Montaje, Desmontaje)

**Beneficio**: Búsqueda y reportes filtrados rápidamente.

---

#### 1.4 Lotes

**¿Qué es?**
Agrupaciones de productos del mismo tipo con mismo precio y proveedor.

**Caso de Uso:**
- Compró 100 sillas de madera en una orden
- Sistema crea automáticamente "Lote 001 - Sillas Madera"
- Controla entrada/salida por lote para rastrabilidad

---

#### 1.5 Bodegas

**¿Qué es?**
Ubicaciones físicas donde se almacenan activos y productos.

**Información Típica:**
- 📍 Dirección y ciudad
- 📞 Responsable y contacto
- 🏢 Capacidad de almacenamiento
- 📦 Inventario actual
- 🛣️ Distancia a clientes principales

**Multi-Bodega**: EventConnect soporta múltiples ubicaciones de almacenamiento.

---

### 2. 📅 Reservas y Logística

#### 2.1 Ciclo de Vida de una Reserva

**Estados y Flujo:**

```
NUEVA RESERVA
    ↓
CONFIRMADA → EN ENTREGA → ENTREGADA
    ↓
CANCELADA (si cliente cancela)

ENTREGADA
    ↓
EN USO (durante el evento)
    ↓
FINALIZADA (cliente retorna equipos)
```

#### 2.2 Crear una Reserva (Administrador)

**Paso 1: Información Básica**
- Seleccionar cliente
- Fecha de evento
- Duración (días/horas)
- Tipo de evento (Boda, Conferencia, Concierto, etc.)

**Paso 2: Seleccionar Equipos**
- Buscar por categoría
- Agregar cantidad
- Sistema verifica disponibilidad automáticamente
- Calcula precio base

**Paso 3: Adicionales**
- Servicio de instalación (sí/no)
- Seguro de equipos
- Transporte
- Tarifa con/sin IVA

**Paso 4: Términos**
- Aceptar términos y condiciones
- Confirmar disponibilidad
- Asignar responsable de entrega

#### 2.3 Verificación de Disponibilidad

El sistema verifica automáticamente:
- ✅ Activos libres para esa fecha
- ✅ Capacidad de bodega origen
- ✅ Ruta de transporte viable
- ✅ Personal disponible

Si hay conflicto, sugiere:
- Fechas alternativas
- Equipos sustitutos similares
- Opción de pre-reserva

#### 2.4 Logística y Entregas

**Proceso de Entrega:**

```
RESERVA CONFIRMADA
    ↓
PREPARAR EQUIPOS EN BODEGA
    ├─ Verificar cantidad
    ├─ Inspeccionar estado
    └─ Empacar
    ↓
ASIGNAR TRANSPORTISTA
    ├─ Seleccionar ruta
    ├─ Estimar tiempo
    └─ Confirmar disponibilidad
    ↓
ENTREGAR EN SITIO
    ├─ Verificar ubicación (GPS)
    ├─ Descargar equipos
    ├─ Cliente firma conformidad
    └─ Fotoevidencia del estado
    ↓
RETORNO
    ├─ Recoger equipos
    ├─ Verificar no hay daños
    ├─ Documentar estado
    └─ Transportar a bodega
```

**Evidencia de Entrega (Geolocalización):**
- 📸 Foto de equipos entregados
- 🗺️ Coordenadas GPS exactas
- ⏰ Timestamp de entrega
- ✍️ Firma digital del cliente
- 📝 Observaciones (daños, faltantes)

---

### 3. 👥 Clientes y Portal del Cliente

#### 3.1 Gestión de Clientes (Administrador)

**Información del Cliente:**
- Datos de contacto (nombre, email, teléfono)
- Dirección de entrega
- Tipo de cliente (Natural, Empresa)
- Documento de identidad/RUC
- Historial de transacciones
- Nivel de crédito aprobado

**Segmentación:**
- 🟢 VIP: Alto valor, descuentos especiales
- 🟡 Regular: Clientes frecuentes
- 🔴 Nuevo: Primer evento
- ⚫ Inactivo: Sin reservas últimos 6 meses

---

#### 3.2 Portal del Cliente (Cliente)

Al ingresar a su portal, el cliente ve:

**Dashboard Personal:**
```
┌─────────────────────────────────────┐
│ Mis Reservas          4 activas    │
│ Cotizaciones Pendientes   2        │
│ Pagos Vencidos          0          │
│ Mi Crédito Disponible  $5,000      │
└─────────────────────────────────────┘
```

**Funcionalidades Disponibles:**

| Sección | Acciones |
|---------|----------|
| **Mis Reservas** | Ver estado, recibir notificaciones, descargar PDF, evaluar servicio |
| **Solicitar Cotización** | Describir necesidad, subir referencias, recibir presupuesto |
| **Mis Pagos** | Ver facturas, descargar comprobantes, pagar en línea |
| **Mensajes** | Chat con equipo de soporte |
| **Perfil** | Editar datos, cambiar contraseña, dirección de entrega |

**Solicitar Cotización (Cliente):**

```
Portal > Solicitar Cotización
├─ Tipo de Evento
├─ Fecha tentativa
├─ Descripción de necesidades
├─ Presupuesto aproximado
├─ Subir imágenes de referencia (opcional)
└─ Enviar

Admin recibe notificación → Prepara presupuesto → Envía dentro de 24h
```

---

### 4. 🔧 Mantenimiento y Daños

#### 4.1 Mantenimiento Preventivo

**¿Qué es?**
Servicio regular para prolongar vida útil y evitar fallos.

**Tipos de Mantenimiento:**
- 🔧 **Preventivo**: Cada X días (según especificaciones del equipo)
- 🛠️ **Correctivo**: Cuando falla algo
- 🧹 **Limpieza**: Antes de cada alquiler
- 🔌 **Prueba Funcional**: Verificación pre-entrega

**Frecuencias Estándar:**
- Amplificadores: Cada 30 días
- Iluminación: Cada 45 días
- Mobiliario: Cada 90 días
- Cables y accesorios: Cada 60 días

**Registro de Mantenimiento:**
```
Panel > Mantenimiento > Registrar
├─ Activo (escanear QR o seleccionar)
├─ Tipo de mantenimiento
├─ Descripción del trabajo realizado
├─ Responsable (técnico)
├─ Duración
├─ Materiales utilizados
├─ Costo (si aplica)
└─ Fecha próximo mantenimiento (auto-calculada)
```

**Beneficios:**
- ✅ Reduce reparaciones costosas
- ✅ Extiende vida útil del equipo
- ✅ Mejora confiabilidad para clientes
- ✅ Documentación completa para auditoría

---

#### 4.2 Reporte de Daños

**¿Cuándo usar?**
- Equipo se daña durante alquiler
- Se descubre daño al retornar
- Falla detectada en inspección

**Proceso de Reporte:**

```
Sistema > Reportar Daño
├─ Activo afectado (QR)
├─ Tipo de daño
│  ├─ Rotura
│  ├─ Falla eléctrica
│  ├─ Pérdida/faltante
│  └─ Otros
├─ Descripción detallada
├─ Fotos del daño
├─ Responsable (cliente/empresa)
├─ Costo estimado de reparación
└─ Acción (reparar/descartar)

Sistema:
1. Genera orden de reparación
2. Notifica técnico
3. Segrega activo (no disponible para alquiler)
4. Cobra al cliente (si aplica)
```

**Impacto en Facturación:**
- Si cliente causó daño: Se incluye en factura como cargo adicional
- Si equipo defectuoso: Corre por cuenta de la empresa

---

### 5. 💳 Finanzas

#### 5.1 Facturación Automática

**Trigger de Factura:**
1. Reserva confirmada → Se genera factura proforma
2. Equipos entregados → Se emite factura definitiva
3. Cliente paga → Se marca como pagada

**Elementos de la Factura:**
- 🔢 Número secuencial
- 📅 Fecha de emisión
- 👤 Datos del cliente
- 📋 Detalle de equipos/servicios
- 💰 Subtotal, IVA, Total
- 🎯 Términos de pago
- 📝 Notas especiales

**Configuración de Pago:**
```
Admin > Configuración > Pasarelas de Pago
├─ PayPal / Stripe
├─ Transferencia bancaria
├─ Tarjeta de crédito
├─ Efectivo a entrega
└─ Cheque/Crédito diferido
```

---

#### 5.2 Historial de Pagos

**Para Administrador:**
- Ver todas las facturas emitidas
- Estado de cobranza
- Facturas vencidas (morosos)
- Reportes de ingresos por período
- Proyecciones de flujo de caja

**Para Cliente:**
- Ver mis facturas pendientes y pagadas
- Pagar en línea de forma segura
- Descargar comprobantes
- Historial de transacciones

---

### 6. 🎯 Sistema de Puntos y Reputación

#### 6.1 Puntos de Lealtad

**Cómo Gana Puntos el Cliente:**
- 🎫 Por cada evento: 10 puntos
- 💸 Por monto gastado: 1 punto = $1 gastado
- ⭐ Referir amigos: 50 puntos
- 📝 Escribir reseña: 25 puntos
- 🎁 Cumpleaños: 100 puntos bonus

**Cómo Usa Puntos:**
```
Sistema de Puntos > Mis Puntos: 2,340 pts
├─ 10% Descuento: 500 pts
├─ 20% Descuento: 1,000 pts
├─ Regalo Sorpresa: 1,500 pts
└─ Mensajería Gratis: 300 pts
```

#### 6.2 Niveles y Beneficios

| Nivel | Puntos | Beneficio |
|-------|--------|----------|
| 🥉 Bronce | 0-999 | Descuento 5% |
| 🥈 Plata | 1,000-4,999 | Descuento 10% + Envío gratis |
| 🥇 Oro | 5,000-9,999 | Descuento 15% + Prioridad |
| 💎 Platino | 10,000+ | Descuento 20% + Gestor dedicado |

---

## Módulos Avanzados

### 7. 📊 Inteligencia de Negocios (BI) y Analytics

#### 7.1 Dashboard de Tendencias

**Visualización Principal:**

```
INGRESOS POR MES (últimos 12 meses)
├─ Gráfico de línea con tendencia
├─ Comparación año anterior
└─ Proyección próximos 3 meses

TIPO DE EVENTO MÁS RENTABLE
├─ Bodas: $450,000 (35%)
├─ Conferencias: $350,000 (27%)
├─ Conciertos: $280,000 (22%)
└─ Otros: $170,000 (16%)

EQUIPOS MÁS ALQUILADOS
├─ Sillas Chiavari: 2,500 eventos
├─ Proyectores: 1,200 eventos
├─ Amplificadores: 980 eventos
└─ Iluminación: 850 eventos
```

#### 7.2 KPIs Clave

| KPI | Fórmula | Ejemplo | Objetivo |
|-----|---------|---------|----------|
| **ROI Activo** | (Ingresos - Costo) / Costo | 250% | >200% |
| **Ocupación** | Días alquilado / Días disponibles | 65% | >60% |
| **Tasa Conversión** | Cotizaciones convertidas / Enviadas | 45% | >50% |
| **Lifetime Value** | Ingresos totales cliente | $35,000 | Aumentar 10% anual |
| **Costo de Mantenimiento** | Gasto / Ingresos | 8% | <10% |
| **Tasa Devolución** | Activos dañados / Total alquilado | 2.3% | <2% |

---

#### 7.3 Análisis Predictivo (Machine Learning)

**Funcionalidades:**

🔮 **Predicción de Demanda**
- Analiza histórico y estacionalidad
- Predice qué equipos faltarán próximas semanas
- Alerta para compras preventivas

📈 **Análisis de Rentabilidad por Cliente**
- Identifica clientes no rentables
- Sugiere ajustes de tarifa
- Detecta oportunidades de up-sell

🎯 **Segmentación Automática**
- Agrupa clientes por comportamiento
- Sugiere estrategias de retención
- Identifica churn risk

---

#### 7.4 Reportes Personalizados

**Tipos de Reportes:**

```
Admin > Reportes > Nuevo Reporte
├─ Período (Mes, Trimestre, Año)
├─ Métricas a incluir
│  ├─ Ingresos
│  ├─ Gastos operativos
│  ├─ Rentabilidad por activo
│  ├─ Ocupación de bodegas
│  └─ Satisfacción cliente
├─ Gráficos (Línea, Barra, Pastel)
├─ Exportar (PDF, Excel, CSV)
└─ Programar envío automático (mensual/trimestral)
```

---

### 8. 🔐 Calidad y Privacidad de Datos

#### 8.1 Data Quality (Calidad de Datos)

**¿Por qué importa?**
Datos imprecisos = Decisiones malas = Pérdidas económicas

**Procesos de Validación:**

✅ **Validación de Entrada**
- Email válido
- Teléfono con formato correcto
- Moneda sin caracteres especiales

✅ **Detección de Duplicados**
- Clientes duplicados
- Activos registrados 2 veces
- Directorios duplicadas

✅ **Integridad Referencial**
- No crear reserva sin cliente
- No eliminar bodega si hay activos allí
- Cascada correcta de eliminaciones

✅ **Auditoría de Cambios**
- Quién cambió qué dato
- Cuándo se realizó el cambio
- Por qué (si aplica)

---

#### 8.2 Data Privacy (Privacidad de Datos)

**Cumplimiento de GDPR/CCPA:**

🔒 **Encriptación**
- Contraseñas: Algoritmo bcrypt
- Datos sensibles: AES-256
- Transmisión: HTTPS TLS 1.3

📋 **Consentimiento Explícito**
- Usuario acepta términos antes de registrarse
- Cookie banner visible
- Puede revocar consentimiento cuando quiera

🗑️ **Derecho al Olvido**
- Cliente solicita eliminación
- Sistema anonimiza datos personales
- Conserva mínimo legal (7 años)

🚫 **Control de Acceso**
- Solo administrador ve datos sensibles
- Operarios ven solo lo necesario
- Cliente ve solo su información

---

#### 8.3 Auditoría Completa

**Registro de Auditoría:**

```
Cada acción genera registro:
├─ Usuario: admin@eventconnect.com
├─ Acción: Modificó precio activo (Proyector Sony)
├─ Datos Anteriores: $500/día
├─ Datos Nuevos: $550/día
├─ Timestamp: 2026-02-09 15:45:32
├─ IP: 192.168.1.100
├─ Dispositivo: Windows 10 Chrome
└─ Razón: Aumento por inflación Q1-2026
```

**Reportes de Auditoría:**
- Cambios sensibles (precios, permisos)
- Accesos sospechosos
- Intentos de violación
- Cumplimiento normativo

---

### 9. 🔗 Integraciones y Notificaciones

#### 9.1 Integraciones Externas

**Pasarelas de Pago:**
- Stripe, PayPal, MercadoPago
- Transacciones seguras
- Reconciliación automática

**Email/SMS:**
- SendGrid, Twilio
- Notificaciones automáticas
- Recordatorios de eventos

**Google Maps/Geolocalización:**
- Optimización de rutas
- Estimación de tiempos
- Seguimiento GPS en vivo

**Webhooks Personalizados:**
- Integración con ERP del cliente
- Sincronización de datos
- Automatización de flujos

#### 9.2 Sistema de Notificaciones

**Tipos de Notificaciones:**

| Evento | Quién Recibe | Canal |
|--------|--------------|-------|
| Reserva confirmada | Cliente | Email + SMS + App |
| Entrega en camino | Cliente | Notificación push + SMS |
| Pago recibido | Admin + Cliente | Email + Dashboard |
| Mantenimiento próximo | Operario | Notificación app |
| Stock bajo | Admin | Email + Dashboard |
| Daño reportado | Gerente + Técnico | Email urgente |

**Preferencias del Usuario:**
```
Configuración > Notificaciones
├─ Email: Sí / No
├─ SMS: Sí / No
├─ Notificaciones push: Sí / No
├─ Frecuencia: Inmediata / Diaria / Semanal
└─ Horario permitido: 8am - 10pm
```

---

### 10. 💬 Comunicación en Tiempo Real

#### 10.1 Sistema de Chat

**Características:**

✉️ **Conversaciones**
- Un hilo por reserva
- Historial completo visible
- Usuarios pueden regresar después

👥 **Participantes**
- Cliente
- Operario asignado
- Gerente (si necesario)

📎 **Contenido Rico**
- Texto
- Imágenes
- Documentos
- Ubicación GPS

⏰ **Notificaciones**
- Mensaje nuevo → Notificación inmediata
- Indicador "Visto" en tiempo real
- Recordatorio si no responde en 4h

#### 10.2 Casos de Uso de Chat

```
ANTES DEL EVENTO:
Cliente: "¿Puedo cambiar hora de entrega de 10am a 2pm?"
Operario: "Sí, sin problema. Actualizaremos la orden"

DURANTE ENTREGA:
Operario: "Llegando en 5 minutos"
Operario: [Envía foto equipos]
Cliente: "Perfecto, espero en puerta"

DURANTE EL EVENTO:
Cliente: "Un proyector no enciende"
Operario: "Reinicia, tira aire comprimido a conexión"
Cliente: "Funcionó! Gracias"

POST EVENTO:
Sistema: "¿Cómo fue tu experiencia? [⭐⭐⭐⭐⭐]"
Cliente: "Excelente, 5 estrellas"
```

---

## Guías Paso a Paso

### Caso 1: Registrar un Nuevo Activo con Código QR

**Requisitos Previos:**
- Ser administrador o operario
- Acceso al módulo de Inventario
- Lector QR (o generar después)

**Paso 1: Acceder al Módulo**
```
Dashboard > Inventario > Activos > + Nuevo Activo
```

**Paso 2: Información Básica**
```
Nombre del Equipo: Proyector Sony VPL-FHZ70
Categoría: Iluminación & AV > Proyectores
Subcategoría: Proyectores Profesionales
Ubicación de Almacenamiento Inicial: Bodega Principal
Responsable: Juan Pérez (Técnico)
```

**Paso 3: Especificaciones Técnicas**
```
Marca: Sony
Modelo: VPL-FHZ70
Año: 2024
Resolución: 1920 x 1200
Luminosidad: 7,000 ANSI
Conexiones: HDMI, USB, Network
```

**Paso 4: Información Financiera**
```
Costo de Adquisición: $3,500
Precio Alquiler Diario: $150
Precio Alquiler Fin de Semana: $200
Vida Útil Esperada: 5 años (60 meses)
Valor Residual: 10%
```

**Paso 5: Generar Código QR**
```
Sistema genera automáticamente:
QR Code: [████░████░██░░]
Imprimir etiqueta
Pegar en equipo
```

**Paso 6: Archivos y Documentación**
```
Subir:
├─ Foto frontal del equipo
├─ Foto espalda (conexiones)
├─ Manual de usuario (PDF)
├─ Certificado de garantía
└─ Especificaciones técnicas (PDF)
```

**Paso 7: Verificación Final**
```
✅ Nombre: Proyector Sony VPL-FHZ70
✅ Código: ACT-2024-1847
✅ QR: Generado e impreso
✅ Precio: $150/día
✅ Bodega: Bodega Principal
✅ Documentos: 4 archivos

Guardar y continuar
```

**Resultado:**
- ✅ Activo registrado en sistema
- ✅ QR asignado
- ✅ Disponible para reservas
- ✅ En dashboards de ocupación
- ✅ Historial iniciado

---

### Caso 2: Cliente Solicita Cotización desde el Portal

**Paso 1: Login en Portal del Cliente**
```
www.eventconnect.com/portal
Email: cliente@empresa.com
Contraseña: ••••••••

Dashboard > Solicitar Cotización
```

**Paso 2: Seleccionar Tipo de Evento**
```
¿Qué tipo de evento es?
○ Boda
○ Conferencia
● Concierto
○ Cumpleaños
○ Corporativo
○ Otro
```

**Paso 3: Detalles del Evento**
```
Fecha del evento: 15 de Marzo 2026
Duración: 6 horas (14:00 - 20:00)
Número de personas: 500
Presupuesto aproximado: $5,000
Ubicación: Cancún, Quintana Roo
```

**Paso 4: Descripción de Necesidades**
```
Descripción:
"Necesitamos equipo de sonido profesional para banda
en vivo. Requiere: 2 amplificadores, 6 parlantes,
consola de mezcla, micrófonos inalámbricos (6),
iluminación básica (focos)"

Casos especiales:
☑ Tenemos energía 220V disponible
☑ Espacio cargado (superficie firme)
☑ Técnico nuestro en sitio
```

**Paso 5: Subir Referencias**
```
Archivos adjuntos:
├─ Foto del lugar (plano del evento)
├─ Foto de eventos anteriores
└─ Requisitos de audio.pdf

O hacer álbum de Pinterest/Dropbox
```

**Paso 6: Información de Contacto**
```
Confirmamos:
Nombre: Roberto Carrillo
Email: roberto@conciertos.mx
Teléfono: +52 998 123 4567
Contacto de Emergencia: Juana Carrillo (+52 998 765 4321)
```

**Paso 7: Enviar Solicitud**
```
□ Acepto términos de privacidad
☑ Deseo que me contacten por teléfono
□ Tengo urgencia especial

[ENVIAR SOLICITUD]

CONFIRMACIÓN:
"Solicitud #2024-00456 enviada a nuestro equipo"
"Te contactaremos dentro de 24 horas"
"Referencia: Te hemos enviado enlace de seguimiento por email"
```

**Lo que pasa en Administración:**

```
NOTIFICACIÓN: Nueva Solicitud de Cotización
├─ ID: #2024-00456
├─ Cliente: Roberto Carrillo
├─ Tipo: Concierto
├─ Presupuesto: $5,000
├─ Fecha: 15 Marzo 2026
└─ Urgencia: Normal

PROCESO INTERNO:
1. Asignar a especialista en sonido (Juan)
2. Verificar disponibilidad de equipos
3. Calcular precio (incluir instalación)
4. Proponer alternativas (si hay conflicto)
5. Generar cotización PDF
6. Enviar dentro de 24h
7. Seguimiento si no responde (2 días)
```

**Cliente Recibe Cotización:**

```
EMAIL:
Asunto: Tu Cotización #2024-00456 está lista

Hola Roberto,

Tu solicitud de concierto para 500 personas ha sido
analizada por nuestro equipo. 

PRESUPUESTO:
├─ Sonido profesional (6 días alquiler): $1,200
├─ Iluminación básica: $400
├─ Instalación y técnico: $800
├─ Seguros y transporte: $300
└─ TOTAL: $2,700 (30% menos que presupuesto inicial)

PRÓXIMOS PASOS:
[VER COTIZACIÓN COMPLETA]
[ACEPTAR OFERTA] [SOLICITAR CAMBIOS] [RECHAZAR]

Tu gestor: Juan García (juan@eventconnect.com)
```

**Paso 8: Cliente Acepta (Opción 1)**
```
[ACEPTAR OFERTA]

Sistema automáticamente:
1. Crea reserva confirma
2. Genera factura proforma
3. Envía link de pago
4. Notifica a operarios
5. Asigna ruta de entrega
```

**Alternativa: Cliente Solicita Cambios (Opción 2)**
```
[SOLICITAR CAMBIOS]

"Podemos reducir cantidad de parlantes de 6 a 4?
Vimos competidores ofertar a $2,200"

Juan recibe notificación → Ajusta presupuesto →
Responde dentro de 4 horas
```

---

### Caso 3: Generar Reporte de Rentabilidad en Dashboard Admin

**Paso 1: Acceder a Reportes**
```
Dashboard Admin > Reportes > Rentabilidad > Nuevo
```

**Paso 2: Seleccionar Período**
```
Período: Trimestre (Q4 2025: Oct-Dec)
Comparar con: Q4 2024
Granularidad: Por mes (desglose mensual)
```

**Paso 3: Seleccionar Métricas**
```
SELECCIONAR MÉTRICAS:

Financiero:
☑ Ingresos totales
☑ Costo de bienes
☑ Margen bruto
☑ Gastos operativos
☑ Ganancias netas

Por Categoría:
☑ Rentabilidad de cada categoría
☑ Equipos top 10

Por Cliente:
☑ Clientes más rentables
☑ Clientes con margen menor
```

**Paso 4: Filtros Avanzados**
```
FILTROS:
├─ Bodega: Todas
├─ Tipo de evento: Todas
├─ Cliente: Todos (o seleccionar VIP)
├─ Rango de precio: Todas
└─ Incluir: Devoluciones, Daños, Descuentos
```

**Paso 5: Configurar Visualizaciones**
```
GRÁFICOS:
├─ Ingresos vs Gastos (línea con 2 ejes)
├─ Margen por Categoría (barra)
├─ Top 10 Equipos (pie)
├─ Rentabilidad por Cliente (barra horizontal)
└─ Tendencia Mensual (área)

FORMATO:
☑ Mostrar valores en dinero
☑ Mostrar porcentajes
☑ Incluir tabla de detalles
```

**Paso 6: Vista Previa**
```
REPORTE: Rentabilidad Q4 2025

RESUMEN EJECUTIVO:
├─ Ingresos Totales: $345,000
├─ Costo de Bienes: $89,200
├─ Margen Bruto: $255,800 (74%)
├─ Gastos Operativos: $156,000
├─ Ganancia Neta: $99,800 (29%)
└─ Comparado Q4 2024: +15% ↑

RENTABILIDAD POR CATEGORÍA:
├─ Sonido & Audio: 32% (Líder)
├─ Iluminación: 28%
├─ Mobiliario: 25%
├─ Servicios: 22%
└─ Accesorios: 15%

EQUIPOS MÁS RENTABLES:
1. Proyector Sony (ROI 280%)
2. Amplificador Yamaha (ROI 245%)
3. Consola de mezcla (ROI 220%)
...
```

**Paso 7: Exportar y Compartir**
```
[EXPORTAR A PDF]
[EXPORTAR A EXCEL]
[ENVIAR POR EMAIL]
[PROGRAMAR MENSUAL]

Enviar a:
- CEO@empresa.com
- CFO@empresa.com
- Gerente de Operaciones
- Mi email

Nota: "Análisis mostrado en Junta Directiva"
Guardar como template: "Rentabilidad Trimestral"
```

**Resultado:**
```
✅ Reporte generado: Rentabilidad_Q4_2025.pdf
✅ Enviado a 3 destinatarios
✅ Guardado en historial
✅ Disponible en dashboard personalizado
✅ Próximo informe: 10 de Enero 2026
```

---

### Caso 4: Proceso Completo: Reserva desde Cotización hasta Pago

```
LÍNEA DE TIEMPO TOTAL: 4-6 SEMANAS

SEMANA 1: COTIZACIÓN
├─ Cliente envía solicitud (2 horas)
├─ Admin genera presupuesto (24h)
├─ Cliente acepta (2-3 días)
└─ Se crea reserva confirmada

SEMANA 2-5: PREPARACIÓN
├─ Verificar disponibilidad activos
├─ Reservar equipos en sistema
├─ Generar facturas
├─ Cliente paga (si aplica)
├─ Enviar recordatorios
└─ Coordinarse logística

DÍA DEL EVENTO: ENTREGA
├─ Operario llega 2h antes
├─ Descarga e instala equipos
├─ Prueba de funcionamiento
├─ Cliente firma conformidad
├─ Fotoevidencia GPS
└─ Firma digital en app

POST EVENTO: RETORNO
├─ Cliente notifica finalización
├─ Operario recoge equipos
├─ Inspecciona por daños
├─ Documenta estado
├─ Factura final se emite
└─ Pago restante (si hay diferencia)

COBRO Y EVALUACIÓN:
├─ Enviar factura final
├─ Cliente paga vía online
├─ Registrar pago en sistema
├─ Enviar recibo
└─ Solicitar evaluación (survey)
```

---

## Gestión de Perfiles y Roles

### Matriz de Permisos

```
FUNCIONALIDAD              │ SUPER │ ADMIN │ OPERARIO │ CLIENTE
                           │ ADMIN │PROV  │          │
─────────────────────────────────────────────────────────────
Ver Dashboard              │  ✅   │  ✅   │    ✅    │  ✅
Gestionar Usuarios         │  ✅   │  ✅   │    ❌    │  ❌
Crear Activo              │  ✅   │  ✅   │    ✅    │  ❌
Modificar Precios         │  ✅   │  ✅   │    ❌    │  ❌
Ver Reportes Financieros  │  ✅   │  ✅   │    ❌    │  ❌
Crear Reserva             │  ✅   │  ✅   │    ✅    │  ✅
Modificar Reserva Ajena   │  ✅   │  ✅   │    ✅    │  ❌
Cancelar Reserva          │  ✅   │  ✅   │    ✅    │  ✅
Ver Todas las Cotizaciones│  ✅   │  ✅   │    ❌    │  ❌
Ver Solo Mis Cotizaciones │  ✅   │  ✅   │    ❌    │  ✅
Registrar Mantenimiento   │  ✅   │  ✅   │    ✅    │  ❌
Reportar Daño             │  ✅   │  ✅   │    ✅    │  ✅
Ver Auditoría             │  ✅   │  ✅   │    ❌    │  ❌
Cambiar Configuración     │  ✅   │  ❌   │    ❌    │  ❌
Integrar Herramientas     │  ✅   │  ✅   │    ❌    │  ❌
```

---

## 🎓 Tips y Mejores Prácticas

### Para Administradores:

1. **Revisar Reportes Semanales**
   - Ocupación de activos
   - Clientes morosos
   - Equipos con mantenimiento próximo

2. **Mantener Catálogos Actualizados**
   - Preciosactual izados
   - Nuevas categorías según demanda
   - Fotos de calidad

3. **Comunicación Proactiva**
   - Enviar recordatorios 48h antes
   - Confirmación 24h antes
   - Seguimiento post-evento

4. **Mantenimiento Preventivo**
   - No esperar a que se dañe
   - Programar revisiones
   - Documentar todo

### Para Clientes:

1. **Reservar con Anticipación**
   - Mejores precios
   - Más opciones
   - Mayor flexibilidad

2. **Comunicar Necesidades Claramente**
   - Fotos de referencias
   - Especificaciones técnicas
   - Restricciones del lugar

3. **Verificar Equipos a la Entrega**
   - Revisar cantidades
   - Probar funcionamiento
   - Documentar con fotos
   - Reportar daños inmediatamente

4. **Evaluar el Servicio**
   - Dejar reseña (aumenta crédito)
   - Sugerencias de mejora
   - Referir amigos (ganan puntos)

---

## 📞 Soporte y Contacto

**Canales de Soporte:**
- 💬 Chat en vivo (9am-6pm)
- 📧 Email: soporte@eventconnect.com
- 📱 WhatsApp: +1-xxx-xxx-xxxx
- 🌐 Centro de ayuda: help.eventconnect.com

**Tiempo de Respuesta:**
- Urgente (evento en 24h): 1 hora
- Normal: 4 horas
- No urgente: 24 horas

---

**Última actualización: Febrero 2026**
**Versión: 2.0**
**© EventConnect - Todos los derechos reservados**
