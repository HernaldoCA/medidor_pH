# Medidor de pH

Sensor químico escolar digital de bajo costo que utiliza indicadores naturales (col morada, cúrcuma y jamaica) para identificar sustancias **ácidas**, **neutras** y **básicas**, con una interfaz educativa que registra, visualiza y analiza los experimentos.

🌐 **Demo:** [https://hernaldoca.github.io/medidor_pH](https://hernaldoca.github.io/medidor_pH)

## Características

- Interfaz intuitiva y educativa
- Explicación digital de los indicadores naturales
- Registro de experimentos con persistencia en `localStorage`
- Clasificación automática por color y por valor de pH aproximado real
- Animación del experimento (gotero, papelito y vaso)
- Escala de pH visual con flecha indicadora
- Historial de experimentos con resumen estadístico

## Estructura del proyecto

```
Quimica/
├── frontend/   # App web (React + Vite)
└── backend/    # API opcional (Node.js + Express)
```

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- npm

## Cómo ejecutarlo en local

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre la URL que muestre Vite (por defecto `http://localhost:5173`).

### Backend (opcional)

```bash
cd backend
npm install
npm run dev
```

El servidor queda en `http://localhost:4000`.

## Cómo publicar la web en GitHub Pages

Desde la carpeta `frontend`:

```bash
npm run deploy
```

El sitio queda publicado en la URL configurada en `frontend/package.json` (`homepage`).

## Tecnologías

- React 19
- Vite
- Express (backend opcional)
- gh-pages
