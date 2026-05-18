# Medidor de pH

Sensor químico escolar digital de bajo costo con indicadores naturales (col morada, cúrcuma y jamaica).

## Ejecutar todo desde la raíz (recomendado)

```powershell
cd D:\Quimica
npm install
npm run install:all
npm run dev
```

Eso levanta:

- **Backend:** http://localhost:4000
- **Frontend:** http://localhost:5173

Abre el frontend en el navegador. El proxy de Vite conecta `/api` con el backend automáticamente.

## Ejecutar por separado

**Backend:**

```powershell
cd D:\Quimica\backend
npm install
npm run dev
```

**Frontend:**

```powershell
cd D:\Quimica\frontend
npm install
npm run dev
```

## Publicar en GitHub Pages

```powershell
cd D:\Quimica\frontend
npm run build
```

Luego sube el contenido de `frontend/dist` al repo `medidorph-web` (solo la carpeta `dist`, no todo el proyecto).

Demo: https://hernaldoca.github.io/medidorph-web/

## Estructura

```
Quimica/
├── package.json      # Scripts para correr backend + frontend juntos
├── backend/          # API Express (puerto 4000)
└── frontend/         # React + Vite (puerto 5173)
```
