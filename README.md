# ISER Matriculación 2026

Formulario digital de matriculación para el Instituto Superior de Enseñanza Radiofónica (ISER).

## Estructura del proyecto

```
iser-matriculacion/
├── public/
│   ├── index.html       → Formulario para alumnos
│   ├── panel.html       → Panel de bedelías
│   ├── formulario.js    → Lógica del formulario
│   └── styles.css       → Estilos
├── src/
│   └── materias.js      → Datos de carreras y materias
├── api/
│   ├── submit.js        → Recibe formularios → guarda en Sheets + Drive
│   └── panel.js         → API del panel de bedelías
├── vercel.json          → Configuración de Vercel
└── package.json         → Dependencias Node.js
```

## Imágenes requeridas en /public/
- `iser-logo.png` → Logo ISER azul
- `enacom-logo.png` → Logo ENACOM

## Variables de entorno en Vercel

Crear en el dashboard de Vercel → Settings → Environment Variables:

```
GOOGLE_SERVICE_ACCOUNT = { ...contenido del archivo JSON descargado... }
```

El valor debe ser el contenido COMPLETO del archivo JSON de la cuenta de servicio,
en una sola línea (sin saltos de línea).

## Claves del panel de bedelías

| Clave | Acceso |
|-------|--------|
| LOCUCIONTM2026 | Locución Turno Mañana |
| LOCUCIONTT2026 | Locución Turno Tarde + Producción |
| LOCUCIONTN2026 | Locución Turno Noche |
| GUION2026 | Guionista |
| CONVERGENCIA2026 | Convergencia |
| OPERACION2026 | Operación Radio + TV + Planta |
| DIRECTOR2026 | Vista general todas las carreras |

## URLs del sistema

- Formulario alumnos: `https://tu-dominio.vercel.app/`
- Panel bedelías: `https://tu-dominio.vercel.app/panel`

## Deploy en Vercel

1. Subir este repositorio a GitHub (cuenta: iser-admin)
2. Conectar en vercel.com con la cuenta de GitHub
3. Importar el repositorio
4. Agregar la variable de entorno GOOGLE_SERVICE_ACCOUNT
5. Deploy automático

## Google Sheets - Columnas

Cada sheet tiene estas columnas (se crean automáticamente):
- Timestamp, Fecha Formulario, Estado, Carrera, Turno
- Apellidos, Nombres, Fecha Nacimiento, Nacionalidad, DNI
- Domicilio, Localidad, CP, Tel Celular, Tel Alternativo, Email
- Año Matrícula
- Pendientes - 1er Año, Pendientes - 2do Año, Pendientes - 3er Año
- Recursar - 1er Año, Recursar - 2do Año, Recursar - 3er Año
- PDF URL
