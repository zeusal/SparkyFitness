# Dónde lo dejamos (punto de control)

Fecha del punto de control: miércoles 21 de octubre de 2026. Se retoma el domingo 25 de octubre.

## Hecho

- `SparkyFitnessMobile/DESIGN.md` completo (secciones 1–9, incluida la guía "Building a New Screen") en la rama `claude/fervent-turing-yiim60`, PR borrador zeusal/SparkyFitness#48. Pendiente solo de que marques las casillas del PR.
- Plugin de Figma (esta carpeta, rama `figma-design-system`, separada del PR):
  - `src/data/tokens.ts` y `src/data/icons.ts` generados desde la app (61 colores × Light/Dark/AMOLED, 132 iconos Ionicons). Regenerar con `node scripts/gen-data.mjs <ruta>/SparkyFitnessMobile .`.
  - `src/core.ts`: núcleo (variables con 3 modos y scopes, variables de espaciado y radio, estilos de texto y sombra, helpers de layout, iconos como componentes con INSTANCE_SWAP, catálogo de componentes `COMPONENT_CATALOG`). Pasa `tsc` contra `@figma/plugin-typings` 1.142.
  - `src/main.ts`: orquestador (Cover → Foundations → Components → Patterns & Rules → Screens).
  - `scripts/mock-figma.mjs` + `scripts/run.mjs`: simulador estricto de la API de Figma para ejecutar el plugin en Node (`node scripts/run.mjs all` o `node scripts/run.mjs <módulo>`).
  - `manifest.json` y `README.md` (instrucciones para ejecutarlo en Figma Desktop).

## Versión de avance (lista para usar)

`src/main-preview.ts` construye Cover, Foundations y Components (controles, y superficies y filas). Se comprueba con `npm run typecheck:preview` y `npm run test:preview`, y se genera con `npm run build:preview`. En el simulador da 3 páginas, 204 componentes (16 con variantes), 69 variables, 25 estilos de texto y 4 de sombra.

## Pendiente

La construcción con agentes se cortó a las 16:08 UTC del 21 de octubre, cuando se reinició el entorno. Terminados y comprobados: `foundations.ts`, `components-controls.ts` y `components-surfaces.ts`. Faltan los cinco módulos marcados abajo:

| Módulo | Función | Contenido |
| --- | --- | --- |
| `src/foundations.ts` (hecho) | `buildFoundations` | Color, Typography, Spacing & Radius, Elevation, Iconography (crea los componentes de icono), Themes |
| `src/components-controls.ts` (hecho) | `buildControls` | Button, Text Field, Search Field, Stepper, Segmented Control, Switch, Picker Trigger, chips y badges |
| `src/components-surfaces.ts` (hecho) | `buildSurfaces` | Card Header, Card, Settings Row, Library Row, Diary Food Row, Meal Card Header, Swipe Delete Row, Collapsible Header |
| `src/components-navigation.ts` (falta) | `buildNavigation` | Tab Bar, Top Bar, Date Navigator, Footer bars, Bottom Sheet Picker, Action Sheet, Add Sheet, Dropdown Menu |
| `src/components-feedback.ts` (falta) | `buildFeedback` | Toast, Status View, Empty Day, Banner |
| `src/components-dataviz.ts` (falta) | `buildDataviz` | Progress Ring, Calorie Summary, Macro Bar, Macro Composition Ring, Hydration Gauge, Bar/Line Chart, Stat Tile, Legend, Exercise Progress Row |
| `src/patterns.ts` (falta) | `buildPatterns` | Screen anatomy, Screen types, States, Rules, Layout rhythm |
| `src/screens.ts` (falta) | `buildScreens` | Dashboard, Diary, Library, Settings en Light, Dark y AMOLED |

## Siguientes pasos

1. `npm install`, y después `npx tsc --noEmit -p .` y `node scripts/run.mjs all` hasta que no haya errores.
2. Revisión de fidelidad contra `DESIGN.md` y el código, y de los fallos de la API de Figma que el simulador no modela.
3. `npm run build` para generar `code.js` y subirlo a esta rama.
4. El usuario lo ejecuta en Figma Desktop (Plugins › Development › Import plugin from manifest…), en un archivo nuevo de sus borradores.
5. Con su permiso, una o dos llamadas al MCP de Figma para hacer capturas y revisar el resultado. Su plan Starter con asiento View tiene unas 20 llamadas al mes.
