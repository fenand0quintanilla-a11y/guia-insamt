Failed to create stream fd: Operation not permitted
Failed to create stream fd: Operation not permitted
Failed to create stream fd: Operation not permitted
# Guía INSAMT · Expotecnia 2026

Guía estática del Instituto Nacional de San Miguel Tepezontes. Incluye un modelo 3D, un plano 2D y fichas de proyectos revisados.

## Publicación

GitHub Pages publica el contenido de `dist/` mediante `.github/workflows/deploy-pages.yml`. En la configuración del repositorio, selecciona **GitHub Actions** como origen de Pages.

Para previsualizar localmente, ejecuta `python3 -m http.server 8000 --directory dist` y abre `http://localhost:8000/`. No abras `index.html` directamente como archivo porque los módulos JavaScript requieren un servidor.

## Actualizar proyectos

Revisa las respuestas del formulario fuera del repositorio. Agrega únicamente fichas aprobadas a `data/projects-approved.json` y ejecuta:

```sh
node scripts/build-projects.mjs
```

El generador valida nombres, lugares, límites de texto y fotografías antes de actualizar `dist/project-data.js`. La hoja de respuestas y los enlaces de edición del formulario deben permanecer privados. La definición de preguntas está en `docs/formulario-proyectos.md`.
