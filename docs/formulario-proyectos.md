# Formulario de proyectos · Expotecnia INSAMT 2026

**Estado:** especificación lista para crear en Google Forms. No se ha creado un formulario en la cuenta del instituto todavía.

**Título:** Registro de proyectos para la guía de Expotecnia INSAMT 2026

**Descripción:** Registra los datos de tu proyecto para que los visitantes puedan encontrarlo en el mapa del instituto. Un responsable revisará el aula, los nombres y la imagen antes de publicarlos. No incluyas teléfonos, correos ni otros datos personales en la descripción. La fotografía es opcional.

| Pregunta | Tipo | Obligatoria | Indicaciones |
| --- | --- | --- | --- |
| Nombre del proyecto | Respuesta corta | Sí | Máximo 80 caracteres. |
| Sección | Respuesta corta | Sí | Ejemplo: 1.º BTV Desarrollo de Software. |
| Integrantes que autorizan aparecer públicamente | Párrafo | No | Un nombre por línea; pueden dejarlo vacío. |
| Lugar del proyecto | Lista desplegable | Sí | Usar exactamente las opciones indicadas abajo. |
| Descripción corta | Párrafo | Sí | Hasta 280 caracteres; explicar qué hace el proyecto. |
| Fotografía del proyecto | Subir archivo: imagen, un archivo | No | Revisar derechos de uso y evitar mostrar estudiantes sin autorización. Google puede solicitar inicio de sesión para subir archivos. |
| Enlace a la fotografía | Respuesta corta | No | Alternativa a subir archivo; URL HTTPS pública con permiso para usarla en el mapa. |
| Confirmación de publicación | Casilla de verificación | Sí | «Autorizo la publicación de la información proporcionada sobre el proyecto. Solo se publicarán los nombres de integrantes que cuentan con autorización.» |

**Opciones de lugar:** Aula 1; Aula 2; Aula 3; Aula 4; Aula 5; Aula 6; Aula 7; Aula 8 / Laboratorio; Clínica; Aula 9; Aula 10; OPV; Aula 11; Taller automotriz; Cancha; Chalet 1; Chalet 2; Ubicación por confirmar.

**Ajustes:** no recopilar correos por defecto; no mostrar respuestas a otras personas; guardar respuestas en una hoja privada de responsables. La opción «Ubicación por confirmar» sirve para recibir proyectos cuya aula aún no está asignada, pero no se publica hasta verificarla.

## Publicación en el mapa

1. Revisar cada respuesta: nombre, lugar real, texto, imagen y autorización. Retirar datos personales ajenos al propósito del mapa.
2. Copiar únicamente los proyectos aprobados a `data/projects-approved.json`. `members` es una lista de nombres autorizados; `photo` es una URL HTTPS pública o una ruta local `./assets/...` optimizada. Dejar `members` vacío si falta permiso.
3. Ejecutar `node scripts/build-projects.mjs` desde la raíz del repositorio. El script valida los lugares, límites de texto, duplicados y URL de foto, y genera `dist/project-data.js`.
4. Probar las fichas y rutas en el modelo 3D y el plano 2D antes de publicar la siguiente versión.

La hoja de respuestas permanece privada. Nunca se enlaza ni se descarga desde el navegador público; el mapa contiene solo datos revisados.
