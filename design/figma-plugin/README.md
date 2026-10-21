# SparkyFitness Design System — plugin de Figma

Genera en un archivo de Figma el sistema de diseño completo de la app móvil de SparkyFitness, a partir de `SparkyFitnessMobile/DESIGN.md` y `global.css`:

| Página | Contenido |
| --- | --- |
| **Cover** | Portada con el índice del archivo. |
| **Foundations** | 61 variables de color con modos Light, Dark y AMOLED; tipografía por roles (estilos de texto); espaciado y radios (variables); sombras (estilos de efecto); los 132 iconos de la app como componentes; muestras de los tres temas. |
| **Components** | Botones, campos, controles, chips, tarjetas, filas, barra de pestañas, cabeceras, navegador de fecha, hojas inferiores, menús, barras inferiores, toasts, estados vacío/carga/error y gráficos, cada uno con sus variantes y estados. |
| **Patterns & Rules** | Anatomía de pantalla con medidas, tipos de pantalla, orden de estados, reglas sí/no y ritmo de espaciado. |
| **Screens** | Dashboard, Diario, Biblioteca y Ajustes montados con los componentes, en Light, Dark y AMOLED. |

Todos los colores están enlazados a variables y todos los textos a estilos, así que cambiar un token actualiza todo el archivo.

## Cómo ejecutarlo

Los plugins en desarrollo solo funcionan en **Figma Desktop** (la app de escritorio), no en el navegador.

1. Abre Figma Desktop y crea un archivo de diseño nuevo y vacío (o abre el que te haya creado).
2. Menú **Plugins › Development › Import plugin from manifest…** y elige `manifest.json` de esta carpeta.
3. Ejecuta **Plugins › Development › SparkyFitness Design System**.
4. Espera a que termine (puede tardar uno o dos minutos). Al acabar se cierra solo y muestra un resumen.

Ejecútalo una sola vez por archivo: si lo vuelves a lanzar en el mismo archivo, duplica todo. Para regenerar, usa un archivo nuevo.

Necesitas permiso de edición sobre el archivo. Con un asiento de solo lectura ("View") en un equipo, créalo en tus borradores.

## Notas

- La app usa la fuente del sistema (SF Pro en iOS, Roboto en Android). Figma no garantiza esas fuentes, así que el archivo usa **Inter** como sustituta. Para cambiarla, edita los estilos de texto en un solo sitio.
- Los iconos son los de Ionicons 7.4 (licencia MIT), el mismo juego que usa la app en Android. En iOS la app usa SF Symbols; cada icono indica su equivalente en la descripción del componente.
- Si tu plan de Figma no permite varios modos de variables, el archivo se genera solo en Light y el mensaje final lo indica.

## Para desarrolladores

```bash
npm install
npm run typecheck          # tipos contra @figma/plugin-typings
npm run build              # genera code.js
node scripts/run.mjs all   # ejecuta el plugin entero en un simulador estricto de la API de Figma
node scripts/gen-data.mjs <ruta>/SparkyFitnessMobile .   # regenera colores e iconos desde la app
```
