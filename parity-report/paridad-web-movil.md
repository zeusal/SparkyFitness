# SparkyFitness: paridad de funcionalidades Web ↔ Móvil e iOS ↔ Android

> Fuente: análisis estático del código de `SparkyFitnessFrontend/` (web) y `SparkyFitnessMobile/` (Expo/React Native) en la rama `ccr-bcf107e7-zhqjj8` (= `origin/main` @ `5364674f`). Cada diferencia fue re-comprobada por dos verificadores adversariales (uno intenta demostrar que lo «ausente» sí existe; otro que lo «presente» es realmente alcanzable desde la UI). La matriz completa con toda la evidencia está en el CSV adjunto.

## Actualizaciones posteriores al análisis (26-10-2026)

El análisis de abajo refleja `main` @ `5364674f` y se deja tal cual. Las filas que cambia el trabajo posterior llevan una nota debajo, con las PR fusionadas que las cambiaron (**Actualizado en la PR …** o **Cubierto en parte por la PR …**), o **Sigue pendiente** si lo previsto no se ha hecho. En el CSV las mismas notas están en dos columnas más, `estado_actualizacion` y `notas_actualizacion`. Las cifras de las secciones 0 a 3 no se recalculan.

Las notas cubren todo lo fusionado en `main` hasta `e5547e39f` (26-10-2026): 179 PR de 23 personas, incluidas las sincronizaciones de traducciones y el mantenimiento. Las 53 fusionadas hasta el 20 de octubre salen en la versión v1.9.0; las otras 126 están en `main`, pero todavía no en una versión publicada. 173 filas llevan nota, y las 27 funcionalidades nuevas que no cubre ninguna fila se listan después de esta sección. Lo que más cambia la paridad:

- **App de Wear OS** ([#3052](https://github.com/CodeWithCJ/SparkyFitness/pull/3052)): Android tiene ya también app de reloj, el equivalente de la app del Apple Watch. Tiene las mismas páginas (objetivos, agua, medicación, peso y tendencia, entreno con Now Playing, ayuno y pasos) y las mismas siete complicaciones, hace entrenos de fuerza, graba carreras y caminatas por su cuenta, sirve de mando de la grabación GPS del móvil y envía la frecuencia cardiaca en directo, así que las alertas de frecuencia cardiaca y la opción «Registrar con» aparecen ya también en Android. Siguen siendo solo del Apple Watch seguir rutas guardadas, la comba (Jump Rope), el doble toque, la valoración del esfuerzo al acabar un entreno y guardar los entrenos en una app de salud; en Wear OS el RPE de cada serie va de 5 a 10. Los textos propios de las dos apps de reloj están solo en inglés.
- **Acceso rápido y widgets en Android** ([#2989](https://github.com/CodeWithCJ/SparkyFitness/pull/2989), [#3020](https://github.com/CodeWithCJ/SparkyFitness/pull/3020), [#3021](https://github.com/CodeWithCJ/SparkyFitness/pull/3021)): las mismas cuatro acciones rápidas del icono que en iOS; cuatro baldosas de Ajustes rápidos (Registrar agua, Escanear código, Buscar comida y Calorías restantes) como equivalente de los controles del Centro de control; un widget de agua con − / + que registra sin abrir la app; y widgets que siguen el idioma de la app. Los nombres de las baldosas Registrar agua y Calorías restantes y el widget de agua están traducidos a 6 de los 15 idiomas que incluye la app además del inglés (español, polaco, portugués de Brasil, cantonés y chino simplificado y tradicional); las baldosas Escanear código y Buscar comida usan las etiquetas de los botones de los widgets de calorías y macros, traducidas a todos menos al letón.
- **La web alcanza al móvil:** comparación y time-lapse de las fotos de progreso ([#2965](https://github.com/CodeWithCJ/SparkyFitness/pull/2965)); programas de entrenamiento para correr y caminar con calendario mensual, sin la guía, los ritmos de referencia ni la creación o edición de planes ([#2948](https://github.com/CodeWithCJ/SparkyFitness/pull/2948)); y los resultados de las pruebas de forma física con sus ritmos de entrenamiento, en modo lectura ([#3154](https://github.com/CodeWithCJ/SparkyFitness/pull/3154)).
- **El móvil alcanza a la web:** categorías de mediciones personalizadas en Ajustes ([#3194](https://github.com/CodeWithCJ/SparkyFitness/pull/3194)); fotos en el chat de Sparky ([#3068](https://github.com/CodeWithCJ/SparkyFitness/pull/3068)); una pantalla Adherence para la medicación, que se abre desde «Adherence & log», con las cifras de adherencia, el calendario mensual, el registro del día y la edición de dosis registradas ([#3103](https://github.com/CodeWithCJ/SparkyFitness/pull/3103)); añadir unidades a un alimento como raciones con nombre, un editor que la web estrenó en la misma PR ([#2919](https://github.com/CodeWithCJ/SparkyFitness/pull/2919)); y el turco como idioma número 16 de la app ([#2959](https://github.com/CodeWithCJ/SparkyFitness/pull/2959)).
- **Funcionalidades nuevas:** ver la lista de abajo. 9 de las 27 están en la web, iOS y Android, 7 solo en la app del móvil (una de ellas solo en iPhone), 3 solo en la web y las otras 8 en las dos, pero en una de ellas solo en parte; cada entrada indica dónde está disponible y qué cambia.
- **Posibles problemas vistos al actualizar** (por confirmar en un dispositivo):
  - El flujo de publicación de Android del proyecto (`.github/workflows/android.yml`) solo compila la app del móvil y no activa `SPARKY_EMBED_WEAROS_RELEASE`, así que el APK y el AAB publicados no incluyen la app de Wear OS; solo la llevan las compilaciones de depuración o las de publicación hechas con esa opción.
  - Iniciar un ayuno desde el reloj Wear OS falla: el reloj envía el protocolo como `16:8`, `18:6`, `20:4` u `OMAD`, pero el móvil busca los protocolos por su id, que escribe `16-8`, `18-6` y `20-4` (y no tiene OMAD), así que rechaza la petición y no se guarda ningún ayuno.
  - En Android con un reloj Wear OS, el móvil sigue ofreciendo rutas guardadas para una carrera en el reloj (el selector de ruta de la pantalla de grabación, y «Start on watch» y «Send to watch» en una ruta guardada), pero la app de Wear OS no puede seguir rutas: una carrera iniciada con ruta se graba sin ella, y «Send to watch» falla porque el puente de Android no puede enviar rutas.
  - En iOS, al cambiar de cuenta no se vacían los widgets, que siguen mostrando las cifras de la cuenta anterior hasta que la app vuelve a escribirlas; Android sí los vacía.
  - Una caminata o carrera grabada en el reloj Wear OS se guarda sin mapa, parciales ni vueltas: el reloj envía los puntos GPS como `[lat, lon, hora]` y las vueltas como duraciones, mientras que el móvil espera filas `[hora, lat, lon, …]` y la hora de cada marca de vuelta, así que los descarta; además, las muestras de frecuencia cardiaca llevan los segundos desde el inicio en lugar de la hora del reloj, así que el móvil las guarda con horas erróneas.
- **Sigue pendiente:** las calorías consumidas y quemadas en el widget de calorías de Android, y más tamaños o poder redimensionar los widgets de calorías y macros ([#2050](https://github.com/CodeWithCJ/SparkyFitness/issues/2050)); la PR [#3228](https://github.com/CodeWithCJ/SparkyFitness/pull/3228), aún sin fusionar, cubre las dos cosas. Los widgets de pantalla de bloqueo, Siri/Atajos y los controles Quitar agua, Iniciar ayuno y Terminar ayuno siguen siendo solo de iOS.

### Funcionalidades añadidas después del análisis (hasta el 26-10-2026)

- **Varios registros de ánimo al día** (web, iOS y Android; #3013, #3016, #3018): Registra varios estados de ánimo al día, cada uno con su hora, y consúltalos en una lista con la media del día; cada registro se puede editar o borrar. En la web está en la página Check-in (pestaña Ayuno y estado de ánimo); en la app del móvil, la tarjeta de ánimo del Panel abre la lista del día.
- **Valoraciones de energía y concentración en el registro de ánimo** (web, iOS y Android; #3002, #3012): Puntúa de 1 a 5 la energía (de Agotado a Con energía) y la concentración (de Disperso a Enfocado al máximo, o Totalmente enfocado en el móvil) al registrar el ánimo; las dos son opcionales y aparecen en los registros del día y en su media. Igual en la web, iOS y Android.
- **Recordatorios del registro de ánimo** (iOS y Android; #3028): Recibe un aviso diario para registrar el ánimo a las horas que elijas (hasta cinco) en Ajustes > Ajustes de la app > Notificaciones; al tocarlo se abre un registro nuevo. Solo en la app del móvil, igual en iOS y Android (Android les da su propio canal de notificaciones).
- **Informe Compare: ¿van juntas dos cosas que registras?** (web, iOS y Android; #3058, #3076, #3108): Elige dos de 24 cosas que registras (ánimo, sueño, frecuencia cardiaca, comida, entrenamiento, peso, pasos y más) y un desfase para ver si van juntas, por días o por semanas, con una respuesta, un gráfico de puntos, un gráfico en el tiempo y comprobaciones. Igual en la web y en la app del móvil, pero la web muestra los dos gráficos a la vez y añade una tabla con los otros desfases y otra día a día.
- **Compare: antes y desde que empezó un hábito** (web, iOS y Android; #3084, #3116): Pregunta a Compare si algo cambió desde que empezaste un hábito: compara los días anteriores y posteriores a una fecha de inicio que sugiere o que eliges, con un gráfico de antes y después. Igual en la web y en la app del móvil; la web añade una tabla mes a mes.
- **Preguntas de Compare en el chat de Sparky y por MCP** (web, iOS y Android; #3089): Pregunta al chat de Sparky, o a un asistente de IA conectado por MCP, si dos cosas que registras van juntas o si algo cambió desde que empezaste un hábito; usa el mismo análisis que el informe Compare y solo lee tus propios datos. Disponible allí donde está el chat: web, iOS y Android.
- **Informe de frecuencia cardiaca** (web, iOS (en parte) y Android (en parte); #3143, #3165): Un informe de frecuencia cardiaca con la tendencia de tu FC en reposo (media y rango) y los rangos de tus propias zonas. La web añade líneas de tiempo de FC de 24 horas y de varios días y una sección por entreno; la app del móvil no tiene ninguna de las dos, pero añade la recuperación a 1 minuto y observaciones.
- **Ajustes de zonas de frecuencia cardiaca** (web, iOS y Android; #3078, #3165): Indica tu FC máxima y en reposo, elige cómo se calculan las cinco zonas (% de la máxima, reserva de FC o bpm a medida) y muéstralas como cinco zonas o cuatro niveles; las zonas se usan para el tiempo en zona, la carga de entrenamiento y los rangos sugeridos al correr. Igual en la web y en la app del móvil, salvo «Use Apple Health zones», que solo tienen los iPhone con iOS 27.
- **Preparación, forma y estimaciones de carrera** (web, iOS y Android; #3155): Una tarjeta Readiness and Form (una puntuación de preparación sobre 100 a partir de la forma, el sueño, la FC en reposo y la VFC, y el estado físico, la fatiga y la forma según tu carga de entrenamiento) y una tarjeta Running Estimates (VO2 máx. y potencia de carrera estimados), en Informes > Progreso de ejercicio de la web y en Estadísticas de ejercicios del móvil. Solo la app del móvil muestra además la preparación en la tarjeta de carga de entrenamiento del Panel y, si no hay VO2 máx. sincronizado, dibuja la estimación en el gráfico de VO2 máx. del Panel.
- **Biblioteca de rutas guardadas** (iOS y Android; #3022): Guarda rutas en Biblioteca > Rutas: dibújalas en un mapa, impórtalas de un archivo GPX o guarda el recorrido de una actividad grabada, y luego consúltalas con su distancia y desnivel, cámbiales el nombre, compártelas como GPX o bórralas. Solo en la app del móvil; en Android, dibujar en un mapa requiere una compilación con clave de Google Maps.
- **Generación de rutas y estilo de ruta** (web (en parte), iOS y Android; #3071, #3141): Con un proveedor de rutas (Valhalla) configurado en la web, la app del móvil puede generar una ruta circular o de ida y vuelta según la actividad y la distancia, con hasta tres opciones de circuito y un estilo de ruta (superficie, desnivel, escaleras, calles con tráfico), y hacer que las rutas dibujadas sigan las calles. La web solo configura el proveedor; en Android hace falta una compilación con clave de Google Maps.
- **Editar una ruta guardada en el mapa** (iOS y Android; #3077): Edita el trazado de una ruta guardada en el mapa: arrastra, añade o borra puntos, cambia entre mapa y satélite, deshaz o rehaz y, con un proveedor de rutas, elige si cada tramo sigue las calles o va en línea recta. Solo en la app del móvil; no aparece en las compilaciones de Android sin clave de Google Maps.
- **Seguir una ruta guardada en el Apple Watch** (iOS y Apple Watch; #3090): Envía rutas guardadas al Apple Watch o empieza una desde el móvil, y síguela en una carrera o caminata al aire libre con avisos de giro (vibración y voz), un mapa y alertas al salirte de la ruta. Solo iPhone y Apple Watch: con un reloj Wear OS, el móvil Android sigue mostrando Start on watch y Send to watch, pero el envío falla y la carrera de Wear OS ignora la ruta.
- **Compartir una actividad de cardio como imagen** (iOS y Android; #3014): Comparte una actividad de cardio como imagen: sus datos y, si tiene recorrido GPS, su ruta, con diseño Clásico, Ruta o Minimalista (el Minimalista sin la ruta) y el color de texto que elijas, sobre una foto de la galería o de la cámara o sobre fondo transparente. Solo en la app del móvil, igual en iOS y Android.
- **Objetivos de carrera: distancia semanal y cuenta atrás para la carrera** (iOS y Android; #3144): Fija un objetivo de distancia semanal de carrera y una carrera con cuenta atrás en la pantalla de programas de entrenamiento; el día de la carrera también puede pasar a ser la fecha objetivo del programa. Solo en la app del móvil, igual en iOS y Android.
- **Reajustar un programa de carrera para que acabe el día objetivo** (web (en parte), iOS y Android; #3109): Cuando las semanas perdidas o el tiempo de sobra hacen que un programa de carrera ya no acabe en su día objetivo, reajusta el resto del plan tras ver el antes y el después. La app del móvil tiene una tarjeta para ello en la pantalla de programas de entrenamiento; en la web solo se puede hacer pidiéndoselo al chat de Sparky.
- **Pruebas guiadas de forma física para correr** (web (en parte), iOS y Android; #3154): Haz una prueba guiada de forma física (contrarreloj de 5K, carrera a tope de 30 minutos o test de Cooper de 12 minutos) al aire libre o en cinta para obtener tu ritmo umbral y tus ritmos de entrenamiento, que luego fijan tus zonas de ritmo y tus planes. Las pruebas solo se graban en la app del móvil, nunca en un reloj; la web muestra los resultados, sin poder cambiarlos, en Informes > Progreso de ejercicio > Cardio.
- **Calculadora de discos** (web (en parte), iOS y Android; #3186): Consulta qué discos cargar a cada lado de una barra, barra Z o barra hexagonal para una serie, con las barras y discos que tienes (Equipamiento > Plates & bars), o los pesos más cercanos que puedes montar. La app del móvil la ofrece en el entreno en curso y en los formularios de entreno y de plantilla; la web, solo en el reproductor de entrenos.
- **Vincular un entreno registrado con uno sincronizado** (web, iOS y Android; #3114): Vincula un entreno registrado en SparkyFitness con la misma sesión sincronizada desde un reloj o una app de salud y elige qué calorías cuentan (SparkyFitness, sincronizadas, las más altas, las más bajas, la media o una cifra propia), para que el día las cuente una sola vez; el vínculo se puede quitar. Igual en la web, iOS y Android.
- **Esfuerzo del entreno (1-10)** (web (en parte), iOS, Android (en parte) y Apple Watch; #3065, #3139): Puntúa de 1 a 10 lo duro que fue un entreno en el Apple Watch al acabar un entreno de fuerza o una carrera o caminata grabada en el reloj. El iPhone también lee las valoraciones de esfuerzo guardadas en Apple Health, y las actividades importadas de Intervals.icu traen la valoración que se les dio allí. La web y la app de Android solo muestran una valoración ya guardada, y ni la web ni la app del móvil permiten introducirla ni cambiarla; la valoración que pide la app del móvil tras un entreno de un programa de carrera se guarda en el programa, no en el entreno.
- **Principales alimentos que aportan un nutriente** (iOS y Android; #3009): Consulta qué alimentos registrados aportaron más de un nutriente en 7, 30 o 90 días, filtrando por comida o por un solo día, y abre las entradas de cada alimento. Solo en la app del móvil (tendencias de nutrientes), igual en iOS y Android.
- **Introducir el sodio como gramos de sal** (web (solo); #3150): En los formularios de alimentos y suplementos de la web, escribe en gramos la sal que pone la etiqueta en lugar del sodio en mg; se guarda como sodio (1 g de sal = 400 mg). La app del móvil solo tiene el campo de sodio en mg.
- **Operaciones en los campos de cantidad** (web (solo); #2935): Escribe una operación como 30*5 o (2+1)/2 en los campos de cantidad de la web al registrar o editar alimentos y comidas, y se sustituye por el resultado. Los campos de cantidad de la app del móvil solo aceptan números.
- **Contar aparte las calorías de actividad (objetivo calórico adaptativo)** (web, iOS y Android; #3061): Con el modo Objetivo dinámico y el método adaptativo, un interruptor opcional deja la actividad pasada fuera de la base calórica aprendida y suma una sola vez los pasos y entrenos de hoy al presupuesto del día. Igual en la web y en la app del móvil; la web además lo explica en el desglose del objetivo calórico.
- **Preferencias de comida y tareas guardadas en el chat de Sparky** (web, iOS (en parte) y Android (en parte); #2808): Sparky puede recordar preferencias de comida duraderas y guardar el trabajo de comida en varios pasos como tareas para retomarlas más tarde. El chat de la web tiene un panel para editar u olvidar preferencias y para consultar, cancelar o retomar tareas; el chat del móvil puede usarlas pero no tiene panel.
- **Búsqueda web con fuentes para preguntas de comida** (web, iOS (en parte) y Android (en parte); #2807): Con un servicio de IA de OpenAI GPT-6, Sparky puede buscar en internet para responder preguntas de comida, y el chat de la web muestra las fuentes como enlaces. El chat del móvil recibe las mismas respuestas pero no muestra las fuentes.
- **Integración con Intervals.icu** (web (solo); #3139): Conecta Intervals.icu con un Athlete ID y una clave de API para importar actividades y datos diarios de bienestar (peso, FC en reposo, VFC, VO2 máx. y más), sincronizados para un rango elegido o cada hora. Solo se configura en la web; la app del móvil muestra los datos importados pero no puede conectarlo.

## 0. Resumen ejecutivo

**Cifras:** 1.373 filas inventariadas. 1.204 son de dominios funcionales y 169 de los barridos específicos iOS/Android. De las funcionales, **350 están en paridad**, **217 existen en ambos clientes con diferencias**, **376 son solo web** y **241 son solo móvil**. Dentro del móvil hay **48 funcionalidades solo iOS**, **10 solo Android** y **58 que difieren** entre plataformas (contadas por dominio; la sección 3 trae el detalle completo y deduplicado por nombre).
Algunas capacidades aparecen en más de un dominio, por ejemplo las claves API en *Autenticación*, *Administración* y *Ajustes*. Las cifras miden granularidad, no funcionalidades únicas.

### 0.1 Lo que tiene la web y no el móvil (bloques principales)
- **Gestión de la cuenta:** registro, olvido y restablecimiento de contraseña, magic link, modo demo, activar o desactivar MFA (TOTP y email), códigos de recuperación, cambiar email o contraseña, y crear, revocar y limpiar claves API. En el móvil solo se *inicia sesión*, también con MFA, passkey, OIDC o clave API.
- **Panel de administración completo:** usuarios, métodos de acceso, proveedores OIDC, copias de seguridad y restauración, servicios de IA globales, proveedores globales, importaciones masivas CNF y Livsmedelsverket, y nivel de logs.
- **Integraciones de terceros en el servidor:** conectar o desconectar Garmin, Fitbit, Withings, Oura, Polar, COROS (y COROS MCP), Strava, Google Health, Hevy y Liftosaur; sincronizar por rango; botón global de sincronización; borrar datos por fuente; gestionar los proveedores de alimentos y ejercicios (OFF, USDA, Mealie, Tandoor, wger…) y su prioridad.
- **Importación y exportación:** CSV de alimentos, diario, check-in y salud, ejercicios e historial de entrenamientos, archivos `.FIT`, y exportaciones CSV de diario, informes y medicación.
- **Perfil y preferencias:** avatar, nombre, teléfono, fecha de nacimiento, género, biografía, formato de fecha, decimales, bebida estándar y límite de alcohol, y modo de escala de gráficos.
- **Acceso familiar:** conceder, editar, revocar y fijar permisos granulares. También el *selector de perfil* para actuar en nombre de un familiar: registrar en su diario, su check-in, su medicación y sus informes. El móvil solo **ve** el diario familiar y copia comidas de él.
- **Objetivos avanzados:** el asistente de onboarding de objetivos (datos corporales, plan, dieta, plan en cascada de 6 meses), algoritmos de BMR y grasa corporal, TDEE adaptativo medido, peso objetivo, objetivos solo para una fecha, macros por % y plantillas de distribución por comida.
- **Informes avanzados:** Ciencia del sueño (deuda, cronotipo, curva de energía, necesidad), tendencias de fuerza (1RM, mejor serie, tiempo bajo tensión), recorridos coincidentes, telemetría estructurada, tablas con CSV, zoom y maximizar gráficos, e informe de medicación con correlaciones y PDF para el prescriptor.
- **Check-in:** gestor de categorías personalizadas (incluidas Hourly/All), estados de ánimo personalizados, registro manual de sueño con editor de fases, y edición o borrado de registros de sueño.
  - **Cubierto en parte por la PR #3194 (fusionada):** el móvil tiene ya el gestor de categorías personalizadas en Ajustes > Custom Measurements, donde se pueden crear categorías Hourly y All, pero el check-in del móvil sigue registrando solo las Daily. Los estados de ánimo personalizados y registrar, editar o borrar el sueño a mano siguen siendo solo de la web.
- **Medicación y síntomas:** adherencia, calendario de tomas, posponer dosis, editar dosis registradas, nota al registrar, valoración de eficacia, foto de pastilla, GLP-1 personalizado, escala de Bristol, campos personalizados de síntomas, e informe y exportación de síntomas.
  - **Cubierto en parte por las PR #3005 y #3103 (fusionadas):** el móvil tiene ya las cifras de adherencia, el calendario de tomas y la edición de dosis registradas (hora, nota, zona de inyección y estado, incluido Snoozed) en una nueva pantalla Adherence, que se abre desde «Adherence & log» en Medicación, y un botón «Recordar en» en los recordatorios de medicación. Lo demás sigue siendo solo de la web.
- **Ciclo y embarazo:** contador de patadas, temporizador de contracciones, citas médicas, informe imprimible, biblioteca de artículos, plan de parto, productos menstruales, probabilidad de concepción, gráfico de ventana fértil y simulación hormonal.
- **Chat IA:** configurar proveedores de IA personales (clave, modelo, prompt de sistema, visión), adjuntar imágenes, editar mensajes y navegar por ramas, ver el razonamiento, estadísticas de tokens, y elegir categorías de herramientas y el perfil Full/Core.
  - **Cubierto en parte por la PR #3068 (fusionada):** el chat del móvil ya permite adjuntar fotos, hasta 5 por mensaje, y las vuelve a mostrar en el historial. Lo demás sigue siendo solo de la web.

### 0.2 Lo que tiene el móvil y no la web
- **Salud del dispositivo:** sincronización con Apple Health / Health Connect (lectura, escritura de nutrición e hidratación, segundo plano, al abrir la app, importación de historial, rutas y FC de entrenos). La web lo sustituye en parte con las integraciones cloud del servidor.
- **Running y GPS:** grabación GPS desde el teléfono (auto-pausa, intervalos, alertas de ritmo y avisos de voz), distancia en interior por pasos, programas de carrera con calendario y planificación, exportación GPX y zonas de ritmo.
  - **Cubierto en parte por las PR #2948 y #3154 (fusionadas):** la web tiene ya los programas de carrera con calendario mensual, puede empezar planes creados en el móvil y muestra en modo lectura los resultados de las pruebas de forma física y sus ritmos de entrenamiento. Grabar, la distancia en interior, planificar una carrera, crear o editar planes, exportar GPX y las zonas de ritmo calculadas con las carreras recientes siguen siendo solo del móvil.
- **Entreno en vivo:** calculadora de calentamiento, descanso por defecto, sonidos (también en modo silencio), mantener la pantalla encendida, aviso de fin de descanso con acción «Completar serie», barra de entreno minimizada, renombrar o borrar series en curso, y guardar el entreno como preset.
- **Apple Watch** (app completa), **widgets**, **accesos rápidos**, **Siri/Atajos** y **Controles del Centro de Control** (ver sección 3).
- **Notificaciones locales:** recordatorios de medicación con acciones, de agua, objetivos de ayuno y episodio de síntoma abierto. En la web solo existe el icono de avisos del servidor.
- **Fotos de progreso:** historial por ángulo, comparador antes/después, time-lapse y visor con zoom.
  - **Cubierto en parte por la PR #2965 (fusionada):** la web tiene ya el comparador antes/después y el time-lapse. El historial por ángulo y el visor con zoom siguen siendo solo del móvil.
- **Escaneo:** etiqueta nutricional y *Supplement Facts* por foto (en iOS 27+ incluso en el dispositivo), código de barras de suplementos, y alternativas cuando no se encuentra el código.
- **Diario:** cambiar de día deslizando, mover una entrada a otra fecha, editar la nutrición de una entrada concreta, ajuste rápido de porción, selección múltiple al añadir, y tarjetas de sueño, mediciones y fotos dentro del diario.
- **Medicación:** activar o desactivar un medicamento y **editar o pausar pautas existentes**. En la web solo se crean y borran.
- **Informes:** reparto de macros del periodo, días destacados, constancia de registro, rachas de agua, sueño entre semana frente a fin de semana, y reordenar u ocultar informes.
- **Ciclo:** previsión de síntomas, registro diario en embarazo, editar la fecha probable de parto y sincronizar BBT y datos reproductivos desde la app de salud.
- **Conexión:** varios servidores o cuentas, cabeceras de proxy, login con clave API, servidores LAN o autofirmados, y logs con informe de diagnóstico. También el tema AMOLED.

### 0.3 iOS frente a Android (lo esencial)
- **Solo iOS:**
  - Apple Watch completo: páginas Objetivos, Agua, Medicación, Check-in de peso, Ayuno y Pasos; complicaciones; fuerza en la muñeca; carrera autónoma; FC en vivo y alertas de FC al grabar. No hay app de Wear OS.
    - **Cubierto en parte por la PR #3052 (fusionada):** Android tiene ya una app de Wear OS con las mismas páginas y complicaciones, entrenos de fuerza en la muñeca, carreras y caminatas autónomas, y frecuencia cardiaca en directo y alertas de frecuencia cardiaca al grabar. Seguir rutas guardadas, la comba (Jump Rope), el doble toque y la valoración del esfuerzo al acabar un entreno siguen siendo solo del Apple Watch.
  - Live Activities interactivas (entreno y carrera) en pantalla de bloqueo y Dynamic Island.
  - Widget de agua con +/−, widgets de pantalla de bloqueo, Controles del Centro de Control (iOS 18+) y Siri/Atajos (agua, ayuno, peso).
    - **Cubierto en parte por las PR #2989 y #3020 (fusionadas):** Android tiene ya el widget de agua con − / + (PR #3020) y cuatro baldosas de Ajustes rápidos como equivalente de los controles del Centro de control: Registrar agua, Escanear código, Buscar comida y Calorías restantes (PR #2989). Siguen siendo solo de iOS los widgets de pantalla de bloqueo, Siri/Atajos y los controles Quitar agua, Iniciar ayuno y Terminar ayuno.
  - Cuatro accesos rápidos en el icono, frente a uno en Android.
    - **Actualizado en la PR #2989 (fusionada):** Android tiene ya los mismos cuatro: Escanear comida, Registrar comida y Ayuno, más el atajo nativo Registrar agua, que registra sin abrir la app.
  - Lectura de etiquetas en el dispositivo con Apple Intelligence (iOS 27+) y navegación *Liquid Glass* (iOS 26+).
  - Métricas exclusivas de HealthKit: movilidad, dinámica de carrera, ciclismo, anillos de Apple, alcohol en sangre y flujo menstrual.
  - Sincronización inmediata mediante observadores de HealthKit.
- **Solo Android:**
  - Permiso de alarmas exactas y canales de notificación.
  - Métricas exclusivas de Health Connect: velocidad y potencia genéricas, desnivel, masa de agua corporal, cadencia de pasos, masa ósea, impulsos de silla de ruedas y periodo menstrual.
  - Informe anonimizado de datos de salud en Sincronización.
  - Refresco de widgets desde la tarea en segundo plano.
  - Consejo para grabar con la pantalla apagada.
  - Selector de idioma dentro de la app (en iOS se delega a Ajustes del sistema).
  - Instalación nativa en tablet (iOS no tiene versión para iPad).
- **Iguales pero distintos:**
  - Entreno en curso: Live Activity con botones en iOS; notificación de solo lectura en Android.
  - Widget de macros: anillo de composición en iOS; barras con objetivos en Android.
  - **HRV:** SDNN en iOS y RMSSD en Android, valores no comparables entre sí.
    - **Actualizado en las PR #3019 y #3100 (fusionadas):** la misma diferencia llega ahora al sueño: las noches sincronizadas llevan una HRV nocturna calculada con SDNN en iOS y con RMSSD en Android, guardada en un mismo campo que no indica cuál, así que la HRV nocturna de los informes de sueño tampoco es comparable entre plataformas.
  - Mapas: en Android hace falta una clave de Google Maps; sin ella solo se dibuja la línea de la ruta.
  - Passkeys: Android fuerza un navegador compatible.
  - Certificados: Android confía en las CA instaladas por el usuario.
  - Importación de historial: Android tiene cuota diaria de Health Connect y pide consentimiento de ruta por sesión.
  - Sonido de descanso: en iOS suena en segundo plano y con la pantalla bloqueada.
  - Escritura de grasas trans: solo en Android.

### 0.4 Posibles incidencias detectadas durante el análisis
Son efectos secundarios del inventario, a confirmar en un dispositivo:
- iOS muestra los interruptores **Masa ósea**, **Impulsos de silla de ruedas** y **Periodo menstrual**, que nunca leen datos en HealthKit. «Impulsos de silla de ruedas» probablemente debería mapearse a `PushCount`.
- En Android el botón **Atrás** no cierra `ServingAdjustSheet` ni `CopyMealSheet`.
- El atajo de lanzador **«Log water»** de Android tiene la etiqueta fija en inglés, y las frases de **Siri** solo están en inglés.
  - **Actualizado en las PR #2989 y #3051 (fusionadas):** la etiqueta del atajo sale ahora de las cadenas traducibles de la app y está traducida a 10 de los 15 idiomas que incluye la app además del inglés; su descripción larga, «Log water without opening the app», a 6 (español, polaco, portugués de Brasil, cantonés y chino simplificado y tradicional). Las frases de Siri no cambian y siguen solo en inglés.
- El interruptor «Usar también en mi Apple Watch» de los ritmos de referencia aparece en iPhones **sin** reloj emparejado: solo se comprueba `Platform.OS === 'ios'`.
  - **Actualizado en la PR #3052 (fusionada):** sigue pasando, y ahora también en Android: el interruptor, que allí dice «Also use on my Wear OS watch», aparece en cualquier iPhone o móvil Android en cuanto se guarda un tiempo de carrera, con o sin reloj emparejado, porque `RunProgramsScreen.tsx` solo comprueba la plataforma.
- En la web, el desafío MFA por email no permite **reenviar el código** sin recargar la página. El móvil sí lo permite.
- Hay métricas de HealthKit definidas pero desactivadas (`enabled: false`): estrés, grasa, proteína y sodio dietéticos, y exposición al audio. No aparecen en ninguna plataforma.



## 1. Resumen por dominio

| Dominio | Total | Ambos (paridad) | Parcial | Solo web | Solo móvil | Solo iOS | Solo Android | Difiere iOS/Android |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Autenticación y seguridad de cuenta | 62 | 13 | 3 | 25 | 16 | 0 | 0 | 3 |
| Administración y recursos de desarrollador | 90 | 5 | 1 | 61 | 12 | 0 | 1 | 2 |
| Diario de comidas y registro diario | 91 | 28 | 29 | 14 | 19 | 3 | 0 | 7 |
| Biblioteca de alimentos, comidas y planes de comidas | 84 | 43 | 18 | 18 | 5 | 0 | 0 | 1 |
| Ejercicios, entrenamientos y running | 96 | 41 | 11 | 16 | 28 | 6 | 1 | 6 |
| Check-in, medidas corporales y bienestar | 70 | 29 | 10 | 11 | 20 | 7 | 0 | 2 |
| Objetivos y onboarding | 77 | 31 | 10 | 31 | 5 | 1 | 0 | 3 |
| Informes y analíticas | 118 | 20 | 49 | 38 | 11 | 1 | 0 | 1 |
| Medicación, GLP-1 y síntomas | 98 | 33 | 24 | 28 | 13 | 1 | 1 | 1 |
| Ciclo menstrual, fertilidad y embarazo | 96 | 35 | 20 | 32 | 8 | 0 | 0 | 2 |
| Chat con IA (SparkyChat) y ajustes de IA | 85 | 28 | 12 | 34 | 11 | 2 | 0 | 4 |
| Ajustes, perfil, familia e integraciones | 130 | 32 | 21 | 51 | 25 | 2 | 2 | 8 |
| Capacidades nativas del móvil | 82 | 8 | 6 | 7 | 60 | 25 | 5 | 18 |
| Elementos añadidos por el crítico de completitud | 25 | 4 | 3 | 10 | 8 | 0 | 0 | 0 |
| **Total** | **1204** | **350** | **217** | **376** | **241** | **48** | **10** | **58** |

Leyenda: *Parcial* = existe en ambos clientes pero uno ofrece una versión reducida o distinta. Las columnas iOS/Android cuentan solo funcionalidades presentes en el móvil.

## 2. Detalle por dominio

### 2.1 Autenticación y seguridad de cuenta

#### Solo en la web (25)

- **Registro de cuenta nueva (email/contraseña)** — Pestaña 'Sign Up' con nombre completo, email y contraseña. La contraseña se valida en vivo (mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial). La pestaña se oculta con un aviso cuando el servidor tiene signup_disabled.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Auth/Auth.tsx:295-312 (validatePassword), 314-346 (handleSignUp), 502-531 (pestañas y aviso 'Registration is currently disabled'), 664-760 (formulario)
  - Nota: En el móvil solo se puede crear una cuenta de forma implícita al entrar por SSO/OIDC, si el proveedor tiene auto_register (lo aplica el servidor en SparkyFitnessServer/auth.ts:639-690 con disableImplicitSignUp false en 914).
- **Solicitar restablecimiento de contraseña ('¿Olvidaste la contraseña?')** — Enlace en el login que abre /forgot-password. Ahí se introduce el email y se envía un enlace de restablecimiento, con un mensaje neutro que no revela si la cuenta existe.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Auth/Auth.tsx:584-591 (enlace); src/pages/Auth/ForgotPassword.tsx:29-46, 73-105; src/App.tsx:319 (ruta /forgot-password)
- **Restablecer contraseña con token** — Página /reset-password?token=… con nueva contraseña, confirmación, botón para mostrar u ocultar y la misma validación de complejidad que el registro. Al terminar redirige al inicio.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Auth/ResetPassword.tsx:38-111 (token, validatePassword, confirmación); src/App.tsx:324 (ruta /reset-password)
- **Inicio de sesión con enlace mágico (magic link)** — Botón 'Request Magic Link' que abre un diálogo para pedir por email un enlace de acceso sin contraseña. La verificación vuelve a la ruta /login/magic-link.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Auth/Auth.tsx:348-353, 623-630, 847-854; src/pages/Auth/MagicLinkRequestDialog.tsx; src/api/Auth/auth.ts:34-37; src/App.tsx:329
  - Nota: En la web el botón se muestra siempre que el login por email está activo, sin comprobar un ajuste específico de magic link.
- **Modo demo (acceso con un clic)** — Si el servidor tiene demo_mode aparece el botón 'Explore Live Demo'. Abre un diálogo de aviso (licencia, sandbox público, reinicio diario a las 00:00 UTC, ajustes protegidos) con una casilla de aceptación obligatoria, y después entra en la cuenta demo.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Auth/Auth.tsx:820-842 (botón), 855-880 (confirmación y demoLogin); src/pages/Auth/DemoDisclaimerDialog.tsx:48-192; src/hooks/Auth/useAuth.ts:18-30
- **Redirección automática a OIDC** — Si hay un único proveedor OIDC, el login por email está desactivado, auto_redirect está activo y no es modo demo, la web redirige sola al proveedor a los 800 ms.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Auth/Auth.tsx:85-119
- **Autocompletado de passkey (Conditional UI)** — En cuanto se abre el login, el navegador puede proponer passkeys guardadas desde el autocompletado del campo email (autocomplete='username webauthn'), sin pulsar ningún botón.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Auth/Auth.tsx:138-238 (signIn.passkey({autoFill:true})), 554
- **Código de recuperación en el desafío MFA** — Pestaña 'Recovery Code' para entrar con un código de respaldo si se ha perdido el acceso al TOTP o al email.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Auth/MfaChallenge.tsx:173-212, 364-402 (twoFactor.verifyBackupCode)
  - Nota: Sin el autenticador, el usuario del móvil tiene que recurrir a la web o a una clave API.
- **Activar MFA con app autenticadora (TOTP)** — En Ajustes > Seguridad de la cuenta: se confirma la contraseña, se muestra un QR, se verifica un código de 6 dígitos y se activa el TOTP; al activarlo se generan también códigos de respaldo.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/MFASettings.tsx:79-101 (twoFactor.enable con method totp), 162-197 (verificación), 336-435 (UI y QR 380-382); montado en AccountSecurity.tsx:283
  - Nota: La web solo muestra el QR, no el secreto en texto para introducirlo a mano.
- **Desactivar MFA TOTP** — Botón 'Disable' del autenticador, con confirmación de contraseña.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/MFASettings.tsx:103-120, 341-354, 275-334 (tarjeta de confirmación de contraseña)
- **Activar/desactivar MFA por código de email** — Interruptor (Enable/Disable) del segundo factor por email. A diferencia del TOTP, no pide contraseña.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/MFASettings.tsx:199-255, 437-480 (useToggleEmailMfaMutation)
- **Generar, ver y copiar códigos de recuperación** — Genera nuevos códigos de respaldo (con contraseña) y permite mostrarlos u ocultarlos y copiarlos al portapapeles, con el aviso de que no se volverán a mostrar.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/MFASettings.tsx:121-137 (generateBackupCodes), 257-266 (copiar), 484-559 (UI)
- **Cambiar el email de la cuenta** — Campo con el email actual editable y la contraseña actual (se deja vacía si se entra por SSO), más el botón 'Update Email'.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/AccountSecurity.tsx:38-56, 116-165; src/hooks/Settings/useAccountSecurity.ts:6-30 (/identity/update-email); SettingsPage.tsx:216
- **Cambiar la contraseña** — Formulario con contraseña actual, nueva y confirmación (mínimo 8 caracteres). Al cambiarla se revocan las demás sesiones.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/AccountSecurity.tsx:58-102 (revokeOtherSessions: true en 95), 169-279; src/hooks/Settings/useAccountSecurity.ts:32-55
  - Nota: Efecto entre plataformas: revocar las otras sesiones invalida los tokens de sesión del móvil, que recibirá 401 y abrirá ReauthModal. Aquí la complejidad mínima es solo la longitud; en el registro y el reset se exigen más reglas.
- **Generar una clave API** — Crea una clave API con descripción, caducidad (Nunca, 7, 30 o 90 días, 1 año) y alcance (acceso completo o solo lectura). La clave se muestra una única vez, con botón de copiar y otro de descartar.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ApiSettings.tsx:60-79, 146-190 (clave mostrada una vez), 192-273 (formulario); SettingsPage.tsx:455
- **Listado de claves API con metadatos** — Muestra cada clave con su nombre, ID (nunca el secreto), insignias 'Disabled' y 'Read-only', fecha de creación, caducidad (en rojo si ya caducó) y último uso.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ApiSettings.tsx:295-381
- **Habilitar/deshabilitar una clave API** — Interruptor por clave para suspenderla sin borrarla.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ApiSettings.tsx:98-105, 384-390
- **Eliminar una clave API** — Borra una clave tras confirmarlo con window.confirm.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ApiSettings.tsx:81-96, 391-399
- **Limpiar las claves API caducadas** — Botón 'Cleanup Expired Keys' que borra de una vez todas las claves caducadas.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ApiSettings.tsx:107-114, 276-292
- **Admin: habilitar métodos de acceso y MFA obligatorio** — En el panel de administración: interruptores globales para el login por email y contraseña, el login por passkey, OIDC global y 'Enforce MFA for all users', con la insignia 'Managed by Env' cuando el ajuste viene de variables de entorno.
  - Web (Parcial): SparkyFitnessFrontend/src/pages/Admin/AuthenticationSettings.tsx:135-207; src/pages/Admin/Admin.tsx:11; src/App.tsx:446-461 (PermissionRoute admin)
  - Nota: El interruptor de MFA obligatorio se guarda (SparkyFitnessServer/models/globalSettingsRepository.ts:110-127, 242-256), pero no encontré ningún punto del servidor que lo aplique (nunca devuelve needs_mfa_setup).
  - _Verificación: corregido por verificación_
- **Admin: gestión de proveedores OIDC** — Alta, edición, activación y borrado de proveedores OIDC: ID, nombre visible, activo, auto-registro, logo (archivo o URL), issuer, dominio, client ID/secret, scope, redirect URI, método de autenticación del token endpoint y 'Reset to defaults'.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/OidcSettings.tsx:81-286; src/pages/Admin/OidcProviderDialog.tsx:128-562; src/App.tsx:457 (admin/oidc-settings)
- **Admin: acciones de seguridad sobre usuarios** — Desde la gestión de usuarios: restablecer contraseña, restablecer MFA, activar o desactivar la cuenta, conceder o quitar el rol admin, ver el estado de TOTP y MFA por email y el último acceso.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:125-183 (reset de contraseña, rol, reset de MFA), 300-345 (columnas activo/MFA), 387-444; src/App.tsx:466 (admin/user-management)
- **Admin: eliminar usuarios, editar su nombre y buscar/ordenar** — En la gestión de usuarios del panel de administración: borrar un usuario (con confirmación), editar su nombre completo en línea (con confirmación) y buscar u ordenar la tabla por columna. Complementa las acciones de seguridad de auth-admin-user-security.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:60 (useUsers con búsqueda y orden), 71-109 (handleSaveFullName), 111-123 (handleDeleteUser con window.confirm), 445-453 (botón Delete); src/App.tsx:466
  - _Verificación: añadido durante la verificación_
- **Admin: documentación de la API pública sin autenticación** — Interruptor en los ajustes de autenticación del administrador para que la documentación Swagger (/api/api-docs) se pueda abrir sin iniciar sesión.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/AuthenticationSettings.tsx:211-232 ('Public API Documentation'); se aplica en el servidor en SparkyFitnessServer/SparkyFitnessServer.ts:694-700 (isPublicApiDocsAllowed o SPARKY_FITNESS_PUBLIC_API_DOCS).
  - _Verificación: añadido durante la verificación_
- **Admin: eliminar una cuenta de usuario** — Desde la gestión de usuarios, el administrador puede borrar la cuenta de otro usuario tras confirmarlo.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:111-123 (window.confirm 'Are you sure you want to delete this user?'), 446-454 (botón Delete); hooks/Admin/useUsers.ts:58.
  - Nota: La fila auth-admin-user-security no incluía esta acción.
  - _Verificación: añadido durante la verificación_

#### Solo en el móvil (16)

- **Configuración inicial de la URL del servidor (onboarding)** — Primer paso del arranque en el móvil: se introduce la 'Frontend URL' (con botón para pegar desde el portapapeles), se valida y normaliza, se piden los ajustes de autenticación (/api/auth/settings) y, si fallan, hay una comprobación de alcanzabilidad de respaldo. Si no hay ninguna configuración guar…
  - Móvil (Sí): SparkyFitnessMobile/src/screens/OnboardingScreen.tsx:174-241 (handleNext, fallback 60-78 y 216-237), 603-686 (input de URL + botón pegar); src/hooks/useAppBootstrap.ts:38-41 (ruta inicial Onboarding si no hay configuración activa); App.tsx:523
  - Nota: Si el host no responde por timeout se omite el fallback (#1767).
- **Omitir la conexión ('Más tarde')** — Botón 'Later' del onboarding para entrar en la app sin conectar ningún servidor. Lleva a la pestaña Ajustes, donde la fila Servidor muestra 'Toca para añadir un servidor'.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/OnboardingScreen.tsx:161-164 (finishOnboarding), 1051-1059 (botón Later); src/screens/SettingsScreen.tsx:145
- **Conectarse con una clave API como método de autenticación** — Pestaña 'API Key' para conectar la app pegando una clave generada en la web. Se valida contra /api/identity/user, tiene botón de pegar, se puede ocultar/mostrar en el modal de servidor y se guarda en almacenamiento seguro.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/OnboardingScreen.tsx:403-471 (handleConnectApiKey), 936-976; src/components/ServerConfigModal.tsx:620-705, 1061-1100 (mostrar/ocultar 1074-1095); src/services/storage.ts:40-48 (SecureStore apiKey_<id>, AFTER_FIRST_UNLOCK)
  - Nota: Las passkeys no están disponibles en configuraciones por clave API (PasskeySettingsScreen.tsx:326-340).
- **Volver/cancelar desde el desafío MFA** — Botón 'Back' para abandonar el paso MFA y volver a las credenciales; además borra las cookies de 2FA pendientes.
  - Móvil (Sí): SparkyFitnessMobile/src/components/MfaForm.tsx:229-237; src/screens/OnboardingScreen.tsx:580-586 (handleBackToAuth + clearAuthCookies), 1032-1040
- **Pasar a clave API desde la reautenticación** — Desde el modal de sesión caducada (y desde su paso MFA), 'Use API Key Instead' abre el modal del servidor en la pestaña API Key para cambiar el método de autenticación de esa configuración.
  - Móvil (Sí): SparkyFitnessMobile/src/components/ReauthModal.tsx:653-664, 680-683; src/components/MfaForm.tsx:239-248; src/hooks/useAuth.ts:125-137; App.tsx:1298-1316
- **Varios servidores/cuentas y cambio de servidor activo** — Ajustes > Servidor muestra el servidor activo y 'Other Servers'. Al tocar uno se puede activar ('Set Active', con comprobación de HTTPS en producción), configurar o borrar. Al cambiar de servidor se cambia de identidad y se limpian las cachés.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/ServerSettingsScreen.tsx:85-128 (handleSetActiveConfig), 258-332 (menú), 354-475; src/screens/SettingsScreen.tsx:215-230; App.tsx:1097
  - _Verificación: corregido por verificación_
- **Añadir servidor (modal de configuración)** — Modal 'Add Server' con URL, pestañas Sign In/SSO/Passkey y API Key, MFA y opciones avanzadas. También se abre solo cuando se borra la última configuración (motivo no_configs).
  - Móvil (Sí): SparkyFitnessMobile/src/screens/ServerSettingsScreen.tsx:193-197, 487-516; src/components/ServerConfigModal.tsx:1138-1143; src/hooks/useAuth.ts:46-49; App.tsx:1298-1316
- **Editar la configuración de un servidor existente** — 'Configure' abre el modal 'Edit Server' para cambiar la URL, volver a entrar, pasar de sesión a clave API o editar las cabeceras de proxy. 'Save' guarda sin reautenticar.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/ServerSettingsScreen.tsx:187-191; src/components/ServerConfigModal.tsx:156-170, 708-773 (handleSaveWithoutAuth), 1302-1312
- **Eliminar la configuración de un servidor** — Borra un servidor guardado y sus credenciales locales. Si era el activo, activa el siguiente, limpia la identidad (cachés y la copia de credenciales de Siri/atajos) y, si no queda ninguno, abre el modal de configuración.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/ServerSettingsScreen.tsx:130-185; src/services/storage.ts (deleteServerConfig); src/hooks/useAuth.ts:46-52
- **Probar la conexión y estado del servidor** — Botón 'Test Connection' con toast de resultado, punto verde o rojo junto a la URL activa y subtítulo de estado en la fila Servidor de Ajustes.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/ServerSettingsScreen.tsx:241-256, 380-383, 405-423; src/screens/SettingsScreen.tsx:215-230
- **Abrir el panel web desde la app** — Botón 'Open Web' que abre la URL del servidor activo en el navegador integrado (o en el externo si falla). Es la vía para llegar a lo que solo hay en la web (MFA, contraseña, claves API), aunque hay que volver a iniciar sesión allí.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/ServerSettingsScreen.tsx:199-239, 393-404
- **Cabeceras de proxy personalizadas (autenticación de proxy inverso)** — En 'Advanced options' del modal de servidor se añaden pares nombre/valor (con valor ocultable) que se envían antes de las cabeceras de autenticación en todas las peticiones, por ejemplo para tokens de Cloudflare Access. Avisa si se usan cabeceras reservadas (Authorization, Content-Type) y se guarda…
  - Móvil (Sí): SparkyFitnessMobile/src/components/ServerConfigModal.tsx:254-275, 777-806 (aviso de cabecera reservada), 1163-1285; src/services/storage.ts:44, 117-123; src/services/api/apiClient.ts:65; authService.ts:119-127 (cabeceras pendientes durante el login)
  - Nota: No están en el onboarding (OnboardingScreen.tsx:247-258 guarda proxyHeaders: []). Con un servidor detrás de un proxy que las exige, hay que pulsar 'Later' y añadir el servidor desde Ajustes.
- **Exigencia de HTTPS para conectar con el servidor** — En producción el móvil rechaza URLs http:// al hacer onboarding, login, activar un servidor y en las peticiones directas. En desarrollo se permite HTTP solo para hosts privados o LAN.
  - Móvil (Sí): SparkyFitnessMobile/src/utils/serverUrl.ts (isPrivateOrLocalHost, getInsecureUrlError); src/screens/OnboardingScreen.tsx:185-194; src/screens/ServerSettingsScreen.tsx:86-99; src/services/api/authService.ts:342-344, 645-647, 772-774
- **Servidores en LAN y certificados autofirmados** · _Difiere iOS/Android_ — Cómo se conecta la app a un servidor autoalojado en la red local o con certificado propio.
  - Móvil (Sí): SparkyFitnessMobile/plugins/withNetworkSecurityConfig.ts (Android: cleartextTrafficPermitted=false y confianza en CAs de sistema y de usuario); app.config.ts:134 (solo en producción), 171-188 (iOS: NSLocalNetworkUsageDescription y NSAppTransportSecurity con NSAllowsArbitraryLoads false)
  - iOS/Android: Android (producción) confía en los certificados CA instalados por el usuario, así que un certificado autofirmado funciona tras instalar su CA. iOS pide el permiso de 'Red local' y solo confía en la cadena del sistema (un certificado propio necesita instalar y marcar como de confianza un perfil).
- **Reenviar el código MFA por email** — En el desafío MFA por email, botón 'Resend Code' para pedir un código nuevo después del primer envío. En la web, una vez enviado el código, el botón 'Send Code' queda deshabilitado y no se puede reenviar sin recargar la página (que además pierde el paso MFA).
  - Móvil (Sí): SparkyFitnessMobile/src/components/MfaForm.tsx:216-227 (botón 'auth.resendCode' cuando emailOtpSent); usado en OnboardingScreen.tsx:1012-1016, ServerConfigModal.tsx:1324-1328 y ReauthModal.tsx:674-678
  - _Verificación: añadido durante la verificación_
- **Aviso de servidor sin métodos de acceso estándar** — Si el servidor tiene desactivado el login por email y no tiene proveedores OIDC, el móvil muestra 'No standard sign-in methods are currently enabled on this server. Please use an API Key or contact an administrator.' En la web, en ese caso solo se pintan los botones de passkey/OIDC que existan; si …
  - Móvil (Sí): SparkyFitnessMobile/src/screens/OnboardingScreen.tsx:919-931 (auth.noMethods); src/components/ServerConfigModal.tsx:1047-1056 (auth.noStandardMethods)
  - _Verificación: añadido durante la verificación_

#### En ambos, con diferencias (3)

- **Cerrar sesión** — Botón 'Sign Out' en la cabecera de la web: cierra la sesión en el servidor, limpia la caché y vuelve a /login. El móvil no tiene un botón equivalente; lo único parecido es eliminar la configuración del servidor, que borra las credenciales locales pero no revoca la sesión en el servidor.
  - Web (Sí): SparkyFitnessFrontend/src/layouts/MainLayout.tsx:95-113, 531-540; src/hooks/useAuth.tsx:272-286 (authClient.signOut)
  - Móvil (Parcial): No aparece signOut/logout en SparkyFitnessMobile/src. Solo ServerSettingsScreen.tsx:130-185 (handleDeleteConfig → deleteServerConfig), sin llamada al servidor.
  - Nota: El token de sesión eliminado en el móvil sigue siendo válido en el servidor hasta que caduque.
- **Reautenticación al caducar la sesión** — En el móvil, un 401 en una configuración por sesión abre un modal 'Sesión caducada' que permite volver a entrar con email/contraseña, OIDC o passkey (incluido el MFA) sin perder la navegación. En la web, al perderse la sesión se comprueba con /ping y se redirige a /login; si una pasarela (por ejemp…
  - Web (Parcial): SparkyFitnessFrontend/src/hooks/useAuth.tsx:213-262 (probe /ping y limpieza); src/App.tsx:114-127 (PrivateRoute → /login); src/api/api.ts:54-101, 212-217 (recarga por pasarela). No hay modal de reautenticación en el sitio.
  - Móvil (Sí): SparkyFitnessMobile/src/services/api/apiClient.ts:81-82 (401 → notifySessionExpired); src/hooks/useAuth.ts:34-45; App.tsx:1288-1296; src/components/ReauthModal.tsx:46-190, 505-515 (título sessionExpiredTitle)
- **Mostrar/ocultar la contraseña en los formularios de acceso** — Botón de ojo para ver la contraseña mientras se escribe. En la web está en el login, en el registro y en el restablecimiento. En el móvil solo existe en el modal de servidor (Add/Edit Server), no en el onboarding ni en el modal de sesión caducada.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Auth/Auth.tsx:53, 563, 579-581 (login), 719, 739-741 (registro); src/pages/Auth/ResetPassword.tsx:17, 34
  - Móvil (Parcial): Sí en SparkyFitnessMobile/src/components/ServerConfigModal.tsx:106, 954-973 (auth.showPassword/hidePassword). No en OnboardingScreen.tsx:819-826 ni en ReauthModal.tsx:566-574 (solo secureTextEntry). El campo de clave API del onboarding (OnboardingScreen.tsx:961) tampoco tiene botón de mostrar, al contrario que el del modal (ServerConfigModal.tsx:1074).
  - _Verificación: añadido durante la verificación_

#### En ambos clientes, pero con diferencias iOS/Android (2)

- **Inicio de sesión con passkey** · _Difiere iOS/Android_ — Botón 'Sign in with Passkey'. En la web usa WebAuthn nativo del navegador (exige contexto seguro HTTPS/localhost). En el móvil abre una página puente del servidor (/api/auth/web-login/passkey) en el navegador y recibe el token en el fragmento de la URL. En ambos casos se oculta si el servidor desac…
  - Web (Sí): SparkyFitnessFrontend/src/pages/Auth/Auth.tsx:401-442 (handlePasskeySignIn y comprobación isSecureContext 403-413), 612-622, 764-774
  - Móvil (Sí): SparkyFitnessMobile/src/screens/OnboardingScreen.tsx:367-401, 885-916; src/components/ServerConfigModal.tsx:468; src/components/ReauthModal.tsx:285, 620-635; src/services/api/authService.ts:766-843 (loginWithPasskey)
  - iOS/Android: Android: getPasskeyBrowserPackage (authService.ts:705-760) abre la ceremonia en un navegador de una lista permitida (Chrome, Firefox, Samsung Internet, Edge) cuando el predeterminado puede no soportar passkeys (por ejemplo, Fennec de F-Droid). iOS: siempre la sesión de navegador del sistema (devuelve undefined).
- **Registrar una nueva passkey** · _Difiere iOS/Android_ — Registra una credencial WebAuthn para la cuenta. En la web el nombre es opcional y se usa WebAuthn del navegador. En el móvil el nombre es obligatorio y no puede repetirse; se pide un ticket de un solo uso y se abre la página de registro del servidor en el navegador. Si la sesión no es reciente (SE…
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/PasskeySettings.tsx:36-42, 64-93 (botón oculto si el servidor desactiva passkeys); src/hooks/Settings/usePasskeys.ts:24-43
  - Móvil (Sí): SparkyFitnessMobile/src/screens/PasskeySettingsScreen.tsx:170-232 (validación de nombre y SESSION_NOT_FRESH en 210-216), 418-443, 466-515 (modal de nombre), 519-526 (ReauthModal); src/services/api/authService.ts:888-975 (register-ticket + register-passkey)
  - iOS/Android: Android elige un navegador con soporte de passkeys de la lista permitida (authService.ts:705-760); iOS usa el navegador del sistema. Los textos también cambian: 'Face ID, Touch ID o PIN' y 'My iPhone' en iOS frente a 'huella, desbloqueo facial o PIN' y 'My Android Phone' en Android (PasskeySettingsScreen.tsx:46-59).
  - Nota: La web no tiene un flujo de reautenticación para sesiones antiguas; un fallo solo muestra un toast genérico (usePasskeys.ts:37-41).

<details><summary>En paridad web ↔ móvil (11)</summary>

- Inicio de sesión con email y contraseña
- Inicio de sesión OIDC / SSO por proveedor
- Adaptación a los métodos de acceso habilitados en el servidor
- Desafío MFA con app autenticadora (TOTP) al iniciar sesión
- Desafío MFA por código enviado al email
- Ver las passkeys registradas
- Eliminar una passkey
- Limpieza de datos locales al cerrar sesión o cambiar de cuenta
  - **Actualizado en las PR #2989 y #3020 (fusionadas):** En Android, un cambio de cuenta vacía ahora también los widgets de calorías, macros y agua y la baldosa Calorías restantes de Ajustes rápidos. iOS no borra entonces sus widgets: siguen mostrando las cifras de la cuenta anterior hasta que la app vuelve a escribirlas. El resto (caché de consultas, almacén de cookies, cachés de imágenes, copia de la sesión para atajos y cesta de alimentos) se borra igual en las dos plataformas.
- Listar y eliminar passkeys registradas
- Listado de passkeys registradas
- Eliminar una passkey

</details>

<details><summary>Descartado tras verificación: no existe en ninguno (5)</summary>

- Aviso del servidor en la pantalla de login — SparkyFitnessFrontend/src/pages/Auth/Auth.tsx:483-490
- Aviso de configuración MFA obligatoria en el login — SparkyFitnessFrontend/src/pages/Auth/MfaChallenge.tsx:222-230, 245-258; Auth.tsx:248-252. El servidor nunca emite needs_mfa_setup (no aparece en SparkyFitnessServer), así que es una rama muerta y no …
- Eliminación de la propia cuenta — No hay opción de autoborrado en SettingsPage.tsx ni en AccountSecurity.tsx; solo el admin puede borrar en UserManagement.tsx:111-122, 449-451 (useDeleteUser).
- Gestión de sesiones activas (ver o revocar dispositivos) — No se usan listSessions/revokeSession; lo único es la revocación implícita de otras sesiones al cambiar la contraseña (AccountSecurity.tsx:95).
- Bloqueo o desbloqueo biométrico de la app — No existe.

</details>

### 2.2 Administración y recursos de desarrollador

#### Solo en la web (61)

- **Acceso al panel de administración** — Pestaña/ruta 'Admin' (/admin) visible solo para usuarios con rol admin y oculta cuando se actúa en nombre de otro usuario (acceso familiar). Agrupa autenticación, OIDC, IA global, proveedores globales, copias de seguridad y gestión de usuarios.
  - Web (Sí): SparkyFitnessFrontend/src/layouts/MainLayout.tsx:303-304 (tab escritorio) y :375-376 (tab navegación móvil web); SparkyFitnessFrontend/src/App.tsx:443-453 (PermissionRoute permission="admin" -> AdminPage); SparkyFitnessFrontend/src/pages/Admin/Admin.tsx:8-19
  - Nota: Toda la administración de la instancia es exclusiva de la web.
- **Rutas independientes de subsecciones admin** — Rutas directas /admin/oidc-settings y /admin/user-management protegidas por permiso admin.
  - Web (Parcial): SparkyFitnessFrontend/src/App.tsx:455-472. Ningún enlace de la UI apunta a ellas (solo se llega escribiendo la URL); además /admin/oidc-settings renderiza AuthenticationSettings y no OidcSettings.
  - Nota: Posible incoherencia: la ruta 'oidc-settings' muestra la gestión de login, no la de proveedores OIDC.
- **Activar/desactivar inicio de sesión con email y contraseña** — Interruptor global (Login Management) para habilitar o deshabilitar el método email+contraseña; se bloquea con insignia 'Managed by Env' si lo fija una variable de entorno.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/AuthenticationSettings.tsx:118-141 (Switch id enable_email_password_login :136, badge env :127-134)
- **Activar/desactivar inicio de sesión con passkey (global)** — Interruptor global para permitir o no el login con passkeys; respeta la configuración por entorno (badge 'Managed by Env').
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/AuthenticationSettings.tsx:142-167 (Switch id enable_passkey_login :162)
- **Activar/desactivar login OIDC (global)** — Interruptor maestro para habilitar el inicio de sesión OIDC en toda la instancia; bloqueable por variable de entorno.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/AuthenticationSettings.tsx:168-192 (Switch id is_oidc_active :188)
- **Forzar MFA para todos los usuarios** — Interruptor 'Enforce MFA for all users' que hace obligatoria la autenticación multifactor.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/AuthenticationSettings.tsx:196-209 (Switch id is_mfa_mandatory :204); servidor SparkyFitnessServer/routes/adminAuthRoutes.ts:44,92
- **Documentación de API pública (Swagger sin autenticación)** — Interruptor que permite acceder a /api/api-docs sin iniciar sesión.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/AuthenticationSettings.tsx:210-232 (Switch id public_api_docs :227)
- **Herramientas de diagnóstico para desarrolladores (MCP)** — Interruptor 'Developer Diagnostic Tools' que habilita para admins las herramientas MCP de inspección de base de datos expuestas por el endpoint /mcp del servidor.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/AuthenticationSettings.tsx:233-256 (Switch id dev_tools_enabled :250); efecto en SparkyFitnessServer/routes/mcpRoutes.ts:187-192
  - Nota: Ningún cliente ofrece UI para conectar un cliente MCP; el endpoint se usa desde herramientas externas.
- **Instrucciones de emergencia para recuperar el login** — Bloque informativo con las variables SPARKY_FITNESS_FORCE_EMAIL_LOGIN=true y SPARKY_FITNESS_FORCE_PASSKEY_LOGIN=true y botón para copiarlas al portapapeles.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/AuthenticationSettings.tsx:258-277 y componente CopyableEnvVar :18-43
- **Listado de proveedores OIDC** — Tabla con logo, nombre visible, insignia 'Managed by Env', estado activo y auto-registro de cada proveedor OIDC configurado.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/OidcSettings.tsx:231-355 (tabla :269-355, badge env :306-317)
- **Añadir proveedor OIDC** — Botón 'Add New Provider' que abre el diálogo de alta con valores por defecto (activo, sin auto-registro).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/OidcSettings.tsx:265-268, :56-73 (plantilla por defecto), :137-172 (creación + subida de logo posterior)
- **Editar y eliminar proveedores OIDC** — Acciones por fila para editar un proveedor y eliminarlo con confirmación; los proveedores definidos por entorno no se pueden eliminar y su diálogo es de solo lectura.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/OidcSettings.tsx:336-352 (Edit/Trash, delete oculto si is_env_configured), :80-101 (handleDelete con confirm); OidcProviderDialog.tsx:131-136 (badge env) y campos readOnly={editedProvider.is_env_configured}
- **Interruptores rápidos Activo / Auto-registro por proveedor** — Cambiar desde la tabla si un proveedor OIDC está activo y si registra automáticamente usuarios nuevos.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/OidcSettings.tsx:321-334 y handleToggleChange :186-215
- **Configuración básica del proveedor OIDC** — Campos Provider ID (slug), nombre visible, Issuer URL, dominio de organización, Client ID, Client Secret y Scope, más interruptores Activo/Auto Register dentro del diálogo.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/OidcProviderDialog.tsx:157-310 (provider_id :161, display_name :175-183, is_active/auto_register :187-208, issuer_url :242, domain :253, client_id :271, client_secret :283, scope :306)
- **Logo del proveedor OIDC (archivo o URL)** — Subir un archivo de logo o indicar una URL de logo que se muestra en la pantalla de login.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/OidcProviderDialog.tsx:212-235 (logo_file :216, logo_url :227); OidcSettings.tsx:107-170 (subida vía /admin/oidc-settings/:id/logo, oidcSettingsService.ts:41)
  - _Verificación: corregido por verificación_
- **Redirect URI con modo experto de dominio personalizado** — Muestra la Redirect URI calculada a partir del origen actual, permite activar 'Expert Mode: Custom Domain' para sobrescribir la URL base (con validación http/https) y copiar la URI completa.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/OidcProviderDialog.tsx:312-410 (switch manual_redirect :319, copia :365-392, validación :395-404)
- **Opciones avanzadas OIDC** — Método de autenticación del token endpoint (client_secret_post / client_secret_basic / none), algoritmo de firma de ID token, algoritmo de firma de userinfo y timeout de petición (ms).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/OidcProviderDialog.tsx:421-451 (token_endpoint_auth_method), :454-480 (signing_algorithm :461, profile_signing_algorithm :475), :482-495 (timeout :489)
- **Ayuda de configuración de proxy inverso para OIDC** — Avisos sobre localhost y bloque con cabeceras Nginx (Host, X-Forwarded-*) copiable al portapapeles.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/OidcProviderDialog.tsx:497-547 (pre id proxy-config-code :512, botón copiar)
- **Restablecer valores por defecto del proveedor OIDC** — Botón 'Reset to Defaults' en el diálogo que repone los valores predeterminados.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/OidcProviderDialog.tsx:552-556 y toast defaultsRestored :79
- **Permitir que los usuarios configuren sus propios servicios de IA** — Interruptor global allow_user_ai_config; si está desactivado los usuarios solo pueden usar los servicios de IA globales.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/GlobalAISettings.tsx:309-326 (Switch id allow_user_ai_config :322)
- **Permitir endpoints de IA en red privada/LAN** — Interruptor que deja a usuarios no admin conectar servicios de IA (p. ej. Ollama) a IPs privadas.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/GlobalAISettings.tsx:329-358 (Switch id allow_private_network_ai :351)
- **Servicio de IA de visión global por defecto** — Selector del servicio global al que se enrutan las tareas de visión (fotos de comida) de usuarios sin servicio personal; opción 'None' para caer al servicio de texto global.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/GlobalAISettings.tsx:363-402 (Select id global-vision-ai-service-select :381)
- **Añadir servicio de IA global** — Formulario para crear un servicio de IA compartido por toda la instancia: tipo, nombre, API key, URL personalizada, modelo (o nombre personalizado), conjunto de herramientas del chat (Full/Core) y prueba de conexión antes de guardar.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/GlobalAISettings.tsx:405-445 (ServiceForm :423 con onTestConnection); SparkyFitnessFrontend/src/components/ai/ServiceForm.tsx:198 (chat_tool_profile)
- **Editar, probar y eliminar servicios de IA globales** — Lista de servicios globales con insignia 'Global', edición en línea (incl. activo/inactivo), prueba de conexión y borrado con diálogo de confirmación.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/GlobalAISettings.tsx:449-475 (ServiceList), :488-513 (AlertDialog de borrado); SparkyFitnessFrontend/src/components/ai/ServiceListItem.tsx:58-61, :96, :112
- **Permitir proveedores de recetas en red privada/LAN** — Interruptor para que usuarios no admin conecten proveedores de recetas (Mealie, Tandoor) a IPs privadas.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/GlobalProviderSettings.tsx:54-85 (Switch id allow_private_network_food_providers :74)
- **Permitir captura local de respuestas de proveedores** — Interruptor mock_data_enabled que añade al diálogo de sincronización opciones de captura/reproducción de respuestas crudas para depurar.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/GlobalProviderSettings.tsx:87-115 (Switch id mock_data_enabled)
- **Modos de sincronización de diagnóstico (live / capturar / reproducir)** — Con la captura activada, el diálogo de rango de sincronización de un proveedor muestra la sección 'Troubleshooting' para sincronizar normal, guardar las respuestas crudas en un archivo del servidor o reproducir ese archivo.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/SyncRangeDialog.tsx:54-56 (useMockDataEnabled), :308-360 (radios live/capture/replay)
- **Permitir contribuciones a Open Food Facts en el servidor** — Tarjeta 'Open Food Facts contributions' con el interruptor de servidor allow_openfoodfacts_contributions que habilita las contribuciones manuales de los usuarios (credenciales globales como respaldo).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/OpenFoodFactsAdminContributionSettings.tsx:8-64; renderizado en SparkyFitnessFrontend/src/pages/Admin/GlobalProviderSettings.tsx:119
- **Añadir proveedor de datos global (alimentos/ejercicios)** — Formulario para crear proveedores globales (p. ej. USDA) con claves del sistema usadas automáticamente por todos; excluye proveedores estrictamente privados/OAuth (Garmin, Strava).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/GlobalProviderSettings.tsx:121-126; SparkyFitnessFrontend/src/pages/Settings/AddExternalProviderForm.tsx:197 (rama isAdminMode), :377 (filtra is_strictly_private)
- **Editar, activar/desactivar y eliminar proveedores globales** — Lista 'Configured Global Providers' con edición (nombre, tipo, app id/key, base URL), interruptor activo y borrado con aviso de que todos los usuarios perderán el acceso.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/GlobalProviderSettings.tsx:128-140; SparkyFitnessFrontend/src/pages/Settings/ExternalProviderList.tsx:307-320, :449-478; SparkyFitnessFrontend/src/pages/Settings/ProviderCard.tsx:343-346, :384-393, :668-671
- **Importación masiva del Canadian Nutrient File (CNF)** — Botón de importación/resincronización masiva en el proveedor global CNF con diálogo de alcance, idioma, origen (archivo), limpieza de biblioteca y estado en curso.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ProviderCard.tsx:146 (enabled solo isAdminMode), :535-570, :1054; SparkyFitnessFrontend/src/pages/Settings/CnfBulkImportDialog.tsx:193-447
- **Importación masiva de Livsmedelsverket (base sueca)** — Botón de importación/resincronización masiva en el proveedor global Livsmedelsverket con selección de idioma y modo de sincronización.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ProviderCard.tsx:148-152, :572-610; SparkyFitnessFrontend/src/pages/Settings/LivsmedelsverketBulkImportDialog.tsx:149-306
- **Activar copias de seguridad programadas** — Interruptor 'Enable Scheduled Backups' en la configuración de backups.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/BackupSettingsForm.tsx:128-136; contenedor SparkyFitnessFrontend/src/pages/Admin/BackupSettings.tsx:51-92
- **Días y hora de la copia programada** — Casillas por día de la semana y selector de hora (mostrando la zona horaria local) para la copia programada.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/BackupSettingsForm.tsx:139-180 (type="time" :174)
- **Retención de copias (días)** — Campo 'Keep backups for (days)' para purgar copias antiguas.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/BackupSettingsForm.tsx:182-196
- **Ubicación y estado de la última copia** — Muestra la ruta de almacenamiento (/app/SparkyFitnessServer/backup) y el estado/fecha del último backup.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/BackupSettingsForm.tsx:199-215; BackupSettings.tsx:79
- **Guardar configuración de copias** — Botón 'Save Settings' que persiste programación y retención.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/BackupSettingsForm.tsx:219-230; servidor SparkyFitnessServer/routes/backupRoutes.ts:328
- **Ejecutar copia manual inmediata** — Botón 'Run Manual Backup Now'.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/BackupSettingsForm.tsx:231-242; servidor SparkyFitnessServer/routes/backupRoutes.ts:102
- **Listado y descarga de copias de seguridad** — Botón 'Download Backup' que abre el diálogo 'Available Backups' con fecha de inicio, tamaño y descarga de cada archivo.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/BackupSettingsForm.tsx:243-254; SparkyFitnessFrontend/src/pages/Admin/BackupListDialog.tsx:82-215; servidor backupRoutes.ts:410,460
- **Restaurar copia de seguridad** — Subida de un archivo .tar.gz con avisos (estrategia 3-2-1, borrado total de datos), confirmación y cierre de sesión automático tras restaurar.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/BackupSettingsForm.tsx:252-293 (accept=".tar.gz" :286); SparkyFitnessFrontend/src/pages/Admin/BackupSettings.tsx:32-50 (confirm + signOut)
- **Listado de usuarios con búsqueda y ordenación** — Tabla de usuarios con búsqueda por nombre/email (multi-término, con debounce) y ordenación por nombre, email, admin, activo, creación, último login, TOTP y MFA por email.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:258-345 (búsqueda :264-273, SortableHead :286-344), :197-234 (procesado)
- **Editar nombre completo de un usuario** — Edición en línea del nombre (clic en la celda) con confirmación.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:355-380, :71-109
- **Conceder/retirar rol de administrador** — Interruptor por usuario para cambiar entre rol user y admin, con confirmación.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:386-394, :158-176
- **Activar/desactivar cuenta de usuario** — Interruptor para desactivar o reactivar una cuenta, con confirmación.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:397-406, :138-156
- **Ver fecha de alta, último login y estado MFA** — Columnas de fecha de creación, último inicio de sesión y estado TOTP / MFA por email (solo lectura).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:407-424 (Switch disabled :420)
- **Restablecer contraseña de un usuario** — Acción que envía al usuario un email de restablecimiento de contraseña (vía Better Auth).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:425-433, :124-136; servidor SparkyFitnessServer/routes/adminRoutes.ts:458-480
- **Restablecer MFA de un usuario** — Acción para borrar la configuración MFA de un usuario bloqueado.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:435-443, :178-187; servidor adminRoutes.ts:511
- **Eliminar usuario** — Borrado de una cuenta con confirmación.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/UserManagement.tsx:446-453, :111-122; servidor adminRoutes.ts:129
  - Nota: Ningún cliente permite crear usuarios desde el panel admin.
- **Recursos de desarrollador: documentación de la API** — Sección 'Developer Resources' en Ajustes > Developer & Integrations con enlaces a Swagger UI (interactivo) y Redoc (solo lectura).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/DevloperResources.tsx:10-73 (/api/api-docs/swagger, /api/api-docs/redoc); montado en SparkyFitnessFrontend/src/pages/Settings/SettingsPage.tsx:456
- **Generar claves API** — Crear una clave API con descripción, caducidad (nunca, 7/30/90 días, 1 año) y nivel de acceso (completo o solo lectura); la clave se muestra una sola vez con botón de copiar.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ApiSettings.tsx:146-190 (clave nueva + copiar), :193-273 (descripción, Expires In, Access, Generate)
- **Listar y revocar claves API** — Lista de claves con descripción, estado (deshabilitada, solo lectura), fecha de creación, caducidad (resaltada si expiró), último uso y botón de eliminar.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ApiSettings.tsx:295-400
- **Limpiar claves API caducadas** — Botón para eliminar en bloque las claves expiradas.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ApiSettings.tsx:277-291 (handleCleanupExpiredKeys)
- **Nivel mínimo de registro (logging)** — Preferencia que controla la verbosidad de los logs del cliente (debug/info/warn/error).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:516-530 ('Minimum Logging Level')
- **Versión de la aplicación/servidor en 'Acerca de'** — La web muestra la versión de SparkyFitness informada por el servidor (/version/current) en el pie y en el diálogo.
  - Web (Sí): SparkyFitnessFrontend/src/api/general.ts:6-10; App.tsx:156, :237; AboutDialog.tsx:72-79; MainLayout.tsx:85, :673-675
- **Tecnologías y APIs externas utilizadas** — Lista de tecnologías de frontend/backend y APIs externas (Wger, Nutritionix, FatSecret, Open Food Facts, USDA, base suiza, CNF).
  - Web (Sí): SparkyFitnessFrontend/src/components/AboutDialog.tsx:116-170
- **Enlace a la comunidad de Discord** — Enlace a discord.gg/vcnMT5cPEA.
  - Web (Sí): SparkyFitnessFrontend/src/components/AboutDialog.tsx:80-97
- **Enlace para colaborar en traducciones (Weblate)** — Píldora 'Translate' que abre weblate.sparkyfitness.com.
  - Web (Sí): SparkyFitnessFrontend/src/layouts/MainLayout.tsx:497-501 y :661-665
- **Contador de estrellas de GitHub** — Insignia con el número de estrellas del repositorio (API de GitHub) que enlaza al repo.
  - Web (Sí): SparkyFitnessFrontend/src/components/GitHubStarCounter.tsx:12-48; usado en MainLayout.tsx:488 (escritorio) y :652 (pie móvil web); src/api/general.ts:14-31
- **Aviso automático de nueva versión (GitHub)** — Al iniciar sesión se consulta la última release de GitHub (/version/latest-github) y, si hay versión nueva no descartada, se abre el diálogo de nueva versión con opción 'No mostrar de nuevo para esta versión'.
  - **Actualizado en la PR #3149 (fusionada):** Los administradores ya pueden desactivar la comprobación de versiones con un interruptor en los ajustes de administración de la web (activado por defecto); cuando está desactivado, el servidor no consulta GitHub y el aviso de nueva versión nunca se abre. El móvil sigue sin aviso de nueva versión.
  - Web (Sí): SparkyFitnessFrontend/src/components/AppSetup.tsx:36-62; App.tsx:165-168 (dismissedReleaseVersion en localStorage), :251-261; src/api/general.ts:36-40
- **'What's New' con notas de la release de GitHub** — Enlace 'What's New' del pie que refresca y muestra la última release: notas en Markdown con enlaces a PRs, commits y @usuarios, fecha de publicación y enlace 'View on GitHub'.
  - Web (Sí): SparkyFitnessFrontend/src/layouts/MainLayout.tsx:679-684, :700-705; App.tsx:160-163 (invalida caché y abre); src/components/NewReleaseDialog.tsx:35-60 (formatGithubReleaseNotes), :436-450 (View on GitHub)
- **Confirmación obligatoria de cambios incompatibles (BREAKING)** — Si las notas contienen 'breaking change', el diálogo exige desplazarse hasta el final, marcar una casilla de reconocimiento y escribir 'BREAKING' antes de poder cerrarlo; indica contactar al administrador.
  - Web (Sí): SparkyFitnessFrontend/src/components/NewReleaseDialog.tsx:72-100 (hasBreakingChange, canClose, scroll), :370-432 (checkbox, texto admin, input BREAKING), :451-462 (botón deshabilitado)

#### Solo en el móvil (12)

- **Conectar el cliente al servidor usando una clave API** — Pestaña 'API Key' en la configuración de servidor para autenticarse con una clave en lugar de usuario/contraseña.
  - Móvil (Sí): SparkyFitnessMobile/src/components/ServerConfigModal.tsx:62 (AuthTab 'apiKey'), :688, :739-741, :854, :1061
  - Nota: La clave se genera en la web (admin-dev-api-key-generate) y se consume en móvil.
- **Visor de registros (logs) de la app** — Pantalla 'View Logs' con filtros por estado (error, aviso, info, debug) persistidos, copia de una entrada al portapapeles y borrado de todos los logs.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/LogScreen.tsx:223-345 (filtros), :230-265 (Clear), :272-290 (copiar); acceso en src/screens/SettingsScreen.tsx:389-394; ruta App.tsx:954-958
- **Compartir informe de diagnóstico** — Genera un informe local (versión de app, estado de conexión/sincronización, preferencias, estado de las queries, logs) sin datos personales y lo comparte con la hoja de compartir del sistema.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/SettingsScreen.tsx:148-180 (handleShareDiagnosticReport), :403-420; src/services/diagnosticReportService.ts:197-210 (File en Paths.cache + Sharing.shareAsync)
- **Versión y número de compilación de la app nativa** — Muestra 'Version X (build Y)' de la app instalada.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/AboutScreen.tsx:64-71 (expo-application nativeApplicationVersion / nativeBuildVersion)
- **Enlace a la política de privacidad** — Abre la política de privacidad publicada en la documentación.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/AboutScreen.tsx:23-24, :129-147
  - Nota: SettingsScreen.tsx:57 y :431-434 montan un PrivacyPolicyModal que nunca se abre (setShowPrivacyModal(true) no se llama): código muerto.
- **Pantalla 'Novedades' con tarjetas de funcionalidades** · _Difiere iOS/Android_ — Pantalla con tarjetas ilustradas (medicamentos, ciclo y embarazo, entrenamientos, Liquid Glass, chat con Sparky, widget de pantalla de inicio, escaneo de fotos con IA) y botones que llevan a cada función.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/WhatsNewScreen.tsx:559-690 (features con CTA a MedicationsList, AppSettings, Chat, FoodScan); fila en src/screens/SettingsScreen.tsx:381-388; ruta App.tsx:1121-1125
  - iOS/Android: La tarjeta 'A Liquid Glass look' solo aparece en iOS 26+ con APIs de cristal (WhatsNewScreen.tsx:567-568, :615-637; canUseLiquidGlass en src/utils/liquidGlass.ts:9-10 devuelve false fuera de iOS). Android y iOS antiguos ven una tarjeta menos.
- **Banner de novedades en la barra de pestañas** · _Difiere iOS/Android_ — Banner descartable 'What's new' sobre la barra de pestañas que abre la pantalla de novedades; aparece cuando cambia WHATS_NEW_CONTENT_VERSION, no a instalaciones nuevas y se oculta durante un entrenamiento activo.
  - Móvil (Sí): SparkyFitnessMobile/src/components/WhatsNewBanner.tsx:38-89 (estado/elegibilidad), :94-200 (presentaciones legacy/glass); src/components/TabsLayout.tsx:104-127, :256-259, :365; src/services/whatsNewBanner.ts:7, :39-42
  - iOS/Android: En iOS con pestañas nativas (Liquid Glass) se muestra con presentación 'glass' superpuesta en cada escena (NativeTabsBannerOverlay); en Android y en iOS sin pestañas nativas se renderiza en estilo 'legacy' dentro de la barra personalizada.
- **Informe anonimizado de datos de salud (Health Data Report)** · _Solo Android_ — Botón 'Health Data Report' en la pantalla de sincronización de salud que lee las últimas 4 horas de Health Connect, redondea los valores por privacidad y genera un informe para adjuntar a reportes de errores mediante la hoja de compartir.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/SyncScreen.tsx:100 (import shareHealthDiagnosticReport), :706-722 (handleShareHealthReport), :1011-1050 (bloque 'Health Data Report — Android only' con isAndroid); src/services/healthDiagnosticService.ts:66, :364 (redondeo por privacidad).
  - iOS/Android: Condicionado a isAndroid = Platform.OS==='android' (SyncScreen.tsx:190, :1012); en iOS no existe un informe equivalente basado en HealthKit.
  - Nota: Complementa 'Compartir informe de diagnóstico' (Ajustes), que sí está en ambas plataformas pero no incluye datos de salud.
  - _Verificación: añadido durante la verificación_
- **Cambiar a clave API desde el modal de sesión caducada** — Cuando la sesión caduca, el modal de reautenticación (y su paso de MFA) ofrece 'Use API Key Instead', que abre la configuración del servidor directamente en la pestaña 'API Key' para seguir conectado con una clave.
  - Móvil (Sí): SparkyFitnessMobile/src/components/ReauthModal.tsx:469-472 (handleSwitchToApiKey), :654-663 (botón 'Use API Key Instead'), :680-682 (onUseApiKey en MfaForm); App.tsx:1299-1312 (ServerConfigModal con defaultAuthTab='apiKey'); src/hooks/useAuth.ts:143.
  - _Verificación: añadido durante la verificación_
- **Abrir el panel web desde la app móvil** — Botón 'Open Web' en Ajustes > Servidor que abre la URL del servidor activo en un navegador integrado (con Linking como respaldo). Es la única vía para que un admin llegue al panel de administración desde el móvil, aunque fuera de la UI nativa.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/ServerSettingsScreen.tsx:199-238 (openWebDashboard: WebBrowser.openBrowserAsync, fallback Linking.openURL), :395-404 (botón 'Open Web'); fila Server en SettingsScreen.tsx:215-217.
  - Nota: Relevante para admin-panel-access: el móvil no tiene UI admin, pero puede abrir la web.
  - _Verificación: añadido durante la verificación_
- **Probar conexión con el servidor** — Botón 'Test Connection' que vuelve a comprobar la conexión con el servidor activo y muestra un toast 'Connected' o 'Connection failed'; la tarjeta del servidor activo muestra también el estado de conexión.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/ServerSettingsScreen.tsx:241-256 (handleTestConnection con refetchConnection), :365-375 (estado Connected/Connection failed), :406-422 (botón).
  - _Verificación: añadido durante la verificación_
- **Cabeceras de proxy personalizadas por servidor** — En 'Advanced options' de la configuración del servidor se pueden añadir, ocultar/mostrar y eliminar cabeceras HTTP personalizadas (p. ej. X-Access-Token para Cloudflare Access o proxies con autenticación) que la app envía en cada petición, con aviso al usar cabeceras reservadas.
  - Móvil (Sí): SparkyFitnessMobile/src/components/ServerConfigModal.tsx:104-111 (estado proxyHeaders/showHeaders), :786-800 (alerta 'Reserved Header'), :1163-1290 (Advanced options > Proxy Headers: Add header, nombre, valor, mostrar/ocultar, eliminar).
  - _Verificación: añadido durante la verificación_

#### En ambos, con diferencias (1)

- **Aplicación en el cliente de los métodos de login configurados por el admin** — La pantalla de inicio de sesión lee /api/auth/settings y muestra u oculta email/contraseña, passkey y botones de proveedores OIDC (con logo) según lo configurado por el admin.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Auth/Auth.tsx:66-100 (useAuthSettings; passkeyEnabled; auto-redirección a un único proveedor OIDC si auto_redirect y email deshabilitado :87-100)
  - Móvil (Parcial): SparkyFitnessMobile/src/components/ServerConfigModal.tsx:829-863, :997-1012 (proveedores OIDC con logo_url), :1022 (passkey); src/components/ReauthModal.tsx:481-615; src/screens/OnboardingScreen.tsx:731-745. El campo auto_redirect se tipa en src/services/api/authService.ts:551 pero no se usa.
  - Nota: Parcial en móvil: no implementa la auto-redirección al único proveedor OIDC; en su lugar, si no hay métodos estándar, sugiere usar una API key o contactar al administrador (ServerConfigModal.tsx:1052).

<details><summary>En paridad web ↔ móvil (5)</summary>

- Pantalla/diálogo 'Acerca de'
- Enlace al repositorio de GitHub
- Enlace a la documentación
- Anuncios del proyecto (modal)
- Anuncios del proyecto (modal de anuncio)

</details>

<details><summary>Descartado tras verificación: no existe en ninguno (11)</summary>

- Inspector de caché React Query Devtools — SparkyFitnessFrontend/src/App.tsx:36, :486 (ReactQueryDevtools buttonPosition="top-left"); solo se renderiza en builds de desarrollo (NODE_ENV=development).
- Dev Tools móvil: sembrar datos de salud de prueba — Sin equivalente web.
- Dev Tools móvil: sembrar entrenamiento y fuerza enriquecidos — Sin equivalente web.
- Dev Tools móvil: accesos a Health Connect — Sin equivalente web.
- Dev Tools móvil: forzar sincronización en segundo plano — Sin equivalente web.
- Dev Tools móvil: estado del Apple Watch — Sin equivalente web.
  - **Actualizado en la PR #3052 (fusionada):** La sección del reloj en Dev Tools ya aparece también en Android, con el título Wear OS y los mismos indicadores de emparejado y accesible, leídos del enlace con el reloj en Android. Sigue estando solo en las compilaciones de desarrollo.
- Dev Tools móvil: mostrar modal de reautenticación — Sin equivalente web.
- Dev Tools móvil: reiniciar banner de novedades — Sin equivalente web (la web solo guarda dismissedReleaseVersion en localStorage, App.tsx:165-168).
- Dev Tools móvil: reiniciar anuncio — Sin equivalente web.
- Dev Tools móvil: galería de la tarjeta de ciclo — Sin equivalente web.
- Botón de patrocinio en GitHub (Sponsor) — El componente existe (SparkyFitnessFrontend/src/components/GitHubSponsorButton.tsx:11-34) pero está desactivado: SHOW_SPONSOR_BUTTON = false en src/layouts/MainLayout.tsx:52 (usos :489-491, :653-655).

</details>

### 2.3 Diario de comidas y registro diario

#### Solo en la web (14)

- **Enlace directo a una fecha (?date=) y resaltado de alimento (?highlight=)** — La fecha del diario se refleja en la URL y se puede resaltar un alimento concreto al llegar desde otra pantalla (p. ej. borrado de alimento).
  - **Cubierto en parte por la PR #2989 (fusionada):** Ambas plataformas aceptan el enlace sparkyfitnessmobile://diary (lo usa la baldosa de calorías restantes de Android), que abre la pestaña Diario. La app no lee ninguna fecha del enlace ni puede resaltar un alimento, así que ?date= y ?highlight= de la web siguen sin equivalente en móvil.
  - Web (Sí): Diary.tsx:74-76,510-513 (searchParams date); MealCard.tsx:153-154,400-402 (highlight); pages/Foods/DeleteFoodDialog.tsx:112
- **Personalizar disposición del diario (widgets)** — Modo 'Layout' para arrastrar, redimensionar, ocultar/restaurar, maximizar tarjetas y restablecer la disposición; se guarda en servidor.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Diary/DiaryWidgetGrid.tsx; components/widgets/WidgetGrid.tsx:216-241 (ocultar/restaurar/reset), 257-291 (toolbar Layout/Done), 316-327 (drag/resize), 351-373 (maximizar)
- **Opciones avanzadas del escáner (motor, cámara, continuo, reenfocar)** — Elegir motor de decodificación (zxing, html5-qrcode, quagga2), cámara, modo continuo/único y 'Refresh Focus'.
  - Web (Sí): components/FoodSearch/BarcodeScanner.tsx:38-46 (ENGINE_OPTIONS), 344-361 (Engine/Camera), 496-523 (Continuous/Single, Refresh Focus)
- **Copiar comida desde ayer** — Copiar en un clic las entradas de ese tipo de comida del día anterior.
  - Web (Sí): MealCard.tsx:232-237,352-361 (useCopyFoodEntriesFromYesterdayMutation)
- **Copiar el día completo (a otra fecha o desde ayer)** — Copiar todas las comidas del día a otra fecha o copiar todo lo de ayer.
  - Web (Sí): pages/Diary/NutritionSummaryCard.tsx:116-127 (Copy entire day / Copy all from yesterday), 279-284 (CopyFoodEntryDialog sourceMealType='all')
- **Crear comida (plantilla) desde el diario** — Convertir las entradas de una comida del día en una plantilla de comida reutilizable (nombre, descripción, pública).
  - Web (Sí): MealCard.tsx:362-371; pages/Diary/ConvertToMealDialog.tsx:72-126
- **Registrar/editar en el diario de un familiar** — Gestionar el diario de otra persona actuando en su nombre con permiso can_manage_diary.
  - Web (Sí): components/ProfileSwitcher.tsx; contexts/ActiveUserContext.tsx (activeUserId usado en Diary.tsx:64,272-283)
- **Copiar comida a un familiar** — Enviar entradas propias al diario de un familiar.
  - Web (Sí): CopyFamilyEntryDialog.tsx:157-175,233 (pestaña 'Copy To Family')
- **Desglose del cálculo del objetivo calórico** — Diálogo con la matemática del objetivo: TMB y algoritmo, grasa corporal, multiplicador de actividad, modo objetivo y ajustes.
  - Web (Sí): DailyProgress.tsx:812-837; components/CalorieTargetBreakdown.tsx
- **Aviso de perfil incompleto** — Alerta cuando faltan peso/altura/edad (o grasa corporal) para calcular la TMB, con enlace a perfil o mediciones.
  - Web (Sí): DailyProgress.tsx:595-639
- **Estado según dirección del objetivo** — Colores e iconos según el tipo de objetivo (máximo, rango): check verde, exceso en rojo, fuera de rango en ámbar y banda objetivo en el anillo.
  - Web (Sí): NutritionSummaryCard.tsx:186-249; DailyProgress.tsx:363-385 (targetBand)
  - _Verificación: corregido por verificación_
- **Resumen diario de salud de wearables** — Tarjeta con Body Battery, estrés medio, FC en reposo, recuperación, preparación, edad física y carga de entrenamiento del día.
  - Web (Sí): Diary.tsx:401-411; components/Health/DailyHealthMetricsCard.tsx:53-316
- **Importar diario de comidas desde CSV** — Cargar o pegar un CSV, descargar plantilla, editar filas, elegir ámbito de coincidencia de alimentos e importar.
  - Web (Sí): pages/Diary/FoodDiaryImportCSV.tsx:718-1000; pages/Settings/DataImportSettings.tsx:162-168
- **Exportar diario de comidas a CSV** — Descargar todo el diario en CSV eligiendo delimitador.
  - Web (Sí): pages/Settings/DataManagementSettings.tsx:26-81 (useDownloadDiaryExport)

#### Solo en el móvil (19)

- **Cambiar de día deslizando y volver a hoy re-tocando la pestaña** — Gesto de deslizar izquierda/derecha para cambiar de día; volver a tocar la pestaña Diario regresa a hoy y al inicio.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/DiaryScreen.tsx:240-253 (Gesture.Fling), 132-139 (tabPress -> goToToday)
- **Marcas en el calendario de días con fotos de progreso** — El selector de fecha marca con un punto los días que tienen fotos de progreso.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/DiaryScreen.tsx:145-157 (useCheckInPhotoDates al abrir), 786/832 (markedDates en CalendarSheet)
- **Crear nueva comida (plantilla) desde la búsqueda** — Opción 'New Meal' en la búsqueda para crear una plantilla de comida.
  - Móvil (Sí): FoodSearchScreen.tsx:473-475, 534-540 (New Meal -> MealAdd)
- **Elegir fecha al registrar ('Usar ayer'/'Usar hoy')** — Cambiar la fecha de destino dentro del propio formulario de registro.
  - Móvil (Sí): FoodEntryAddScreen.tsx:1711-1745 (DateSelectRow + Use Yesterday/Use Today); FoodEntryMultiAddScreen.tsx:384
- **Selección múltiple y alta en lote** — Seleccionar varios alimentos en la búsqueda y revisarlos (cantidad, porción, comida por ítem o para todos) antes de añadirlos juntos.
  - Móvil (Sí): FoodSearchScreen.tsx:228-262 (límite), 1253-1503 (Select/Select all/Review); screens/FoodEntryMultiAddScreen.tsx:344-623
- **Alternativas si el código no se encuentra** — Cuando no hay coincidencia, ofrecer escanear la etiqueta nutricional o añadir el alimento manualmente.
  - **Cubierto en parte por la PR #3126 (fusionada):** Cuando no se encuentra un código de barras, la web deja ahora en la página un aviso de que no hay producto y un botón Other sources que consulta los demás proveedores de códigos de barras activos. La web sigue sin ofrecer ahí escanear la etiqueta nutricional ni un botón para añadir el alimento a mano, y en el móvil la tarjeta que aparece cuando no hay coincidencia tiene ambas opciones, pero no permite consultar otras fuentes.
  - Móvil (Sí): FoodScanScreen.tsx:1044-1098 (No match -> Scan Nutrition Label / Add Food Manually)
  - _Verificación: corregido por verificación_
- **Escaneo de etiqueta en el dispositivo (Apple Intelligence)** · _Solo iOS_ — Lectura de la etiqueta con el modelo local de Apple antes de recurrir al servidor, con banner del origen y opción de releer con la otra IA.
  - Móvil (Sí): modules/on-device-nutrition/expo-module.config.json (platforms: ios); services/onDeviceLabelScan.ts:15-21; FoodScanScreen.tsx:582-616 ('Label read on this iPhone'); screens/AiSettingsScreen.tsx:61-140; components/LabelScanSourceBanner.tsx
  - iOS/Android: Requiere iOS 27+ con Apple Intelligence y la preferencia 'Scan Labels On Device'; en Android siempre se usa la IA del servidor.
- **Ajuste rápido de porción desde la fila** · _Difiere iOS/Android_ — Tocar las calorías de una fila (o pulsación larga) abre una hoja para cambiar la cantidad sin entrar a editar.
  - Móvil (Sí): SwipeableFoodRow.tsx:93-131,183-193; components/ServingAdjustSheet.tsx:139-183; DiaryScreen.tsx:661-663,788-793
  - iOS/Android: En Android el botón Atrás no cierra ServingAdjustSheet (BottomSheetModal sin useSheetHardwareBack). No disponible para componentes de comidas registradas.
- **Mover una entrada a otra fecha** — Cambiar la fecha de una entrada o comida registrada al editarla.
  - Móvil (Sí): FoodEntryViewScreen.tsx:1371-1380 (Date); EditLoggedMealScreen.tsx:556-564
- **Editar la nutrición de una entrada concreta** — Sobrescribir los valores nutricionales guardados en una entrada sin tocar el alimento de la biblioteca.
  - Móvil (Sí): FoodEntryViewScreen.tsx:1138,1259 ('Tap to edit nutrition'), 1353-1356 (más nutrientes)
- **Registrar agua sin abrir la app** · _Difiere iOS/Android_ — Registrar agua desde Siri/Atajos, widget, Centro de control, acción rápida o acceso directo del lanzador.
  - **Cubierto en parte por las PR #2989 y #3020 (fusionadas):** Android ya registra agua sin abrir la app desde el atajo Registrar agua del lanzador, una baldosa de Ajustes rápidos Registrar agua (también desde la pantalla de bloqueo) y un widget de agua de 2x2 para la pantalla de inicio, cuyos botones − y + quitan o añaden una bebida del recipiente elegido en el Panel. Siri/Atajos, el botón Acción, el control Eliminar toma y los widgets de agua de la pantalla de bloqueo siguen siendo solo de iOS, y el widget de agua de Android tiene un único tamaño (en iOS hay pequeño y mediano).
  - Móvil (Sí): targets/widget/ShortcutIntents.swift, Controls.swift, waterWidget.swift; hooks/useQuickActions.ts:24-35,142; targets/android-background-water
  - iOS/Android: iOS: Siri/Atajos, widget de agua con +/-, controles iOS 18 y acción rápida del icono. Android: sólo acceso directo dinámico 'Log water' en el lanzador.
- **Recordatorios de hidratación** — Notificaciones locales para beber agua dentro de una ventana horaria.
  - Móvil (Sí): screens/NotificationSettingsScreen.tsx:80-90; components/HydrationReminderReconciler.tsx; utils/hydrationReminder.ts
- **Banner de programa de carrera y valoración de esfuerzo** — Muestra la carrera prevista del programa (Start / Count it) y pide valorar el esfuerzo en el diario.
  - **Cubierto en parte por las PR #2948 y #3154 (fusionadas):** El Diario web muestra ahora el entrenamiento del programa en la tarjeta de ejercicio (Programado para hoy, Programado o A continuación), con un enlace al programa y, el día de hoy, un botón Marcar como hecho; el banner del móvil no tiene ninguno de los dos. El móvil sigue teniendo además Empezar para grabarlo, Asignar para una carrera registrada por otra vía, Retomar con calma tras una pausa o un salto de carga, la petición de valorar el esfuerzo y la propuesta de repetir el test de forma física, nada de lo cual tiene el Diario web.
  - Móvil (Sí): DiaryScreen.tsx:675-691 (RunEffortPrompt, RunProgramBanner)
- **Tarjetas de sueño en el diario** — Tarjetas de despertar, siestas y hora de dormir del día.
  - Móvil (Sí): DiaryScreen.tsx:303-309,648-652,740-745 (WakeUpCard, NapsCard, BedTimeCard)
- **Mediciones y fotos de progreso en el diario** — Resumen de mediciones manuales del día y miniaturas de fotos de progreso con acceso a añadir.
  - Móvil (Sí): DiaryScreen.tsx:746-765 (MeasurementsSummary -> MeasurementsAdd, CheckInPhotosSummary -> ProgressPhotos)
- **Escribir nutrición e hidratación del diario en la app de salud** · _Difiere iOS/Android_ — Enviar los totales de nutrición y agua del diario a Apple Health o Health Connect.
  - Móvil (Sí): src/services/writeback.ios.ts -> healthkit/writeback.ts; src/services/writeback.ts -> healthconnect/writeback.ts:90-175; components/HealthDataWriteback.tsx
  - iOS/Android: iOS escribe en HealthKit; Android en Health Connect (WRITE_NUTRITION/WRITE_HYDRATION). Opt-in por métrica.
- **Widgets con calorías/macros del diario** · _Difiere iOS/Android_ — Widgets de pantalla de inicio/bloqueo con calorías restantes y macros del día.
  - **Cubierto en parte por las PR #2989 y #3020 (fusionadas):** Android ya tiene widgets de calorías, macros y agua (el de agua, con botones − y + que funcionan sin abrir la app) y cuatro baldosas de Ajustes rápidos como equivalente de los controles de iOS: Registrar agua, Escanear código, Buscar comida y Calorías restantes, con las kcal que quedan hoy en su etiqueta, también en la pantalla de bloqueo. Siguen siendo solo de iOS las familias de widgets de pantalla de bloqueo y los controles Iniciar ayuno, Terminar ayuno y Eliminar toma, aunque en Android el botón − del widget de agua hace lo mismo que este último. El widget de calorías de Android sigue sin mostrar consumidas y quemadas, y los de calorías y macros siguen siendo un 2x1 y un 2x2 fijos.
  - Móvil (Sí): targets/widget/widgets.swift, macroWidget.swift, waterWidget.swift; targets/android-widget/kotlin/.../CalorieWidget.kt.tmpl, MacroWidget.kt.tmpl
  - iOS/Android: iOS: calorías, macros y agua, más familias de pantalla de bloqueo y controles. Android: widgets Glance de calorías y macros.
- **Accesos rápidos para escanear/registrar comida** · _Difiere iOS/Android_ — Acciones del icono de la app y controles del Centro de control que abren el escáner o la búsqueda de comida.
  - **Actualizado en la PR #2989 (fusionada):** Android tiene ya Escanear comida y Registrar comida entre las acciones del icono, además de las baldosas de Ajustes rápidos Escanear código y Buscar comida, que abren las mismas pantallas y hacen de equivalente a los controles del Centro de control de iOS. El botón Acción de iOS, que también puede lanzar estos controles, sigue sin equivalente en Android.
  - Móvil (Sí): hooks/useQuickActions.ts:24-35,114-118,142,170 (Platform.OS === 'ios'); targets/widget/Controls.swift (ScanFoodControlIntent/LogFoodControlIntent)
  - iOS/Android: El acceso directo de Android sólo ofrece 'Log water'.
  - _Verificación: corregido por verificación_
- **Nutrición y agua del diario en Apple Watch** · _Solo iOS_ — Página de objetivos con anillo de calorías y nutrientes elegidos, y página de agua con registro por toques y agua de alimentos.
  - **Actualizado en la PR #3052 (fusionada):** La app de Wear OS tiene ya las mismas dos páginas. Su página de objetivos muestra un anillo de calorías con lo consumido frente al objetivo, las kcal restantes y los nutrientes elegidos en el teléfono en Ajustes > Wear OS, pero no las calorías quemadas, que el Apple Watch muestra junto al anillo. Su página de agua tiene un botón por recipiente, el progreso frente al objetivo, el agua de los alimentos y un botón Log con las bebidas del día, además de un botón Undo Last que quita una bebida sin preguntar (la primera del día y no la última una vez sincronizadas las tomas, porque el teléfono envía las bebidas de la más reciente a la más antigua).
  - Móvil (Sí): targets/watch/Presentation/GoalSummaryView.swift, WaterIntakeView.swift; hooks/useWatchCheckInBridge.ts; utils/watchNutrients.ts
  - iOS/Android: No hay equivalente Wear OS.

#### En ambos, con diferencias (29)

- **Navegación de fecha (anterior/siguiente/Hoy/calendario)** · _Difiere iOS/Android_ — Botones de día anterior y siguiente, botón 'Hoy' y selector de fecha en calendario.
  - Web (Sí): SparkyFitnessFrontend/src/components/DayNavigator.tsx:78-190 (prev/next, Today, Popover Calendar); Diary.tsx:508-515
  - Móvil (Parcial): SparkyFitnessMobile/src/components/DateNavigator.tsx:60-95; CalendarSheet.tsx; DiaryScreen.tsx:173-232 (cabecera nativa iOS), 801-817 (DateNavigator), 782-787/828-833 (CalendarSheet)
  - iOS/Android: iOS 26+ con Liquid Glass: los controles de fecha se dibujan como items nativos de la cabecera (utils/nativeHeaderDatePicker.ts, services/nativeTabBarPreference.ts:25 sólo iOS). Android/iOS antiguo: barra DateNavigator propia. En Android el botón Atrás del sistema no cierra CalendarSheet (BottomSheetModal sin useSheetHardwareBack) y navega por debajo.
  - _Verificación: corregido por verificación_
- **Indicador de fecha pasada/futura y aviso al añadir** — Color distinto para fechas pasadas/futuras y aviso explícito al añadir alimentos en una fecha que no es hoy.
  - Web (Sí): DayNavigator.tsx:112-128 (colores date-past/future); MealCard.tsx:300-312 (aviso 'You are adding food entries for a past/future date')
  - Móvil (Parcial): DateNavigator.tsx:95 y DiaryScreen.tsx:176-182 colorean la fecha; no hay aviso textual en FoodSearch/FoodEntryAdd
- **Secciones por tipo de comida con calorías y objetivo por comida** — Una tarjeta/sección por tipo de comida con calorías consumidas frente al objetivo de esa comida y totales.
  - Web (Sí): Diary.tsx:413-455 (una MealCard por tipo visible, incluidas vacías); MealCard.tsx:241-257 (kcal / objetivo), 769-817 (totales de la comida con nutrientes configurables)
  - Móvil (Parcial): SparkyFitnessMobile/src/components/FoodSummary.tsx:64-145 (cabecera con Cal / objetivo), 152-170 (sólo grupos con entradas)
- **Detalle de una comida del día** — Vista dedicada con el desglose nutricional completo de un tipo de comida y su lista de alimentos.
  - Web (Parcial): MealCard.tsx:769-817 muestra totales de la comida inline (nutrientes de quick_info), sin vista dedicada
  - Móvil (Sí): SparkyFitnessMobile/src/screens/MealTypeDetailScreen.tsx:196-252 (FoodNutritionSummary + lista); DiaryScreen.tsx:260-276 (abre al tocar la cabecera)
- **Información en cada fila de alimento** — Nombre, marca, cantidad/unidad, hora, miniatura, alérgenos y nutrientes de cada entrada; insignias de IG y 'From Plan'.
  - Web (Sí): MealCard.tsx:382-765 (rejilla de nutrientes por entrada según preferencias quick_info, IG 516-529/684-695, 'From Plan' 511-515/679-683, alérgenos 531-536/722-727, imagen 642-662)
  - Móvil (Parcial): SparkyFitnessMobile/src/components/SwipeableFoodRow.tsx:142-196 (miniatura, nombre, cantidad, hora, AllergenBadges, sólo calorías)
- **Comidas registradas mostradas como una entrada** — Una comida (plantilla) registrada aparece como una sola fila agrupada con su nombre e imagen.
  - Web (Sí): MealCard.tsx:385-414 (FoodEntryMeal como una fila con meal_images); Diary.tsx:145-147
  - Móvil (Parcial): SwipeableFoodRow.tsx:45,98-106 (cada componente se muestra como fila; tocarlo abre EditLoggedMeal; borrar elimina la comida entera)
- **Añadir alimento a una comida concreta** — Botón en cada comida que abre la búsqueda de alimentos para ese tipo de comida.
  - Web (Sí): MealCard.tsx:259-336 (botón Utensils -> diálogo EnhancedFoodSearch)
  - Móvil (Parcial): MealTypeDetailScreen.tsx:259-273 (botón + en cabecera -> FoodSearch con mealTypeId); las secciones del diario no tienen botón propio (FoodSummary.tsx)
- **Unidad personalizada con conversión manual o estimada por IA al registrar** — Elegir una unidad que el alimento no tiene y obtener el factor de conversión manualmente o por IA.
  - Web (Sí): FoodUnitSelector.tsx:703 (Custom unit...), 870-955 (conversión manual + AiEstimateSection); components/FoodUnitSelector/AiEstimateSection.tsx (Use this/Edit/Try again)
  - Móvil (Parcial): Sólo vía 'Adjust nutrition' -> FoodForm (screens/foodForm/AdjustNutritionMode.tsx) con components/FoodUnitSelectorSheet.tsx:373-510 (AI estimate, Saved Custom Units); FoodEntryAddScreen.tsx:982-1016 (guarda unidades equivalentes)
- **Ajustar nutrición antes de registrar y guardar alimento externo** — Modificar los valores nutricionales/porción antes de registrar y guardar un resultado online en la biblioteca.
  - Web (Parcial): components/FoodSearch/FoodResultCard.tsx:287-296 ('Edit & Add' sólo para resultados online, abre FoodFormDialog); alimentos locales no permiten override en FoodUnitSelector
  - Móvil (Sí): FoodEntryAddScreen.tsx:1353-1400 (handleAdjustNutrition -> FoodForm 'adjust-entry-nutrition'), 1533-1562 (Adjust nutrition y Save Food)
- **Aviso de alérgenos al registrar** — Banner de advertencia cuando el alimento contiene un alérgeno seguido por el usuario, además de insignias en filas.
  - Web (Parcial): Insignias en components/FoodSearch/FoodResultCard.tsx, VariantCard.tsx y MealCard.tsx:531-536; no hay banner en FoodUnitSelector
  - Móvil (Sí): components/AllergenWarning.tsx:48 usado en FoodEntryAddScreen.tsx:1; AllergenBadges en SwipeableFoodRow.tsx:181 y foodSearch/FoodResultRow.tsx:136
- **Registrar una comida guardada (plantilla)** — Registrar una comida de la biblioteca ajustando porciones e ingredientes antes de guardarla.
  - Web (Sí): pages/Diary/LogMealDialog.tsx:44-95 (MealBuilder con ingredientes editables, raciones, hora, favorito)
  - Móvil (Parcial): FoodEntryAddScreen.tsx:1696-1698,1877 ('meal makes N servings', 'Add Meal'): sólo raciones; ingredientes editables después en EditLoggedMealScreen
- **Elegir proveedor de datos al escanear** — Selector del proveedor que resolverá el código de barras dentro del escáner.
  - **Cubierto en parte por la PR #3126 (fusionada):** El móvil sigue sin selector de proveedor en el escáner y busca el código con el proveedor fijado en los ajustes de comida. Sin embargo, tras una coincidencia, la pantalla de añadir muestra la fuente del resultado y una hoja Other sources con los resultados de los demás proveedores activos, y al elegir uno sustituye el alimento de esa entrada. Si la búsqueda predeterminada no encuentra nada, el móvil no ofrece otra fuente, mientras que la web deja elegir el proveedor en el escáner y tiene la misma comparación de otras fuentes.
  - Web (Sí): components/FoodSearch/BarcodeScannerDialog.tsx:48-101 (Data Provider)
  - Móvil (Parcial): FoodSearchScreen.tsx:481-487 (no se pasa providerId; el servidor usa default_barcode_provider_id de Food Settings)
  - _Verificación: corregido por verificación_
- **Escanear etiqueta nutricional con IA del servidor** — Fotografiar o elegir de la galería una tabla nutricional y crear el alimento con sus valores leídos por IA.
  - Web (Parcial): No hay uso de /api/foods/scan-label en SparkyFitnessFrontend/src
  - Móvil (Sí): FoodScanScreen.tsx:168-189 (segmento Label), 582-641, 1213-1237 (tomar/elegir foto); services/api/externalFoodSearchApi.ts:732; screens/foodForm/CreateFoodMode.tsx:709
  - _Verificación: corregido por verificación_
- **Estimación de comida por foto con IA** — Hacer o elegir una foto del plato para que la IA estime ingredientes y nutrición y registrarla en el diario.
  - Web (Parcial): Sólo dentro del chat Sparky: components/thread.tsx:401 (sparky_analyze_food_image -> FoodPhotoEstimateToolUI); hooks/Foods/useFoodPhotoEstimate.ts:10-14 (web no tiene la ruta REST directa)
  - Móvil (Sí): FoodScanScreen.tsx:1107-1173,1255-1311 (modo Photo); screens/FoodPhotoIntroScreen.tsx; components/FoodPhotoFlow.tsx; screens/FoodPhotoLogEntryScreen.tsx:332-420 (comida, fecha, raciones)
- **Mejorar estimación (más fotos, peso total, descripción)** — Añadir más imágenes, indicar peso total y descripción y regenerar la estimación.
  - Web (Parcial): En web sólo se puede seguir conversando/adjuntando en el chat (components/thread.tsx); no hay formulario dedicado
  - Móvil (Sí): screens/FoodPhotoImproveScreen.tsx:557-807 (Add another image, Total weight g/oz, Description, Generate estimate)
- **Ver el diario de un familiar** — Consultar las comidas registradas por un miembro de la familia que ha compartido acceso.
  - Web (Sí): layouts/MainLayout.tsx:506 (ProfileSwitcher, actuar en nombre de otro); WidgetGrid.tsx:105-107 (diseño de sólo lectura)
  - Móvil (Parcial): DiaryScreen.tsx:158-164,203-210,808-816 (acceso Family); screens/FamilyMembersScreen.tsx:25-92 ('Family diary access is managed in the web app'); FamilyDiaryScreen.tsx:99-181 (sólo alimentos, sólo lectura)
- **Desglose de energía quemada y energía neta** — Detalle de calorías de ejercicio/activas/pasos y TMB (medido o algoritmo) y energía neta (ingerido - quemado).
  - Web (Sí): DailyProgress.tsx:405-499 (tooltip), 525-593 (Energy Burned Breakdown), 774-799 (Net Energy)
  - Móvil (Parcial): CalorieRingCard.tsx:80 sólo muestra el total quemado
- **Panel de TDEE adaptativo / proyección del dispositivo** — Muestra TDEE adaptativo con confianza, tendencia de peso, días de datos y avisos de fallback, o la proyección de TDEE del dispositivo.
  - Web (Sí): DailyProgress.tsx:641-726 (Adaptive TDEE), 728-773 (Device Projection)
  - Móvil (Parcial): DiaryCalorieMacroSummary.tsx:272-305 (sólo Projected TDEE / Goal Mode target / fuente en modo tdee); sin panel adaptativo
- **Editar objetivos para la fecha del diario** — Cambiar objetivos (calorías, macros, distribución por comida, presets) para la fecha seleccionada desde el diario.
  - Web (Sí): NutritionSummaryCard.tsx:128 (EditGoalsForToday); pages/Goals/EditGoalsForToday.tsx:194-531 ('Save for this Date')
  - Móvil (Parcial): screens/GoalsScreen.tsx:998 (siempre hoy), accesible sólo desde SettingsScreen.tsx:268
- **Mini tendencias nutricionales** — Gráficos pequeños de los últimos 14 días por nutriente dentro del resumen nutricional.
  - Web (Sí): pages/Diary/MiniNutritionTrends.tsx:204,237,261-264; NutritionSummaryCard.tsx:273-276
  - Móvil (Parcial): screens/NutrientTrendsScreen.tsx:31-206 (pantalla por nutriente 7/30/90 días) abierta desde DailyNutritionDetailsScreen.tsx:304; no está en el diario
- **Historial de bebidas del día (editar hora / borrar)** · _Solo iOS_ — Lista de bebidas registradas en el día con edición de hora y borrado individual.
  - **Cubierto en parte por la PR #3052 (fusionada):** Wear OS tiene ya también la lista de bebidas: el botón Log de la página de agua muestra las bebidas de hoy con su hora, y al tocar una se quita tras pedir confirmación, como en el Apple Watch, aunque Wear OS las ordena de la más antigua a la más reciente. Wear OS tiene además un botón Undo Last que quita una bebida sin preguntar: la primera del día y no la última una vez sincronizadas las tomas, porque el teléfono envía las bebidas de la más reciente a la más antigua. La app del teléfono sigue sin lista de bebidas en ambas plataformas, y ninguno de los dos relojes permite cambiar la hora de una bebida como hace la web.
  - Web (Sí): WaterIntake.tsx:450-600 (Today's drinks, editTime, deleteEntry)
  - Móvil (Parcial): El teléfono no tiene esta lista; sólo el Apple Watch permite borrar (targets/watch/Presentation/WaterLogView.swift:4-36; hooks/useWatchCheckInBridge.ts:1140-1158)
  - iOS/Android: Sólo vía Apple Watch (lectura y borrado, sin editar hora); en Android no existe.
- **Cinética de cafeína** — Cafeína activa, curva del día, umbral para dormir, hora límite del último café, impacto en el sueño y dosis recientes.
  - Web (Sí): pages/Diary/CaffeineCard.tsx:198-574 (impacto en el sueño, half-life, Last Coffee By, curva, Recent Doses 48h); Diary.tsx:473-478
  - Móvil (Parcial): components/CaffeineCard.tsx:151-301 en DashboardScreen.tsx:797-805 (Active now, At bedtime, Last dose by, curva, umbral)
- **Configurar qué nutrientes se ven en el diario** — Preferencias de nutrientes visibles en filas/resumen del diario y activación del resumen.
  - Web (Sí): pages/Settings/NutrientDisplaySettings.tsx:61-66,189-263 (grupos summary y quick_info por plataforma escritorio/móvil)
  - Móvil (Parcial): screens/DiarySettingsScreen.tsx:192-240 (interruptor Diary Summary + hasta 4 nutrientes personalizados, grupo 'diary'); SettingsScreen.tsx:322
- **Copiar comida desde un familiar eligiendo alimentos y cantidades** — Al copiar a tu diario una comida de un familiar, seleccionar alimentos concretos, ajustar la cantidad de cada uno, ver la nutrición resultante y elegir fecha y comida destino antes de copiar.
  - Web (Parcial): pages/Diary/CopyFamilyEntryDialog.tsx:134-155 (copyFromFamily copia el tipo de comida completo: familyUserId, sourceDate, sourceMealType, targetDate, targetMealType), 230-233 (pestaña 'From'); sin selección por alimento ni ajuste de cantidades.
  - Móvil (Sí): screens/FamilyDiaryScreen.tsx:124 (abrir comida), FamilyMealDetailScreen.tsx:52-53,139-143 (Select all/Deselect, seleccionar alimento), 211 (Continue); FamilyCopyReviewScreen.tsx:242-272 (cantidad por alimento), 296-317 (calorías/macros), 327-369 (fecha y comida destino), 380 ('Copy to my diary'); requiere canCopy (services/api/familyApi.ts:23-29).
  - _Verificación: añadido durante la verificación_
- **Porcentaje del objetivo diario y desglose completo al registrar** — Al registrar un alimento, ver qué porcentaje del objetivo diario aportan calorías y macros y el desglose completo de nutrientes según las preferencias.
  - Web (Parcial): components/FoodUnitSelector.tsx:975-1010 ('Nutrition for {{serving}}': sólo kcal, proteína, carbohidratos y grasa, sin porcentaje del objetivo).
  - Móvil (Sí): screens/FoodEntryAddScreen.tsx:1587-1599 (FoodNutritionHeader con goalPercentages de calorías/proteína/carbohidratos/grasa -> components/NutritionMacroCard.tsx:92-121,180-181), 1825-1830 (FoodNutrientBreakdown con todos los nutrientes).
  - _Verificación: añadido durante la verificación_
- **Cambiar a una unidad compatible o personalizada al editar una entrada** — Al editar una entrada ya registrada, elegir otra unidad compatible o crear una unidad personalizada con factor de conversión manual.
  - Web (Sí): pages/Diary/EditFoodEntryDialog.tsx:452-520 (selector de unidad con unidades compatibles marcadas y 'Custom unit...'), 613-700 (nombre de unidad y 'manualConversion'), 286-330 (guarda la variante convertida).
  - Móvil (Parcial): screens/FoodEntryViewScreen.tsx:1062-1090 ('Select Serving' sólo entre variantes guardadas); no hay unidad personalizada ni conversión al editar, aunque se puede sobrescribir la nutrición ('Tap to edit nutrition', 1258).
  - _Verificación: añadido durante la verificación_
- **Botón para poner la hora predeterminada de la comida** — En el formulario de registro/edición, un botón 'Default' que fija la hora de la entrada a la hora predeterminada del tipo de comida, además de 'Now' y 'Clear'.
  - Web (Sí): components/FoodUnitSelector.tsx:778-791 (botón 'Default' / 'Set to meal default (HH:MM)'); EditFoodEntryDialog.tsx:588-594 ('setMealDefault', 'Default').
  - Móvil (Parcial): FoodEntryAddScreen.tsx:298-304 (la hora se rellena al abrir con default_time vía prefillEntryTime), pero sólo ofrece 'Now' y 'Clear' (1757-1790); FoodEntryViewScreen.tsx:1453-1492 sólo hora y 'Clear'. La hora por defecto sólo se cambia en MealTypeSettingsScreen.
  - _Verificación: añadido durante la verificación_
- **Resumen nutricional del día frente a objetivos** — Bloque del diario con cada nutriente consumido frente a su objetivo diario y barra de progreso.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Diary/NutritionSummaryCard.tsx:98-271 (todos los nutrientes del grupo 'summary' configurado, con objetivo y barra)
  - Móvil (Parcial): SparkyFitnessMobile/src/components/DiaryCalorieMacroSummary.tsx:198-341 (barra de calorías + Protein/Carbs/Fat/Fiber + hasta 4 nutrientes personalizados; plegable y ocultable en DiarySettingsScreen). El desglose completo está en DailyNutritionDetailsScreen, accesible desde el Dashboard (DashboardScreen.tsx:619-623)
  - _Verificación: añadido durante la verificación_
- **Botón 'Default' para la hora de la entrada** — Restablecer la hora de una entrada a la hora predeterminada del tipo de comida, además de 'Now' y 'Clear'.
  - Web (Sí): SparkyFitnessFrontend/src/components/FoodUnitSelector.tsx:214,781-789 ('Default' / setMealDefault); pages/Diary/EditFoodEntryDialog.tsx:586-595
  - Móvil (Parcial): SparkyFitnessMobile/src/screens/FoodEntryAddScreen.tsx:295-304 (precarga la hora desde default_time con prefillEntryTime), 1745-1786 (sólo 'Now' y 'Clear'); no hay botón para volver a la hora predeterminada una vez cambiada
  - _Verificación: añadido durante la verificación_

#### En ambos clientes, pero con diferencias iOS/Android (1)

- **Copiar una comida a otra fecha/tipo de comida** · _Difiere iOS/Android_ — Copiar las entradas de un tipo de comida a una fecha y tipo de comida destino.
  - Web (Sí): MealCard.tsx:338-344; pages/Diary/CopyFoodEntryDialog.tsx:96-189 (Target Date, Meal Type); Diary.tsx:201-224
  - Móvil (Sí): MealTypeDetailScreen.tsx:108-115,274-293; components/CopyMealSheet.tsx:159-303 (Target date, Target meal, aviso de duplicado)
  - iOS/Android: Sólo desde el detalle de la comida. En Android el botón Atrás no cierra CopyMealSheet.

<details><summary>En paridad web ↔ móvil (27)</summary>

- Vista del diario del día
- Acceso global para registrar comida
- Búsqueda de alimentos y comidas guardadas con filtro de propiedad
- Búsqueda en proveedor online seleccionable
- Búsqueda agregada en todos los proveedores
- Favoritos, recientes y frecuentes en la búsqueda
- Marcar alimento o comida como favorito
- Crear alimento personalizado desde la búsqueda (incl. 'quick add' sin guardar)
- Formulario de registro: cantidad, porción, comida, hora y nota
- Escanear código de barras
- Revisión de la estimación por foto y modo de guardado
- Editar entrada de alimento
- Editar comida registrada
- Fotos propias para una entrada
- Ver imágenes de la entrada ampliadas
- Eliminar entrada
- Copiar comida desde un familiar
- Resumen de energía diaria (anillo)
- Resumen nutricional del día
- Suplementos incluidos en los totales del día
- Tarjeta de ingesta de agua
- Bebidas de añadido rápido
- Tarjeta de ejercicio en el diario
- Entrenamiento programado del plan en el diario
- Gestionar tipos de comida
- Copiar comida desde el diario de un familiar
- Añadir comida desde el menú global '+'

</details>

<details><summary>Descartado tras verificación: no existe en ninguno (1)</summary>

- Acciones masivas / borrado múltiple en el diario — BulkActionToolbar/BulkDeleteDialog sólo se usan en Foods.tsx, MealManagement.tsx, MealPlanCalendar.tsx, Exercises.tsx, WorkoutPresetsManager.tsx, WorkoutPlansManager.tsx; nunca en pages/Diary

</details>

### 2.4 Biblioteca de alimentos, comidas y planes de comidas

#### Solo en la web (18)

- **Filtro 'Necesita revisión' (alimentos y comidas)** — Opción de filtro para ver elementos marcados como pendientes de revisión.
  - Web (Sí): Foods.tsx:604-606 SelectItem 'needs-review'; MealManagement.tsx:684-686; tipo MealFilter en src/types/meal.ts:217; contador en GlobalNotificationIcon (src/hooks/Foods/useReview.ts).
- **Filtro por fuente de datos (proveedor / Manual)** — Filtra alimentos por el proveedor de origen (OpenFoodFacts, USDA, FatSecret, etc.) o manuales.
  - Web (Sí): Foods.tsx:612-643 Select con FOOD_PROVIDER_TYPES + 'Manual'; providerFilter en useFoodDatabaseManager.ts:58, 76-83, 99-102.
- **Ordenación de la lista por columnas** — Ordenar alimentos por nombre o por valores de nutrientes (asc/desc).
  - Web (Sí): Foods.tsx:703-725 DataTable con manualSorting -> sortOrder; columnas de nutrientes ordenables salvo fibra y personalizados (Foods.tsx:397-398). MealManagement.tsx:484 columnas de nutrientes de comidas ordenables.
- **Editar alérgenos del alimento** — Marcar alérgenos comunes o personalizados en cada variante del alimento.
  - Web (Sí): VariantCard.tsx:602-665 chips COMMON_ALLERGENS + 'Custom allergen…' con botón Add.
  - Nota: Las trazas (traces) solo se muestran en ambas plataformas, no se editan.
- **Actualizar desde la fuente y ver fuente de datos** — Mostrar el proveedor de origen y recargar los datos del alimento desde ese proveedor.
  - Web (Sí): CustomFoodForm.tsx:308-341 campo 'Data source' de solo lectura y botón 'Refresh from source' (useRefreshFoodFromSourceMutation, 123-140).
- **Visor de campos de nutrientes del proveedor (alias / nuevo nutriente)** — Ver los nombres exactos de nutrientes del proveedor y añadirlos como alias o crear un nutriente personalizado en un clic.
  - Web (Sí): src/components/FoodSearch/ProviderNutrientViewer.tsx (montado en CustomFoodForm.tsx:368-371): 'Nutrient fields reported by…', 'Add as alias' (269), 'New custom nutrient' (300) con CustomNutrientDialog (313).
- **Duplicar alimento** — Crear una copia privada editable de cualquier alimento (propio, familiar, público o del sistema).
  - Web (Sí): Menú 'Duplicate food' (Foods.tsx:432-438) -> diálogo 'Duplicate Food' (804-835); useFoodDatabaseManager.ts:123-187 (copia sin código de barras ni vínculo de proveedor).
- **Selección múltiple y borrado masivo** — Seleccionar varios alimentos, comidas o planes y eliminarlos de una vez.
  - Web (Sí): Foods.tsx:646-672 modo 'Select' + BulkActionToolbar/BulkDeleteDialog (738-774, modo 'delete'); comidas MealManagement.tsx:604-625, 739; planes MealPlanCalendar.tsx:398-481.
- **Duplicar comida** — Crear una copia editable de una comida.
  - Web (Sí): MealManagement.tsx:513-516 'Duplicate Meal' y diálogo 780-811 (sufijo '(copy)' en MealBuilder.tsx:293).
- **Contribuir un producto a Open Food Facts** — Publicar en Open Food Facts los datos de un alimento propio con foto, vista previa exacta y confirmación de derechos.
  - Web (Sí): Menú 'Contribute to Open Food Facts' (Foods.tsx:439-451) y botón 'Save and preview contribution' en el formulario (CustomFoodForm.tsx:499-512); src/pages/Foods/OpenFoodFactsContributionDialog.tsx:84-552 (foto propia, tipo de foto, idioma, vista previa de campos, casillas ODbL/CC BY-SA, 'Publish this contribution').
- **Ajustes de contribución a Open Food Facts del usuario** — Ver qué cuenta OFF se usará y fijar el idioma de los datos del producto.
  - Web (Sí): src/pages/Settings/OpenFoodFactsContributionSettingsCard.tsx:60-210 (cuenta personal/servidor, 'Product data language', 'Save language'); montado en ExternalProviderSettings.tsx:121.
- **Habilitar contribuciones OFF en el servidor (admin)** — Interruptor de administrador para permitir contribuciones y credenciales globales de respaldo.
  - Web (Sí): src/pages/Admin/OpenFoodFactsAdminContributionSettings.tsx:31-58 ('Allow Open Food Facts contributions on this server'), en GlobalProviderSettings.tsx:119 (ruta /admin).
- **Importar base de alimentos desde CSV** — Carga masiva de alimentos con variantes y nutrición desde un archivo o texto CSV.
  - Web (Sí): Settings > Data Import 'Food Database (CSV)' (DataImportSettings.tsx:150-158) -> src/pages/Foods/FoodImportFromCSV.tsx: 'Upload CSV' (≤25 MB, 678), pegar y 'Parse Text' (705-717), 'Download Template' (687), 'Add Row'/'Delete Row' (669, 976), mapeo de cabeceras CsvHeaderMappingDialog (40, 127-137), 'Override existing food details' (1002-1008), 'Import Data' (1036).
- **Importación/sincronización masiva del Canadian Nutrient File (admin)** — Importar o re-sincronizar el catálogo completo de Health Canada (~5.700 alimentos) en la biblioteca.
  - Web (Sí): Botón 'Bulk Import / Sync' en ProviderCard.tsx:535-545 (solo isAdminMode, Admin > GlobalProviderSettings.tsx:125-137) -> src/pages/Settings/CnfBulkImportDialog.tsx: alcance biblioteca o biblioteca+entradas pasadas (193-246), idioma EN/FR (257-276), fuente oficial o ZIP local (286-343), muestra de 10 (363-369), 'Clear CNF Library' (404, 441-447), progreso (120-146).
- **Importación masiva Livsmedelsverket (admin)** — Descargar la base de composición sueca (~2.600 alimentos) a la biblioteca para búsqueda local.
  - Web (Sí): ProviderCard.tsx:572-580 y 1062-1067 (isAdminMode) -> src/pages/Settings/LivsmedelsverketBulkImportDialog.tsx: idioma (157), modo de sincronización biblioteca / con entradas pasadas (180-207), modo prueba de 10 (224), 'Purge Library Foods' (263, 300-306), progreso (107).
- **Proveedor Nutritionix (legado)** — Búsqueda e importación de alimentos de marca/naturales de Nutritionix.
  - Web (Sí): FoodSearch.tsx:627-640 handler nutritionix y handleNutritionixEdit (1050-1080); credenciales en ProviderSpecificFields.tsx:629-640.
- **Configurar proveedores externos de alimentos** — Añadir, editar credenciales, activar/desactivar y borrar proveedores de datos de alimentos.
  - Web (Sí): ExternalProviderSettings.tsx (SettingsPage.tsx:427) con AddExternalProviderForm.tsx, EditProviderForm.tsx y ProviderCard.tsx.
- **Conectar bases de datos de alimentos en el onboarding** — Paso inicial para conectar fuentes de alimentos (p. ej. clave API de USDA).
  - Web (Sí): src/components/Onboarding/FoodSourcesStep.tsx:104-196 ('Connect food databases', 'USDA API Key', 'Get a free API key').

#### Solo en el móvil (5)

- **Hub de biblioteca con contadores y 'Registrado recientemente'** — Pantalla resumen con número de alimentos/comidas, accesos de creación rápida y lista mixta de alimentos, comidas y ejercicios registrados recientemente.
  - Móvil (Sí): LibraryScreen.tsx:109-117 (conteo de alimentos), 379 (número de comidas), 276-344 (sección Create), 576-680 (Recently Logged con MealLibraryRow/FoodLibraryRow), 260-266 pull-to-refresh.
- **Cambiar de variante/porción en el detalle** — Seleccionar otra unidad/porción guardada para ver sus valores nutricionales.
  - Móvil (Sí): FoodDetailScreen.tsx:483-515 BottomSheetPicker 'Select Serving' con variantes locales o externas (buildLocalVariantOptions/buildExternalVariantOptions, 192-213).
- **Escanear etiqueta nutricional para rellenar el alimento** · _Difiere iOS/Android_ — Fotografiar la tabla nutricional y rellenar automáticamente el formulario del alimento.
  - Móvil (Sí): EditFoodMode.tsx:668-681 botón 'Scan nutrition label' -> FoodScan capture-label; la creación desde FoodScan llega a CreateFoodMode con LabelScanSourceBanner (CreateFoodMode.tsx:570-575); FoodScanScreen.tsx:582-611 (dispositivo primero, luego servidor /api/foods/scan-label en externalFoodSearchApi.ts:732).
  - iOS/Android: iOS 27+ con Apple Intelligence puede leer la etiqueta en el dispositivo (modules/on-device-nutrition, expo-module.config.json platforms ['ios']; src/services/onDeviceLabelScan.ts:17) con interruptor en Ajustes > IA y banner para reintentar con la otra IA; Android siempre usa la IA del servidor.
- **Registrar una comida en el diario desde la biblioteca** — Añadir una comida guardada al diario desde su ficha.
  - Móvil (Sí): MealDetailScreen.tsx:509-517 botón 'Log Meal' -> FoodEntryAdd.
- **Planificar comida desde su ficha** — Crear un plan de comidas pre-rellenado con la comida actual.
  - Móvil (Sí): MealDetailScreen.tsx:519-528 botón 'Plan Meal' -> MealPlanForm {initialMeal}.

#### En ambos, con diferencias (18)

- **Columnas de nutrientes configurables en la lista** — La lista muestra los nutrientes elegidos en las preferencias (vista quick_info) como columnas.
  - Web (Sí): useFoodDatabaseManager.ts:42-52 (preferencia quick_info por plataforma) y Foods.tsx:359-400 (una columna por nutriente visible, incluidos personalizados).
  - Móvil (Parcial): FoodLibraryRow.tsx:113-117 solo muestra calorías del default_variant; la vista quick_info no se ofrece en móvil (src/screens/NutrientDisplaySettingsScreen.tsx:34-41).
  - Nota: Móvil: solo calorías en la fila; el desglose completo está en el detalle.
- **Insignia de proveedor verificado** — Marca los alimentos cuyos datos provienen de un proveedor verificado.
  - Web (Parcial): ProviderVerifiedBadge solo en resultados de búsqueda (src/components/FoodSearch/FoodResultCard.tsx:188-189) y en la cabecera del formulario de edición (CustomFoodForm.tsx:236); no aparece en la tabla de la biblioteca ni en el diálogo de detalle (Foods.tsx).
  - Móvil (Sí): FoodLibraryRow.tsx:82-84 VerifiedBadge en la lista; FoodNutritionSummary.tsx:68 en el detalle (FoodDetailScreen.tsx:457-464); también en filas de búsqueda.
- **Insignia de 'estimación IA' en alimentos** — Señala alimentos/variantes cuyo valor fue estimado por IA.
  - Web (Parcial): Solo dentro del formulario, por variante: insignia de confianza y destello en el desplegable de unidades (src/components/FoodSearch/VariantCard.tsx:346-376, 556-588); no en la tabla.
  - Móvil (Sí): FoodLibraryRow.tsx:79-81 AiEstimateBadge cuando default_variant.source === 'ai_estimate'; confianza de variante IA en FoodForm.tsx (~1166).
- **Campos de nutrientes estándar en el formulario** — Edición de calorías, macros, micronutrientes y otros valores del alimento.
  - Web (Sí): NutrientGrid según preferencia food_database (CustomFoodForm.tsx:163-170); incluye grasas poliinsaturadas/monoinsaturadas (src/constants/nutrients.ts:97-107) e índice glucémico (src/components/FoodSearch/NutrientGrid.tsx:103, 139-140).
  - Móvil (Parcial): Lista fija en FoodForm.tsx:1203-1373: calorías, grasa, carbohidratos, proteína, fibra y 'Show more' (saturada, trans, colesterol, sodio, azúcares, calcio, hierro, vit. A, vit. C, potasio, cafeína, agua, alcohol). Sin poli/monoinsaturadas ni índice glucémico (solo se arrastran: EditFoodMode.tsx:310-311).
  - Nota: Móvil no respeta la preferencia food_database para los campos del formulario.
- **Variantes de unidad múltiples (añadir, duplicar, eliminar, por defecto)** — Gestionar varias unidades/porciones con nutrición propia y elegir cuál es la predeterminada.
  - **Cubierto en parte por la PR #2919 (fusionada):** El móvil ya permite añadir raciones con nombre (como un paquete o una botella, indicadas en g o ml) al crear o editar un alimento cuya ración de referencia sea de peso o de volumen; cada una se guarda como variante propia con los nutrientes escalados a partir de esa ración, y se puede volver a quitar. La web tiene el mismo editor de raciones con nombre junto a su sección Variantes de unidad. El móvil sigue sin selector de unidad por defecto ni opción de duplicar, el formulario de creación no permite añadir otra unidad con nutrientes propios y una unidad así no se puede borrar.
  - Web (Sí): CustomFoodForm.tsx:373-462 sección 'Unit Variants' con 'Add Unit'; VariantCard.tsx:394-406 casilla 'Default', 433-444 'Duplicate Unit', 446-457 'Remove Unit'.
  - Móvil (Parcial): Se edita una variante cada vez elegida con el selector de unidad (EditFoodMode.tsx:686-694); elegir una unidad nueva guarda 'Saved as new variant' (EditFoodMode.tsx:444-471). Sin selector de predeterminada, sin duplicar y sin borrar variantes que no sean equivalentes; la creación guarda una única variante por defecto (CreateFoodMode.tsx:359).
- **Alimento rápido (no guardar en mi lista)** — Crear un alimento de uso puntual que no queda en la lista de alimentos guardados.
  - Web (Sí): CustomFoodForm.tsx:352-366 casilla 'Quick Add (don't save to my food list for future use)', disponible en cualquier contexto, incluida la biblioteca.
  - Móvil (Parcial): Interruptor 'Save to Database' solo en modo registro (CreateFoodMode.tsx:174, 358 is_quick_food = !saveToDatabase, 688-700); en modo biblioteca siempre se guarda.
- **Registrar un alimento en el diario desde la biblioteca** — Añadir al diario un alimento guardado directamente desde su ficha.
  - Web (Parcial): El menú de la tabla no tiene 'registrar' (Foods.tsx:417-511); solo tras añadir un alimento nuevo con 'Add New Food' se abre FoodUnitSelector con hora y tipo de comida para registrarlo hoy (Foods.tsx:838-848; useFoodDatabaseManager.ts:202-247).
  - Móvil (Sí): FoodDetailScreen.tsx:564-579 botón 'Log Food' -> FoodEntryAdd para cualquier alimento (propio o no).
- **Detalle del impacto antes de eliminar** — Mostrar en cuántas entradas del diario, comidas y planes se usa el alimento antes de borrarlo.
  - Web (Sí): DeleteFoodDialog.tsx:72-185: lista de entradas del diario (fecha, tipo de comida, enlace 'View'), contadores de componentes de comidas, entradas y plantillas de planes, aviso de uso por otros usuarios.
  - Móvil (Parcial): El impacto (getFoodDeletionImpact, FoodDetailScreen.tsx:276-280) solo decide qué opciones aparecen (useDeleteFood.ts:126-149); no muestra recuentos ni la lista de entradas.
- **Ver detalle de una comida** — Consultar ingredientes, nutrición y notas de una comida guardada.
  - Web (Parcial): Diálogo 'View Details' (MealManagement.tsx:505-508, 813-862): descripción, lista 'cantidad unidad - nombre' y notas; sin totales nutricionales ni navegación a sub-comidas.
  - Móvil (Sí): src/screens/MealDetailScreen.tsx: alternar 'Per serving'/'Total' (357-362), raciones e ingredientes (374-379), 'Foods in Meal' con macros (396-460), abrir comida vinculada (480), notas (499).
- **Comida dentro de comida (sub-comida vinculada)** — Usar una comida guardada como ingrediente de otra, con vista previa y cantidad.
  - Web (Sí): MealBuilder.tsx:1757 'Add Food or Meal to Meal', 1807 descripción, 1437-1446 badge 'Linked meal', 1832-1837 selección de cantidad de la sub-comida, LinkedMealPreviewDialog 1842.
  - Móvil (Parcial): Solo muestra/borra sub-comidas existentes (MealAddScreen.tsx:831; MealDetailScreen.tsx:443, 480). No se pueden añadir (comidas ocultas en modo meal-builder: FoodSearchScreen.tsx:155, 288, 796-804) ni editar (MealAddScreen.tsx:288-303: 'Edit this sub-meal ingredient in the web app').
- **Fechas de inicio y fin del plan** — Definir cuándo empieza y termina (opcional) un plan de comidas.
  - Web (Sí): MealPlanTemplateForm.tsx:495-515 campos 'Start date' y 'End date'; validación de fecha fin (415-418).
  - Móvil (Parcial): No hay selectores de fecha en MealPlanFormScreen.tsx; un plan nuevo empieza hoy sin fecha de fin (MealPlanFormScreen.tsx:272; src/utils/mealPlanForm.ts:73-74, 140-141); al editar se conservan las fechas existentes, que solo se muestran en la lista (MealPlansScreen.tsx:216-225).
- **Activar / desactivar plan** — Activar un plan para que rellene automáticamente el diario, o desactivarlo.
  - Web (Sí): Casilla 'Set active' en el formulario (MealPlanTemplateForm.tsx:525-535) y acción rápida 'Activate'/'Deactivate' en el menú de la tabla (MealPlanCalendar.tsx:346-361).
  - Móvil (Parcial): Solo con el interruptor 'Active plan' dentro del formulario (MealPlanFormScreen.tsx:577-592); la lista solo muestra el estado (MealPlansScreen.tsx:195-210).
- **Avisos de alérgenos en listas y al registrar** — Resaltar alérgenos seguidos en tarjetas/filas y avisar antes de registrar un alimento.
  - Web (Parcial): Insignias en la tabla de la biblioteca (Foods.tsx:332-335), tarjetas de búsqueda (FoodResultCard.tsx) y tarjetas del diario (pages/Diary/MealCard.tsx); sin banner de aviso al registrar (FoodUnitSelector no usa alérgenos).
  - Móvil (Sí): AllergenBadges en FoodLibraryRow.tsx:108, filas de búsqueda y SwipeableFoodRow; banner AllergenWarning en FoodEntryAddScreen.tsx:1582 (también tras escanear códigos).
- **Auto-escalar importaciones (OFF por 100 g y en línea)** — Escalar automáticamente los valores importados a la porción del producto.
  - Web (Sí): src/pages/Settings/PreferenceSettings.tsx:610-646 'Auto-scale OpenFoodFacts Imports' y 'autoScaleOnlineImports'.
  - Móvil (Parcial): Solo 'Adjust Open Food Facts Values' (FoodSettingsScreen.tsx:273-290); auto_scale_online_imports se lee pero no es editable (CreateFoodMode.tsx:102, AdjustNutritionMode.tsx:88).
- **Preferencias de nutrientes visibles en biblioteca y formulario** — Elegir qué nutrientes se muestran en la lista (quick_info) y en el formulario/detalle (food_database).
  - Web (Sí): NutrientDisplaySettings (SettingsPage.tsx:280) con vistas quick_info y food_database por plataforma desktop/mobile; consumidas en useFoodDatabaseManager.ts:42-52 y CustomFoodForm.tsx:163-170.
  - Móvil (Parcial): src/screens/NutrientDisplaySettingsScreen.tsx:34-41 solo food_database (aplicada a listas de nutrientes del detalle, FoodNutritionSummary.tsx:118) y report_tabular; quick_info no se ofrece y el formulario no la usa.
- **Distribución de calorías por tipo de comida (porcentajes)** — Repartir el objetivo calórico entre desayuno, comida, cena y snacks con bloqueos y reparto automático.
  - Web (Sí): src/components/MealPercentageManager.tsx (Goals: DailyGoals.tsx:399, EditGoalsForToday.tsx:420, GoalPresetDialog.tsx:418; Onboarding NutrientGoals.tsx:684): plantillas de distribución (157-180), 'distribute remaining', candado, deslizadores, total 100 %.
  - Móvil (Parcial): src/components/MealDistributionEditor.tsx en GoalsScreen.tsx:953: 'Distribute remaining evenly' (58), Lock/Unlock (83-87), porcentajes con PercentSlider, 'Total … (must be 100% to save)' (139-143); sin plantillas predefinidas.
- **Columnas de nutrientes en la lista de comidas** — La lista de comidas de la biblioteca muestra como columnas, y permite ordenar por ellos, los totales de los nutrientes elegidos en las preferencias; en móvil cada fila solo muestra las calorías.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Foods/MealManagement.tsx:166 (visibleNutrients) y 431 (una columna por nutriente visible en la tabla de comidas).
  - Móvil (Parcial): SparkyFitnessMobile/src/components/MealLibraryRow.tsx:116-127 solo muestra calorías y ración; MealsLibraryScreen.tsx no tiene columnas ni orden por nutrientes.
  - _Verificación: añadido durante la verificación_
- **Columnas de nutrientes en la lista de comidas** — La tabla de comidas guardadas muestra como columnas, ordenables, los totales de los nutrientes elegidos en la vista quick_info, calculados a partir de sus ingredientes.
  - Web (Sí): MealManagement.tsx:158-166 lee la preferencia quick_info por plataforma; 431-484 una columna por nutriente visible con el total de la comida (accessorFn suma ingredientes escalados), con enableSorting: true.
  - Móvil (Parcial): MealLibraryRow.tsx:116-120 solo muestra calorías (y porción); MealsLibraryScreen.tsx no tiene columnas ni orden configurable; quick_info no se ofrece en NutrientDisplaySettingsScreen.tsx:41.
  - Nota: Complementa la fila foods-list-nutrient-columns, que solo cubre la lista de alimentos.
  - _Verificación: añadido durante la verificación_

<details><summary>En paridad web ↔ móvil (43)</summary>

- Acceso a la biblioteca de alimentos, comidas y planes
- Búsqueda de alimentos en la biblioteca
- Filtro por propiedad (Todos / Míos / Familia / Público)
- Paginación de la lista de alimentos
- Insignias en filas: marca, privado/familia/público, alérgenos, favorito
- Miniatura de imagen y visor ampliado (lightbox)
- Ver detalle de un alimento
- Crear alimento manual (personalizado)
- Añadir a la biblioteca un alimento de un proveedor en línea
- Buscar por código de barras para añadir un alimento
- Editar alimento propio
- Campos básicos del formulario (nombre, marca, porción, unidad)
- Valores de nutrientes personalizados en el alimento
- Tamaños equivalentes de una variante
- Auto-escalado de nutrición y conversión de unidades compatibles
- Convertir unidad con IA
- Código de barras del alimento (campo, escaneo y conflicto)
- Gestionar imágenes del alimento
- Notas del alimento en markdown (con imágenes)
- Sincronizar entradas pasadas al editar (nutrición / fotos)
- Marcar alimento como favorito
- Compartir alimento públicamente / hacer privado
- Eliminar alimento con modos (ocultar / eliminar / eliminar con historial)
- Lista de comidas guardadas (búsqueda y filtro)
- Crear comida (constructor de comidas)
- Editar comida
- Datos de la comida: nombre, descripción, imágenes y notas
- Unidades y raciones de la comida
- Añadir, editar y quitar alimentos de la comida
- Totales nutricionales de la comida (por ración / total)
- Compartir comida públicamente
- Comida favorita
- Eliminar u ocultar comida
- Lista de planes de comidas
- Crear y editar plan de comidas semanal
- Duplicar plan de comidas
- Eliminar plan de comidas
- Gestión de nutrientes personalizados
- Preferencias de alérgenos
- Sincronizar alérgenos desde OpenFoodFacts
- Búsqueda en proveedores externos (proveedor único o 'Todos los proveedores')
- Proveedor por defecto de búsqueda y de código de barras, respaldo OFF
- Mostrar carbohidratos netos

</details>

### 2.5 Ejercicios, entrenamientos y running

#### Solo en la web (16)

- **Filtro por categoría, ordenación por columnas y paginación configurable** — Filtrar ejercicios por categoría, ordenar por nombre y elegir tamaño de página.
  - Web (Sí): src/pages/Exercises/Exercises.tsx:483-512 (Select de categorías EXERCISE_CATEGORIES), 609-622 (onSortingChange), 624-640 (paginación manual con pageSize)
- **Filtro 'Necesita revisión'** — Mostrar solo los ejercicios marcados para revisión.
  - Web (Sí): src/pages/Exercises/Exercises.tsx:548-553 (SelectItem value='needs-review')
- **Selección múltiple y borrado masivo de ejercicios, presets y planes** — Modo 'Seleccionar' con casillas, seleccionar todo y borrar en bloque (ejercicios en modo 'delete', sin borrar historial).
  - Web (Sí): src/pages/Exercises/Exercises.tsx:565-600 (toggleEditMode), 647-680 (BulkActionToolbar + BulkDeleteDialog); WorkoutPresetsManager.tsx:575-596; WorkoutPlansManager.tsx:430-455, 524
- **Filtro por equipamiento en el buscador** — Chips para filtrar los resultados de búsqueda por material (mancuernas, barra, máquina...).
  - Web (Sí): src/pages/Exercises/ExerciseSearch.tsx:271-290 (chips handleEquipmentToggle)
- **Filtro por mapa corporal (músculos)** — Silueta interactiva para filtrar ejercicios por grupo muscular.
  - Web (Sí): src/pages/Exercises/ExerciseSearch.tsx:292-297 (<BodyMapFilter>); src/pages/Exercises/BodyMapFilter.tsx
- **Subir, quitar y reordenar imágenes del ejercicio** — Adjuntar fotos/GIF al ejercicio personalizado, eliminarlas y reordenarlas arrastrando.
  - Web (Sí): src/pages/Exercises/AddCustomExerciseForm.tsx:377-410 (input type=file); src/pages/Exercises/EditExerciseDialog.tsx:355-460 (imágenes existentes/nuevas con drag & drop y botón eliminar)
- **Propagar cambios del ejercicio a entradas pasadas del diario** — Tras editar un ejercicio, preguntar si se actualiza el snapshot de todas las entradas pasadas.
  - Web (Sí): src/hooks/Exercises/useEditExerciseForm.ts:178-193 (updateExerciseEntriesSnapshot); src/pages/Exercises/Exercises.tsx:712-722 (ConfirmationDialog 'update all your past diary entries')
- **Reordenar series arrastrando y duplicar serie** — En el editor de preset/plan/registro, arrastrar series para cambiar su orden y duplicar una serie concreta.
  - Web (Sí): src/pages/Exercises/SortableWorkoutSet.tsx:69 (useSortable), 287 (onDuplicateSet)
- **Foto de la entrada y campos personalizados (clave/valor)** — Adjuntar una foto a una entrada de ejercicio y añadir detalles de actividad libres.
  - Web (Sí): src/pages/Diary/LogExerciseEntryDialog.tsx:578-600 ('Photo'); src/components/ExerciseActivityDetailsEditor.tsx:72-86 ('Field Name'/'Value'); EditExerciseEntryDialog.tsx:2090
- **Editor avanzado de telemetría de actividad** — Editar FC máx, respiración, velocidad, cadencia, potencia, TSS, dinámica de carrera, elevación, brazadas, pasos, pérdida de agua y carga; copiar JSON bruto.
  - Web (Sí): src/pages/Diary/EditExerciseEntryDialog.tsx:1091-1700 (secciones Heart Rate & Respiration, Speed/Cadence/Power, Running Dynamics, Elevation/Swimming, Steps…), 2057-2062 ('Copy Raw JSON')
- **Análisis cardio avanzado (web)** — Volumen cardio por intervalo, recorridos coincidentes, buscador de actividades por distancia y lista de actividades sincronizadas con mapas y desglose de sesión.
  - Web (Sí): src/pages/Reports/ExerciseReportsDashboard.tsx:895, 938-948 (CardioVolumeIntervalChart, MatchedCoursesList, ActivityInterrogationFinder, ActivityTelemetryList); WorkoutSessionBreakdown.tsx
- **Tabla de entradas de ejercicio en Informes y exportación CSV** — Tabla de ejercicios registrados en el rango y descarga en CSV.
  - Web (Sí): src/pages/Reports/ReportsTables.tsx:656 (onExportExerciseEntries); Reports.tsx:375-380 (exportExerciseEntries)
- **Importar base de datos de ejercicios (CSV)** — Añadir ejercicios reutilizables desde un CSV con mapeo de columnas.
  - Web (Sí): src/pages/Settings/DataImportSettings.tsx:186-196 (ExerciseImportCSV); SettingsPage.tsx:212
- **Importar historial de entradas de ejercicio (CSV)** — Importar entrenos pasados desde CSV con formato de fecha configurable y plantilla descargable.
  - Web (Sí): src/pages/Settings/DataImportSettings.tsx:200-212; src/pages/Exercises/ExerciseEntryHistoryImportCSV.tsx:216-268 (CsvFormatBar, 'Download Template')
- **Importar archivos .FIT** — Importar entrenos y datos de actividad desde archivos binarios .fit (Garmin, etc.) con tabla de resultados.
  - Web (Sí): src/pages/Settings/DataImportSettings.tsx:216-226; src/pages/Exercises/ExerciseImportFit.tsx:52-137
- **RPE (esfuerzo percibido) en actividades cardio** — Introducir un RPE 1-10 al registrar o editar una actividad cardio (carrera, bici, etc.).
  - **Cubierto en parte por la PR #3065 (fusionada):** La app del móvil sigue sin campo de RPE al registrar o editar una actividad de cardio. En iOS, una carrera o caminata grabada en el Apple Watch se puede valorar del 1 al 10 en el reloj, y las valoraciones hechas en Apple Health se leen con los entrenamientos sincronizados; la app la muestra como 'Effort n/10', pero no permite cambiarla. Android no tiene forma de añadirla: la sincronización con Health Connect no lee ninguna valoración y la app de Wear OS no la pide tras una carrera.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Exercises/CardioLog.tsx:111-127 (campo 'RPE' 1-10, visible también en modo simplificado), usado en LogExerciseEntryDialog.tsx:332-345 (guardado en sets[0].rpe) y EditExerciseEntryDialog.tsx:932
  - _Verificación: añadido durante la verificación_

#### Solo en el móvil (28)

- **Calculadora de calentamiento y 'Añadir calentamientos'** — Configurar la rampa de calentamiento (% y reps por serie, redondeo a discos y mancuernas) e insertar automáticamente las series de calentamiento en un ejercicio.
  - Móvil (Sí): src/screens/WarmupSettingsScreen.tsx:126-330 (Warmup Method, Add/Remove set, Plate rounding, Dumbbell rounding); WorkoutSettingsScreen.tsx:224-234; ActiveWorkoutOverflowSheet.tsx:121 y WorkoutFormExerciseList.tsx:696-709 ('Add warm-ups')
- **Descanso por defecto configurable** — Elegir el descanso entre series que se aplica a los ejercicios nuevos.
  - Móvil (Sí): src/screens/WorkoutSettingsScreen.tsx:104-131 ('Default rest period' con RestPeriodSheet)
- **Ajustes de sonido del entreno** · _Difiere iOS/Android_ — Activar sonido al terminar el descanso, sonar en modo silencio y bajar la música de otras apps durante pitidos/avisos de voz.
  - Móvil (Sí): src/screens/WorkoutSettingsScreen.tsx:134-202 ('Rest timer sound', 'Play through silent mode', 'Lower music during cues'); src/services/sounds.ts:30-90
  - iOS/Android: En iOS 'Play through silent mode' también suena con la app en segundo plano o la pantalla bloqueada (pista keep-alive; sounds.ts:37-45 isBackgroundRestChimeEnabled solo iOS); en Android solo suena en primer plano y en segundo plano se usa la notificación. Textos distintos en WorkoutSettingsScreen.tsx:160-168.
- **Notificación de fin de descanso con acción 'Completar serie'** — Aviso local cuando termina el descanso, con botón para completar la siguiente serie, y su interruptor en Notificaciones.
  - Móvil (Sí): src/services/notifications.ts:34-36 (categoría rest-complete y acción Complete Set), 385-432; src/screens/NotificationSettingsScreen.tsx:253-270 ('Rest Timer')
- **Mantener la pantalla encendida durante el entreno** — Impedir que la pantalla se apague mientras hay un entreno activo.
  - Móvil (Sí): App.tsx:1320 (<ActiveWorkoutKeepAwake />); src/screens/WorkoutSettingsScreen.tsx:204-222 ('Keep screen awake')
- **Barra de entreno activo minimizada** — Seguir usando la app con el entreno en curso: barra flotante con serie siguiente, pausar, saltar descanso, completar serie y finalizar.
  - Móvil (Sí): src/components/ActiveWorkoutBar.tsx:548-899 (Next Up, Pause, Skip rest, 'Done, start next set', Finish, Clear); App.tsx:1319; TabsLayout.tsx:366
  - _Verificación: corregido por verificación_
- **Estado del entreno de fuerza fuera de la app** · _Difiere iOS/Android_ — Mostrar el entreno activo (serie actual, descanso, progreso) en pantalla de bloqueo / notificación.
  - Móvil (Sí): src/services/workoutLiveActivity.ios.ts:60-68 (botones rest ±15, skip, complete-set) + WorkoutLiveActivityLayout.tsx; src/services/workoutLiveActivity.android.ts:21-40 + targets/android-workout-notification/.../WorkoutNotificationModule.kt:92-106; plugins/withWorkoutNotification.ts
  - iOS/Android: iOS: Live Activity (pantalla de bloqueo / Dynamic Island) interactiva con −15 s, +15 s, saltar descanso y completar serie. Android: notificación persistente con barra de progreso y cronómetro de cuenta atrás, sin botones de acción (solo abre la app).
- **Guardar entreno como preset y actualizar el preset de origen** — Convertir un entreno realizado en preset y, al terminar, ofrecer guardar en el preset los cambios hechos durante la sesión.
  - Móvil (Sí): src/screens/WorkoutCompleteScreen.tsx:290 ('Save as Preset'); WorkoutDetailScreen.tsx:828 ('Save as preset'); src/hooks/useWorkoutCompletePresetSync.ts (PresetUpdateOffer)
- **Continuar o reiniciar en vivo un entreno registrado** — Desde el detalle de un entreno, retomarlo en modo en vivo ('Empezar aquí' en una serie o 'Start Workout').
  - Móvil (Sí): src/screens/WorkoutDetailScreen.tsx:419-426 ('Start workout here'), 972 ('Start Workout')
- **Zonas de ritmo y carga de entrenamiento** — Zonas de ritmo personales calculadas de los últimos 90 días y carga aguda vs crónica de 4 semanas (también como tarjeta del Dashboard).
  - **Cubierto en parte por las PR #3154 y #3155 (fusionadas):** La web muestra ya los ritmos de entrenamiento de la última prueba de forma (que solo se puede hacer con el móvil) y una tarjeta de preparación y forma con la forma física, la fatiga y la frescura calculadas a partir de la misma carga por sesión, tarjeta que el móvil también tiene. La web sigue sin zonas de ritmo estimadas a partir de las carreras recientes y sin la carga aguda frente a crónica de 4 semanas, que el móvil muestra también en su Dashboard. En el móvil, las zonas de ritmo salen ahora de la última prueba de forma cuando la hay.
  - Móvil (Sí): src/components/exerciseStats/PaceZonesCard.tsx:35-50 (usePaceZones.ts); TrainingLoadCard.tsx:41-162 (useTrainingLoad.ts -> reportsApi.ts:66); TrainingLoadDashboardCard (DashboardScreen.tsx:48, 391)
- **Exportar ruta a GPX** — Compartir la ruta de una sesión como archivo GPX.
  - Móvil (Sí): src/screens/CardioSessionScreen.tsx:214, 311 ('Export GPX'); src/services/gpxExport.ts:1-4 (expo-sharing)
- **Aviso de nuevos récords al terminar** — Destacar récords batidos al finalizar un entreno de fuerza o una carrera.
  - Móvil (Sí): src/components/WorkoutCompletePrCard.tsx (WorkoutCompleteScreen.tsx:13); RunSummaryScreen.tsx:341 ('New personal records')
- **Grabación de actividad con GPS del teléfono** · _Difiere iOS/Android_ — Grabar caminata, carrera o bici en exterior o interior con mapa en vivo, tiempo, distancia, ritmo, elevación, FC, vueltas y parciales; pausar, reanudar, marcar vuelta, finalizar, guardar o descartar.
  - **Actualizado en la PR #3052 (fusionada):** La frecuencia cardiaca en directo durante una grabación con el móvil funciona ya también en Android con un reloj Wear OS conectado: el reloj la envía a la pantalla de grabación y se guarda con la actividad, como hace el Apple Watch en iOS. Sin reloj, ninguna de las dos plataformas muestra la frecuencia cardiaca. El aviso en segundo plano sigue siendo distinto: iOS muestra el indicador de ubicación y Android una notificación de servicio en primer plano.
  - Móvil (Sí): src/screens/RecordActivityScreen.tsx:1034-1065 (Walk/Run/Ride, Outdoor/Indoor), 1528-1830 (mapa, Time, Distance, Avg pace, Elevation, Heart rate, Laps, Splits, Lap, Pause/Resume, Finish, Discard, Save activity); AddSheet.tsx:403-414; services/gpsRecordingService.ts:1115-1135
  - iOS/Android: Disponible en ambas; en segundo plano iOS usa el indicador de ubicación y Android un servicio en primer plano con notificación (gpsRecordingService.ts:1130-1135). Ver filas de Live Activity, GPS del reloj, consejos de batería y distancia en interior.
  - _Verificación: corregido por verificación_
- **Opciones de la grabación: auto-pausa, cuenta atrás, intervalos, alertas de ritmo y avisos de voz** — Antes de empezar: auto-pausa, cuenta atrás, intervalos (correr/caminar o rápido/suave, por tiempo o distancia, rondas, calentamiento y vuelta a la calma), alerta de ritmo, rangos sugeridos, avisos de voz con actualizaciones periódicas y elección de voz.
  - Móvil (Sí): src/screens/RecordActivityScreen.tsx:1135-1400; components/recording/IntervalSetup.tsx:34-414; PaceBandCard.tsx:92-113; SuggestedRangesCard.tsx:72-160; CheckInCard.tsx:21-34 ('Spoken updates'); RecordingVoiceCard.tsx:24-54
- **Alerta de frecuencia cardiaca durante la grabación** · _Solo iOS_ — Avisar si la FC sale de un rango (más baja / más alta) mientras se graba.
  - **Actualizado en la PR #3052 (fusionada):** Android ofrece ya también la alerta de frecuencia cardiaca en cuanto se ha conectado un reloj Wear OS: durante una grabación con el teléfono, la app de Wear OS envía su frecuencia cardiaca al teléfono, que vibra (y avisa por voz si las indicaciones de voz están activadas) cuando se mantiene fuera del rango, y una carrera grabada en el reloj Wear OS avisa en el propio reloj, como hace el Apple Watch. Sigue necesitando un reloj en las dos plataformas y no se ofrece para la bici; la web sigue sin tenerla.
  - Móvil (Sí): src/screens/RecordActivityScreen.tsx:1199-1215 (solo si watchAvailable: 'Heart rate comes from the Apple Watch'); HeartRateBandCard.tsx:83-105
  - iOS/Android: Requiere Apple Watch emparejado (modules/watch-connectivity solo declara plataforma ios en expo-module.config.json); en Android no se muestra.
- **Grabar con el GPS del Apple Watch y seguirlo en el teléfono** · _Solo iOS_ — Elegir 'Watch GPS' como fuente y ver la sesión del reloj en vivo en el móvil ('En tu reloj') con pausa, finalizar, auto-pausa y avisos.
  - **Cubierto en parte por las PR #3052, #3065, #3069, #3090 y #3127 (fusionadas):** Android ofrece ya la misma elección del dispositivo con el que grabar en cuanto se ha conectado un reloj Wear OS: una caminata o una carrera, al aire libre o en cinta, se graba en la app de Wear OS con sus propios sensores y se sigue en directo en el teléfono, con pausa, finalización, pausa automática y alertas de ritmo y de frecuencia cardiaca. Después, el teléfono la guarda sin mapa, parciales ni vueltas, porque descarta los puntos GPS y las marcas de vuelta que envía la app de Wear OS. A diferencia del Apple Watch, la app de Wear OS tampoco puede seguir una ruta guardada (el teléfono sigue ofreciéndola, pero el reloj la ignora), no tiene comba en interior, no pide valorar el esfuerzo al terminar y no envía el número de pasos para la cadencia y la zancada.
  - Móvil (Sí): src/screens/RecordActivityScreen.tsx:261-269, 1073-1127 ('Record with' Phone GPS / Watch GPS); src/screens/WatchRunLiveScreen.tsx:64-201; App.tsx:611
  - iOS/Android: Depende de WatchConnectivity (solo iOS); no hay soporte Wear OS.
- **Estado de la grabación en pantalla de bloqueo** · _Solo iOS_ — Ver tiempo, distancia y ritmo de la grabación fuera de la app y controlarla.
  - Móvil (Sí): src/services/runLiveActivity.ios.ts (+ RunLiveActivityLayout.tsx:50-117, botones run-toggle y run-lap 56-57); src/services/runLiveActivity.ts:1-13 (Android: funciones vacías)
  - iOS/Android: iOS: Live Activity con botones Pausar/Reanudar y Vuelta. Android: sin Live Activity; solo la notificación de servicio en primer plano con título y texto (gpsRecordingService.ts:1111-1135), sin controles.
  - _Verificación: corregido por verificación_
- **Consejo para grabar con la pantalla apagada** · _Solo Android_ — Aviso para poner la app en batería 'Sin restricciones' y enlace a pasos por fabricante (dontkillmyapp).
  - Móvil (Sí): src/screens/RecordActivityScreen.tsx:1443-1466 (Platform.OS === 'android' && !indoor)
  - iOS/Android: Solo se muestra en Android en actividades al aire libre.
- **Distancia en interior por pasos y corrección de cinta** · _Difiere iOS/Android_ — Estimar la distancia de caminatas/carreras en interior con el podómetro, calibrar la zancada y corregir después con la cifra de la cinta.
  - Móvil (Sí): src/screens/RunSummaryScreen.tsx:296-327 ('Treadmill distance', Update); src/services/stepCounter.ts:35-90; strideCalibration.ts; hooks/useIndoorDistanceEstimate.ts
  - iOS/Android: Android guarda el contador de pasos del hardware al empezar y lo resta al final (un reinicio lo invalida) (stepCounter.ts:43-77); iOS consulta el historial del podómetro para la ventana al terminar (stepCounter.ts:80-88).
- **Resumen tras guardar la actividad grabada** — Estadísticas, nuevos récords, progreso del programa (repetir o saltar sesión), mapa, ritmo, vueltas/parciales y valoración del esfuerzo.
  - Móvil (Sí): src/screens/RunSummaryScreen.tsx:187-548 (EffortScale, RouteMap, PaceChart, 'Repeat this workout', 'Skip the next workout', 'View program')
- **Programas de entrenamiento de carrera** — Catálogo de programas, iniciar con fecha de primera sesión, cambiar de programa, progreso, guía y ritmo de referencia.
  - **Cubierto en parte por las PR #2948, #3052, #3109, #3144 y #3154 (fusionadas):** La web tiene ahora una página de programas de entrenamiento, a la que se llega desde Ejercicios, con los programas integrados y sus versiones de 3 o 4 carreras a la semana, la fecha del primer entreno al empezar, el cambio de programa con confirmación, la opción de empezar planes creados en el móvil, la tarjeta del programa (progreso, activarlo o pausarlo, marcar el entreno como hecho, saltarlo, empezar de nuevo, elegir otro entreno, días de carrera, primer entreno y fecha objetivo) y un calendario mensual; no está disponible al actuar en nombre de un familiar. Siguen siendo solo del móvil la guía del programa, la tarjeta de ritmo de referencia, crear, personalizar o editar planes, planificar una carrera, grabar el entreno y las tarjetas para reajustar el plan, los objetivos de carrera y las pruebas de forma física. El interruptor de esa tarjeta para usarla también en el reloj aparece ahora en Android, como 'Also use on my Wear OS watch', un texto aún sin traducir a ningún otro idioma.
  - Móvil (Sí): src/screens/RunProgramsScreen.tsx:80-303, 418-446 (Start program, Switch, Customize, PaceReferenceCard); LibraryScreen.tsx:423 ('Training programs')
- **Calendario del programa** — Vista mensual con todas las sesiones del programa.
  - **Cubierto en parte por la PR #2948 (fusionada):** La web tiene ya el calendario del programa como vista mensual en la página de programas de entrenamiento: días marcados como hecho, siguiente o previsto, los entrenos de cada día con sus minutos y su estado, la fecha de fin frente a la fecha objetivo, una lista de próximos entrenos y la misma propuesta de ponerse al día saltando entrenos. A diferencia del móvil, desde el calendario de la web no se puede abrir un entreno para ver sus pasos, lo duro que resultó o la carrera, ni empezarlo; en la web el siguiente entreno, incluso uno ya hecho, se elige en una lista de la tarjeta del programa.
  - Móvil (Sí): src/screens/RunProgramCalendarScreen.tsx; RunProgramsScreen.tsx:290-293 ('Open the program calendar'); components/recording/ProgramMonthGrid.tsx
- **Planificar una carrera** — Generar un plan para media maratón o maratón según nivel, fecha de carrera y días disponibles.
  - Móvil (Sí): src/screens/RunProgramRaceScreen.tsx:87-411
- **Planes de carrera personalizados** — Crear/editar planes con sesiones y pasos (calentamiento, fácil, trabajo, vuelta a la calma), objetivo de ritmo y FC, mover, duplicar y eliminar.
  - **Cubierto en parte por la PR #2948 (fusionada):** La página Programas de entrenamiento de la web muestra en 'Tus planes' los planes creados en la app móvil y permite iniciar uno y seguirlo como cualquier programa. Crear y editar planes (entrenamientos, pasos, objetivos de ritmo y de frecuencia cardiaca, mover, duplicar y borrar) sigue siendo solo del móvil.
  - Móvil (Sí): src/screens/RunProgramEditScreen.tsx:67-627
- **Sesión del programa: detalle, banner en el diario y esfuerzo** — Ver la sesión del día, banner 'Siguiente / Programado hoy' en el diario, iniciarla grabando y valorar el esfuerzo de la última sesión.
  - **Cubierto en parte por las PR #2948, #3052 y #3065 (fusionadas):** El Diario de la web muestra ya el entreno del programa en la tarjeta de Ejercicio (programado para hoy, o el siguiente si no hay días de carrera elegidos, los dos con un botón para marcarlo como hecho; programado en días posteriores) con un enlace al programa, pero la web sigue sin detalle del entreno, no permite empezarlo como grabación y no tiene valoración del esfuerzo. En el móvil un entreno del programa se puede hacer ya también con un reloj Wear OS; una carrera con el Apple Watch toma el esfuerzo de la valoración hecha en el reloj, mientras que las carreras con Wear OS y las grabaciones con el teléfono se siguen valorando en la app.
  - Móvil (Sí): src/screens/RunProgramWorkoutScreen.tsx; components/recording/RunProgramBanner.tsx:175-178 (DiaryScreen.tsx:56); RunEffortPrompt.tsx:48-75
- **Entreno de fuerza en el Apple Watch** · _Solo iOS_ — El reloj refleja el entreno del teléfono: registrar series (doble toque o corona), descanso, RPE, editar ejercicios/series, iniciar un preset guardado desde el reloj y enviar FC en vivo al teléfono.
  - **Actualizado en las PR #3052 y #3065 (fusionadas):** Wear OS admite ahora también entrenos de fuerza: sigue un entreno empezado en el móvil o empieza una plantilla o el entreno programado para hoy, registra cada serie con la corona giratoria, +/− o un teclado, lleva un temporizador de descanso con +15 s y Skip, pide un RPE opcional, añade, borra o cambia el tipo de las series, añade, borra o salta ejercicios, termina o descarta el entreno y pregunta si actualizar la plantilla, muestra avisos de nuevo récord y envía la frecuencia cardiaca en directo al móvil. Siguen siendo solo del Apple Watch el doble toque para registrar una serie, la escala de RPE completa de 1 a 10 (Wear OS ofrece de 5 a 10), el volumen, la frecuencia cardiaca máxima y la valoración del esfuerzo en el resumen, y guardar el entreno en una app de salud.
  - Móvil (Sí): targets/watch/Presentation/WorkoutView.swift:234-1982; src/hooks/useWatchWorkoutBridge.ts, useWatchWorkoutStart.ts:27-35, useWatchWorkoutEdit.ts:29-31, useWatchPlanSync.ts:32-35, useWatchSetTargetsSync.ts:115; FC en vivo en ActiveWorkoutExerciseCard.tsx:1484-1500 (stores/liveHeartRateStore.ts)
  - iOS/Android: Solo Apple Watch (target watchOS y módulo watch-connectivity solo iOS).
- **Carrera/caminata autónoma en el Apple Watch** · _Solo iOS_ — Iniciar cardio en el reloj, seguir una sesión del programa, alertas de ritmo/FC, voz y auto-pausa; la actividad se guarda en el diario al sincronizar.
  - **Cubierto en parte por las PR #3052, #3065, #3069, #3090 y #3127 (fusionadas):** Wear OS graba ahora también carreras y caminatas por su cuenta: al aire libre con el GPS del reloj o en interior, libres o siguiendo el entreno del programa o un plan de intervalos, con avisos de ritmo y de frecuencia cardiaca, pausa automática, avisos por voz, vueltas y corrección de la distancia en cinta; el móvil también puede iniciarlas en el reloj, las sigue en directo y las guarda en el diario, pero sin mapa, parciales ni vueltas, porque descarta los puntos GPS y las marcas de vuelta que envía la app de Wear OS. Siguen siendo solo del Apple Watch seguir una ruta guardada (en Android el móvil sigue ofreciéndola, pero la sesión de Wear OS la ignora y enviarla al reloj con Send to watch da error), la comba (Jump Rope), ajustar los rangos de los avisos en el reloj (Wear OS usa los últimos fijados en el móvil o unos por defecto), terminar los tramos de distancia al cubrirla (Wear OS usa su tiempo previsto), valorar el esfuerzo al acabar, el recuento de pasos del que salen la cadencia y la zancada, y guardar el entreno en una app de salud.
  - Móvil (Sí): targets/watch/Presentation/WorkoutView.swift:2118-2333 ('Follow a plan', 'Alerts'); WatchRunView.swift:29-201; src/hooks/useWatchRunBridge.ts:29-33; services/watchRunQueue.ts
  - iOS/Android: Solo Apple Watch.
- **Ajustes del Apple Watch para entrenos** · _Solo iOS_ — Doble toque para registrar serie, pedir RPE tras cada serie, entrada por teclado o Digital Crown y orden de páginas.
  - **Actualizado en la PR #3052 (fusionada):** Android muestra ahora una fila Wear OS en Ajustes en cuanto un reloj Wear OS se ha conectado al móvil; abre la misma pantalla, titulada Wear OS, con los ajustes que aplica la app de Wear OS: pedir el esfuerzo (RPE) tras cada serie, redactado para su escala de 5 a 10, el orden y la visibilidad de las páginas y los nutrientes de la página de objetivos. El doble toque para registrar una serie y la elección entre teclado o Digital Crown siguen siendo solo de iOS, porque Wear OS no tiene doble toque y ofrece siempre un teclado y la corona giratoria. El texto de ayuda del RPE para Wear OS está en inglés en todos los idiomas.
  - Móvil (Sí): src/screens/WatchSettingsScreen.tsx:124-243; visible solo con reloj emparejado (SettingsScreen.tsx:53-55, 368-376)
  - iOS/Android: Solo se muestra en iOS con Apple Watch emparejado.

#### En ambos, con diferencias (11)

- **Ficha de detalle del ejercicio** — Vista dedicada con resumen (mejor marca, última marca, kcal/h, equipamiento, músculos, nivel/fuerza/mecánica/fuente), pestaña Historial y pestaña 'Cómo hacerlo' con carrusel de imágenes y visor a pantalla completa; acciones Iniciar entreno / Registrar.
  - Web (Parcial): No hay página de detalle: la información se ve expandiendo el ítem de búsqueda (src/pages/Exercises/ExerciseSearchListItem.tsx:200-265) o en el diálogo de edición; visor de imágenes en el reproductor (WorkoutPlaybackExercisesList.tsx:110)
  - Móvil (Sí): src/screens/ExerciseDetailScreen.tsx:345-362 (pestañas Summary/History/How to), 494-515 (ImageLightbox), 722-990 (instrucciones, descripción, Best/Last 787-807, detalles), 995-1006 (Start Workout / Log Exercise)
  - Nota: La web no muestra 'mejor/última marca' por ejercicio fuera de Informes.
- **Reproductor de instrucciones con lectura en voz alta** — Modal que recorre las instrucciones paso a paso con imágenes y narración TTS, con elección de voz y silencio; botón 'leer instrucciones en voz alta' en resultados de búsqueda.
  - Web (Sí): src/pages/Diary/ExercisePlaybackModal.tsx:51-499 (speechNarrator, selector de voz 446); abierto desde ExerciseEntryDisplay.tsx:388-403 ('Play Instructions'); ExerciseSearchListItem.tsx:74, 251-265 ('Read instructions aloud')
  - Móvil (Parcial): No hay reproductor independiente: la pestaña 'How to' (ExerciseDetailScreen.tsx:722) muestra texto sin voz; las instrucciones solo se leen dentro del modo guiado ('Replay instructions', ActiveWorkoutGuidedCard.tsx:141; useGuidedWorkout.ts:401)
- **Editor de planes semanales o secuenciales** — Nombre, descripción, fechas de inicio/fin, activo, comportamiento del diario (preguntar/rellenar), días o sesiones y asignaciones.
  - Web (Sí): src/pages/Exercises/AddWorkoutPlanDialog.tsx:206-425 (Schedule Mode, Diary Behavior prompt/prefill 306, fechas 360-373, activo 397); 480-500 (asignaciones con SortableExerciseItem: ejercicios sueltos con series, copiar asignación, drag & drop)
  - Móvil (Parcial): src/screens/WorkoutPlanFormScreen.tsx:412-681 (mismos campos y 'Fill in my diary' 516-528), pero solo se pueden añadir presets completos: presetOptions 97-104 y renderAddWorkout 333-350; no se añaden ejercicios sueltos ni se editan series ni se copian/arrastran asignaciones
- **RPE/RIR por serie, columna de métrica y valores anteriores en vivo** — Introducir RPE o RIR en cada serie durante el entreno, cambiar la columna a Volumen / 1RM est. / 10RM est., ver la columna 'Prev' y rellenar desde la sesión anterior.
  - Web (Parcial): El reproductor en vivo no tiene RPE ni columna de métrica (WorkoutPlaybackSetRow.tsx sin rpe); el RPE solo se puede introducir en el editor de series al registrar/editar (SortableWorkoutSet.tsx:197-210, SetHeader.tsx:64)
  - Móvil (Sí): src/components/ActiveWorkoutSetRow.tsx:950 ('Fill set from previous'), 1252-1253 (RIR/RPE); ActiveWorkoutExerciseCard.tsx:362-374, 1589-1637 ('Prev', 'Change metric column'); WorkoutMenus.tsx:70-78
- **Editar la estructura del entreno en vivo** — Durante la sesión: añadir ejercicio, reordenar, superseries, quitar ejercicio, limpiar series registradas, renombrar el entreno.
  - **Actualizado en la PR #3102 (fusionada):** Al sustituir un ejercicio, el móvil conserva ya las series si el nuevo es del mismo tipo (se mantienen los valores previstos y se borran las notas, el RPE/RIR y las marcas de serie completada y de récord) y, si no, deja una serie por defecto. El reproductor de entrenos de la web sigue teniendo solo Sustituir, que siempre deja el ejercicio con una serie por defecto, y sigue sin poder añadir, reordenar ni renombrar. Igual en iOS y Android.
  - Web (Parcial): Solo reemplazar ejercicio: src/pages/Diary/WorkoutPlaybackPage.tsx:1167-1182; WorkoutPlaybackExercisesList.tsx:146-150. No hay añadir/reordenar/renombrar
  - Móvil (Sí): src/components/ActiveWorkoutHeader.tsx:144-219 (Add exercise, Reorder exercises, Rename workout, Gym/Location, Workout settings, End, Clear all logged sets, Discard); ActiveWorkoutOverflowSheet.tsx:91-142; ActiveWorkoutRail.tsx:265-282
- **Resumen al terminar el entreno** — Pantalla/diálogo final con estadísticas de la sesión.
  - Web (Parcial): src/pages/Diary/WorkoutPlaybackFinishDialog.tsx:52-108 (Duration, Calories, Sets, Volume, feedback y Done)
  - Móvil (Sí): src/screens/WorkoutCompleteScreen.tsx:8-20 (Hero, confeti, StatTiles, tarjeta WOD, tarjeta de PR, lista de ejercicios, feedback), 290-303 (Save as Preset, View Workout, Done)
  - Nota: La web no muestra récords nuevos, tarjeta WOD, lista de ejercicios ni acciones posteriores.
- **Gráficas por ejercicio y filtros avanzados** — Tendencia de volumen, peso máximo, 1RM estimado, mejor serie por rango de reps, reps vs peso, tiempo bajo tensión, PR y su progresión, análisis por serie; filtros por ejercicio, músculo y equipo, comparación con periodo anterior y agrupación día/semana/mes/año.
  - **Cubierto en parte por la PR #3008 (fusionada):** La ficha del ejercicio en el móvil tiene ahora también una tarjeta de esfuerzo en la pestaña de historial: el RPE medio de la última sesión, barras de hasta diez sesiones recientes y, en los ejercicios de peso y repeticiones, el mejor 1RM estimado contando las repeticiones que quedaban, junto al calculado solo con las repeticiones. Solo cuentan las series registradas con RPE. El móvil sigue sin ninguna de las gráficas de evolución por ejercicio de la web (volumen, peso máximo, evolución del 1RM, rangos de repeticiones, repeticiones frente a peso, tiempo bajo tensión, evolución de los récords, análisis por serie) y sin sus filtros ni su agrupación.
  - Web (Sí): src/pages/Reports/ExerciseReportsDashboard.tsx:363-681 (casos volumeTrend, maxWeightTrend, estimated1RMTrend, bestSetRepRange, repsVsWeightScatter, timeUnderTension, prVisualization, setPerformance, prProgression), 818-850 (Group by); src/components/ExerciseCharts/ExerciseDashboardFilters.tsx:89-178
  - Móvil (Parcial): Solo 'Best' y 'Last' en la ficha (ExerciseDetailScreen.tsx:787-807) y pestaña Historial; ExerciseStatisticsScreen.tsx solo tiene control de rango (ReportRangeControl) sin gráficas por ejercicio
- **Detalle de sesión cardio** · _Difiere iOS/Android_ — Mapa de ruta, gráficas de ritmo y FC, zonas de FC y estadísticas de una sesión.
  - **Cubierto en parte por las PR #3014, #3022, #3065, #3078 y #3135 (fusionadas):** El detalle de la sesión en el móvil muestra ya también la cadencia media, la longitud de zancada y la valoración del esfuerzo cuando la entrada las tiene, una tarjeta de parciales por km o por milla calculada a partir del recorrido GPS (barras de ritmo, desnivel y frecuencia cardiaca media) y botones para guardar el recorrido en Rutas y para compartir la sesión como imagen; la web y el móvil indican ya cómo se calcularon las zonas de frecuencia cardiaca. Al móvil le siguen faltando las gráficas de cadencia y de altitud y la tabla de vueltas del propio dispositivo, que la web sí tiene. En Android el mapa real sigue necesitando una compilación con clave de Google Maps.
  - Web (Sí): src/pages/Reports/ActivityReportVisualizer.tsx:1-38 (ritmo, FC, zonas, cadencia, elevación, mapa, tabla de vueltas) desde CardioSessionList; WorkoutGpsMap/WorkoutLapsTable en EditExerciseEntryDialog.tsx:65-66
  - Móvil (Parcial): src/screens/CardioSessionScreen.tsx:291-406 (Route, Pace, Heart Rate, Heart Rate Zones, estadísticas); sin gráficas de cadencia/elevación ni tabla de vueltas para sesiones sincronizadas
  - iOS/Android: El mapa real se dibuja siempre en iOS (Apple Maps); en Android solo si la build tiene clave de Google Maps, si no se muestra una línea simple (src/utils/routeMapSupport.ts:14-21).
- **Hora de inicio de la entrada de ejercicio** — Indicar (opcional) la hora de inicio al registrar o editar una entrada de ejercicio o al terminar un entreno en vivo, con botones 'Ahora' y 'Borrar'.
  - **Cubierto en parte por la PR #3052 (fusionada):** El móvil sigue sin campo de hora de inicio al registrar o editar un ejercicio; la hora solo se rellena automáticamente. Además de con las grabaciones GPS del móvil, ahora también se rellena con las caminatas y carreras grabadas en un reloj Wear OS en Android, no solo en el Apple Watch.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Diary/LogExerciseEntryDialog.tsx:284, 401-420 ('Start Time (optional)', Clear/Now); EditExerciseEntryDialog.tsx:308, 740, 1006; WorkoutPlaybackSummary.tsx:203-245 ('Start Time' en el entreno en vivo); WorkoutPlaybackPage.tsx:720, 1120
  - Móvil (Parcial): No hay campo de hora editable: ActivityAddScreen.tsx (campos 425-516), ActivityDetailScreen.tsx y WorkoutDetailScreen.tsx no lo muestran; entry_time solo se rellena automáticamente al guardar grabaciones GPS (services/gpsRecordingSave.ts:140) y carreras del reloj (services/watchRunSave.ts:69). El tipo CreateExerciseEntryPayload lo admite (services/api/exerciseApi.ts:379-380) pero ninguna pantalla lo pide.
  - Nota: El resto de la app móvil (comidas) sí tiene campo 'Time', lo que confirma que la omisión es específica de ejercicio.
  - _Verificación: añadido durante la verificación_
- **Tipos de serie disponibles** — Etiquetar cada serie con su tipo en el editor de presets/registro y durante el entreno en vivo.
  - Web (Sí): SparkyFitnessFrontend/src/constants/excerciseWorkoutSetTypes.ts:1-12 (10 tipos: Normal, Working Set, Warm-up, Drop Set, Failure, AMRAP, Back-off, Rest-Pause, Cluster, Technique), usados en SortableWorkoutSet.tsx:125 y WorkoutPlaybackSetRow.tsx:217
  - Móvil (Parcial): SparkyFitnessMobile/src/utils/workoutSession.ts:1806-1811 SET_TYPE_OPTIONS = warmup, normal, drop, failure; SetTypeMenu en components/WorkoutMenus.tsx:106-165 solo ofrece esos 4 (más 'Add N drop sets' y 'Delete set')
  - Nota: Ambos clientes tienen el generador 'Add N drop sets (-X%)' (web WorkoutPlaybackExercisesList.tsx:297-310; móvil WorkoutMenus.tsx:136-146 desde ActiveWorkoutScreen.tsx:1036).
  - _Verificación: añadido durante la verificación_
- **Calendario/mapa de calor de días de entrenamiento** — Calendario que colorea los días con entreno dentro del rango del informe.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Reports/ExerciseReportsDashboard.tsx:5, 868-876 (WorkoutHeatmap con rangeStart/rangeEnd del filtro); WorkoutHeatmap.tsx:15-34 (MonthCalendar, vista de 12 meses)
  - Móvil (Parcial): SparkyFitnessMobile/src/components/exerciseStats/TrainingConsistencyCard.tsx:8-47 (cuadrícula por semanas con etiquetas de mes), fija en 26 semanas y sin seguir el control de rango; no hay mapa de calor mensual que siga el rango del informe
  - Nota: Web también tiene TrainingConsistencyCard, pero sin cuadrícula; su calendario es WorkoutHeatmap.
  - _Verificación: añadido durante la verificación_

#### En ambos clientes, pero con diferencias iOS/Android (1)

- **Ruta dibujada sobre mapa** · _Difiere iOS/Android_ — Mostrar el recorrido GPS sobre un mapa real.
  - Web (Sí): src/pages/Reports/ActivityReportMap.tsx; src/components/Exercises/WorkoutGpsMap.tsx
  - Móvil (Sí): src/components/exerciseStats/RouteMap.tsx:12-15 (RouteTileMap con react-native-maps o RouteLine)
  - iOS/Android: iOS siempre con Apple Maps; Android solo si la build tiene GOOGLE_MAPS_ANDROID_API_KEY, si no se dibuja solo la línea sin mapa (src/utils/routeMapSupport.ts:8-21).

<details><summary>En paridad web ↔ móvil (40)</summary>

- Biblioteca de ejercicios: listado y búsqueda por texto
- Filtro por propiedad (Todos / Míos / Familia / Público)
- Secciones Recientes y Más usados en el buscador
- Búsqueda en proveedores externos e importación
- Crear ejercicio personalizado
- Editar ejercicio propio
- Duplicar ejercicio
- Compartir ejercicio públicamente / hacerlo privado
- Borrar ejercicio con análisis de impacto (Ocultar / Borrar / Borrar con historial)
- Alternativas sugeridas al reemplazar un ejercicio
- Sección Equipamiento
  - **Actualizado en la PR #3186 (fusionada):** Equipamiento ya no contiene solo zapatillas en ninguna de las dos: una sección de discos y barras recoge las barras y los discos que tienes, que usa la calculadora de discos, igual en iOS y Android. En la web esa sección se oculta mientras gestionas los datos de otra persona.
- Alta, edición y borrado de zapatillas
- Seguimiento de desgaste de zapatillas
- Asignar zapatilla a una actividad
- Presets de entrenamiento: listado y acciones
- Editor de presets (formatos WOD incluidos)
- Progresión / sobrecarga por ejercicio
- Superseries
- Reemplazar y duplicar ejercicio dentro de un preset/plan
- Planes de entrenamiento: listado y gestión
- Sesión del plan en el diario (Programado hoy / Siguiente)
- Sección de ejercicio del diario
- Registrar entreno pasado (series y repeticiones)
- Registrar actividad cardio manual
- Editar o borrar una entrada registrada
  - **Actualizado en la PR #3114 (fusionada):** Las dos permiten ya fijar cuántas calorías cuenta una entrada en el total del día (en blanco cuenta la estimación y 0 no cuenta nada), pero la web tiene el campo en el diálogo de edición de cualquier entrada, incluidas las sincronizadas y los ejercicios de un entreno, mientras que el móvil solo lo tiene al editar una actividad suelta registrada en la app, no en el detalle de un entreno ni en las entradas sincronizadas. Las dos permiten además vincular un entreno registrado en la app con uno sincronizado para que no se cuente dos veces. Igual en iOS y Android.
- Detalle de un entreno registrado
- Iniciar entreno en vivo
- Registro de series en vivo
- Temporizador de descanso
- Modo de entreno guiado
- Ajustes de entreno guiado
- HUD de intervalos y WOD
- Sugerencias adaptativas
- Datos de la sesión en vivo
- Feedback de la sesión
- Estadísticas de fuerza: resumen y músculos
- Estadísticas de cardio y tendencias de carrera
  - **Actualizado en las PR #3069 y #3154 (fusionadas):** Las dos siguen mostrando la lista de sesiones de cardio, la distancia semanal, la carrera más larga, la eficiencia y las estimaciones de tiempos de carrera. La vista Cardio del móvil añade una tarjeta de técnica de carrera que la web no tiene: la cadencia y la longitud de zancada de la última carrera, la media del periodo, la diferencia con las carreras anteriores y barras de hasta las 12 últimas carreras. La vista Cardio y GPS de la web añade una tarjeta de solo lectura con las pruebas de forma física (el último resultado, los ritmos de entrenamiento que fijó y hasta cuatro pruebas anteriores); el móvil muestra las pruebas en sus pantallas de programas de entrenamiento y de pruebas de forma física, y las zonas de ritmo de su vista Cardio siguen la última prueba.
- Constancia de entrenamiento y calendario de entrenos
- Récords personales de cardio
- Historial de un ejercicio
  - **Actualizado en la PR #3008 (fusionada):** La pestaña Historial del móvil muestra ya las series de cada sesión con su RPE, añade una tarjeta de esfuerzo (RPE medio de la última sesión, barras de hasta las diez últimas sesiones y un 1RM estimado con esfuerzo junto al calculado solo con las repeticiones) y abre el entreno del que viene cada sesión. Las últimas N entradas de la web siguen mostrando solo repeticiones y peso, duración y distancia por serie, sin RPE, resumen de esfuerzo ni enlace a la sesión. Igual en iOS y Android.

</details>

### 2.6 Check-in, medidas corporales y bienestar

#### Solo en la web (11)

- **Pantalla unificada de Check-In con pestañas** — Una sola página de Check-In con pestañas Mediciones, Ayuno y ánimo, Mindfulness, Sueño, Fotos y Síntomas, y un selector de fecha común.
  - Web (Sí): SparkyFitnessFrontend/src/App.tsx:390-393 (ruta 'checkin'); src/pages/CheckIn/CheckIn.tsx:115-195 (pestañas measurements/fasting/mindfulness/sleep/photos/symptoms)
  - Nota: Diferencia de arquitectura de navegación, no de capacidades.
- **Categorías personalizadas con frecuencia Hourly / All** — Guardar valores de categorías horarias (asociados a la hora actual) o de frecuencia libre.
  - Web (Sí): src/hooks/CheckIn/useCheckInLogic.ts:659-682 (isHourly → entry_hour/hourlyTimestamp)
- **Gestor de categorías personalizadas (crear, editar, eliminar)** — Ajustes > Bienestar > Custom Categories: crear, editar y eliminar categorías con nombre, unidad, tipo de dato (Numeric/Text) y frecuencia (All/Daily/Hourly).
  - **Actualizado en la PR #3194 (fusionada):** El móvil ya lo tiene en iOS y Android, en Ajustes > Custom Measurements: una lista con edición y borrado y un formulario con nombre, nombre visible, tipo de medida con las mismas unidades de selección rápida que la web, Numeric/Text y All/Daily/Hourly. A diferencia de la web, el móvil pide confirmación antes de borrar y deja cambiar el nombre y el tipo de dato de una categoría existente; además, muestra una categoría de hábito (boolean) como Numeric y la guarda como numérica si se edita. Los textos propios de las pantallas del móvil solo están en inglés en todos los idiomas incluidos, mientras que el gestor web está traducido.
  - Web (Sí): src/pages/Settings/SettingsPage.tsx:376-391; src/pages/Settings/CustomCategoryManager.tsx:199-382 (alta), 418-425 (editar/eliminar), 325-377 (tipo de dato y frecuencia)
- **Check-in en nombre de otro usuario (acceso familiar)** — Un delegado con permiso 'checkin' puede abrir el Check-In de otra persona y registrar mediciones, sueño, etc.
  - Web (Sí): src/layouts/MainLayout.tsx:156-160 (hasWritePermission('checkin')); src/pages/CheckIn/CheckIn.tsx:34-37 y SleepEntrySection.tsx:42-51 (activeUserId)
- **Crear estados de ánimo personalizados (nombre, emoji y color)** — En 'Manage moods', añadir una emoción propia eligiendo nombre, emoji y color.
  - Web (Sí): src/pages/CheckIn/MoodMeter.tsx:171-182 (createCustom), 296-350 ('Add a custom mood')
- **Mostrar u ocultar estados de ánimo en el selector** — Ocultar emociones predefinidas o personalizadas en el selector (preferencia guardada en el servidor).
  - Web (Sí): src/pages/CheckIn/MoodMeter.tsx:165-170 (toggleHidden → updatePrefs), 357-365, 455-470; src/api/CheckIn/moodService.ts:58-65
- **Eliminar un estado de ánimo personalizado (con opción de purgar el historial)** — Borrar una emoción propia y, opcionalmente, quitarla también de todas las entradas pasadas.
  - Web (Sí): src/pages/CheckIn/MoodMeter.tsx:475-520 (AlertDialog + checkbox 'Also remove it from all past entries')
- **Registro manual de sueño (varias sesiones por día)** — Introducir la hora de acostarse y de levantarse, añadir más sesiones de sueño y guardar.
  - Web (Sí): src/pages/CheckIn/SleepEntrySection.tsx:268-365 (Bedtime/Wake Time, 'Add Another Sleep Session', 'Save Sleep')
- **Editor de línea de tiempo de fases del sueño** — Pintar fases (despierto, REM, ligero, profundo) arrastrando sobre la línea de tiempo, con botón Borrar y leyenda de colores.
  - Web (Sí): src/pages/CheckIn/SleepTimelineEditor.tsx:95-236 (arrastre), 444-484 (botones de fase y Clear), 509-512 (solo eventos de ratón)
  - Nota: El editor web solo responde a eventos de ratón, sin soporte táctil.
- **Editar y eliminar registros de sueño existentes** — Modificar la hora de acostarse y de levantarse y las fases de una entrada existente, o borrarla.
  - Web (Sí): src/pages/CheckIn/SleepEntrySection.tsx:370-470 (Edit/Save/Cancel/Delete por entrada), 488-525
- **Importación CSV de datos de salud y check-in** — Importar desde CSV mediciones, sueño, constantes vitales, actividad, hidratación y ánimo, con plantilla descargable, tabla editable (añadir filas, borrar) e importación.
  - Web (Sí): src/pages/Settings/DataImportSettings.tsx:170-182; src/pages/CheckIn/HealthDataImportCSV.tsx:196-458; src/constants/healthDataImport.ts:76-330 (categorías measurements/sleep/vitals/activity/hydration/mood)

#### Solo en el móvil (20)

- **Resumen de mediciones del día en el Diario** — Tarjeta en el Diario con las mediciones del día seleccionado; al tocarla se abre el editor.
  - Móvil (Sí): src/screens/DiaryScreen.tsx:745-754 (MeasurementsSummary → navigate('MeasurementsAdd')); src/components/MeasurementsSummary.tsx:86-228
- **Historial de fotos por ángulo con peso y variación** — Lista de sesiones de fotos por ángulo (de la más nueva a la más antigua) con el peso de ese día, la variación respecto a la anterior y un enlace para registrar el peso.
  - **Cubierto en parte por la PR #2965 (fusionada):** La web sigue sin la lista de historial, pero los diálogos Comparar y Time-lapse de la pestaña Fotos del Check-In ya llegan a las fotos antiguas de cada ángulo. El time-lapse recorre los días con foto del periodo elegido, cada uno con su peso o un enlace 'Registrar peso', y Comparar muestra lado a lado dos días con foto que elige la persona, con la variación de peso entre ellos. Solo el móvil muestra la lista de las siete últimas sesiones de un ángulo, de la más reciente a la más antigua, con la variación respecto a la anterior.
  - Móvil (Sí): src/screens/ProgressPhotosScreen.tsx:355-378 (PhotoDayWeight + 'since previous'), 485-510 (sección History con SegmentedControl de ángulo), 213-216 (registrar peso → MeasurementsAdd)
- **Comparar fotos de progreso (antes/después)** — Comparación lado a lado de dos días, con diferencia de peso, días transcurridos y selector de qué foto cambiar.
  - **Actualizado en las PR #2965 y #3190 (fusionadas):** La web ya lo tiene: Check-In > Fotos tiene un diálogo Comparar con un selector Frente/Espalda/Lateral y los paneles Antes y Después (por defecto, la primera y la última sesión de ese ángulo). Cada panel tiene un selector de fecha limitado a los días con ese ángulo y el peso de ese día o un enlace Registrar peso, con el cambio de peso y los días transcurridos debajo. Diferencias que quedan: en la web un panel abre la foto a tamaño completo sin el visor con zoom, en el móvil el ángulo se elige en la galería antes de abrir la comparación, y el margen superior del móvil depende ahora de si la pantalla dibuja su propia cabecera (Android, e iOS 26 con la navegación Liquid Glass desactivada), no de la plataforma.
  - Móvil (Sí): App.tsx:991-995 (ProgressPhotoCompare); src/screens/ProgressPhotoCompareScreen.tsx:259-297 (before/after, deltaBadge, daysApart, pickWhich)
- **Time-lapse de fotos de progreso** — Reproduce las fotos de un ángulo como time-lapse con rango (todo o personalizado), velocidad (lenta, normal, rápida), reproducir/pausar y fotograma anterior/siguiente.
  - **Actualizado en la PR #2965 (fusionada):** La web ya lo tiene: un botón Time-lapse abre un reproductor con un selector Frente/Espalda/Lateral y los mismos intervalos que el móvil (Últimos 30 días, Últimos 3 meses por defecto, Histórico y un rango personalizado; un intervalo con menos de dos fotos se amplía a todo el histórico). Tiene las mismas velocidades Lento/Normal/Rápido con fundido, reproducir/pausa, fotograma anterior/siguiente y las teclas de flecha, y muestra la fecha, el peso (o Registrar peso) y un contador de fotogramas. Las dos apps usan las mismas reglas de intervalos de @workspace/shared.
  - Móvil (Sí): App.tsx:996-1000; src/screens/ProgressPhotoTimelapseScreen.tsx:186-211 (rango), 288-300 (velocidad), 390-418 (controles), 451-454 (hoja de rango)
- **Visor de fotos a pantalla completa con zoom** — Abre una foto de progreso a pantalla completa con pellizco para ampliar y arrastre para desplazar, mostrando la fecha y el peso.
  - **Cubierto en parte por la PR #2965 (fusionada):** En la web, una foto Antes o Después del diálogo Comparar se abre ya a tamaño completo en una ventana, ajustada al 85 % de la altura de la pantalla. Sigue sin zoom con pellizco ni arrastre y no muestra la fecha ni el peso, que se quedan bajo el panel. Una foto en una casilla de Check-In sigue abriendo el selector de archivos.
  - Móvil (Sí): src/components/ProgressPhotoViewer.tsx:35-40 (pinch to zoom, drag to pan); usado en ProgressPhotosScreen.tsx:570, ProgressPhotoCompareScreen.tsx:316, CheckInPhotosSummary.tsx:166
- **Resumen de fotos en Diario y tarjeta 'Progress' en Dashboard** — Miniaturas de las fotos del día en el Diario y una tarjeta en el Dashboard con las últimas fotos y el peso, con acceso a 'View all' o 'Tap to add photos'.
  - Móvil (Sí): src/screens/DiaryScreen.tsx:758-764 (CheckInPhotosSummary); src/screens/DashboardScreen.tsx:834-841; src/components/ProgressPhotosCard.tsx:86-154
- **Tarjeta de ánimo en el Dashboard con tendencia de 7 días** — Tarjeta con el ánimo de hoy o '+ Log' y una mini tendencia de 7 días.
  - Móvil (Sí): src/screens/DashboardScreen.tsx:826-833; src/components/mood/MoodCard.tsx:75-118
- **Tarjeta de mindfulness en el Dashboard con accesos rápidos** — Tarjeta con los minutos de hoy, la última sesión, FC/HRV y botones Respirar, Temporizador y Registrar.
  - Móvil (Sí): src/screens/DashboardScreen.tsx:905-917; src/components/mindfulness/MindfulnessCard.tsx:120-282
  - _Verificación: verificadores en desacuerdo (se toma la lectura más conservadora)_
- **Tarjetas de Despertar, Siestas y Hora de dormir en el Diario** — Separa el sueño principal de las siestas y muestra cada parte como tarjeta que abre el detalle.
  - Móvil (Sí): src/screens/DiaryScreen.tsx:648,740-744; src/components/SleepCards.tsx:162-290 (WakeUpCard, NapsCard, BedTimeCard); src/hooks/useSleepDay.ts:30-64 (classifySleepDay)
- **Notificaciones de objetivo de ayuno y aviso previo** — Notificación local al alcanzar el objetivo y X minutos antes (según pre_end_alert_minutes), con un interruptor propio en Notificaciones.
  - Móvil (Sí): src/services/notifications.ts:482-575 (scheduleFastGoalNotification / scheduleFastPreEndNotification); src/components/FastingGoalReconciler.tsx; src/screens/NotificationSettingsScreen.tsx:277-290 ('Fasting Goals')
  - Nota: El flag eating_window_alert no lo consume ningún cliente; solo se guarda.
- **Acceso rápido 'Fasting' en el icono de la app** · _Solo iOS_ — Pulsación larga en el icono de la app → 'Fasting', que abre el detalle de ayuno.
  - **Actualizado en la PR #2989 (fusionada):** Android también muestra ya Ayuno al mantener pulsado el icono de la app (expo-quick-actions, con su propio icono adaptativo), y abre el detalle de ayuno igual que en iOS. El título sale de la misma cadena quickActions en las dos plataformas.
  - Móvil (Sí): src/hooks/useQuickActions.ts:44-46,119-121, 142 (Platform.OS !== 'ios' → return)
  - iOS/Android: Solo se registra en iOS; en Android no hay accesos directos de app.
- **Controles de Centro de Control y atajos de Siri para iniciar y terminar ayuno** · _Solo iOS_ — Controles 'Start fast' y 'End fast' (Centro de Control y pantalla de bloqueo) y AppIntents de Siri/Atajos 'Start fast' (1-72 h) y 'End fast' que funcionan sin abrir la app.
  - Móvil (Sí): targets/widget/Controls.swift:44-68 (StartFastControl, EndFastControl); targets/widget/ShortcutIntents.swift:370-410 (StartFastIntent, EndFastIntent)
  - iOS/Android: Extensión de widget de iOS; no hay equivalente en Android (targets/android-widget solo tiene el widget de calorías).
- **Atajo de Siri 'Log weight'** · _Solo iOS_ — AppIntent para registrar el peso (20-700) desde Siri o la app Atajos sin abrir SparkyFitness.
  - Móvil (Sí): targets/widget/ShortcutIntents.swift:338-366 (LogWeightIntent, openAppWhenRun=false)
  - iOS/Android: Solo iOS (App Intents).
- **Check-in de peso y % de grasa en Apple Watch** · _Solo iOS_ — Pantalla del reloj para introducir peso y % de grasa con la Digital Crown (o teclado), con aviso de valores atípicos y una vista de tendencias de peso y grasa después de guardar.
  - **Actualizado en la PR #3052 (fusionada):** La app de Wear OS ya lo tiene: una página Weight Check-In (corona giratoria, +/− o teclado numérico) con un paso opcional de % de grasa, el cambio desde el último registro con un aviso si el peso parece improbable y un botón Set Start para fijar un peso inicial mientras no hay historial. Su página Trend muestra los últimos 14 pesos con una media móvil de 7 registros, o la grasa corporal cuando hay dos lecturas, y se alterna con un toque o con la corona. A diferencia del Apple Watch, al guardar se queda en la página de registro en lugar de pasar a la tendencia, un cambio improbable de grasa corporal no genera aviso y no se abre por sí sola una primera entrada guiada.
  - Móvil (Sí): targets/watch/Presentation/CheckInEntryView.swift:1-60; TrendView.swift:5-25; App.tsx:202-211 (WatchCheckInGate → useWatchCheckInBridge → upsertCheckIn, src/hooks/useWatchCheckInBridge.ts:16,686-687)
  - iOS/Android: App de watchOS; en Android no hay app para Wear OS (modules/watch-connectivity solo tiene ios/).
- **Ayuno en Apple Watch y complicación de ayuno** · _Solo iOS_ — Página de ayuno en el reloj con tiempo transcurrido y restante, inicio con 16:8, 18:6 o 20:4 y fin con confirmación, más una complicación con el ayuno en curso.
  - **Cubierto en parte por la PR #3052 (fusionada):** La app de Wear OS tiene ya una página de ayuno (tiempo transcurrido y un anillo con la parte del objetivo cumplida, pero sin tiempo restante), botones para empezar 16:8, 18:6, 20:4 y OMAD, End Fast sin confirmación y una complicación de ayuno con las horas transcurridas. Empezar un ayuno desde Wear OS falla: el reloj envía la etiqueta ('16:8', 'OMAD') como id del preset, pero el móvil busca los presets por id ('16-8', '18-6', '20-4') y no tiene OMAD, así que rechaza la petición y no se guarda ningún ayuno (el reloj solo lo muestra hasta la siguiente actualización del móvil). Terminar un ayuno desde el reloj sí funciona.
  - Móvil (Sí): targets/watch/Presentation/FastingView.swift:18-116; targets/watch-widget/FastingComplication.swift; src/hooks/useWatchFastingBridge.ts:22-40
  - iOS/Android: Solo watchOS.
- **Pasos en Apple Watch y complicación de pasos** · _Solo iOS_ — Página de solo lectura con los pasos de hoy frente al objetivo, y una complicación de pasos.
  - **Actualizado en la PR #3052 (fusionada):** La app de Wear OS tiene ya una página Daily Steps con los pasos de hoy frente al objetivo en un anillo y los que faltan, además de una complicación de pasos. A diferencia del Apple Watch, que solo muestra la cifra que envió el móvil por última vez, Wear OS también sube la cifra con el sensor de pasos del propio reloj cuando este cuenta más.
  - Móvil (Sí): targets/watch/Presentation/StepsView.swift:3-20; targets/watch-widget/StepsComplication.swift
  - iOS/Android: Solo watchOS.
- **Tendencias de salud en el Dashboard (pasos, peso, sueño...)** — Carrusel de gráficos de pasos, peso (con línea de objetivo), sueño, hidratación, calorías y VO2 max, con rango de 7/30/90 días y una pantalla para reordenarlos u ocultarlos.
  - **Actualizado en las PR #3143 y #3155 (fusionadas):** El carrusel del móvil tiene ya un séptimo gráfico, Resting Heart Rate, con la frecuencia cardiaca en reposo diaria y su media y su mínimo–máximo en 7, 30 o 90 días; solo aparece si hay lecturas y se puede reordenar u ocultar como los demás. Sin VO2 max sincronizado en el periodo elegido, el gráfico de VO2 max muestra ahora una estimación a partir de las carreras registradas, con un título que indica que es estimada. La web sigue sin este carrusel; su tendencia de frecuencia cardiaca en reposo está en Informes.
  - Móvil (Sí): src/screens/DashboardScreen.tsx:842-897 (HealthTrendsPager + SegmentedControl + enlace a Reports); src/constants/healthTrends.ts:11-18; src/screens/HealthTrendsSettingsScreen.tsx:47-86
- **Sincronización automática de métricas corporales, sueño y pasos desde la tienda de salud del dispositivo** · _Difiere iOS/Android_ — Lee del almacén de salud del dispositivo peso, % de grasa, altura, TMB, masa magra, masa ósea, sueño, pasos, FC en reposo, HRV, SpO2, frecuencia respiratoria, estrés, etc., y los sube al check-in.
  - Móvil (Sí): src/HealthMetrics.ts:54-520 (definición de métricas con platforms); App.tsx:959-963 (Sync); src/screens/SyncScreen.tsx; src/services/healthConnectService.ts / .ios.ts
  - iOS/Android: iOS usa HealthKit y Android, Health Connect. Masa de agua corporal solo en Android (HealthMetrics.ts:505-518); Estrés solo en iOS (172-185); HRV y SpO2 usan tipos de registro distintos en cada plataforma (387-416, 606-646); iOS tiene entrega en segundo plano (src/services/healthkit/backgroundDelivery.ts).
- **Importación del historial de salud (backfill)** · _Difiere iOS/Android_ — Importar días anteriores desde la tienda de salud, con pausa, reanudación, volver a empezar y resumen de días importados.
  - Móvil (Sí): App.tsx:964-968; src/screens/ImportHistoryScreen.tsx:391-681
  - iOS/Android: En Android, Health Connect limita la lectura histórica diaria y la importación se reanuda sola más tarde (ImportHistoryScreen.tsx:471-476). En iOS hay un aviso propio si HealthKit no está disponible (461-468).
- **Ajustes del Apple Watch: reordenar y ocultar páginas (Check-in, Tendencia, Ayuno, Pasos…)** · _Solo iOS_ — Desde el teléfono, Ajustes > Apple Watch permite arrastrar para cambiar el orden en que se deslizan las páginas del reloj (entre ellas Check-in de peso, Tendencia, Ayuno y Pasos) y desactivar las que no se usan; el reloj respeta ese orden y oculta las desactivadas.
  - **Actualizado en la PR #3052 (fusionada):** Android muestra ya una fila Wear OS en Ajustes en cuanto se ha conectado un reloj Wear OS, y abre la misma pantalla: orden y visibilidad de las páginas (la app de Wear OS los respeta y mantiene la página de entrenamiento mientras se entrena), los nutrientes de la página de objetivos y el interruptor de RPE. El interruptor de doble toque para registrar una serie y la elección entre teclado numérico y Digital Crown para las series solo están en iOS, y la descripción del RPE para Wear OS (una escala de 5 a 10 en lugar de 1 a 10) solo está en inglés en todos los idiomas incluidos.
  - Móvil (Sí): src/screens/SettingsScreen.tsx:368-377 (fila 'Apple Watch' solo si hasPairedWatch); src/screens/WatchSettingsScreen.tsx:190-215 ('Pages', ReorderSwitchList 'Drag a page by its handle… Toggle a page off to hide it'); targets/watch/Presentation/ContentView.swift:28-62 (pages 'as the phone last arranged them') y 183-185 (shown() descarta páginas ocultas).
  - iOS/Android: Solo aparece con un Apple Watch emparejado; en Android no hay app de reloj (modules/watch-connectivity solo tiene ios/).
  - Nota: Afecta directamente a la disponibilidad de las funciones de reloj checkin-watch-checkin, checkin-watch-fasting y checkin-watch-steps.
  - _Verificación: añadido durante la verificación_

#### En ambos, con diferencias (10)

- **Valores de categorías de medición personalizadas (numéricas o de texto)** — Registrar valores de las categorías del usuario, con conversión de unidades y una nota opcional por categoría.
  - Web (Sí): src/pages/CheckIn/CheckInForm.tsx:427-534 (todas las categorías, UnitInput si la unidad es convertible, campo 'Notes (optional)' en 519-531)
  - Móvil (Parcial): src/screens/MeasurementsAddScreen.tsx:149-162 (solo frecuencia 'Daily'), 1271-1375 (una fila por categoría, sin campo de notas), 1814-1847 (sección colapsable 'More categories')
  - Nota: En móvil no hay notas por categoría y solo aparecen las categorías diarias.
- **Categorías personalizadas booleanas (Sí/No)** — Control Sí/No/Borrar para categorías de tipo boolean (por ejemplo, hábitos), mostrando el último valor.
  - Web (Parcial): src/pages/CheckIn/CheckInForm.tsx:494-517 (todo lo que no es 'numeric' se muestra como input de texto libre; no hay control Sí/No)
  - Móvil (Sí): src/screens/MeasurementsAddScreen.tsx:1265-1269,1278,1314-1320 (YesNoClearControl), 1350-1363 ('Last: Sí/No')
  - Nota: Las categorías booleanas (hábitos) se crean en el servidor (SparkyFitnessServer/models/habitRepository.ts:3); el gestor web solo ofrece los tipos Numeric/Text.
- **Lista de 'Mediciones recientes' con borrado por entrada** — Lista de las últimas mediciones estándar y personalizadas con hora y fecha, y un botón de papelera en cada una.
  - Web (Sí): src/pages/CheckIn/CheckIn.tsx:269-282; src/pages/CheckIn/RecentActivity.tsx:77-258 (Trash2 en 215-229); useCheckInLogic.ts:546-620 (borrado sin confirmación)
  - Móvil (Parcial): No hay lista de historial reciente. Solo se puede borrar vaciando campos del día en MeasurementsAddScreen.tsx:1094-1135 (pide confirmación 'Clear N measurements?') o con la papelera de la categoría (1330-1345)
- **Ánimo general (escala 0-100)** — Indicar el ánimo general del día en la escala de 0 a 100 con 9 caras emoji.
  - **Actualizado en las PR #3013, #3016 y #3018 (fusionadas):** El ánimo se indica ahora en cada check-in y no una vez al día: la web y el móvil registran varios check-ins al día, cada uno con su hora y un ánimo opcional que se puede quitar. El ánimo del día es la media de los ánimos registrados a mano, o el de Garmin o el importado si no hay ninguno. El selector sigue siendo distinto: el control deslizante de la web también se detiene a medio camino entre las nueve caras, y el móvil solo ofrece las nueve caras.
  - Web (Sí): src/pages/CheckIn/MoodMeter.tsx:231-248 (Slider continuo 'Overall mood'), 250-274 (9 emojis que fijan el valor)
  - Móvil (Parcial): src/screens/MoodLogScreen.tsx:200-237 (solo 9 caras que guardan un valor representativo; no hay slider continuo)
  - Nota: En móvil solo se pueden elegir 9 niveles fijos; en web, cualquier valor intermedio.
- **Lista detallada de etapas metabólicas** — Lista de todas las etapas del ayuno con rango de horas, descripción y la etiqueta 'ahora' en la etapa actual.
  - Web (Parcial): Solo un tooltip al pasar el ratón por cada segmento: src/pages/Fasting/FastingZoneBar.tsx:126-152
  - Móvil (Sí): src/screens/FastingDetailScreen.tsx:215-285 (METABOLIC_STAGES con rangeLabel, descripción y 'now')
- **Editar un ayuno registrado** — Modificar un ayuno pasado: protocolo, nombre del protocolo, hora de inicio, de fin y de fin objetivo.
  - Web (Sí): src/pages/Fasting/EditFastDialog.tsx:136-244 (Protocol, Protocol Name, Start, End, Target End Time); se abre desde RecentActivity.tsx:232-240
  - Móvil (Parcial): src/components/FastingEditSheet.tsx:309-331 (solo inicio y fin); se abre tocando el historial (FastingDetailScreen.tsx:111,344)
  - Nota: En móvil no se puede cambiar el protocolo ni la hora objetivo.
- **Tarjeta de ayuno en el Dashboard** — Tarjeta con el estado del ayuno o de la ventana de alimentación, el progreso, inicio rápido (hoja de protocolo) y acceso al detalle.
  - Web (Parcial): El widget equivalente HomeDashboardFasting está en la pestaña 'Fasting & Mood' de /checkin (CheckInTopRow.tsx:34), no en una portada
  - Móvil (Sí): src/screens/DashboardScreen.tsx:806-808; src/components/FastingCard.tsx:92-311
- **Dashboard de inicio con tarjetas de bienestar** — Pestaña de inicio con tarjetas apiladas (ayuno, ánimo, fotos, mindfulness, tendencias de salud, etc.) para la fecha elegida.
  - Web (Parcial): La ruta raíz web es el Diario (App.tsx:388); no hay un dashboard de bienestar
  - Móvil (Sí): src/screens/DashboardScreen.tsx:566-917; src/components/TabsLayout.tsx:276-283 (pestaña Dashboard)
  - _Verificación: corregido por verificación_
- **Personalizar el Dashboard (reordenar y ocultar tarjetas)** — Ajustes > Dashboard Settings: arrastrar para reordenar y desactivar tarjetas (ayuno, ánimo, fotos de progreso, mindfulness, tendencias de salud, etc.).
  - Web (Parcial): No aplica
  - Móvil (Sí): src/screens/SettingsScreen.tsx:314; src/screens/DashboardSettingsScreen.tsx:441-490; src/constants/dashboardCards.ts:3-19
  - _Verificación: corregido por verificación_
- **Accesos de registro rápido desde el menú '+'** — El menú '+' abre directamente Mediciones, Fotos de progreso, Ánimo, Mindfulness y Sincronizar datos de salud.
  - Web (Parcial): src/layouts/MainLayout.tsx:114-123: el menú de añadir solo lleva a la página Check-In completa
  - Móvil (Sí): src/components/AddSheet.tsx:266 (Measurements), 429 (Progress photos), 452 (Mood), 459 (Mindfulness), 470 (Sync Health Data)

<details><summary>En paridad web ↔ móvil (29)</summary>

- Selección de fecha con marcas de días con fotos de progreso
- Registro de peso
- Registro de altura (cm o pies/pulgadas)
- Perímetros corporales: cuello, cintura y cadera
- Pasos diarios manuales
- Composición corporal de báscula: masa muscular, masa ósea, % de agua y TMB
- Cálculo del % de grasa corporal (Marina de EE. UU. / IMC) con 'Usar recientes'
- Botón 'Usar último' para reutilizar el valor anterior
- Fotos de progreso: frontal, espalda y lateral (subir, reemplazar, eliminar)
- Etiquetas de estado de ánimo de selección múltiple
- Notas del estado de ánimo
- Evolución del ánimo y emociones más frecuentes
- Minutos de mindfulness del día y número de sesiones
- Respiración guiada (Box, 4-7-8, coherencia)
- Temporizador de meditación (5/10/15/20 min o abierto)
- Registro manual de una sesión de mindfulness
- Editar y eliminar sesiones de mindfulness
- Detalle de una noche de sueño
- Iniciar un ayuno (protocolo y hora de inicio)
- Anillo temporizador del ayuno activo
- Barra de zonas metabólicas
- Ventana de alimentación (cuenta atrás y barra)
- Indicador de ayuno calculado automáticamente desde las comidas
- Terminar el ayuno con ajuste de horas
- Eliminar un ayuno
- Historial de ayunos
- Estadísticas rápidas de ayuno
- Informe de ayuno
- Ajustes de ayuno intermitente

</details>

### 2.7 Objetivos y onboarding

#### Solo en la web (31)

- **Macros por porcentaje de calorías** — Alternar 'Macros por: Gramos/Porcentajes', con validación de que la suma sea 100% y vista previa de los gramos resultantes (descontando la fibra).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Goals/DailyGoals.tsx:218-239 (RadioGroup), 276-323 (total y gramos), 126-145 (conversión al guardar); también EditGoalsForToday.tsx y GoalPresetDialog.tsx:204-330
- **Elegir qué nutrientes aparecen en el editor de objetivos** — Configurar (Ajustes > Visualización de nutrientes, grupo 'Goal') qué nutrientes y en qué orden aparecen al editar objetivos.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/NutrientDisplaySettings.tsx:75,108 (grupo 'goal'); consumido en src/pages/Goals/GoalsContent.tsx:119-145
- **Auto-cálculo de 'Azúcares añadidos' (nutriente personalizado)** — Calcular el límite de un nutriente personalizado llamado Added Sugar(s) cuya dirección sea Máximo, con el algoritmo elegido (OMS/AHA).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Goals/nutrientAutoCalculateHelpers.ts:8-39; NutrientAutoCalculate.tsx:73-90; algoritmo en pages/Settings/CalculationSettings.tsx:2085-2130
- **Plantillas de distribución por comida** — Plantillas predefinidas: Uniforme, Ayuno intermitente, Proteína por la mañana y Sin snacks.
  - Web (Sí): SparkyFitnessFrontend/src/components/MealPercentageManager.tsx:25-46,155-182 (Select desactivado si hay comidas personalizadas)
- **Editar objetivos solo para una fecha concreta (sin cascada)** — Desde el diario, editar los objetivos de un día concreto (pasado o futuro) sin que afecte a los demás días.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Diary/NutritionSummaryCard.tsx:13,128 (botón 'Edit Goals') -> src/pages/Goals/EditGoalsForToday.tsx:479-561 (diálogo 'Edit Goals for {{date}}', cascade: false en 510, 'Save for this Date' en 448)
- **Restablecer los objetivos de un día a los valores por defecto** — Botón 'Reset to default' que reemplaza los objetivos de la fecha por DEFAULT_GOALS.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Goals/EditGoalsForToday.tsx:219-225 (onSave(DEFAULT_GOALS, true))
- **Peso objetivo (definir o borrar)** — Fijar o borrar el peso objetivo del perfil (target_weight) en kg o lbs.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Goals/GoalWeight.tsx:16-137 (validación hasta 999,99 kg, Guardar/Borrar; con st/lb se introduce en lbs); también paso 7 del onboarding (components/Onboarding/OnBoardingSteps.tsx:366-400)
- **Restablecer onboarding** — Reiniciar el estado del onboarding para volver a hacer el cuestionario inicial.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Goals/ResetOnboarding.tsx:6-53 (confirmación, useResetOnboarding y recarga); GoalsContent.tsx:159
- **Dirección de objetivo para nutrientes personalizados** — Fijar Mín/Máx/Rango en los nutrientes personalizados del usuario.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/NutrientGoalDirectionSettings.tsx:597-610 (secciones 'other' y 'custom')
- **Restablecer direcciones de objetivo** — Volver a la dirección predeterminada de un nutriente o restablecer todas ('Reset All' con confirmación).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/NutrientGoalDirectionSettings.tsx:445-450 (por nutriente), 636-660 (AlertDialog 'Reset All')
- **Evaluación del progreso según la dirección del objetivo** — Usar la dirección (mín/máx/rango) para juzgar y colorear el progreso en diario e informes.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Diary/NutritionSummaryCard.tsx:11 (useNutrientGoalPreferences); src/pages/Diary/DailyProgress.tsx; src/pages/Reports/NutritionPeriodSummary.tsx
  - Nota: Lo que se edita en móvil solo surte efecto al ver los datos en la web.
- **Selección del algoritmo de BMR** — Elegir la fórmula de metabolismo basal (Mifflin-St Jeor, Katch-McArdle, Cunningham, etc.).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:673-703 (Ajustes > Nutrición > Ajustes de cálculo)
- **Selección del algoritmo de grasa corporal** — Elegir la fórmula de estimación de grasa corporal.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:705-738
- **Unidad de energía (kcal / kJ)** — Elegir si la energía se muestra en kilocalorías o kilojulios.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:816-845; también conmutador en el plan del onboarding (components/Onboarding/PersonalPlanHeader.tsx:46-75)
- **Vista previa del cálculo en vivo** — Panel con BMR, gasto, déficit o superávit aplicado, objetivo diario resultante, ritmo semanal proyectado (pérdida o ganancia, % del peso) y desglose detallado.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:1486-1680 (incluye CalorieTargetBreakdown 1655)
- **TDEE adaptativo medido y estado de calibración** — Mostrar el TDEE adaptativo medido y, mientras falten datos, un aviso de calibración con consejos (registrar peso 3-4 veces por semana y comida a diario).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:1586-1603 ('Measured Adaptive TDEE'), 1876-1913 ('Awaiting Adaptive TDEE Calibration'); src/api/Settings/adaptiveTdeeService.ts; pages/Diary/DailyProgress.tsx:98-99,262-280
  - Nota: Móvil no muestra el valor del TDEE, los días de datos ni el estado de calibración. El servidor aplica el objetivo adaptativo para ambos clientes.
  - _Verificación: corregido por verificación_
- **Avisos de seguridad del objetivo calórico** — Alertas por objetivo bajo el RMR, bajo el suelo clínico absoluto, objetivo elevado al mínimo (con explicación y consejo) y ritmos inseguros de pérdida (>1,5%/semana) o ganancia (>0,5%/semana).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:1708-1875
- **Consejo de coaching según Goal Mode** — Tarjeta con un consejo según el modo elegido (recomposición, definición, volumen, etc.).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:1680-1706 (coachingAdvice), textos settings.goalMode.coaching.*
- **Algoritmos de cálculo de nutrientes** — Elegir los algoritmos del desglose de grasas, minerales, vitaminas, azúcar y azúcar añadido que usa el auto-cálculo.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:1915-2130; también en el onboarding (components/Onboarding/CalculationSettings.tsx:60-204)
- **Asistente de onboarding (cuestionario inicial de objetivos)** — Asistente a pantalla completa de unos 13 pasos que aparece solo tras iniciar sesión si el onboarding no está completo ni omitido. Tiene barra de progreso, botón atrás y selector de tema.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Index.tsx:33-58; src/components/Onboarding/OnBoarding.tsx:14-41 (precarga perfil, peso y altura); OnBoardingForm.tsx:25-28,168-213
- **Omitir onboarding** — Botón 'Skip' que marca el onboarding como omitido.
  - Web (Sí): SparkyFitnessFrontend/src/components/Onboarding/OnBoardingForm.tsx:196-209 (useSkipOnboarding)
- **Reabrir el onboarding desde la cabecera ('Completar configuración')** — Si el onboarding se omitió, la cabecera ofrece un botón para retomarlo.
  - Web (Sí): SparkyFitnessFrontend/src/layouts/MainLayout.tsx:512-525; src/pages/Index.tsx:62-70
- **Onboarding: datos corporales** — Pasos de sexo, peso actual (kg, lbs o st/lb), altura (cm, in o ft/in), fecha de nacimiento (con selector de formato de fecha) y estimación de grasa corporal (se guarda el punto medio del rango).
  - Web (Sí): SparkyFitnessFrontend/src/components/Onboarding/OnBoardingSteps.tsx:70-93 (sexo), 117-175 (peso), 177-229 (altura), 231-327 (nacimiento), 329-364 (grasa); PersonalPlan.tsx:40-54,304-327 (guarda perfil y medidas)
- **Onboarding: objetivo principal y hábitos** — Pasos de objetivo (perder, mantener o ganar peso), peso objetivo, comidas por día, nivel de actividad y si se suman las calorías quemadas (modo dinámico o fijo).
  - Web (Sí): SparkyFitnessFrontend/src/components/Onboarding/OnBoardingSteps.tsx:94-116,366-400,402-421,423-465,467-509; PersonalPlan.tsx:271-299 (activityLevel y calorieGoalAdjustmentMode)
- **Onboarding: conectar bases de datos de alimentos** — Paso opcional para añadir la clave de USDA y las credenciales de FatSecret. Solo aparece si el usuario no tiene ya un proveedor distinto de Open Food Facts.
  - Web (Sí): SparkyFitnessFrontend/src/components/Onboarding/FoodSourcesStep.tsx:100-200; OnBoardingForm.tsx:30-38,96-124
- **Onboarding: plan personal y presupuesto calórico** — Resumen del plan con presupuesto calórico editable, conmutador kcal/kJ, BMR base, indicador 'Calorie Buyback' ON/OFF y aviso médico.
  - Web (Sí): SparkyFitnessFrontend/src/components/Onboarding/PersonalPlan.tsx:410-450; PersonalPlanHeader.tsx:46-124
- **Onboarding: enfoque de dieta** — Elegir una plantilla de dieta (reparto de carbohidratos, proteína y grasa con descripción) o un reparto personalizado con bloqueo por macro.
  - Web (Sí): SparkyFitnessFrontend/src/components/Onboarding/DietApproach.tsx:52-320 (Select de DIET_TEMPLATES 74-118, 'Custom Macro Split' 135-305 con Lock/Unlock)
- **Onboarding: ajustes de cálculo avanzados** — Elegir dentro del onboarding los algoritmos de grasas, minerales, vitaminas y azúcar.
  - Web (Sí): SparkyFitnessFrontend/src/components/Onboarding/CalculationSettings.tsx:60-204; PersonalPlan.tsx:466-477
- **Onboarding: metas de nutrientes del plan** — Revisar y editar macros, fibra, desglose de grasas, minerales, azúcares y vitaminas, nutrientes personalizados, agua (con unidad), objetivos de ejercicio y distribución por comidas antes de empezar.
  - Web (Sí): SparkyFitnessFrontend/src/components/Onboarding/NutrientGoals.tsx:50-693 (comidas con MealPercentageManager 680-690)
- **Onboarding: iniciar plan en cascada de 6 meses o guardar como preset** — Finalizar el onboarding guardando perfil, medidas, objetivos en cascada, preferencias (unidades, algoritmos, modos) y datos del onboarding. Opcionalmente se guarda también como preset con nombre.
  - Web (Sí): SparkyFitnessFrontend/src/components/Onboarding/PersonalPlan.tsx:270-375 (guardado), 495-528 (botones 'Start 6-Month Cascading Plan' y 'Save Preset & Start'); OnboardingDialog.tsx:17-125
- **Pistas por nutriente sobre qué dirección elegir** — Popover informativo junto a Calorías, Carbohidratos y Grasa que explica que la dirección adecuada depende del objetivo (p. ej. Máximo para perder peso, Mínimo para ganar).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/NutrientGoalDirectionSettings.tsx:47-66 (GOAL_DEPENDENT_HINTS), 411 (se muestran en la fila del nutriente)
  - _Verificación: añadido durante la verificación_

#### Solo en el móvil (5)

- **Visualización del progreso frente al objetivo de pasos** · _Difiere iOS/Android_ — Mostrar el objetivo de pasos en gráficos o superficies de progreso.
  - **Actualizado en la PR #3052 (fusionada):** Wear OS tiene ya también una página de pasos con los pasos de hoy frente al objetivo y una complicación de pasos, así que estas superficies del reloj ya no son solo de iOS; la línea del objetivo en Health Trends no cambia en ninguna de las dos plataformas. A diferencia del Apple Watch, que muestra el último recuento del teléfono, Wear OS usa también el sensor de pasos del propio reloj cuando su recuento es mayor. La web permite fijar un objetivo de pasos, pero sigue sin mostrar el progreso frente a él.
  - Móvil (Sí): SparkyFitnessMobile/src/hooks/useMeasurementsRange.ts:88 -> src/components/StepsBarChart.tsx:15-65 (línea de objetivo en Health Trends); src/hooks/useWatchCheckInBridge.ts:470-473 (stepGoal al reloj, 10.000 por defecto) -> targets/watch/Presentation/StepsView.swift y targets/watch-widget/StepsComplication.swift
  - iOS/Android: La línea de objetivo en Health Trends existe en iOS y Android; la página Pasos y la complicación del Apple Watch solo existen en iOS.
- **Aviso de modo adaptativo y 'calorías base' en el editor** — Con el modo calórico adaptativo activo, explica que el objetivo cambia cada día, muestra el objetivo ajustado de hoy y trata el campo de calorías como base.
  - **Cubierto en parte por la PR #2984 (fusionada):** La web ya conserva el Goal Mode y el método Adaptive al guardar objetivos sin cambiar las calorías (por ejemplo, solo macros), pero sigue pasando a Maintain y Manual cuando se cambian las calorías o se restablecen los objetivos de un día; el móvil los conserva siempre. Los editores de objetivos de la web siguen sin el aviso de modo adaptativo y sin la etiqueta 'Baseline calories'.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/GoalsScreen.tsx:268-270,860-873 (nota 'Adaptive mode is on... Today it is X kcal'), 394-397 (etiqueta 'Baseline calories'); src/hooks/useGoals.ts:47-55 (useAdjustedCalorieGoal)
  - Nota: Comportamiento distinto: en web, guardar objetivos manuales anula el Goal Mode o el método adaptativo; en móvil se mantienen.
- **Onboarding de primer uso en móvil (conexión al servidor)** — Asistente inicial de la app: URL del servidor (con HTTPS obligatorio), inicio de sesión con email y contraseña, SSO/OIDC, Passkey, API key, MFA y opción 'Later'.
  - Móvil (Sí): SparkyFitnessMobile/App.tsx:523-524 (ruta inicial 'Onboarding' sin servidor configurado); src/screens/OnboardingScreen.tsx:611-1060
  - Nota: Corresponde más bien al dominio de autenticación. Se incluye para dejar claro que el 'Onboarding' móvil no equivale al cuestionario de objetivos de la web.
- **Widgets de pantalla de inicio con progreso de objetivos** · _Difiere iOS/Android_ — Widgets que muestran lo consumido frente al objetivo de calorías, macros o agua.
  - **Cubierto en parte por la PR #3020 (fusionada):** Android ya tiene también un widget de agua con el agua de hoy frente al objetivo, una barra y botones − y +, junto a los widgets de calorías y macros. Sigue habiendo diferencias: el widget de calorías de Android solo muestra las kcal restantes y su barra, sin las calorías de comida ni las quemadas; cada widget de Android tiene un único tamaño fijo, mientras que iOS ofrece pequeño y mediano, y los formatos de pantalla de bloqueo siguen siendo solo de iOS.
  - Móvil (Sí): iOS: SparkyFitnessMobile/targets/widget/widgets.swift, macroWidget.swift, waterWidget.swift; Android: targets/android-widget/kotlin/com/sparkyapps/sparkyfitness/widget/CalorieWidget.kt.tmpl, MacroWidget.kt.tmpl; plugins/withCalorieWidget.ts; src/services/CalorieWidgetBridge.ts
  - iOS/Android: iOS tiene widgets de calorías, macros y agua, con formatos de pantalla de bloqueo. Android tiene widgets Glance de calorías y macros, sin widget de agua.
  - Nota: Relacionado con el dominio de widgets; aquí solo interesa como superficie de visualización de objetivos.
- **Apple Watch: página de Objetivos y complicaciones** · _Solo iOS_ — Página del reloj con la nutrición de hoy frente a los objetivos (anillo de calorías y nutrientes elegidos) y complicaciones de energía, agua, proteína, carbohidratos, grasa y pasos.
  - **Actualizado en la PR #3052 (fusionada):** Wear OS tiene ya también una página de Objetivos, con el anillo de calorías y los nutrientes elegidos en Ajustes > Wear OS, y las mismas siete complicaciones que el Apple Watch (calorías, proteínas, carbohidratos, grasas, agua, ayuno y pasos), que abren su página al tocarlas. Sigue habiendo diferencias: la página de Wear OS muestra las calorías comidas frente al objetivo y las kcal restantes, pero no las quemadas; su complicación de calorías no tiene los anillos de macros, y sus complicaciones solo se ofrecen como valor con rango y texto corto, mientras que en el Apple Watch las de macros, pasos y ayuno tienen también formatos de esquina, rectangular y en línea. En los dos relojes los textos están solo en inglés, salvo los nombres de nutrientes que envía el teléfono.
  - Móvil (Sí): SparkyFitnessMobile/targets/watch/Presentation/GoalSummaryView.swift; targets/watch-widget/EnergyGoalComplication.swift, WaterGoalComplication.swift, MacroComplications.swift, StepsComplication.swift; src/hooks/useWatchCheckInBridge.ts (goalNutrients, stepGoal); Ajustes > Apple Watch (WatchSettingsScreen)
  - iOS/Android: Solo iOS con Apple Watch emparejado; no hay equivalente en Wear OS.

#### En ambos, con diferencias (10)

- **Objetivo diario de calorías** — Campo para fijar el objetivo calórico diario.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Goals/DailyGoals.tsx:196-216 (NumericInput convertido a la unidad de energía kcal/kJ del usuario)
  - Móvil (Parcial): SparkyFitnessMobile/src/screens/GoalsScreen.tsx:97-103,387-398,885-888 (campo siempre en kcal según NUTRIENT_META; en modo adaptativo se rotula 'Baseline calories (kcal)' 394-397)
  - Nota: Móvil no convierte a kJ aunque energy_unit sea kJ; web sí.
- **Auto-cálculo masivo de nutrientes** — Calcular varios objetivos de nutrientes de una vez.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Goals/AutoCalculateToolbar.tsx:24-62 (Seleccionar todo / Ninguno / 'Auto-calcular seleccionados (n)') + casilla por nutriente en NutrientAutoCalculate.tsx:105-114
  - Móvil (Parcial): SparkyFitnessMobile/src/screens/GoalsScreen.tsx:892-902 (un único botón 'Calculate all from my profile' para todos los campos calculables)
  - Nota: Móvil no permite elegir qué nutrientes incluir.
- **Crear y editar presets de objetivos** — Formulario de preset con nombre, calorías, macros, nutrientes, agua, ejercicio, pasos y distribución por comidas.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Goals/GoalPresetDialog.tsx:186-440 (nombre 195, macros g/% 204-330, auto-cálculo 337-400, agua/ejercicio 408, comidas 413-426)
  - Móvil (Parcial): SparkyFitnessMobile/src/screens/GoalsScreen.tsx:829-851,526-553,1013-1017 (la misma pantalla Goals en modo preset con navigation.push('Goals', {presetId | newPreset}))
  - Nota: Al preset móvil le faltan los macros en %, las plantillas de comidas y el auto-cálculo de nutrientes personalizados. Sí tiene calculadora estándar, nutrientes personalizados, agua, ejercicio y comidas.
- **Guía de direcciones según objetivo de salud** — Perfiles orientativos (perder peso, ganar peso, mantener, diabetes, salud cardiaca, low-carb) sobre qué dirección elegir.
  - Web (Parcial): SparkyFitnessFrontend/src/pages/Settings/NutrientGoalDirectionSettings.tsx:71-115 (GUIDANCE_SCENARIOS), 232-270 (desplegable solo informativo, sin aplicar), 623
  - Móvil (Sí): SparkyFitnessMobile/src/components/NutrientDirectionGuide.tsx:28-160 (botón 'Apply' por perfil, 152-158); src/constants/nutrientDirectionGuides.ts:25-49 (buildGuideDirections calcula rangos con las calorías); src/screens/GoalsScreen.tsx:632-647,874-884
  - Nota: La web solo muestra texto; el móvil aplica con un toque las direcciones de todo el perfil.
- **Goal Mode (déficit o superávit sobre el TDEE)** — Mantener (0%), Recomposición (-10%), Definición (-15%), Definición alta (-20%), Volumen limpio (+10%), Volumen (+20%) y Manual (% personalizado).
  - **Actualizado en la PR #3067 (fusionada):** La web y el móvil ofrecen ahora un octavo Goal Mode, Weekly weight change (cambio de peso semanal), en el que se indica cuánto perder o ganar cada semana. El móvil muestra el ajuste diario estimado y un aviso general de que el mínimo de seguridad de calorías puede limitar la pérdida, mientras que la web indica además la mayor pérdida semanal que permite ese mínimo. El móvil sigue sin marcar los modos inalcanzables y sin mostrar el techo de déficit.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:1184-1282 (incluye etiquetas 'Unreachable' y la pista del déficit máximo alcanzable 1255-1280)
  - Móvil (Parcial): SparkyFitnessMobile/src/screens/CalorieSettingsScreen.tsx:115-158,684-736
  - Nota: Móvil ofrece los 7 modos, pero no avisa de los modos inalcanzables ni del techo de déficit.
- **Porcentaje personalizado del Goal Mode Manual** — Porcentaje de ajuste (positivo = superávit, negativo = déficit).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:1312-1385 (con aviso cuando supera lo que permite el suelo de seguridad)
  - Móvil (Parcial): SparkyFitnessMobile/src/screens/CalorieSettingsScreen.tsx:712-736 (sin aviso de 'inalcanzable')
- **Desglose del objetivo calórico en el diario** — Explicar en el diario de dónde sale el objetivo del día (BMR, datos corporales, TDEE adaptativo o proyectado, Goal Mode).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Diary/DailyProgress.tsx:812-830 (CalorieTargetBreakdown asDialog con BMR, algoritmo, peso, altura, edad, grasa, TDEE adaptativo y Goal Mode)
  - Móvil (Parcial): SparkyFitnessMobile/src/components/DiaryCalorieMacroSummary.tsx:203,274-305 (solo con tdeeProjection: TDEE proyectado, objetivo del Goal Mode y la fuente)
- **Aplicar un preset a los objetivos diarios en cascada** — Desde la lista de presets del editor de objetivos, pulsar 'Aplicar' para cargar los valores del preset en el formulario y guardarlos como objetivos desde hoy en adelante.
  - Web (Parcial): SparkyFitnessFrontend/src/pages/Goals/GoalPresetsSection.tsx:66-84 (en la página Objetivos cada preset solo tiene Editar/Borrar); solo se puede aplicar un preset a una fecha concreta, sin cascada, desde el diálogo del diario EditGoalsForToday.tsx:182-217 ('Apply Preset')
  - Móvil (Sí): SparkyFitnessMobile/src/components/GoalPresetsSection.tsx:81-86 (botón 'Apply'); src/screens/GoalsScreen.tsx:649-692 (handleApplyPreset, toast 'Preset applied. Tap Save to keep it.') y 598 (guardado con cascade: true)
  - Nota: Lo inverso (aplicar un preset solo a una fecha) es exclusivo de la web y se cubre en goals-edit-for-date.
  - _Verificación: añadido durante la verificación_
- **Línea de peso objetivo y distancia al objetivo en los gráficos de peso** — Dibujar el peso objetivo como línea en el gráfico de peso y mostrar la fecha estimada para alcanzarlo (o 'Holding steady' / 'Moving away' / 'Over 2 years') y cuánto falta.
  - Web (Parcial): SparkyFitnessFrontend/src/pages/Reports/MeasurementChartsGrid.tsx:163-172,532-556 (solo el texto 'Goal projected {{date}}' en la cabecera del gráfico de peso, sin línea de objetivo); la línea de peso objetivo solo aparece en el informe de medicación GLP-1 (pages/Reports/MedicationReports.tsx:225-230,771-774)
  - Móvil (Sí): SparkyFitnessMobile/src/components/WeightLineChart.tsx:295-301 (TrendGoalLine), 330-352 (tile 'Goal date' con estados), usado en Health Trends (src/screens/DashboardScreen.tsx:326,890) y en src/screens/MeasurementsReportScreen.tsx:102,207-221 ('To goal weight'), 363
  - Nota: En móvil el peso objetivo solo se puede ver, no editar (ver goals-goal-weight-edit).
  - _Verificación: añadido durante la verificación_
- **Aplicar un preset de objetivos** — Cargar los valores de un preset en el formulario de objetivos y guardarlos. En la web solo se puede para una fecha concreta desde el diálogo 'Edit Goals' del Diario (sin cascada); la página Objetivos solo permite crear, editar y borrar presets. En el móvil se aplica desde Ajustes > Goals > Goal pre…
  - Web (Parcial): SparkyFitnessFrontend/src/pages/Goals/EditGoalsForToday.tsx:182-217 (Select 'Apply Preset' -> handleApplyPreset) y 505-512 (guardado con cascade:false para selectedDate); pages/Goals/GoalPresetsSection.tsx:66-82 solo tiene Edit/Delete.
  - Móvil (Parcial): SparkyFitnessMobile/src/components/GoalPresetsSection.tsx:81-86 (botón 'Apply') -> src/screens/GoalsScreen.tsx:649-694 (handleApplyPreset carga los valores, toast 'Tap Save to keep it'), 598 (saveGoals con date = hoy y cascade:true); no hay forma de aplicarlo solo a una fecha.
  - Nota: Ámbito distinto en cada cliente: web = un solo día (pasado o futuro); móvil = de hoy en adelante. Ninguno ofrece las dos opciones.
  - _Verificación: añadido durante la verificación_

#### En ambos clientes, pero con diferencias iOS/Android (1)

- **Usar BMR medido (check-ins y dispositivos sincronizados)** · _Difiere iOS/Android_ — Interruptor use_external_bmr para que un BMR registrado en un check-in o sincronizado desde una báscula o proveedor sustituya a la fórmula ese día.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:766-790 (Checkbox 'calculationSettings.useExternalBmr' con su pista), Ajustes > Nutrición > Ajustes de cálculo (SettingsPage.tsx:321-341).
  - Móvil (Sí): SparkyFitnessMobile/src/screens/CalorieSettingsScreen.tsx:893-927 (Switch 'Use measured BMR from check-ins and synced devices'), Ajustes > Calories & BMR (SettingsScreen.tsx:272-280).
  - iOS/Android: En iOS, con el interruptor activado, aparece una nota extra (CalorieSettingsScreen.tsx:918-925, Platform.OS === 'ios') que recomienda poner el nivel de actividad en None (×1.0), porque la Resting Energy de Apple Health ya incluye actividad ligera. En Android no aparece.
  - _Verificación: añadido durante la verificación_

<details><summary>En paridad web ↔ móvil (30)</summary>

- Pantalla de configuración de objetivos
- Objetivos de macronutrientes en gramos
- Objetivos de fibra, grasas detalladas, minerales, vitaminas, azúcar, cafeína y alcohol
- Objetivos para nutrientes personalizados
- Objetivo diario de agua
- Objetivos de ejercicio (calorías quemadas y duración)
- Objetivo diario de pasos
- Auto-calcular un nutriente desde el perfil
- Distribución de calorías por comida
- Guardar objetivos en cascada desde hoy
- Aplicar un preset de objetivos
- Lista de presets de objetivos
- Eliminar preset de objetivos
- Lista de planes semanales de objetivos
- Crear y editar plan semanal (preset por día de la semana)
- Eliminar plan semanal
- Uso del peso objetivo en gráficos (línea objetivo y previsión)
- Dirección de objetivo por nutriente (Mín / Máx / Rango)
- Leyenda y explicación de Mín/Máx/Rango
- Incluir BMR (calorías en reposo) en las calorías netas
- Usar BMR medido (check-ins y dispositivos)
- Mostrar carbohidratos netos
- Modo de ajuste del objetivo calórico
- Porcentaje de recuperación de calorías de ejercicio
  - **Actualizado en la PR #2940 (fusionada):** Cuando el método de cálculo del Goal Mode es Adaptive y se conoce el BMR, la web y el móvil ocultan el porcentaje de recuperación y muestran el mismo aviso: los objetivos adaptativos ya incluyen la actividad, así que la recuperación de calorías de ejercicio solo se aplica a los objetivos Manual. En los demás casos el porcentaje funciona como antes, igual en web, iOS y Android.
- Nivel de actividad (multiplicador de TDEE)
- Permitir que la proyección de respaldo baje el objetivo
- Explicación de cómo se calculan las calorías
- Método de cálculo del Goal Mode (Adaptativo / Manual)
- Suelo de seguridad calórico
- Gestionar objetivos mediante el chat Sparky

</details>

### 2.8 Informes y analíticas

#### Solo en la web (38)

- **Maximizar y hacer zoom en gráficos** — Abrir un gráfico a pantalla completa y ampliar/reducir; tooltips sincronizados entre gráficos de la misma página.
  - Web (Sí): ZoomableChart con Maximize/Minimize/ZoomIn/ZoomOut (SparkyFitnessFrontend/src/components/ZoomableChart.tsx:10-40) usado en casi todos los gráficos (p. ej. NutritionPeriodSummary.tsx:594,807; SleepAnalyticsCharts.tsx:350,429,543,660); sincronización REPORTS_CHART_SYNC_ID (src/utils/chartUtils, NutritionChartsGrid.tsx:26)
- **Modo de escala de gráficos (tiempo vs. punto)** — Preferencia que determina si el eje X es temporal proporcional o por puntos equidistantes.
  - Web (Sí): Ajustes → Preferencias 'Chart Scale Mode' time/point (SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:206-230); aplicado con prepareTimeChartData(chartScaleMode) en NutritionPeriodSummary.tsx y NutritionChartsGrid.tsx
- **Unidad de energía (kcal/kJ) en informes** — Mostrar calorías en la unidad preferida del usuario en informes y exportaciones.
  - Web (Sí): convertEnergy/energyUnit en NutritionPeriodSummary.tsx:72-78,371-375 y exportaciones (src/pages/Reports/Reports.tsx:339-385)
  - Nota: El móvil muestra los informes pero siempre en kcal.
- **Ver informes de otro usuario (acceso familiar)** — Consultar los informes de un familiar/amigo que ha concedido el permiso 'reports'.
  - Web (Sí): PermissionRoute permission='reports' (SparkyFitnessFrontend/src/App.tsx:395-399); Reports usa activeUserId de ActiveUserContext (src/pages/Reports/Reports.tsx:55-56,123-139) seleccionable con ProfileSwitcher (src/components/ProfileSwitcher.tsx)
- **Gráfico de balance acumulado** — Área que acumula día a día la diferencia entre lo consumido y el objetivo del nutriente seleccionado.
  - Web (Sí): 'Cumulative Balance - <nutriente>' AreaChart (SparkyFitnessFrontend/src/pages/Reports/NutritionPeriodSummary.tsx:396,807-860)
- **Carbohidratos netos en informes** — Sustituir carbohidratos por carbohidratos netos cuando el usuario lo prefiere.
  - Web (Sí): withNetCarbsSubstitution y etiqueta 'Net Carbs' (SparkyFitnessFrontend/src/pages/Reports/NutritionPeriodSummary.tsx:82-85,129-133; NutritionChartsGrid.tsx:66-69,150-153); también en exportFoodDiary (Reports.tsx:349)
- **Informe de categorías de medición personalizadas** — Gráfico por cada categoría numérica personalizada (con conversión de unidades) y valores con notas.
  - Web (Sí): CustomCategoryReport 'Custom Measurements' (SparkyFitnessFrontend/src/pages/Reports/CustomCategoryReport.tsx:88-200); pestaña Mediciones (Reports.tsx:264-269)
- **Niveles de estrés en bruto (intradía)** — Gráfico de la serie de estrés sin procesar del dispositivo.
  - Web (Sí): StressChart 'Raw Stress Levels' con useRawStressData (SparkyFitnessFrontend/src/pages/Reports/StressChart.tsx; Reports.tsx:123-124,294-308)
- **Gráfico de deuda de sueño** — Deuda de sueño diaria a lo largo del periodo.
  - Web (Sí): 'Sleep Debt' (SparkyFitnessFrontend/src/pages/Reports/SleepAnalyticsCharts.tsx:543-655)
- **Ciencia del sueño: deuda de sueño** — Anillo de deuda de sueño con noches estimadas para recuperar e historial de deuda/superávit de 14 días.
  - Web (Sí): SleepDebtRing y SleepDebtHistory (SparkyFitnessFrontend/src/pages/Reports/SleepScience/SleepScienceSection.tsx:145,167; SleepDebtRing.tsx; SleepDebtHistory.tsx)
- **Ciencia del sueño: cronotipo** — Cronotipo con hora media de despertar/dormir, nadir, acrofase y ventana de melatonina.
  - Web (Sí): ChronotypeCard (SparkyFitnessFrontend/src/pages/Reports/SleepScience/ChronotypeCard.tsx; SleepScienceSection.tsx:152)
- **Ciencia del sueño: curva de energía** — Horario/curva de energía prevista a lo largo del día con energía actual.
  - Web (Sí): EnergySchedule 'Energy Curve' (SparkyFitnessFrontend/src/pages/Reports/SleepScience/EnergySchedule.tsx; SleepScienceSection.tsx:158)
- **Ciencia del sueño: necesidad de sueño esta noche** — Desglose de la necesidad de sueño (base, carga, recuperación de deuda, siestas) y método.
  - Web (Sí): SleepNeedBreakdown 'Sleep Need Tonight' (SparkyFitnessFrontend/src/pages/Reports/SleepScience/SleepNeedBreakdown.tsx; SleepScienceSection.tsx:163)
- **Recalcular línea base de sueño** — Botón que recalcula la línea base de sueño con los últimos 90 días.
  - Web (Sí): useCalculateBaselineMutation().mutate(90) botón 'Recalculate' (SparkyFitnessFrontend/src/pages/Reports/SleepScience/SleepScienceSection.tsx:42,62-71)
- **Tabla de análisis de sueño y exportación CSV** — Tabla por noche (acostarse, levantarse, duración, tiempo dormido, puntuación, eficiencia, deuda, impacto, periodos despierto, insight) exportable a CSV.
  - Web (Sí): SleepAnalyticsTable (SparkyFitnessFrontend/src/pages/Reports/SleepAnalyticsTable.tsx) y exportSleepDataToCSV (SleepReport.tsx:43-70,461-468)
- **Filtros y agrupación del panel de ejercicio** — Comparar con periodo anterior/año pasado, filtrar por equipo, grupo muscular y ejercicios, y agrupar por día/semana/mes/año.
  - Web (Sí): ExerciseDashboardFilters (SparkyFitnessFrontend/src/components/ExerciseCharts/ExerciseDashboardFilters.tsx:66-177) e intervalo 'Group by' (ExerciseReportsDashboard.tsx:822-850)
- **Tendencias de fuerza (volumen, peso máximo, 1RM estimado)** — Gráficos de evolución del volumen, el peso máximo y el 1RM estimado por ejercicio.
  - Web (Sí): VolumeTrendChart, MaxWeightTrendChart, Estimated1RMTrendChart en 'More analysis' (SparkyFitnessFrontend/src/pages/Reports/ExerciseReportsDashboard.tsx:399-461,647-651,700)
- **Mejor serie por rango de repeticiones y dispersión reps vs. peso** — Gráfico de la mejor serie por rango de repeticiones y nube de puntos repeticiones frente a peso.
  - Web (Sí): BestSetRepRangeChart y RepsVsWeightChart (SparkyFitnessFrontend/src/pages/Reports/ExerciseReportsDashboard.tsx:462,512)
- **Análisis de rendimiento por serie** — Comparación del rendimiento de cada serie (primera, mejor, última) por ejercicio.
  - Web (Sí): SetPerformanceAnalysisChart (SparkyFitnessFrontend/src/pages/Reports/SetPerformanceAnalysisChart.tsx; ExerciseReportsDashboard.tsx:581)
- **Tiempo bajo tensión** — Gráfico del tiempo bajo tensión por ejercicio.
  - Web (Sí): TimeUnderTensionChart (SparkyFitnessFrontend/src/pages/Reports/ExerciseReportsDashboard.tsx:534)
- **Volumen de cardio por intervalo** — Distancia, duración y calorías de cardio agrupadas por semana/mes/año.
  - Web (Sí): CardioVolumeIntervalChart (SparkyFitnessFrontend/src/components/ExerciseCharts/CardioVolumeIntervalChart.tsx; ExerciseReportsDashboard.tsx:895,938)
- **Recorridos coincidentes** — Agrupa actividades que siguen el mismo recorrido para compararlas.
  - Web (Sí): MatchedCoursesList con useMatchedCourses (SparkyFitnessFrontend/src/components/ExerciseCharts/MatchedCoursesList.tsx; ExerciseReportsDashboard.tsx:940)
- **Buscador de actividades por distancia** — Consulta de actividades por distancia (5K, 10K, 15K…) mostrando ritmo medio, FC media y calorías.
  - Web (Sí): ActivityInterrogationFinder (SparkyFitnessFrontend/src/components/ExerciseCharts/ActivityInterrogationFinder.tsx; ExerciseReportsDashboard.tsx:942)
- **Eje X conmutable en gráficos de actividad** — Ver los gráficos de actividad frente a hora del día, duración o distancia.
  - Web (Sí): Selector X-Axis Time of Day / Duration / Distance (SparkyFitnessFrontend/src/pages/Reports/ActivityReportVisualizer.tsx:630-650)
- **Informe de telemetría y entrenamiento estructurado** — Lista 'Activity Maps' con el informe completo de actividades del proveedor (Garmin) y visualizador de entrenamientos estructurados (pasos, objetivos, PRs y estadísticas de la sesión).
  - Web (Sí): ActivityTelemetryList (SparkyFitnessFrontend/src/components/ExerciseCharts/ActivityTelemetryList.tsx:30-60; ExerciseReportsDashboard.tsx:948) y WorkoutReportVisualizer 'Workout Steps' / 'Personal Records (PRs)' (src/pages/Reports/WorkoutReportVisualizer.tsx; ActivityReportVisualizer.tsx:38)
- **Informe de medicación: indicadores** — Adherencia media, nº de inyecciones GLP-1 y recuento de síntomas del periodo.
  - Web (Sí): Pestaña Medicamentos (SparkyFitnessFrontend/src/pages/Reports/Reports.tsx:390-413); KPIs (MedicationReports.tsx:590-640)
- **Gráficos del informe de medicación** — Náuseas vs. dosis, peso vs. objetivo, tendencia de adherencia y tendencias del check-in GLP-1 (hambre, saciedad, ruido alimentario, energía).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Reports/MedicationReports.tsx:657-880
- **Correlaciones de medicación** — Correlaciones hidratación-estreñimiento, proteína-náuseas, sueño-fatiga y dosis-náuseas con puntuación de confianza.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Reports/MedicationReports.tsx:963-1290
- **Tabla de registro de medicación** — Tabla por fecha con dosis tomadas, omitidas, horas y síntomas.
  - Web (Sí): MedicationLogTable (SparkyFitnessFrontend/src/pages/Reports/MedicationLogTable.tsx; MedicationReports.tsx:790)
- **Personalizar gráficos del informe de medicación** — Elegir qué gráficos y correlaciones aparecen en el informe de medicación.
  - Web (Sí): 'Customize Charts' (SparkyFitnessFrontend/src/pages/Reports/MedicationReports.tsx:484-565)
- **Informe para prescriptor (PDF) y CSV de medicación** — Imprimir/guardar en PDF un informe para el prescriptor y descargar los datos en CSV.
  - Web (Sí): 'Print / Save PDF Report' y 'Download CSV Data' (SparkyFitnessFrontend/src/pages/Reports/MedicationReports.tsx:1307-1340); plantilla de impresión medications.print.*
- **Tabla del diario de alimentos y CSV** — Tabla de alimentos del periodo (fecha, comida, alimento, cantidad, nutrientes) con selector de tabla y exportación CSV.
  - Web (Sí): Selector 'All tables'/alimentos/ejercicio/mediciones/categoría (SparkyFitnessFrontend/src/pages/Reports/ReportsTables.tsx:119-120,456-485) y 'Food Diary Table' con exportación (ReportsTables.tsx:504; Reports.tsx:339-351, exportFoodDiary en src/utils/reportUtil)
- **Tabla de entradas de ejercicio y CSV** — Tabla de ejercicios con series, repeticiones, peso, descanso, tonelaje y calorías, filtros por nombre y tipo de serie, exportable a CSV.
  - Web (Sí): 'Exercise Entries Table' con filtros (SparkyFitnessFrontend/src/pages/Reports/ReportsTables.tsx:651-680,721) y exportExerciseEntries (Reports.tsx:375-385)
- **Tabla de medidas corporales y CSV** — Tabla de peso, cuello, cintura, cadera, altura, % grasa, masa muscular/ósea, % agua, TMB y pasos, exportable a CSV.
  - Web (Sí): 'Body Measurements Table' (SparkyFitnessFrontend/src/pages/Reports/ReportsTables.tsx:855-920) y exportBodyMeasurements (Reports.tsx:352-362)
- **Tablas de mediciones personalizadas y CSV** — Una tabla por categoría personalizada (fecha, hora, valor, notas) exportable a CSV por categoría.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Reports/ReportsTables.tsx:1020-1040 y exportCustomMeasurement (Reports.tsx:363-374)
- **Porcentaje de cada nutriente procedente de suplementos** — En cada gráfico de nutriente del informe se indica qué porcentaje de la ingesta media viene de suplementos o medicamentos con nutrientes (solo aparece si hubo suplementos).
  - Web (Sí): NutritionChartsGrid calcula supplement_<nutriente> y muestra '{{percent}}% from supplements' bajo 'Avg' (SparkyFitnessFrontend/src/pages/Reports/NutritionChartsGrid.tsx:215-265)
  - _Verificación: añadido durante la verificación_
- **Notas del estado de ánimo en el gráfico del informe** — Al pasar sobre un día del gráfico de ánimo se ve el valor, el emoji, la etiqueta y las notas escritas ese día.
  - **Actualizado en las PR #3016 y #3018 (fusionadas):** Ahora ninguna de las dos apps muestra notas en el gráfico del informe de estado de ánimo: el tooltip de la web muestra el valor del ánimo con su emoji y su etiqueta y el número de registros de ese día. En su lugar, las dos muestran el principio del texto de diario de cada registro (hasta 120 caracteres) en la lista de registros del día, en la página Check-In de la web y en la pantalla del día de ánimo del móvil.
  - Web (Sí): CustomTooltip de MoodChart muestra 'Mood Value' y 'Notes:' + entry.notes (SparkyFitnessFrontend/src/pages/Reports/MoodChart.tsx:209-235), en la pestaña Estrés de Informes (Reports.tsx:292-302)
  - _Verificación: añadido durante la verificación_
- **Aviso de datos insuficientes de Ciencia del sueño** — Aviso con recomendación y recuento de días laborables y libres disponibles/necesarios para el análisis completo de Ciencia del sueño.
  - Web (Sí): Tarjeta 'More data needed for full analysis' con 'Workdays: x/y' y 'Free days: x/y' (SparkyFitnessFrontend/src/pages/Reports/SleepScience/SleepScienceSection.tsx:76-118).
  - _Verificación: añadido durante la verificación_

#### Solo en el móvil (11)

- **Rango por defecto configurable** — Ajuste que define con qué ventana se abre cada informe.
  - Móvil (Sí): Personalizar informes → 'Default range' 7d/30d/90d (SparkyFitnessMobile/src/screens/ReportsSettingsScreen.tsx:405-418); leído por useReportCustomization (src/hooks/useReportCustomization.ts) y ExerciseStatisticsScreen.tsx:114-118
- **Reordenar y ocultar informes del hub** — Arrastrar para cambiar el orden de los informes en la página de Informes y desactivar los que no se quieren ver.
  - Móvil (Sí): ReorderSwitchList en ReportsSettingsScreen.tsx:376-403 (impide ocultar el último visible); aplicado en ReportsScreen.tsx:109-112; acceso desde el icono de cabecera del hub (ReportsScreen.tsx:29-37) y desde Ajustes → Reports (src/screens/SettingsScreen.tsx:326-333)
- **Reparto de macros del periodo** — Barra 'De dónde vienen tus calorías' con el porcentaje de proteína, carbohidratos y grasa.
  - Móvil (Sí): MacroSplitBar (SparkyFitnessMobile/src/screens/NutritionReportScreen.tsx:416-432; src/components/reports/MacroSplitBar.tsx)
- **Días destacados y calorías por día de la semana** — Día con más y con menos calorías registradas y media de calorías por día de la semana.
  - Móvil (Sí): 'Highlights' (SparkyFitnessMobile/src/screens/NutritionReportScreen.tsx:441-463) y 'Calories by weekday' (líneas 485-499)
- **Constancia de registro de comidas** — Racha actual y racha más larga de días con comida registrada.
  - Móvil (Sí): 'Logging consistency' (SparkyFitnessMobile/src/screens/NutritionReportScreen.tsx:500-527)
- **Objetivo de agua, rachas y días destacados** — Objetivos cumplidos, racha de objetivo más larga, total, mejor y peor día y media por día de la semana.
  - Móvil (Sí): 'Water goal' (SparkyFitnessMobile/src/screens/HydrationReportScreen.tsx:227-262), 'Best and lowest days' (263-283), 'Average by weekday' (284-300)
- **Estrés durante el sueño por noche** — Gráfico del estrés medio de cada noche.
  - Móvil (Sí): Métrica 'Sleep stress' (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:131,565-585)
- **Sueño entre semana vs. fin de semana** — Tiempo dormido y hora de acostarse en noches laborables frente a fines de semana.
  - Móvil (Sí): 'Weekdays vs weekends' (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:588-596)
- **Zonas de ritmo** — Zonas de ritmo personales (Fácil, Constante, Umbral, Intervalo, Repetición) con rangos por km/milla.
  - **Cubierto en parte por la PR #3154 (fusionada):** La web muestra ya los rangos de las cinco zonas de ritmo de entrenamiento (de Fácil a Repetición) en una tarjeta de solo lectura 'Fitness tests' en la vista Cardio de Informes > Progreso de ejercicio, pero solo si la persona tiene un test de forma física, que se hace en la app móvil. La web sigue sin zonas de ritmo estimadas a partir de las carreras recientes; la tarjeta de zonas de ritmo del móvil usa primero el último test y después las carreras recientes.
  - Móvil (Sí): PaceZonesCard (SparkyFitnessMobile/src/components/exerciseStats/PaceZonesCard.tsx:35-110; ExerciseStatisticsScreen.tsx:237) con usePaceZones
- **Exportar ruta a GPX** — Genera un archivo GPX de la ruta y abre la hoja de compartir (Archivos, Strava, Garmin Connect…).
  - Móvil (Sí): Botón 'Export GPX' (SparkyFitnessMobile/src/screens/CardioSessionScreen.tsx:203-216,305-312) con shareRouteAsGpx (src/services/gpxExport.ts:11-41)
- **Tendencia de peso y % de grasa en el Apple Watch** · _Solo iOS_ — Página 'Weight trend' del reloj, tras guardar un check-in, con gráfico de peso y % de grasa y media móvil; se pasa de una métrica a otra con la Digital Crown.
  - **Actualizado en la PR #3052 (fusionada):** Wear OS ya tiene también una página de tendencia de peso: los últimos 14 registros de peso con una media móvil de 7 puntos, que pasa a una línea de % de grasa corporal con un toque o con la corona giratoria cuando hay dos lecturas de grasa, y se puede reordenar u ocultar en Ajustes → Wear OS. A diferencia del Apple Watch, guardar un registro de peso en Wear OS no abre la página de tendencia: hay que deslizar hasta ella.
  - Móvil (Sí): TrendView con métricas weight y bodyFat y rollingMean (SparkyFitnessMobile/targets/watch/Presentation/TrendView.swift:13-40), página .trend (ContentView.swift:168-169), activable en Ajustes → Apple Watch ('Weight trend', src/constants/watchPages.ts:15,40-41; SettingsScreen.tsx:368-377, visible solo con reloj emparejado).
  - iOS/Android: Target watchOS creado con @bacons/apple-targets; no hay equivalente para Wear OS (targets/ solo tiene widgets y notificaciones Android).
  - _Verificación: añadido durante la verificación_

#### En ambos, con diferencias (49)

- **Selector de rango de fechas del informe** — Elegir el periodo que cubren los informes (presets y rango personalizado).
  - Web (Sí): DateRangePickerWithPresets con presets 7, 14, 30, 90 días, 6 meses, 1 año y calendario libre (SparkyFitnessFrontend/src/components/ui/DateRangeWithPresets.tsx:16-101); rango por defecto 14 días y persistido en la URL junto con la pestaña (?startDate&endDate&tab) (src/pages/Reports/Reports.tsx:88-115,181-203)
  - Móvil (Parcial): ReportRangeControl con 7d/30d/90d + 'Custom' que abre DateRangeSheet (SparkyFitnessMobile/src/components/reports/ReportRangeControl.tsx:29-83); el rango personalizado se limita a 180 días (src/utils/trendRange.ts:42,63-75); usado por todos los informes vía useReportCustomization (src/hooks/useReportCustomization.ts) y por ExerciseStatisticsScreen.tsx:599
  - Nota: Móvil: sin presets de 14 días, 6 meses ni 1 año; máximo 180 días; no hay enlace profundo con el rango. Algunas tarjetas móviles usan ventanas fijas (carga de entrenamiento 28 días, tendencias de carrera 12 semanas).
- **Mostrar/ocultar secciones de cada informe y restablecer** — Interruptores por sección (cifras clave, insights, gráficos, tarjetas) de cada informe y botón para restaurar los valores por defecto.
  - Web (Parcial): Solo existe para la cuadrícula de gráficos de Mediciones (ocultar/restaurar widgets y 'Reset layout', SparkyFitnessFrontend/src/components/widgets/WidgetGrid.tsx:210-277) y para el informe de medicación ('Customize Charts', src/pages/Reports/MedicationReports.tsx:484-565)
  - Móvil (Sí): Secciones por informe definidas en SparkyFitnessMobile/src/constants/reports.ts (NUTRITION_SECTIONS, HYDRATION_SECTIONS, SUBSTANCES_SECTIONS, EXERCISE_SECTIONS, MEASUREMENTS_SECTIONS, SLEEP_SECTIONS + sleepMetricSection, MOOD_SECTIONS); interruptores en ReportsSettingsScreen.tsx:328-352,420-504; botón 'Reset' en cabecera (ReportsSettingsScreen.tsx:315-326)
- **Diseño personalizable de gráficos de Mediciones** — Modo edición para arrastrar, redimensionar, ocultar y restablecer los gráficos de mediciones, con el diseño guardado en el servidor por usuario.
  - Web (Sí): WidgetGrid pageKey='reports-measurements' (SparkyFitnessFrontend/src/pages/Reports/Reports.tsx:243-250); edición/ocultar/reset y persistencia useDashboardLayout (src/components/widgets/WidgetGrid.tsx:93-277); deshabilitado al actuar en nombre de otro usuario (WidgetGrid.tsx:107)
  - Móvil (Parcial): MeasurementsReportScreen tiene orden fijo de secciones (SparkyFitnessMobile/src/screens/MeasurementsReportScreen.tsx:349-400); solo se pueden ocultar secciones desde Personalizar informes
  - _Verificación: corregido por verificación_
- **Cifras clave e 'insights' con comparación con el periodo anterior** — Tarjeta de cifras destacadas y frases automáticas ('What stood out') que comparan con el periodo anterior equivalente.
  - Web (Parcial): Solo el panel de ejercicio permite 'Compare to: Previous Period / Last Year' (SparkyFitnessFrontend/src/components/ExerciseCharts/ExerciseDashboardFilters.tsx:82-97); no hay insights textuales
  - Móvil (Sí): ReportHighlights + ReportInsights en Nutrición (SparkyFitnessMobile/src/screens/NutritionReportScreen.tsx:355-360), Hidratación (HydrationReportScreen.tsx:209-214), Cafeína/alcohol (SubstancesReportScreen.tsx:327-332), Sueño (SleepAnalyticsScreen.tsx:513-518), Mediciones (MeasurementsReportScreen.tsx:349-354), Ánimo (MoodReportScreen.tsx:213-218)
- **Resumen del periodo de nutrición (balance y adherencia al objetivo)** — Balance neto (consumido vs objetivo), totales, varianza media diaria, días en rango objetivo y aviso de días contados.
  - Web (Sí): Tarjetas 'Net Balance' y 'Avg Daily Variance', 'days in target range' y mensaje de cobertura (SparkyFitnessFrontend/src/pages/Reports/NutritionPeriodSummary.tsx:330-370,520-590)
  - Móvil (Parcial): Tarjeta 'Calorie goal' con días dentro del 10%, por encima, por debajo y media vs objetivo (SparkyFitnessMobile/src/screens/NutritionReportScreen.tsx:176-220,433-440) y cifras clave (calorías medias, proteína media, días en objetivo, días registrados)
  - Nota: Móvil: solo calorías, sin balance neto acumulado ni soporte de objetivos tipo rango (target min/max) por nutriente.
- **Selector multi-nutriente del resumen** — Elegir uno o varios nutrientes (incluidos personalizados) para el resumen y el gráfico diario, con uno primario.
  - Web (Sí): DropdownMenu de checkboxes con '(Primary)' (SparkyFitnessFrontend/src/pages/Reports/NutritionPeriodSummary.tsx:86-90,478-512); opciones de CENTRAL_NUTRIENT_CONFIG + nutrientes personalizados (líneas 100-140)
  - Móvil (Parcial): No hay selector en el informe; en Personalizar informes se eligen y ordenan los nutrientes de la tarjeta 'Your nutrients' (incluye personalizados) (SparkyFitnessMobile/src/screens/ReportsSettingsScreen.tsx:428-454)
  - Nota: En móvil la selección solo afecta a la lista de medias, no a gráficos superpuestos.
- **Gráfico diario de calorías/nutriente con objetivo** — Serie diaria del nutriente con línea de objetivo (o banda de rango objetivo) y media del periodo.
  - Web (Sí): LineChart con ReferenceLine/ReferenceArea de objetivo/rango y 'Avg' (SparkyFitnessFrontend/src/pages/Reports/NutritionPeriodSummary.tsx:594-700), objetivo de calorías ajustado por ejercicio (calorieBalanceByDate)
  - Móvil (Parcial): CaloriesBarChart de barras apiladas por macros (carbos/grasa/proteína/otros) con objetivo y media (SparkyFitnessMobile/src/screens/NutritionReportScreen.tsx:361-370; src/components/charts/caloriesStackLayout.ts)
  - Nota: Móvil solo para calorías (otros nutrientes en la pantalla de tendencia individual); a cambio muestra la composición por macros en cada barra.
- **Cuadrícula de gráficos por nutriente** — Un gráfico por nutriente (macros, grasas, micronutrientes, cafeína, agua, alcohol, personalizados) con línea de objetivo y media.
  - Web (Sí): NutritionChartsGrid filtrado por preferencias 'report_chart' escritorio/móvil (SparkyFitnessFrontend/src/pages/Reports/NutritionChartsGrid.tsx:72-75,239-370); renderizado en Reports.tsx:230-237
  - Móvil (Parcial): Un nutriente cada vez en NutrientTrendsScreen (SparkyFitnessMobile/src/screens/NutrientTrendsScreen.tsx:27-135), abierto desde 'Trend by nutrient' (proteína/carbos/grasa) (NutritionReportScreen.tsx:553-580), desde cada fila de nutriente (NutritionReportScreen.tsx:128-135) o desde Detalles nutricionales del diario (DailyNutritionDetailsScreen.tsx:304)
- **Estadísticas de tendencia de un nutriente** — Para un nutriente: media diaria, día de mayor ingesta, objetivo diario y media vs objetivo.
  - Web (Parcial): Cada gráfico de NutritionChartsGrid muestra solo 'Avg' y la línea de objetivo (SparkyFitnessFrontend/src/pages/Reports/NutritionChartsGrid.tsx:239-370)
  - Móvil (Sí): 'Summary Statistics': Daily Average, Highest Intake Day, Target Daily Goal, Average vs. Target (SparkyFitnessMobile/src/screens/NutrientTrendsScreen.tsx:139-210) con rango propio 7d/30d/90d (línea 27,119-125)
- **Medias diarias de nutrición** — Tarjeta con medias de calorías y macros y días registrados del periodo.
  - Web (Parcial): Solo 'Avg: X' en la cabecera de cada gráfico (SparkyFitnessFrontend/src/pages/Reports/NutritionPeriodSummary.tsx:604-614; NutritionChartsGrid.tsx:250-262)
  - Móvil (Sí): 'Daily averages' (SparkyFitnessMobile/src/screens/NutritionReportScreen.tsx:373-415)
- **Cumplimiento de objetivos de macros** — Media de cada macro frente a su objetivo (g y % de objetivo).
  - Web (Parcial): Solo líneas de objetivo en cada gráfico de macro y balance neto del nutriente seleccionado (SparkyFitnessFrontend/src/pages/Reports/NutritionChartsGrid.tsx:96-120; NutritionPeriodSummary.tsx:520-590)
  - Móvil (Sí): 'Macro goals' (SparkyFitnessMobile/src/screens/NutritionReportScreen.tsx:464-484)
- **Tarjetas de grasas, vitaminas/minerales y 'Tus nutrientes'** — Medias del periodo del desglose de grasas, micronutrientes y nutrientes elegidos (incluidos personalizados) con % de objetivo y cambio vs. periodo anterior; cada fila abre su tendencia.
  - Web (Parcial): Estos nutrientes solo aparecen como gráficos individuales en NutritionChartsGrid si están activados en 'Report (Chart)' (SparkyFitnessFrontend/src/pages/Reports/NutritionChartsGrid.tsx:72-75); sin tarjetas de medias
  - Móvil (Sí): 'Fat breakdown', 'Vitamins and minerals', 'Your nutrients' (SparkyFitnessMobile/src/screens/NutritionReportScreen.tsx:529-552; listas FAT_BREAKDOWN_NUTRIENTS/MICRONUTRIENTS en src/constants/reports.ts)
- **Alcohol semanal frente a límite** — Bebidas estándar de la semana frente al límite semanal, con desglose por día y estado (por encima/por debajo/sin límite).
  - Web (Sí): WeeklyAlcoholCard 'Weekly Alcohol Intake' (SparkyFitnessFrontend/src/pages/Reports/WeeklyAlcoholCard.tsx:15-60); pestaña Nutrientes (Reports.tsx:212-214)
  - Móvil (Parcial): 'Week by week' muestra gramos de alcohol (y cafeína media) por semana, sin bebidas estándar ni límite semanal (SparkyFitnessMobile/src/screens/SubstancesReportScreen.tsx:306-323,396-408)
- **Gráfico y resumen diario de alcohol** — Barras diarias de alcohol, días con alcohol, media esos días, día máximo, días sin alcohol y cambio vs periodo anterior.
  - Web (Parcial): Solo como gráfico genérico de 'alcohol_g' en NutritionChartsGrid si está activado (SparkyFitnessFrontend/src/constants/nutrients.ts:245; NutritionChartsGrid.tsx)
  - Móvil (Sí): Gráfico 'Alcohol' y resumen (SparkyFitnessMobile/src/screens/SubstancesReportScreen.tsx:366-395; cifras 149-164, insights 218-222)
- **Informe de cafeína con límite diario** — Barras diarias de cafeína con línea de límite, media en días con cafeína, días por encima del límite y día máximo.
  - Web (Parcial): Solo gráfico genérico de 'caffeine_mg' en NutritionChartsGrid si está activado (SparkyFitnessFrontend/src/constants/nutrients.ts:218), sin análisis de límite
  - Móvil (Sí): TrendBarChart 'Caffeine' con goalValues=limitMg y tarjeta 'Caffeine' (SparkyFitnessMobile/src/screens/SubstancesReportScreen.tsx:333-365; filas 233-260)
- **Resumen de peso** — Último peso, cambio en el periodo, mínimo/máximo y distancia al peso objetivo.
  - Web (Parcial): Solo la línea de resumen de tendencia del widget de peso (SparkyFitnessFrontend/src/pages/Reports/MeasurementChartsGrid.tsx:515-560)
  - Móvil (Sí): Tarjeta 'Weight' (SparkyFitnessMobile/src/screens/MeasurementsReportScreen.tsx:175-220,366-371)
- **Gráficos de composición corporal** — Gráficos de % grasa, masa muscular, masa ósea, % agua corporal y TMB.
  - Web (Sí): Widgets bodyFatPercentage, muscleMass, boneMass, bodyWaterPercentage, bmr (SparkyFitnessFrontend/src/pages/Reports/MeasurementChartsGrid.tsx:384-450)
  - Móvil (Parcial): Solo 'Body composition' con filas de % grasa y masa muscular (último valor y cambio), sin gráficos ni masa ósea/agua/TMB (SparkyFitnessMobile/src/screens/MeasurementsReportScreen.tsx:131-146,372-380)
- **Gráficos de medidas corporales (cinta)** — Gráficos de cuello, cintura, cadera y altura.
  - Web (Sí): Widgets neck, waist, hips, height (SparkyFitnessFrontend/src/pages/Reports/MeasurementChartsGrid.tsx:328-382)
  - Móvil (Parcial): 'Body measurements' con filas de cintura, cadera y cuello (último y cambio), sin gráficos ni altura (SparkyFitnessMobile/src/screens/MeasurementsReportScreen.tsx:147-174,381-388)
- **Body Battery** — Batería corporal (cargado/drenado, máximo, al despertar, mínimo, medidor y tendencia) a partir de mediciones personalizadas tipo Garmin.
  - Web (Sí): BodyBatteryCard + BodyBatteryGauge (SparkyFitnessFrontend/src/pages/Reports/BodyBatteryCard.tsx, BodyBatteryGauge.tsx); pestaña Mediciones (Reports.tsx:252-257)
  - Móvil (Parcial): Solo 'Body battery gained' por noche como gráfico de barras en Análisis de sueño (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:139,565-585)
- **Respiración diaria (sueño vs. despierto)** — Medias diarias de respiración durante el sueño y despierto, con tendencia.
  - Web (Sí): RespirationCard 'Sleep Avg' / 'Awake Avg' / 'Trend' (SparkyFitnessFrontend/src/pages/Reports/RespirationCard.tsx); pestaña Mediciones (Reports.tsx:258-263)
  - Móvil (Parcial): Solo respiración nocturna por noche ('Respiration') en Análisis de sueño (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:123,565-585)
- **Resumen de estado de ánimo** — Media de ánimo, días registrados, mejor/peor día, media por día de la semana y estados más registrados.
  - Web (Parcial): Solo 'Most common moods' dentro de MoodChart (SparkyFitnessFrontend/src/pages/Reports/MoodChart.tsx)
  - Móvil (Sí): 'Summary', 'Highlights', 'Average by weekday', 'Most logged' (SparkyFitnessMobile/src/screens/MoodReportScreen.tsx:240-290)
- **Resumen de la última noche** — Duración, puntuación, FC en reposo, batería, momentos inquietos, SpO2, HRV y respiración de la noche más reciente.
  - Web (Sí): SleepSummaryCard 'Last Night' (SparkyFitnessFrontend/src/pages/Reports/SleepSummaryCard.tsx; SleepAnalyticsCharts.tsx:298)
  - Móvil (Parcial): No está en el informe; el detalle por noche se abre desde las tarjetas de sueño del Diario (src/components/SleepCards.tsx:182) en SleepDetailScreen con duración, puntuación, fases y biometría nocturna (src/screens/SleepDetailScreen.tsx:199-203; src/components/SleepBiometrics.tsx:39-76)
- **Hipnogramas por noche** — Lista de hipnogramas de cada noche del periodo con 'Mostrar todo/menos'.
  - Web (Sí): 'Nightly Details' con SleepStageChart por noche (SparkyFitnessFrontend/src/pages/Reports/SleepAnalyticsCharts.tsx:307-335; SleepStageChart.tsx)
  - Móvil (Parcial): Hypnogram solo dentro de SleepDetailScreen de una noche concreta (SparkyFitnessMobile/src/screens/SleepDetailScreen.tsx:201), no en Análisis de sueño
- **Fases del sueño en el periodo** — Distribución de Profundo, REM, Ligero y Despierto a lo largo del periodo.
  - Web (Sí): Gráfico de barras apiladas 'Sleep Stages' por noche (SparkyFitnessFrontend/src/pages/Reports/SleepAnalyticsCharts.tsx:350-427)
  - Móvil (Parcial): Tarjeta 'Average night' con porcentaje medio de cada fase, sin gráfico por noche (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:519-557)
- **Consistencia de horarios de sueño** — Horas de acostarse y levantarse a lo largo del periodo.
  - Web (Sí): Gráfico 'Sleep Consistency' Bedtime/Wake Time (SparkyFitnessFrontend/src/pages/Reports/SleepAnalyticsCharts.tsx:429-540)
  - Móvil (Parcial): Tarjeta 'Routine' con hora media de acostarse/levantarse y variación ±min (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:558-564); gráfico de franjas solo en Tendencias de salud del Dashboard (SleepTimelineChart, src/components/HealthTrendsPager.tsx:105)
- **Gráfico de tiempo dormido por noche** — Barras del tiempo dormido de cada noche.
  - Web (Parcial): El total por noche solo se lee en el gráfico apilado de fases y en la tabla (SparkyFitnessFrontend/src/pages/Reports/SleepAnalyticsCharts.tsx:237,350-427; SleepAnalyticsTable.tsx)
  - Móvil (Sí): Métrica 'Time asleep' (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:83,565-585)
- **Gráfico de puntuación de sueño** — Puntuación de sueño de cada noche en el periodo.
  - Web (Parcial): Solo columna 'Score' de la tabla y tarjeta de la última noche (SparkyFitnessFrontend/src/pages/Reports/SleepAnalyticsTable.tsx; SleepSummaryCard.tsx)
  - Móvil (Sí): Métrica 'Sleep score' (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:91,565-585)
- **Estadísticas de noches y medias del periodo** — Noches de 7 h o más, noche más larga/corta, noches registradas y medias del periodo.
  - Web (Parcial): Datos por noche en SleepAnalyticsTable (SparkyFitnessFrontend/src/pages/Reports/SleepAnalyticsTable.tsx), sin agregados de este tipo
  - Móvil (Sí): 'Nights' y 'Period averages' (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:597-610)
- **Eficiencia del sueño** — Tiempo dormido como porcentaje del tiempo en cama.
  - Web (Sí): Gráfico 'Sleep Efficiency' (SparkyFitnessFrontend/src/pages/Reports/SleepAnalyticsCharts.tsx:660-760) y columna Efficiency de la tabla
  - Móvil (Parcial): Solo valor medio en 'Routine'/'Period averages' (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:307,413), sin gráfico
- **HRV nocturna** — Estado de HRV con media, línea base, tendencia diaria y serie intranoche.
  - Web (Sí): HRVCard con conmutador Trend / Night Series y Baseline (SparkyFitnessFrontend/src/pages/Reports/HRVCard.tsx:183; SleepAnalyticsCharts.tsx:765)
  - Móvil (Parcial): Barras 'Overnight HRV' por noche, sin línea base ni serie intranoche (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:99,565-585)
- **Oxígeno en sangre (SpO2)** — Tendencia de SpO2, mediciones puntuales, media y mínimo.
  - Web (Sí): SpO2Card 'Pulse Ox (SpO2)' con 'Spot Tests' (SparkyFitnessFrontend/src/pages/Reports/SpO2Card.tsx:131; SleepAnalyticsCharts.tsx:764)
  - Móvil (Parcial): Barras 'Blood oxygen (SpO2)' por noche (SparkyFitnessMobile/src/screens/SleepAnalyticsScreen.tsx:115); media/mínimo/máximo solo por noche en SleepDetail (src/components/SleepBiometrics.tsx:39-53); sin mediciones puntuales
- **Vistas del informe de ejercicio** — Cambiar entre vistas del panel de ejercicio.
  - Web (Sí): Tres vistas: Todo / Fuerza y resistencia / Cardio y GPS (SparkyFitnessFrontend/src/pages/Reports/ExerciseReportsDashboard.tsx:771-810)
  - Móvil (Parcial): Dos vistas Strength / Cardio (SparkyFitnessMobile/src/screens/ExerciseStatisticsScreen.tsx:606-620)
  - Nota: Móvil no tiene vista combinada 'Todo'.
- **Récords personales en el informe** — Insignias de récords de cardio por distancia y de fuerza (1RM estimado, peso).
  - Web (Sí): CardioPRBadgesWidget con PRs de cardio y de fuerza (SparkyFitnessFrontend/src/components/ExerciseCharts/CardioPRBadgesWidget.tsx; ExerciseReportsDashboard.tsx:864)
  - Móvil (Parcial): Pantalla aparte 'Personal records' solo de cardio, accesible desde Biblioteca o resumen de carrera (SparkyFitnessMobile/src/screens/LibraryScreen.tsx:452; PersonalRecordsScreen.tsx; src/hooks/usePersonalRecords.ts)
- **Mapa de calor de entrenamientos** — Calendario de 12 meses con días entrenados, navegación anterior/siguiente y marcado del rango del informe.
  - Web (Sí): WorkoutHeatmap (SparkyFitnessFrontend/src/pages/Reports/WorkoutHeatmap.tsx:15-34; ExerciseReportsDashboard.tsx:871)
  - Móvil (Parcial): Solo la cuadrícula de días de las últimas semanas dentro de Constancia de entrenamiento (SparkyFitnessMobile/src/components/exerciseStats/TrainingConsistencyCard.tsx:180-233)
- **Series por músculo en el rango** — Series de trabajo por músculo primario en el rango, con barras y selección que resalta el músculo en la figura.
  - Web (Parcial): Las series por músculo se ven al tocar en MuscleHeatmap y en Constancia (esta semana vs. anterior) (SparkyFitnessFrontend/src/components/ExerciseCharts/MuscleHeatmap.tsx:41-70)
  - Móvil (Sí): 'Sets per Muscle' (SparkyFitnessMobile/src/screens/ExerciseStatisticsScreen.tsx:334-395)
- **Variedad de ejercicios** — Puntuación/recuento de ejercicios únicos por grupo muscular.
  - Web (Sí): ExerciseVarietyScore 'Exercise Variety Score' (SparkyFitnessFrontend/src/pages/Reports/ExerciseVarietyScore.tsx; ExerciseReportsDashboard.tsx:390)
  - Móvil (Parcial): Lista plegable 'Exercise Variety' con nº de ejercicios por músculo, sin gráfico ni puntuación (SparkyFitnessMobile/src/screens/ExerciseStatisticsScreen.tsx:537-555)
- **Volumen por grupo muscular** — Volumen de entrenamiento acumulado por grupo muscular.
  - Web (Sí): TrainingVolumeByMuscleGroupChart (SparkyFitnessFrontend/src/components/ExerciseCharts/TrainingVolumeByMuscleGroupChart.tsx; ExerciseReportsDashboard.tsx:495)
  - Móvil (Parcial): Lista plegable 'Volume by Muscle' sin gráfico (SparkyFitnessMobile/src/screens/ExerciseStatisticsScreen.tsx:556-572)
- **Progresión y visualización de récords de fuerza** — Evolución de PRs y tarjeta de 1RM estimado, peso máximo y repeticiones máximas por ejercicio.
  - **Cubierto en parte por la PR #3008 (fusionada):** En el móvil, la pestaña Historial de cada ejercicio tiene ahora una tarjeta Esfuerzo con dos 1RM estimados, uno solo a partir de las repeticiones y otro contando las que quedaban según el RPE, ambos calculados únicamente con las series registradas con RPE. El móvil sigue sin gráfico de progresión de récords y sin máximo de repeticiones, que la web muestra en Informes.
  - Web (Sí): PrProgressionChart y PrVisualizationWidget (SparkyFitnessFrontend/src/pages/Reports/PrProgressionChart.tsx; ExerciseReportsDashboard.tsx:363,558)
  - Móvil (Parcial): No existe en SparkyFitnessMobile/src (los PR móviles son solo de cardio)
  - _Verificación: corregido por verificación_
- **Carga de entrenamiento** — Carga de esta semana frente a las 4 anteriores (minutos ponderados por intensidad de FC), veredicto y consejo de descanso; tarjeta resumida en Dashboard.
  - **Cubierto en parte por las PR #3108 y #3155 (fusionadas):** En la web, Informes > Progreso de ejercicio tiene ya la tarjeta 'Readiness and Form', que también se ha añadido a Estadísticas de ejercicios en el móvil: estado físico, fatiga y forma a partir de la misma carga por sesión ponderada por la frecuencia cardiaca que usa la carga de entrenamiento, y una puntuación de preparación (forma, sueño, frecuencia cardiaca en reposo y HRV) con un consejo sobre si entrenar fuerte o descansar. Como en el móvil, Informes > Compare permite además comparar la carga de entrenamiento diaria con otra métrica. La web sigue sin la tarjeta de carga de entrenamiento (esta semana frente a las cuatro anteriores, con veredicto y consejo de descanso) y sin una tarjeta de resumen como la del Dashboard del móvil, que ahora muestra también una línea de preparación.
  - Web (Parcial): Solo el valor de carga aguda/semanal/crónica que reporta el dispositivo, como cifra diaria en el Diario (SparkyFitnessFrontend/src/components/Health/DailyHealthMetricsCard.tsx:95-96,281-320); nada en Informes
  - Móvil (Sí): TrainingLoadCard (SparkyFitnessMobile/src/components/exerciseStats/TrainingLoadCard.tsx:25-165; ExerciseStatisticsScreen.tsx:191-197) y TrainingLoadDashboardCard que abre Exercise Statistics (src/components/TrainingLoadDashboardCard.tsx:36-40,100; DashboardScreen.tsx:900)
- **Gráficos de cadencia y elevación** — Cadencia y perfil de elevación a lo largo de la actividad.
  - **Cubierto en parte por las PR #3014 y #3135 (fusionadas):** La pantalla de sesión de cardio del móvil muestra ya la cadencia media y la longitud de zancada como cifras cuando la actividad las tiene, y su tabla de parciales (en actividades con track GPS) da el desnivel de cada parcial. El móvil sigue sin gráficos de cadencia ni de elevación a lo largo de la actividad, que la web sí tiene.
  - Web (Sí): ActivityCadenceChart y ActivityElevationChart (SparkyFitnessFrontend/src/pages/Reports/ActivityReportVisualizer.tsx:674,684)
  - Móvil (Parcial): Solo la cifra 'Elevation gain' y pisos subidos, sin gráficos ni cadencia (SparkyFitnessMobile/src/screens/CardioSessionScreen.tsx:96-130)
- **Tabla de vueltas (laps)** — Tabla por vuelta con tiempo, distancia, calorías y totales.
  - **Cubierto en parte por la PR #3135 (fusionada):** La pantalla de sesión de cardio del móvil tiene ya una tabla de parciales para cualquier actividad con track GPS guardado, con el ritmo, el desnivel y la frecuencia cardiaca media de cada km o milla. Sigue sin ser una tabla de vueltas: las vueltas marcadas durante una carrera solo aparecen en el resumen justo al terminarla, no hay calorías ni totales por vuelta y las actividades sin track GPS no tienen parciales.
  - Web (Sí): ActivityReportLapTable 'Laps' (SparkyFitnessFrontend/src/pages/Reports/ActivityReportLapTable.tsx; ActivityReportVisualizer.tsx:727)
  - Móvil (Parcial): Sin tabla de vueltas en CardioSessionScreen.tsx
  - _Verificación: corregido por verificación_
- **Estadísticas detalladas de la actividad** — Cuadrícula de estadísticas de una actividad: tiempos, ritmo, elevación, clima, equipo, evento, recorrido, pérdida de agua.
  - Web (Sí): ActivityStatsGrid con Moving/Elapsed Time, Avg Moving Pace, Min/Max Elev, Weather, Gear, Water Loss (SparkyFitnessFrontend/src/components/ExerciseCharts/ActivityStatsGrid.tsx; ActivityReportVisualizer.tsx:554-607)
  - Móvil (Parcial): Distancia, duración, ritmo, pisos, desnivel, FC media y calorías (SparkyFitnessMobile/src/screens/CardioSessionScreen.tsx:58-160,273-285) más selector de zapatillas (287) y botón Editar actividad
- **Tendencia e historial de ayunos** — Gráfico de tendencia de ayuno y tabla de historial (inicio, fin, duración, protocolo, en curso).
  - Web (Sí): 'Fasting History' tabla (SparkyFitnessFrontend/src/pages/Reports/FastingReport.tsx:352-420) y 'Fasting Trends' LineChart (471-490)
  - Móvil (Parcial): Lista 'History' de ayunos en FastingDetailScreen (SparkyFitnessMobile/src/screens/FastingDetailScreen.tsx:317-365, FastingHistoryRow) sin gráfico de tendencia
- **Informe de síntomas** — Episodios, días con síntomas y sin síntomas, duración media, hora del día, 'qué vino antes', episodios recientes, exportar CSV e imprimir para el médico.
  - Web (Sí): Pestaña Síntomas (SparkyFitnessFrontend/src/pages/Reports/Reports.tsx:414-419; src/pages/Symptoms/SymptomsReport.tsx)
  - Móvil (Parcial): SymptomHistoryScreen con '30-Day Insights' (días libres, desencadenantes y alivios principales, episodios en curso) accesible desde SymptomsCard (SparkyFitnessMobile/src/screens/SymptomHistoryScreen.tsx:261-340; src/components/SymptomsCard.tsx:136); sin CSV ni impresión
- **Nutrientes visibles en gráficos y tablas de informes** — Preferencia de qué nutrientes aparecen en los gráficos y en la tabla de informes (por escritorio/móvil).
  - Web (Sí): Grupos 'Report (Chart)' y 'Report (Tabular)' en Ajustes → Visualización de nutrientes (SparkyFitnessFrontend/src/pages/Settings/NutrientDisplaySettings.tsx:77-86,579-586); consumido en NutritionChartsGrid.tsx:72-75
  - Móvil (Parcial): Solo el selector de 'Nutrition report nutrients' en Personalizar informes (SparkyFitnessMobile/src/screens/ReportsSettingsScreen.tsx:428-454); el grupo report_tabular móvil gobierna Detalles nutricionales, no informes, y report_chart no se expone (src/screens/NutrientDisplaySettingsScreen.tsx:36-41)
- **Tendencias de salud en el Dashboard** — Carrusel deslizable de gráficos de pasos, peso, sueño, hidratación, calorías y VO2 max con rango 7/30/90 y enlace a Informes.
  - **Actualizado en las PR #3143 y #3155 (fusionadas):** El carrusel del móvil tiene ya también una página Resting Heart Rate, que solo aparece cuando hay lecturas, y, sin VO2 max sincronizado en el periodo elegido, su página de VO2 max muestra una estimación a partir de las carreras registradas, con un título que indica que es estimada. La web sigue sin carrusel: su tendencia de frecuencia cardiaca en reposo está en la nueva pestaña Heart Rate Analytics de Informes, y el Diario mantiene sus minigráficos de nutrición de 14 días.
  - Web (Parcial): El Diario web solo muestra valores del día en DailyHealthMetricsCard (SparkyFitnessFrontend/src/components/Health/DailyHealthMetricsCard.tsx; Diary.tsx:24)
  - Móvil (Sí): Caso 'healthTrends' del Dashboard (SparkyFitnessMobile/src/screens/DashboardScreen.tsx:842-890) con HealthTrendsPager (src/components/HealthTrendsPager.tsx:96-117; src/constants/healthTrends.ts)
  - _Verificación: corregido por verificación_
- **Personalizar tendencias de salud** — Reordenar y ocultar los gráficos del carrusel de Tendencias de salud.
  - Web (Parcial): No existe equivalente
  - Móvil (Sí): HealthTrendsSettingsScreen con ReorderSwitchList (SparkyFitnessMobile/src/screens/HealthTrendsSettingsScreen.tsx:47-90), desde Ajustes del Dashboard (src/screens/DashboardSettingsScreen.tsx:465-466)
  - _Verificación: corregido por verificación_
- **Tendencia de VO2 max** — Gráfico de evolución del VO2 max en el tiempo.
  - **Cubierto en parte por la PR #3155 (fusionada):** Informes > Progreso de ejercicio en la web y Estadísticas de ejercicios en el móvil tienen ya la misma tarjeta Running Estimates, con un único VO2 max estimado ('≈', a partir de las carreras de las últimas 6 semanas); es una sola cifra, no una tendencia. Cuando no se ha sincronizado ningún VO2 max en el periodo elegido, la tendencia de VO2 max del Dashboard del móvil muestra ahora una estimación por cada día con carrera de esas 6 semanas, con el título 'VO2 max (estimated)'; una lectura sincronizada siempre la sustituye, y la web no tiene nada parecido.
  - Web (Parcial): Solo el último valor diario en el Diario (SparkyFitnessFrontend/src/components/Health/DailyHealthMetricsCard.tsx:93,228-240); sin gráfico en Informes
  - Móvil (Sí): Vo2MaxLineChart en Tendencias de salud (SparkyFitnessMobile/src/components/HealthTrendsPager.tsx:117; src/hooks/useVo2MaxRange.ts con datos del servidor)
- **Gráfico diario de agua con línea de objetivo** — Gráfico de agua por día que dibuja el objetivo diario de hidratación de cada día.
  - Web (Parcial): HydrationTrendChart dibuja solo la línea de agua y la 'Avg' en la cabecera, sin línea de objetivo (SparkyFitnessFrontend/src/pages/Reports/HydrationTrendChart.tsx:66,94-98,156).
  - Móvil (Sí): HydrationBarChart con goals por día en el informe de Hidratación y en Tendencias de salud (SparkyFitnessMobile/src/screens/HydrationReportScreen.tsx:215-223; src/components/HydrationBarChart.tsx:22-23,84,103; HealthTrendsPager.tsx:107).
  - _Verificación: añadido durante la verificación_

#### En ambos clientes, pero con diferencias iOS/Android (1)

- **Mapa de la ruta GPS de la actividad** · _Difiere iOS/Android_ — Ruta de una sesión de cardio dibujada sobre un mapa.
  - Web (Sí): ActivityReportMap con react-leaflet (SparkyFitnessFrontend/src/pages/Reports/ActivityReportMap.tsx; ActivityReportVisualizer.tsx:463-480,598)
  - Móvil (Sí): RouteMap en CardioSessionScreen (SparkyFitnessMobile/src/screens/CardioSessionScreen.tsx:298; src/components/exerciseStats/RouteMap.tsx, RouteTileMap.tsx, RouteLine.tsx)
  - iOS/Android: iOS siempre dibuja sobre Apple Maps. Android solo usa Google Maps si la build incluye GOOGLE_MAPS_ANDROID_API_KEY (androidGoogleMapsEnabled); sin clave muestra solo la línea de la ruta sin mapa de fondo (src/utils/routeMapSupport.ts:14-21; app.config.ts:20-22,283-287,322).

<details><summary>En paridad web ↔ móvil (19)</summary>

- Punto de entrada y navegación de Informes
  - **Actualizado en las PR #3076, #3108 y #3143 (fusionadas):** Las dos tienen ahora un informe de frecuencia cardiaca y Compare: la web como dos pestañas más (Heart Rate Analytics y Compare, 11 en total) y el móvil como dos enlaces más en el hub (Heart Rate y Compare, 9 informes que se pueden seguir reordenando u ocultando). El resto no cambia: la web sigue teniendo las pestañas Ayuno, Medicamentos, Síntomas y Tabla, que faltan en el hub del móvil, y el móvil sigue teniendo informes propios de Hidratación y de Cafeína y alcohol.
- Gráfico de hidratación diaria
- Gráfico de peso con tendencia y proyección del objetivo
- Gráfico de pasos diarios
- Gráfico de estado de ánimo diario
  - **Actualizado en las PR #3016 y #3018 (fusionadas):** Las dos apps dibujan ahora un valor de ánimo por día con la misma regla compartida (la media de los registros manuales del día o, si no los hay, el ánimo sincronizado desde Garmin o importado), y ningún tooltip muestra notas. El tooltip de la web muestra el valor del ánimo con su emoji y su etiqueta y el número de registros del día; el del móvil solo muestra el ánimo y la fecha.
- Frecuencia cardiaca en reposo durante el sueño
- Respiración nocturna
- Estadísticas clave de entrenamiento
- Constancia de entrenamiento
- Mapa de calor muscular
- Recuperación por grupo muscular
- Tendencias de carrera y estimación de tiempos
- Lista de sesiones de cardio
- Gráfico de ritmo de la actividad
- Frecuencia cardiaca y zonas de FC de la actividad
  - **Actualizado en las PR #3078, #3143 y #3165 (fusionadas):** Las dos siguen mostrando el gráfico de frecuencia cardiaca de la sesión y el tiempo en cada zona, y las dos indican ahora cómo se calcularon las zonas cuando ese dato está guardado. El gráfico de la sesión en la web colorea ya la línea según las zonas de la persona, con una línea discontinua en cada límite de zona y una leyenda con sus rangos en ppm; el del móvil sigue siendo una línea simple.
- Informe de ayuno: totales y duración diaria
- Zonas/etapas de ayuno alcanzadas
- Mapa de calor de constancia de ayuno (90 días)
- Informe de ayuno: cifras, duración diaria, fases y mapa de constancia

</details>

### 2.9 Medicación, GLP-1 y síntomas

#### Solo en la web (28)

- **KPIs del botiquín** — Fichas con recuentos: tratamientos activos, medicamentos GLP-1, programados hoy y total.
  - Web (Sí): Medications.tsx:350-397 (Active scripts, GLP-1 meds, Scheduled today, Total meds).
- **Valoración de eficacia (1-5 estrellas)** — Puntuar qué tan eficaz es un medicamento.
  - Web (Sí): Opciones avanzadas AddMedicationDialog.tsx:1203-1248; visualización en Medications.tsx:635-659.
- **Foto de pastilla / envase** — URL de una foto del medicamento mostrada en la ficha.
  - Web (Sí): Campo 'Pill / Label Photo URL' en AddMedicationDialog.tsx:1251-1264; imagen en Medications.tsx:612-632.
- **Crear nutriente propio (no listado)** — Añadir un nutriente de texto libre con su unidad al suplemento.
  - Web (Sí): Pie 'Not listed? Create your own' con nombre y unidad en NutrientPicker.tsx:~420-450 (createFreeText).
- **Unidades por ración ('1 ración = N cápsulas')** — Definir cuántas cápsulas/comprimidos forman una ración del suplemento.
  - Web (Sí): AddMedicationDialog.tsx:975-1002 (NumericInput units-per-serving).
- **'% procedente de suplementos' en informes de nutrición** — En los gráficos de nutrición, indica qué parte de un nutriente vino de suplementos.
  - Web (Sí): NutritionChartsGrid.tsx:216-260 (supplementShare, 'reports.supplementShare').
- **Fármaco GLP-1 personalizado** — Definir un GLP-1 no listado con nombre, vida media, tiempo al pico, cadencia y vía oral.
  - Web (Sí): Opción 'Custom GLP-1 / Other...' con campos en AddMedicationDialog.tsx:819-927.
- **Posponer dosis (Snooze)** — Marcar una dosis programada como pospuesta.
  - **Cubierto en parte por la PR #3103 (fusionada):** En el móvil, una dosis programada que ya está registrada se puede cambiar a Snoozed (pospuesta) en «Edit logged dose», y las entradas pospuestas aparecen en el registro del día y en el calendario. Sigue sin haber botón para posponer al registrar: las filas de dosis solo registran u omiten, y el botón «Remind in» del recordatorio solo vuelve a mostrar el aviso más tarde, sin guardar la dosis como pospuesta.
  - Web (Sí): Botón 'Snooze' (status 'snoozed') en TodayMedications.tsx:371-376.
- **Nota al registrar una dosis** — Añadir un comentario a una dosis programada o PRN al registrarla.
  - **Cubierto en parte por la PR #3103 (fusionada):** En el móvil se puede añadir o cambiar una nota después de registrar la dosis, en «Edit logged dose» (que se abre desde el registro del día de la pantalla Adherence), y ese registro muestra las notas de todas las entradas. Al registrar una dosis programada o según necesidad sigue sin haber campo de nota, a diferencia del campo «Add note...» que la web tiene en cada dosis.
  - Web (Sí): Campo de nota por dosis (TodayMedications.tsx:329) y 'Add note...' para PRN (461).
- **Editar dosis registrada** — Cambiar la hora de toma, el sitio de inyección o las notas de una dosis ya registrada.
  - **Actualizado en la PR #3103 (fusionada):** El móvil tiene ya «Edit logged dose», que se abre desde el registro del día de la pantalla Adherence: cambia la hora, las notas, la zona de una inyección y, a diferencia de la web, el estado (tomada, omitida o pospuesta) de una dosis programada que no sea una inyección. Solo se cambia la hora del día, así que una dosis no se puede pasar a otro día como con el campo de fecha y hora de la web, y los textos nuevos de la pantalla siguen en inglés en todos los demás idiomas que trae la app.
  - Web (Sí): Diálogo 'Edit logged dose' (TodayMedications.tsx:1342-1398).
- **Estadísticas de adherencia** — KPIs 'Doses today', adherencia a 14 días, días perfectos, anillo de adherencia, tira de 14 días y racha.
  - **Actualizado en la PR #3103 (fusionada):** El móvil muestra ya el mismo resumen de adherencia en una pantalla nueva, Adherence, que se abre desde «Adherence & log» en la lista de Medicación: dosis de hoy, adherencia a 14 días, días perfectos, el anillo, las barras de los últimos 14 días y la racha, calculados con el mismo código compartido que la web. Sus textos nuevos siguen en inglés en todos los demás idiomas que trae la app.
  - Web (Sí): TodayMedications.tsx:824-841 (tiles) y 927-1001 ('Adherence overview', anillo, 'Last 14 days', '{{count}}-day streak').
- **Calendario de registro de medicación** — Calendario mensual con estado diario (todo tomado, parcial, omitido, pospuesto, PRN), filtro por medicamento/suplemento y síntomas de efecto secundario.
  - **Actualizado en la PR #3103 (fusionada):** El móvil tiene el calendario mensual en la pantalla Adherence, con las mismas reglas compartidas que la web: días coloreados como todo tomado, tomado en parte, casi todo omitido, todo omitido o solo pospuesto, un número en los días con más de una dosis, puntos para síntomas de efecto secundario y generales, un filtro para verlo todo o un solo medicamento y el total de dosis del mes; al tocar un día se selecciona. Los recuentos por día y los nombres de síntomas que la web muestra al pasar el ratón solo están en la etiqueta del lector de pantalla en el móvil, y los textos del calendario siguen en inglés en todos los demás idiomas que trae la app.
  - Web (Sí): MedicationLogCalendar.tsx (montado en TodayMedications.tsx:1191-1196; estados y tooltips 'All doses taken', 'Partially taken', 'Snoozed only', 'Side-effect symptom').
- **Personalizar sitios de inyección** — Activar/desactivar y reordenar los sitios de inyección disponibles.
  - Web (Sí): Diálogo 'Customize sites' (InjectionSiteSettings.tsx:95-172; botón en Glp1LogInjection.tsx:101).
- **Registrar inyección desde el checklist diario** — Al pulsar 'Tomar' en una dosis GLP-1 inyectable se pide el sitio y se crea una inyección real (descontando pluma); banner 'próxima inyección' con 'Log shot'.
  - Web (Sí): TodayMedications.tsx:84-87,611-660 (lógica), 861-909 (banner 'Log shot'), Glp1QuickLogDialog.tsx:45-56 ('Where did you inject?').
  - Nota: En móvil la inyección con sitio solo se registra desde el GLP-1 tracker.
- **Temporizador de ayuno para GLP-1 oral** — Temporizador 'comprimido tomado' con indicación de solo agua para GLP-1 orales.
  - Web (Sí): FastingTimer.tsx ('Oral GLP-1 fasting timer', 'Tablet taken — start timer', 'Water only'), montado en Glp1Coach.tsx:81.
- **Informe de Medicación: KPIs y gráficos** — Reports > Medications con adherencia media, nº de inyecciones GLP-1, efectos secundarios, gráficos Náuseas vs dosis, Peso vs objetivo, Tendencia de adherencia, Check-in GLP-1 y tabla de registro diario.
  - Web (Sí): MedicationReports.tsx:469-951 (KPIs 590-635, gráficos 651-951) y MedicationLogTable.tsx (789); pestaña en ReportsControls.tsx:66-67 y Reports.tsx:393.
- **Tarjetas de correlación de efectos secundarios** — Hidratación vs estreñimiento, Proteína vs náuseas, Sueño vs fatiga y Tamaño de dosis vs náuseas.
  - Web (Sí): MedicationReports.tsx:976-1290 (hydration_constipation_card, protein_nausea_card, sleep_fatigue_card, dose_nausea_card).
- **Personalizar gráficos del informe de Medicación** — Elegir qué gráficos/tarjetas se muestran, guardado en el servidor.
  - Web (Sí): 'Customize Charts' en MedicationReports.tsx:484-575; preferencias vía useMedicationDisplayPreferences (src/hooks/useMedicationDisplayPreferences.ts).
- **Informe imprimible para prescriptor y exportación CSV** — Imprimir/guardar PDF con medicamentos activos, titulación, inyecciones y síntomas, y descargar CSV.
  - Web (Sí): MedicationReports.tsx:1304-1580 ('Print / Save PDF Report', 'Download CSV Data', 'Prescriber Medication Report').
- **Registro intestinal (escala de Bristol)** — Seleccionar tipo T1-T7 de la escala de Bristol.
  - Web (Sí): SymptomLogForm.tsx:795-819.
- **Vincular síntoma como efecto secundario de un medicamento** — Asociar el registro a un medicamento como posible efecto secundario.
  - Web (Sí): 'Possible side effect of' en SymptomLogForm.tsx:821-854.
- **Campos personalizados del síntoma** — Definir y rellenar campos propios (número, texto, sí/no, selección, multiselección) por síntoma.
  - Web (Sí): Registro en SymptomLogForm.tsx:856-939; definición 'Your own fields' en SymptomDefinitionEditor.tsx:250-362.
- **Calendario de síntomas con dosis, 'Side-Effect Insights' y sub-tracker GI** — En Medicación > Symptoms: actividad de síntomas superpuesta a las dosis, correlaciones con la toma y náuseas/vómitos/reflujo por semana y Bristol medio.
  - Web (Sí): SymptomHistoryCalendar.tsx:203-466 ('GI sub-tracker', 'Side-Effect Insights & Hints'), usado con variant='medications' en SymptomsHub.tsx:223-229.
- **Gestionar listas de opciones ('Choices')** — Mostrar/ocultar opciones integradas y añadir/quitar opciones propias (localizaciones, cualidades, desencadenantes...).
  - Web (Sí): Pestaña 'Choices' en ManageSymptomsDialog.tsx:89-137,219.
- **Informe de síntomas (Reports > Symptoms)** — KPIs, filtro por síntoma, episodios recientes con contexto (sueño, comida del día anterior, agua), 'Qué vino antes' y gráfico por hora del día.
  - Web (Sí): SymptomsReport.tsx:225-640 (KPIs 225-248, filtro 258-266, episodios 326-414, 'What came before' 493-560, 'Time of day' 565-596); pestaña en ReportsControls.tsx:71-72.
- **Exportar síntomas (CSV / imprimir para el médico)** — Descargar CSV o imprimir el informe de síntomas.
  - Web (Sí): 'Export CSV' y 'Print for a doctor' en SymptomsReport.tsx:285-295.
- **Gestionar medicación/síntomas de otra persona (acceso familiar)** — Delegados con permisos can_manage_medications / can_manage_symptoms actúan en nombre del titular.
  - Web (Sí): Permisos en FamilyAccessManager.tsx:56-57,88-89,110; navegación para delegados en MainLayout.tsx:283-298,357-370; SymptomsPanel.tsx comprueba el permiso.
- **Categoría 'Medications' en el selector de herramientas del chat** — Activar o recortar las herramientas de medicación que puede usar Sparky en el chat.
  - Web (Sí): ChatToolCategoriesSelector.tsx:28 (categoría 'medications').
  - Nota: Solo se compara el selector; las herramientas del servidor no se han revisado.

#### Solo en el móvil (13)

- **Activar / desactivar medicamento** — Marcar un medicamento como inactivo sin borrarlo.
  - Móvil (Sí): Interruptor 'Active' en MedicationFormScreen.tsx:1142-1150 (enviado en 688 y 739); los inactivos se agrupan en MedicationsListScreen.tsx:215-239.
- **Escanear código de barras del suplemento para autocompletar** — Buscar el producto (NIH DSLD u Open Food Facts) por código de barras y rellenar nutrientes.
  - Móvil (Sí): Botón 'Scan barcode to fill in' (MedicationFormScreen.tsx:957-981) que abre FoodScan en modo capture-barcode y procesa el código (391-428, useSupplementLookup).
- **Escanear etiqueta 'Supplement Facts' (foto)** · _Difiere iOS/Android_ — Fotografiar o elegir una foto de la etiqueta para leer los nutrientes automáticamente.
  - Móvil (Sí): 'Scan label to fill in' con 'Take photo'/'Choose photo' (MedicationFormScreen.tsx:276-389,983-1002); useSupplementLabelScan.ts:23 intenta primero scanSupplementLabelOnDevice (services/onDeviceSupplementScan.ts:177) y si no, IA del servidor.
  - iOS/Android: En iOS se intenta primero el modelo on-device de Apple (modules/on-device-nutrition solo tiene carpeta ios/, FoundationModels iOS 27+ con Apple Intelligence, ajuste 'Scan Labels On Device'); en Android siempre se usa la IA del servidor.
- **Editar pauta existente** — Modificar una regla de horario ya creada.
  - Móvil (Sí): Tocar una pauta abre MedicationScheduleForm con scheduleId (MedicationDetailScreen.tsx:426-432); título 'Edit Schedule' (MedicationScheduleFormScreen.tsx:500).
- **Pausar / reactivar una pauta** — Desactivar una regla de horario sin borrarla.
  - Móvil (Sí): Interruptor 'Active' en MedicationScheduleFormScreen.tsx:950-955; el detalle marca la pauta como 'Inactive' (MedicationDetailScreen.tsx:418-421).
- **Tarjeta 'Medications' en el Dashboard** — Tarjeta en la pantalla principal con las dosis programadas y PRN del día y acceso rápido a registrar.
  - Móvil (Sí): DashboardScreen.tsx:815-817 (MedicationsCard); visibilidad configurable en DashboardSettingsScreen.tsx:109-113,171,207.
- **Recordatorios de medicación (notificaciones locales)** — Notificaciones programadas a la hora de cada dosis, reconciliadas en primer y segundo plano.
  - Móvil (Sí): MedicationReminderReconciler montado en App.tsx:1321 (src/components/MedicationReminderReconciler.tsx); reconcileMedicationReminders en src/services/medicationReminderService.ts:103; también en tarea de fondo backgroundSyncService.ts:356.
  - Nota: Las pautas sin hora no generan recordatorio (MedicationScheduleFormScreen.tsx:816-817).
- **Ajustes de recordatorios de medicación** — Activar recordatorios, repetir cada 10 min hasta 3 veces, ocultar nombres del medicamento y consolidar recordatorios simultáneos.
  - **Actualizado en la PR #3005 (fusionada):** La sección Medicación de Ajustes > Notificaciones tiene también «Remind In» («Recordar en» en la app en español: 10, 15, 30 o 60 minutos, 30 por defecto), visible mientras los recordatorios de medicación están activados; fija cuánto espera el botón «Remind in» de los recordatorios antes de volver a mostrar el aviso. Sus textos están traducidos en 6 de los otros 15 idiomas que trae la app (español, polaco, portugués de Brasil, chino simplificado y tradicional, y cantonés), y la web sigue sin ajustes de recordatorios de medicación.
  - Móvil (Sí): Settings > Notifications, sección 'Medications' (src/screens/NotificationSettingsScreen.tsx:299-380: 'Medication Reminders', 'Repeat Reminders', 'Hide Medication Names', 'Consolidate Reminders').
- **Acciones desde la notificación** — Botones 'Log as taken' / 'Skip' en cada recordatorio y 'Log all as taken' / 'Skip all' en el agrupado, sin abrir la app.
  - **Actualizado en las PR #2985 y #3005 (fusionadas):** Cada recordatorio y el agrupado tienen también un botón «Remind in» (por ejemplo «Remind in 30m», «Recordar en 30 min» en español) que vuelve a mostrar el aviso pasado el intervalo fijado en Ajustes, sin registrar la dosis; su etiqueta está traducida en 6 de los otros 15 idiomas que trae la app. En Android una tarea en segundo plano atiende los botones cuando la app está en segundo plano o cerrada, y en las dos plataformas una toma u omisión marcada desde un aviso que no llega al servidor se guarda y se reintenta más tarde.
  - Móvil (Sí): Categorías en src/services/notifications.ts:102-140; manejo en src/services/medicationNotificationHandler.ts:17-31,73-132.
- **Permiso de alarmas exactas para recordatorios** · _Solo Android_ — Aviso único para conceder 'Alarmas y recordatorios' y que los recordatorios suenen a su hora.
  - Móvil (Sí): MedicationReminderReconciler.tsx:84-92 llama a maybePromptForExactAlarmPermission (services/notifications.ts:336-348) vía ExactAlarmBridge (targets/android-exact-alarm).
  - iOS/Android: Solo Android (ExactAlarmBridge.isAvailable es falso en iOS).
- **Página 'Medications' en Apple Watch** · _Solo iOS_ — Ver las dosis programadas y PRN de hoy en el reloj y marcarlas/desmarcarlas con un toque.
  - **Actualizado en la PR #3052 (fusionada):** Wear OS tiene ahora una página Medications: las dosis programadas y a demanda del día con un recuento de tomadas, donde un toque marca una dosis como tomada o no tomada (se envía al teléfono al momento o queda en cola hasta que esté disponible), y sigue el orden y las páginas ocultas que se fijan en el teléfono. A diferencia de la página del Apple Watch, no muestra el estado de sincronización ni permite reintentar, muestra una dosis omitida igual que una pendiente y, antes de la primera sincronización, dice que no hay nada programado en lugar de pedir que se abra la app del teléfono. En ambos relojes, omitir dosis y registrar más de una vez una dosis a demanda se sigue haciendo en el teléfono.
  - Móvil (Sí): targets/watch/Presentation/MedicationsView.swift:12; página registrada en src/constants/watchPages.ts:13,36; datos y taps en src/hooks/useWatchCheckInBridge.ts:529 (medicationsForWatch) y 1319 (handleMedicationTaken); orden/visibilidad en WatchSettingsScreen.
  - iOS/Android: Solo iOS con Apple Watch emparejado; no hay equivalente Wear OS (watch-connectivity devuelve null en Android, modules/watch-connectivity/index.ts:1032).
  - Nota: Omitir y repetir dosis PRN no se puede desde el reloj.
- **Tarjeta 'Symptoms' en el Dashboard** — Episodio activo, registros del día, marcar día sin síntomas, '+ Log' y tendencia de 7 días con gravedad máxima.
  - Móvil (Sí): src/components/SymptomsCard.tsx:133-335 (banner activo 158-191, entradas 194-239, 'Mark Free' / '+ Log' 260-290, '7-Day Trend' 293-335); visibilidad en DashboardSettingsScreen.tsx:115-119.
- **Aviso '¿Sigue activo el episodio?'** — Notificación local 24 h después del inicio de un episodio abierto, con botones 'End now' / 'Still ongoing'.
  - Móvil (Parcial): Se programa al registrar un episodio (useSymptoms.ts:271-326; services/symptomReminderService.ts:47-90) y la categoría con botones se registra al arrancar (useAppStartup.ts:81; symptomReminderService.ts:17-38), pero no hay listener que procese esas acciones y no existe ajuste propio.
  - Nota: Los botones de la notificación aparecen pero no ejecutan ninguna acción.

#### En ambos, con diferencias (24)

- **Aviso médico / descargo de responsabilidad** — Aviso de que la app no da consejo médico y de que los recordatorios no son alertas médicas.
  - Web (Sí): Pantalla de aceptación obligatoria MedicationDisclaimer mientras no haya medicamentos ni síntomas registrados (Medications.tsx:184-194; MedicationDisclaimer.tsx:74-88, bloque 'Reminders Are Not Medical Alerts').
  - Móvil (Parcial): Solo una nota de pie de texto MedicalDisclaimer (src/components/MedicalDisclaimer.tsx) al final de MedicationsListScreen.tsx:265 y Glp1TrackerScreen.tsx:108; no hay pantalla de aceptación.
  - Nota: Web bloquea el acceso hasta aceptar; móvil solo informa.
- **Número de receta (Rx)** — Guardar y ver el número de receta del medicamento.
  - Web (Sí): Campo 'Rx number' en AddMedicationDialog.tsx:1163-1176; visualización en Medications.tsx:596-608.
  - Móvil (Parcial): Solo se muestra si existe (MedicationDetailScreen.tsx:507-514); MedicationFormScreen.tsx no tiene campo rx_number.
  - Nota: En móvil es de solo lectura (dato creado en web).
- **Lista de tomas registradas del día** — Historial del día con hora y estado de cada toma, con opción de deshacer.
  - **Actualizado en la PR #3103 (fusionada):** El móvil tiene un registro del día en la pantalla Adherence («Logged today», o «Logged on {date}» en otro día) con todas las entradas programadas, según necesidad y de inyección del día, con su hora, estado, zona y notas, y botones de lápiz y papelera para editarlas o eliminarlas, como la tarjeta «Logged today» de la web. Eliminar pide confirmación antes, y los textos nuevos de la tarjeta siguen en inglés en todos los demás idiomas que trae la app.
  - Web (Sí): Tarjeta 'Logged today' con Taken/PRN/Snoozed/Skipped, editar y deshacer (TodayMedications.tsx:1201-1308).
  - Móvil (Parcial): Solo en la ficha de cada medicamento y solo para tomas PRN: lista con hora y botón eliminar (MedicationDetailScreen.tsx:315-350); las programadas se deshacen con el toggle de DoseRow.
  - Nota: Móvil no tiene una vista agregada de todas las tomas del día.
- **Registrar inyección GLP-1** — Registrar una inyección con sitio, dosis (mg), fecha/hora, descuento de pluma/vial y notas.
  - **Cubierto en parte por la PR #3103 (fusionada):** La tarjeta para registrar la inyección en el móvil no tiene campo de hora: una inyección de hoy toma la hora actual y una de un día pasado, las 12:00. La hora exacta se puede ajustar después desde el registro del día en Medicación > 'Adherence & log', donde el lápiz de la entrada abre 'Edit logged dose'.
  - Web (Sí): Glp1LogInjection.tsx:82-200 (dosis 110-122, fecha y hora datetime 124-131, 'Deduct from pen/vial' 136-160, notas 169-176).
  - Móvil (Parcial): Glp1LogInjectionCard.tsx:167-266 (sitio, dosis, pluma, fecha con CalendarSheet 234-239, notas); la hora no se elige: hoy usa 'ahora' y días pasados las 12:00 (120-123).
  - Nota: Móvil no permite fijar la hora exacta de la inyección.
- **Inyecciones recientes** — Historial de inyecciones con edición (dosis, fecha/hora, sitio, notas) y borrado.
  - **Cubierto en parte por la PR #3103 (fusionada):** La tarjeta 'Inyecciones recientes' del control de GLP-1 en el móvil sigue permitiendo solo verlas y eliminarlas. Las inyecciones también aparecen en el registro del día de Medicación > 'Adherence & log', donde el lápiz abre 'Edit logged dose' para cambiar su hora, su zona de inyección y sus notas; la dosis y la fecha solo se pueden editar en la web.
  - Web (Sí): Glp1RecentInjections.tsx:93-237 (lista, 'Edit injection' 172-237, borrar 152).
  - Móvil (Parcial): Glp1RecentInjectionsCard.tsx: lista y 'Delete injection' con confirmación; sin edición.
  - Nota: Móvil solo permite ver y borrar.
- **Formulario adaptado a la plantilla del síntoma** — Las secciones que se preguntan dependen del tipo/plantilla del síntoma (resolveSections).
  - Web (Sí): SymptomLogForm.tsx condiciona cada sección por choice.sections.* (550-963); mapa según plantilla (248).
  - Móvil (Parcial): SymptomLogScreen.tsx muestra siempre las mismas secciones fijas; el mapa de cabeza solo se elige si el nombre contiene 'head'/'migraine' (343-347).
- **Crear síntoma nuevo desde el formulario** — Añadir un síntoma no existente mientras se registra.
  - Web (Sí): 'New symptom' crea una definición (SymptomLogForm.tsx:461-547).
  - Móvil (Parcial): Campo 'Or type custom symptom...' (SymptomLogScreen.tsx:436-444) registra un nombre libre sin crear definición (symptom_id indefinido).
- **Atajos 'Registrar de nuevo'** — Chips de síntomas fijados y recientes para registrar con un toque.
  - Web (Sí): SymptomsHub.tsx:90-97,186-209 (pinned + recentSymptomNames, máx. 6).
  - Móvil (Parcial): El formulario muestra todas las definiciones y plantillas integradas como chips (SymptomLogScreen.tsx:371-433), sin priorizar recientes.
- **Escalas de gravedad** — Valorar en 1-10, 1-5, ninguno-grave, recuento ('cuántas veces') o solo texto.
  - Web (Sí): SeverityControl.tsx:32-58 (text, count, none-severe y escalas numéricas).
  - Móvil (Parcial): SeveritySlider.tsx:42-101 soporta 1-5, none-severe y 1-10; 'count' y 'text' caen en el deslizador 1-10.
- **Episodio vs registro rápido e inicio/fin** — Modo rápido o episodio, inicio con atajos o fecha-hora exacta, 'sigue en curso' y fecha de fin.
  - Web (Sí): Conmutador Quick log/Episode (SymptomLogForm.tsx:493-518), atajos y 'Pick…' datetime (370-412), 'Still ongoing' y 'Ended' datetime (429-447).
  - Móvil (Parcial): Interruptor 'Track as ongoing episode' y atajos Now/-15m/-1h/-3h (SymptomLogScreen.tsx:448-498); sin selector de fecha-hora ni hora de fin, solo 'End Episode Now' (500-511).
- **Cualidades, síntomas asociados y desencadenantes** — Chips de cómo se siente, otros síntomas y posibles desencadenantes.
  - Web (Sí): SymptomLogForm.tsx:636-740 (añadir/quitar opciones propias, desencadenantes agrupados y 'Not sure').
  - Móvil (Parcial): SymptomLogScreen.tsx:540-644 solo con las opciones integradas (BUILT_IN_OPTIONS), sin grupos ni opciones propias.
- **Fases del síntoma (pródromo, aura, etc.)** — Registrar opciones por fase del episodio.
  - Web (Sí): SymptomLogForm.tsx:603-634 (SYMPTOM_PHASES).
  - Móvil (Parcial): No se pueden introducir; solo se muestran en el detalle si existen (SymptomEpisodeDetailScreen.tsx:163).
  - Nota: Solo lectura en móvil.
- **Tratamientos y alivio ('¿ayudó?')** — Registrar medicamentos o métodos de alivio tomados y su eficacia.
  - Web (Sí): TreatmentsEditor.tsx:30-160: añadir medicamento del botiquín, chips de alivio (integrados y propios) y 'Helped/Partly/Didn't help' (SymptomLogForm.tsx:742-761).
  - Móvil (Parcial): TreatmentsSection.tsx: nombre libre con tipo alivio/medicamento y eficacia Helped/Partly/Didn't help/Unsure (SymptomLogScreen.tsx:647-657); no se vincula a medicamentos del botiquín.
- **Fotos del síntoma** — Adjuntar, ver y borrar fotos de un registro de síntoma.
  - Web (Sí): Sección 'Photos' en SymptomLogForm.tsx:961-1010; miniaturas en EpisodeDetailDialog.tsx:~190-200.
  - Móvil (Parcial): Solo muestra '{{count}} photos attached' (SymptomEpisodeDetailScreen.tsx:220-226); el hook uploadPhoto existe en useSymptoms.ts pero ninguna pantalla lo usa.
  - Nota: No se pueden subir ni ver fotos en móvil.
- **Añadir lectura de gravedad a un episodio** — Registrar cómo evoluciona la gravedad durante un episodio en curso.
  - **Actualizado en las PR #3031 y #3073 (fusionadas):** En la web, Update severity también pide ahora el efecto en el día y lo guarda con la lectura cuando el episodio o su síntoma lo usan. El móvil sigue sin una acción propia para añadir lecturas: una nueva gravedad o un nuevo efecto solo se guardan editando el episodio entero, y el servidor los añade a sus historiales de gravedad y de efecto.
  - Web (Sí): 'Update severity' / 'Save reading' en EpisodeActions.tsx:64-90.
  - Móvil (Parcial): El hook addSeverity existe (useSymptoms.ts) pero ninguna pantalla lo invoca.
  - _Verificación: corregido por verificación_
- **Añadir alivio a un episodio en curso** — Acción rápida para registrar tratamientos durante el episodio.
  - Web (Sí): 'Add relief' en EpisodeActions.tsx:102-147.
  - Móvil (Parcial): No hay acción rápida; hay que abrir el registro (SymptomsCard.tsx:158-166 → SymptomLog) y editar la sección de tratamientos (SymptomLogScreen.tsx:647-657).
- **Terminar episodio** — Cerrar un episodio indicando cuándo terminó y qué ayudó.
  - Web (Sí): 'End episode' con atajos de hora, fecha-hora y '¿Did anything help?' (EpisodeActions.tsx:162-252).
  - Móvil (Parcial): 'End Episode Now' solo con la hora actual (SymptomLogScreen.tsx:247,500-511).
- **Resumen de 30 días de síntomas** — Días sin síntomas (%), principales desencadenantes y alivios más eficaces.
  - Web (Parcial): No existe la tarjeta; datos parecidos aparecen en Reports > Symptoms (KPIs y 'What came before', SymptomsReport.tsx:225-248,493-560).
  - Móvil (Sí): Tarjeta '30-Day Insights' en SymptomHistoryScreen.tsx:69-118,255-330.
- **Gestionar síntomas (lista de definiciones)** — Crear, editar, fijar, ocultar, borrar y restaurar síntomas.
  - Web (Sí): ManageSymptomsDialog.tsx:216-355 (nuevo, pin/unpin, editar, ocultar, borrar, 'Hidden' y 'Show again'), abierto con 'Manage' en SymptomsHub.tsx:126-134.
  - Móvil (Parcial): ManageSymptomsScreen.tsx:26-145: crear y editar propios; plantillas integradas solo informativas; sin ocultar ni borrar (el API móvil no tiene delete de definiciones). Acceso desde el engranaje de SymptomHistoryScreen.tsx:139-148.
- **Elegir qué preguntar al registrar** — Activar/desactivar las secciones del formulario para cada síntoma.
  - Web (Sí): 'What to ask when logging' en SymptomDefinitionEditor.tsx:231-248.
  - Móvil (Parcial): SymptomDefinitionEditorScreen.tsx no tiene selección de secciones.
  - _Verificación: corregido por verificación_
- **Fecha límite de uso (BUD) de pluma/vial** — Calcular y mostrar la fecha 'beyond-use' (28 días tras abrir) de una pluma o vial GLP-1, con avisos 'BUD Warning' y 'Expired (BUD)'.
  - Web (Sí): Glp1InventoryManager.tsx:73-76 (calculatedBudDate = opened + 28), 151 (bud_date), 203,317-339 (badges 'BUD {{bud_date}}', 'Expired (BUD)', 'BUD Warning'), 538-548 ('Calculated Beyond-Use Date (BUD)', 'Based on 28-day stability window').
  - Móvil (Parcial): Glp1PenFormScreen.tsx:142 calcula y guarda bud_date en silencio al indicar 'Opened', pero ni el formulario ni Glp1InventoryCard.tsx (68,99: solo penExpiryStatus de expiry_date) muestran ni avisan del BUD.
  - Nota: El aviso de caducidad del móvil se basa solo en expiry_date.
  - _Verificación: añadido durante la verificación_
- **Gráfico de nivel sérico GLP-1: eje Fechas/Días y tooltip** — Curva farmacocinética modelada con conmutador de eje (fechas o días), tooltip y marcadores de inyección con icono.
  - Web (Sí): Glp1Coach.tsx:37 (axisMode), 104-131 (botones 'Dates' / 'Days'), 159-225 (AreaChart con Tooltip 182 y ReferenceLine con Syringe 199-213).
  - Móvil (Parcial): Glp1SerumCard.tsx:27-90: línea SVG simple con marcas de dosis y '~{{percent}}% now', sin conmutador de eje, sin etiquetas de eje ni tooltip.
  - _Verificación: añadido durante la verificación_
- **Gráfico de nivel modelado GLP-1: eje Fechas/Días y tooltip** — En el gráfico del nivel sérico modelado se puede alternar el eje X entre fechas y días desde la dosis, y al pasar el cursor se ve el % del día; las inyecciones se marcan con un icono de jeringa.
  - Web (Sí): Glp1Coach.tsx:104-133 (botones 'Dates'/'Days', axisMode), 170-193 (XAxis y Tooltip con 'Day {{day}}'), 195-222 (ReferenceLine con Syringe).
  - Móvil (Parcial): Glp1SerumCard.tsx:62-127 dibuja una línea SVG estática con marcas discontinuas de dosis y '~{{percent}}% now'; no hay conmutador de eje, ejes, tooltip ni interacción (montado en Glp1TrackerScreen.tsx:78).
  - Nota: El resto del tracker GLP-1 (check-in, inventario, titulación) no se ha comparado en esta pasada.
  - _Verificación: añadido durante la verificación_
- **Filtrar historial de síntomas por síntoma** — Chips 'All' y uno por síntoma definido para filtrar la lista de registros del historial.
  - Web (Parcial): SymptomHistoryList.tsx (lista 'Recent symptoms' en SymptomsHub) no tiene filtro; solo Reports > Symptoms tiene un selector de síntoma (SymptomsReport.tsx:258-266).
  - Móvil (Sí): Fila de chips 'All' más las definiciones con setSelectedSymptomFilter en SymptomHistoryScreen.tsx:165-208; también se abre prefiltrado desde el botón de historial de SymptomLogScreen.tsx:318-328 (symptomId).
  - _Verificación: añadido durante la verificación_

<details><summary>En paridad web ↔ móvil (33)</summary>

- Acceso a la sección Medicación
- Lista / botiquín de medicamentos
- Filtro Todo / Medicamentos / Suplementos
  - **Actualizado en la PR #3103 (fusionada):** En el móvil, el filtro Todo / Medicamentos / Suplementos aparece también en la pantalla Adherence, donde filtra las tarjetas de dosis, la lista de comprobación, las cifras de adherencia, el calendario y el registro del día, como en la web. La lista y la pantalla Adherence tienen cada una su propio filtro, que solo aparece si hay algún suplemento y no se conserva de una visita a otra, mientras que la web lo muestra aunque no haya suplementos y recuerda una sola elección para toda la página.
- Ficha de detalle del medicamento
- Añadir / editar medicamento (campos básicos)
- Eliminar medicamento
- Crear suplemento / tipo suplemento
- Nutrientes por ración del suplemento
- Nutrientes de suplementos tomados en el diario
- Marcar como GLP-1 y elegir fármaco (perfil PK)
- Crear pauta de toma (horario)
- Eliminar pauta
- Checklist de dosis programadas (Tomar / Omitir / Deshacer)
  - **Actualizado en la PR #3103 (fusionada):** El móvil tiene ahora una pantalla de adherencia, que se abre desde la lista de medicamentos, con una tarjeta de progreso del checklist y tarjetas separadas de medicamentos y de suplementos del día que usan las mismas filas para registrar, omitir y deshacer; también puede mostrar otro día elegido en su calendario. La tarjeta del Dashboard sigue siendo una sola lista.
- Registrar toma 'según necesidad' (PRN)
- Registrar dosis en otros días
  - **Actualizado en la PR #3103 (fusionada):** La pantalla Adherence del móvil tiene su propio día, aparte de la fecha del Diario: se abre en el día de hoy y, al tocar un día de su calendario mensual, las tarjetas de dosis, la lista de comprobación, las cifras de adherencia y el registro del día pasan a esa fecha, en la que se pueden registrar dosis, con un enlace «Back to today». No hay flechas de día anterior y siguiente como en el selector de días de la web, y la tarjeta del Dashboard, el detalle del medicamento y el seguimiento de GLP-1 siguen usando la fecha del Diario/Dashboard.
- Acceso al panel GLP-1 (coach / tracker)
- Mapa corporal de sitios de inyección con rotación
- Nivel modelado (curva farmacocinética)
- Inventario de plumas / viales
- Plan de titulación de dosis
- Check-in diario GLP-1
- Acceso al seguimiento de síntomas
- Registrar síntoma (formulario básico)
- Localización en mapa corporal / de cabeza
- Efecto en el día
- Marcar día sin síntomas
- Episodios en curso
- Detalle de episodio / registro
- Gráfico de gravedad del episodio
  - **Actualizado en las PR #3031 y #3073 (fusionadas):** El gráfico del episodio en la web añade ahora, bajo la curva de gravedad, una franja con el efecto en el día, con un color por nivel desde el momento en que se registró y una leyenda. El gráfico del móvil no tiene esa franja y el detalle del episodio solo muestra el efecto actual como etiqueta. Un efecto cambiado al editar desde el móvil se sigue registrando y aparece en la franja de la web.
- Editar y eliminar registro de síntoma
- Historial de síntomas
- Calendario mensual de síntomas
- Editor de definición de síntoma

</details>

### 2.10 Ciclo menstrual, fertilidad y embarazo

#### Solo en la web (32)

- **Aviso de versión beta** — Banner 'Initial Beta Release' que invita a reportar fallos en GitHub.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Cycle/CyclePage.tsx:48-62
- **Ajuste rápido de duración de ciclo y periodo desde el hub** — Botón de lápiz en la tarjeta 'Cycle length' que abre un diálogo para ajustar la duración típica del ciclo y del periodo.
  - Web (Sí): pages/Cycle/CycleToday.tsx:203-216 (botón) y 556-619 (diálogo con upsertSettings).
- **Guía '¿Cómo se calculan las predicciones?'** — Sección plegable que explica, con las fechas del usuario, el cálculo del próximo periodo, la ovulación, la fase folicular y la ventana fértil.
  - Web (Sí): pages/Cycle/CycleToday.tsx:291-465
- **Consejo de la fase actual (descartable)** — Tarjeta con un consejo según la fase (descanso, hierro, energía, ventana fértil, SPM...) que se puede descartar.
  - Web (Parcial): pages/Cycle/CycleToday.tsx:522-545 (insightKey y useDismissPromptMutation) y 711-726 (textos).
  - _Verificación: corregido por verificación_
- **Resumen de agua, sueño y peso en el registro del día** — Fila de solo lectura con el agua consumida, las horas de sueño y el peso del día seleccionado.
  - Web (Sí): pages/Cycle/DailyLogPanel.tsx:209-238 (useWaterIntakeQuery, useSleepEntriesQuery, useLatestCheckInMeasurements).
- **Contador de productos menstruales** — Contadores +/- por producto (compresa, tampón, copa, salvaslip, ropa interior menstrual, disco) con la opción '+ more products'. Alimenta la estimación de volumen y la previsión de compra.
  - Web (Sí): pages/Cycle/DailyLogPanel.tsx:269-276 y 484-552.
- **Personalizar productos menstruales** — Diálogo para mostrar u ocultar los productos predefinidos, añadir productos propios con capacidad en ml y borrarlos.
  - Web (Sí): pages/Cycle/DailyLogPanel.tsx:277-483, con useUpsertDisplayPreferencesMutation('products').
- **Personalizar la lista de síntomas** — Diálogo para mostrar u ocultar síntomas, crear síntomas personalizados y borrarlos.
  - Web (Sí): pages/Cycle/CycleSymptomPicker.tsx:179-319 (useCreateCustomSymptomMutation, useDeleteCustomSymptomMutation, display preferences 'symptoms').
- **Nivel de energía (1-5)** — Deslizador de energía del día, usado en las correlaciones.
  - Web (Sí): pages/Cycle/DailyLogPanel.tsx:600-616
- **Tarjeta de estado de BBT** — Si no existe la medida BBT, ofrece crearla con un clic para registrarla en Check-in. Si la última lectura es antigua, avisa de que la confirmación por temperatura está en pausa.
  - Web (Sí): pages/Cycle/ttc/BbtStatusCard.tsx:28-86, mostrado en modos estándar y TTC (CycleToday.tsx:501-504).
- **Editar periodos pintando días en el calendario** — Modo 'Edit Periods': se marcan o desmarcan días como periodo sobre el calendario y se guardan en lote.
  - Web (Sí): pages/Cycle/CycleCalendar.tsx:100-160 (useBulkUpsert) y 327-355 (botones Edit Periods, Cancel y Save).
- **Editar un ciclo existente** — Cambiar fecha de inicio, duración y exclusión de un ciclo ya registrado.
  - Web (Sí): pages/Cycle/CycleHistoryList.tsx:85-100 (updateMutation) y 365-427 (diálogo 'Edit Cycle Record').
- **Desbloqueo de insights tras 2 ciclos completos** — Bloquea los gráficos avanzados hasta registrar 2 ciclos completos y muestra el progreso.
  - Web (Sí): pages/Cycle/CycleInsights.tsx:145-166 ('Insights Locked', 'Progress: n/2 cycles').
- **Gráfico de regularidad del ciclo** — Barras con la duración de cada ciclo frente a la media.
  - Web (Sí): pages/Cycle/CycleInsights.tsx:169-229 (BarChart).
- **Uso de productos y previsión de compra** — Volumen medio de flujo, productos medios por periodo, gasto anual estimado y unidades necesarias para el próximo periodo.
  - Web (Sí): pages/Cycle/CycleInsights.tsx:295-378
- **Frecuencia de síntomas por fase (mapa de calor)** — Matriz de síntomas por fase (menstrual, fértil, ovulación, lútea).
  - Web (Sí): pages/Cycle/CycleInsights.tsx:380-470
- **Simulación de fluctuaciones hormonales** — Curvas típicas de estrógeno, progesterona, LH y FSH en un ciclo de 28 días. Muestra un aviso de curva plana si hay anticonceptivo hormonal.
  - Web (Sí): pages/Cycle/CycleInsights.tsx:473-570
- **Probabilidad de concepción** — Porcentaje de probabilidad de concepción del día con banda de color (alta, media, baja...).
  - Web (Sí): pages/Cycle/ttc/FertilityCard.tsx:62-84
- **Gráfico de la ventana fértil** — Gráfico con la probabilidad diaria de concepción alrededor de la ovulación.
  - Web (Sí): pages/Cycle/ttc/FertileWindowChart.tsx:1-129, en CycleToday.tsx:517 (modo TTC).
- **Contador de patadas** — Sesiones de conteo de movimientos fetales con objetivo de 10, botón de toque e historial de sesiones recientes.
  - Web (Sí): pages/Cycle/pregnancy/KickCounter.tsx:15-165, en el mosaico 'Kick counter' de PregnancyToday.tsx:51-57,195-200.
- **Temporizador de contracciones** — Cronometrar contracciones con resumen de la última hora (número, separación, duración) y aviso del patrón 5-1-1.
  - Web (Sí): pages/Cycle/pregnancy/ContractionTimer.tsx:75-181 (5-1-1 en la línea 88), en PregnancyToday.tsx:201-203.
- **Registro rápido de vitaminas prenatales** — Botones para marcar como tomada hoy la medicación prenatal o el suplemento vinculado.
  - Web (Sí): pages/Cycle/pregnancy/VitalsCard.tsx:170-248 (create/delete medication entry).
- **Presión arterial en embarazo** — Registrar la tensión sistólica/diastólica (mmHg) como medida personalizada.
  - Web (Sí): pages/Cycle/pregnancy/VitalsCard.tsx:105-135 y 363-420.
- **Citas médicas** — Añadir citas con fecha y hora, tipo, título y lugar; listarlas y borrarlas.
  - Web (Sí): pages/Cycle/care/AppointmentsPanel.tsx:44-152, en CareHub.tsx:23 (pestaña Care).
- **Informe imprimible para el médico** — Resumen con media de ciclo y de periodo, regularidad y ciclos analizados, imprimible desde el navegador.
  - Web (Sí): pages/Cycle/care/DoctorReport.tsx:23-88 (window.print). Se muestra en modos distintos de embarazo (CareHub.tsx:25).
- **Biblioteca de artículos de salud** — Artículos educativos filtrados por modo, que se leen en un diálogo.
  - Web (Sí): pages/Cycle/care/ArticleLibrary.tsx:80-131 (articlesForMode).
- **Plan de parto y bolsa del hospital** — Preguntas del plan de parto y checklist de la bolsa del hospital, imprimibles. Se guardan en el localStorage del navegador.
  - Web (Sí): pages/Cycle/care/BirthPrep.tsx:9-127 (localStorage) y CareHub.tsx:25 (solo embarazo).
  - Nota: Al guardarse en localStorage, estos datos no se sincronizan entre dispositivos ni navegadores.
- **Distintivo 'Ciclo' en el historial general de síntomas** — En el historial del módulo de Síntomas, las entradas registradas desde el ciclo llevan la etiqueta 'Cycle'.
  - Web (Sí): pages/Symptoms/SymptomHistoryList.tsx:92-96 (entry.source === 'cycle').
- **Fase del ciclo en la exportación CSV del informe de síntomas** — El CSV de Reports > Symptoms incluye la columna cycle_phase para cada episodio. Las entradas de origen 'cycle' se excluyen del informe.
  - Web (Sí): pages/Symptoms/SymptomsReport.tsx:204 (cycle_phase) y 114,125 (filtro source !== 'cycle').
- **Insights del ciclo en modo embarazo** — Consultar los gráficos e insights del historial de ciclos con el tracker en modo embarazo.
  - Web (Sí): CyclePage.tsx:64-90: las pestañas Log, Insights y Care se muestran en todos los modos. Insights renderiza CycleInsights también en embarazo.
  - _Verificación: añadido durante la verificación_
- **Etiquetas 'Manual' o 'Auto' y 'Excluded' en el historial de ciclos** — Cada ciclo del historial indica si se registró a mano o se derivó de los registros, y si está excluido de las estadísticas.
  - Web (Sí): CycleHistoryList.tsx:276-285 ('Manual' o 'Auto' y 'Excluded').
  - _Verificación: añadido durante la verificación_
- **Origen de la estimación de ovulación y aviso de ciclo irregular (TTC)** — La tarjeta de fertilidad explica en qué se basa la estimación de ovulación (BBT, LH o calendario) y avisa si el ciclo es irregular.
  - Web (Sí): ttc/FertilityCard.tsx:85-133: texto 'Ovulation is estimated on X based on <basis>' e 'Irregular Cycle Detected'.
  - _Verificación: añadido durante la verificación_

#### Solo en el móvil (8)

- **Tarjeta de ciclo/embarazo en el Dashboard** — Tarjeta resumen en la pantalla de inicio. Muestra el anillo del ciclo con fase, día y próximo periodo o días de retraso. En embarazo muestra semana y día, tamaño del bebé con escena del útero y días hasta la fecha probable de parto (FPP). En modo discreto muestra solo 'Día N'. Sin configurar, ofrec…
  - Móvil (Sí): src/components/CycleCard.tsx:174-396. Se renderiza en src/screens/DashboardScreen.tsx:810-812. Toggle de visibilidad en src/screens/DashboardSettingsScreen.tsx:170,204-206.
- **Previsión de síntomas para los próximos días** — Lista de los próximos días con los síntomas esperados según el historial.
  - Móvil (Sí): src/components/wellness/CycleInsightsView.tsx:76-94 (aplanado) y 260-292 ('Symptom Forecast').
- **Editar el embarazo / la fecha probable de parto** — Modificar la FPP, su base de cálculo o el número de bebés de un embarazo existente.
  - Móvil (Sí): Lápiz en WeekBanner (src/components/wellness/pregnancy/WeekBanner.tsx:70-80) que abre PregnancySetup con el embarazo actual (PregnancyOverviewView.tsx:109-113). Título 'Edit Pregnancy' y updatePregnancy en PregnancySetupScreen.tsx:54-90.
- **Registro diario en embarazo (síntomas y notas)** — Formulario por fecha para registrar síntomas propios del embarazo, peso y notas.
  - Móvil (Sí): src/components/wellness/pregnancy/PregnancyLogView.tsx:31-91 usa CycleTodayView en modo embarazo: peso, síntomas de embarazo (CycleSymptomPicker.tsx:155-172) y notas, desde CycleLogModal (CycleLogModalScreen.tsx:99-108).
- **Sincronizar temperatura basal desde Apple Health / Health Connect** — Importa la BBT del sistema de salud del teléfono a la medida 'basal_body_temperature', que el servidor usa en las predicciones del ciclo.
  - Móvil (Sí): Métrica basalBodyTemperature en src/HealthMetrics.ts:187-199, sin restricción de plataforma, y en src/utils/autoHealthSyncCategories.ts:83. En HealthKit: HKQuantityTypeIdentifierBasalBodyTemperature (src/services/healthkit/index.ts:168,271).
- **Sincronizar datos reproductivos del sistema (menstruación, test de ovulación, moco cervical, sangrado intermenstrual)** · _Difiere iOS/Android_ — Interruptores de la categoría 'Reproductive' en la sincronización de salud. Los datos se suben como datos de salud genéricos; el hub del ciclo no los usa.
  - Móvil (Parcial): Métricas 'Reproductive' en src/HealthMetrics.ts:521-587 (Android) y 651-717 (iOS). El servidor no usa estos tipos para el ciclo: cycleRepository y cycleService solo leen basal_body_temperature.
  - iOS/Android: iOS ofrece menstruationFlow, menstruationPeriod, ovulationTest, cervicalMucus e intermenstrualBleeding. Sube el valor bruto de flujo, test de ovulación, moco y sangrado (src/services/healthkit/dataTransformation.ts:407-420). menstruationPeriod no tiene identificador HealthKit en index.ts, así que no lee nada. Android ofrece menstruationPeriod, ovulationTest, cervicalMucus e intermenstrualBleeding (no menstruationFlo…
- **Fecha probable de parto calculada por ecografía** — Opción 'Ultrasound scan' como base de cálculo de la FPP, además de última regla, fecha de concepción y FPP manual.
  - Móvil (Sí): BASIS_OPTIONS incluye { value: 'scan', label 'Ultrasound scan' } (PregnancyDueDateForm.tsx:10-19,141-170). Se usa en el onboarding (CycleOnboardingScreen.tsx:357-367) y en PregnancySetupScreen (crear y editar).
  - _Verificación: añadido durante la verificación_
- **Calendario e historial de ciclos en modo embarazo** — Acceso al calendario mensual y a la lista de ciclos con el modo embarazo activo.
  - Móvil (Sí): La pestaña History del hub está en todos los modos (CycleHubScreen.tsx:172-182) y muestra CycleCalendarGrid y CycleHistoryList (262-277).
  - _Verificación: añadido durante la verificación_

#### En ambos, con diferencias (20)

- **Acceso rápido 'Log Cycle / Log Pregnancy Entry' en el menú Añadir** — Fila en el menú central Añadir que abre directamente el modal de registro del día. La etiqueta depende del modo y del modo discreto.
  - Web (Parcial): AddComp/MainLayout no tiene ninguna entrada de ciclo.
  - Móvil (Sí): SparkyFitnessMobile/App.tsx:359-364 (etiqueta) y 1283-1285. src/components/AddSheet.tsx:435-442. src/hooks/useAddSheetActions.ts:332-333 navega a CycleLogModal.
  - _Verificación: corregido por verificación_
- **Selección de modo en el onboarding** — Elegir el modo del tracker al configurar: estándar, buscando embarazo (TTC), embarazo, postparto o menopausia.
  - Web (Parcial): Solo ofrece 3 modos: standard, ttc y pregnant (pages/Cycle/CycleOnboarding.tsx:48 y 197-290). Postparto y menopausia solo se pueden elegir después, en Ajustes (pages/Settings/CycleSettings.tsx:263-266).
  - Móvil (Sí): MODE_OPTIONS con los 5 modos (src/screens/CycleOnboardingScreen.tsx:41-47,325-343). Para postparto y menopausia, el paso 2 muestra 'No configuration needed' (líneas 368-380).
- **Fecha probable de parto dentro del onboarding (modo embarazo)** — Al elegir modo embarazo, el propio onboarding pide la base de cálculo de la FPP y crea el registro de embarazo.
  - Web (Parcial): El paso 2 siempre pide la fecha del último periodo y las duraciones, y siembra días de periodo también en modo embarazo (CycleOnboarding.tsx:70-100). El embarazo se configura después, en un paso aparte, cuando PregnancyToday muestra PregnancySetup (pregnancy/PregnancyToday.tsx:115-117).
  - Móvil (Sí): src/screens/CycleOnboardingScreen.tsx:357-367 (PregnancyDueDateForm) y 187-200,222-243 (validación y createPregnancyAsync/updatePregnancyAsync).
- **Navegar por días para ver o registrar cualquier fecha** — Cambiar el día seleccionado para ver predicciones y editar el registro de ese día.
  - Web (Sí): DayNavigator en pages/Cycle/CycleToday.tsx:161-164. El calendario comparte el día seleccionado con el panel de registro (líneas 285-289).
  - Móvil (Parcial): El hub está fijado en hoy: selectedDate es constante (src/screens/CycleHubScreen.tsx:57). Para otra fecha hay que abrir el modal de registro y cambiarla con CalendarSheet (CycleLogModalScreen.tsx:89-96,152-156) o tocar un día del calendario en History (CycleHubScreen.tsx:264-268). Las predicciones y alertas solo se ven para hoy.
- **Tarjetas KPI de predicción y estadísticas** — Próximo periodo, ovulación, duración del ciclo, media del ciclo con desviación estándar, media del periodo con regularidad y confianza de la predicción.
  - Web (Sí): pages/Cycle/CycleToday.tsx:179-257: seis StatCard con datos del servidor (stats.cycleLengthSd, stats.regularity, prediction.confidence).
  - Móvil (Parcial): Solo la tarjeta 'Cycle Summary' en Trends, con media de ciclo, media de periodo y 'Regularity' (src/components/wellness/CycleInsightsView.tsx:105-145). La regularidad es un valor fijo 'Regular' o 'Set' que no se calcula (líneas 59-63). No hay desviación estándar ni confianza. Las medias se calculan en el cliente (src/hooks/useCyclePredictionData.ts).
- **Lista de próximos ciclos previstos** — Fechas previstas del próximo periodo y de la ovulación para los ciclos siguientes.
  - Web (Parcial): Solo el ciclo siguiente (prediction.cycles[0]) en las tarjetas 'Next period' y 'Ovulation' (CycleToday.tsx:121,180-195).
  - Móvil (Sí): 'Next Predictions' con 2 ciclos (próximo y siguiente) y mosaicos de periodo y ovulación (src/components/wellness/CycleInsightsView.tsx:148-215).
- **Alertas del ciclo (retraso, periodo próximo, ovulación hoy)** — Avisos contextuales: periodo con N días de retraso, periodo previsto hoy, periodo en 3 días o menos, ovulación prevista hoy.
  - Web (Parcial): Solo hay banner de retraso (CycleToday.tsx:271-282) y el texto de retraso o 'periodo en N días' en el centro del anillo (líneas 151-157). No avisa de ovulación hoy ni de periodo inminente. buildCycleAlerts no se usa en web.
  - Móvil (Sí): src/components/wellness/CycleAlerts.tsx, alimentado por buildCycleAlerts (shared/src/cycle/predictions.ts:711-760) en src/screens/CycleHubScreen.tsx:121-131,231-241. Textos localizados en src/utils/cycleLocalization.ts:49-110. La tarjeta del Dashboard también muestra el retraso (CycleCard.tsx, periodLate).
- **Selector de síntomas del ciclo** — Marcar los síntomas del día. Se guardan como entradas de síntomas con source='cycle' y alimentan los insights.
  - Web (Sí): pages/Cycle/CycleSymptomPicker.tsx:46-391: síntomas predefinidos y personalizados, más un control 'Severity for new symptoms' (líneas 56 y 373).
  - Móvil (Parcial): src/components/wellness/CycleSymptomPicker.tsx:155-243: solo síntomas predefinidos, lista corta con 'ver todos' y una lista distinta en embarazo. La severidad está fija en 3 (CycleTodayView.tsx:296-303). No hay síntomas personalizados.
- **Registro de temperatura basal (BBT)** — Introducir la temperatura basal del día, que confirma la ovulación en las predicciones.
  - Web (Parcial): El panel del ciclo no tiene campo BBT. La temperatura se registra como medida personalizada 'basal_body_temperature' en Check-in (comentario en DailyLogPanel.tsx:553-554). BbtStatusCard solo crea esa categoría (ttc/BbtStatusCard.tsx:41-63).
  - Móvil (Sí): Campo 'Basal Temperature' en src/components/wellness/CycleTodayView.tsx:536-559, guardado con upsertBbt (src/services/api/cycleApi.ts:212-250), que crea la categoría si falta. Oculto en embarazo.
- **Excluir o incluir un ciclo de las estadísticas** — Alternar is_excluded en un ciclo ya registrado.
  - Web (Sí): pages/Cycle/CycleHistoryList.tsx:127-138 (handleToggleExclude), con botón en la fila (línea ~299).
  - Móvil (Parcial): Solo se puede marcar al crear un ciclo manual (src/components/wellness/CycleHistoryList.tsx:127-131). No se puede cambiar después.
- **Posición cervical** — Registrar la posición del cuello uterino.
  - Web (Sí): pages/Cycle/ttc/CervicalPositionPicker.tsx:14-129: tres ejes (altura, firmeza, apertura). En DailyLogPanel.tsx:587-592, solo TTC.
  - Móvil (Parcial): Solo la altura (baja, media, alta) con BottomSheetPicker (src/components/wellness/CycleTodayView.tsx:65-70 y 511-533, solo TTC). Faltan firmeza y apertura.
- **Espera de dos semanas (TWW / DPO)** — Seguimiento de los días post-ovulación con información sobre la ventana de implantación y cuándo hacerse el test.
  - Web (Sí): pages/Cycle/ttc/TwoWeekWait.tsx:19-178: DPO, aviso de ventana de implantación (6-12 DPO), cuenta atrás hasta 10 DPO, botones 'Log Positive/Negative HPT' y estado de felicitación tras un positivo. Sustituye a FertilityCard cuando dpo >= 0 (CycleToday.tsx:509-515).
  - Móvil (Parcial): Dentro de FertilityCard solo aparece 'N days past ovulation' y el consejo de precisión del test (src/components/wellness/ttc/FertilityCard.tsx:136-160). No hay ventana de implantación, botones HPT ni felicitación.
- **Crecimiento del bebé semana a semana** — Tamaño comparado con una fruta, longitud y peso, notas sobre el bebé y el cuerpo materno, y exploración de otras semanas.
  - Web (Sí): pages/Cycle/pregnancy/BabyGrowthView.tsx:26-204: semana anterior/siguiente, slider, 'Jump to this week', bloques 'Your baby' y 'Your body', y gráfico 'Growth across pregnancy'. También la tarjeta 'Baby this week' en PregnancyToday.tsx:131-161.
  - Móvil (Parcial): src/components/wellness/pregnancy/BabyGrowthView.tsx:1-124: solo la semana actual, con escena, 'Size of', longitud, peso y 'For you' (líneas 66-113). No se pueden explorar otras semanas ni hay gráfico.
- **Peso materno durante el embarazo** — Registrar el peso y ver su evolución frente al rango de ganancia recomendado.
  - Web (Sí): pages/Cycle/pregnancy/VitalsCard.tsx:250-360: último peso, 'kg since start', rango IOM por semana e indicador dentro/por debajo/por encima.
  - Móvil (Parcial): Solo un campo de peso en el registro de embarazo, guardado como check-in con conversión de unidades (src/components/wellness/CycleTodayView.tsx:385-410 y 310-317). No muestra delta ni rango IOM.
- **Duración de la fase lútea** — Días después de la ovulación, usados para calcular la ovulación.
  - Web (Parcial): Campo bloqueado en 14 (pages/Settings/CycleSettings.tsx:390-404, Input disabled). handleSave envía siempre luteal_phase_length: 14 (línea 116), así que pisa un valor distinto puesto desde móvil.
  - Móvil (Sí): StepperInput editable en src/screens/CycleSettingsScreen.tsx:445-458 (lutealLengthProps).
  - Nota: Riesgo de inconsistencia: guardar en web restablece a 14 la fase lútea configurada en móvil.
- **Modo discreto** — Etiquetas e iconos neutros ('Wellness') para no revelar datos reproductivos en pantalla.
  - Web (Parcial): Solo cambia la etiqueta y el icono de la pestaña de navegación (layouts/MainLayout.tsx:127-132,241-246; ajuste en CycleSettings.tsx:465-485). El contenido del hub no cambia.
  - Móvil (Sí): Hook con fallo cerrado (src/hooks/useDiscreetMode.ts: activo mientras carga o si hay error). Nombres de fase neutros (src/utils/cycleDisplayUtils.ts), título del hub (CycleHubScreen.tsx:137-141), título de Ajustes (CycleSettingsScreen.tsx:311), modal (CycleLogModalScreen.tsx:47), tarjeta del Dashboard 'Day N' (CycleCard.tsx), fila de Ajustes (SettingsScreen.tsx:339-347), AddSheet (App.tsx:360), WeekBanner y BabyGrow…
- **Acceso permanente al hub de ciclo y embarazo** — Ruta de navegación fija para abrir el hub (registro, tendencias, historial y herramientas de embarazo) sin depender de una tarjeta opcional.
  - Web (Sí): Pestaña 'Cycle', 'Pregnancy' o 'Wellness' en la barra de navegación de escritorio (MainLayout.tsx:238-247) y entrada en el menú '+' en pantallas estrechas (MainLayout.tsx:124-133), visibles mientras el seguimiento está activado.
  - Móvil (Parcial): La única navegación a CycleHub es la tarjeta del Dashboard (CycleCard.tsx:367). AddSheet abre solo CycleLogModal (useAddSheetActions.ts:332-333) y Ajustes abre CycleSettings (SettingsScreen.tsx:348). Si se oculta la tarjeta en DashboardSettingsScreen (204-206), no queda ninguna ruta al hub, sus Trends, History ni Tools.
  - _Verificación: añadido durante la verificación_
- **Tarjeta de fertilidad fuera del modo TTC** — Tarjeta 'Fertility' con ovulación estimada, aviso de ventana fértil, días hasta el próximo periodo y días tras la ovulación, en modos estándar, postparto y menopausia.
  - Web (Parcial): Fuera de TTC solo están las StatCard 'Next period' y 'Ovulation' (CycleToday.tsx:179-195). FertilityCard y TwoWeekWait se renderizan solo con isTtc (CycleToday.tsx:507-520).
  - Móvil (Sí): CycleLogModalScreen.tsx:124-135 muestra FertilityCard para la fecha elegida en modos que no son ni embarazo ni TTC. El contenido está en ttc/FertilityCard.tsx:93-165 (badge 'Est. fertile window', 'Next period in', 'Two-week wait').
  - _Verificación: añadido durante la verificación_
- **Puntos de acceso al hub del ciclo/embarazo** — Desde dónde se abre la sección principal del ciclo/embarazo.
  - Web (Sí): Ruta /cycle (App.tsx:434-435). Pestaña de navegación en escritorio cuando cycleSettings.enabled (MainLayout.tsx:237-247) y entrada en el menú '+' de viewport estrecho (MainLayout.tsx:114-133).
  - Móvil (Parcial): CycleHub solo se abre desde la CycleCard del Dashboard (CycleCard.tsx:367) o justo tras el onboarding (CycleOnboardingScreen.tsx:260). No hay pestaña, deep link (linking en App.tsx:439-457 sin CycleHub) ni enlace desde Ajustes: la fila 'Cycle & Pregnancy' abre CycleSettings (SettingsScreen.tsx:348). El AddSheet abre el modal de registro, no el hub. Si se oculta la tarjeta del Dashboard (DashboardSettingsScreen.tsx:2…
  - Nota: Riesgo de UX en móvil: el hub depende de una tarjeta del Dashboard que el usuario puede ocultar.
  - _Verificación: añadido durante la verificación_
- **Base de cálculo de la FPP y número de bebés en la configuración del embarazo** — Opciones para estimar la fecha probable de parto al crear o editar el embarazo.
  - Web (Parcial): PregnancySetup.tsx:77-81: 3 bases (Last period, Due date, Conception). Bebés 1, 2 o 3 con botones (PregnancySetup.tsx:120-130).
  - Móvil (Sí): PregnancyDueDateForm.tsx:11-27: 4 bases (manual, scan/ecografía, lmp, conception). Número de bebés con StepperInput en PregnancySetupScreen.tsx:113-125. En el onboarding se fija fetus_count: 1 (CycleOnboardingScreen.tsx:226-231).
  - _Verificación: añadido durante la verificación_

#### En ambos clientes, pero con diferencias iOS/Android (1)

- **Guardado del registro diario** · _Difiere iOS/Android_ — Cómo se guarda lo introducido en el registro del día.
  - Web (Sí): Guardado automático con debounce de 400 ms e indicador 'Saved' (pages/Cycle/DailyLogPanel.tsx:98-108,200-206).
  - Móvil (Sí): Guardado explícito en el modal CycleLogModal: botón Save en la cabecera o en FooterSaveBar (src/screens/CycleLogModalScreen.tsx:53-67,143-150). handleSave valida los números antes de escribir (CycleTodayView.tsx:226-339).
  - iOS/Android: En iOS con cabeceras nativas (iOS anterior a 26, o 26+ con Liquid Glass activado) Save va en la barra nativa (placement 'native-only'). En Android, e iOS 26+ con Liquid Glass desactivado, se usa la barra fija inferior FooterSaveBar (useNativeIOSHeadersActive en src/services/nativeTabBarPreference.ts:23-27). En Android el modal aplica el inset superior (CycleLogModalScreen.tsx:74).
  - Nota: El título del modal ('Log Daily Entry', 'Log Fertility & Test', etc.) está escrito en inglés sin i18n (CycleLogModalScreen.tsx:46-51).

<details><summary>En paridad web ↔ móvil (34)</summary>

- Acceso al hub de Ciclo/Embarazo
- Descargo médico en el pie
- Asistente de configuración inicial (onboarding)
- Perfil de salud en el onboarding (anticonceptivo y condiciones)
- Anillo visual del ciclo
- Registro de flujo menstrual
- Registro de moco cervical
- Notas del día
- Calendario mensual del ciclo
- Lista del historial de ciclos
- Registrar manualmente un periodo o ciclo anterior
- Eliminar un ciclo
- Alertas clínicas / patrones a vigilar
- Curva de temperatura basal (BBT)
- Tarjetas de correlación por fase y avisos de condición
- Resumen de fertilidad (ovulación estimada y ventana fértil)
- Registro rápido de tests de ovulación (OPK) y embarazo (HPT)
- Registro de relaciones sexuales y protección
- Modos postparto y menopausia
- Configurar embarazo (fecha probable de parto)
- Banner de semana gestacional
- Ilustración del útero por semana
- Lista de tareas semanal del embarazo
- Diario de fotos de la barriga
- Buscador de seguridad de alimentos y medicamentos
- Activar o desactivar el seguimiento de ciclo y embarazo
- Modo del tracker en Ajustes
- Método anticonceptivo en Ajustes
- Duración media del ciclo y del periodo (override)
- Condiciones de salud en Ajustes
- Mostrar predicciones de ventana fértil
- Terminología (por defecto / neutra en género)
- Exportar datos del ciclo (JSON)
- Restablecer y repetir el onboarding

</details>

<details><summary>Descartado tras verificación: no existe en ninguno (1)</summary>

- Pasar a modo embarazo tras un test positivo — El botón 'Start Pregnancy Mode' solo muestra el toast 'coming soon in Phase 4' y no cambia el modo (pages/Cycle/ttc/TwoWeekWait.tsx:55-63 y 87-95).

</details>

### 2.11 Chat con IA (SparkyChat) y ajustes de IA

#### Solo en la web (34)

- **Botón flotante arrastrable del chatbot** — Lanzador flotante (GIF animado) que se arrastra por la pantalla, se ajusta al borde izquierdo/derecho más cercano y abre/cierra el panel de chat. Se oculta mientras el panel está abierto.
  - Web (Sí): SparkyFitnessFrontend/src/components/DraggableChatbotButton.tsx:25-399 (snapToEdge 125-153, arrastre 156-180, toggleChat 237-252, oculto si el chat está abierto 304-306); montado globalmente en SparkyFitnessFrontend/src/App.tsx:212-222
- **Minimizar/restaurar el botón flotante** — Reduce el lanzador a una pestaña pequeña pegada al borde (con punto pulsante) y lo restaura con un toque. En escritorio hay una X al pasar el ratón; en ancho móvil se minimiza al arrastrarlo muy cerca del borde.
  - Web (Sí): SparkyFitnessFrontend/src/components/DraggableChatbotButton.tsx:131-147 (auto-minimizar en móvil), 262-267 (handleMinimize), 312-341 (pestaña minimizada), 366-385 (X solo en escritorio), 237-247 (restaurar)
- **Recordar posición del lanzador** — La posición vertical, el borde elegido y el estado minimizado del botón se guardan en localStorage (clave chatbot_button_state) y se restauran al recargar, ajustándose al redimensionar la ventana.
  - Web (Sí): SparkyFitnessFrontend/src/components/DraggableChatbotButton.tsx:14, 29-55, 97-111, 150, 244, 266
- **Minimizar/expandir el panel de chat** — Pliega el panel a una barra compacta de 56 px y lo vuelve a expandir sin perder la conversación ni el streaming en curso (la interfaz sigue montada).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Chat/SparkyChat.tsx:34, 90-96, 160-176, 191-197
- **Selector de proveedor IA dentro del chat** — Desplegable en la cabecera del chat (si hay más de un servicio activo) para cambiar el proveedor/modelo activo. Guarda active_ai_service_id y reinicia el hilo.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Chat/SparkyChat.tsx:57-64 (handleServiceSwitch), 118-142
- **Imágenes en mensajes del historial** — Los mensajes antiguos del usuario con imágenes vuelven a mostrar las imágenes como adjuntos (miniatura y vista ampliada).
  - **Actualizado en la PR #3068 (fusionada):** El móvil ya conserva las fotos de los mensajes anteriores del usuario y las muestra como miniaturas que se abren en una vista ampliada, como en la web.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Chat/SparkyChatInterface.tsx:75-86 (reconstruye attachments de partes image); src/components/attachment.tsx (UserMessageAttachments)
- **Copiar bloques de código** — Cabecera en los bloques de código con el lenguaje y un botón de copiar.
  - Web (Sí): SparkyFitnessFrontend/src/components/markdown-text.tsx:31-48 (CodeHeader con copyToClipboard)
- **Ver el razonamiento del modelo** — Bloque plegable «Reasoning (duración)» que muestra el razonamiento de los modelos que lo emiten. Se abre solo mientras llega.
  - Web (Sí): SparkyFitnessFrontend/src/components/thread.tsx:397 (Reasoning en MessagePrimitive.Parts); src/components/reasoning.tsx:150-160, 230-250
  - _Verificación: corregido por verificación_
- **Adjuntar imágenes al mensaje** — Botón «+» y zona de arrastrar y soltar para adjuntar imágenes. Miniaturas con vista ampliada en un diálogo y botón para quitar; las imágenes se redimensionan en el cliente antes de enviarse. Habilita las herramientas de visión (foto de comida, etiqueta).
  - **Actualizado en la PR #3068 (fusionada):** El móvil ya lo tiene en iOS y Android: el botón + del cuadro de mensaje permite hacer una foto o elegirla de la galería, hasta 5 fotos por mensaje, redimensionadas en el teléfono antes de enviarlas y mostradas como miniaturas con vista previa y botón para quitarlas. Una foto adjunta carga las herramientas de visión, como en la web. Solo la web permite arrastrar y soltar.
  - Web (Sí): SparkyFitnessFrontend/src/components/thread.tsx:210-215, 232 (AttachmentDropzone, ComposerAttachments, ComposerAddAttachment); src/components/attachment.tsx:87-110 (diálogo de vista previa), 180-195 (quitar), 223-241 (añadir); src/pages/Chat/SparkyChatInterface.tsx:116-136 (resizeImageBase64)
- **Tarjeta interactiva de estimación de foto en el chat** — Al analizar una foto de comida en el chat (sparky_analyze_food_image) aparece una tarjeta con confianza global, nombre editable, franja de comida, fecha, totales de macros, ingredientes (gramos editables, eliminar, insignia «✓ Matched»), modo de guardado, «Open in Meal Builder» y «Log to Diary».
  - **Cubierto en parte por la PR #3068 (fusionada):** El chat del móvil ya puede enviar una foto de comida, así que Sparky también puede analizarla desde el móvil, pero el resultado aparece en la tarjeta genérica de herramienta (el nombre de la herramienta y, al desplegarla, los datos en bruto del resultado) en lugar de la tarjeta interactiva. En el móvil no se pueden editar el nombre, la comida, la fecha ni los ingredientes, no hay modo de guardado ni botones Open in Meal Builder o Log to Diary; para registrar el plato en el móvil hay que pedírselo a Sparky en otro mensaje.
  - Web (Sí): SparkyFitnessFrontend/src/components/thread.tsx:401; src/components/ai/FoodPhotoEstimateToolUI.tsx:386-404 (analizando), 411-450 (cabecera y confianza), 460-540 (nombre, franja, fecha, macros), 580-650 (filas SET_GRAMS/REMOVE_ROW), 659-730 (modos), 747-781 (Meal Builder / registrar)
- **Editar un mensaje enviado** — Editar el texto de un mensaje propio ya enviado y reenviarlo (Cancel/Update), lo que genera una nueva rama de la conversación.
  - Web (Sí): SparkyFitnessFrontend/src/components/thread.tsx:109-111, 497-542 (ActionBarPrimitive.Edit, EditComposer)
- **Navegar entre versiones (ramas) de mensajes** — Selector anterior/siguiente «N / M» para recorrer las versiones de un mensaje tras regenerarlo o editarlo.
  - Web (Sí): SparkyFitnessFrontend/src/components/thread.tsx:414, 489-492, 544-573 (BranchPickerPrimitive)
- **Exportar mensaje como Markdown** — Menú «More» (…) en los mensajes del asistente con la opción «Export as Markdown».
  - Web (Sí): SparkyFitnessFrontend/src/components/thread.tsx:445-466 (ActionBarPrimitive.ExportMarkdown)
- **Estadísticas de uso de tokens** — Opción avanzada que muestra los tokens de cada respuesta (entrada/salida/total/caché) y el total de la sesión junto al compositor. Se activa con el interruptor «Show token stats» de los ajustes de IA y se guarda solo en el navegador (localStorage).
  - Web (Sí): SparkyFitnessFrontend/src/components/thread.tsx:98, 301-381, 416; interruptor en src/components/ai/UserChatPreferences.tsx:108-122; src/contexts/ChatbotVisibilityContext.tsx:13, 46-52
- **Selector de categorías de herramientas del chatbot** — Popover en el compositor («Choose chatbot tools») para limitar los dominios de herramientas del chatbot: 9 categorías (Food & Water, Exercise, Body & Check-ins, Goals, Reports, Coaching, Vision, Profile & Habits, Medications), presets Full/Core, «Clear all» y un contador si la selección es parcial.…
  - Web (Sí): SparkyFitnessFrontend/src/components/ai/ChatToolCategoriesSelector.tsx:19-29, 47-141; src/contexts/ChatToolCategoriesContext.tsx:23 (STORAGE_KEY 'chat_tool_categories'); src/components/thread.tsx:233; src/pages/Chat/SparkyChatInterface.tsx:144
- **Añadir proveedor IA personal** — Formulario para añadir un servicio IA propio: nombre y tipo (OpenAI, OpenAI-compatible, Anthropic, Google, Mistral, Groq, Ollama, OpenRouter, xAI, Perplexity, Meta, Custom).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/AIServiceSettings.tsx:237-314, 647-689; src/components/ai/ServiceForm.tsx:98-141; src/utils/aiServiceUtils.ts:6-31
- **API key y URL personalizada del proveedor** — Campos de API key (opcional para Ollama, OpenAI-compatible y Custom; al editar se deja vacía para conservar la actual) y de URL base para servidores autoalojados.
  - Web (Sí): SparkyFitnessFrontend/src/components/ai/ServiceForm.tsx:146-186; src/utils/aiServiceUtils.ts:37-40 (requiresApiKey); src/pages/Settings/AIServiceSettings.tsx:366-368
- **Elegir modelo (recomendado o personalizado)** — Desplegable de modelos por tipo de proveedor, con el primero marcado como recomendado, e interruptor «Use custom model» para escribir un nombre de modelo libre.
  - Web (Sí): SparkyFitnessFrontend/src/components/ai/ServiceForm.tsx:262-317 (incl. recommendedModel 297, custom_model_name_input 310); src/utils/aiServiceUtils.ts:47-132
- **Perfil de herramientas del chat (Full/Core)** — Para proveedores autoalojados (Ollama, OpenAI-compatible, Custom): elegir el perfil completo o el reducido «Core» de herramientas, con avisos sobre el contexto de Ollama y el perfil Full.
  - Web (Sí): SparkyFitnessFrontend/src/components/ai/ServiceForm.tsx:189-255
- **Marcar proveedor compatible con audio** — Interruptor «Supports audio input» que permite usar el servicio como modelo de transcripción de voz (o aviso si el tipo de proveedor no lo soporta).
  - Web (Sí): SparkyFitnessFrontend/src/components/ai/ServiceForm.tsx:319-342
- **Prompt de sistema personalizado** — Campo de texto para un system prompt propio del servicio, que luego se muestra en la lista de servicios.
  - Web (Sí): SparkyFitnessFrontend/src/components/ai/ServiceForm.tsx:344-354; src/components/ai/UserServiceListItem.tsx:175-181
- **Probar conexión del proveedor** — Botón «Test Connection» que comprueba en vivo la configuración y el modelo, con el resultado (éxito o error) al lado.
  - Web (Sí): SparkyFitnessFrontend/src/components/ai/ServiceForm.tsx:380-422; src/hooks/AI/useTestAIServiceConnection.ts; src/pages/Settings/AIServiceSettings.tsx:677-686, 830-841
- **Editar y eliminar proveedores propios** — Editar en línea un servicio propio (lápiz) y eliminarlo con un diálogo de confirmación. Los servicios globales salen como «Managed by admin».
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/AIServiceSettings.tsx:316-461, 556-616, 870-892; src/components/ai/UserServiceListItem.tsx:138-169
- **Activar/desactivar proveedores** — Interruptor por servicio para activarlo o desactivarlo (puede haber varios activos). En los servicios ajenos o globales cambia la preferencia de servicio activo.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/AIServiceSettings.tsx:463-554; src/components/ai/UserServiceListItem.tsx:122-131; src/components/ai/ServiceForm.tsx:357-369 (is_active)
  - _Verificación: corregido por verificación_
- **Lista de servicios configurados/disponibles** — Lista de servicios IA con insignias «Global», «Active», «Managed by admin», URL y system prompt. Si la configuración por usuario está desactivada se titula «Available services» y aparece un estado vacío.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/AIServiceSettings.tsx:701-866; src/components/ai/UserServiceListItem.tsx:106-181
- **Configuración de visión independiente** — Elegir un servicio distinto para las tareas de visión (fotos, etiquetas) o «Same as Chat configuration».
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/AIServiceSettings.tsx:78-83, 754-800
- **Usar o sobrescribir la configuración global** — Banner que indica el servicio global en uso, con «Override global settings» (crea una copia propia «(My Override)») o «Use global settings» (borra los servicios propios, con confirmación). Si el admin desactiva la configuración por usuario se muestra un aviso ámbar.
  - Web (Sí): SparkyFitnessFrontend/src/components/ai/GlobalOverrideBanner.tsx:25-84; src/pages/Settings/AIServiceSettings.tsx:131-235, 637-644, 894-916
- **Preferencia de borrado automático del historial** — Selector «Auto clear history» (Never / Each session / After 7 days / All) con el botón «Save chat preferences».
  - Web (Parcial): SparkyFitnessFrontend/src/components/ai/UserChatPreferences.tsx:61-69, 124-168; usado en src/pages/Settings/AIServiceSettings.tsx:620-626
  - _Verificación: corregido por verificación_
- **Interruptor «AI Assisted Unit Conversions»** — Activa o desactiva las conversiones de unidades asistidas por IA (preferencia ai_assisted_conversions). Solo aparece si se permite la IA y hay un servicio activo.
  - Web (Sí): SparkyFitnessFrontend/src/components/ai/UserChatPreferences.tsx:38-54, 71-106
- **Aviso de clave de cifrado («Invalid key length»)** — Tooltip de advertencia en la sección AI Service: si sale «Invalid key length», la clave de cifrado del servidor debe tener 64 caracteres hex.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/SettingsPage.tsx:431-452
- **Admin: proveedores IA globales** — El administrador crea, edita, elimina y prueba servicios IA globales (is_public) disponibles para todos los usuarios.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/GlobalAISettings.tsx:405-520 (incl. testConnection 436, 465); src/pages/Admin/Admin.tsx:5, 13; src/hooks/AI/useGlobalAIServiceSettings.ts
- **Admin: permitir configuración IA por usuario** — Interruptor global allow_user_ai_config que permite o impide que los usuarios configuren sus propios proveedores.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/GlobalAISettings.tsx:108-130, 312-326
- **Admin: permitir IA en red privada** — Interruptor allow_private_network_ai que permite proveedores en direcciones de red privada (p. ej. Ollama local).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/GlobalAISettings.tsx:333-358
- **Admin: servicio de visión global por defecto** — Selector «Global vision AI service» (default_vision_ai_service_id) para los usuarios que usan la configuración global, o «None».
  - Web (Sí): SparkyFitnessFrontend/src/pages/Admin/GlobalAISettings.tsx:364-403

#### Solo en el móvil (11)

- **Tarjeta «Ask Sparky…» en el Dashboard** — Tarjeta del Dashboard que abre el chat. Se puede mostrar/ocultar y reordenar desde Ajustes del Dashboard (subtítulo «Show the Ask Sparky chat launcher on the Dashboard»).
  - Móvil (Sí): SparkyFitnessMobile/src/screens/DashboardScreen.tsx:580-592 (navigate('Chat')); src/constants/dashboardCards.ts:5, 29-30, 68-71; src/stores/appPreferencesStore.ts:58, 89, 406 (askSparkyVisible)
- **Entrada «Ask Sparky» en la hoja de añadir (+)** — Fila secundaria «Ask Sparky» en la hoja inferior de acciones rápidas que navega a la pantalla de chat.
  - Móvil (Sí): SparkyFitnessMobile/src/components/AddSheet.tsx:464-468; src/hooks/useAddSheetActions.ts:328-330 (navigateFromSheet('Chat'))
- **CTA «Start chatting» en Novedades** — Diapositiva de la pantalla What's New que presenta el chat con un mockup y un botón para abrirlo.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/WhatsNewScreen.tsx:645-658 (cta onPress navigate('Chat'))
- **Estado «sin proveedor IA / sin servidor» en el chat** — Qué ve el usuario si no hay proveedor IA activo. Web oculta por completo el lanzador y el panel. Móvil deja abrir la pantalla y muestra un mensaje («No active AI provider. Configure one in the web app first.» o «No active server config…»).
  - Móvil (Sí): SparkyFitnessMobile/src/screens/ChatScreen.tsx:1136-1150 (chat.noServer / chat.noProvider)
- **Copiar mensaje propio** — Botón de copiar bajo los mensajes del usuario.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/ChatScreen.tsx:307-329 (MessagePrimitive.If user → ActionBarPrimitive.Copy)
- **Interruptor «Scan Labels On Device» (Apple Intelligence)** · _Solo iOS_ — En la pantalla AI del móvil: sección «On-device (Apple Intelligence)» con un interruptor para leer etiquetas en el propio dispositivo, volviendo al proveedor del servidor si falla. Si no está disponible se muestra «Not available on this device. It needs iOS 27 or later…».
  - Móvil (Sí): SparkyFitnessMobile/src/screens/AiSettingsScreen.tsx:61-67, 118-151; src/stores/appPreferencesStore.ts:94, 414 (onDeviceLabelScanEnabled)
  - iOS/Android: El módulo nativo solo existe en iOS (modules/on-device-nutrition/expo-module.config.json platforms:['ios']; index.ts:52-58 devuelve null fuera de iOS). En Android la pantalla AI solo muestra el texto «Not available on this device».
- **Lectura de etiquetas nutricionales en el dispositivo** · _Solo iOS_ — Lee la tabla nutricional con el modelo de Apple Intelligence (iOS 27+). Valida que sea plausible (rangos, coherencia Atwater) y si no lo es, recurre al servidor. Avisa con «Label read on this iPhone» o «Label read by the server AI».
  - Móvil (Sí): SparkyFitnessMobile/modules/on-device-nutrition/index.ts:44-50 (isAvailable, scanLabel); modules/on-device-nutrition/ios/OnDeviceNutritionModule.swift; src/services/onDeviceLabelScan.ts:15-70; src/screens/FoodScanScreen.tsx:576-620
  - iOS/Android: Solo iOS 27+ con Apple Intelligence activo; en Android siempre se usa el servidor.
- **Origen de la lectura y «Leer de nuevo» con el otro motor** · _Difiere iOS/Android_ — Banner en el formulario creado desde una etiqueta que indica quién la leyó (este iPhone o la IA del servidor) y ofrece repetir la lectura con el otro motor («Read again with the server AI / on this iPhone»).
  - Móvil (Sí): SparkyFitnessMobile/src/components/LabelScanSourceBanner.tsx:15-62; src/hooks/useRetryLabelScan.ts:30-75; src/screens/foodForm/CreateFoodMode.tsx:547, 571
  - iOS/Android: El reintento solo aparece cuando hay lectura en el dispositivo disponible (useRetryLabelScan.ts:44-50). En Android la fuente siempre es 'server', así que como mucho se ve la etiqueta de origen, sin «Leer de nuevo».
- **Escaneo de etiqueta de suplementos (Supplement Facts)** · _Difiere iOS/Android_ — En el formulario de medicación/suplemento se fotografía la etiqueta Supplement Facts. Se prueba antes el modelo del dispositivo y, si no, la visión del servidor; el servidor convierte los ingredientes en nutrientes.
  - Móvil (Sí): SparkyFitnessMobile/src/hooks/useSupplementLabelScan.ts:20-31; src/services/onDeviceSupplementScan.ts:181-184; src/services/api/medicationsApi.ts (/api/v2/medications/supplement-label/scan y /map); src/screens/MedicationFormScreen.tsx:181, 306, 986-993
  - iOS/Android: iOS 27+ con Apple Intelligence lo lee primero en el dispositivo (OnDeviceNutrition.scanSupplementLabel); Android usa siempre la visión del servidor.
- **Introducción a la estimación por foto** — Pantalla «Estimate nutrition from a photo» con consejos (añadir el peso, una descripción breve, revisar antes de guardar) y la opción «Log manually instead». Se muestra la primera vez y luego desde el botón «How photo estimation works».
  - Móvil (Sí): SparkyFitnessMobile/src/screens/FoodPhotoIntroScreen.tsx:84-145; src/services/foodPhotoIntro.ts:6, 20; src/screens/FoodScanScreen.tsx:698-707, 1302-1312
- **Confirmación y bloqueo al borrar el historial del chat** — Los dos clientes pueden borrar todo el historial. Móvil pide confirmación antes de borrar («Clear chat – This permanently deletes your Sparky chat history. This cannot be undone.» con Cancel/Clear), desactiva la papelera mientras hay una respuesta en curso (para que el guardado del servidor no recu…
  - Móvil (Sí): SparkyFitnessMobile/src/screens/ChatScreen.tsx:1049-1090 (Alert.alert con Cancel/Clear destructivo, toast chat.clearFailed), 1092-1110 (icono de papelera con disabled: running).
  - _Verificación: añadido durante la verificación_

#### En ambos, con diferencias (12)

- **Regenerar/reintentar respuesta** — Vuelve a generar una respuesta del asistente. Web: «Refresh» en cualquier mensaje del asistente (en los antiguos aparece al pasar el ratón). Móvil: «Retry» solo en la última respuesta.
  - Web (Sí): SparkyFitnessFrontend/src/components/thread.tsx:422-444 (ActionBarPrimitive.Reload, autohide='not-last')
  - Móvil (Parcial): Solo en el último mensaje: SparkyFitnessMobile/src/screens/ChatScreen.tsx:272-283 (MessagePrimitive.If last → ActionBarPrimitive.Reload)
- **Ir al final de la conversación** — Web: botón flotante «Scroll to bottom». Móvil: no hay botón; la lista sigue el streaming solo si el usuario ya está abajo (umbral de 40 px) y se vuelve a anclar al iniciar una nueva respuesta.
  - Web (Sí): SparkyFitnessFrontend/src/components/thread.tsx:97, 116-129 (ThreadPrimitive.ScrollToBottom)
  - Móvil (Parcial): Solo autodesplazamiento, sin botón: SparkyFitnessMobile/src/screens/ChatScreen.tsx:105, 836-905 (pinnedToBottomRef, handleScroll, scrollToBottomIfPinned)
- **Refrescar datos de la app tras acciones del chat** — Cuando el asistente registra algo, el resto de la app se actualiza. Web invalida al terminar cada respuesta las consultas de diario/nutrición/check-ins y del chat. Móvil no tiene onFinish: solo invalida el programa de carrera tras sparky_manage_run_program; las demás pantallas dependen de su propio…
  - Web (Sí): SparkyFitnessFrontend/src/pages/Chat/SparkyChatInterface.tsx:151-155 (onFinish → invalidateDiary(), invalidateChat())
  - Móvil (Parcial): SparkyFitnessMobile/src/components/chat/ToolCallCard.tsx:73-79 → src/services/runProgramService.ts:108-112 (solo runProgramQueryKey); useChatRuntime sin onFinish en src/screens/ChatScreen.tsx:165-181
- **Cancelar el dictado** — Web tiene un botón X para cancelar, además de la tecla Escape y la cancelación al ocultar la pestaña o al iniciarse una respuesta. Móvil no tiene botón: cancela solo al salir de la pantalla, pasar a segundo plano o empezar una respuesta (al volver a tocar el micro se detiene y se transcribe).
  - Web (Sí): SparkyFitnessFrontend/src/components/ai/VoiceInputControl.tsx:120-130; src/hooks/AI/useVoiceInput.ts:50-59, 72-75
  - Móvil (Parcial): Sin botón de cancelar: SparkyFitnessMobile/src/hooks/useVoiceInputLifecycle.ts (blur/background/run-start/unmount)
- **Errores de voz y acceso a sus ajustes** — Mensajes de error al dictar (no soportado, sin permiso, grabación > 10 MB, sin voz, fallo). En web el error lleva un enlace «Voice settings» que abre un diálogo con los ajustes de voz. En móvil se muestran toasts y alertas de permiso, sin enlace a los ajustes.
  - Web (Sí): SparkyFitnessFrontend/src/components/ai/VoiceInputControl.tsx:44-65, 133-160, 165-179 (diálogo con VoiceInputSettings)
  - Móvil (Parcial): Solo toasts/alertas: SparkyFitnessMobile/src/screens/ChatScreen.tsx:486-520, 553-565; src/components/chat/AiVoiceDictationButton.tsx:167-177, 195-208
- **Deep link y refresco automático de los ajustes de voz** — Móvil abre los ajustes de voz con sparkyfitnessmobile://settings/voice y vuelve a cargar las preferencias de voz al enfocar la pantalla o volver la app a primer plano, para recoger cambios hechos en la web.
  - Web (Parcial): Web no tiene deep link ni refresco especial; lee preferencias con React Query (SparkyFitnessFrontend/src/hooks/AI/useAIServiceSettings.ts).
  - Móvil (Sí): SparkyFitnessMobile/App.tsx:451 (ChatSettings: 'settings/voice'); src/hooks/useVoicePreferencesRefresh.ts; src/screens/ChatSettingsScreen.tsx:43-52; src/screens/ChatScreen.tsx:1005
  - _Verificación: corregido por verificación_
- **Configuración de chat activa (proveedor por defecto)** — Elegir qué servicio activo usa el chat («Chat configuration»: nombre y modelo). En móvil solo se ve en lectura: la pantalla AI muestra «Server AI provider» con nombre·modelo y los estados Checking…/error/«No AI provider is configured».
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/AIServiceSettings.tsx:68-76, 714-752
  - Móvil (Parcial): Solo lectura: SparkyFitnessMobile/src/screens/AiSettingsScreen.tsx:53-59, 73-116; ruta App.tsx:1233-1235; acceso src/screens/SettingsScreen.tsx:298-306
- **Escaneo de etiqueta nutricional con IA del servidor** — Modo «Label» del escáner: foto de la etiqueta → /foods/scan-label (proveedor de visión) → formulario de alimento ya rellenado. En la web no hay escáner: solo se puede adjuntar una foto de la etiqueta en el chat (herramienta sparky_scan_label) y el resultado sale en la tarjeta genérica de herramient…
  - Web (Parcial): Solo desde el chat con una imagen adjunta: SparkyFitnessServer/ai/tools/visionTools.ts (sparky_scan_label), renderizado con ToolFallback (SparkyFitnessFrontend/src/components/thread.tsx:403). No hay UI de escaneo de etiquetas en SparkyFitnessFrontend/src.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/FoodScanScreen.tsx:62-64 (modo 'label'), 576-620; src/services/api/externalFoodSearchApi.ts:727 (scanNutritionLabel); src/screens/foodForm/CreateFoodMode.tsx:547-575
- **Estimación nutricional por foto (flujo dedicado)** — Modo «Photo» del escáner de alimentos: hacer o elegir una foto de una comida para que la IA estime ingredientes y macros. Si no hay proveedor muestra «AI photo estimates aren't set up». En la web no hay flujo dedicado: solo adjuntando la foto en el chat (tarjeta chat-food-photo-card).
  - Web (Parcial): Solo a través del chat: SparkyFitnessFrontend/src/hooks/Foods/useFoodPhotoEstimate.ts:9-14 («Web runs the estimate itself only from the chat… The mobile app owns the direct POST /foods/estimate-food-photo path»).
  - Móvil (Sí): SparkyFitnessMobile/src/screens/FoodScanScreen.tsx:62-64, 202-209 (isFoodPhotoAvailable), 676-718, 760 (galería), 1140-1160 (aviso sin IA), 1255-1320; src/services/api/aiSettingsApi.ts:136-146
- **Mejorar la estimación: varias fotos, peso y descripción** — Antes de generar: añadir o quitar imágenes (cámara o galería), peso total opcional en g/oz y una descripción opcional con límite de caracteres. Durante el análisis se muestran etapas («Identifying ingredients…», «Estimating portions…», «Calculating nutrition…») y errores concretos del proveedor (ti…
  - Web (Parcial): En el chat web se pueden adjuntar varias imágenes con texto libre (SparkyFitnessFrontend/src/components/thread.tsx:210-232), pero no hay campo de peso, etapas de progreso ni errores específicos; solo «Analyzing meal photo…» (src/components/ai/FoodPhotoEstimateToolUI.tsx:386-404).
  - Móvil (Sí): SparkyFitnessMobile/src/screens/FoodPhotoImproveScreen.tsx:102-108, 195, 520-530, 590-610, 654-700, 744
- **Abrir la estimación en el Meal Builder** — Abrir los ingredientes estimados en el Meal Builder completo (diálogo «Create Meal») para editarlos y crear una comida reutilizable.
  - Web (Sí): SparkyFitnessFrontend/src/components/ai/FoodPhotoEstimateToolUI.tsx:566, 747, 790-827 (<MealBuilder> en Dialog)
  - Móvil (Parcial): El flujo móvil guarda la comida reutilizable con el modo «Ingredients + reusable meal» pero no abre ningún constructor de comidas (SparkyFitnessMobile/src/screens/FoodPhotoEstimateReviewScreen.tsx:857-866).
  - _Verificación: corregido por verificación_
- **Sugerencias iniciales que se envían al tocarlas (y traducidas)** — Los dos clientes muestran cuatro sugerencias en el chat vacío. En móvil, al tocar una se envía el mensaje de inmediato y las etiquetas están traducidas (el prompt se envía en inglés). En web, al pulsar una solo se rellena el compositor (hay que enviarla a mano) y los textos están fijos en inglés, s…
  - Web (Parcial): SparkyFitnessFrontend/src/components/thread.tsx:150-181 (WELCOME_SUGGESTIONS en inglés fijo; ThreadPrimitive.Suggestion con clearComposer y sin send → solo inserta el texto).
  - Móvil (Sí): SparkyFitnessMobile/src/screens/ChatScreen.tsx:910-941 (ThreadPrimitive.Suggestion con send y clearComposer; etiquetas con getLocalizedSuggestionLabel 784-808); src/constants/chat.ts:10-31 (claves chat.suggestions.*).
  - _Verificación: añadido durante la verificación_

#### En ambos clientes, pero con diferencias iOS/Android (2)

- **Contenedor de la interfaz de chat** · _Difiere iOS/Android_ — Web: panel lateral no modal de 500 px (la app de detrás sigue usable, sin overlay ni bloqueo de foco), título «Sparky AI Coach» y botón cerrar. Móvil: pantalla completa en el stack «Sparky», con botón atrás.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Chat/SparkyChat.tsx:76-97 (modal={false}, onInteractOutside), 101-107 (título), 178-186 (cerrar); montado en SparkyFitnessFrontend/src/layouts/MainLayout.tsx:630
  - Móvil (Sí): SparkyFitnessMobile/App.tsx:771-775 (Stack.Screen 'Chat'); src/screens/ChatScreen.tsx:978-1166
  - iOS/Android: iOS usa la cabecera nativa (liquid glass, icono SF Symbol 'trash') y el KeyboardAvoidingView de RN core; Android usa la cabecera propia de la pantalla e ionicon, y react-native-keyboard-controller para evitar el teclado (ChatScreen.tsx:107-115, 980-993, 1095-1105; src/services/nativeTabBarPreference.ts:23-27).
  - _Verificación: corregido por verificación_
- **Dictado por voz con el reconocedor del sistema** · _Difiere iOS/Android_ — Botón de micrófono en el compositor que transcribe con el reconocedor de voz del dispositivo o del navegador, sin coste de IA de Sparky. Web usa la Web Speech API (SpeechRecognition/webkitSpeechRecognition); si no está disponible muestra un error. Móvil usa expo-speech-recognition con resultados in…
  - Web (Sí): SparkyFitnessFrontend/src/utils/browserVoiceInput.ts:11-31; src/hooks/AI/useVoiceInput.ts:18-89; src/components/ai/VoiceInputControl.tsx:102-119; src/components/thread.tsx:188-199, 236-242
  - Móvil (Sí): SparkyFitnessMobile/src/screens/ChatScreen.tsx:417-640 (SystemVoiceDictationButton), 735-743; app.config.ts:230-236 (plugin expo-speech-recognition con permisos de micrófono y reconocimiento)
  - iOS/Android: iOS usa SFSpeechRecognizer y necesita un locale regional (src/utils/speechLocale.ts convierte 'en' en 'en-US' según el dispositivo). Android usa el reconocedor de Google/Samsung con androidIntentOptions EXTRA_ENABLE_LANGUAGE_SWITCH='balanced' (ChatScreen.tsx:581-585). addsPunctuation se pide en ambas plataformas (ChatScreen.tsx:578).

<details><summary>En paridad web ↔ móvil (26)</summary>

- Borrar historial del chat
- Historial persistente al abrir el chat
- Pantalla de bienvenida con sugerencias
- Respuestas en streaming
- Detener la generación
- Indicador de «pensando»/escribiendo
- Markdown en las respuestas
- Tarjetas de llamadas a herramientas
- Pregunta con respuestas rápidas (sparky_ask_user)
- Copiar respuesta del asistente
- Errores del chat
- Dictado con transcripción por IA
- Onda de voz durante la grabación
- El dictado se añade al borrador (envío manual)
- Ajuste: activar/desactivar la entrada de voz
- Ajuste: modo de reconocimiento (Sistema / IA)
- Ajuste: modelo de voz
- Revisar la estimación por foto
- Registrar la estimación en el diario
- «Convert with AI»: conversión de unidades con IA
- Insignia «AI estimate» en variantes
- Borrar el historial del chat
- Pantalla de bienvenida y sugerencias del chat vacío
- Tarjetas de llamadas a herramientas del asistente
- Dictado por voz con transcripción IA del servidor
- Ajustes de entrada de voz (activar, Sistema/IA, modelo)

</details>

### 2.12 Ajustes, perfil, familia e integraciones

#### Solo en la web (51)

- **Foto de perfil (avatar)** — Subir o cambiar la imagen de perfil (PNG/JPG hasta 5 MB) y ver las iniciales cuando no hay foto.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ProfileInformation.tsx:29-68 (validación tipo/tamaño, useUploadAvatarMutation), :84-129 (Avatar + botón Change Photo)
- **Nombre completo** — Editar el nombre completo mostrado en la app y a familiares.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ProfileFormContent.tsx:90-105 (campo full_name), botón Save Profile :241
- **Número de teléfono** — Editar el teléfono del perfil.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ProfileFormContent.tsx:109-125
- **Fecha de nacimiento** — Seleccionar la fecha de nacimiento (usada para edad en BMR, rangos sugeridos, etc.).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ProfileFormContent.tsx:128-165 (selector de calendario)
- **Género** — Elegir género (Masculino/Femenino/Otro) usado en BMR, % de grasa y figura corporal.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ProfileFormContent.tsx:168-196
- **Biografía** — Texto libre de presentación del usuario.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ProfileFormContent.tsx:221-235
- **Formato de fecha** — Elegir entre MM/dd/yyyy, dd/MM/yyyy, dd-MMM-yyyy, yyyy-MM-dd, MMM dd, yyyy.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:136-176
- **Modo de escala de gráficos** — Escala temporal o por puntos en los gráficos.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:205-230
- **Bebida estándar y límite semanal de alcohol** — Elegir los gramos de una bebida estándar (presets por país) y el límite semanal en bebidas estándar.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:329-390
- **Decimales en mediciones** — Número de decimales mostrados en mediciones.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:430-446
- **Nivel mínimo de registro (logs)** — DEBUG, INFO, WARN, ERROR o SILENT para la consola del cliente web.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:516-548
- **Conceder acceso a un familiar (por email)** — Crear una regla de acceso buscando al familiar por email, con validaciones (no a uno mismo, no duplicada).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/FamilyAccessManager.tsx:125-215 (validación, findUserByEmail), :304-343 (Add Family Member + email); acordeón en SettingsPage.tsx:180-195
- **Permisos granulares de acceso familiar** — Casillas: gestionar diario, ver biblioteca de alimentos, ver biblioteca de ejercicios, gestionar check-in, gestionar medicación, gestionar síntomas, ver informes.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/FamilyAccessManager.tsx:50-57 (modelo), :367-600 (Checkbox por permiso)
- **Compartir proveedores de datos externos con el familiar** — Permite al delegado buscar alimentos/ejercicios con tus proveedores API (FatSecret, USDA...); las integraciones de salud nunca se comparten.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/FamilyAccessManager.tsx:625-658 (share_external_providers + tooltip)
- **Fecha de fin del acceso** — Fecha opcional en la que caduca la regla de acceso.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/FamilyAccessManager.tsx:664-680; columna End Date en tablas :711-836
- **Editar regla de acceso** — Modificar permisos o fecha de fin de una regla existente.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/FamilyAccessManager.tsx:99-116 (openEditDialog), botones :803 y :931 ('Update Access')
- **Activar/desactivar regla de acceso** — Interruptor para pausar o reanudar una regla sin borrarla.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/FamilyAccessManager.tsx:225-232 (toggleFamilyAccessActiveStatus), Switch :793 y :920
- **Revocar (eliminar) acceso familiar** — Eliminar una regla de acceso.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/FamilyAccessManager.tsx:234-240 (handleDelete), botones :814 y :939
- **Selector de perfil (actuar en nombre de un familiar)** — Desplegable en la cabecera para cambiar al perfil de un familiar y operar como delegado; marca con punto azul al actuar en nombre de otro y oculta usuarios con solo permiso de lista de alimentos.
  - Web (Sí): SparkyFitnessFrontend/src/components/ProfileSwitcher.tsx:13-88 (filtro food_list :25-36, switchToUser :40-47), montado en layouts/MainLayout.tsx:506; contexts/ActiveUserContext.tsx:55-60
- **Gestionar check-in, informes, medicación y síntomas de un familiar** — Como delegado, acceder a Check-in, Informes, Medicación y Síntomas del familiar según sus permisos.
  - Web (Sí): SparkyFitnessFrontend/src/layouts/MainLayout.tsx:155-171 (menú +) y :269-301 (pestañas checkin, reports, medications, symptoms al actuar en nombre); PermissionRoute en App.tsx:395-401
- **Copiar comida de mi diario a un familiar** — Enviar una comida de tu diario al diario de un familiar.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Diary/CopyFamilyEntryDialog.tsx:79-80 (useCopyFoodEntriesToUserMutation), pestaña 'Copy To Family' :233
- **Añadir/editar/eliminar proveedores de datos de alimentos** — Configurar fuentes de alimentos: Open Food Facts, USDA, FatSecret, Nutritionix (legado), Yazio (usuario/contraseña), SwissFood, Canadian Nutrient File, Livsmedelsverket, NIH DSLD (suplementos), con claves/IDs.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/AddExternalProviderForm.tsx:59,343-381 (tipos dinámicos de external_provider_types), ProviderSpecificFields.tsx:314 (Yazio), EditProviderForm.tsx, ProviderCard.tsx:381,649-657 (editar/borrar); sección en SettingsPage.tsx:404-429
- **Servidores de recetas autoalojados (Mealie, Tandoor, Norish)** — Conectar instancias propias con URL de la app y API key para buscar/importar recetas como alimentos.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ProviderSpecificFields.tsx (App URL / Enter Key), ProviderCard.tsx:356-363,700-722
- **Proveedores de ejercicios (wger, Free Exercise DB)** — Tarjetas de proveedores de catálogos de ejercicios (globales, de solo lectura para el usuario).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ProviderCard.tsx:884-905 (free-exercise-db, wger), etiquetas Global/Read-only
- **Activar/desactivar un proveedor** — Interruptor para habilitar o deshabilitar un proveedor configurado.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ProviderCard.tsx:341-380 (handleToggleActive), Switch :673
- **Contribuciones a Open Food Facts** — Consentimiento para enviar productos a OFF, cuenta personal o global, e idioma de producto.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/OpenFoodFactsContributionSettingsCard.tsx (claves settings.foodExerciseDataProviders.openFoodFacts.*), montado en ExternalProviderSettings.tsx:121
- **Importación masiva de catálogos (CNF y Livsmedelsverket)** — Importar el catálogo completo del Canadian Nutrient File o de la base sueca Livsmedelsverket con barra de progreso.
  - Web (Parcial): SparkyFitnessFrontend/src/pages/Settings/ProviderCard.tsx:144-149,539,576,792-869; CnfBulkImportDialog.tsx; LivsmedelsverketBulkImportDialog.tsx
  - _Verificación: corregido por verificación_
- **Conectar/desconectar cuentas de salud por OAuth** — Vincular y desvincular Withings, Fitbit, Oura, Polar, Strava, Google Health y COROS; ver último sync y caducidad del token.
  - **Actualizado en la PR #3023 (fusionada):** Sigue siendo solo de la web: el móvil no tiene pantalla para vincular o desvincular estas cuentas. En la web, la tarjeta del proveedor muestra ahora la caducidad del token solo para Polar; los demás proveedores OAuth, que renuevan sus tokens por sí solos, muestran únicamente la última sincronización.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ProviderCard.tsx:163-205 (mutaciones connect/disconnect), :415-480 (config por proveedor), :625-640 (botones Connect/Disconnect), :956-966 (Last Sync / Token Expires)
- **Páginas de retorno OAuth** — Rutas que completan la autorización y muestran el resultado.
  - Web (Sí): SparkyFitnessFrontend/src/App.tsx:335-372 (/withings, /fitbit, /oura, /polar, /coros, /coros-mcp, /strava, /googlehealth /callback); pages/Integrations/*Callback.tsx y CallbackStatus.tsx
- **Garmin Connect (credenciales + MFA)** — Conectar Garmin con email y contraseña, introducir código MFA y desconectar.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/GarminConnectSettings.tsx:26-28 (email/password/MFA), ExternalProviderSettings.tsx:106-150, ProviderSpecificFields.tsx:457,596, ProviderCard.tsx:482-489
- **COROS MCP** — Proveedor COROS vía servidor MCP (URL prefijada) con ventana de 90 días por petición.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/AddExternalProviderForm.tsx:357-359, ProviderSpecificFields.tsx:835, SyncRangeDialog.tsx:~150-156
- **Hevy y Liftosaur (API key)** — Conectar apps de entrenamiento con API key e importar entrenamientos.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ProviderSpecificFields.tsx:608,617; AddExternalProviderForm.tsx:220,233; ProviderCard.tsx:491-508
- **Sincronización manual por rango de fechas (por proveedor)** — Diálogo para sincronizar un proveedor entre fechas (presets 7/30/90/180/365 días o personalizadas), con avisos específicos de Polar y COROS.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/SyncRangeDialog.tsx (títulos y presets, notas :144,:156,:170); ProviderCard.tsx:250-290,613,1047
- **Captura y reproducción de datos crudos (troubleshooting)** — Sincronizar guardando las respuestas crudas en el servidor o reproducir un archivo guardado, para depurar integraciones; aviso de privacidad.
  - Web (Parcial): SparkyFitnessFrontend/src/pages/Settings/SyncRangeDialog.tsx:319-367; ProviderCard.tsx:1008-1016 ('Help improve this integration by sharing anonymized mock data')
  - _Verificación: corregido por verificación_
- **Frecuencia de sincronización del proveedor** — Manual, cada hora o diaria para Withings, Garmin, Fitbit, Oura, Google Health, Strava, Polar, COROS MCP, Hevy y Liftosaur.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/EditProviderForm.tsx:1183-1225; se muestra en ProviderCard.tsx:726-728
- **Botón global de sincronización** — Icono en la cabecera que sincroniza a la vez todos los proveedores activos de sincronización manual; solo visible si hay alguno.
  - Web (Sí): SparkyFitnessFrontend/src/components/GlobalSyncButton.tsx:17-71 (useSyncAllMutation, MANUAL_SYNC_PROVIDERS), montado en layouts/MainLayout.tsx:529
- **Eliminar datos sincronizados por fuente** — Borrar todas las entradas sincronizadas/importadas de una fuente (p. ej. Apple Health, Garmin) sin tocar los datos manuales.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/DataManagementSettings.tsx:151-281 (fuente, alcance, confirmación)
- **Exportar diario a CSV** — Descargar todo el diario de comidas en CSV eligiendo delimitador (punto y coma o coma).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/DataManagementSettings.tsx:60-142
  - Nota: Ningún cliente ofrece eliminar la cuenta completa.
- **Importar base de alimentos (CSV)** — Añadir alimentos reutilizables con raciones y nutrición desde CSV.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/DataImportSettings.tsx:~150-157 (settings.dataImport.food)
- **Importar diario de comidas (CSV)** — Registrar comidas pasadas por fecha y tipo de comida, creando o emparejando alimentos.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/DataImportSettings.tsx:~160-167 (settings.dataImport.diary)
- **Importar check-in y datos de salud (CSV)** — Importar medidas corporales, sueño, constantes, actividad, hidratación y estado de ánimo.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/DataImportSettings.tsx:172-180
- **Importar base de ejercicios (CSV)** — Añadir ejercicios reutilizables desde CSV (con detección de duplicados).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/DataImportSettings.tsx:186-194, duplicados :121-126
- **Importar historial de entrenamientos (CSV)** — Importar entrenamientos pasados con series, repeticiones y pesos.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/DataImportSettings.tsx:200-208
- **Importar actividades (archivos .FIT)** — Importar entrenamientos y actividades desde archivos binarios .fit.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/DataImportSettings.tsx:216-224
- **Cambiar contraseña** — Actualizar la contraseña de la cuenta.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/AccountSecurity.tsx ('Change Password', 'Update Password'); SettingsPage.tsx:216
- **Cambiar email** — Actualizar el email de la cuenta.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/AccountSecurity.tsx ('Current Email', 'Update Email')
- **Autenticación multifactor (MFA)** — Activar/desactivar TOTP y MFA por código de email, y generar códigos de recuperación.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/MFASettings.tsx (totp, emailCode, recoveryCodes, generateNewCodes); AccountSecurity.tsx:283
- **Gestión de API keys** — Generar claves API con caducidad (7/30/90 días, 1 año, nunca) y acceso completo o solo lectura; copiar, deshabilitar y eliminar.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ApiSettings.tsx (settings.apiKeyManagement.*); SettingsPage.tsx:455
- **Recursos para desarrolladores** — Enlaces a la documentación de la API (Swagger y Redoc).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/DevloperResources.tsx:45 (/api/api-docs/swagger), :57 (/api/api-docs/redoc); SettingsPage.tsx:456
- **Categorías de medición personalizadas** — Crear y gestionar categorías propias de medición para el check-in.
  - **Actualizado en la PR #3194 (fusionada):** Los Ajustes del móvil tienen ahora una fila Custom Measurements, visible con conexión a un servidor, que muestra, crea, edita y borra categorías de medidas personalizadas con los mismos campos que la web: nombre, nombre visible, unidad, frecuencia y tipo número o texto. A diferencia de la web, que bloquea el nombre y el tipo de dato de una categoría existente, el móvil permite cambiar ambos, y sus pantallas de momento solo están en inglés.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/CustomCategoryManager.tsx; SettingsPage.tsx:377-393
- **Reordenar proveedores de datos (prioridad)** — Arrastrar las tarjetas de proveedores para cambiar su orden (sort_order), que define la prioridad o el orden de presentación de las fuentes de alimentos y ejercicios.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ExternalProviderList.tsx:65-87 (useSortable, 'Drag to reorder provider'), :358-380 (handleDragEnd guarda sort_order con updateExternalProvider), :487-517 (SortableContext); montado en ExternalProviderSettings.tsx:270
  - _Verificación: añadido durante la verificación_

#### Solo en el móvil (25)

- **Sincronización de datos de salud del dispositivo** · _Difiere iOS/Android_ — Pantalla para enviar al servidor datos de Apple Health (iOS) o Health Connect (Android), con hora de última sincronización y fuente.
  - Móvil (Sí): src/screens/SettingsScreen.tsx:237-245 → SyncScreen (App.tsx:959-962); SyncScreen.tsx:190-196,514-515 (Health Connect vs Apple Health), HealthSourceLabel.tsx:13-19
  - iOS/Android: iOS usa HealthKit (services/healthConnectService.ios.ts, services/healthkit); Android usa Health Connect (services/healthConnectService.ts) con aviso 'Not medical advice' solo en Android (SyncScreen.tsx:961-972).
- **Rango de sincronización de salud y 'Sincronizar ahora'** — Elegir rango (Hoy, 24 h, 3/7/30/90 días, 6 meses, 1 año) y lanzar sincronización rápida o completa.
  - Móvil (Sí): src/screens/SyncScreen.tsx:114-160 (rangos), :760-790 (Quick Sync / All Sync), :840-893 (Sync Range, Sync Now)
- **Sincronización en segundo plano** · _Difiere iOS/Android_ — Interruptor para sincronizar datos de salud automáticamente en segundo plano.
  - Móvil (Sí): src/components/SyncFrequency.tsx:19-45; src/screens/SyncScreen.tsx:290-365,975-978
  - iOS/Android: Android solicita el permiso BackgroundAccessPermission de Health Connect (SyncScreen.tsx:296-325); iOS arranca observadores de HealthKit (SyncScreen.tsx:337-365) y avisa que se actualiza 'cuando el teléfono lo permita' (SyncFrequency.tsx:38-45).
- **Sincronizar al abrir la app** — Lanzar una sincronización de salud cada vez que se abre la app.
  - Móvil (Sí): src/components/SyncOnOpen.tsx:16-36; src/screens/SyncScreen.tsx:367-370,979-982
- **Selección de métricas de salud a sincronizar** · _Difiere iOS/Android_ — Activar/desactivar cada métrica (o todas) y solicitar permisos de lectura.
  - Móvil (Sí): src/screens/SyncScreen.tsx:372-440 (permisos por métrica), :600-660 (todas), :983-990 (HealthDataSync)
  - iOS/Android: Flujos de permisos distintos (HealthKit vs Health Connect) pero mismo UI.
  - _Verificación: corregido por verificación_
- **Escritura en Apple Health/Health Connect y borrado** — Escribir métricas de SparkyFitness en el almacén de salud del dispositivo y eliminar esos datos (todo o por rango de fechas).
  - Móvil (Sí): src/components/HealthDataWriteback.tsx:94-169; src/screens/SyncScreen.tsx:520-590,991-1000 (DateRangeSheet); services/writeback.ios.ts / writeback.ts
- **Importar historial completo de salud** · _Difiere iOS/Android_ — Importación única de todo el historial con progreso, tiempo restante, pausar, reanudar y empezar de nuevo.
  - Móvil (Sí): src/screens/SyncScreen.tsx:945-957 → ImportHistoryScreen.tsx (App.tsx:964-967), acciones :440-620
  - iOS/Android: Android avisa del límite diario de lectura histórica de Health Connect y reanuda automáticamente (ImportHistoryScreen.tsx:469-476); mensajes de indisponibilidad distintos (Health Connect vs HealthKit, :457-466).
- **Informe de datos de salud para soporte** · _Solo Android_ — Exportar datos anonimizados de las últimas 4 h de Health Connect para reportar errores.
  - Móvil (Sí): src/screens/SyncScreen.tsx:1004-1050 (renderizado solo si isAndroid)
  - iOS/Android: Condicionado por isAndroid (SyncScreen.tsx:190,1004).
- **Reordenar contenedores de agua** — Mover contenedores arriba/abajo en la lista.
  - Móvil (Sí): src/screens/WaterContainersScreen.tsx:89,180-197 (reorderWaterContainersAsync), :338-351 (Move up/down)
- **Permitir notificaciones (interruptor general)** — Interruptor maestro de todas las alertas y banner que lleva a los ajustes del sistema si falta el permiso.
  - Móvil (Sí): src/screens/AppSettingsScreen.tsx:229-239 → NotificationSettingsScreen.tsx:231-245; components/NotificationPermissionBanner.tsx:98-101
- **Notificación del temporizador de descanso** — Avisar cuando termina el descanso entre series.
  - Móvil (Sí): src/screens/NotificationSettingsScreen.tsx:253-272
- **Notificación de objetivo de ayuno** — Avisar al alcanzar el objetivo de ayuno.
  - Móvil (Sí): src/screens/NotificationSettingsScreen.tsx:276-292
- **Recordatorios de medicación** · _Difiere iOS/Android_ — Recordatorios programados con opciones de repetir, ocultar nombres de medicamentos y agrupar recordatorios.
  - **Actualizado en la PR #3005 (fusionada):** Además de repetir, ocultar nombres y agrupar, los recordatorios de medicación tienen ahora un ajuste Recordar en (10, 15, 30 o 60 minutos) que fija la espera del nuevo botón Recordar en de la notificación, en iOS y Android. Android sigue creando su propio canal y pidiendo alarmas exactas; la web sigue sin recordatorios.
  - Móvil (Sí): src/screens/NotificationSettingsScreen.tsx:298-392 (Medication Reminders, Repeat, Hide Medication Names, Consolidate)
  - iOS/Android: Android crea un canal específico (services/notifications.ts:144-157) y pide el permiso de alarmas exactas para que suenen a tiempo; iOS no.
- **Recordatorios de agua** — Recordar beber agua tras X horas sin registro, dentro de una franja horaria (inicio/fin).
  - Móvil (Sí): src/screens/NotificationSettingsScreen.tsx:398-470 (intervalo, Start Time, End Time; validación :176)
- **Permiso de alarmas exactas** · _Solo Android_ — Diálogo que pide habilitar 'Alarmas y recordatorios' para que temporizadores y recordatorios suenen puntuales.
  - Móvil (Sí): src/screens/NotificationSettingsScreen.tsx:125-133; services/notifications.ts:336-350 (ExactAlarmBridge); targets/android-exact-alarm; plugins/withExactAlarmModule.ts
  - iOS/Android: ExactAlarmBridge.isAvailable solo es cierto en Android.
- **Respuesta háptica** — Vibraciones ligeras en temporizadores y confirmaciones.
  - **Actualizado en la PR #3052 (fusionada):** En el teléfono, el interruptor sigue funcionando igual en las dos plataformas. El reloj Wear OS de Android no lo tiene en cuenta: vibra al pulsar botones, al terminar el descanso y con un nuevo récord aunque el interruptor esté desactivado, mientras que el Apple Watch omite esas vibraciones cuando está desactivado.
  - Móvil (Sí): src/screens/AppSettingsScreen.tsx:241-252 (stores/appPreferencesStore hapticsEnabled)
- **Sonido del obturador de cámara** — Reproducir sonido al capturar fotos.
  - Móvil (Sí): src/screens/AppSettingsScreen.tsx:254-265 (soundsEnabled)
- **Navegación Liquid Glass** · _Solo iOS_ — Usar la barra de pestañas y cabeceras de cristal de iOS 26.
  - Móvil (Sí): src/screens/AppSettingsScreen.tsx:212-228; src/utils/liquidGlass.ts:9-17
  - iOS/Android: canUseLiquidGlass() devuelve false si Platform.OS !== 'ios' o la API de cristal no está disponible.
- **Ajustes del Apple Watch** · _Solo iOS_ — Gestos (doble toque para registrar serie, pedir RPE), modo de entrada (teclado/Digital Crown) y orden de páginas del reloj.
  - **Cubierto en parte por la PR #3052 (fusionada):** En Android aparece una fila Wear OS en Ajustes en cuanto un reloj Wear OS se ha conectado al teléfono, y abre la misma pantalla: la petición de esfuerzo (RPE) tras cada serie (de 5 a 10 en Wear OS, de 1 a 10 en el Apple Watch), el orden y la visibilidad de las páginas del reloj y los nutrientes de la página Objetivos, y la app de Wear OS los aplica todos. El doble toque para registrar una serie y la elección entre teclado numérico y Digital Crown son solo del Apple Watch: Wear OS ajusta el valor seleccionado con la corona giratoria y abre un teclado numérico al volver a tocarlo. La descripción de la petición de esfuerzo para Wear OS solo está en inglés.
  - Móvil (Sí): src/screens/SettingsScreen.tsx:52-55,368-377 (solo si hay reloj emparejado) → WatchSettingsScreen.tsx:103-240; modules/watch-connectivity (solo ios/)
  - iOS/Android: WatchConnectivity solo tiene implementación iOS (modules/watch-connectivity/ios, index.ts:1032).
- **Gestión de servidores** — Añadir, activar, configurar, eliminar y probar conexión de una o varias configuraciones de servidor; estado conectado/fallido.
  - Móvil (Sí): src/screens/SettingsScreen.tsx:130-146,213-232 → ServerSettingsScreen.tsx:80-180 (activar/eliminar), :245-330 (acciones), :418 (Test Connection), :442 (Other Servers), :491 (Add Server)
  - _Verificación: corregido por verificación_
- **Abrir el panel web** — Abrir la web del servidor activo en el navegador integrado.
  - Móvil (Sí): src/screens/ServerSettingsScreen.tsx:199-240 (WebBrowser.openBrowserAsync), botón :401
- **Visor de registros locales** — Ver registros de la app filtrando por nivel, copiar una entrada y borrar todo.
  - Móvil (Sí): src/screens/SettingsScreen.tsx:389-394 → LogScreen.tsx:200-330 (filtro, Clear Logs, copiar al portapapeles); App.tsx:954-957
- **Compartir informe de diagnóstico** — Exportar un informe local (versión, estado de sincronización, logs, estado de consultas) sin datos personales.
  - Móvil (Sí): src/screens/SettingsScreen.tsx:148-186,403-420 (shareDiagnosticReport en services/diagnosticReportService.ts)
- **Política de privacidad** — Abrir la política de privacidad de la app.
  - Móvil (Sí): src/screens/AboutScreen.tsx:23-24,128-139 (abre PRIVACY_POLICY_URL en el navegador)
  - Nota: src/components/PrivacyPolicyModal.tsx se monta en SettingsScreen.tsx:431-434 pero nunca se abre (setShowPrivacyModal(true) no se llama): código muerto.
- **Atajos del sistema operativo (Siri/Atajos, controles y acceso directo del launcher)** · _Difiere iOS/Android_ — Registrar datos sin abrir la app desde atajos del sistema, usando la sesión del servidor activo guardada en el módulo nativo.
  - **Cubierto en parte por las PR #2989 y #3020 (fusionadas):** Android tiene ya las acciones del icono Escanear comida, Registrar comida y Ayuno, que abren la app, cuatro baldosas de Ajustes rápidos y un widget de agua. El atajo y la baldosa Registrar agua registran una toma en segundo plano (la baldosa, también desde la pantalla de bloqueo), y los botones − y + del widget quitan o añaden una, todo ello con la sesión guardada. Android sigue sin nada parecido a Siri o la app Atajos, ninguna baldosa quita una toma y nada en el móvil registra el peso ni inicia o termina un ayuno sin abrir la app.
  - Móvil (Sí): SparkyFitnessMobile/plugins/withBackgroundWater.ts:1-10; targets/widget/ShortcutIntents.swift:260 (LogWaterIntent), :300 (RemoveWaterIntent), :338 (LogWeightIntent), :370 y :408 (Start/End fast), :463-489 (controles Scan food, Log food, Open food diary); targets/android-background-water/.../BackgroundWaterModule.kt:32-33 (ShortcutInfoCompat 'Log water'); src/services/backgroundWater.ts; la sesión se borra al elimina…
  - iOS/Android: iOS: App Intents de Siri/Atajos (registrar o quitar agua, registrar peso, empezar o terminar ayuno) y controles de pantalla de bloqueo / Centro de Control (escanear y registrar alimento, abrir diario). Android: solo un acceso directo del launcher 'Log water' (LogWaterActivity sin UI + WorkManager).
  - _Verificación: añadido durante la verificación_

#### En ambos, con diferencias (21)

- **Altura en el perfil** — Introducir la altura del perfil en la unidad de medida preferida.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/ProfileFormContent.tsx:199-218
  - Móvil (Parcial): No existe campo de altura de perfil en src/screens (profileApi.ts solo lectura)
  - Nota: La altura como medición de check-in pertenece a otro dominio.
  - _Verificación: corregido por verificación_
- **Formato de hora** — 24 h, 12 h AM/PM o am/pm.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:178-200
  - Móvil (Parcial): No editable en móvil; respeta el valor del servidor (time_format usado en ~54 sitios, p. ej. src/screens/SettingsScreen.tsx:87, ImportHistoryScreen/SyncScreen formatRelativeTime)
- **Unidad de peso** — kg, lbs o st+lbs.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:234-257
  - Móvil (Parcial): Sin selector; se respeta default_weight_unit en lectura (src/screens/WorkoutPresetFormScreen.tsx:323, WarmupSettingsScreen.tsx:102-103, WorkoutPresetDetailScreen.tsx:54)
- **Unidad de medidas corporales** — cm, pulgadas o pies+pulgadas.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:261-286
  - Móvil (Parcial): Sin selector; default_measurement_unit solo se lee (6 referencias en src/)
- **Unidad de distancia** — Kilómetros o millas.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:290-305
  - Móvil (Parcial): Sin selector; default_distance_unit se lee (src/screens/WorkoutPresetDetailScreen.tsx:56, WorkoutPresetFormScreen.tsx:325)
- **Unidad de energía** — Calorías (kcal) o kilojulios (kJ).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:308-326
  - Móvil (Parcial): Sin selector; energy_unit solo se aplica en src/screens/CalorieSettingsScreen.tsx:50-58 (displayEnergy/toKcal); el resto de pantallas muestran kcal fijo (p. ej. FamilyDiaryScreen.tsx:147 '{{calories}} kcal')
- **Vida media de cafeína y hora objetivo de dormir** — Vida media de cafeína (2-8 h) y hora de acostarse para la curva de cafeína.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:395-428
  - Móvil (Parcial): No editable; src/components/CaffeineCard.tsx:63,199 usa target_bedtime devuelto por la cinética calculada en el servidor
- **Primer día de la semana** — Día en que empiezan semanas y calendarios.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:449-508
  - Móvil (Parcial): Sin selector; se respeta en lectura (src/components/wellness/CycleCalendarGrid.tsx:43-44 y otros calendarios)
- **Zona horaria** — Seleccionar la zona horaria de la cuenta que define el 'hoy' de diario e informes.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:510-513 + TimezoneSelect.tsx
  - Móvil (Parcial): Sin selector: solo se envía la zona del dispositivo si la cuenta no tiene ninguna (src/services/api/preferencesApi.ts:99-160 ensureTimezoneBootstrapped, llamado en src/hooks/useAppStartup.ts:111)
  - Nota: Si el usuario viaja, móvil no actualiza la zona del servidor; hay que cambiarla en web.
- **Límite de elementos mostrados** — 5/10/15/20 elementos en listas como recientes/frecuentes de búsqueda.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:550-580
  - Móvil (Parcial): Sin selector; src/screens/FoodSearchScreen.tsx:148-149 usa item_display_limit del servidor
- **Auto-escalar alimentos por defecto** — Marcar por defecto la casilla Auto-Scale al editar un alimento.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:629-648
  - Móvil (Parcial): Sin interruptor; solo se lee en src/screens/foodForm/CreateFoodMode.tsx:102 y AdjustNutritionMode.tsx:88
- **Listado de accesos creados y recibidos** — Tablas 'Reglas que creé' y 'Reglas que me dieron' con familiar, permisos, fecha de fin y estado (Activo/Pendiente/Inactivo).
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/FamilyAccessManager.tsx:711-830 (Rules I Created), :836-960 (Rules Given to Me); estados :246-270
  - Móvil (Parcial): src/screens/FamilyMembersScreen.tsx:66-97 lista solo quienes te dieron acceso relacionado con el diario, con etiqueta 'Can copy'/'View only' (:81-83); sin reglas creadas, estado ni fecha de fin
- **Ver el diario de un familiar** — Consultar las comidas registradas por un familiar en una fecha.
  - Web (Sí): Mediante el selector de perfil: layouts/MainLayout.tsx:265-268 muestra la pestaña Diario si hasWritePermission('diary') y renderiza el diario completo del familiar (lectura y escritura)
  - Móvil (Parcial): src/screens/FamilyMembersScreen.tsx:91-93 → FamilyDiaryScreen.tsx (solo lectura de entradas de comida agrupadas por comida, totales y navegación de fechas :112-210) vía /api/daily-summary?userId (src/services/api/dailySummaryApi.ts:28-39); FamilyMealDetailScreen.tsx:126 'Viewing only'; registrado en App.tsx:536-564
  - Nota: Móvil no permite editar el diario del familiar ni ver ejercicio/agua/check-in.
- **Eliminar tipo de comida** — Borrar un tipo de comida; en web con análisis de impacto (entradas, comidas registradas, planes) y opción de mover los elementos a otro tipo o borrarlo todo.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/DeleteMealTypeDialog.tsx:45-90 (impacto y destino), botones 'Move items and delete' / 'Delete everything'; MealTypeManager.tsx:95-105
  - Móvil (Parcial): src/screens/MealTypeSettingsScreen.tsx:1046-1066 solo un Alert de confirmación 'Delete {{name}}?', sin análisis de impacto ni reasignación
- **Catálogo de bebidas predefinidas (Quick-Add)** — Añadir bebidas del catálogo (agua, café, alcohol...) como presets de añadido rápido.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/WaterContainerManager.tsx:99-140 (catálogo con filtro Todos/Alcohol/Cafeína), :442 (lista 'Quick-Add Drink Presets'), :457-475 ('Add from Catalog')
  - Móvil (Parcial): src/screens/WaterContainersScreen.tsx:200-210,529-556: fila horizontal de chips 'Quick-add presets' que añade el preset; sin diálogo de catálogo ni filtros por tipo
- **Visualización de nutrientes por vista** — Elegir qué nutrientes y en qué orden se muestran en cada vista, con restablecer a valores por defecto.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/NutrientDisplaySettings.tsx:59-86 (6 grupos: Summary, Quick Info, Food Database, Goal, Report Tabular, Report Chart), :239 (pestaña desktop/mobile), :16-29 (arrastrar con dnd-kit), :11 (reset); SettingsPage.tsx:266-281
  - Móvil (Parcial): src/screens/NutrientDisplaySettingsScreen.tsx:31-40,88-100 (solo food_database y report_tabular, solo plataforma 'mobile'), :317-332 (mover arriba/abajo), :348 (mostrar), :357-366 (reset); acceso FoodSettingsScreen.tsx:213-220
  - Nota: Los grupos quick_info, goal y report_chart no se ofrecen en móvil; el resumen se configura en Ajustes de Dashboard/Diario móviles.
- **Cerrar sesión** — Salir de la cuenta actual.
  - Web (Sí): SparkyFitnessFrontend/src/layouts/MainLayout.tsx:95-112,531-541 (botón Sign Out en cabecera)
  - Móvil (Parcial): No hay botón de cerrar sesión (sin signOut/logout en src); el acceso se retira eliminando la configuración del servidor en ServerSettingsScreen.tsx:130-170
- **Enlaces a GitHub, documentación, Discord y traducción** — Accesos externos al proyecto: repositorio, docs, comunidad Discord, Weblate y contador de estrellas.
  - Web (Sí): SparkyFitnessFrontend/src/components/AboutDialog.tsx:88 (Discord), :106 (GitHub); layouts/MainLayout.tsx:488-501 y 652-665 (GitHubStarCounter, pastillas Docs y Translate)
  - Móvil (Parcial): src/screens/AboutScreen.tsx:22-25,92-121 solo GitHub y Documentación; sin Discord, Weblate ni contador de estrellas
- **Ajustes de cálculo (BMR, grasa corporal, energía)** — Fórmula BMR, algoritmo de % de grasa, ajustes diarios de energía, modos de déficit y suelos de seguridad.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/CalculationSettings.tsx:673-720 (BMR Algorithm, Body Fat Algorithm) y resto de la tarjeta; SettingsPage.tsx:323-341
  - Móvil (Parcial): src/screens/CalorieSettingsScreen.tsx:60-200,290-410 (modo de calorías, modo objetivo, nivel de actividad, BMR externo, ajuste negativo TDEE, suelo de seguridad, % calorías de ejercicio); sin selector de algoritmo BMR ni de grasa corporal (sin bmr_algorithm en src/screens)
- **Servicio de IA** · _Difiere iOS/Android_ — Configurar proveedores/servicios de IA usados por el chat y funciones inteligentes.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/AIServiceSettings.tsx; SettingsPage.tsx:432-453
  - Móvil (Parcial): src/screens/AiSettingsScreen.tsx:69-101 solo muestra el estado del proveedor del servidor (sin configurarlo) y :120-160 añade escaneo de etiquetas en el dispositivo
  - iOS/Android: La opción 'On-device (Apple Intelligence)' / 'Scan Labels On Device' requiere iOS 27 con Apple Intelligence (AiSettingsScreen.tsx:146-150, services/onDeviceLabelScan); en Android aparece como no disponible.
- **Copiar comida de un familiar a mi diario** — Traer al diario propio la comida registrada por un familiar que dio permiso de gestionar el diario y ver su biblioteca de alimentos.
  - Web (Parcial): SparkyFitnessFrontend/src/pages/Diary/CopyFamilyEntryDialog.tsx:79 (useCopyFoodEntriesFromUserMutation), pestaña 'Copy From Family' :229-231, fecha y comida de origen y destino :286-397; abierto desde Diary.tsx:195-197,442. Copia el tipo de comida completo: no se pueden elegir alimentos sueltos ni ajustar cantidades.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/FamilyMealDetailScreen.tsx:52-74 (seleccionar/deseleccionar alimentos) → FamilyCopyReviewScreen.tsx:217-386 (cantidad por alimento, resumen nutricional, fecha y comida destino, 'Copy to my diary'); requiere canCopy (services/api/familyApi.ts:23-29); APIs copy-reviewed-from-user y copy-selected-from-user (foodEntriesApi.ts:157,172)
  - Nota: El móvil es más granular que la web: selección por alimento, edición de cantidades y vista previa de nutrición.
  - _Verificación: añadido durante la verificación_

#### En ambos clientes, pero con diferencias iOS/Android (1)

- **Idioma de la aplicación** · _Difiere iOS/Android_ — Elegir idioma de la interfaz.
  - **Actualizado en la PR #2959 (fusionada):** El móvil trae ahora 16 idiomas, con el turco añadido, frente a 34 en la web. Lo demás no cambia: Android tiene un selector dentro de la app, iOS lleva a los Ajustes de iOS y el idioma del móvil sigue sin sincronizarse con la preferencia de idioma del servidor que usa la web.
  - Web (Sí): SparkyFitnessFrontend/src/pages/Settings/PreferenceSettings.tsx:592-606 (getSupportedLanguages: 34 idiomas en utils/languageUtils.ts:85-126); se guarda en preferencias del servidor y se aplica con components/LanguageHandler.tsx:5-15
  - Móvil (Sí): src/screens/AppSettingsScreen.tsx:165-210; 15 idiomas en src/localization/localeRegistry.json (en, de, es, fr, hu, it, lv, nb-NO, nl, pl, pt-BR, ru, yue-Hant, zh-Hans, zh-Hant) + 'Sistema'; plugins/withAppLanguage.ts y targets/android-language
  - iOS/Android: Android: selector en la app (BottomSheetPicker, AppSettingsScreen.tsx:189-209) con idioma por app nativo (Android 13+). iOS: la fila solo muestra el idioma actual 'Managed by iOS' y abre Ajustes de iOS (Linking.openSettings, AppSettingsScreen.tsx:113-130,165-187).
  - Nota: El idioma móvil es local y no se sincroniza con la preferencia de idioma del servidor que usa la web; móvil ofrece menos idiomas (15 vs 34).

<details><summary>En paridad web ↔ móvil (31)</summary>

- Pantalla central de Ajustes
  - **Actualizado en la PR #3052 (fusionada):** La fila del reloj aparece ya también en Android, con el título 'Wear OS', en cuanto un reloj Wear OS se ha conectado al teléfono. Abre la misma pantalla de ajustes del reloj que la fila 'Apple Watch' de iOS, sin las opciones de doble toque ni de forma de introducir las series. Por lo demás, la lista es igual en las dos plataformas.
- Tema (claro/oscuro)
- Auto-escalar importaciones de Open Food Facts
- Mostrar carbohidratos netos
- Copiar comida de un familiar a mi diario
- Proveedor de alimentos por defecto
- Proveedor de código de barras y respaldo Open Food Facts
- Crear tipo de comida personalizado
- Editar nombre y hora por defecto del tipo de comida
- Mostrar/ocultar tipo de comida en el diario
- Mostrar/ocultar en registro rápido
- Reordenar tipos de comida
- Unidad de visualización de agua
- Sumar pérdida de agua por ejercicio al objetivo
- Contar el agua de los alimentos
- Gestionar contenedores de agua
- Contenedor de bebida vinculado a un alimento
- Factor de hidratación
- Contenedor principal
- Tipo de comida vinculado al contenedor
- Passkeys
- Acerca de / versión
- Novedades (What's New)
- Anuncios del servidor
- Preferencias de alérgenos
- Nutrientes personalizados
- Dirección del objetivo por nutriente
- Ajustes de ciclo y embarazo
- Ajustes de ayuno
- Ajustes de entrenamientos guiados
- Tema de la aplicación

</details>

<details><summary>Descartado tras verificación: no existe en ninguno (1)</summary>

- Icono global de notificaciones (elementos por revisar) — SparkyFitnessFrontend/src/components/GlobalNotificationIcon.tsx:8-23 siempre devuelve null y la consulta está desactivada (useNeedsReviewCountQuery(!!user && false)); montado en MainLayout.tsx:528 pe…

</details>

### 2.13 Capacidades nativas del móvil

#### Solo en la web (7)

- **Sincronización con servicios de salud en la nube (alternativa en servidor)** — Conexión por OAuth con Garmin Connect, Fitbit, Withings, Polar, Strava, Oura, Coros y Google Health, y por clave con Hevy y Liftosaur. El servidor importa los datos sin pasar por el teléfono, con un diálogo para elegir el rango.
  - Web (Sí): App.tsx:335-372 (callbacks OAuth /withings, /fitbit, /oura, /polar, /coros, /strava, /googlehealth); pages/Settings/ExternalProviderSettings.tsx; AddExternalProviderForm.tsx:157-240; GarminConnectSettings.tsx; SyncRangeDialog.tsx; utils/settings.ts:5-58
- **Claves API para Atajos de iPhone y apps externas** — Crear y revocar claves API con las que apps externas, como un Atajo de iPhone, envían datos de salud al servidor (/health-data).
  - Web (Sí): pages/Settings/ApiSettings.tsx:169; translation.json:2374-2410 ('iPhone Health Shortcut')
  - _Verificación: corregido por verificación_
- **Importación de datos de salud desde CSV** — Carga de mediciones de salud desde un archivo CSV. Es la alternativa web para traer historial.
  - Web (Sí): pages/Settings/DataImportSettings.tsx:22 → pages/CheckIn/HealthDataImportCSV.tsx
- **Borrar datos sincronizados por fuente** — Elimina todas las entradas que llegaron de una fuente concreta (Apple Health, Garmin...) sin tocar las manuales.
  - Web (Sí): pages/Settings/DataManagementSettings.tsx:29-230; translation.json:2022-2035 ('deleteSynced')
- **App web instalable (PWA)** — La web se puede instalar como app independiente, con service worker que se actualiza solo y caché del shell.
  - Web (Sí): vite.config.ts:61-86 (VitePWA registerType autoUpdate, workbox navigateFallback); public/manifest.json (display standalone); index.html (apple-mobile-web-app-capable)
- **Importar actividades desde archivos FIT** — Subir hasta 10 archivos .fit exportados de un reloj o app. Cada uno se convierte en una entrada del diario con FC, vueltas y datos de informe; si se vuelve a subir el mismo archivo, se actualiza su entrada. Es la vía web para traer la telemetría de entrenamientos que el móvil saca de Apple Health o…
  - Web (Sí): pages/Settings/DataImportSettings.tsx:27 y 217-226 (herramienta 'garminFit': 'Import workouts and activity data from binary .fit files'); pages/Exercises/ExerciseImportFit.tsx:33-59 ('Import FIT Files', useFitImport)
  - _Verificación: añadido durante la verificación_
- **Captura de respuestas de proveedores en la nube para soporte** — En el diálogo de rango de sincronización hay modos de solución de problemas: sincronizar normal, sincronizar y guardar en el servidor las respuestas en bruto del proveedor, o reproducir un archivo guardado. Incluye instrucciones para compartir el paquete de diagnóstico con el desarrollador.
  - Web (Sí): pages/Settings/SyncRangeDialog.tsx:57 y 76 (SyncMode 'live' | 'capture' | 'replay'; saveMockData), 307-367 (bloque 'Troubleshooting' visible con mockDataEnabled y aviso de privacidad); pages/Settings/ProviderCard.tsx:1023-1036 (activar 'Allow Local Provider Response Capture' en Admin > Global Provider Settings y compartir el paquete exportado)
  - _Verificación: añadido durante la verificación_

#### Solo en el móvil (60)

- **Conexión con Apple Health / Health Connect** · _Difiere iOS/Android_ — Inicializa el almacén de salud del sistema, pide permisos de lectura por métrica, avisa cuando no está disponible y enlaza con los ajustes de salud del sistema. Se entra desde Ajustes → 'Health Data Sync'.
  - Móvil (Sí): SettingsScreen.tsx:237-245 (fila Health Data Sync → Sync); SyncScreen.tsx:190-197 (nombre de los ajustes de salud), 899-912 (mensajes de no disponible); services/healthConnectService.ts (Android) y healthConnectService.ios.ts (iOS)
  - iOS/Android: iOS usa HealthKit (@kingstinct/react-native-healthkit) con la hoja de permisos del sistema. Android exige tener Health Connect instalado, con los permisos declarados en app.config.ts:27-80. El aviso 'Not medical advice' solo aparece en Android (SyncScreen.tsx:961-974).
  - _Verificación: corregido por verificación_
- **Sincronización manual de salud con rango** — Botón 'Sync Now' con rango a elegir (Hoy, 24 h, 3 días, 7 días, 30 días, 90 días, 6 meses, 1 año). Ofrece 'Quick Sync' (respeta el mapa y la FC de los entrenamientos ya sincronizados) o 'All Sync' (los vuelve a leer). Muestra la última sincronización y la fuente. También hay un acceso 'Sync Health …
  - Móvil (Sí): SyncScreen.tsx:117-157 (rangos), 772-795 (Quick/All Sync), 885-893 (Sync Now), 917-943 (última sincronización y HealthSourceLabel); AddSheet.tsx:470; useAddSheetActions.ts:336
- **Selección de métricas a sincronizar con vista previa** · _Difiere iOS/Android_ — Interruptor por métrica, agrupado por categorías (Common, Activity, Vitals, Body Measurements, Nutrition, Reproductive, Mobility, Running, Cycling, Apple), más un 'activar todas'. Muestra los valores leídos del dispositivo en el rango elegido.
  - Móvil (Sí): SyncScreen.tsx:984-991 (HealthDataSync); components/HealthDataSync.tsx; HealthMetrics.ts:1076-1100 (filtro por plataforma y CATEGORY_ORDER)
  - iOS/Android: La lista se filtra por el campo `platforms` de cada métrica (HealthMetrics.ts:1081-1083). El detalle de qué métricas hay en cada plataforma está en las tres filas siguientes.
- **Métricas de salud leídas en ambas plataformas** · _Difiere iOS/Android_ — Pasos, calorías activas y totales, FC, peso, presión arterial, nutrición, sueño, temperatura basal, metabolismo basal, glucosa, % de grasa, temperatura corporal, distancia, sesiones de ejercicio, pisos, altura, hidratación, masa magra, frecuencia respiratoria, FC en reposo, VFC, VO2 máx., SpO2, cic…
  - **Actualizado en las PR #3019, #3034, #3042, #3091 y #3100 (fusionadas):** Las sesiones de mindfulness se leen ahora en ambas plataformas como métrica común: Android conserva el tipo de sesión (meditación, respiración, sin guía u otra), el título y las notas, mientras que iOS envía todas las sesiones como 'other' sin notas. Las sesiones de sueño llevan ahora la VFC nocturna y la frecuencia cardiaca en reposo en ambas plataformas cuando esas métricas se sincronizan, y la media diaria de frecuencia cardiaca de Android da ahora el mismo peso a cada tramo de 5 minutos, mientras que iOS mantiene la media diaria de Apple Health. Masa ósea, empujes de silla de ruedas y periodo menstrual siguen sin sincronizar nada en iOS.
  - Móvil (Sí): HealthMetrics.ts:54-445 y 492-503 (sin restricción de plataforma); VFC: entradas separadas en 387-400 (iOS) y 404-417 (Android); SpO2 y reproductivas: entradas Android en 521-617 e iOS en 636-718
  - iOS/Android: La VFC, la SpO2 y las métricas reproductivas tienen una definición distinta en cada plataforma. iOS además lee 'flujo menstrual'. Masa ósea (HealthMetrics.ts:492) y empujes de silla de ruedas (435) salen en la lista de iOS, pero no tienen identificador en HEALTHKIT_TYPE_MAP (healthkit/index.ts:232-290) y la lectura devuelve vacío (index.ts:1929-1932). En la práctica solo funcionan en Android.
  - _Verificación: corregido por verificación_
- **Métricas exclusivas de Apple Health** · _Solo iOS_ — Alcohol en sangre; flujo menstrual; velocidad de marcha, longitud de paso, asimetría y doble apoyo; tiempo de contacto, longitud de zancada, potencia, oscilación vertical y velocidad de carrera; velocidad, potencia, cadencia y FTP de ciclismo; minutos de Movimiento, Ejercicio y De pie (anillos de A…
  - Móvil (Sí): HealthMetrics.ts:622-1072 (platforms: ['ios']); healthkit/index.ts:266-290 (identificadores HK)
  - iOS/Android: Estrés (MindfulSession), grasa, proteína y sodio dietéticos y exposición al audio ambiental y de auriculares están definidos con enabled:false (HealthMetrics.ts:185, 733, 749, 765, 1005, 1021), así que no se ven.
- **Métricas exclusivas de Health Connect** · _Solo Android_ — Velocidad, potencia, desnivel positivo, masa de agua corporal (el servidor la pasa a %), cadencia de pedaleo y cadencia de pasos.
  - Móvil (Sí): HealthMetrics.ts:450-518, 535-602 (platforms: ['android']); permisos READ_SPEED/POWER/ELEVATION_GAINED/BODY_WATER_MASS/CYCLING_PEDALING_CADENCE/STEPS_CADENCE en app.config.ts:27-70
  - iOS/Android: Solo en Health Connect.
- **Sincronización de salud en segundo plano** · _Difiere iOS/Android_ — Interruptor 'Enable Background Sync'. Registra una tarea periódica (intervalo mínimo de 240 min) con ventanas solapadas para sesiones y ventanas por día para métricas acumuladas.
  - Móvil (Sí): components/SyncFrequency.tsx:17-46; SyncScreen.tsx:293-370 (toggle); services/backgroundSyncService.ts:366-414 (expo-background-task, minimumInterval 240); useAppStartup.ts:122-137
  - iOS/Android: Android pide el permiso READ_HEALTH_DATA_IN_BACKGROUND al activarlo (SyncScreen.tsx:296-330; app.config.ts:71). iOS, además de la tarea, arranca observadores HealthKit con background delivery que sincronizan cuando llegan datos nuevos (healthkit/backgroundDelivery.ts:136-306; SyncScreen.tsx:337-360) y explica que se ejecuta 'cuando el teléfono lo permita' (SyncFrequency.tsx:38-45).
- **Sincronizar al abrir o volver a la app** — Interruptor que lanza una sincronización en el arranque en frío y al volver a primer plano, con ventana de enfriamiento y coordinación con la sincronización en segundo plano.
  - Móvil (Sí): components/SyncOnOpen.tsx; SyncScreen.tsx:979-982; hooks/useAutoSyncOnOpen.ts:151-161; services/autoSyncCoordinator.ts
- **Importar historial completo (backfill)** · _Difiere iOS/Android_ — Pantalla 'Import History' para una importación única y reanudable de todo el historial. Recorre ventanas de 30 días hacia atrás y muestra días importados, registros escritos y tiempo restante. Permite pausar, reanudar y empezar de nuevo, y mantiene la pantalla encendida mientras corre.
  - Móvil (Sí): SyncScreen.tsx:947-958 (fila Import Full History); ImportHistoryScreen.tsx:329-700; services/backfillService.ts; services/backfillCheckpoint.ts
  - iOS/Android: En Android, Health Connect limita la lectura diaria y la importación se reanuda sola (ImportHistoryScreen.tsx:471-478). Sin el permiso READ_HEALTH_DATA_HISTORY solo llega a unos 30 días (512-519; app.config.ts:72; parche patches/react-native-health-connect@4.1.3.patch). En iOS no hay ninguno de estos límites.
  - _Verificación: corregido por verificación_
- **Rutas GPS y FC de los entrenamientos sincronizados** · _Difiere iOS/Android_ — Al sincronizar sesiones de ejercicio se adjuntan las muestras de FC, la ruta GPS y las métricas de la sesión (calorías, distancia, pasos).
  - Móvil (Sí): services/healthconnect/workoutTelemetry.ts; services/healthkit/workoutTelemetry.ts; healthkit/index.ts:190-202, 265 (HKWorkoutRoute)
  - iOS/Android: En Android la ruta exige un consentimiento por sesión con el diálogo del sistema (requestExerciseRoute en workoutTelemetry.ts:140-172, 325-330; app.config.ts:41-46). En iOS la ruta HKWorkoutRoute se lee con la autorización general. En iOS los entrenamientos que escribe el propio Apple Watch se excluyen para no duplicarlos (isOwnWatchWorkout).
- **Escritura de nutrición hacia Apple Health / Health Connect** — Opción, desactivada por defecto, para enviar la nutrición del diario de Sparky al almacén de salud. Se ejecuta tras cada sincronización entrante y omite las entradas que se importaron desde ese almacén.
  - Móvil (Sí): WritebackMetrics.ts:44-54; SyncScreen.tsx:992-997 (HealthDataWriteback); services/writeback.ios.ts → healthkit/writeback.ts; services/writeback.ts → healthconnect/writeback.ts; app.config.ts:75 (WRITE_NUTRITION)
- **Escritura de hidratación hacia Apple Health / Health Connect** — Opción para enviar el agua registrada en Sparky al almacén de salud.
  - Móvil (Sí): WritebackMetrics.ts:55-64; app.config.ts:76 (WRITE_HYDRATION); components/HealthDataWriteback.tsx
- **Eliminar datos escritos por Sparky en la app de salud** — Desde la sección de escritura se puede borrar todo lo escrito o solo un rango de fechas (DateRangeSheet), con confirmación y aviso si el borrado es parcial.
  - Móvil (Sí): SyncScreen.tsx:520-590 (removeWrittenData y confirmación), 992-1001 (HealthDataWriteback y DateRangeSheet)
- **Informe de datos de salud para soporte** · _Solo Android_ — Exporta con la hoja de compartir los datos de las últimas 4 h de Health Connect, redondeados y anonimizados, para adjuntarlos a reportes de errores.
  - Móvil (Sí): SyncScreen.tsx:1008-1050 (bloque {isAndroid && ...}); services/healthDiagnosticService.ts (expo-sharing)
  - iOS/Android: Se muestra solo si Platform.OS === 'android'.
- **Widget de calorías** · _Difiere iOS/Android_ — Muestra las calorías restantes, consumidas y quemadas del día, con botones 'Buscar alimento' y 'Escanear código de barras'. Al tocarlo abre el Dashboard.
  - **Sigue pendiente:** Lo previsto para el widget de calorías de Android (mostrar las calorías consumidas y quemadas, y más tamaños o la posibilidad de redimensionarlo) no está en el código: sigue mostrando solo las kcal restantes, una barra y los botones de buscar y escanear, en un 2x1 fijo y solo en la pantalla de inicio. iOS mantiene sus tamaños pequeño y mediano con las calorías consumidas y quemadas, y las versiones de pantalla de bloqueo. La PR #3228, aún sin fusionar, lo hace redimensionable y añade el objetivo, lo comido y lo quemado en los tamaños grandes.
  - Móvil (Sí): iOS: targets/widget/widgets.swift:179-213, 280-324; Android: targets/android-widget/kotlin/.../CalorieWidget.kt.tmpl:91-157; plugins/withCalorieWidget.ts; hooks/useWidgetSync.ts:63-134; services/CalorieWidgetBridge.ts
  - iOS/Android: En iOS (WidgetKit) hay tamaños systemSmall y systemMedium, más los accesorios de pantalla de bloqueo (widgets.swift:319-322); los botones van en el mediano. En Android (Glance) solo está en la pantalla de inicio, 2x1 y sin redimensionar (res/xml/sparky_calorie_widget_info.xml).
  - _Verificación: corregido por verificación_
- **Widget de macros** · _Difiere iOS/Android_ — Muestra proteína, carbohidratos y grasa del día y las calorías restantes, con atajos para buscar y escanear.
  - **Sigue pendiente:** Los tamaños adicionales o el redimensionado previstos para el widget de macros de Android no están en el código: sigue siendo un 2x2 fijo y solo para la pantalla de inicio. iOS mantiene sus tamaños pequeño y mediano y las versiones de pantalla de bloqueo. La PR #3228, aún sin fusionar, lo hace redimensionable, con los gramos frente a cada objetivo y las kcal comidas en los tamaños grandes.
  - Móvil (Sí): iOS: targets/widget/macroWidget.swift:248-266, 396-428; Android: MacroWidget.kt.tmpl:89-104, 251; res/xml/sparky_macro_widget_info.xml
  - iOS/Android: iOS tiene tamaños pequeño y mediano y versiones de pantalla de bloqueo. Android solo tiene widget de pantalla de inicio.
- **Widget de agua interactivo** · _Solo iOS_ — Muestra el agua del día con botones − y + que quitan o añaden una bebida sin abrir la app.
  - **Actualizado en la PR #3020 (fusionada):** Android también tiene ya un widget de agua interactivo: un widget de 2x2 para la pantalla de inicio con el agua de hoy frente al objetivo, una barra y botones − y + que quitan o añaden una bebida del recipiente elegido en el Panel sin abrir la app. Tiene un único tamaño fijo y no tiene versiones de pantalla de bloqueo, mientras que iOS ofrece tamaños pequeño y mediano y tres formatos de pantalla de bloqueo.
  - Móvil (Sí): targets/widget/waterWidget.swift:152-165 (Button(intent: RemoveWaterIntent/LogWaterIntent)), 250-264; targets/widget/index.swift:10
  - iOS/Android: Android no tiene widget de agua: targets/android-widget solo trae Calorie y Macro.
- **Widgets de pantalla de bloqueo** · _Solo iOS_ — Versiones accessoryCircular, accessoryRectangular y accessoryInline de los widgets de calorías, macros y agua.
  - Móvil (Sí): widgets.swift:319-322; macroWidget.swift:423-426; waterWidget.swift:260-263
  - iOS/Android: Los widgets de Android declaran widgetCategory="home_screen".
- **Controles de Centro de Control y pantalla de bloqueo** · _Solo iOS_ — Siete controles: Registrar agua, Quitar agua, Calorías restantes (abre el diario), Iniciar ayuno, Terminar ayuno, Escanear alimento y Registrar alimento. Los dos últimos abren la app y pasan la pantalla de destino a través del app group.
  - **Cubierto en parte por las PR #2989 y #3020 (fusionadas):** Android tiene cuatro baldosas de Ajustes rápidos equivalentes: Registrar agua (registra una toma en segundo plano, también desde la pantalla de bloqueo), Escanear código, Buscar comida y Calorías restantes (kcal restantes de hoy; abre el diario). Quitar agua, Iniciar ayuno y Terminar ayuno no tienen baldosa; en el móvil, la única forma de quitar una toma sin abrir la app es el botón − del widget de agua de la pantalla de inicio. La baldosa Registrar agua no muestra el total del día como el control de iOS; en Android ese total aparece en el widget de agua.
  - Móvil (Sí): targets/widget/index.swift:9-18 (if #available(iOS 18.0)); targets/widget/Controls.swift:11-146; ShortcutIntents.swift:455-497; hooks/useQuickActions.ts:162-170 (useControlRouteHandoff)
  - iOS/Android: Requiere iOS 18 o posterior.
- **Acciones de Siri y Atajos (App Intents)** · _Solo iOS_ — 'Log water' (1-20 bebidas), 'Remove a water drink', 'Start fast' (1-72 h, 16 por defecto), 'End fast' y 'Log weight' (20-700, en la unidad del usuario). Se pueden lanzar desde Siri, Spotlight, la app Atajos y el botón de Acción, y se ejecutan sin abrir la app.
  - Móvil (Sí): plugins/ios/ShortcutProvider.swift:9-38; targets/widget/ShortcutIntents.swift:260-420; plugins/withBackgroundWater.ts:1-35; modules/background-water/ios/BackgroundWaterModule.swift; services/backgroundWater.ts (credenciales para ejecutar sin abrir la app)
  - iOS/Android: Requiere iOS 16 o posterior. Las frases de Siri solo están en inglés (ShortcutProvider.swift:13-34).
  - _Verificación: corregido por verificación_
- **Accesos rápidos del icono (pulsación larga)** · _Solo iOS_ — Cuatro accesos: Escanear alimento, Registrar alimento, Registrar agua (anota una bebida del recipiente principal sin abrir ninguna pantalla) y Ayuno.
  - **Actualizado en las PR #2989 y #3051 (fusionadas):** Android ya tiene también estas acciones del icono: Escanear comida, Registrar comida y Ayuno mediante expo-quick-actions, y Registrar agua como atajo nativo, que registra sin abrir la app. Las dos plataformas sacan los títulos de las mismas cadenas quickActions, traducidas en 10 de los otros 15 idiomas que trae la app (en húngaro, italiano, letón, noruego y ruso siguen en inglés). En Android, los mensajes de resultado de Registrar agua siguen solo en inglés, y la etiqueta larga del atajo solo está traducida al español, polaco, portugués de Brasil, chino simplificado, chino tradicional y cantonés.
  - Móvil (Sí): hooks/useQuickActions.ts:26-49 (items), 115-131 (acciones), 142 (if Platform.OS !== 'ios' return); App.tsx:219 (QuickActionsGate)
  - iOS/Android: En Android solo existe el acceso 'Log water' (fila siguiente).
- **Acceso directo 'Log water' en el lanzador de Android** · _Solo Android_ — Acceso directo dinámico del icono que registra una bebida en segundo plano con WorkManager, sin abrir la app, y confirma con un toast.
  - **Actualizado en las PR #2989, #3020 y #3051 (fusionadas):** Su etiqueta corta sale de las cadenas quickActions de la app, traducidas en 10 de los otros 15 idiomas que trae; la larga solo está traducida al español, polaco, portugués de Brasil, chino simplificado, chino tradicional y cantonés. Aparece junto a Escanear comida, Registrar comida y Ayuno, nunca trae la app al frente y cada toma registrada con él actualiza también el widget de agua si hay uno colocado. El Toast de resultado sigue solo en inglés y únicamente se ve con las notificaciones de la app activadas (en HyperOS, también las flotantes).
  - Móvil (Sí): targets/android-background-water/kotlin/.../BackgroundWaterModule.kt:21-43 (pushDynamicShortcut); LogWaterActivity.kt:23-60; plugins/withBackgroundWater.ts:7-10
  - iOS/Android: La etiqueta 'Log water' está fija en inglés (BackgroundWaterModule.kt:33-34). No hay accesos para escanear, buscar o ayuno, a diferencia de iOS.
- **Idioma de widgets, Live Activities y superficies nativas** · _Difiere iOS/Android_ — Los widgets, la Live Activity y las demás superficies nativas se recargan en el idioma efectivo de la app cuando este cambia.
  - **Cubierto en parte por las PR #2989, #3020, #3025, #3051 y #3052 (fusionadas):** En Android los widgets de calorías, macros y agua, las baldosas de Ajustes rápidos y las acciones rápidas del icono siguen el idioma de la app y se actualizan cuando cambia; los textos del widget de agua, los nombres de las baldosas Log water y Calories left y la etiqueta larga del atajo Log water solo están traducidos al español, polaco, portugués de Brasil, chino simplificado, chino tradicional y cantonés, y los resultados de Log water siguen en inglés. iOS tiene esas mismas seis traducciones para su widget de agua y sus controles, pero su hook aún reduce el idioma a en/pl y solo recarga los timelines de calorías y macros; en ambas plataformas los títulos de las acciones rápidas no están traducidos al húngaro, italiano, letón, noruego ni ruso, y las cadenas de widget en letón están vacías. Los textos propios de la app de Wear OS están solo en inglés, igual que los de la app del Apple Watch.
  - Móvil (Parcial): App.tsx:329-330 (useWidgetLanguageRefresh, useIOSWidgetLanguageRefresh); targets/android-widget/kotlin/.../WidgetLocale.kt.tmpl, WidgetLocaleApi33.kt.tmpl; targets/widget/en.lproj
  - iOS/Android: Android usa recursos y locale propios para Glance. iOS usa Localizable.strings y recarga mediante ExtensionStorage.
  - _Verificación: corregido por verificación_
- **Live Activity del entrenamiento (pantalla de bloqueo y Dynamic Island)** · _Solo iOS_ — Muestra el nombre del entrenamiento, el tiempo, el ejercicio con 'Serie X de Y' y el objetivo con un botón Completar. Durante el descanso muestra la cuenta atrás con −15 s, +15 s y Saltar. Al tocarla abre el entrenamiento activo.
  - Móvil (Sí): services/WorkoutLiveActivityLayout.tsx:316-349 (botones rest-add-15, rest-subtract-15, rest-skip, complete-set); services/workoutLiveActivity.ios.ts:486; App.tsx:452 (enlace 'active-workout'); app.config.ts:300-312 (expo-widgets)
  - iOS/Android: Los botones necesitan iOS 17 o posterior. Una pulsación hecha después de cerrar la app a la fuerza se pierde. workoutLiveActivity.ts es un no-op en Android.
- **Notificación persistente de entrenamiento (Android)** · _Solo Android_ — Notificación continua con el ejercicio, el progreso de series y el descanso. En Android 16+ usa ProgressStyle con un segmento por ejercicio y pide el chip de estado 'Live Update' (por ejemplo, 3/16).
  - Móvil (Sí): services/workoutLiveActivity.android.ts:12-60; targets/android-workout-notification/kotlin/.../WorkoutNotificationModule.kt:40-95 (SDK_INT >= 36 y ProgressStyle); RestDeadlineReceiver.kt; plugins/withWorkoutNotification.ts; app.config.ts:29 (POST_PROMOTED_NOTIFICATIONS)
  - iOS/Android: No tiene botones (el módulo no usa addAction), a diferencia de los controles de la Live Activity de iOS. Por debajo de Android 16 es una notificación continua normal con el progreso total.
- **Live Activity de carrera y grabación GPS** · _Solo iOS_ — Muestra en la pantalla de bloqueo y la Dynamic Island la grabación GPS del teléfono o la carrera del reloj (tiempo, distancia, ritmo), con botones Pausar/Reanudar y Vuelta. Abre Record Activity.
  - Móvil (Sí): services/RunLiveActivityLayout.tsx:118-134 (run-toggle, run-lap); services/runLiveActivity.ios.ts:460; App.tsx:454 (enlace 'record-activity'); services/runLiveActivity.ts (no-op en Android)
  - iOS/Android: En Android solo hay la notificación fija del servicio en primer plano ('Recording your activity / Tracking your run with GPS', utils/recordingNotification.ts:7-25), sin estadísticas en vivo ni botones.
- **Grabación GPS de actividades (caminar, correr, bici; exterior o interior)** · _Difiere iOS/Android_ — Graba con GPS en segundo plano, con mapa en vivo, distancia, ritmo, desnivel, FC, vueltas, autopausa, cuenta atrás, intervalos y rangos de ritmo o FC, y guarda el resultado en el diario. Se abre desde la AddSheet, el diario y los programas de carrera.
  - **Cubierto en parte por las PR #3052, #3090 y #3154 (fusionadas):** Con un reloj Wear OS emparejado, Android ofrece ahora 'Registrar con: GPS del teléfono / GPS del reloj' para caminatas y carreras, como iOS con un Apple Watch, y el reloj envía la frecuencia cardiaca a las grabaciones con el GPS del móvil; las pruebas de forma física también abren esta pantalla, siempre con el móvil. Una caminata o carrera grabada en el reloj Wear OS llega al móvil con los puntos GPS y las marcas de vuelta en un formato que el móvil descarta, así que se guarda sin mapa, parciales ni vueltas, y sus lecturas de FC van en segundos desde el inicio en lugar de con la hora real, lo que deja casi vacías sus zonas de FC. El selector de ruta para seguir una ruta guardada también aparece en Android al grabar en exterior con el reloj, pero la app de Wear OS ignora la ruta elegida.
  - Móvil (Sí): screens/RecordActivityScreen.tsx:226-239, 1030-1160, 1520-1650; services/gpsRecordingService.ts:1115-1137; hooks/useAddSheetActions.ts:324
  - iOS/Android: iOS usa el modo de fondo 'location' con la píldora azul (app.config.ts:200; gpsRecordingService.ts:1130). Android usa un servicio en primer plano con notificación (gpsRecordingService.ts:1131-1135) y muestra un consejo de batería, 'Recording with the screen off', con enlace a dontkillmyapp.com (RecordActivityScreen.tsx:1443-1466). La opción 'Record with: Phone/Watch' solo aparece con un Apple Watch emparejado (Recor…
- **Distancia en interior con el podómetro del teléfono** · _Difiere iOS/Android_ — Cuenta los pasos para estimar la distancia de caminatas y carreras en interior, y aprende la longitud de zancada a partir de grabaciones en exterior.
  - Móvil (Sí): services/stepCounter.ts:40-95; modules/step-counter/android/.../StepCounterModule.kt; services/strideCalibration.ts; hooks/useIndoorDistanceEstimate.ts; app.config.ts:267-270 (motionUsagePermission)
  - iOS/Android: iOS pide los pasos de la ventana a CMPedometer al terminar. Android guarda el contador de hardware al empezar y lo resta al final (módulo nativo propio); si el teléfono se reinicia en medio, no hay estimación.
- **Exportar la ruta como GPX** — Comparte la ruta de una sesión cardio como archivo GPX mediante la hoja de compartir del sistema.
  - Móvil (Sí): screens/CardioSessionScreen.tsx:203-215, 305-312; services/gpxExport.ts:11 (shareRouteAsGpx)
- **App complementaria para Apple Watch** · _Solo iOS_ — App de watchOS 10+ con páginas deslizables. Recibe el contexto del iPhone por WatchConnectivity y le envía los registros; el reloj no habla directamente con el servidor.
  - **Actualizado en las PR #3052, #3065, #3090 y #3127 (fusionadas):** Android ya tiene una app complementaria para Wear OS (Wear OS 3 o posterior) con las mismas páginas, en el orden y con la visibilidad que se eligen en el teléfono: Objetivos, Agua, Medicamentos, Peso, Tendencia, Entrenamiento, Ayuno y Pasos, más Now Playing durante un entrenamiento. Como la del Apple Watch, solo se comunica con el teléfono (por la Wearable Data Layer), nunca con el servidor. Solo el Apple Watch tiene rutas guardadas, comba (Jump Rope) en interior, la valoración del esfuerzo al terminar un entrenamiento o una carrera, el doble toque y un ajuste para elegir entre teclado y corona al introducir las series (Wear OS ofrece a la vez la corona giratoria, los botones + y − y un teclado numérico).
  - Móvil (Sí): targets/watch/expo-target.config.js:86-94; targets/watch/Presentation/ContentView.swift; modules/watch-connectivity/index.ts:905-907; App.tsx:479-481 (WatchCheckInGate, WatchWorkoutGate)
  - iOS/Android: El módulo watch-connectivity devuelve null en Android. No hay app para Wear OS.
- **Ajustes del Apple Watch en el teléfono** · _Solo iOS_ — Orden y visibilidad de las páginas del reloj, nutrientes de la página Objetivos, 'Double-tap to log a set', 'Ask for effort (RPE) after each set' y forma de introducir las series (teclado o Digital Crown).
  - **Cubierto en parte por la PR #3052 (fusionada):** Android muestra ya una fila Wear OS en Ajustes en cuanto un reloj Wear OS se ha conectado al teléfono. Abre la misma pantalla con el interruptor de RPE, el orden y la visibilidad de las páginas y los nutrientes de la página Objetivos; el doble toque para registrar una serie y la elección entre teclado numérico y Digital Crown para introducir las series son solo de iOS. La descripción del interruptor de RPE para Wear OS (de 5 a 10, con la corona giratoria o +/−) está en inglés en todos los idiomas, mientras que la del Apple Watch está traducida en 6 de los otros 15 idiomas incluidos.
  - Móvil (Sí): SettingsScreen.tsx:54-55 (isPaired), 368-376 (fila Apple Watch); screens/WatchSettingsScreen.tsx:124-245; constants/watchPages.ts:10-19, 55-60
  - iOS/Android: La fila solo aparece si WatchConnectivity.isSupported() e isPaired() devuelven true.
- **Página Objetivos del reloj** · _Solo iOS_ — Anillo de calorías y los nutrientes elegidos en el teléfono (proteína, carbohidratos y grasa por defecto, o cualquiera, incluidos los personalizados).
  - **Actualizado en la PR #3052 (fusionada):** Wear OS ya tiene también la página Objetivos: un anillo de calorías con lo comido frente al objetivo, las calorías que quedan o que sobran y los nutrientes elegidos en el teléfono (proteína, carbohidratos y grasa por defecto, también los personalizados). A diferencia del Apple Watch, no muestra las calorías quemadas.
  - Móvil (Sí): targets/watch/Presentation/GoalSummaryView.swift; utils/watchNutrients.ts; hooks/useWatchCheckInBridge.ts
  - iOS/Android: Solo Apple Watch.
- **Página Agua del reloj** · _Solo iOS_ — Registrar agua desde la muñeca y ver el total del día ('incluye X de la comida' si está activado), con la lista de registros y la opción de borrar cada uno.
  - **Actualizado en la PR #3052 (fusionada):** Wear OS también tiene ya la página Agua: un botón por recipiente, el total de hoy frente al objetivo con «Includes X from food» y las bebidas del día, cada una de las cuales se puede quitar tras confirmar «Remove Drink?». Además tiene un botón Undo Last, que no existe en el Apple Watch y quita una bebida sin preguntar (una vez sincronizadas las tomas, la primera del día y no la última), y, si no se ha sincronizado ningún recipiente, muestra unos botones provisionales Glass (250 ml) y Bottle (500 ml) donde el Apple Watch muestra un aviso.
  - Móvil (Sí): targets/watch/Presentation/WaterIntakeView.swift; WaterLogView.swift:68-124; utils/watchWater.ts
  - iOS/Android: Solo Apple Watch.
- **Página Medicamentos del reloj** · _Solo iOS_ — Lista las dosis programadas de hoy y los medicamentos 'a demanda'. Un toque marca la dosis como tomada y otro la desmarca; omitir y repetir dosis a demanda se hace en el teléfono.
  - **Actualizado en la PR #3052 (fusionada):** Wear OS ya tiene la página Medicamentos: la misma lista que envía el teléfono, con el recuento de dosis tomadas, y un toque marca la dosis como tomada o la desmarca. Omitir una dosis sigue haciéndose en el teléfono. A diferencia del Apple Watch, no muestra el estado de sincronización ni permite reintentar, y no indica qué dosis se han omitido.
  - Móvil (Sí): targets/watch/Presentation/MedicationsView.swift; utils/watchMedications.ts; useWatchCheckInBridge.ts
  - iOS/Android: Solo Apple Watch.
- **Check-in de peso y tendencia en el reloj** · _Solo iOS_ — Registrar peso y % de grasa desde el reloj (con la diferencia frente a la última medida y aviso de cambios bruscos) y ver la tendencia de peso.
  - **Actualizado en la PR #3052 (fusionada):** Wear OS también tiene ya el check-in de peso y la página Tendencia: el peso se ajusta con la corona o el bisel giratorios, con +/− o con un teclado, el % de grasa corporal es opcional, se ve la diferencia con el último pesaje con un aviso si el cambio es brusco, se puede fijar un peso inicial cuando no hay historial y hay un gráfico de las últimas 14 entradas de peso con una media móvil, o de grasa corporal. A diferencia del Apple Watch, no indica cuándo sustituye la entrada de hoy ni muestra la diferencia de grasa corporal con la última entrada ni avisa de un cambio brusco.
  - Móvil (Sí): targets/watch/Presentation/CheckInEntryView.swift:12-31, 140-168; TrendView.swift:107; Application/CheckInStore.swift
  - iOS/Android: Solo Apple Watch.
- **Página Ayuno del reloj** · _Solo iOS_ — Contador del ayuno en curso. Permite iniciar un 16:8, 18:6 o 20:4, o terminar el actual con confirmación.
  - **Cubierto en parte por la PR #3052 (fusionada):** Wear OS ya tiene una página Ayuno con el tiempo transcurrido y el progreso frente al objetivo, el botón End Fast (sin paso de confirmación) y una complicación de ayuno. Iniciar un ayuno desde ella no funciona: ofrece 16:8, 18:6, 20:4 y OMAD, pero envía la etiqueta ('16:8') donde el teléfono espera el id de un preset ('16-8'), así que el teléfono rechaza todos los inicios y no se guarda ningún ayuno.
  - Móvil (Sí): targets/watch/Presentation/FastingView.swift:44-107; hooks/useWatchFastingBridge.ts
  - iOS/Android: Solo Apple Watch.
- **Página Pasos del reloj** · _Solo iOS_ — Pasos de hoy frente a una meta fija de 10.000.
  - **Actualizado en la PR #3052 (fusionada):** Wear OS ya tiene una página Pasos con los pasos de hoy frente al objetivo de pasos de la persona (10.000 si no hay ninguno), además de una complicación de pasos. A diferencia del Apple Watch, que solo muestra el recuento del teléfono, también usa el sensor de pasos del propio reloj cuando marca más.
  - Móvil (Sí): targets/watch/Presentation/StepsView.swift; useWatchCheckInBridge.ts (steps, stepGoal)
  - iOS/Android: Solo Apple Watch.
  - _Verificación: corregido por verificación_
- **Seguimiento del entrenamiento de fuerza en el reloj** · _Solo iOS_ — Al empezar un entrenamiento en el teléfono, el plan se envía al reloj y la app del reloj se abre sola. Desde la muñeca se registran series (teclado o Digital Crown, doble toque), el descanso va sincronizado (±15 s, Saltar) con vibración al terminar, la FC se mide en segundo plano con HKWorkoutSessi…
  - **Actualizado en la PR #3052 (fusionada):** En Wear OS también, un entrenamiento iniciado en el teléfono se envía al reloj y pone la app en primer plano; las series se registran una por pantalla con la corona o el bisel giratorios o con un teclado, la FC se lee en un servicio en primer plano y se envía al teléfono, y durante el entrenamiento aparece una página Now Playing. El descanso tiene los botones +15 s y Skip y vibra al terminar, pero un descanso iniciado o cambiado en el teléfono no se ve en el reloj (los cambios del reloj sí llegan al teléfono). No hay doble toque ni botón de −15 s.
  - Móvil (Sí): targets/watch/Presentation/WorkoutView.swift; Application/WorkoutSessionStore.swift; Infrastructure/WorkoutHealthKitController.swift; Presentation/NowPlayingPage.swift; Domain/WatchPage.swift:13; hooks/useWatchWorkoutBridge.ts; useWatchSetTargetsSync.ts; modules/watch-connectivity/ios/WatchConnectivityModule.swift:285 (startWatchApp)
  - iOS/Android: El doble toque necesita watchOS 11 y un reloj compatible.
- **Iniciar y editar entrenamientos desde el reloj** · _Solo iOS_ — Lista los entrenamientos guardados y los programados para hoy, y permite empezarlos desde la muñeca. Durante el entrenamiento se puede añadir o borrar una serie, cambiar su tipo, añadir o borrar ejercicios, y terminar o descartar.
  - **Actualizado en las PR #3010 y #3052 (fusionadas):** Wear OS también lista ya los entrenamientos guardados y los programados para hoy y los inicia desde la muñeca; durante el entrenamiento se puede añadir o borrar una serie, cambiar su tipo, añadir, borrar o saltar un ejercicio, ir a cualquier serie y terminar o descartar, pero sin las confirmaciones que pide el Apple Watch. En los dos relojes, un entrenamiento iniciado desde la muñeca recibe ya los objetivos de progresión y la detección de récords del teléfono aunque no se llegue a abrir la pantalla de entrenamiento del teléfono, y ninguno de los dos puede reemplazar un ejercicio todavía.
  - Móvil (Sí): targets/watch/Presentation/WorkoutEditPages.swift; hooks/useWatchWorkoutStart.ts; useWatchWorkoutEdit.ts; useWatchPlanSync.ts; utils/workoutPlanSchedule.ts
  - iOS/Android: 'Reemplazar ejercicio' todavía no está en el reloj.
- **Fin de entrenamiento en el reloj** · _Solo iOS_ — Celebra los récords personales con banner y vibración, muestra un resumen (duración, series, volumen, FC media y máxima, energía) y guarda un HKWorkout en Apple Health, que cuenta para los anillos. Si el entrenamiento venía de una plantilla y cambió, pregunta '¿Actualizar entrenamiento?'.
  - **Actualizado en las PR #3052 y #3065 (fusionadas):** Wear OS también celebra ya un nuevo récord personal con un aviso y una vibración, pregunta «Update Preset?» si un entrenamiento de una plantilla se cambió en el reloj y termina con un resumen de series, duración, FC media y calorías (estimadas a partir de la FC). No muestra el volumen ni la FC máxima, no guarda el entrenamiento en Health Connect y no tiene la valoración de esfuerzo de 1 a 10 («How hard was that?») que el resumen del Apple Watch pide ahora y guarda en el servidor y, con watchOS 11 o posterior, en Apple Health.
  - Móvil (Sí): Application/WorkoutSessionStore.swift (makeSummary, celebratedPrSetIds); App.tsx:482 (PendingPresetUpdatePrompt); hooks/useWorkoutCompletePresetSync.ts; services/healthkit/dataTransformation.ts (isOwnWatchWorkout)
  - iOS/Android: Solo Apple Watch.
- **Carrera o caminata independiente en el reloj** · _Solo iOS_ — En exterior o interior, con el GPS y la FC del propio reloj: autopausa, avisos de voz, alertas de ritmo y FC, vueltas, corrección de distancia de cinta al terminar y resumen. El teléfono la sigue en vivo en 'WatchRunLive' y puede pausar, marcar vuelta, terminar o descartar.
  - **Cubierto en parte por las PR #3052, #3065, #3069, #3090 y #3127 (fusionadas):** Wear OS ya graba también una carrera o caminata por su cuenta: en exterior con el GPS del reloj o en interior, con planes, alertas de ritmo y de FC, pausa automática, avisos de voz, vueltas, corrección de la distancia en cinta y resumen, y el teléfono la sigue y la controla en WatchRunLive. El teléfono guarda estas sesiones sin mapa, parciales ni vueltas, porque descarta los puntos GPS y las marcas de vuelta que envía el reloj, y sin cadencia ni zancada, porque el reloj no envía el recuento de pasos y Android no tiene otra fuente para obtenerlo. Solo el Apple Watch ofrece la comba (Jump Rope) en interior, seguir una ruta guardada (mapa, avisos de giro y aviso de salida de ruta) y la valoración del esfuerzo al terminar.
  - Móvil (Sí): targets/watch/Presentation/WatchRunView.swift:29-311; Application/WatchRunStore.swift; Infrastructure/WatchRunHealthKitController.swift, WatchRunCues.swift; screens/WatchRunLiveScreen.tsx; hooks/useWatchRunBridge.ts; App.tsx:611-612
  - iOS/Android: Solo Apple Watch.
- **Control de la grabación GPS del teléfono desde el reloj** · _Solo iOS_ — Mientras el teléfono graba la ruta, el reloj muestra tiempo, distancia, ritmo y FC, permite pausar, reanudar, marcar vuelta o terminar, y envía la FC, que queda adjunta a la actividad.
  - **Actualizado en la PR #3052 (fusionada):** Wear OS ya funciona también como mando de la grabación GPS del teléfono. Muestra el tiempo, la distancia, el ritmo, la FC y el tramo actual del plan, tiene los botones Pause/Resume, Lap y Stop, y envía la FC del reloj para adjuntarla a la actividad. A diferencia del Apple Watch, no muestra ningún resumen al terminar la grabación.
  - Móvil (Sí): targets/watch/Presentation/RecordingView.swift:14-109; hooks/useWatchRecordingBridge.ts:30-45
  - iOS/Android: Solo Apple Watch.
- **Complicaciones de la esfera del Apple Watch** · _Solo iOS_ — Calorías, Agua, Proteína, Carbohidratos, Grasa, Ayuno y Pasos, en tamaños circular, de esquina, rectangular e inline. Al tocarlas abren la página correspondiente.
  - **Actualizado en la PR #3052 (fusionada):** Wear OS ya tiene las mismas siete complicaciones: Calorías, Proteína, Carbohidratos, Grasa, Agua, Ayuno y Pasos, cada una como valor en rango (indicador) o texto corto. Al tocarlas se abre la página Objetivos para calorías y macros, o la de Agua, Ayuno o Pasos. Los formatos no coinciden: en el Apple Watch, Calorías y Agua solo son circulares y el resto también tiene versión de esquina, rectangular y en línea (inline).
  - Móvil (Sí): targets/watch-widget/index.swift:5-14; MacroComplications.swift; FastingComplication.swift; StepsComplication.swift; ComplicationLinks.swift
  - iOS/Android: Solo Apple Watch.
  - _Verificación: corregido por verificación_
- **Interruptor general y permiso de notificaciones** — Interruptor 'Allow Notifications' para todas las alertas, aviso cuando el sistema las ha denegado y acceso a los ajustes del sistema.
  - Móvil (Sí): AppSettingsScreen.tsx:228-238; NotificationSettingsScreen.tsx:231-250; services/notifications.ts:246-315; components/NotificationPermissionBanner.tsx, OSDeniedWarningCard.tsx
- **Alerta de fin de descanso con acción 'Complete Set'** · _Difiere iOS/Android_ — Notificación programada 'Rest complete' con un botón para completar la serie desde la propia notificación. Se activa con el interruptor 'Rest Timer'.
  - Móvil (Sí): services/notifications.ts:93-101 (categoría), 381-430 (scheduleRestNotification); NotificationSettingsScreen.tsx:256-275
  - iOS/Android: En iOS se marca como 'timeSensitive' y atraviesa los modos Concentración (app.config.ts:212; notifications.ts:404-408). En Android depende del permiso de alarmas exactas (ver native-notif-exact-alarm), y la notificación se quita a mano tras pulsar la acción (notifications.ts:457).
- **Recordatorios de hidratación** — Aviso para beber agua tras N horas sin registrar, solo dentro de una ventana horaria (inicio y fin) configurable.
  - Móvil (Sí): services/notifications.ts:585-632; NotificationSettingsScreen.tsx:399-470; components/HydrationReminderReconciler.tsx (DashboardScreen.tsx:36); hooks/useHydrationReminder.ts
- **Aviso de episodio de síntoma todavía abierto** — A las 24 h de abrir un episodio, pregunta si sigue activo con las acciones 'End now' y 'Still ongoing'.
  - Móvil (Parcial): services/symptomReminderService.ts:17-90; hooks/useSymptoms.ts; useAppStartup.ts:81
  - _Verificación: corregido por verificación_
- **Permiso de alarmas exactas** · _Solo Android_ — Al empezar un entrenamiento, avisa una sola vez para activar 'Alarms & reminders' y que los descansos y la medicación suenen a su hora (sin él, Android las retrasa unos 15 s).
  - Móvil (Sí): services/notifications.ts:336-379; services/ExactAlarmBridge.ts; targets/android-exact-alarm/kotlin/.../ExactAlarmModule.kt; plugins/withExactAlarmModule.ts; app.config.ts:80
  - iOS/Android: Desde Android 13 este acceso especial viene denegado por defecto.
  - _Verificación: corregido por verificación_
- **Respuesta háptica** — Vibraciones suaves en temporizadores y confirmaciones, con un interruptor 'Haptic Feedback'. También decide si vibra el Apple Watch al terminar el descanso o con un récord.
  - **Actualizado en la PR #3052 (fusionada):** En el teléfono, el interruptor sigue funcionando igual en las dos plataformas. El reloj Wear OS de Android no lo tiene en cuenta: vibra al pulsar botones, al terminar el descanso y con un nuevo récord aunque el interruptor esté desactivado, mientras que el Apple Watch omite esas vibraciones cuando está desactivado.
  - Móvil (Sí): AppSettingsScreen.tsx:240-252; services/haptics.ts:6-20 (expo-haptics)
- **Bajar la música durante los avisos** — Baja un momento la música de otras apps mientras suena un pitido o un aviso de voz del entrenamiento.
  - Móvil (Sí): WorkoutSettingsScreen.tsx:184-202; services/sounds.ts:84 (interruptionMode duckOthers)
- **Avisos de voz durante la grabación GPS** — Anuncios hablados (inicio, pausa, autopausa, reanudación, parciales por km o milla, pasos de intervalos) que se pueden activar con 'Voice cues'.
  - Móvil (Sí): RecordActivityScreen.tsx:1150-1160; services/recordingCues.ts:29-55; utils/recordingCues.ts:23-25
- **Mantener la pantalla encendida** — Evita que la pantalla se apague durante un entrenamiento activo (interruptor, y siempre en modo guiado) y durante la importación del historial.
  - Móvil (Sí): WorkoutSettingsScreen.tsx:204-222; components/ActiveWorkoutKeepAwake.tsx:9-23 (App.tsx:1320); ImportHistoryScreen.tsx:17, 484
- **Lectura de etiquetas en el dispositivo (Apple Intelligence)** · _Solo iOS_ — Lee 'Nutrition Facts' y 'Supplement Facts' con el modelo local del iPhone y, si falla, recurre a la IA del servidor. Tiene un interruptor en Ajustes de IA y un aviso 'Label read on this iPhone'.
  - Móvil (Sí): modules/on-device-nutrition/index.ts:44-50 (isAvailable: iOS 27+ con Apple Intelligence); ios/OnDeviceNutritionModule.swift; services/onDeviceLabelScan.ts:15, 251; onDeviceSupplementScan.ts:177; AiSettingsScreen.tsx:61-140; FoodScanScreen.tsx:582-615
  - iOS/Android: Solo iOS 27+ con Apple Intelligence activo. En Android el módulo es null.
- **Sonido del obturador** — Interruptor 'Camera shutter' para que suene o no al hacer fotos en el escáner.
  - Móvil (Sí): AppSettingsScreen.tsx:254-265; FoodScanScreen.tsx:88, 726 (shutterSound)
- **Navegación Liquid Glass (iOS 26)** · _Solo iOS_ — Opción para usar la barra de pestañas y las cabeceras nativas con cristal de iOS 26.
  - Móvil (Sí): AppSettingsScreen.tsx:211-226; services/nativeTabBarPreference.ts:13, 26; components/TabsLayout.tsx; patches/react-native-bottom-tabs@1.4.0.patch
  - iOS/Android: La fila solo aparece si canUseLiquidGlass() es true. Android siempre usa CustomTabBar.
- **Enlaces profundos sparkyfitnessmobile://** — Rutas '' (Dashboard), scan, search, settings/voice, active-workout y record-activity, usadas por widgets, Live Activities y controles. Solo funcionan después del onboarding.
  - **Actualizado en las PR #2989, #3020, #3071 y #3078 (fusionadas):** Ahora también hay rutas para el diario ('diary', a la que lleva la baldosa de Ajustes rápidos Calorías restantes de Android), los ajustes de zonas de frecuencia cardiaca ('settings/heart-rate-zones') y la generación de recorridos ('routes/generate'); ningún widget, baldosa ni Live Activity usa las dos últimas. Las baldosas Escanear código y Buscar comida usan scan y search, y un toque fuera de los botones del widget de agua de Android abre el Panel con el enlace raíz, como en iOS. Solo en Android, un enlace o atajo que abrió la app no vuelve a abrir su pantalla cuando Android la restaura después de que el sistema la haya cerrado en segundo plano (withQuickActionLaunchGuard).
  - Móvil (Sí): App.tsx:439-458 (linking), 466-476 (se activa tras salir de Onboarding)
- **Registros locales e informe de diagnóstico** — Pantalla 'View Logs' y botón 'Share Diagnostic Report', que exporta versión, estado de sincronización y logs sin datos personales.
  - Móvil (Sí): SettingsScreen.tsx:389-420; services/diagnosticReportService.ts (expo-sharing); services/LogService.ts
- **Gestión de servidores autoalojados** · _Difiere iOS/Android_ — Varios servidores guardados; marcar uno como activo, probar la conexión o abrir la web; iniciar sesión con usuario o con API key; cabeceras de proxy; HTTPS obligatorio en producción.
  - Móvil (Sí): screens/ServerSettingsScreen.tsx:335-500; components/ServerConfigModal.tsx:62-188; services/storage.ts (proxyHeaders)
  - iOS/Android: Las builds de producción de Android confían en las CA instaladas por el usuario, útil con certificados propios (plugins/withNetworkSecurityConfig.ts:24-27; app.config.ts:134). iOS pide permiso de red local para servidores en la LAN (NSLocalNetworkUsageDescription, app.config.ts:171).
- **FC en vivo y objetivos por rango de FC al grabar con GPS** · _Solo iOS_ — Durante la grabación GPS (o al grabar desde el reloj) se muestra la FC y se pueden fijar rangos objetivo de FC: general, trabajo, suave y calentamiento en intervalos. Los objetivos por ritmo no necesitan reloj.
  - **Actualizado en las PR #3052 y #3078 (fusionadas):** En Android, un reloj Wear OS emparejado aporta ahora la frecuencia cardiaca, así que las tarjetas de rango de FC (general y, en intervalos, trabajo, suave y calentamiento) aparecen y avisan tanto cuando el móvil graba con su GPS como cuando el reloj graba la caminata o la carrera, aunque en una carrera grabada en el reloj Wear OS los rangos de los intervalos solo avisan mientras está activada la alerta general de FC, y los rangos de ritmo de los intervalos necesitan igualmente la alerta general de ritmo. Como en iOS, no hay FC sin reloj, ni en las salidas en bici, ni compatibilidad con pulsómetros Bluetooth; en ambas plataformas, los rangos sugeridos para los intervalos siguen ahora las zonas de frecuencia cardiaca de los ajustes. La descripción de la tarjeta principal en Android ('Needs your Wear OS watch…') no está traducida a ningún otro idioma, mientras que la del Apple Watch está traducida en 6 de los otros 15 idiomas incluidos.
  - Móvil (Sí): screens/RecordActivityScreen.tsx:146-158 (bandas por defecto), 268-269 (watchAvailable = watchSupported && watchPaired && activity !== 'ride'), 407 (calentamiento por FC solo con reloj), 497, 1200-1201 y 1316-1345 (HeartRateBandCard solo con watchAvailable); hooks/useWatchRecordingBridge.ts:251 (FC del reloj)
  - iOS/Android: Hace falta un Apple Watch emparejado, así que solo funciona en iOS y no en bici. En Android la grabación GPS no tiene FC ni objetivos de FC; solo objetivos por ritmo. No se admiten pulsómetros Bluetooth.
  - _Verificación: añadido durante la verificación_
- **Escanear etiqueta o código de barras de un suplemento para rellenar el medicamento** · _Difiere iOS/Android_ — En el formulario de medicamento, el móvil ofrece 'Scan label to fill in': hace una foto con la cámara o la elige de la galería, y la etiqueta 'Supplement Facts' se lee primero con el modelo del dispositivo (iOS 27+) y si no con la IA del servidor. También ofrece 'Scan barcode to fill in', que abre …
  - Móvil (Sí): screens/MedicationFormScreen.tsx:181 (useSupplementLabelScan), 276-306 (ImagePicker.launchCameraAsync o launchImageLibraryAsync), 959-999 ('Scan barcode to fill in' → FoodScan y 'Scan label to fill in'); hooks/useSupplementLabelScan.ts:23-28 (primero onDeviceSupplementScan, después el servidor); services/api/medicationsApi.ts:56-62 (POST /api/v2/medications/supplement-label/scan); servidor: routes/v2/medicationRoute…
  - iOS/Android: Está en las dos plataformas a través del servidor. Solo en iOS 27+ con Apple Intelligence (y el interruptor de AiSettingsScreen activo) se intenta antes la lectura en el dispositivo (modules/on-device-nutrition/index.ts:44-59, null en Android).
  - _Verificación: añadido durante la verificación_

#### En ambos, con diferencias (6)

- **FC del reloj durante y después del entrenamiento** · _Difiere iOS/Android_ — FC en vivo en la tarjeta de cada ejercicio, FC media y máxima en el resumen y el detalle del entrenamiento, y reparto por zonas de FC.
  - **Actualizado en las PR #3052 y #3078 (fusionadas):** Android ya recibe FC en vivo de un reloj Wear OS, que la envía durante el entrenamiento: las tarjetas de ejercicio la muestran en directo y sus muestras dan después la misma FC media, máxima y por zonas. Sin reloj, Android sigue sin FC en vivo. Las zonas se calculan ahora con los ajustes de zonas de FC de cada persona, salvo en las sesiones del Apple Watch con watchOS 27, que conservan las zonas de Apple, y las barras de zonas indican con qué método se calcularon.
  - Web (Parcial): La web muestra las zonas de FC de los entrenamientos guardados (translation.json:4846), pero no la FC en vivo.
  - Móvil (Sí): stores/liveHeartRateStore.ts; components/ActiveWorkoutExerciseCard.tsx; screens/WorkoutCompleteScreen.tsx; hooks/useWorkoutHeartRateZones.ts
  - iOS/Android: La FC en vivo solo llega con un Apple Watch, es decir, solo en iOS. Las cifras guardadas que vienen de entrenamientos sincronizados se ven en las dos plataformas.
- **Alertas de ayuno (objetivo alcanzado y aviso previo)** — Avisa cuando se alcanza el objetivo del ayuno y unos minutos antes (30 por defecto, configurable entre 0 y 180).
  - Web (Parcial): pages/Settings/FastingSettings.tsx:48-72, 245 permite configurar 'Pre-Goal Warning (minutes)' y 'Goal & Eating Window Notifications' como preferencias del servidor, pero la web no envía notificaciones.
  - Móvil (Sí): services/notifications.ts:486-583; components/FastingGoalReconciler.tsx:15-27 (montado en DashboardScreen.tsx:35); NotificationSettingsScreen.tsx:277-295; FastingSettingsScreen.tsx:77-153
- **Recordatorios de medicación** — Notificación por cada dosis programada con acciones 'Taken' y 'Skip', más opciones para repetir recordatorios, ocultar el nombre del medicamento y agrupar recordatorios simultáneos.
  - **Actualizado en las PR #2985 y #3005 (fusionadas):** Cada recordatorio, suelto o agrupado, tiene ahora también en ambas plataformas un botón para que vuelva a avisar al cabo de 10, 15, 30 o 60 minutos, según lo elegido en los ajustes de notificaciones. En Android los botones Tomada, Omitir y posponer funcionan ahora también con la app en segundo plano o cerrada, y en ambas plataformas una acción que falla se guarda y se reintenta más tarde. La web sigue limitándose a configurar los horarios, sin enviar recordatorios.
  - Web (Parcial): La web configura los horarios ('Schedules & Reminders', translation.json:703-704; pages/Medications/AddMedicationDialog.tsx) de los que salen los recordatorios, pero no los entrega.
  - Móvil (Sí): services/notifications.ts:103-142 (categorías), 144; services/medicationReminderService.ts; medicationNotificationHandler.ts:22-30; NotificationSettingsScreen.tsx:299-395; App.tsx:1321 (MedicationReminderReconciler)
- **Sonido de fin de descanso y 'Play through silent mode'** · _Difiere iOS/Android_ — Campanilla al terminar el descanso, con la opción de que suene aunque el teléfono esté en silencio.
  - Web (Parcial): Tonos Web Audio al terminar el descanso o un intervalo, solo con la pestaña visible (pages/Diary/WorkoutPlaybackPage.tsx:535-576; utils/workoutSounds.ts). No hay opción de modo silencio.
  - Móvil (Sí): WorkoutSettingsScreen.tsx:134-182; services/sounds.ts:32-120
  - iOS/Android: En iOS, con 'silent mode' activo, también suena en segundo plano y con la pantalla bloqueada gracias a una pista silenciosa (UIBackgroundModes 'audio', app.config.ts:200; sounds.ts:38-45). En Android solo suena con la app abierta (fuera de ella el aviso es la notificación), aunque ignora el modo silencio o vibración.
- **Escaneo de la etiqueta nutricional (IA del servidor)** — Hace una foto a la tabla nutricional y rellena el formulario del alimento con lo que lee la IA del servidor.
  - Web (Parcial): SparkyFitnessFrontend/src no tiene flujo de escaneo de etiquetas; solo hay una foto de 'Nutrition label' para contribuir a Open Food Facts.
  - Móvil (Sí): screens/FoodScanScreen.tsx:576-640 (modo 'label'); services/api/externalFoodSearchApi.ts:727 (POST /scan-label)
  - _Verificación: corregido por verificación_
- **Persistencia local de lo que está en curso** — Conserva en el dispositivo el entrenamiento activo, los borradores y las grabaciones GPS no guardadas, y encola los mensajes del reloj hasta que hay conexión.
  - **Actualizado en la PR #3052 (fusionada):** Con un reloj Wear OS, Android también pone ya en cola los mensajes del reloj: el reloj guarda lo que no ha podido enviar hasta que el teléfono está a su alcance, el teléfono guarda en un archivo los mensajes que aún no puede entregar hasta que la app los lee, y las carreras terminadas en el reloj esperan en la misma cola guardada que en iOS.
  - Web (Parcial): Solo guarda el borrador de la reproducción del entrenamiento en localStorage (utils/workoutPlayback.ts:208-248) y el shell en caché del service worker.
  - Móvil (Sí): stores/activeWorkoutStore.ts:6 (zustand persist); services/workoutDraftService.ts; RecordActivityScreen.tsx:956-959 ('Your recording is kept on this phone'); services/watchRunQueue.ts; DashboardScreen.tsx:467 (estado sin conexión)

#### En ambos clientes, pero con diferencias iOS/Android (2)

- **Mapa de ruta en actividades cardio** · _Difiere iOS/Android_ — Dibuja la ruta GPS de la sesión sobre un mapa.
  - Web (Sí): components/Exercises/WorkoutGpsMap.tsx (Leaflet); pages/Reports/ActivityReportMap.tsx
  - Móvil (Sí): utils/routeMapSupport.ts:13-21; components/exerciseStats/RouteTileMap.tsx; app.config.ts:16-22, 283-289 (react-native-maps)
  - iOS/Android: iOS usa siempre Apple Maps. Android solo usa Google Maps si la build lleva GOOGLE_MAPS_ANDROID_API_KEY; si no, dibuja la línea de la ruta sin mapa de fondo.
- **Idioma de la app** · _Difiere iOS/Android_ — Usar el idioma del dispositivo o elegir uno de los idiomas incluidos.
  - Web (Sí): pages/Settings/PreferenceSettings.tsx:592-595 (Select de idioma); components/LanguageHandler.tsx
  - Móvil (Sí): AppSettingsScreen.tsx:113-130, 165-208; targets/android-language/kotlin/.../AppLanguageModule.kt, AppLanguageApi33.kt; plugins/withAppLanguage.ts; hooks/useAppLanguageForegroundSync.ts; app.config.ts:160-165, 192
  - iOS/Android: En iOS el idioma se cambia en Ajustes de iOS: la fila abre Linking.openSettings y muestra 'Managed by iOS'. En Android hay un selector propio sincronizado con 'Idiomas de las apps' del sistema en Android 13+ (LocaleManager); en Android 12 o anterior se guarda como preferencia local.

<details><summary>En paridad web ↔ móvil (6)</summary>

- Voz guiada en entrenamientos (síntesis de voz)
- Dictado por voz en el chat
- Escaneo de códigos de barras con la cámara
  - **Actualizado en las PR #2989 y #3126 (fusionadas):** En Android el escáner ahora también se abre desde la acción rápida Escanear comida del icono de la app, como en iOS, y desde la baldosa de Ajustes rápidos Escanear código, que hace de equivalente en Android al control de iOS y pide desbloquear el móvil antes si está bloqueado. Los widgets de calorías y macros tienen botón para escanear en Android y en su tamaño mediano en iOS; el widget de agua no lo tiene en ninguna de las dos plataformas. Tras escanear, la web y el móvil ofrecen la opción Other sources (solo en inglés) para comparar las coincidencias de otros proveedores de códigos de barras activados sin volver a escanear.
- Cámara y galería para fotos
- Tema de la interfaz
- Elegir la voz del sistema para los avisos hablados

</details>

<details><summary>Descartado tras verificación: no existe en ninguno (1)</summary>

- App para Wear OS / relojes Android — No existe en la web.
  - **Actualizado en las PR #3052, #3065, #3090 y #3127 (fusionadas):** Android tiene ya una app complementaria para Wear OS con las páginas de la app del Apple Watch (Objetivos, Agua, Medicamentos, Peso, Tendencia, Entrenamiento con Now Playing, Ayuno y Pasos), entrenamientos de fuerza, carreras y caminatas, control de la grabación GPS del teléfono y las mismas siete complicaciones (Calorías, Proteína, Carbohidratos, Grasa, Agua, Ayuno y Pasos). En Wear OS no están el seguimiento de rutas guardadas, la comba, el doble toque, la valoración del esfuerzo al terminar ni el guardado de entrenamientos en Health Connect; el RPE por serie va de 5 a 10 en lugar de 1 a 10, y empezar un ayuno desde el reloj falla porque el teléfono rechaza el plan que le envía el reloj. Las dos apps de reloj muestran sus textos solo en inglés.

</details>

### 2.14 Elementos añadidos por el crítico de completitud

#### Solo en la web (10)

- **CSV: plantilla descargable, pegar texto y editar filas antes de importar** — En cada importador CSV se puede descargar una plantilla, pegar el CSV como texto ('Parse Text') y revisar los datos en una tabla editable antes de importar: añadir filas, borrar filas y editar celdas.
  - Web (Sí): pages/Foods/FoodImportFromCSV.tsx:496,687 (Download Template), 669 (Add Row), 704-717 (pegar y Parse Text), 976 (Delete Row). pages/Diary/FoodDiaryImportCSV.tsx:495,749. pages/Exercises/ExerciseImportCSV.tsx:267. pages/Exercises/ExerciseEntryHistoryImportCSV.tsx:267. pages/CheckIn/HealthDataImportCSV.tsx:272.
  - _Verificación: añadido por el crítico de completitud_
- **CSV: opciones de formato con autodetección** — Una barra de formato detecta y permite cambiar el delimitador (coma, punto y coma, tabulador o barra vertical), el formato numérico (1,234.56 US o 1.234,56 EU), el formato de fecha y el carácter de comillas. Incluye una vista previa de columnas y filas detectadas.
  - Web (Sí): components/CsvImport/CsvFormatBar.tsx:134 (Delimiter), 168 (Number format), 215 (Date format), 271 (Quote character). components/CsvImport/CsvFormatPreview.tsx. Se usa en FoodImportFromCSV.tsx:727, FoodDiaryImportCSV, HealthDataImportCSV.tsx:36-37 e importadores de ejercicios.
  - _Verificación: añadido por el crítico de completitud_
- **CSV: mapeo manual de columnas** — Cuando las cabeceras del archivo no coinciden con las esperadas, un diálogo 'Map CSV Headers' permite asignar cada campo obligatorio a una columna del archivo.
  - Web (Sí): components/CsvImport/CsvHeaderMappingDialog.tsx:61-66. Se usa en pages/Foods/FoodImportFromCSV.tsx:40,757, pages/CheckIn/HealthDataImportCSV.tsx:39, FoodDiaryImportCSV e importadores de ejercicios. Claves foodCsvImport.headersMismatchFile y diaryCsvImport.headersMismatch.
  - _Verificación: añadido por el crítico de completitud_
- **CSV: panel de resultados con filas fallidas** — Al terminar la importación se muestra un resumen (Importados, Omitidos, Fallidos) con la opción 'View failed rows' para ver qué filas fallaron y por qué.
  - Web (Sí): components/CsvImport/CsvImportResultPanel.tsx:57 ('View failed rows'). Claves csvImport.resultImported/resultSkipped/resultFailed. Se usa en HealthDataImportCSV.tsx:38 y en los demás importadores.
  - _Verificación: añadido por el crítico de completitud_
- **CSV: sobrescribir alimentos existentes y ámbito de coincidencia** — El CSV de alimentos puede actualizar la nutrición de alimentos ya existentes (mismo nombre y marca) en vez de fallar, y filtra o resalta los alimentos sin variante por defecto. El CSV de diario permite elegir contra qué alimentos buscar coincidencias (Míos, Familia o Público) y sobrescribir la nutr…
  - Web (Sí): pages/Foods/FoodImportFromCSV.tsx:1001 (overrideLabel), 138 y 788-801 (filtro 'Show Missing Default'). pages/Diary/FoodDiaryImportCSV.tsx:841-893 (matchScope: My Items / Family / Public, overrideDescription).
  - _Verificación: añadido por el crítico de completitud_
- **Importación CSV de salud por categorías** — El importador de datos de salud pide elegir una categoría: Medidas corporales, Sueño (con fases opcionales en JSON stage_events), Constantes y personalizadas, Actividad diaria, Hidratación (convertida a ml) o Ánimo (con etiquetas). Cada categoría tiene su propia plantilla y sus campos.
  - Web (Sí): pages/CheckIn/HealthDataImportCSV.tsx:202 (selector 'Data category'). constants/healthDataImport.ts:80 (Body Measurements), 128 (Sleep), 184 (Vitals & Custom), 231 (Daily Activity), 275 (Hydration), 305 (Mood). HealthDataImportCSV.tsx:134-138 usa AliasChipInput para las etiquetas de ánimo.
  - Nota: Es un desglose de checkin-health-csv-import y settings-data-import-checkin, que solo tratan el importador en general.
  - _Verificación: añadido por el crítico de completitud_
- **Claves API de solo lectura y con caducidad** — Al generar una clave API se elige el acceso, Completo o Solo lectura (una clave de solo lectura solo puede leer, también vía MCP), y la caducidad: Nunca, 7, 30 o 90 días, o 1 año. El listado marca las claves de solo lectura con una insignia.
  - Web (Sí): pages/Settings/ApiSettings.tsx:68 y 213 (Expires In: never/7/30/90 días/1 año), 256-259 (Access: Full access / Read-only), 326 (insignia Read-only en el listado).
  - _Verificación: añadido por el crítico de completitud_
- **Conectar asistentes de IA externos al servidor MCP** — Permite conectar Claude Desktop, Cursor, Open WebUI y otros clientes al endpoint MCP del servidor (POST /mcp) con una clave API como Bearer token. El asistente puede leer y registrar comida, ejercicio, biometría, objetivos, etc.
  - Web (Parcial): No hay ninguna pantalla de configuración MCP. El usuario solo puede generar la clave en Settings > Developer & Integrations > API Key Management (pages/Settings/ApiSettings.tsx), y el administrador activa las herramientas de diagnóstico MCP en pages/Admin/AuthenticationSettings.tsx:245. La configuración del cliente se explica en docs/src/features/mcp-server.md (sección 'Getting Started').
  - Nota: La fila admin-auth-dev-tools-toggle solo cubre el interruptor de herramientas de diagnóstico para administradores, no la conexión MCP de un usuario normal.
  - _Verificación: añadido por el crítico de completitud_
- **Copiar/pegar asignaciones entre días y reordenar sesiones del plan de entrenamiento** — En el editor de planes se puede copiar un ejercicio o preset asignado y pegarlo en otro día o sesión. En los planes secuenciales también se pueden subir y bajar las sesiones.
  - Web (Sí): pages/Exercises/AddWorkoutPlanDialog.tsx:458 y 608 (botón 'Paste'), 539 ('Move session up/down'). hooks/Exercises/useWorkoutPlanAssignments.tsx:465 (toast 'Copied!').
  - Nota: Desglosa parte del 'partial' de exercise-plans-editor.
  - _Verificación: añadido por el crítico de completitud_
- **Notas en las mediciones personalizadas** — Cada valor de una categoría de medición personalizada admite una nota opcional al registrarlo en el check-in.
  - Web (Sí): pages/CheckIn/CheckInForm.tsx:519-531 (Input custom-notes-{category.id} con placeholder 'Notes (optional)'). Claves customMeasurements.notesOptionalLabel y notesLabel.
  - _Verificación: añadido por el crítico de completitud_

#### Solo en el móvil (8)

- **Tema AMOLED (negro puro)** — Una cuarta opción de tema, además de Claro, Oscuro y Sistema, con fondo negro puro pensado para pantallas OLED.
  - Móvil (Sí): SparkyFitnessMobile/src/screens/AppSettingsScreen.tsx:81-98: las opciones de tema son Light, Dark, AMOLED y System. App.tsx calcula isDarkMode = theme === 'dark' || theme === 'amoled'.
  - Nota: Las filas de tema que ya hay (settings-pref-theme, missed-settings-theme, native-theme) no recogen esta diferencia.
  - _Verificación: añadido por el crítico de completitud_
- **Sincronización de salud: 'Quick Sync' o 'All Sync'** — Al sincronizar a mano se elige entre Quick Sync, que envía los datos pero no relee los entrenamientos ya sincronizados, y All Sync, que además relee el mapa y la frecuencia cardiaca de esos entrenamientos (más lenta).
  - Móvil (Sí): src/screens/SyncScreen.tsx:773-791 (syncChoiceItems 'quick' y 'all' con runSync(false/true)) y 1005-1009 (ActionSheet).
  - _Verificación: añadido por el crítico de completitud_
- **Deslizar hacia abajo para actualizar (pull-to-refresh)** — En las pantallas principales se tira hacia abajo para volver a pedir los datos al servidor.
  - Móvil (Sí): src/screens/DashboardScreen.tsx:417 y 550-552 (RefreshControl onRefresh), src/screens/DiaryScreen.tsx:482 y 615-617. Hay RefreshControl en 14 archivos de src.
  - _Verificación: añadido por el crítico de completitud_
- **Pegar la URL del servidor y la clave API desde el portapapeles** — Botones para pegar la URL del servidor y la clave API sin escribirlas, tanto al conectarse por primera vez como al añadir o editar un servidor.
  - Móvil (Sí): src/screens/OnboardingScreen.tsx:667 ('Paste URL from clipboard') y 968 ('Paste API key from clipboard'). src/components/ServerConfigModal.tsx:902 y 1083.
  - _Verificación: añadido por el crítico de completitud_
- **Ajustes de la calculadora de calentamiento** — Pantalla para activar la calculadora y definir su esquema: series de calentamiento con porcentaje y repeticiones, añadir o quitar series, restablecer el esquema por defecto y elegir el redondeo de discos y de mancuernas.
  - Móvil (Sí): src/screens/WarmupSettingsScreen.tsx:187-200 (activar Warm-up Calculator), 209 (Warmup Method), 227-278 (series W con % y repeticiones, Add/Remove set), 289 (Reset to default), 296-309 (Plate rounding), 317-330 (Dumbbell rounding). Se abre desde WorkoutSettingsScreen.tsx:225-228.
  - Nota: La fila exercise-warmup-calculator solo cubre el uso de la calculadora y 'Añadir calentamientos', no su configuración.
  - _Verificación: añadido por el crítico de completitud_
- **Renombrar el entreno en curso** — Desde el menú del entreno en vivo se puede cambiar el nombre de la sesión antes de guardarla.
  - Móvil (Sí): src/components/ActiveWorkoutHeader.tsx:31 y 164 ('Rename workout' en el menú). src/components/ActiveWorkoutRenameModal.tsx:71 (modal con campo 'Workout name').
  - _Verificación: añadido por el crítico de completitud_
- **Borrar las series registradas del entreno en curso** — Acción para borrar de una vez todas las series ya marcadas del entreno en vivo, o las de un solo ejercicio, sin quitar los ejercicios.
  - Móvil (Sí): src/components/ActiveWorkoutHeader.tsx:41 y 209 ('Clear all logged sets'). src/components/ActiveWorkoutOverflowSheet.tsx ('Clear logged sets' por ejercicio).
  - _Verificación: añadido por el crítico de completitud_
- **Deslizar una fila para eliminar o ajustar** — En varias listas se desliza la fila para revelar acciones como Eliminar, Ajustar porción o Editar: entradas de comida, ejercicios del día, ingredientes de una comida, historial de ciclos, tests de fertilidad e historial de ayunos.
  - Móvil (Sí): src/components/SwipeableFoodRow.tsx ('Adjust serving' / 'Delete food'), SwipeableExerciseRow.tsx ('Delete exercise'), SwipeableIngredientRow.tsx ('Edit' / 'Remove'), SwipeableDeleteRow.tsx. Se usan en MealTypeDetailScreen, EditLoggedMealScreen, FoodSummary, ExerciseSummary, wellness/CycleHistoryList, wellness/ttc/TestQuickLog y FastingHistorySheet.
  - Nota: El borrado en sí ya está en diary-delete-entry y el ajuste de porción en diary-serving-quick-adjust. Esta fila recoge el gesto, que se extiende a listas que esas filas no mencionan.
  - _Verificación: añadido por el crítico de completitud_

#### En ambos, con diferencias (3)

- **Insignia 'From Plan' en entradas creadas por un plan de comidas** — Los planes de comidas activos rellenan el diario automáticamente. La web marca esas entradas con la insignia 'From Plan' y avisa en el editor de plan de que pueden estar activos varios planes a la vez.
  - Web (Sí): pages/Diary/MealCard.tsx:387-388 (isFromMealPlan = meal_plan_template_id), 511-513 y 679-681 (Badge 'From Plan'). pages/Foods/MealPlanTemplateForm.tsx:533 (multipleActiveHint: 'Active plans automatically populate diary entries').
  - Móvil (Parcial): Las entradas generadas por el plan aparecen en el diario porque las crea el servidor, pero no se distinguen de las demás: el campo meal_plan_template_id existe en src/types/foodEntries.ts:24 y ningún componente lo usa (SwipeableFoodRow, FoodSummary y FoodEntryViewScreen no muestran origen).
  - _Verificación: añadido por el crítico de completitud_
- **Índice glucémico (GI) del alimento** — Clasificación del índice glucémico (Ninguno, Muy bajo, Bajo, Medio, Alto, Muy alto) que se asigna a cada variante del alimento y se ve en el diario.
  - Web (Sí): components/FoodSearch/NutrientFormGrid.tsx:143-156 (selector 'Glycemic Index (GI)' en el formulario). pages/Diary/MealCard.tsx:417-435 y 520-525 / 686-691 ('GI: {{giValue}}' en cada fila del diario si está en quickInfoNutrients). También en EditFoodEntryDialog.tsx y en NutrientDisplaySettings.
  - Móvil (Parcial): Solo se muestra como resumen del día en src/screens/DailyNutritionDetailsScreen.tsx:34-56, 147 y 248. No se puede editar: components/FoodForm.tsx no tiene campo glycemic_index. Hay etiqueta en constants/nutrients.ts:100.
  - _Verificación: añadido por el crítico de completitud_
- **Confirmación al cerrar con cambios sin guardar** — Al cerrar un formulario o diálogo con cambios pendientes, la app pide confirmar antes de perderlos.
  - Web (Sí): components/ui/dialog.tsx:88-110 (requireConfirmation: 'Are you sure you want to close this? Any unsaved changes will be lost.'). Se usa en FoodSearch/FoodFormDialog, Diary/EditFoodEntryDialog, Diary/ConvertToMealDialog, Foods/MealManagement, Foods/Foods, Exercises/WorkoutPresetForm, Exercises/AddWorkoutPlanDialog, Exercises/AddExerciseDialog, Settings/DataImportSettings y CsvHeaderMappingDialog.
  - Móvil (Parcial): Solo hay guardas beforeRemove en algunos casos. screens/foodForm/CreateFoodMode.tsx:144-152, EditFoodMode.tsx:237 y AdjustNutritionMode.tsx:145 solo protegen los tamaños equivalentes sin guardar. FoodEntryMultiAddScreen.tsx:321-335 protege la selección múltiple. La grabación GPS pide confirmar al descartar (RecordActivityScreen.tsx:810-825). Los demás formularios (comidas, presets, medicación…) se cierran sin pregun…
  - _Verificación: añadido por el crítico de completitud_

<details><summary>En paridad web ↔ móvil (4)</summary>

- Pantallas de error y recuperación (404, error de pantalla con 'Reintentar')
- Totales nutricionales por comida y por día en el editor de planes de comidas
- Escáner: escribir el código de barras a mano y encender la linterna
- Descartar un entreno en vivo o una actividad grabada

</details>

## 3. iOS ↔ Android

Diferencias de plataforma dentro de la app móvil, reunidas desde los barridos específicos (configuración nativa, pantallas, componentes y servicios) y desde los dominios funcionales.

### 3.1 Solo en iOS (115)

**Diferencias iOS/Android: configuración nativa**

- **App complementaria para Apple Watch (watchOS 10+)** — Solo iOS: target watchOS generado por @bacons/apple-targets (app.json plugin '@bacons/apple-targets') y módulo nativo WatchConnectivity solo con carpeta ios/. En Android no existe equivalente (ni Wear OS): todos los hooks useWatch*Bridge salen sin hacer nada porque WatchConnectivity es null.
  - **Actualizado en las PR #3052, #3065, #3090 y #3127 (fusionadas):** Android tiene ya una app complementaria para Wear OS (Wear OS 3 o posterior, con sus opciones en Ajustes → Wear OS del teléfono) con las mismas páginas y las mismas siete complicaciones. Registra agua, peso y medicación, termina ayunos (empezar uno falla: el teléfono no reconoce el plan que envía el reloj), hace entrenamientos de fuerza y graba caminatas y carreras con su propio GPS o en cinta, con entrenamientos de programa, alertas de ritmo y de frecuencia cardiaca y avisos de voz. Solo el Apple Watch tiene seguimiento de rutas guardadas, comba, doble toque, valoración del esfuerzo al terminar y guardado de entrenamientos en Apple Health (la app de Wear OS no escribe nada en Health Connect); además, Wear OS puntúa el esfuerzo de las series de 5 a 10 en lugar de 1 a 10, calcula las calorías a partir del pulso y su página Now Playing solo tiene botones de reproducción y volumen. Los textos propios de las dos apps de reloj están solo en inglés.
  - Evidencia: SparkyFitnessMobile/targets/watch/expo-target.config.js:135-173 (type 'watch', deploymentTarget 10.0, HealthKit + App Group); targets/watch/Presentation/ContentView.swift:126-321; targets/watch/Domain/WatchPage.swift:9-17; modules/watch-connectivity/expo-module.config.json (platforms ['ios']); src/hooks/useWatchConnectivity.ts:15 (isSupported = Pl…
- **Reloj: página Objetivos (nutrición vs objetivos)** — Requiere iPhone con Apple Watch emparejado. Inexistente en Android.
  - **Actualizado en la PR #3052 (fusionada):** La app de Wear OS tiene la misma página de objetivos: un anillo de calorías con las calorías restantes o el exceso y, debajo, los nutrientes elegidos y ordenados en Ajustes > Wear OS del teléfono (proteínas, carbohidratos y grasas por defecto).
  - Evidencia: SparkyFitnessMobile/targets/watch/Presentation/GoalSummaryView.swift:3-11; modules/watch-connectivity/index.ts:66-76 (WatchGoalNutrientPayload); src/constants/watchPages.ts (DEFAULT_WATCH_NUTRIENTS)
- **Reloj: registrar agua y borrar bebidas** — Solo Apple Watch. Android no tiene superficie de reloj.
  - **Actualizado en la PR #3052 (fusionada):** La app de Wear OS tiene la página de agua: el progreso frente al objetivo (un anillo en lugar de una botella), un botón por recipiente del servidor (Glass de 250 ml y Bottle de 500 ml si no hay ninguno sincronizado), el agua procedente de la comida y el registro de bebidas del día, donde cada bebida se puede quitar tras confirmar. Además tiene un botón Undo Last que quita una bebida sin preguntar; una vez sincronizadas las tomas, es la primera bebida del día y no la última.
  - Evidencia: SparkyFitnessMobile/targets/watch/Presentation/WaterIntakeView.swift:4-12; targets/watch/Presentation/WaterLogView.swift:3-11; modules/watch-connectivity/index.ts:101-118 (WatchWaterIntakePayload / WatchWaterDeletePayload)
- **Reloj: marcar dosis de medicación** — Solo Apple Watch.
  - **Actualizado en la PR #3052 (fusionada):** La app de Wear OS tiene la página de medicación: las dosis de hoy con el recuento de tomadas, donde un toque marca una dosis como tomada o la desmarca (el teléfono borra la entrada). Omitir una dosis sigue siendo solo desde el teléfono. A diferencia del Apple Watch, no indica que una dosis se omitió ni si un toque se está sincronizando todavía.
  - Evidencia: SparkyFitnessMobile/targets/watch/Presentation/MedicationsView.swift:4-12; modules/watch-connectivity/index.ts:120-144 (WatchMedicationTakenPayload / WatchMedicationDosePayload)
- **Reloj: check-in matinal de peso/grasa corporal con Corona Digital y gráfico de tendencia** — Solo Apple Watch.
  - **Actualizado en la PR #3052 (fusionada):** La app de Wear OS también tiene el check-in de peso: el peso se ajusta con la corona giratoria o con los botones −/+, con un teclado numérico al tocarlo para los saltos grandes, un paso opcional de % de grasa corporal y el cambio desde la última entrada. Una página de tendencia aparte muestra los últimos 14 pesos con una línea de media móvil, o la grasa corporal, y se alterna con un toque o con la corona. A diferencia del Apple Watch, no abre la tendencia al guardar y, sin historial, el peso inicial se fija con un botón 'Set Start' en lugar de una pantalla guiada que se abre sola.
  - Evidencia: SparkyFitnessMobile/targets/watch/Presentation/CheckInEntryView.swift:4-11,319-321; targets/watch/Presentation/TrendView.swift:5-16; targets/watch/Presentation/ContentView.swift:325-368 (FirstRunEntryView); modules/watch-connectivity/index.ts:78-99
- **Reloj: entrenamiento de fuerza en la muñeca** — En iOS con reloj emparejado, al iniciar un entrenamiento el reloj se arma automáticamente y aporta FC en vivo. En Android el entrenamiento solo existe en el teléfono, sin FC en vivo.
  - **Actualizado en las PR #3052 y #3065 (fusionadas):** Un reloj Wear OS hace ya también entrenamientos de fuerza: entrenamientos programados para hoy y plantillas para empezar, una serie por pantalla con +/−, la corona giratoria o un teclado numérico, RPE opcional, un temporizador de descanso con +15s y Skip, opciones para editar series, ejercicios y el entrenamiento, un breve aviso 'New PR!', la respuesta a 'Update Preset?' y una página Now Playing. Su frecuencia cardiaca en directo llega a la tarjeta del ejercicio en el teléfono, y empezar un entrenamiento en un teléfono Android lo abre en el reloj conectado. A diferencia del Apple Watch, no tiene doble toque, el RPE solo va de 5 a 10, el resumen no muestra volumen, FC máxima ni valoración del esfuerzo, terminar o descartar no pide confirmación y el entrenamiento no se guarda en ningún servicio de salud, mientras que el Apple Watch lo guarda en HealthKit.
  - Evidencia: SparkyFitnessMobile/targets/watch/Presentation/WorkoutView.swift:53-57; targets/watch/Presentation/WorkoutEditPages.swift:3-12,95,134; targets/watch/Presentation/NowPlayingPage.swift:4-10; targets/watch/Infrastructure/WorkoutHealthKitController.swift; targets/watch/expo-target.config.js:112-123 (WKBackgroundModes workout-processing); src/hooks/use…
- **Reloj: caminar/correr solo con el reloj y pantalla 'WatchRunLive' en el teléfono** — Solo iOS + Apple Watch. En Android solo existe la grabación GPS con el teléfono.
  - **Cubierto en parte por las PR #3052, #3065, #3090 y #3127 (fusionadas):** La app de Wear OS ya graba caminatas y carreras por sí sola, en exterior con el GPS del reloj o en interior a partir de los pasos, con tiempo, distancia, ritmo, frecuencia cardiaca, pausa, vueltas, planes por intervalos, pausa automática, alertas de ritmo y de frecuencia cardiaca, avisos de voz y corrección de la distancia de la cinta; se inicia desde el reloj o desde el teléfono, que la sigue en WatchRunLive. Después, el teléfono guarda estas sesiones sin mapa, parciales ni vueltas, porque descarta los puntos GPS y las marcas de vuelta que envía la app de Wear OS. Siguen siendo solo del Apple Watch la comba (Jump Rope), seguir una ruta guardada (en Android el teléfono sigue ofreciéndola, en la pantalla de grabación y con 'Start on watch', pero la carrera de Wear OS la ignora y 'Send to watch' falla), la valoración del esfuerzo al terminar, los tramos de intervalos que terminan por distancia (Wear OS pasa al siguiente cuando se cumple su tiempo previsto) y los avisos de entrenamiento más completos (mitad, último minuto, aviso y cuenta atrás de cada tramo, hitos de distancia).
  - Evidencia: SparkyFitnessMobile/targets/watch/Presentation/WatchRunView.swift:3-7,274-276; targets/watch/Application/WatchRunStore.swift; targets/watch/Domain/WatchAutoPause.swift, WatchPaceAlert.swift, WatchHeartRateAlert.swift, WatchCoaching.swift, WatchIndoorAutoPause.swift; targets/watch/Infrastructure/WatchRunCues.swift; src/screens/WatchRunLiveScreen.ts…
- **Reloj: mando de la grabación GPS del teléfono** — Solo con Apple Watch; en Android la grabación solo se controla desde el teléfono/notificación.
  - **Actualizado en la PR #3052 (fusionada):** La app de Wear OS también sirve de mando de la grabación GPS del teléfono: mientras el teléfono graba, muestra la actividad, el tiempo, la distancia, el ritmo, la frecuencia cardiaca y el intervalo en curso, con Pause/Resume, Lap y Stop, y envía su frecuencia cardiaca al teléfono. A diferencia del Apple Watch, no muestra una pantalla de totales al terminar la grabación.
  - Evidencia: SparkyFitnessMobile/targets/watch/Presentation/RecordingView.swift:3-7; targets/watch/Application/RecordingStore.swift; src/hooks/useWatchRecordingBridge.ts
- **Reloj: páginas Ayuno y Pasos** — Solo Apple Watch.
  - **Cubierto en parte por la PR #3052 (fusionada):** La app de Wear OS tiene una página de ayuno (tiempo transcurrido y progreso hacia el objetivo, 'End Fast' sin paso de confirmación, y 16:8, 18:6, 20:4 u OMAD para empezar uno) y una página de pasos del día frente al objetivo, que también usa el contador de pasos del propio reloj cuando va por delante de la cifra del teléfono. Iniciar un ayuno desde Wear OS falla: el reloj envía el nombre del plan ('16:8', 'OMAD') donde el teléfono espera el id del preset ('16-8'), así que el teléfono lo rechaza. Terminar un ayuno funciona.
  - Evidencia: SparkyFitnessMobile/targets/watch/Presentation/FastingView.swift:3-5; targets/watch/Presentation/StepsView.swift:3-5; src/hooks/useWatchFastingBridge.ts:27
- **Complicaciones de esfera del Apple Watch** — Solo watchOS.
  - **Actualizado en la PR #3052 (fusionada):** La app de Wear OS también tiene siete complicaciones: calorías, proteínas, carbohidratos, grasas, agua, ayuno y pasos, y cada una abre su página al tocarla (las de calorías y macros abren Objetivos). Solo existen como complicaciones de valor en rango o de texto corto, mientras que el Apple Watch ofrece formatos circular, de esquina, rectangular o en línea según la complicación.
  - Evidencia: SparkyFitnessMobile/targets/watch-widget/index.swift:4-14; targets/watch-widget/EnergyGoalComplication.swift:286-288; MacroComplications.swift:227-263; FastingComplication.swift:160-164; StepsComplication.swift:124-128; WaterGoalComplication.swift:220-223; targets/watch-widget/expo-target.config.js:218-255; targets/watch/Domain/WatchDeepLink.swift…
- **Ajustes > Apple Watch** — La fila solo aparece en iOS con reloj emparejado; en Android nunca se muestra.
  - **Cubierto en parte por la PR #3052 (fusionada):** Android ya muestra una fila 'Wear OS' en Ajustes en cuanto se ha conectado un reloj Wear OS. Abre la misma pantalla, con el interruptor que pide el esfuerzo (RPE) tras cada serie, de 5 a 10 en Wear OS y de 1 a 10 en el Apple Watch, además del orden y la visibilidad de las páginas y los nutrientes de la página de objetivos. El doble toque para registrar una serie y la elección de entrada de series (teclado numérico o Digital Crown) solo aparecen en iOS.
  - Evidencia: SparkyFitnessMobile/src/screens/SettingsScreen.tsx:53-55,368-376 (fila solo si WatchConnectivity.isSupported() && isPaired()); src/screens/WatchSettingsScreen.tsx:103-245; App.tsx:1082-1083; src/constants/watchPages.ts
- **Grabar actividad: selector 'Grabar con' (teléfono/reloj) y alertas de frecuencia cardiaca** — En Android watchAvailable es siempre false, así que no se ven el selector ni las alertas de FC (no hay fuente de FC).
  - **Actualizado en las PR #3052 y #3090 (fusionadas):** En Android con un reloj Wear OS emparejado aparecen ya la opción 'Registrar con' (teléfono o reloj) y las tarjetas de rango de frecuencia cardiaca (salvo en bicicleta), con el pulso que mide el sensor del reloj. Una carrera en el reloj la graba la app de Wear OS con su propio GPS, o con su contador de pasos en interior, pero ignora la ruta guardada que el teléfono ofrece para una carrera al aire libre, y el teléfono guarda la sesión sin mapa, parciales ni vueltas. La descripción de Android de la tarjeta principal de frecuencia cardiaca ('Needs your Wear OS watch…') aún no está traducida a ningún otro idioma, mientras que la del Apple Watch está traducida en 6 de los otros 15 idiomas incluidos.
  - Evidencia: SparkyFitnessMobile/src/screens/RecordActivityScreen.tsx:261-269 (watchAvailable), 1073-1100 (Record with), 1200-1215 (HeartRateBandCard), 1316-1400 (HR de tramos rápido/calentamiento)
- **Programas de carrera: mostrar referencia de ritmo en el reloj** — En Android la tarjeta aparece sin la opción del reloj.
  - **Actualizado en la PR #3052 (fusionada):** El interruptor para usar también la referencia de ritmo en el reloj aparece ya en Android, con el texto 'Also use on my Wear OS watch', y pone los rangos de ritmo basados en la carrera en el entrenamiento del programa que ofrece la app de Wear OS. Ese texto aún no está traducido a ningún otro idioma, mientras que el del Apple Watch está traducido en 6 de los 15. En las dos plataformas el interruptor aparece siempre que hay una carrera de referencia, haya o no un reloj emparejado, pero el Apple Watch comprueba cada tramo con su rango por sí solo, mientras que la app de Wear OS solo lo hace si se activa la alerta de ritmo en esa carrera.
  - Evidencia: SparkyFitnessMobile/src/screens/RunProgramsScreen.tsx:325-336 y 443 (prop watch solo si Platform.OS === 'ios')
- **Widget de agua con botones +/-** — Solo iOS (los botones requieren iOS 17+). Android no tiene widget de agua.
  - **Actualizado en la PR #3020 (fusionada):** Android tiene ya un widget de agua de pantalla de inicio con Glance cuyos botones − y + quitan o añaden una bebida en segundo plano (con WorkManager y la misma petición que el atajo y la baldosa Registrar agua), sin abrir la app. A diferencia de iOS, muestra una barra en lugar de un anillo, tiene un único tamaño fijo de 2x2 y no tiene variantes de pantalla de bloqueo (accessoryCircular/Rectangular/Inline); además, muestra una breve línea de estado cuando un cambio falla.
  - Evidencia: SparkyFitnessMobile/targets/widget/waterWidget.swift:134-166 (LogDrinkButton con Button(intent: LogWaterIntent/RemoveWaterIntent), iOS 17+), 250-263 (familias); src/hooks/useWidgetSync.ts:21-37,113 (waterSnapshot / canLog); src/screens/DashboardScreen.tsx:310
- **Widgets de pantalla de bloqueo (calorías, macros, agua)** — Los widgets Android declaran android:widgetCategory="home_screen" únicamente (targets/android-widget/res/xml/*.xml).
  - Evidencia: SparkyFitnessMobile/targets/widget/widgets.swift:198-213,319-322; targets/widget/macroWidget.swift:253-266,423-426; targets/widget/waterWidget.swift:175-193,260-263
- **Controles de Centro de control / pantalla de bloqueo / botón Acción** — Requiere iOS 18+. Android no tiene Quick Settings tiles equivalentes.
  - **Cubierto en parte por las PR #2989 y #3020 (fusionadas):** Android tiene cuatro baldosas de Ajustes rápidos: Registrar agua, Escanear código, Buscar comida y Calorías restantes (muestra las kcal restantes de hoy y abre el diario). Siguen siendo solo de iOS Quitar agua, Iniciar ayuno y Terminar ayuno como controles, la cantidad de agua en el control Registrar agua y el botón Acción; en Android, el agua del día y un botón − para quitar una toma están en el widget de agua de la pantalla de inicio.
  - Evidencia: SparkyFitnessMobile/targets/widget/index.swift:10-18 (if #available(iOS 18.0)); targets/widget/Controls.swift:11-156; targets/widget/ShortcutIntents.swift:463-496 (ScanFoodControlIntent, LogFoodControlIntent, OpenDiaryControlIntent con openAppWhenRun); src/hooks/useQuickActions.ts:155-189 (useControlRouteHandoff vía App Group)
- **Acciones de Siri y Atajos (sin abrir la app)** — iOS 16+. Android solo tiene un atajo de lanzador 'Log water' (ver plat-native-quick-actions); no hay Registrar peso ni Ayuno por voz/atajo.
  - **Cubierto en parte por las PR #2989 y #3020 (fusionadas):** Android registra una toma sin abrir la app desde el atajo Registrar agua del lanzador, la baldosa de Ajustes rápidos Registrar agua (también en la pantalla de bloqueo) y el botón + del widget de agua, y quita una con el botón − del widget. Cada toque es una toma, mientras que la acción Registrar agua de iOS admite de 1 a 20. Android sigue sin equivalente a la voz, la app Atajos o el botón Acción, y sin atajo, baldosa ni widget que registre el peso o inicie o termine un ayuno; la acción rápida Ayuno del icono solo abre la pantalla de ayuno.
  - Evidencia: SparkyFitnessMobile/targets/widget/ShortcutIntents.swift:1-30,260-445 (LogWaterIntent, RemoveWaterIntent, LogWeightIntent, StartFastIntent, EndFastIntent; openAppWhenRun=false); plugins/ios/ShortcutProvider.swift:8-38 (AppShortcutsProvider con frases); plugins/withBackgroundWater.ts:26-35,62-98 (copia al target de la app); modules/background-water…
- **Escaneo de etiquetas nutricionales y de suplementos en el dispositivo (Apple Intelligence)** — Solo iOS 27+ con Apple Intelligence activado. En Android (y iOS antiguos) la pantalla Ajustes > IA muestra 'Not available on this device. It needs iOS 27 or later with Apple Intelligence...' y todo escaneo de etiqueta va al servidor.
  - Evidencia: SparkyFitnessMobile/modules/on-device-nutrition/expo-module.config.json (platforms ['ios']); modules/on-device-nutrition/index.ts:43-59; modules/on-device-nutrition/ios/OnDeviceNutritionModule.swift:14,125-217 (@available(iOS 27)); src/services/onDeviceLabelScan.ts:15-21,250-258; src/services/onDeviceSupplementScan.ts:177-184; src/screens/FoodScan…
- **Métricas de salud solo en iOS (HealthKit)** — No aparecen en Android. Stress, grasa/proteína/sodio dietéticos y exposición de audio están marcados como iOS pero deshabilitados (enabled: false), así que no se ven en ninguna plataforma.
  - Evidencia: SparkyFitnessMobile/src/HealthMetrics.ts:622 (bloodAlcoholContent), 651 (menstruationFlow), 770-866 (walking*), 873-917 (running*), 924-972 (cycling*), 1026-1058 (appleMoveTime/ExerciseTime/StandTime) con platforms: ['ios']. Desactivadas en ambas: stress, nutritionDietary*, environmental/headphoneAudioExposure (enabled: false)
- **Aviso de fin de descanso 'Time Sensitive'** — En Android el equivalente es el canal 'Workout timer' de importancia alta + alarmas exactas.
  - Evidencia: SparkyFitnessMobile/src/services/notifications.ts:407-419 (interruptionLevel: 'timeSensitive'); app.config.ts:210-212 (entitlement com.apple.developer.usernotifications.time-sensitive)
- **Navegación Liquid Glass (barra de pestañas nativa iOS 26)** — Solo iOS 26+ con APIs de glass disponibles; en Android la fila no aparece y se usa siempre la barra de pestañas personalizada.
  - Evidencia: SparkyFitnessMobile/src/utils/liquidGlass.ts:9-19 (solo iOS con expo-glass-effect); src/services/nativeTabBarPreference.ts:11-27; src/screens/AppSettingsScreen.tsx:211-226; App.tsx:332

**Diferencias iOS/Android: componentes**

- **Métricas de salud sincronizables solo en iOS (HealthKit)** — Estas métricas no aparecen en Android. Hay otras entradas solo para iOS definidas pero desactivadas (enabled:false), que no se ven en ninguna plataforma: stress (HealthMetrics.ts:183/185), nutritionDietaryFatTotal/Protein/Sodium (731-765) y environmentalAudioExposure/headphoneAudioExposure (1003-1021).
  - Evidencia: La lista se filtra por plataforma en SparkyFitnessMobile/src/HealthMetrics.ts:1076-1084 y la pinta SparkyFitnessMobile/src/components/HealthDataSync.tsx:117,252-271. Entradas platforms:['ios'] activas: bloodAlcoholContent (HealthMetrics.ts:632), menstruationFlow (661), walkingSpeed (780), walkingStepLength (796), walkingAsymmetryPercentage (814), …
- **Nota sobre la sincronización en segundo plano (solo iOS)** — El interruptor existe en las dos plataformas. Solo iOS explica que el sistema decide cuándo se ejecuta el trabajo en segundo plano; Android no muestra ninguna nota.
  - Evidencia: SparkyFitnessMobile/src/components/SyncFrequency.tsx:38-45 (Platform.OS === 'ios' && <Text>{t('syncFrequency.iosNote')}</Text>); se muestra en SparkyFitnessMobile/src/screens/SyncScreen.tsx:976
- **Barra sobre el teclado ('Hecho' / 'Siguiente' / 'Siguiente serie') al editar series de una actividad registrada** — En Android, al editar series en el Detalle de actividad no hay barra de accesorios: no hay botón 'Siguiente serie' ni 'Hecho' sobre el teclado. Hay que tocar cada celda o cerrar el teclado con Atrás. En iOS la barra va enganchada a cada campo. Los botones +/- de StepperInput están en las dos plataformas.
  - Evidencia: SparkyFitnessMobile/src/components/EditableSetRow.tsx:282-314 (inputAccessoryViewID solo cuando Platform.OS === 'ios'), 404-413 (<InputAccessoryView> con SetInputAccessoryBar solo en iOS). Su único consumidor es SparkyFitnessMobile/src/screens/ActivityDetailScreen.tsx:749 (EditableSetList), que no tiene StickySetInputAccessoryBar de respaldo. En c…
- **DevTools: estado del enlace con el Apple Watch** — Solo iOS, porque depende del companion de watchOS, y solo en builds de desarrollo. Android no tiene ningún diagnóstico de reloj equivalente.
  - **Actualizado en la PR #3052 (fusionada):** La sección aparece ya también en Android, con el título 'Wear OS' y los mismos indicadores y textos de emparejado y accesible, y sigue saliendo solo en las compilaciones de desarrollo. En Android, 'emparejado' significa que un reloj Wear OS se ha conectado al teléfono al menos una vez (y se recuerda desde entonces) y 'accesible', que hay uno conectado ahora, aunque el texto sigue hablando de la app del reloj en primer plano.
  - Evidencia: SparkyFitnessMobile/src/components/DevTools.tsx:653-697 (Platform.OS === 'ios'; useWatchConnectivity → isWatchSupported/isWatchPaired/isWatchReachable); solo en builds de desarrollo (SettingsScreen.tsx:421-425)

**Diferencias iOS/Android: pantallas**

- **Navegación Liquid Glass (barra de pestañas y cabeceras nativas de iOS 26)** — Solo en iOS 26+ con las APIs de expo-glass-effect disponibles. En iOS anterior a 26 siempre hay cabecera nativa clásica y barra de pestañas propia. Android nunca muestra el interruptor y siempre usa FallbackTabsLayout.
  - Evidencia: SparkyFitnessMobile/src/screens/AppSettingsScreen.tsx:54, 212-226 (fila 'Liquid Glass navigation', visible solo si canUseLiquidGlass()); src/utils/liquidGlass.ts (devuelve false si Platform.OS !== 'ios'); src/services/nativeTabBarPreference.ts (useNativeIOSTabsActive / useNativeIOSHeadersActive); src/components/TabsLayout.tsx:240-335 (NativeTabsLa…
- **Métricas de salud sincronizables solo en iOS** — Hay métricas iOS definidas pero desactivadas (enabled: false), así que no aparecen en ninguna plataforma: Estrés (173/185), Grasa, Proteína y Sodio de la dieta (733-765), y Exposición al audio ambiental y de auriculares (991-1021).
  - Evidencia: SparkyFitnessMobile/src/HealthMetrics.ts:622 (bloodAlcoholContent), 651 (menstruationFlow), 770-866 (métricas walking*/running*), 873 (runningPower), 972 (cyclingFunctionalThresholdPower), 1026-1068 (appleMoveTime/appleExerciseTime/appleStandTime), todas con platforms: ['ios']; filtro por Platform.OS en 1076-1085; las renderiza src/components/Heal…
- **Grabar caminata o carrera con el Apple Watch (selector 'Grabar con: GPS del teléfono / GPS del reloj')** — Requiere iOS con un Apple Watch emparejado y no está disponible para bicicleta. En Android no existe integración con relojes (Wear OS) y la grabación siempre usa el teléfono.
  - **Actualizado en las PR #3052 y #3090 (fusionadas):** Con un reloj Wear OS conectado, Android muestra el mismo selector 'Registrar con: GPS del teléfono / GPS del reloj' (no para bici): una caminata o carrera en el reloj empieza en la app de Wear OS, que la graba con su propio GPS y sensor de frecuencia cardíaca, o con su podómetro en interiores, mientras el teléfono abre la pantalla 'En tu reloj'. Como el Apple Watch, aplica los intervalos, la pausa automática, los avisos de voz y las alertas de ritmo y de frecuencia cardíaca configurados en el teléfono, pero ignora la ruta elegida en el selector de ruta (que también aparece para una carrera en Wear OS), y el teléfono guarda la sesión sin mapa, parciales ni vueltas.
  - Evidencia: SparkyFitnessMobile/src/screens/RecordActivityScreen.tsx:261-269 (watchAvailable = watchSupported && watchPaired && activity !== 'ride'), 666-700 (startRunOnWatch -> navigate('WatchRunLive')), 1073-1126 (SegmentedControl phone/watch), 1165-1166; src/hooks/useWatchConnectivity.ts:15 (isSupported = Platform.OS === 'ios' && módulo nativo presente); m…
- **Alertas y rangos de frecuencia cardíaca en la grabación GPS (y FC en vivo)** — La FC solo llega desde el Apple Watch, así que en Android no hay alertas ni lectura de FC. Excepción: la tarjeta 'live-hr' de la grabación en curso (RecordActivityScreen.tsx:1902-1910) solo comprueba que no esté terminada, no sea en interior ni en bicicleta, y no mira watchAvailable. En Android puede aparecer pero nunca recibirá datos.
  - **Actualizado en las PR #3052 y #3078 (fusionadas):** Con un reloj Wear OS conectado, Android muestra las tarjetas de rangos de frecuencia cardíaca, los rangos sugeridos (calculados en ambas plataformas a partir de las zonas de frecuencia cardíaca de Ajustes → Entrenamiento) y el dato de Frecuencia cardíaca en vivo, y el teléfono avisa con las lecturas que envía la app de Wear OS durante una grabación con el teléfono, igual que con un Apple Watch. Como en iOS, las tarjetas siguen ocultas en bici y sin reloj, mientras que la tarjeta de aviso que se ve durante una caminata o carrera al aire libre aparece también sin reloj y no recibe lecturas. Solo el Apple Watch, con watchOS 27, envía además sus propias zonas de frecuencia cardíaca para la actividad guardada.
  - Evidencia: SparkyFitnessMobile/src/screens/RecordActivityScreen.tsx:1199-1216 (comentario 'Heart rate comes from the Apple Watch'; se muestra solo con watchAvailable), 1316-1360 y 1393-1410 (FC de intervalos y calentamiento solo con watchAvailable), 497-508 (suggestedHeartRate solo con reloj), 1622-1630 (estadística de FC en vivo solo si heartRate != null); …
- **'Usar también en mi Apple Watch' en los ritmos de referencia de programas** — Solo depende de Platform.OS === 'ios', así que también aparece en iPhones sin reloj emparejado. En Android la tarjeta de ritmo de referencia se muestra sin este interruptor.
  - **Actualizado en la PR #3052 (fusionada):** El interruptor aparece ya también en Android, con el texto 'Also use on my Wear OS watch', y como en iOS depende solo de la plataforma, así que sale en cualquier teléfono Android en cuanto se guarda un tiempo de carrera, tenga reloj o no. La app de Wear OS solo ajusta el entrenamiento del programa a estos rangos si la alerta de ritmo de la carrera está activada, mientras que el Apple Watch lo hace salvo que la alerta de ritmo se desactive durante la carrera; el texto de Wear OS está en inglés en todos los idiomas, y el del Apple Watch está traducido en 6 de los otros 15 idiomas incluidos.
  - Evidencia: SparkyFitnessMobile/src/screens/RunProgramsScreen.tsx:325-336 y 439-449 (prop watch solo con Platform.OS === 'ios'); src/components/recording/PaceReferenceCard.tsx:39-41, 206-218 (interruptor 'Also use on my Apple Watch')
- **Lectura de etiqueta nutricional en el propio dispositivo (Apple Foundation Models)** — Solo en iOS 27+ con Foundation Models disponible (Apple Intelligence). En Android, y en iPhones sin soporte, la etiqueta siempre la lee la IA del servidor.
  - Evidencia: SparkyFitnessMobile/src/screens/FoodScanScreen.tsx:41-43, 577-617 (scanLabelOnDevice, y si falla scanNutritionLabel en el servidor; aviso foodScan.labelReadOnDevice); src/services/onDeviceLabelScan.ts:15-21; modules/on-device-nutrition/expo-module.config.json ('platforms': ['ios']); modules/on-device-nutrition/ios/OnDeviceNutritionModule.swift:13-…
- **Controles del Centro de control y la pantalla de bloqueo (Escanear comida, Registrar comida, Calorías restantes)** — Depende de los controles de iOS 18+ (ExtensionStorage del app group). Android no tiene un equivalente en el Centro de control.
  - **Actualizado en la PR #2989 (fusionada):** Las baldosas de Ajustes rápidos de Android Escanear código, Buscar comida y Calorías restantes abren el escáner, la búsqueda de comida y el diario, y en la pantalla de bloqueo piden desbloquear antes. Usan enlaces sparkyfitnessmobile:// (scan, search y diary) en lugar del traspaso por app group, que sigue siendo solo de iOS.
  - Evidencia: SparkyFitnessMobile/App.tsx:222-223 (useControlRouteHandoff); src/hooks/useQuickActions.ts:158-197 (return si Platform.OS !== 'ios' o no hay iosAppGroup; rutas scan/search/diary)
- **Integración con la app del Apple Watch y ajustes 'Apple Watch'** — Las pantallas WatchSettings y WatchRunLive están registradas en las dos plataformas, pero solo se llega a ellas en iOS con un Apple Watch emparejado. Android no tiene integración con relojes.
  - **Actualizado en las PR #3052, #3065 y #3090 (fusionadas):** En Android los mismos puentes funcionan ya cuando hay Google Play services, así que la app de Wear OS también entrega el peso y la grasa corporal, el agua, los medicamentos y el fin de los ayunos (el teléfono rechaza los ayunos que se empiezan en el reloj), inicia y edita entrenamientos, recibe los objetivos de las series, envía la frecuencia cardiaca, termina entrenamientos en la pantalla de entrenamiento completado y graba carreras que se ven en WatchRunLive. Ajustes muestra una fila 'Wear OS' en cuanto un reloj Wear OS se ha conectado al teléfono (y se recuerda desde entonces), que abre la misma pantalla WatchSettings sin las opciones de doble toque ni de teclado numérico/Digital Crown. La valoración del esfuerzo y la biblioteca de rutas guardadas son solo del Apple Watch: en Android la pantalla de la ruta sigue ofreciendo Send to watch, que falla, y Start on watch, que graba la carrera sin seguir la ruta.
  - Evidencia: SparkyFitnessMobile/App.tsx:208-213 (WatchCheckInGate), 238-261 (handleWatchFinishedWorkout), 263-303 (WatchWorkoutGate: watchSupported = WatchConnectivity?.isSupported()), 479-481, 1082-1084 (pantalla WatchSettings registrada sin condición); src/screens/SettingsScreen.tsx:53-55, 367-376 (fila visible solo con reloj emparejado); modules/watch-conn…
- **Acciones de Siri y Atajos (Registrar agua, Iniciar ayuno, Terminar ayuno, Registrar peso)** — Android no tiene integración con Google Assistant ni equivalente. Su única acción sin abrir la app es el shortcut 'Log water' del icono.
  - **Cubierto en parte por las PR #2989 y #3020 (fusionadas):** Las acciones de Android que funcionan sin abrir la app son el atajo Registrar agua del lanzador, la baldosa de Ajustes rápidos Registrar agua (también desde la pantalla de bloqueo) y los botones − y + del widget de agua. Android sigue sin integración con Google Assistant ni voz, y nada en el teléfono registra el peso ni inicia o termina un ayuno sin abrir la app.
  - Evidencia: plugins/ios/ShortcutProvider.swift:9-35 (AppShortcutsProvider: 'Log water', 'Start fast', 'End fast', 'Log weight'); targets/widget/ShortcutIntents.swift:260-408 (LogWaterIntent, RemoveWaterIntent, LogWeightIntent, StartFastIntent, EndFastIntent); plugins/withBackgroundWater.ts:3-5, 24-34.
- **Controles del Centro de control que actúan sin abrir la app (Registrar agua, Quitar agua, Iniciar ayuno, Terminar ayuno)** — Requiere iOS 18+. En Android no hay mosaicos de Ajustes rápidos (TileService).
  - **Cubierto en parte por las PR #2989 y #3020 (fusionadas):** En Android, la baldosa de Ajustes rápidos Registrar agua registra una toma sin abrir la app, también desde la pantalla de bloqueo, y deja el resultado en la lista de notificaciones si las notificaciones de la app están activadas. Los botones − y + del widget de agua de la pantalla de inicio también quitan o añaden una toma sin abrir la app, pero Quitar agua no tiene baldosa, y ninguna baldosa ni widget inicia o termina un ayuno.
  - Evidencia: targets/widget/Controls.swift:11-41 (LogWaterControl), 44-56 (StartFastControl), 59-71 (EndFastControl), 111-123 (RemoveWaterControl); targets/widget/index.swift:10-17 (registrados solo en iOS 18+); src/hooks/useWidgetSync.ts:124 (reloadControls).
- **Widget de agua en la pantalla de inicio con botones +/−** — Android tiene widgets de calorías y macros, pero no de agua.
  - **Actualizado en la PR #3020 (fusionada):** Android tiene, junto a los widgets de calorías y macros, un widget de agua con el agua de hoy frente al objetivo y botones − y + que quitan o añaden una toma sin abrir la app. Las tomas registradas con el atajo o la baldosa de Ajustes rápidos Registrar agua también se reflejan en él. Solo iOS tiene tamaño mediano y versiones para la pantalla de bloqueo.
  - Evidencia: iOS: targets/widget/waterWidget.swift:152-165 (Button(intent: RemoveWaterIntent/LogWaterIntent)), 258-260; targets/widget/index.swift:9. Android: solo existen los widgets Calories y Macros (targets/android-widget/res/values/widget_strings.xml:3-6; targets/android-widget/kotlin/.../CalorieWidget.kt.tmpl y MacroWidget.kt.tmpl), con accesos a buscar …
- **Lectura en el propio dispositivo de la etiqueta 'Supplement Facts' (medicación y suplementos)** — iOS 27+ con Apple Intelligence y el interruptor de Ajustes de IA activado. En Android siempre lee la IA del servidor.
  - Evidencia: src/hooks/useSupplementLabelScan.ts (lectura en el dispositivo primero y después scanSupplementLabelImage en el servidor); src/services/onDeviceSupplementScan.ts:177-192 (requiere onDeviceLabelScanEnabled e isOnDeviceLabelScanAvailable); src/screens/MedicationFormScreen.tsx:181, 306-338 (toast medications.supplement.labelReadOnDevice); modules/on-…
- **'Volver a leer' la etiqueta con la otra IA en el formulario de comida creada desde un escaneo** — Solo tiene sentido donde hay lectura en el dispositivo (iOS 27+). En Android la fuente siempre es el servidor y el reintento no se ofrece.
  - Evidencia: src/hooks/useRetryLabelScan.ts:44-50 (canRetry exige que la fuente sea 'device', o que sea 'server' con la lectura en el dispositivo activada y disponible), 52-95; src/components/LabelScanSourceBanner.tsx:24-35; src/screens/foodForm/CreateFoodMode.tsx:544-574.
- **Opciones de la pantalla 'Apple Watch' (gestos, entrada de series, páginas y nutrientes)** — Requiere iPhone con Apple Watch emparejado. La pantalla está registrada también en Android, pero no tiene ningún camino de navegación.
  - **Cubierto en parte por la PR #3052 (fusionada):** En Android, Ajustes muestra una fila 'Wear OS' en cuanto un reloj Wear OS se ha conectado al teléfono, y abre la misma pantalla con la petición de esfuerzo (RPE) tras cada serie, el orden y la visibilidad de las páginas y los nutrientes de la página de objetivos, que la app de Wear OS aplica. Su escala de RPE va de 5 a 10 en lugar de 1 a 10, y esa descripción está en inglés en todos los idiomas. 'Doble toque para registrar una serie' y la elección de introducción de series con teclado numérico o Digital Crown están ocultas en Android y no tienen equivalente en Wear OS.
  - Evidencia: src/screens/WatchSettingsScreen.tsx:103-243 (gesturesTitle, 'Double-tap to log a set', 'Ask for effort (RPE) after each set', setInputTitle 'Keypad'/'Digital Crown', pagesTitle y reordenar, 'Goals page nutrients'); se llega desde src/screens/SettingsScreen.tsx:368-376, solo con reloj emparejado.
- **Frecuencia cardíaca en vivo por ejercicio durante un entreno de fuerza** — La FC en vivo solo llega desde el Apple Watch. En Android solo se ven la media y la máxima de entrenos ya sincronizados, si existen.
  - **Actualizado en la PR #3052 (fusionada):** Con un reloj Wear OS conectado, las tarjetas de ejercicio de Android muestran ya la frecuencia cardíaca en vivo que la app de Wear OS lee de su sensor durante un entreno de fuerza, igual que con un Apple Watch. Sin reloj sigue sin haber frecuencia cardíaca en vivo en ninguna de las dos plataformas.
  - Evidencia: src/components/ActiveWorkoutExerciseCard.tsx:670-688 (useLiveHeartRate durante el entreno activo; 'it only ever arrives from a paired watch'); src/stores/liveHeartRateStore.ts, que solo alimenta src/hooks/useWatchWorkoutBridge.ts.

**Diferencias iOS/Android: servicios y hooks**

- **Controles de Centro de control / pantalla de bloqueo** — Depende de WidgetKit/ControlWidget y del App Group de iOS; no existe equivalente en Android (no hay Quick Settings tiles).
  - **Cubierto en parte por las PR #2989 y #3020 (fusionadas):** Android tiene baldosas de Ajustes rápidos para Calorías restantes, Registrar agua, Escanear código y Buscar comida, que se vuelven a dibujar cada vez que se abre el panel (Calorías restantes lee la instantánea del widget de calorías). Las tres que abren la app usan enlaces sparkyfitnessmobile:// en lugar del traspaso por App Group. Quitar agua, Iniciar ayuno y Terminar ayuno no tienen baldosa, y la baldosa Registrar agua no muestra el total del día. Ese total está en el widget de agua, que también recoge las tomas registradas desde la baldosa y tiene un botón − para quitar una.
  - Evidencia: useQuickActions.ts:156-190 (useControlRouteHandoff lee 'pendingControlRoute' del App Group: scan/search/diary; return si Platform.OS !== 'ios' en :170); useWidgetSync.ts:24-27 y :124 recarga los controles caloriesLeft/logWater vía BackgroundWaterModule.reloadControls; targets/widget/Controls.swift:11-146 (LogWaterControl, StartFastControl, EndFast…
- **Widget de agua** — No existe widget de agua en Android; allí el equivalente es el shortcut 'Log water' del launcher.
  - **Actualizado en las PR #2989 y #3020 (fusionadas):** Android tiene ya su propio widget de agua con botones − y +, alimentado desde el Panel mediante useWidgetSync igual que el de iOS; en Android, además, la sincronización en segundo plano lo actualiza, un cambio de cuenta lo vacía y una bebida registrada desde el atajo Registrar agua o la baldosa de Ajustes rápidos (la misma petición nativa que usan los botones del widget) actualiza su total. El widget de Android tiene un único tamaño fijo de 2×2, mientras que iOS ofrece también un tamaño mediano y versiones para la pantalla de bloqueo. En ambas plataformas sus textos están traducidos al español, polaco, portugués de Brasil, cantonés y chino simplificado y tradicional, pero no a los otros nueve idiomas incluidos.
  - Evidencia: useWidgetSync.ts:29-37 (WaterWidgetInfo) y :105-116,122 escriben 'waterSnapshot' (consumedMl, goalMl, drinkMl, unit, canLog) y recargan 'waterWidget'; targets/widget/waterWidget.swift. Android: androidWidgetSyncService.ts:34-62 solo construye snapshots de calorías y macros; targets/android-widget solo contiene CalorieWidget y MacroWidget.
- **Navegación Liquid Glass (barra de pestañas y cabeceras de iOS 26)** — Solo iOS 26+ con APIs expo-glass-effect disponibles; en iOS < 26 se usan cabeceras nativas clásicas sin toggle; en Android nunca aparece.
  - Evidencia: utils/liquidGlass.ts:9-18 (false si no es iOS o no hay API de glass); services/nativeTabBarPreference.ts:11-14 (useNativeIOSTabsActive) y :23-27 (useNativeIOSHeadersActive, false en Android); toggle en screens/AppSettingsScreen.tsx:212-227 (solo si canUseLiquidGlass()).
- **Alerta de fin de descanso 'Time Sensitive'** — Propiedad exclusiva de iOS. En Android la prioridad se obtiene con el canal HIGH 'Workout timer' y la alarma exacta, no con interruption level.
  - Evidencia: services/notifications.ts:410-414 (interruptionLevel: 'timeSensitive'); app.config.ts:210-212 entitlement com.apple.developer.usernotifications.time-sensitive.
- **Estado del enlace con Apple Watch** — WatchConnectivity solo existe en iOS; la app de reloj (targets/watch) y sus puentes (useWatch*Bridge en App.tsx:23) son exclusivos de iOS.
  - **Actualizado en la PR #3052 (fusionada):** La sección del enlace con el reloj de las herramientas de desarrollo aparece ahora también en Android, con el título 'Wear OS', y sigue estando solo en las compilaciones de desarrollo. Allí el reloj figura como emparejado en cuanto se ha conectado cualquier reloj Wear OS, y ya no deja de estarlo. Figura como accesible siempre que haya un reloj Wear OS conectado, esté abierta o no la app del reloj, aunque la fila sigue diciendo 'La app del reloj no está en primer plano' cuando no hay ninguno conectado.
  - Evidencia: hooks/useWatchConnectivity.ts:15 (isSupported = Platform.OS === 'ios' && módulo nativo) y :54-59; components/DevTools.tsx:113-117 y :653-700 (sección 'Apple Watch' solo iOS); DevTools solo se monta en builds de desarrollo (screens/SettingsScreen.tsx:422-426).
- **Sincronización inmediata al llegar datos nuevos de salud** — Android no tiene observadores: solo la tarea periódica y la sincronización al abrir la app.
  - Evidencia: hooks/useAppStartup.ts:131-162 (solo iOS: startObservers -> performBackgroundSync('healthkit-observer')) y :181-183 (stopObservers); services/healthkit/backgroundDelivery.ts:136-170 (enableBackgroundDeliveryForMetric), :366-397; HealthMetrics.ts backgroundDeliveryFrequency (hourly: steps, calories, totalCalories, heartRate, distance, exerciseSessi…
- **Métrica: Alcohol en sangre** — Health Connect no tiene este tipo.
  - Evidencia: HealthMetrics.ts:622 (platforms ['ios']); services/healthkit/index.ts:269 (HKQuantityTypeIdentifierBloodAlcoholContent).
- **Métrica: Flujo menstrual** — Android usa en su lugar 'Menstruation Period'.
  - Evidencia: HealthMetrics.ts:651 (platforms ['ios']); services/healthkit/index.ts:267 (HKCategoryTypeIdentifierMenstrualFlow).
- **Métrica: Velocidad al caminar (Movilidad)** — La categoría 'Mobility' solo existe en iOS.
  - Evidencia: HealthMetrics.ts:770 (platforms ['ios'], categoría Mobility, backgroundDelivery 'none'); services/healthkit/index.ts:278.
- **Métrica: Longitud del paso al caminar** — Sin equivalente en Health Connect.
  - Evidencia: HealthMetrics.ts:786 (platforms ['ios']); services/healthkit/index.ts:279.
- **Métrica: Asimetría al caminar (%)** — Sin equivalente en Health Connect.
  - Evidencia: HealthMetrics.ts:802 (platforms ['ios']); services/healthkit/index.ts:280-281.
- **Métrica: Doble apoyo al caminar (%)** — Sin equivalente en Health Connect.
  - Evidencia: HealthMetrics.ts:820 (platforms ['ios']); services/healthkit/index.ts:282-283.
- **Métrica: Tiempo de contacto con el suelo al correr** — Categoría 'Running' solo en iOS.
  - Evidencia: HealthMetrics.ts:839 (platforms ['ios'], categoría Running); services/healthkit/index.ts:284.
- **Métrica: Longitud de zancada al correr** — Sin equivalente en Health Connect.
  - Evidencia: HealthMetrics.ts:857 (platforms ['ios']); services/healthkit/index.ts:285.
- **Métrica: Potencia de carrera** — Android solo tiene 'Power' genérica.
  - Evidencia: HealthMetrics.ts:873 (platforms ['ios']); services/healthkit/index.ts:286.
- **Métrica: Oscilación vertical al correr** — Sin equivalente en Health Connect.
  - Evidencia: HealthMetrics.ts:889 (platforms ['ios']); services/healthkit/index.ts:287-288.
- **Métrica: Velocidad de carrera** — Android solo tiene 'Speed' genérica.
  - Evidencia: HealthMetrics.ts:907 (platforms ['ios']); services/healthkit/index.ts:289.
- **Métrica: Velocidad en bicicleta** — Categoría 'Cycling' solo en iOS; Android usa 'Speed' genérica.
  - Evidencia: HealthMetrics.ts:924 (platforms ['ios'], categoría Cycling); services/healthkit/index.ts:290.
- **Métrica: Potencia en bicicleta** — Android usa 'Power' genérica.
  - Evidencia: HealthMetrics.ts:940 (platforms ['ios']); services/healthkit/index.ts:291.
- **Métrica: Potencia funcional umbral (FTP) en bicicleta** — Sin equivalente en Health Connect.
  - Evidencia: HealthMetrics.ts:972 (platforms ['ios'], aggregationStrategy 'last'); services/healthkit/index.ts:292-293.
- **Métrica: Tiempo de movimiento de Apple** — Categoría 'Apple' (anillos) solo en iOS.
  - Evidencia: HealthMetrics.ts:1026 (platforms ['ios'], categoría Apple); services/healthkit/index.ts:297.
- **Métrica: Tiempo de ejercicio de Apple** — Sin equivalente en Health Connect.
  - Evidencia: HealthMetrics.ts:1042 (platforms ['ios']); services/healthkit/index.ts:298.
- **Métrica: Tiempo de pie de Apple** — Sin equivalente en Health Connect.
  - Evidencia: HealthMetrics.ts:1058 (platforms ['ios']); services/healthkit/index.ts:299.
- **Acciones de Siri, app Atajos y botón de Acción (App Intents)** — En Android lo único equivalente es el shortcut de launcher 'Log water' (BackgroundWaterModule.kt:21-43). No hay atajos para peso ni ayuno, ni integración con Google Assistant.
  - **Cubierto en parte por las PR #2989, #3020 y #3051 (fusionadas):** En Android, el atajo Registrar agua del lanzador, la baldosa de Ajustes rápidos Registrar agua y los botones − y + del widget de agua envían la misma petición de agua en segundo plano (postWaterChange en LogWaterActivity.kt). La etiqueta corta del atajo está traducida en 10 de los otros 15 idiomas que trae la app, y su etiqueta larga, el nombre de la baldosa y los textos del widget de agua, en 6 (es, pl, pt-BR, yue-Hant, zh-Hans, zh-Hant); los Toast y las notificaciones de resultado, y su canal 'Quick logging', siguen solo en inglés. Android sigue sin integración con Google Assistant y sin atajos de peso o ayuno que funcionen sin abrir la app.
  - Evidencia: plugins/ios/ShortcutProvider.swift:9-40 (AppShortcutsProvider con las frases 'Log water in…', 'Start a fast in…', 'End my fast in…' y 'Log my weight in…'). targets/widget/ShortcutIntents.swift:260-489 (LogWaterIntent, RemoveWaterIntent, LogWeightIntent, StartFastIntent y EndFastIntent, con openAppWhenRun=false y POST directo al servidor). plugins/…
- **Lectura de etiquetas nutricionales y de suplementos en el dispositivo (Apple Intelligence)** — Requiere iOS 27+ con Apple Intelligence activado. En Android el módulo es null (modules/on-device-nutrition/index.ts) y AiSettings solo muestra el texto 'No disponible en este dispositivo'.
  - Evidencia: screens/AiSettingsScreen.tsx:117-150 (sección 'On-device (Apple Intelligence)' con ToggleCard; si no hay modelo, muestra 'Not available on this device… iOS 27 or later'). Se llega por SettingsScreen.tsx:304 hacia AiSettings (App.tsx:1233). services/onDeviceLabelScan.ts:15-21, hooks/useRetryLabelScan.ts:29-70, hooks/useSupplementLabelScan.ts:16-23,…
- **App de Apple Watch y sincronización con el reloj** — No existe app de Wear OS: no hay ningún target ni plugin de Wear en targets/ ni en plugins/. En Android no aparecen la fila de ajustes del reloj ni la opción de grabar con el reloj.
  - **Cubierto en parte por las PR #3052, #3065 y #3090 (fusionadas):** Android tiene ahora una app de Wear OS con las mismas páginas que la del Apple Watch (objetivos, agua, medicación, peso, tendencia, entrenamiento, Now Playing, ayuno y pasos). Registra y edita series de fuerza, graba en el reloj carreras y caminatas con intervalos, avisos, pausa automática e indicaciones por voz, y muestra y controla la grabación GPS del móvil. Sigue el orden de páginas, las páginas ocultas y los nutrientes de la página de objetivos elegidos en el móvil, que muestra una fila de ajustes 'Wear OS' y la opción de grabar con el reloj en Registrar actividad en cuanto se ha conectado un reloj Wear OS. A diferencia de la app del Apple Watch, no tiene doble toque ni ajuste para elegir entre teclado y corona (funcionan tanto la entrada giratoria como el teclado), y el RPE por serie solo va de 5 a 10. Tampoco pide valorar el esfuerzo al terminar, no guarda nada en una app de salud, calcula las calorías a partir del pulso y no respeta los interruptores de vibración ni de aviso de fin de descanso del móvil. No puede seguir rutas guardadas, aunque el móvil sigue ofreciendo una al grabar al aire libre con el reloj. Como en el Apple Watch, los textos de la app del reloj solo están en inglés.
  - Evidencia: targets/watch/Presentation/*.swift (WorkoutView, WatchRunView, RecordingView, FastingView, WaterLogView, CheckInEntryView, MedicationsView, StepsView, TrendView…). Puentes useWatchWorkoutBridge, useWatchRunBridge, useWatchRecordingBridge, useWatchFastingBridge, useWatchCheckInBridge, useWatchPlanSync y useWatchSetTargetsSync importados en App.tsx:…
- **Complicaciones de Apple Watch** — Requiere Apple Watch. Android no tiene equivalente (ni Wear OS Tiles ni complicaciones).
  - **Actualizado en la PR #3052 (fusionada):** Wear OS tiene ahora siete complicaciones con las mismas cifras: calorías, proteínas, carbohidratos, grasas, agua, ayuno y pasos. Cada una se ofrece como valor en rango o como texto corto, y al tocarla abre su página (la de calorías y las de macros abren la página de objetivos, como en el Apple Watch). La de calorías solo muestra las calorías, sin el anillo exterior de macros que tiene la del Apple Watch. No hay versiones rectangulares ni en línea, que sí tienen las complicaciones de macros, ayuno y pasos del Apple Watch, ni baldosas (Tiles) de Wear OS. Como en el Apple Watch, sus nombres y textos solo están en inglés.
  - Evidencia: targets/watch-widget/EnergyGoalComplication.swift:277-288, FastingComplication.swift:151-162, MacroComplications.swift:216-261 (Protein/Carbs/Fat Goal), StepsComplication.swift:115-126 y WaterGoalComplication.swift:211-220. El paquete se define en targets/watch-widget/index.swift.

**Diario de comidas y registro diario**

- **Escaneo de etiqueta en el dispositivo (Apple Intelligence)** — Requiere iOS 27+ con Apple Intelligence y la preferencia 'Scan Labels On Device'; en Android siempre se usa la IA del servidor.
  - Evidencia: modules/on-device-nutrition/expo-module.config.json (platforms: ios); services/onDeviceLabelScan.ts:15-21; FoodScanScreen.tsx:582-616 ('Label read on this iPhone'); screens/AiSettingsScreen.tsx:61-140; components/LabelScanSourceBanner.tsx
- **Historial de bebidas del día (editar hora / borrar)** — Sólo vía Apple Watch (lectura y borrado, sin editar hora); en Android no existe.
  - **Cubierto en parte por la PR #3052 (fusionada):** Wear OS tiene ya también la lista de bebidas: el botón Log de la página de agua muestra las bebidas de hoy con su hora, y al tocar una se quita tras pedir confirmación, como en el Apple Watch, aunque Wear OS las ordena de la más antigua a la más reciente. Wear OS tiene además un botón Undo Last que quita una bebida sin preguntar: la primera del día y no la última una vez sincronizadas las tomas, porque el teléfono envía las bebidas de la más reciente a la más antigua. La app del teléfono sigue sin lista de bebidas en ambas plataformas, y ninguno de los dos relojes permite cambiar la hora de una bebida como hace la web.
  - Evidencia: El teléfono no tiene esta lista; sólo el Apple Watch permite borrar (targets/watch/Presentation/WaterLogView.swift:4-36; hooks/useWatchCheckInBridge.ts:1140-1158)
- **Nutrición y agua del diario en Apple Watch** — No hay equivalente Wear OS.
  - **Actualizado en la PR #3052 (fusionada):** La app de Wear OS tiene ya las mismas dos páginas. Su página de objetivos muestra un anillo de calorías con lo consumido frente al objetivo, las kcal restantes y los nutrientes elegidos en el teléfono en Ajustes > Wear OS, pero no las calorías quemadas, que el Apple Watch muestra junto al anillo. Su página de agua tiene un botón por recipiente, el progreso frente al objetivo, el agua de los alimentos y un botón Log con las bebidas del día, además de un botón Undo Last que quita una bebida sin preguntar (la primera del día y no la última una vez sincronizadas las tomas, porque el teléfono envía las bebidas de la más reciente a la más antigua).
  - Evidencia: targets/watch/Presentation/GoalSummaryView.swift, WaterIntakeView.swift; hooks/useWatchCheckInBridge.ts; utils/watchNutrients.ts

**Ejercicios, entrenamientos y running**

- **Alerta de frecuencia cardiaca durante la grabación** — Requiere Apple Watch emparejado (modules/watch-connectivity solo declara plataforma ios en expo-module.config.json); en Android no se muestra.
  - **Actualizado en la PR #3052 (fusionada):** Android ofrece ya también la alerta de frecuencia cardiaca en cuanto se ha conectado un reloj Wear OS: durante una grabación con el teléfono, la app de Wear OS envía su frecuencia cardiaca al teléfono, que vibra (y avisa por voz si las indicaciones de voz están activadas) cuando se mantiene fuera del rango, y una carrera grabada en el reloj Wear OS avisa en el propio reloj, como hace el Apple Watch. Sigue necesitando un reloj en las dos plataformas y no se ofrece para la bici; la web sigue sin tenerla.
  - Evidencia: src/screens/RecordActivityScreen.tsx:1199-1215 (solo si watchAvailable: 'Heart rate comes from the Apple Watch'); HeartRateBandCard.tsx:83-105
- **Grabar con el GPS del Apple Watch y seguirlo en el teléfono** — Depende de WatchConnectivity (solo iOS); no hay soporte Wear OS.
  - **Cubierto en parte por las PR #3052, #3065, #3069, #3090 y #3127 (fusionadas):** Android ofrece ya la misma elección del dispositivo con el que grabar en cuanto se ha conectado un reloj Wear OS: una caminata o una carrera, al aire libre o en cinta, se graba en la app de Wear OS con sus propios sensores y se sigue en directo en el teléfono, con pausa, finalización, pausa automática y alertas de ritmo y de frecuencia cardiaca. Después, el teléfono la guarda sin mapa, parciales ni vueltas, porque descarta los puntos GPS y las marcas de vuelta que envía la app de Wear OS. A diferencia del Apple Watch, la app de Wear OS tampoco puede seguir una ruta guardada (el teléfono sigue ofreciéndola, pero el reloj la ignora), no tiene comba en interior, no pide valorar el esfuerzo al terminar y no envía el número de pasos para la cadencia y la zancada.
  - Evidencia: src/screens/RecordActivityScreen.tsx:261-269, 1073-1127 ('Record with' Phone GPS / Watch GPS); src/screens/WatchRunLiveScreen.tsx:64-201; App.tsx:611
- **Estado de la grabación en pantalla de bloqueo** — iOS: Live Activity con botones Pausar/Reanudar y Vuelta. Android: sin Live Activity; solo la notificación de servicio en primer plano con título y texto (gpsRecordingService.ts:1111-1135), sin controles.
  - Evidencia: src/services/runLiveActivity.ios.ts (+ RunLiveActivityLayout.tsx:50-117, botones run-toggle y run-lap 56-57); src/services/runLiveActivity.ts:1-13 (Android: funciones vacías)
- **Entreno de fuerza en el Apple Watch** — Solo Apple Watch (target watchOS y módulo watch-connectivity solo iOS).
  - **Actualizado en las PR #3052 y #3065 (fusionadas):** Wear OS admite ahora también entrenos de fuerza: sigue un entreno empezado en el móvil o empieza una plantilla o el entreno programado para hoy, registra cada serie con la corona giratoria, +/− o un teclado, lleva un temporizador de descanso con +15 s y Skip, pide un RPE opcional, añade, borra o cambia el tipo de las series, añade, borra o salta ejercicios, termina o descarta el entreno y pregunta si actualizar la plantilla, muestra avisos de nuevo récord y envía la frecuencia cardiaca en directo al móvil. Siguen siendo solo del Apple Watch el doble toque para registrar una serie, la escala de RPE completa de 1 a 10 (Wear OS ofrece de 5 a 10), el volumen, la frecuencia cardiaca máxima y la valoración del esfuerzo en el resumen, y guardar el entreno en una app de salud.
  - Evidencia: targets/watch/Presentation/WorkoutView.swift:234-1982; src/hooks/useWatchWorkoutBridge.ts, useWatchWorkoutStart.ts:27-35, useWatchWorkoutEdit.ts:29-31, useWatchPlanSync.ts:32-35, useWatchSetTargetsSync.ts:115; FC en vivo en ActiveWorkoutExerciseCard.tsx:1484-1500 (stores/liveHeartRateStore.ts)
- **Carrera/caminata autónoma en el Apple Watch** — Solo Apple Watch.
  - **Cubierto en parte por las PR #3052, #3065, #3069, #3090 y #3127 (fusionadas):** Wear OS graba ahora también carreras y caminatas por su cuenta: al aire libre con el GPS del reloj o en interior, libres o siguiendo el entreno del programa o un plan de intervalos, con avisos de ritmo y de frecuencia cardiaca, pausa automática, avisos por voz, vueltas y corrección de la distancia en cinta; el móvil también puede iniciarlas en el reloj, las sigue en directo y las guarda en el diario, pero sin mapa, parciales ni vueltas, porque descarta los puntos GPS y las marcas de vuelta que envía la app de Wear OS. Siguen siendo solo del Apple Watch seguir una ruta guardada (en Android el móvil sigue ofreciéndola, pero la sesión de Wear OS la ignora y enviarla al reloj con Send to watch da error), la comba (Jump Rope), ajustar los rangos de los avisos en el reloj (Wear OS usa los últimos fijados en el móvil o unos por defecto), terminar los tramos de distancia al cubrirla (Wear OS usa su tiempo previsto), valorar el esfuerzo al acabar, el recuento de pasos del que salen la cadencia y la zancada, y guardar el entreno en una app de salud.
  - Evidencia: targets/watch/Presentation/WorkoutView.swift:2118-2333 ('Follow a plan', 'Alerts'); WatchRunView.swift:29-201; src/hooks/useWatchRunBridge.ts:29-33; services/watchRunQueue.ts
- **Ajustes del Apple Watch para entrenos** — Solo se muestra en iOS con Apple Watch emparejado.
  - **Actualizado en la PR #3052 (fusionada):** Android muestra ahora una fila Wear OS en Ajustes en cuanto un reloj Wear OS se ha conectado al móvil; abre la misma pantalla, titulada Wear OS, con los ajustes que aplica la app de Wear OS: pedir el esfuerzo (RPE) tras cada serie, redactado para su escala de 5 a 10, el orden y la visibilidad de las páginas y los nutrientes de la página de objetivos. El doble toque para registrar una serie y la elección entre teclado o Digital Crown siguen siendo solo de iOS, porque Wear OS no tiene doble toque y ofrece siempre un teclado y la corona giratoria. El texto de ayuda del RPE para Wear OS está en inglés en todos los idiomas.
  - Evidencia: src/screens/WatchSettingsScreen.tsx:124-243; visible solo con reloj emparejado (SettingsScreen.tsx:53-55, 368-376)

**Check-in, medidas corporales y bienestar**

- **Acceso rápido 'Fasting' en el icono de la app** — Solo se registra en iOS; en Android no hay accesos directos de app.
  - **Actualizado en la PR #2989 (fusionada):** Android también muestra ya Ayuno al mantener pulsado el icono de la app (expo-quick-actions, con su propio icono adaptativo), y abre el detalle de ayuno igual que en iOS. El título sale de la misma cadena quickActions en las dos plataformas.
  - Evidencia: src/hooks/useQuickActions.ts:44-46,119-121, 142 (Platform.OS !== 'ios' → return)
- **Controles de Centro de Control y atajos de Siri para iniciar y terminar ayuno** — Extensión de widget de iOS; no hay equivalente en Android (targets/android-widget solo tiene el widget de calorías).
  - Evidencia: targets/widget/Controls.swift:44-68 (StartFastControl, EndFastControl); targets/widget/ShortcutIntents.swift:370-410 (StartFastIntent, EndFastIntent)
- **Atajo de Siri 'Log weight'** — Solo iOS (App Intents).
  - Evidencia: targets/widget/ShortcutIntents.swift:338-366 (LogWeightIntent, openAppWhenRun=false)
- **Check-in de peso y % de grasa en Apple Watch** — App de watchOS; en Android no hay app para Wear OS (modules/watch-connectivity solo tiene ios/).
  - **Actualizado en la PR #3052 (fusionada):** La app de Wear OS ya lo tiene: una página Weight Check-In (corona giratoria, +/− o teclado numérico) con un paso opcional de % de grasa, el cambio desde el último registro con un aviso si el peso parece improbable y un botón Set Start para fijar un peso inicial mientras no hay historial. Su página Trend muestra los últimos 14 pesos con una media móvil de 7 registros, o la grasa corporal cuando hay dos lecturas, y se alterna con un toque o con la corona. A diferencia del Apple Watch, al guardar se queda en la página de registro en lugar de pasar a la tendencia, un cambio improbable de grasa corporal no genera aviso y no se abre por sí sola una primera entrada guiada.
  - Evidencia: targets/watch/Presentation/CheckInEntryView.swift:1-60; TrendView.swift:5-25; App.tsx:202-211 (WatchCheckInGate → useWatchCheckInBridge → upsertCheckIn, src/hooks/useWatchCheckInBridge.ts:16,686-687)
- **Ayuno en Apple Watch y complicación de ayuno** — Solo watchOS.
  - **Cubierto en parte por la PR #3052 (fusionada):** La app de Wear OS tiene ya una página de ayuno (tiempo transcurrido y un anillo con la parte del objetivo cumplida, pero sin tiempo restante), botones para empezar 16:8, 18:6, 20:4 y OMAD, End Fast sin confirmación y una complicación de ayuno con las horas transcurridas. Empezar un ayuno desde Wear OS falla: el reloj envía la etiqueta ('16:8', 'OMAD') como id del preset, pero el móvil busca los presets por id ('16-8', '18-6', '20-4') y no tiene OMAD, así que rechaza la petición y no se guarda ningún ayuno (el reloj solo lo muestra hasta la siguiente actualización del móvil). Terminar un ayuno desde el reloj sí funciona.
  - Evidencia: targets/watch/Presentation/FastingView.swift:18-116; targets/watch-widget/FastingComplication.swift; src/hooks/useWatchFastingBridge.ts:22-40
- **Pasos en Apple Watch y complicación de pasos** — Solo watchOS.
  - **Actualizado en la PR #3052 (fusionada):** La app de Wear OS tiene ya una página Daily Steps con los pasos de hoy frente al objetivo en un anillo y los que faltan, además de una complicación de pasos. A diferencia del Apple Watch, que solo muestra la cifra que envió el móvil por última vez, Wear OS también sube la cifra con el sensor de pasos del propio reloj cuando este cuenta más.
  - Evidencia: targets/watch/Presentation/StepsView.swift:3-20; targets/watch-widget/StepsComplication.swift
- **Ajustes del Apple Watch: reordenar y ocultar páginas (Check-in, Tendencia, Ayuno, Pasos…)** — Solo aparece con un Apple Watch emparejado; en Android no hay app de reloj (modules/watch-connectivity solo tiene ios/).
  - **Actualizado en la PR #3052 (fusionada):** Android muestra ya una fila Wear OS en Ajustes en cuanto se ha conectado un reloj Wear OS, y abre la misma pantalla: orden y visibilidad de las páginas (la app de Wear OS los respeta y mantiene la página de entrenamiento mientras se entrena), los nutrientes de la página de objetivos y el interruptor de RPE. El interruptor de doble toque para registrar una serie y la elección entre teclado numérico y Digital Crown para las series solo están en iOS, y la descripción del RPE para Wear OS (una escala de 5 a 10 en lugar de 1 a 10) solo está en inglés en todos los idiomas incluidos.
  - Evidencia: src/screens/SettingsScreen.tsx:368-377 (fila 'Apple Watch' solo si hasPairedWatch); src/screens/WatchSettingsScreen.tsx:190-215 ('Pages', ReorderSwitchList 'Drag a page by its handle… Toggle a page off to hide it'); targets/watch/Presentation/ContentView.swift:28-62 (pages 'as the phone last arranged them') y 183-185 (shown() descarta páginas ocul…

**Objetivos y onboarding**

- **Apple Watch: página de Objetivos y complicaciones** — Solo iOS con Apple Watch emparejado; no hay equivalente en Wear OS.
  - **Actualizado en la PR #3052 (fusionada):** Wear OS tiene ya también una página de Objetivos, con el anillo de calorías y los nutrientes elegidos en Ajustes > Wear OS, y las mismas siete complicaciones que el Apple Watch (calorías, proteínas, carbohidratos, grasas, agua, ayuno y pasos), que abren su página al tocarlas. Sigue habiendo diferencias: la página de Wear OS muestra las calorías comidas frente al objetivo y las kcal restantes, pero no las quemadas; su complicación de calorías no tiene los anillos de macros, y sus complicaciones solo se ofrecen como valor con rango y texto corto, mientras que en el Apple Watch las de macros, pasos y ayuno tienen también formatos de esquina, rectangular y en línea. En los dos relojes los textos están solo en inglés, salvo los nombres de nutrientes que envía el teléfono.
  - Evidencia: SparkyFitnessMobile/targets/watch/Presentation/GoalSummaryView.swift; targets/watch-widget/EnergyGoalComplication.swift, WaterGoalComplication.swift, MacroComplications.swift, StepsComplication.swift; src/hooks/useWatchCheckInBridge.ts (goalNutrients, stepGoal); Ajustes > Apple Watch (WatchSettingsScreen)

**Informes y analíticas**

- **Tendencia de peso y % de grasa en el Apple Watch** — Target watchOS creado con @bacons/apple-targets; no hay equivalente para Wear OS (targets/ solo tiene widgets y notificaciones Android).
  - **Actualizado en la PR #3052 (fusionada):** Wear OS ya tiene también una página de tendencia de peso: los últimos 14 registros de peso con una media móvil de 7 puntos, que pasa a una línea de % de grasa corporal con un toque o con la corona giratoria cuando hay dos lecturas de grasa, y se puede reordenar u ocultar en Ajustes → Wear OS. A diferencia del Apple Watch, guardar un registro de peso en Wear OS no abre la página de tendencia: hay que deslizar hasta ella.
  - Evidencia: TrendView con métricas weight y bodyFat y rollingMean (SparkyFitnessMobile/targets/watch/Presentation/TrendView.swift:13-40), página .trend (ContentView.swift:168-169), activable en Ajustes → Apple Watch ('Weight trend', src/constants/watchPages.ts:15,40-41; SettingsScreen.tsx:368-377, visible solo con reloj emparejado).

**Medicación, GLP-1 y síntomas**

- **Página 'Medications' en Apple Watch** — Solo iOS con Apple Watch emparejado; no hay equivalente Wear OS (watch-connectivity devuelve null en Android, modules/watch-connectivity/index.ts:1032).
  - **Actualizado en la PR #3052 (fusionada):** Wear OS tiene ahora una página Medications: las dosis programadas y a demanda del día con un recuento de tomadas, donde un toque marca una dosis como tomada o no tomada (se envía al teléfono al momento o queda en cola hasta que esté disponible), y sigue el orden y las páginas ocultas que se fijan en el teléfono. A diferencia de la página del Apple Watch, no muestra el estado de sincronización ni permite reintentar, muestra una dosis omitida igual que una pendiente y, antes de la primera sincronización, dice que no hay nada programado en lugar de pedir que se abra la app del teléfono. En ambos relojes, omitir dosis y registrar más de una vez una dosis a demanda se sigue haciendo en el teléfono.
  - Evidencia: targets/watch/Presentation/MedicationsView.swift:12; página registrada en src/constants/watchPages.ts:13,36; datos y taps en src/hooks/useWatchCheckInBridge.ts:529 (medicationsForWatch) y 1319 (handleMedicationTaken); orden/visibilidad en WatchSettingsScreen.

**Chat con IA (SparkyChat) y ajustes de IA**

- **Interruptor «Scan Labels On Device» (Apple Intelligence)** — El módulo nativo solo existe en iOS (modules/on-device-nutrition/expo-module.config.json platforms:['ios']; index.ts:52-58 devuelve null fuera de iOS). En Android la pantalla AI solo muestra el texto «Not available on this device».
  - Evidencia: SparkyFitnessMobile/src/screens/AiSettingsScreen.tsx:61-67, 118-151; src/stores/appPreferencesStore.ts:94, 414 (onDeviceLabelScanEnabled)
- **Lectura de etiquetas nutricionales en el dispositivo** — Solo iOS 27+ con Apple Intelligence activo; en Android siempre se usa el servidor.
  - Evidencia: SparkyFitnessMobile/modules/on-device-nutrition/index.ts:44-50 (isAvailable, scanLabel); modules/on-device-nutrition/ios/OnDeviceNutritionModule.swift; src/services/onDeviceLabelScan.ts:15-70; src/screens/FoodScanScreen.tsx:576-620

**Ajustes, perfil, familia e integraciones**

- **Navegación Liquid Glass** — canUseLiquidGlass() devuelve false si Platform.OS !== 'ios' o la API de cristal no está disponible.
  - Evidencia: src/screens/AppSettingsScreen.tsx:212-228; src/utils/liquidGlass.ts:9-17
- **Ajustes del Apple Watch** — WatchConnectivity solo tiene implementación iOS (modules/watch-connectivity/ios, index.ts:1032).
  - **Cubierto en parte por la PR #3052 (fusionada):** En Android aparece una fila Wear OS en Ajustes en cuanto un reloj Wear OS se ha conectado al teléfono, y abre la misma pantalla: la petición de esfuerzo (RPE) tras cada serie (de 5 a 10 en Wear OS, de 1 a 10 en el Apple Watch), el orden y la visibilidad de las páginas del reloj y los nutrientes de la página Objetivos, y la app de Wear OS los aplica todos. El doble toque para registrar una serie y la elección entre teclado numérico y Digital Crown son solo del Apple Watch: Wear OS ajusta el valor seleccionado con la corona giratoria y abre un teclado numérico al volver a tocarlo. La descripción de la petición de esfuerzo para Wear OS solo está en inglés.
  - Evidencia: src/screens/SettingsScreen.tsx:52-55,368-377 (solo si hay reloj emparejado) → WatchSettingsScreen.tsx:103-240; modules/watch-connectivity (solo ios/)

**Capacidades nativas del móvil**

- **Métricas exclusivas de Apple Health** — Estrés (MindfulSession), grasa, proteína y sodio dietéticos y exposición al audio ambiental y de auriculares están definidos con enabled:false (HealthMetrics.ts:185, 733, 749, 765, 1005, 1021), así que no se ven.
  - Evidencia: HealthMetrics.ts:622-1072 (platforms: ['ios']); healthkit/index.ts:266-290 (identificadores HK)
- **Widget de agua interactivo** — Android no tiene widget de agua: targets/android-widget solo trae Calorie y Macro.
  - **Actualizado en la PR #3020 (fusionada):** Android también tiene ya un widget de agua interactivo: un widget de 2x2 para la pantalla de inicio con el agua de hoy frente al objetivo, una barra y botones − y + que quitan o añaden una bebida del recipiente elegido en el Panel sin abrir la app. Tiene un único tamaño fijo y no tiene versiones de pantalla de bloqueo, mientras que iOS ofrece tamaños pequeño y mediano y tres formatos de pantalla de bloqueo.
  - Evidencia: targets/widget/waterWidget.swift:152-165 (Button(intent: RemoveWaterIntent/LogWaterIntent)), 250-264; targets/widget/index.swift:10
- **Widgets de pantalla de bloqueo** — Los widgets de Android declaran widgetCategory="home_screen".
  - Evidencia: widgets.swift:319-322; macroWidget.swift:423-426; waterWidget.swift:260-263
- **Controles de Centro de Control y pantalla de bloqueo** — Requiere iOS 18 o posterior.
  - **Cubierto en parte por las PR #2989 y #3020 (fusionadas):** Android tiene cuatro baldosas de Ajustes rápidos equivalentes: Registrar agua (registra una toma en segundo plano, también desde la pantalla de bloqueo), Escanear código, Buscar comida y Calorías restantes (kcal restantes de hoy; abre el diario). Quitar agua, Iniciar ayuno y Terminar ayuno no tienen baldosa; en el móvil, la única forma de quitar una toma sin abrir la app es el botón − del widget de agua de la pantalla de inicio. La baldosa Registrar agua no muestra el total del día como el control de iOS; en Android ese total aparece en el widget de agua.
  - Evidencia: targets/widget/index.swift:9-18 (if #available(iOS 18.0)); targets/widget/Controls.swift:11-146; ShortcutIntents.swift:455-497; hooks/useQuickActions.ts:162-170 (useControlRouteHandoff)
- **Acciones de Siri y Atajos (App Intents)** — Requiere iOS 16 o posterior. Las frases de Siri solo están en inglés (ShortcutProvider.swift:13-34).
  - Evidencia: plugins/ios/ShortcutProvider.swift:9-38; targets/widget/ShortcutIntents.swift:260-420; plugins/withBackgroundWater.ts:1-35; modules/background-water/ios/BackgroundWaterModule.swift; services/backgroundWater.ts (credenciales para ejecutar sin abrir la app)
- **Accesos rápidos del icono (pulsación larga)** — En Android solo existe el acceso 'Log water' (fila siguiente).
  - **Actualizado en las PR #2989 y #3051 (fusionadas):** Android ya tiene también estas acciones del icono: Escanear comida, Registrar comida y Ayuno mediante expo-quick-actions, y Registrar agua como atajo nativo, que registra sin abrir la app. Las dos plataformas sacan los títulos de las mismas cadenas quickActions, traducidas en 10 de los otros 15 idiomas que trae la app (en húngaro, italiano, letón, noruego y ruso siguen en inglés). En Android, los mensajes de resultado de Registrar agua siguen solo en inglés, y la etiqueta larga del atajo solo está traducida al español, polaco, portugués de Brasil, chino simplificado, chino tradicional y cantonés.
  - Evidencia: hooks/useQuickActions.ts:26-49 (items), 115-131 (acciones), 142 (if Platform.OS !== 'ios' return); App.tsx:219 (QuickActionsGate)
- **Live Activity del entrenamiento (pantalla de bloqueo y Dynamic Island)** — Los botones necesitan iOS 17 o posterior. Una pulsación hecha después de cerrar la app a la fuerza se pierde. workoutLiveActivity.ts es un no-op en Android.
  - Evidencia: services/WorkoutLiveActivityLayout.tsx:316-349 (botones rest-add-15, rest-subtract-15, rest-skip, complete-set); services/workoutLiveActivity.ios.ts:486; App.tsx:452 (enlace 'active-workout'); app.config.ts:300-312 (expo-widgets)
- **Live Activity de carrera y grabación GPS** — En Android solo hay la notificación fija del servicio en primer plano ('Recording your activity / Tracking your run with GPS', utils/recordingNotification.ts:7-25), sin estadísticas en vivo ni botones.
  - Evidencia: services/RunLiveActivityLayout.tsx:118-134 (run-toggle, run-lap); services/runLiveActivity.ios.ts:460; App.tsx:454 (enlace 'record-activity'); services/runLiveActivity.ts (no-op en Android)
- **App complementaria para Apple Watch** — El módulo watch-connectivity devuelve null en Android. No hay app para Wear OS.
  - **Actualizado en las PR #3052, #3065, #3090 y #3127 (fusionadas):** Android ya tiene una app complementaria para Wear OS (Wear OS 3 o posterior) con las mismas páginas, en el orden y con la visibilidad que se eligen en el teléfono: Objetivos, Agua, Medicamentos, Peso, Tendencia, Entrenamiento, Ayuno y Pasos, más Now Playing durante un entrenamiento. Como la del Apple Watch, solo se comunica con el teléfono (por la Wearable Data Layer), nunca con el servidor. Solo el Apple Watch tiene rutas guardadas, comba (Jump Rope) en interior, la valoración del esfuerzo al terminar un entrenamiento o una carrera, el doble toque y un ajuste para elegir entre teclado y corona al introducir las series (Wear OS ofrece a la vez la corona giratoria, los botones + y − y un teclado numérico).
  - Evidencia: targets/watch/expo-target.config.js:86-94; targets/watch/Presentation/ContentView.swift; modules/watch-connectivity/index.ts:905-907; App.tsx:479-481 (WatchCheckInGate, WatchWorkoutGate)
- **Ajustes del Apple Watch en el teléfono** — La fila solo aparece si WatchConnectivity.isSupported() e isPaired() devuelven true.
  - **Cubierto en parte por la PR #3052 (fusionada):** Android muestra ya una fila Wear OS en Ajustes en cuanto un reloj Wear OS se ha conectado al teléfono. Abre la misma pantalla con el interruptor de RPE, el orden y la visibilidad de las páginas y los nutrientes de la página Objetivos; el doble toque para registrar una serie y la elección entre teclado numérico y Digital Crown para introducir las series son solo de iOS. La descripción del interruptor de RPE para Wear OS (de 5 a 10, con la corona giratoria o +/−) está en inglés en todos los idiomas, mientras que la del Apple Watch está traducida en 6 de los otros 15 idiomas incluidos.
  - Evidencia: SettingsScreen.tsx:54-55 (isPaired), 368-376 (fila Apple Watch); screens/WatchSettingsScreen.tsx:124-245; constants/watchPages.ts:10-19, 55-60
- **Página Objetivos del reloj** — Solo Apple Watch.
  - **Actualizado en la PR #3052 (fusionada):** Wear OS ya tiene también la página Objetivos: un anillo de calorías con lo comido frente al objetivo, las calorías que quedan o que sobran y los nutrientes elegidos en el teléfono (proteína, carbohidratos y grasa por defecto, también los personalizados). A diferencia del Apple Watch, no muestra las calorías quemadas.
  - Evidencia: targets/watch/Presentation/GoalSummaryView.swift; utils/watchNutrients.ts; hooks/useWatchCheckInBridge.ts
- **Página Agua del reloj** — Solo Apple Watch.
  - **Actualizado en la PR #3052 (fusionada):** Wear OS también tiene ya la página Agua: un botón por recipiente, el total de hoy frente al objetivo con «Includes X from food» y las bebidas del día, cada una de las cuales se puede quitar tras confirmar «Remove Drink?». Además tiene un botón Undo Last, que no existe en el Apple Watch y quita una bebida sin preguntar (una vez sincronizadas las tomas, la primera del día y no la última), y, si no se ha sincronizado ningún recipiente, muestra unos botones provisionales Glass (250 ml) y Bottle (500 ml) donde el Apple Watch muestra un aviso.
  - Evidencia: targets/watch/Presentation/WaterIntakeView.swift; WaterLogView.swift:68-124; utils/watchWater.ts
- **Página Medicamentos del reloj** — Solo Apple Watch.
  - **Actualizado en la PR #3052 (fusionada):** Wear OS ya tiene la página Medicamentos: la misma lista que envía el teléfono, con el recuento de dosis tomadas, y un toque marca la dosis como tomada o la desmarca. Omitir una dosis sigue haciéndose en el teléfono. A diferencia del Apple Watch, no muestra el estado de sincronización ni permite reintentar, y no indica qué dosis se han omitido.
  - Evidencia: targets/watch/Presentation/MedicationsView.swift; utils/watchMedications.ts; useWatchCheckInBridge.ts
- **Check-in de peso y tendencia en el reloj** — Solo Apple Watch.
  - **Actualizado en la PR #3052 (fusionada):** Wear OS también tiene ya el check-in de peso y la página Tendencia: el peso se ajusta con la corona o el bisel giratorios, con +/− o con un teclado, el % de grasa corporal es opcional, se ve la diferencia con el último pesaje con un aviso si el cambio es brusco, se puede fijar un peso inicial cuando no hay historial y hay un gráfico de las últimas 14 entradas de peso con una media móvil, o de grasa corporal. A diferencia del Apple Watch, no indica cuándo sustituye la entrada de hoy ni muestra la diferencia de grasa corporal con la última entrada ni avisa de un cambio brusco.
  - Evidencia: targets/watch/Presentation/CheckInEntryView.swift:12-31, 140-168; TrendView.swift:107; Application/CheckInStore.swift
- **Página Ayuno del reloj** — Solo Apple Watch.
  - **Cubierto en parte por la PR #3052 (fusionada):** Wear OS ya tiene una página Ayuno con el tiempo transcurrido y el progreso frente al objetivo, el botón End Fast (sin paso de confirmación) y una complicación de ayuno. Iniciar un ayuno desde ella no funciona: ofrece 16:8, 18:6, 20:4 y OMAD, pero envía la etiqueta ('16:8') donde el teléfono espera el id de un preset ('16-8'), así que el teléfono rechaza todos los inicios y no se guarda ningún ayuno.
  - Evidencia: targets/watch/Presentation/FastingView.swift:44-107; hooks/useWatchFastingBridge.ts
- **Página Pasos del reloj** — Solo Apple Watch.
  - **Actualizado en la PR #3052 (fusionada):** Wear OS ya tiene una página Pasos con los pasos de hoy frente al objetivo de pasos de la persona (10.000 si no hay ninguno), además de una complicación de pasos. A diferencia del Apple Watch, que solo muestra el recuento del teléfono, también usa el sensor de pasos del propio reloj cuando marca más.
  - Evidencia: targets/watch/Presentation/StepsView.swift; useWatchCheckInBridge.ts (steps, stepGoal)
- **Seguimiento del entrenamiento de fuerza en el reloj** — El doble toque necesita watchOS 11 y un reloj compatible.
  - **Actualizado en la PR #3052 (fusionada):** En Wear OS también, un entrenamiento iniciado en el teléfono se envía al reloj y pone la app en primer plano; las series se registran una por pantalla con la corona o el bisel giratorios o con un teclado, la FC se lee en un servicio en primer plano y se envía al teléfono, y durante el entrenamiento aparece una página Now Playing. El descanso tiene los botones +15 s y Skip y vibra al terminar, pero un descanso iniciado o cambiado en el teléfono no se ve en el reloj (los cambios del reloj sí llegan al teléfono). No hay doble toque ni botón de −15 s.
  - Evidencia: targets/watch/Presentation/WorkoutView.swift; Application/WorkoutSessionStore.swift; Infrastructure/WorkoutHealthKitController.swift; Presentation/NowPlayingPage.swift; Domain/WatchPage.swift:13; hooks/useWatchWorkoutBridge.ts; useWatchSetTargetsSync.ts; modules/watch-connectivity/ios/WatchConnectivityModule.swift:285 (startWatchApp)
- **Iniciar y editar entrenamientos desde el reloj** — 'Reemplazar ejercicio' todavía no está en el reloj.
  - **Actualizado en las PR #3010 y #3052 (fusionadas):** Wear OS también lista ya los entrenamientos guardados y los programados para hoy y los inicia desde la muñeca; durante el entrenamiento se puede añadir o borrar una serie, cambiar su tipo, añadir, borrar o saltar un ejercicio, ir a cualquier serie y terminar o descartar, pero sin las confirmaciones que pide el Apple Watch. En los dos relojes, un entrenamiento iniciado desde la muñeca recibe ya los objetivos de progresión y la detección de récords del teléfono aunque no se llegue a abrir la pantalla de entrenamiento del teléfono, y ninguno de los dos puede reemplazar un ejercicio todavía.
  - Evidencia: targets/watch/Presentation/WorkoutEditPages.swift; hooks/useWatchWorkoutStart.ts; useWatchWorkoutEdit.ts; useWatchPlanSync.ts; utils/workoutPlanSchedule.ts
- **Fin de entrenamiento en el reloj** — Solo Apple Watch.
  - **Actualizado en las PR #3052 y #3065 (fusionadas):** Wear OS también celebra ya un nuevo récord personal con un aviso y una vibración, pregunta «Update Preset?» si un entrenamiento de una plantilla se cambió en el reloj y termina con un resumen de series, duración, FC media y calorías (estimadas a partir de la FC). No muestra el volumen ni la FC máxima, no guarda el entrenamiento en Health Connect y no tiene la valoración de esfuerzo de 1 a 10 («How hard was that?») que el resumen del Apple Watch pide ahora y guarda en el servidor y, con watchOS 11 o posterior, en Apple Health.
  - Evidencia: Application/WorkoutSessionStore.swift (makeSummary, celebratedPrSetIds); App.tsx:482 (PendingPresetUpdatePrompt); hooks/useWorkoutCompletePresetSync.ts; services/healthkit/dataTransformation.ts (isOwnWatchWorkout)
- **Carrera o caminata independiente en el reloj** — Solo Apple Watch.
  - **Cubierto en parte por las PR #3052, #3065, #3069, #3090 y #3127 (fusionadas):** Wear OS ya graba también una carrera o caminata por su cuenta: en exterior con el GPS del reloj o en interior, con planes, alertas de ritmo y de FC, pausa automática, avisos de voz, vueltas, corrección de la distancia en cinta y resumen, y el teléfono la sigue y la controla en WatchRunLive. El teléfono guarda estas sesiones sin mapa, parciales ni vueltas, porque descarta los puntos GPS y las marcas de vuelta que envía el reloj, y sin cadencia ni zancada, porque el reloj no envía el recuento de pasos y Android no tiene otra fuente para obtenerlo. Solo el Apple Watch ofrece la comba (Jump Rope) en interior, seguir una ruta guardada (mapa, avisos de giro y aviso de salida de ruta) y la valoración del esfuerzo al terminar.
  - Evidencia: targets/watch/Presentation/WatchRunView.swift:29-311; Application/WatchRunStore.swift; Infrastructure/WatchRunHealthKitController.swift, WatchRunCues.swift; screens/WatchRunLiveScreen.tsx; hooks/useWatchRunBridge.ts; App.tsx:611-612
- **Control de la grabación GPS del teléfono desde el reloj** — Solo Apple Watch.
  - **Actualizado en la PR #3052 (fusionada):** Wear OS ya funciona también como mando de la grabación GPS del teléfono. Muestra el tiempo, la distancia, el ritmo, la FC y el tramo actual del plan, tiene los botones Pause/Resume, Lap y Stop, y envía la FC del reloj para adjuntarla a la actividad. A diferencia del Apple Watch, no muestra ningún resumen al terminar la grabación.
  - Evidencia: targets/watch/Presentation/RecordingView.swift:14-109; hooks/useWatchRecordingBridge.ts:30-45
- **Complicaciones de la esfera del Apple Watch** — Solo Apple Watch.
  - **Actualizado en la PR #3052 (fusionada):** Wear OS ya tiene las mismas siete complicaciones: Calorías, Proteína, Carbohidratos, Grasa, Agua, Ayuno y Pasos, cada una como valor en rango (indicador) o texto corto. Al tocarlas se abre la página Objetivos para calorías y macros, o la de Agua, Ayuno o Pasos. Los formatos no coinciden: en el Apple Watch, Calorías y Agua solo son circulares y el resto también tiene versión de esquina, rectangular y en línea (inline).
  - Evidencia: targets/watch-widget/index.swift:5-14; MacroComplications.swift; FastingComplication.swift; StepsComplication.swift; ComplicationLinks.swift
- **Lectura de etiquetas en el dispositivo (Apple Intelligence)** — Solo iOS 27+ con Apple Intelligence activo. En Android el módulo es null.
  - Evidencia: modules/on-device-nutrition/index.ts:44-50 (isAvailable: iOS 27+ con Apple Intelligence); ios/OnDeviceNutritionModule.swift; services/onDeviceLabelScan.ts:15, 251; onDeviceSupplementScan.ts:177; AiSettingsScreen.tsx:61-140; FoodScanScreen.tsx:582-615
- **Navegación Liquid Glass (iOS 26)** — La fila solo aparece si canUseLiquidGlass() es true. Android siempre usa CustomTabBar.
  - Evidencia: AppSettingsScreen.tsx:211-226; services/nativeTabBarPreference.ts:13, 26; components/TabsLayout.tsx; patches/react-native-bottom-tabs@1.4.0.patch
- **FC en vivo y objetivos por rango de FC al grabar con GPS** — Hace falta un Apple Watch emparejado, así que solo funciona en iOS y no en bici. En Android la grabación GPS no tiene FC ni objetivos de FC; solo objetivos por ritmo. No se admiten pulsómetros Bluetooth.
  - **Actualizado en las PR #3052 y #3078 (fusionadas):** En Android, un reloj Wear OS emparejado aporta ahora la frecuencia cardiaca, así que las tarjetas de rango de FC (general y, en intervalos, trabajo, suave y calentamiento) aparecen y avisan tanto cuando el móvil graba con su GPS como cuando el reloj graba la caminata o la carrera, aunque en una carrera grabada en el reloj Wear OS los rangos de los intervalos solo avisan mientras está activada la alerta general de FC, y los rangos de ritmo de los intervalos necesitan igualmente la alerta general de ritmo. Como en iOS, no hay FC sin reloj, ni en las salidas en bici, ni compatibilidad con pulsómetros Bluetooth; en ambas plataformas, los rangos sugeridos para los intervalos siguen ahora las zonas de frecuencia cardiaca de los ajustes. La descripción de la tarjeta principal en Android ('Needs your Wear OS watch…') no está traducida a ningún otro idioma, mientras que la del Apple Watch está traducida en 6 de los otros 15 idiomas incluidos.
  - Evidencia: screens/RecordActivityScreen.tsx:146-158 (bandas por defecto), 268-269 (watchAvailable = watchSupported && watchPaired && activity !== 'ride'), 407 (calentamiento por FC solo con reloj), 497, 1200-1201 y 1316-1345 (HeartRateBandCard solo con watchAvailable); hooks/useWatchRecordingBridge.ts:251 (FC del reloj)

### 3.2 Solo en Android (31)

**Diferencias iOS/Android: configuración nativa**

- **Métricas de salud solo en Android (Health Connect)** — No aparecen en la lista de métricas en iOS.
  - Evidencia: SparkyFitnessMobile/src/HealthMetrics.ts:450 (speed), 464 (power), 478 (elevationGained), 507 (bodyWaterMass), 535 (cyclingPedalingCadence), 591 (stepsCadence) con platforms: ['android']; filtro en HealthMetrics.ts:1076-1085; app.config.ts:37-66 (READ_BODY_WATER_MASS, READ_CYCLING_PEDALING_CADENCE, READ_ELEVATION_GAINED, READ_POWER, READ_SPEED, RE…
- **Permiso de alarmas exactas ('Alarms & reminders')** — Solo Android 12+/13+; en iOS no aplica (canScheduleExactAlarms devuelve true).
  - Evidencia: SparkyFitnessMobile/src/services/ExactAlarmBridge.ts:8-34; src/services/notifications.ts:329-376 (maybePromptForExactAlarmPermission); app.config.ts:77-80 (SCHEDULE_EXACT_ALARM); plugins/withExactAlarmModule.ts; targets/android-exact-alarm/kotlin/.../ExactAlarmModule.kt
- **Canales de notificación configurables en el sistema** — iOS no tiene canales; solo el interruptor global de notificaciones de la app.
  - **Actualizado en las PR #2989 y #3028 (fusionadas):** Android tiene además un canal 'Mood check-ins' (importancia alta, con vibración) para los recordatorios diarios de estado de ánimo y un canal 'Quick logging' (importancia normal, sin sonido ni vibración) para el resultado de la baldosa Registrar agua de Ajustes rápidos. El nombre de Mood check-ins pasa por las cadenas de la app como los demás canales creados desde JS, pero aún no está traducido a ninguno de los otros idiomas que trae la app; el nombre de Quick logging y sus mensajes están escritos en inglés en el código nativo. iOS sigue sin canales.
  - Evidencia: SparkyFitnessMobile/src/services/notifications.ts:57-92,144-170 (setNotificationChannelAsync solo si Platform.OS === 'android'); targets/android-workout-notification/kotlin/.../WorkoutNotificationModule.kt (canal Ongoing workout, IMPORTANCE_LOW)

**Diferencias iOS/Android: componentes**

- **Métricas de salud sincronizables solo en Android (Health Connect)** — No aparecen en iOS. iOS tiene sus propias métricas de ciclismo y carrera (ver plat-components-health-metrics-ios-only), no estas.
  - Evidencia: Entradas platforms:['android'] en SparkyFitnessMobile/src/HealthMetrics.ts: speed (460), power (474), elevationGained (488), bodyWaterMass (517), cyclingPedalingCadence (545), stepsCadence (601). Se filtran en HealthMetrics.ts:1076-1084 y se muestran en SparkyFitnessMobile/src/components/HealthDataSync.tsx:252-271
- **DevTools: accesos directos a los ajustes y datos de Health Connect** — Solo en Android y solo en builds de desarrollo. iOS no tiene ningún acceso equivalente a la app Salud.
  - Evidencia: SparkyFitnessMobile/src/components/DevTools.tsx:594-615 (Platform.OS === 'android'; openHealthConnectSettings / openHealthConnectDataManagement). DevTools solo se muestra con __DEV__ y APP_VARIANT development/dev: SparkyFitnessMobile/src/screens/SettingsScreen.tsx:421-425
- **DevTools: comprobar el permiso de lectura en segundo plano** — Solo Android y solo en builds de desarrollo. El botón 'Trigger Sync' (DevTools.tsx:627-636) está en las dos plataformas.
  - Evidencia: SparkyFitnessMobile/src/components/DevTools.tsx:420-440 (handleCheckBackgroundPermissions con getGrantedPermissions), 637-649 (Platform.OS === 'android'); solo en builds de desarrollo (SettingsScreen.tsx:421-425)

**Diferencias iOS/Android: pantallas**

- **Métricas de salud sincronizables solo en Android** — En iOS no hay un equivalente directo para velocidad, potencia y cadencia genéricas, pero sí existen las variantes específicas de carrera y ciclismo, que son solo de iOS.
  - Evidencia: SparkyFitnessMobile/src/HealthMetrics.ts:450 (speed), 464 (power), 478 (elevationGained), 507 (bodyWaterMass), 535 (cyclingPedalingCadence), 591 (stepsCadence), todas con platforms: ['android']; filtro en 1076-1085
- **Informe de datos de salud (exportación anonimizada para reportar errores)** — En iOS no se muestra el botón y no hay alternativa equivalente en esta pantalla.
  - Evidencia: SparkyFitnessMobile/src/screens/SyncScreen.tsx:1011-1045 (bloque {isAndroid && ...}, comentario 'Health Data Report — Android only'), 706-721 (handleShareHealthReport -> shareHealthDiagnosticReport)
- **Consejos para grabar con la pantalla apagada (optimización de batería)** — En iOS no se muestra porque la grabación sigue con la pantalla bloqueada gracias a la tarea de ubicación en segundo plano.
  - Evidencia: SparkyFitnessMobile/src/screens/RecordActivityScreen.tsx:1443-1467 ({Platform.OS === 'android' && !indoor ? ...}, claves recordActivity.androidTips.*)
- **Aviso 'Alertas puntuales' para permitir alarmas exactas** — En iOS el módulo no existe y canScheduleExactAlarms devuelve true, así que el aviso no aparece nunca.
  - Evidencia: src/services/notifications.ts:336-370 (maybePromptForExactAlarmPermission con Alert 'On-time alerts' / 'Open Settings'); src/services/ExactAlarmBridge.ts:8-30 (módulo solo en Android); se llama desde src/screens/NotificationSettingsScreen.tsx:132, src/hooks/useStartLiveWorkout.ts:345, src/screens/WorkoutDetailScreen.tsx:361 y src/components/Medica…

**Diferencias iOS/Android: servicios y hooks**

- **Refresco de widgets desde el servidor en segundo plano** — En iOS los snapshots solo se escriben desde useWidgetSync (app en primer plano mostrando hoy); WidgetKit no recibe datos nuevos desde la tarea de background.
  - **Actualizado en las PR #2989 y #3020 (fusionadas):** La actualización en segundo plano de Android refresca ahora también el total y el objetivo del widget de agua, y conserva el tamaño de la toma y la unidad que la app envió por última vez. La baldosa de Ajustes rápidos Calorías restantes lee esa misma instantánea de calorías ya actualizada cada vez que se abre el panel. Las instantáneas se borran al cambiar de cuenta, y una actualización que aún esté cargando en ese momento no envía nada. iOS sigue sin actualización en segundo plano: la tarea en segundo plano no toca sus widgets.
  - Evidencia: backgroundSyncService.ts:132-141 (solo si Platform.OS === 'android') llama a refreshAndroidWidgetsFromServer (androidWidgetSyncService.ts:94-118: timezone, loadDailySummaryRawData, push calorie+macro).
- **Permiso de alarmas exactas ('Alarmas y recordatorios')** — Sin el permiso, Android agrupa las alarmas ~15 s tarde. En iOS la cuestión no aplica y nunca se muestra.
  - Evidencia: services/ExactAlarmBridge.ts:8-34 (NativeModules.ExactAlarm solo en Android; en iOS devuelve true); services/notifications.ts:330-377 maybePromptForExactAlarmPermission (Alert 'On-time alerts' con 'Abrir ajustes'); invocado desde screens/NotificationSettingsScreen.tsx:132, screens/WorkoutDetailScreen.tsx:361, hooks/useStartLiveWorkout.ts:345 y com…
- **Canales de notificación por categoría** — iOS no tiene canales; el usuario solo puede activar/desactivar notificaciones de la app en Ajustes. Las categorías con botones de acción (Complete Set, Log as taken, Skip) existen en ambos.
  - **Actualizado en las PR #2989, #3005 y #3028 (fusionadas):** Los canales creados desde JS incluyen ahora también 'Mood check-ins' (importancia alta, vibración) para los recordatorios diarios de estado de ánimo, y de momento su nombre solo está en inglés. Además, los recordatorios de medicación tienen en las dos plataformas un botón para posponerlos ('Recordar en N min'). Un canal nativo 'Quick logging', con importancia normal y sin sonido, vibración ni aviso emergente, se crea la primera vez que la baldosa de Ajustes rápidos para registrar agua publica su resultado. Su nombre y sus mensajes están escritos en inglés directamente en el código. iOS sigue sin canales.
  - Evidencia: services/notifications.ts:57-91 (registerLocalizedNotificationPresentation crea 4 canales solo si Platform.OS === 'android'), :144-157 (ensureMedicationReminderChannel) y :159-170 (ensureSymptomReminderChannel); los triggers usan channelId (:419, :517, :567, :613).
- **Consentimiento de ruta por entrenamiento importado** — En iOS la ruta se autoriza una vez junto con los entrenamientos (HKWorkoutRouteTypeIdentifier en WORKOUT_TELEMETRY_READ_IDENTIFIERS, services/healthkit/index.ts:197-212).
  - Evidencia: services/healthconnect/provider.ts:94-123 (prepareInteractiveRead -> prefetchSessionRoutes antes de lecturas con timeout); services/healthconnect/workoutTelemetry.ts:30-75 (decisiones guardadas en '@SparkyFitness/routeConsent:', denegación caduca a las 24 h), :171-172 (requestExerciseRoute serializado), :241; app.config.ts:42-46 (READ_EXERCISE_ROU…
- **Métrica: Velocidad (genérica)** — iOS no tiene velocidad genérica; ofrece por separado Walking Speed, Running Speed y Cycling Speed (filas ios_only).
  - Evidencia: HealthMetrics.ts:450 (platforms ['android'], type speed); app.config.ts:64 READ_SPEED; services/healthconnect/dataTransformation.ts:240.
- **Métrica: Potencia (genérica)** — iOS ofrece Running Power y Cycling Power por separado.
  - Evidencia: HealthMetrics.ts:464 (platforms ['android'], type power); app.config.ts:60 READ_POWER; services/healthconnect/dataTransformation.ts:234.
- **Métrica: Desnivel positivo (Elevation Gained)** — En iOS solo existe 'Floors Climbed' (ambos).
  - Evidencia: HealthMetrics.ts:478 (platforms ['android']); app.config.ts:48 READ_ELEVATION_GAINED; services/healthconnect/dataTransformation.ts:228.
- **Métrica: Masa de agua corporal** — Sin equivalente HealthKit.
  - Evidencia: HealthMetrics.ts:505 (platforms ['android']); app.config.ts:37 READ_BODY_WATER_MASS; services/healthconnect/dataTransformation.ts:222.
- **Métrica: Cadencia de pasos** — iOS no lee cadencia de pasos (ni diaria ni en telemetría de entrenamientos).
  - Evidencia: HealthMetrics.ts:591 (platforms ['android'], aggregationStrategy min-max-avg); app.config.ts:66 READ_STEPS_CADENCE; services/healthconnect/dataTransformation.ts:875.
- **Métrica: Masa ósea** — Solo funciona en Android. En iOS se muestra el interruptor pero nunca lee datos (HealthKit no tiene masa ósea).
  - Evidencia: HealthMetrics.ts:492 sin restricción de plataforma (aparece el interruptor también en iOS, components/HealthDataSync.tsx:118), pero HEALTHKIT_TYPE_MAP (services/healthkit/index.ts:232-300) no tiene BoneMass, así que readHealthRecordsDetailed devuelve [] (:1929-1932). Android: app.config.ts:38 READ_BONE_MASS; services/healthconnect/dataTransformati…
- **Métrica: Impulsos de silla de ruedas** — En iOS el interruptor existe pero no hace nada; probable mapeo pendiente a PushCount.
  - Evidencia: HealthMetrics.ts:435 sin restricción de plataforma; en iOS HEALTHKIT_TYPE_MAP no mapea WheelchairPushes (aunque HKQuantityTypeIdentifierPushCount figura en SUPPORTED_HK_TYPES, services/healthkit/index.ts:167), por lo que no se pide permiso ni se lee. Android: app.config.ts:70 READ_WHEELCHAIR_PUSHES; services/healthconnect/dataTransformation.ts:271.
- **Métrica: Periodo menstrual** — En iOS solo funciona 'Menstruation Flow' (fila ios_only); el interruptor 'Menstruation Period' aparece pero no importa datos. Moco cervical, test de ovulación y sangrado intermenstrual existen en ambos.
  - Evidencia: Android HealthMetrics.ts:563 + services/healthconnect/dataTransformation.ts:828 + app.config.ts:57 READ_MENSTRUATION. iOS HealthMetrics.ts:665 define la métrica para iOS, pero HEALTHKIT_TYPE_MAP no contiene MenstruationPeriod (services/healthkit/index.ts:232-300), así que no se lee nada.
- **Reintento de teclado al enfocar campos (Android)** — Corrección de comportamiento, no una opción visible; en iOS no hace nada.
  - Evidencia: utils/keyboardFocus.ts:25-37 (scheduleAndroidImeShowRetry, return undefined si no es Android) y :66-71; usado en components/ActiveWorkoutSetRow.tsx:412, components/EditableSetRow.tsx:148 y components/FormInput.tsx:74-78.

**Administración y recursos de desarrollador**

- **Informe anonimizado de datos de salud (Health Data Report)** — Condicionado a isAndroid = Platform.OS==='android' (SyncScreen.tsx:190, :1012); en iOS no existe un informe equivalente basado en HealthKit.
  - Evidencia: SparkyFitnessMobile/src/screens/SyncScreen.tsx:100 (import shareHealthDiagnosticReport), :706-722 (handleShareHealthReport), :1011-1050 (bloque 'Health Data Report — Android only' con isAndroid); src/services/healthDiagnosticService.ts:66, :364 (redondeo por privacidad).

**Ejercicios, entrenamientos y running**

- **Consejo para grabar con la pantalla apagada** — Solo se muestra en Android en actividades al aire libre.
  - Evidencia: src/screens/RecordActivityScreen.tsx:1443-1466 (Platform.OS === 'android' && !indoor)

**Medicación, GLP-1 y síntomas**

- **Permiso de alarmas exactas para recordatorios** — Solo Android (ExactAlarmBridge.isAvailable es falso en iOS).
  - Evidencia: MedicationReminderReconciler.tsx:84-92 llama a maybePromptForExactAlarmPermission (services/notifications.ts:336-348) vía ExactAlarmBridge (targets/android-exact-alarm).

**Ajustes, perfil, familia e integraciones**

- **Informe de datos de salud para soporte** — Condicionado por isAndroid (SyncScreen.tsx:190,1004).
  - Evidencia: src/screens/SyncScreen.tsx:1004-1050 (renderizado solo si isAndroid)
- **Permiso de alarmas exactas** — ExactAlarmBridge.isAvailable solo es cierto en Android.
  - Evidencia: src/screens/NotificationSettingsScreen.tsx:125-133; services/notifications.ts:336-350 (ExactAlarmBridge); targets/android-exact-alarm; plugins/withExactAlarmModule.ts

**Capacidades nativas del móvil**

- **Métricas exclusivas de Health Connect** — Solo en Health Connect.
  - Evidencia: HealthMetrics.ts:450-518, 535-602 (platforms: ['android']); permisos READ_SPEED/POWER/ELEVATION_GAINED/BODY_WATER_MASS/CYCLING_PEDALING_CADENCE/STEPS_CADENCE en app.config.ts:27-70
- **Acceso directo 'Log water' en el lanzador de Android** — La etiqueta 'Log water' está fija en inglés (BackgroundWaterModule.kt:33-34). No hay accesos para escanear, buscar o ayuno, a diferencia de iOS.
  - **Actualizado en las PR #2989, #3020 y #3051 (fusionadas):** Su etiqueta corta sale de las cadenas quickActions de la app, traducidas en 10 de los otros 15 idiomas que trae; la larga solo está traducida al español, polaco, portugués de Brasil, chino simplificado, chino tradicional y cantonés. Aparece junto a Escanear comida, Registrar comida y Ayuno, nunca trae la app al frente y cada toma registrada con él actualiza también el widget de agua si hay uno colocado. El Toast de resultado sigue solo en inglés y únicamente se ve con las notificaciones de la app activadas (en HyperOS, también las flotantes).
  - Evidencia: targets/android-background-water/kotlin/.../BackgroundWaterModule.kt:21-43 (pushDynamicShortcut); LogWaterActivity.kt:23-60; plugins/withBackgroundWater.ts:7-10
- **Notificación persistente de entrenamiento (Android)** — No tiene botones (el módulo no usa addAction), a diferencia de los controles de la Live Activity de iOS. Por debajo de Android 16 es una notificación continua normal con el progreso total.
  - Evidencia: services/workoutLiveActivity.android.ts:12-60; targets/android-workout-notification/kotlin/.../WorkoutNotificationModule.kt:40-95 (SDK_INT >= 36 y ProgressStyle); RestDeadlineReceiver.kt; plugins/withWorkoutNotification.ts; app.config.ts:29 (POST_PROMOTED_NOTIFICATIONS)

### 3.3 En ambos, pero distinto (131)

**Diferencias iOS/Android: configuración nativa**

- **Entrenamiento activo fuera de la app: Live Activity (iOS) vs notificación continua (Android)** — iOS: Live Activity interactiva en pantalla de bloqueo y Dynamic Island con botones +15 s / -15 s / Saltar descanso y Completar serie que actúan sin abrir la app. Android: notificación continua (canal 'Ongoing workout', importancia baja) con cronómetro o cuenta atrás de descanso, texto ejercicio · posición de serie y, en Android 16+, ProgressStyle segmentado por ejercicio como 'promoted ongoing' (Live Update); sin botones de acción (solo abre la …
  - Evidencia: iOS: SparkyFitnessMobile/src/services/workoutLiveActivity.ios.ts:37-70 (expo-widgets LiveActivity, Lock Screen + Dynamic Island, botones rest-add-15/rest-subtract-15/rest-skip/complete-set); src/services/WorkoutLiveActivityLayout.tsx:314-361. Android: src/services/workoutLiveActivity.android.ts:21-41,136-160; targets/android-workout-notification/k…
- **Grabación GPS/carrera fuera de la app: Live Activity (iOS) vs notificación de servicio en primer plano (Android)** — iOS: Live Activity en pantalla de bloqueo y Dynamic Island con reloj, distancia, ritmo y FC actualizados cada ~5 s y botones Pausa/Reanudar y Vuelta; también cubre carreras iniciadas en el Apple Watch. Android: solo la notificación estática del servicio de ubicación ('Recording your activity' / 'Tracking your run with GPS'), sin métricas en vivo ni botones.
  - Evidencia: iOS: SparkyFitnessMobile/src/services/runLiveActivity.ios.ts:43-57,406-418 (botones run-toggle y run-lap; distancia, ritmo, FC, paso del plan); src/services/RunLiveActivityLayout.tsx. Android/fallback: src/services/runLiveActivity.ts:1-13 (no-op); src/services/gpsRecordingService.ts:1115-1137 (foregroundService notificationTitle/Body); src/utils/r…
- **Widgets de pantalla de inicio: calorías y macros** — iOS (WidgetKit): calorías y macros en tamaños pequeño y mediano (botones Buscar/Escanear en el mediano). Android (Jetpack Glance): calorías 2x1 y macros 2x2, tamaño fijo (no redimensionables), solo pantalla de inicio, ambos con botones Buscar/Escanear (deep links sparkyfitnessmobile://search y ://scan).
  - **Sigue pendiente:** No se ha hecho lo previsto: lo comido y lo quemado en el widget de calorías de Android, un tamaño mediano y poder redimensionarlos. En Android el widget de calorías sigue mostrando solo las calorías restantes en un 2x1 fijo y el de macros es un 2x2 fijo, ambos solo para la pantalla de inicio y con los botones de buscar y escanear, mientras que iOS tiene tamaños pequeño y mediano y muestra lo comido y lo quemado en el widget de calorías. La PR #3228, aún sin fusionar, hace que los dos se puedan redimensionar y añade lo comido y lo quemado en los tamaños grandes del de calorías.
  - Evidencia: iOS: SparkyFitnessMobile/targets/widget/index.swift:4-19; targets/widget/widgets.swift:309-323 (systemSmall/systemMedium + accessory), 290-299 (botones search/scan en medium); targets/widget/macroWidget.swift:413-426,394-403. Android: targets/android-widget/kotlin/.../CalorieWidget.kt.tmpl:91-161; MacroWidget.kt.tmpl:64-66,89-132; targets/android-…
- **Accesos rápidos del icono de la app** — iOS: 4 accesos localizados (Escanear comida, Registrar comida, Registrar agua, Ayuno); los de navegación abren la pantalla y 'agua' registra una bebida con toast. Android: un único atajo dinámico 'Log water' (etiqueta fija en inglés) que registra una bebida en segundo plano vía WorkManager sin abrir la app y avisa con un Toast; aparece solo si hay servidor con sesión y recipiente de agua.
  - **Actualizado en la PR #2989 (fusionada):** Android ofrece ya las mismas cuatro acciones: Escanear comida, Registrar comida y Ayuno con expo-quick-actions, más el atajo nativo Registrar agua. Los cuatro títulos salen de las mismas cadenas quickActions que en iOS, traducidas en 10 de los otros 15 idiomas que trae la app (en el resto aparecen en inglés). Registrar agua sigue funcionando distinto: Android lo registra en segundo plano sin abrir la app y avisa con un Toast en inglés que únicamente aparece si las notificaciones de la app están activadas, mientras que iOS abre la app, lo registra desde JS y muestra un Toast con esas mismas cadenas traducidas.
  - Evidencia: iOS: SparkyFitnessMobile/src/hooks/useQuickActions.ts:26-49 (scan-food, search-food, log-water, fasting), 130-153 (solo Platform.OS === 'ios', expo-quick-actions). Android: targets/android-background-water/kotlin/.../BackgroundWaterModule.kt:20-41 (ShortcutManagerCompat.pushDynamicShortcut 'Log water'); LogWaterActivity.kt:22-43 (actividad sin UI …
- **Actualización de widgets en segundo plano** — Android: la tarea de sincronización en segundo plano descarga el resumen diario del servidor y repinta los widgets, además de reiniciarlos a medianoche. iOS: los widgets solo muestran el último snapshot que escribió la app (se recargan cada 15 min o a medianoche, pero sin pedir datos nuevos al servidor).
  - **Actualizado en las PR #3020 y #3021 (fusionadas):** El nuevo widget de agua de Android tiene el mismo refresco en segundo plano y el mismo reinicio a medianoche que los de calorías y macros, y muestra el total del servidor tras registrar una toma con sus botones − / + o con el atajo o la baldosa Registrar agua, de forma parecida al widget de agua de iOS con sus botones, controles o Siri. La actualización de medianoche se vuelve a programar aunque falle el redibujado. Los widgets de iOS siguen sin recibir datos del servidor en segundo plano, solo lo que escriben la app o esas acciones de agua.
  - Evidencia: Android: SparkyFitnessMobile/src/services/backgroundSyncService.ts:132-140 (refreshAndroidWidgetsFromServer en la tarea de fondo); src/services/androidWidgetSyncService.ts:94-109; targets/android-widget/kotlin/.../CalorieWidgetReceiver.kt.tmpl:84 y MacroWidgetReceiver.kt.tmpl:84 (refresco de medianoche). iOS: targets/widget/widgets.swift:64-85 (ti…
- **Integración con el almacén de salud: Apple Health (HealthKit) vs Health Connect** — Misma pantalla pero distinto backend: iOS usa HealthKit (sin permiso de historial aparte, detección de 'base de datos bloqueada'); Android usa Health Connect (contador de cliente no disponible, permisos por tipo de registro). Solo en Android se muestra el aviso 'Not medical advice. Consult a healthcare professional…' en la pantalla de sincronización.
  - Evidencia: SparkyFitnessMobile/app.json:10-17 (@kingstinct/react-native-healthkit, background true) y 28 (react-native-health-connect); app.config.ts:26-81 (permisos android.permission.health.*); src/services/healthConnectService.ts (Android) vs src/services/healthConnectService.ios.ts (iOS); src/components/HealthDataSync.tsx:63-71; src/components/HealthSour…
- **Variabilidad de la frecuencia cardiaca (HRV)** — iOS envía SDNN (Apple Health); Android envía RMSSD (Health Connect). Los valores no son comparables entre plataformas.
  - **Actualizado en las PR #3019 y #3100 (fusionadas):** La misma división llega ahora al sueño: con la sincronización de HRV activada, las noches sincronizadas llevan también una HRV nocturna. Es la media de SDNN de HealthKit durante el sueño principal de la noche en iOS y de RMSSD de Health Connect en Android. Las dos van al mismo campo de HRV nocturna de los informes de sueño, así que esos valores tampoco son comparables entre plataformas.
  - Evidencia: SparkyFitnessMobile/src/HealthMetrics.ts:387-401 (iOS, HeartRateVariabilitySDNN, type HRV_SDNN) y 404-418 (Android, HeartRateVariabilityRmssd, type HRV)
- **BMR / energía en reposo y calorías totales desde el almacén de salud** — iOS mapea BMR a 'Resting Energy' agregada por día y, si se activa 'Use external BMR', muestra una nota recomendando poner Nivel de actividad en 'None (×1.0)' para no contarlo dos veces. Android lee registros BasalMetabolicRate crudos de Health Connect y no muestra esa nota.
  - Evidencia: SparkyFitnessMobile/src/services/healthkit/index.ts:236,272 (BasalMetabolicRate y TotalCaloriesBurned -> HKQuantityTypeIdentifierBasalEnergyBurned); src/services/healthConnectService.ios.ts:75-78 vs src/services/healthConnectService.ts:43-53 (stub vacío en Android); src/services/healthDataDisplay.ts:320; src/screens/CalorieSettingsScreen.tsx:918-9…
- **Sincronización de salud en segundo plano** — iOS: además de la tarea periódica, usa HealthKit background delivery/observadores que disparan una sincronización cuando hay datos nuevos; muestra la nota 'se actualizará cuando el teléfono lo permita'. Android: al activarlo pide el permiso 'BackgroundAccessPermission' de Health Connect (si se deniega, muestra alerta y no se activa) y depende solo de la tarea periódica de WorkManager; no hay observadores.
  - Evidencia: SparkyFitnessMobile/src/screens/SyncScreen.tsx:293-371; src/components/SyncFrequency.tsx:38-45; src/services/healthConnectService.ios.ts:118-129 (backgroundDelivery) vs src/services/healthConnectService.ts:132-148 (stubs); src/services/healthkit/backgroundDelivery.ts; src/hooks/useAppStartup.ts:131-183; src/services/backgroundSyncService.ts:382-39…
- **Importar historial completo de salud** — Android: Health Connect limita la lectura diaria (si se alcanza la cuota, la importación se pausa y se reanuda al día siguiente) y sin el permiso de historial solo alcanza ~30 días; la pantalla muestra ambos avisos. iOS: sin permiso de historial separado ni cuota; vuelve a pedir autorización de tipos no determinados antes de leer.
  - Evidencia: SparkyFitnessMobile/src/screens/ImportHistoryScreen.tsx:45-46,289,455-530; src/services/backfillService.ts:225-231; app.config.ts:72 (READ_HEALTH_DATA_HISTORY); src/services/healthConnectService.ios.ts:33-35 (ensureHistoryReadPermission siempre true)
- **Importación de rutas GPS de entrenamientos del almacén de salud** — Android: cada ruta requiere un diálogo de consentimiento por sesión del sistema (solo en sincronizaciones interactivas; en segundo plano no se recogen). iOS: se concede una vez el permiso de rutas de entrenamiento en la hoja de HealthKit.
  - Evidencia: Android: SparkyFitnessMobile/src/services/healthconnect/workoutTelemetry.ts:1,37-51 (requestExerciseRoute, consentimiento por sesión recordado); src/services/healthconnect/provider.ts:102-122; app.config.ts:42-46 (READ_EXERCISE_ROUTES). iOS: src/services/healthkit/index.ts:190-202,259-265 (HKWorkoutRouteTypeIdentifier)
- **Escritura al almacén de salud (nutrición e hidratación)** — Funcionalidad equivalente para el usuario; cambia el destino: en iOS las comidas aparecen agrupadas como 'Food' en Apple Health; en Android como registros Nutrition en Health Connect.
  - Evidencia: SparkyFitnessMobile/src/services/writeback.ios.ts:1 -> healthkit/writeback.ts:44-53 (una HKCorrelationTypeIdentifierFood por alimento, una muestra DietaryWater por bebida); src/services/writeback.ts:1-6 -> healthconnect/writeback.ts:45-100 (registros Nutrition/Hydration con clientRecordId); src/components/HealthDataWriteback.tsx:54-61; app.json:14…
- **Mapa de ruta de sesiones de cardio** — iOS: siempre sobre Apple Maps (sin clave). Android: sobre Google Maps solo si la build incluye GOOGLE_MAPS_ANDROID_API_KEY; sin ella se dibuja solo la línea de la ruta sin mapa de fondo.
  - Evidencia: SparkyFitnessMobile/src/utils/routeMapSupport.ts:8-21; src/components/exerciseStats/RouteMap.tsx:16-17 (RouteTileMap vs RouteLine); app.config.ts:16-21,282-289,320-322 (GOOGLE_MAPS_ANDROID_API_KEY opcional); src/screens/RunSummaryScreen.tsx:10; src/screens/CardioSessionScreen.tsx:25
- **Estimación de distancia indoor con los pasos del teléfono** — iOS: pide Motion & Fitness y consulta CMPedometer para la ventana al final (no necesita nada en ejecución). Android: pide Activity recognition, guarda el contador hardware al empezar y resta al final con un módulo nativo propio; si el teléfono se reinicia durante la sesión no hay estimación.
  - Evidencia: SparkyFitnessMobile/src/services/stepCounter.ts:34-92; modules/step-counter/expo-module.config.json (platforms ['android'], permiso ACTIVITY_RECOGNITION); modules/step-counter/android/src/main/java/expo/modules/stepcounter/StepCounterModule.kt:20-60 (Sensor.TYPE_STEP_COUNTER); modules/step-counter/index.ts:36-41; app.config.ts:262-268 (motionUsage…
- **Grabación GPS con la pantalla apagada** — iOS: modo de fondo 'location' con la píldora azul en la barra de estado. Android: servicio en primer plano con notificación y, solo en Android, una tarjeta 'Recording with the screen off' que aconseja poner la batería en 'Unrestricted' con enlace a dontkillmyapp.com.
  - Evidencia: SparkyFitnessMobile/app.config.ts:200 (UIBackgroundModes 'location'), 251-273 (expo-location: isAndroidForegroundServiceEnabled true, sin background location); src/services/gpsRecordingService.ts:1115-1137 (showsBackgroundLocationIndicator, foregroundService); src/screens/RecordActivityScreen.tsx:1443-1468
- **Sonido de fin de descanso en modo silencio / en segundo plano** — iOS: suena aunque el teléfono esté en silencio e incluso con la app en segundo plano o pantalla bloqueada (pista silenciosa que mantiene la sesión de audio). Android: suena en silencio/vibración solo con la app en primer plano; en segundo plano el aviso es la notificación.
  - Evidencia: SparkyFitnessMobile/src/screens/WorkoutSettingsScreen.tsx:153-175; src/services/sounds.ts:37-45,64-90; app.config.ts:196-200 (UIBackgroundModes 'audio')
- **Idioma de la aplicación** — iOS: no hay selector en la app; la fila muestra el idioma 'Managed by iOS' y abre Ajustes de iOS. Android: selector en la app (dispositivo o idioma concreto) que en Android 13+ se sincroniza con el idioma por app del sistema; en Android 12 o anterior queda guardado solo en la app.
  - **Actualizado en la PR #2959 (fusionada):** El móvil trae ahora 16 idiomas, con el turco añadido, frente a 34 en la web. Lo demás no cambia: Android tiene un selector dentro de la app, iOS lleva a los Ajustes de iOS y el idioma del móvil sigue sin sincronizarse con la preferencia de idioma del servidor que usa la web.
  - Evidencia: SparkyFitnessMobile/src/screens/AppSettingsScreen.tsx:52-53,165-209; src/services/appLanguageNative.ts:11-30 (solo Android, API 33+); plugins/withAppLanguage.ts; targets/android-language/kotlin/.../AppLanguageModule.kt, AppLanguageApi33.kt (LocaleManager); app.config.ts:190-195 (UIPrefersShowingLanguageSettings)
- **Apariencia y navegación nativa** — iOS: iconos SF Symbols, cabeceras de pila nativas, icono Liquid Glass. Android: Ionicons, cabeceras propias de cada pantalla, modales que suben desde abajo, barra de navegación del sistema adaptada al tema, hojas inferiores que no se arrastran desde el contenido e icono adaptativo.
  - Evidencia: SparkyFitnessMobile/src/components/Icon.tsx:6-10,230 (SF Symbols en iOS, Ionicons en Android); App.tsx:192 (modales slide_from_bottom en Android), 402-411 (estilo de NavigationBar en Android), 1337 (toasts en FullWindowOverlay en iOS); src/services/nativeTabBarPreference.ts:23-27 (cabeceras nativas solo iOS); src/components/TimeSheet.tsx:138, Cale…
- **Inicio de sesión y gestión con passkeys** — Android: si el navegador por defecto no admite passkeys (p. ej. Fennec de F-Droid), abre la ceremonia en Chrome/Firefox/Samsung Internet/Edge si están instalados; textos 'huella, desbloqueo facial o PIN' y ejemplo 'My Android Phone'. iOS: siempre el navegador del sistema; textos 'Face ID, Touch ID o PIN' y 'My iPhone'.
  - Evidencia: SparkyFitnessMobile/src/services/api/authService.ts:707-760 (getPasskeyBrowserPackage solo Android), 766-785 (openAuthSessionAsync con browserPackage); src/screens/PasskeySettingsScreen.tsx:46-59
- **Conexión a servidores autoalojados (red local / certificados)** — Android (producción): bloquea HTTP sin cifrar y confía también en certificados CA instalados por el usuario (útil para servidores con CA propia). iOS: App Transport Security sin excepciones y pide permiso de 'Red local' al conectar con servidores en la LAN; un CA propio debe instalarse y marcarse como de confianza en Ajustes del sistema.
  - Evidencia: SparkyFitnessMobile/plugins/withNetworkSecurityConfig.ts:20-41 (solo builds de producción: cleartextTrafficPermitted=false, trust-anchors system + user); app.config.ts:134,314 (prodPlugins), 171-172 (NSLocalNetworkUsageDescription), 186-188 (NSAllowsArbitraryLoads false); src/utils/serverUrl.ts:82-86
- **Soporte de tablet** — iOS: no hay versión para iPad (se ejecuta en modo compatibilidad de iPhone). Android: se instala en tabletas como app normal, en vertical.
  - Evidencia: SparkyFitnessMobile/app.config.ts:169 (ios.supportsTablet: false); app.json:6 (orientation portrait)
- **Dictado en el Chat y voz de lectura** — Disponible en ambas. Android activa el cambio automático de idioma del reconocedor; el consejo para conseguir voces naturales difiere (iOS: descargar voces Premium/Enhanced en Ajustes > Accesibilidad; Android: texto propio de Android).
  - Evidencia: SparkyFitnessMobile/src/screens/ChatScreen.tsx:575-586 (androidIntentOptions EXTRA_ENABLE_LANGUAGE_SWITCH solo Android); src/hooks/useSpeechVoiceChoices.ts:74-80; app.config.ts:229-250 (expo-speech-recognition, expo-audio)
- **Herramientas de desarrollo (solo builds dev)** — No visible para usuarios finales. Android: atajos a ajustes y datos de Health Connect, comprobar permiso de fondo, sembrado 'Rich Workout (Route+HR+Laps)'. iOS: estado de emparejamiento/alcance del Apple Watch y sembrado vía HealthKit.
  - **Actualizado en la PR #3052 (fusionada):** Las compilaciones de desarrollo de Android muestran ahora también la sección del enlace con el reloj, con el título Wear OS y los indicadores de emparejado y accesible. En Android indican que un reloj Wear OS se ha conectado alguna vez y que hay uno conectado ahora, no que la app del reloj esté abierta. Lo demás sigue siendo distinto: los accesos a Health Connect y la comprobación del permiso en segundo plano son solo de Android, y los datos de prueba se cargan con Health Connect en Android y con HealthKit en iOS.
  - Evidencia: SparkyFitnessMobile/src/screens/SettingsScreen.tsx:422-425 (__DEV__ y APP_VARIANT dev); src/components/DevTools.tsx:522-575,594-680; src/services/seedHealthData.ts (Health Connect insertRecords) vs src/services/seedHealthData.ios.ts (saveQuantitySample); app.config.ts:83-131 (permisos WRITE_* de Health Connect solo en dev)

**Diferencias iOS/Android: componentes**

- **Etiqueta 'Fuente' de los datos de salud en Sincronización** — iOS muestra 'Fuente: Apple Health'; Android muestra 'Fuente: Health Connect'. Es la misma función con otra fuente de datos.
  - Evidencia: SparkyFitnessMobile/src/components/HealthSourceLabel.tsx:12-15 (Platform.OS === 'ios' ? 'Apple Health' : 'Health Connect'); se muestra en SparkyFitnessMobile/src/screens/SyncScreen.tsx:943
- **Tarjeta 'Datos de salud a sincronizar': textos informativos y 'Más información'** — iOS habla de 'Apple Health (HealthKit)' y su detalle explica cómo revocar el acceso: 'Settings → Health → Data Access & Devices → SparkyFitnessMobile'. Android habla de 'Health Connect' y no da ninguna indicación para gestionar o revocar permisos. El resto de la tarjeta (interruptor 'Enable All', aviso de batería, categorías plegables) es igual en las dos.
  - Evidencia: SparkyFitnessMobile/src/components/HealthDataSync.tsx:63-83 (isIOS elige platformSubtitle/platformSummary/platformDetail), 187-226 (bloque ampliable); se muestra en SparkyFitnessMobile/src/screens/SyncScreen.tsx:985
- **Variabilidad de la frecuencia cardiaca (HRV): métrica distinta según plataforma** — iOS sincroniza HRV SDNN (type HRV_SDNN) y Android sincroniza HRV RMSSD (type HRV), así que los valores no se pueden comparar entre plataformas. SpO2 y las métricas reproductivas (menstruationPeriod, ovulationTest, cervicalMucus, intermenstrualBleeding) también tienen una entrada por plataforma, pero con el mismo 'type', así que se comportan igual.
  - **Actualizado en las PR #3019 y #3100 (fusionadas):** El mismo interruptor decide ahora también si las noches sincronizadas llevan HRV nocturna, con la misma división: la media de SDNN de HealthKit durante el sueño más largo de la noche en iOS, y la media de RMSSD de Health Connect en Android. Las dos se guardan en el mismo campo de HRV nocturna que muestran los informes de sueño de la web y del móvil, así que la HRV nocturna tampoco se puede comparar entre plataformas.
  - Evidencia: SparkyFitnessMobile/src/HealthMetrics.ts:386-401 (iOS: recordType 'HeartRateVariabilitySDNN', type 'HRV_SDNN') frente a 403-418 (Android: recordType 'HeartRateVariabilityRmssd', type 'HRV')
- **Escritura de datos de SparkyFitness en el almacén de salud del sistema** — Ofrece las mismas opciones en las dos plataformas (nutrition, hydration, eliminar todo o por rango). Cambia el destino: HealthKit en iOS (healthkit/writeback.ts) y Health Connect en Android (healthconnect/writeback.ts), y con él todos los textos ('Write to Apple Health' frente a 'Write to Health Connect').
  - Evidencia: SparkyFitnessMobile/src/components/HealthDataWriteback.tsx:54-62 (se oculta fuera de ios/android; storeName = 'Apple Health' en iOS o 'Health Connect' en Android), 112-177 (interruptores y menú de borrado); métricas en SparkyFitnessMobile/src/WritebackMetrics.ts:3-14,44,54; se muestra en SparkyFitnessMobile/src/screens/SyncScreen.tsx:994
- **Teclado para el peso en ejercicios de peso corporal (series asistidas o lastradas con signo)** — iOS abre el teclado completo de números y puntuación, que no es un teclado numérico, para poder escribir '-'. Android usa el teclado 'numeric', que ya incluye el signo menos. En ejercicios que no son de peso corporal, las dos usan 'decimal-pad'.
  - Evidencia: SparkyFitnessMobile/src/components/ActiveWorkoutSetRow.tsx:1047-1053 (comentario: "iOS's decimal pad has no minus key"; iOS 'numbers-and-punctuation', Android 'numeric'); SparkyFitnessMobile/src/components/EditableSetRow.tsx:345-351 (misma lógica)
- **Arrastrar el contenido de las hojas inferiores para moverlas o cerrarlas** — En iOS se puede arrastrar cualquier parte del contenido para bajar o cerrar la hoja. En Android solo el tirador superior o un toque en el fondo la cierran, porque el gesto sobre el contenido está desactivado para no interferir con las ruedas de hora (FlatList). FastingProtocolSheet también usa android_keyboardInputMode="adjustPan" (línea 234) solo en Android.
  - Evidencia: enableContentPanningGesture={Platform.OS !== 'android'} en SparkyFitnessMobile/src/components/: MealTypeFormSheet.tsx:161, ExerciseSetRestSheet.tsx:197, MealTypeTimePickerSheet.tsx:92, CopyMealSheet.tsx:182, TimeSheet.tsx:138, DateRangeSheet.tsx:108, CalendarSheet.tsx:329, medications/WeekdaySheet.tsx:60, FastingEditSheet.tsx:301, FastingProtocolS…
- **Botón/gesto Atrás de Android con una hoja inferior abierta** — Solo afecta a Android, porque iOS no tiene botón Atrás. Con AddSheet o ActionSheet, Atrás cierra la hoja. Con las demás hojas listadas, según el propio comentario del código, Atrás pasa a la navegación con la hoja todavía abierta: cierra la pantalla de debajo, cambia de pestaña o sale de la app.
  - Evidencia: SparkyFitnessMobile/src/components/ui/sheetChrome.tsx:42-65 (useSheetHardwareBack; el comentario explica que BottomSheetModal no gestiona Atrás y la pulsación 'pops the screen under the sheet, switches another tab to the Dashboard, or exits the app'). Solo lo usan AddSheet.tsx y ActionSheet.tsx (grep). Ninguna de las hojas listadas (MealTypeFormSh…
- **Barra de pestañas inferior con botón flotante 'Añadir'** — Android y iOS anteriores a 26 usan siempre CustomTabBar. En iOS 26+ con el ajuste Liquid Glass activado se usan las pestañas nativas (NativeTabsLayout) en su lugar. Dentro de CustomTabBar solo cambia la sombra del botón '+' (shadow en iOS, elevation:4 en Android), que es estética.
  - Evidencia: SparkyFitnessMobile/src/components/CustomTabBar.tsx:85-110 (botón Añadir; sombra Platform.select ios/android); la usa FallbackTabsLayout en SparkyFitnessMobile/src/components/TabsLayout.tsx:363-368; la elección está en TabsLayout.tsx:431-450 (useNativeIOSTabsActive) y SparkyFitnessMobile/src/services/nativeTabBarPreference.ts:11-14
- **Cabecera de los formularios a pantalla completa (Cancelar / Guardar)** — En iOS se usa la cabecera nativa de la pila, salvo en iOS 26+ con Liquid Glass desactivado; en ese caso hay una cabecera dibujada por la pantalla y sin margen superior extra, porque son hojas modales. En Android siempre se usa la cabecera dibujada por la pantalla, con margen superior igual a la barra de estado. Los controles son los mismos.
  - **Actualizado en la PR #3200 (fusionada):** En iOS 26+ con Liquid Glass desactivado, la cabecera dibujada por la pantalla recibe ya también el margen superior de la barra de estado, con la misma regla que en Android; dentro de una hoja modal iOS no indica margen superior, así que las hojas siguen sin margen extra. Con la cabecera nativa de iOS no cambia nada.
  - Evidencia: SparkyFitnessMobile/src/components/FormScreenChrome.tsx:103-127 (useNativeIOSHeadersActive; paddingTop: insets.top solo en Android); SparkyFitnessMobile/src/services/nativeTabBarPreference.ts:23-27
- **DevTools: generar entrenamientos de prueba con más datos ('Rich Workout' / 'Rich Strength')** — Android genera el entrenamiento con ruta, FC y vueltas (laps); iOS lo genera con ruta y FC, sin vueltas. 'Rich Strength (Spiky HR)' existe en las dos con implementaciones distintas (Health Connect frente a HealthKit). Los botones 7/14/30 días, '1 año (pasos)' y 'Datos antiguos' son comunes.
  - Evidencia: SparkyFitnessMobile/src/components/DevTools.tsx:522-555 (Android: seedRichWorkout '(Route+HR+Laps)' y seedRichStrengthWorkout, de services/seedHealthData), 558-590 (iOS: seedRichWorkoutIOS '(Route+HR)' y seedRichStrengthWorkoutIOS, de services/seedHealthDataIOS); solo en builds de desarrollo (SettingsScreen.tsx:421-425)
- **Diferencias visuales y técnicas menores entre iOS y Android** — Todas son estéticas, de maquetación o de robustez del teclado y la ventana. Ninguna añade ni quita opciones al usuario. La (8) evita cuadros vacíos en las etiquetas de ejes en chino, japonés o coreano en iOS.
  - Evidencia: SparkyFitnessMobile/src/components/: (1) Icon.tsx:206-252; (2) CompletionCheck.tsx:61-80; (3) wellness/pregnancy/WeeklyChecklist.tsx:197, medications/DoseRow.tsx:217,224; (4) FoodForm.tsx:127-130,1153, FoodUnitSelectorSheet.tsx:52-55,402,467; (5) CustomTabBar.tsx:96-108; (6) SetRowChrome.tsx:154-198,229; (7) chat/ToolCallCard.tsx:36,145,154; (8) c…
- **Aviso 'No es consejo médico' siempre visible en Sincronización (solo Android)** — Android muestra el aviso siempre a la vista, además de dentro de 'Learn more'. En iOS solo se ve al desplegar 'Learn more' en la tarjeta 'Datos de salud a sincronizar'.
  - Evidencia: SparkyFitnessMobile/src/screens/SyncScreen.tsx:961-975 ({Platform.OS === 'android' && <Text>…notMedicalAdvice…</Text>}). En las dos plataformas el texto aparece también dentro del bloque 'Learn more' de SparkyFitnessMobile/src/components/HealthDataSync.tsx:191-207.
- **Activar 'Sincronización en segundo plano': permiso de Health Connect (Android) frente a observadores de HealthKit (iOS)** — Android exige un permiso adicional de Health Connect y puede bloquear la activación. iOS no pide permiso extra, registra observadores de HealthKit que disparan la sincronización cuando el sistema lo permite y muestra la nota iosNote (SyncFrequency.tsx:38-45).
  - Evidencia: SparkyFitnessMobile/src/screens/SyncScreen.tsx:293-331: en Android se pide BackgroundAccessPermission; si se deniega, aparece la alerta 'Permission Required' y el interruptor no se activa. 334-358: en iOS se llama a startObservers, que lanza performBackgroundSync('healthkit-observer') con datos nuevos, y al apagar se llama a stopObservers (360-364…
- **Barra de entrenamiento activo, barra de descanso y botones de la cabecera del entrenamiento con estilo Liquid Glass (iOS 26+)** — En iOS 26+ con el ajuste Liquid Glass activado (useNativeIOSTabsActive), las barras son píldoras flotantes de vidrio sobre la barra nativa. En Android y en iOS anteriores son barras opacas a lo ancho, integradas en CustomTabBar. Los controles y la información son los mismos.
  - Evidencia: SparkyFitnessMobile/src/components/ActiveWorkoutBar.tsx:397-408 (sobre la barra de pestañas nativa si usesNativeTabs), 934-960 (barra clásica a lo ancho con borde superior si !usesNativeTabs) y 962-1054 (píldora flotante LiquidGlassSurface con los mismos controles). ActiveWorkoutRestBar.tsx:86,306-326 (píldora 'glass' interactiva). ActiveWorkoutHe…
- **Cabecera de las pantallas de informes del móvil (nativa en iOS, dibujada por la pantalla en Android)** — En iOS se usa la cabecera nativa de la pila, salvo en iOS 26+ con Liquid Glass desactivado. En Android, la cabecera la dibuja la pantalla con margen de barra de estado. Los controles (selector de rango, contenido) son los mismos.
  - Evidencia: SparkyFitnessMobile/src/components/reports/ReportScreenLayout.tsx:36-41 (useNativeIOSHeadersActive; paddingTop: insets.top solo si no hay cabecera nativa). SparkyFitnessMobile/src/services/nativeTabBarPreference.ts:23-27.

**Diferencias iOS/Android: pantallas**

- **Selector de idioma de la app** — iOS: no se puede elegir el idioma dentro de la app; la fila abre los Ajustes de iOS (idioma por app) y el cambio se aplica cuando el sistema reinicia la app. Android: BottomSheetPicker dentro de la app que cambia el idioma al momento (en Android 13+ usa LocaleManager nativo; en Android 12 o anterior, una preferencia local de i18next) y se sincroniza con los cambios externos de 'App Languages'.
  - Evidencia: SparkyFitnessMobile/src/screens/AppSettingsScreen.tsx:52-53 (isIOS / getNativeIOSLanguage), 101-111 (opciones del selector), 113-131 (openIOSLanguageSettings -> Linking.openSettings), 165-209 (fila iOS testID ios-language-row frente a BottomSheetPicker en Android); src/hooks/useAppLanguageForegroundSync.ts:6-30; App.tsx:315-322
- **Origen de la sincronización de salud (Apple Health frente a Health Connect)** — Funciona en las dos plataformas, pero con almacenes de salud distintos: HealthKit en iOS (src/services/healthConnectService.ios.ts) y Health Connect en Android (healthConnectService.ts). Los permisos se gestionan en la app Salud de iOS o en los ajustes de Health Connect.
  - Evidencia: SparkyFitnessMobile/src/screens/SyncScreen.tsx:190-197 (healthSettingsName), 900-910 (mensaje de no disponible Health Connect/HealthKit), 943 (HealthSourceLabel); src/components/HealthSourceLabel.tsx:12-15; src/components/HealthDataSync.tsx:63-84 (resumen y detalle por plataforma; en iOS incluye la ruta Ajustes -> Salud -> Acceso a datos)
- **Sincronización en segundo plano de datos de salud** — Android: exige conceder el permiso de lectura en segundo plano de Health Connect al activarlo y se ejecuta como tarea periódica de unas 4 h. iOS: además de la tarea en segundo plano, registra observadores de HealthKit que disparan una sincronización cuando llegan datos nuevos (background delivery). La frecuencia la decide el sistema.
  - Evidencia: SparkyFitnessMobile/src/screens/SyncScreen.tsx:293-330 (en Android pide el permiso BackgroundAccessPermission de Health Connect y lo bloquea si se deniega), 337-367 (en iOS arranca y detiene los observadores de HealthKit con startObservers/stopObservers); src/components/SyncFrequency.tsx:38-45 (nota solo de iOS: 'se actualizará en segundo plano cu…
- **Aviso 'No es consejo médico' en Sync** — Solo se muestra en Android, probablemente por los requisitos de Health Connect / Google Play. iOS no lo muestra.
  - Evidencia: SparkyFitnessMobile/src/screens/SyncScreen.tsx:960-975 ({Platform.OS === 'android' && ...})
- **Escritura de nutrición e hidratación en el almacén de salud (writeback)** — Misma funcionalidad en las dos plataformas. Solo cambia el destino (Apple Health o Health Connect) y los textos de confirmación de borrado, que nombran ese almacén.
  - Evidencia: SparkyFitnessMobile/src/screens/SyncScreen.tsx:513-515 (writebackStoreName), 520-590 (borrado total o por rango), 994-1003; src/components/HealthDataWriteback.tsx:54-62; src/WritebackMetrics.ts:3-7 (compatible con las dos plataformas: Health Connect en Android, HealthKit en iOS)
- **Controles de la grabación en la pantalla de bloqueo** — iOS: Live Activity interactiva (pantalla de bloqueo y Dynamic Island) con métricas en vivo y botones de Pausa/Reanudar y Vuelta, también para carreras hechas con el reloj. Android: solo una notificación fija del servicio en primer plano con el texto 'Grabando tu actividad / Registrando tu carrera con GPS', sin métricas ni botones.
  - Evidencia: SparkyFitnessMobile/src/services/runLiveActivity.ios.ts:43-48 (Live Activity en pantalla de bloqueo y Dynamic Island con distancia, ritmo y FC, y botones Pausar/Reanudar y Vuelta); src/services/runLiveActivity.ts:1-13 (no-op en Android); src/services/gpsRecordingService.ts:1111-1133 (notificación de servicio en primer plano en Android); src/utils/…
- **Estimación de distancia por pasos en sesiones de interior (cinta)** — iOS consulta el historial de pasos al terminar, así que no hace falta nada activo durante la sesión. Android guarda el contador de hardware al empezar. Si el teléfono se reinicia durante la sesión o no se pudo leer al inicio, no hay estimación y el campo de distancia queda vacío.
  - Evidencia: SparkyFitnessMobile/src/services/stepCounter.ts:40-50 (captureStepCounterBaseline solo en Android), 52-95 (iOS consulta Pedometer.getStepCountAsync para la ventana de la sesión; Android resta el contador desde el arranque); src/hooks/useIndoorDistanceEstimate.ts; modules/step-counter/expo-module.config.json ('platforms': ['android'])
- **Sonido del temporizador de descanso 'a través del modo silencio'** — iOS: el aviso suena también con la app en segundo plano o la pantalla bloqueada, porque una pista silenciosa mantiene viva la sesión de audio. Android: el aviso suena en silencio o vibración solo con la app abierta; en segundo plano el aviso es el sonido de la notificación de descanso.
  - Evidencia: SparkyFitnessMobile/src/screens/WorkoutSettingsScreen.tsx:154-181 (subtítulo distinto para iOS y Android); src/services/sounds.ts:37-45 (isBackgroundRestChimeEnabled solo en iOS), 49-56, 64-90 (shouldPlayInBackground solo en iOS)
- **Dictado por voz en el chat de Sparky** — Android activa el cambio automático de idioma del reconocedor (EXTRA_ENABLE_LANGUAGE_SWITCH 'balanced'), así que puede detectar otro idioma mientras se dicta. iOS reconoce solo en el idioma resuelto de la app. El manejo del teclado también es distinto, pero solo cambia la presentación.
  - Evidencia: SparkyFitnessMobile/src/screens/ChatScreen.tsx:570-586 (ExpoSpeechRecognitionModule.start; en Android añade androidIntentOptions EXTRA_ENABLE_LANGUAGE_SWITCH: 'balanced'), 108-114 (en iOS usa el KeyboardAvoidingView de RN; en Android el de react-native-keyboard-controller)
- **Accesos rápidos del icono de la app (pulsación larga)** — En Android no se registran accesos rápidos (shortcuts del launcher).
  - **Actualizado en la PR #2989 (fusionada):** Android registra ya Escanear comida, Registrar comida y Ayuno con el mismo hook useQuickActions (montado por QuickActionsGate en App.tsx), y abren las mismas pantallas que en iOS. Registrar agua sigue siendo el atajo nativo: toma la etiqueta de la misma cadena quickActions que iOS, registra en segundo plano sin abrir la app y avisa solo en inglés. El plugin withQuickActionLaunchGuard evita que la pantalla de un atajo se vuelva a abrir sola cuando Android restaura la app después de haberla cerrado en segundo plano.
  - Evidencia: SparkyFitnessMobile/App.tsx:214-224 (QuickActionsGate, comentario 'Home Screen long-press shortcuts (iOS)'), 480; src/hooks/useQuickActions.ts:26-49 (elementos), 52-60 (logWaterDrink), 135-156 (return si Platform.OS !== 'ios')
- **Textos y ayudas específicos de plataforma (agrupados, sin cambio de capacidad)** — Solo cambia el texto y la funcionalidad es la misma. La nota de BMR en iOS solo aparece con 'Usar BMR medido' activado.
  - Evidencia: SparkyFitnessMobile/src/screens/PasskeySettingsScreen.tsx:47-60 ('Face ID, Touch ID o PIN' y 'Mi iPhone' frente a 'huella, desbloqueo facial o PIN' y 'Mi teléfono Android'); src/screens/CalorieSettingsScreen.tsx:918-925 (nota solo de iOS: la 'Energía en reposo' de Apple Health ya incluye actividad ligera, se sugiere Nivel de actividad Ninguno ×1.0…
- **Diferencias visuales de navegación y presentación (agrupadas)** — Solo cambia la presentación. En Android, el menú de un servidor no activo muestra 3 botones (Activar, Configurar, Eliminar) sin 'Cancelar', por el límite de botones de Alert en Android; en iOS añade 'Cancelar'. Las mismas acciones están disponibles en las dos plataformas.
  - **Actualizado en la PR #3190 (fusionada):** Las pantallas de fotos de progreso, comparación y timelapse añaden ahora el margen superior del área segura siempre que no se usa la cabecera nativa de iOS, es decir, en Android y en iOS 26 con la navegación Liquid Glass desactivada, en lugar de solo en Android. Las demás pantallas que cita la fila siguen añadiéndolo solo en Android, y las demás diferencias de presentación no cambian.
  - Evidencia: SparkyFitnessMobile/App.tsx:373-395 (createIOSSmallNativeHeaderOptions frente a headerShown:false), 191-192 y 685-1264 (modales slide_from_bottom en Android), 401-410 (NavigationBar.setStyle solo en Android), 518 (headerTintColor en Android), 1335-1337 (Toast dentro de FullWindowOverlay en iOS); paddingTop con los insets solo en Android en DailyNu…
- **Interruptores de métricas visibles en iOS que no leen datos (Masa ósea, Empujes en silla de ruedas, Periodo menstrual)** — Android: funcionan con Health Connect. iOS: el interruptor se ve y se puede activar, pero la lectura siempre devuelve 0 registros.
  - Evidencia: src/HealthMetrics.ts:492-505 (boneMass sin platforms), 435-446 (wheelchairPushes sin platforms), 665-675 (menstruationPeriod con platforms ['ios'], recordType 'MenstruationPeriod'); src/services/healthkit/index.ts:232-298 (HEALTHKIT_TYPE_MAP no tiene BoneMass, WheelchairPushes ni MenstruationPeriod), 1929-1932 (si no hay identificador, devuelve { …
- **Variabilidad de la frecuencia cardíaca: SDNN en iOS y RMSSD en Android** — Misma fila en la interfaz, pero distinta métrica y distinto tipo enviado al servidor según la plataforma.
  - **Actualizado en las PR #3019 y #3100 (fusionadas):** El interruptor controla ahora también la HRV nocturna que se adjunta a las noches sincronizadas: la media de SDNN durante el sueño en iOS y la de RMSSD en Android. Las dos van al mismo campo de HRV nocturna, que no guarda el tipo y que muestran los informes de sueño de la web y del móvil, así que esos valores también dependen de la plataforma.
  - Evidencia: src/HealthMetrics.ts:387-401 (recordType HeartRateVariabilitySDNN, type 'HRV_SDNN', platforms ['ios']), 404-418 (recordType HeartRateVariabilityRmssd, type 'HRV', platforms ['android']); src/services/healthkit/index.ts:249.
- **Mapa real bajo la ruta GPS (grabación, resumen y sesión de cardio)** — iOS siempre muestra el mapa (Apple Maps). Android solo lo muestra si la app se compiló con una clave de Google Maps. Sin ella, dibuja solo la línea de la ruta sin mapa de fondo.
  - Evidencia: src/utils/routeMapSupport.ts:8-20 (canShowRouteMap: iOS siempre, con Apple Maps; Android solo si la build tiene GOOGLE_MAPS_ANDROID_API_KEY); src/components/exerciseStats/RouteMap.tsx:13-17 (RouteTileMap frente a RouteLine); se usa en src/screens/RecordActivityScreen.tsx:1525, RunSummaryScreen.tsx:476 y CardioSessionScreen.tsx:298; app.config.ts:2…
- **Entreno de fuerza activo en la pantalla de bloqueo (Live Activity o notificación)** — iOS: Live Activity interactiva, con botones para sumar o restar 15 s al descanso, saltarlo y completar la serie. Android: notificación promocionada de solo lectura, con barra de progreso y temporizador. Tocarla abre la app.
  - Evidencia: iOS: src/services/workoutLiveActivity.ios.ts:36-70 (Live Activity en pantalla de bloqueo y Dynamic Island, botones rest-add-15, rest-subtract-15, rest-skip y complete-set) y src/services/WorkoutLiveActivityLayout.tsx. Android: src/services/workoutLiveActivity.android.ts:1-40 y targets/android-workout-notification/kotlin/com/sparkyapps/sparkyfitnes…

**Diferencias iOS/Android: servicios y hooks**

- **Accesos rápidos del icono de la app (pulsación larga en Home Screen / launcher)** — iOS ofrece 4 accesos (Escanear alimento, Registrar alimento, Registrar agua sin abrir la app, Ayuno). Android no usa expo-quick-actions: únicamente expone 'Registrar agua' como shortcut del launcher (WorkManager hace el POST sin abrir la app).
  - **Actualizado en la PR #2989 (fusionada):** useQuickActions ya funciona también en Android: registra Escanear comida, Registrar comida y Ayuno con expo-quick-actions, después vuelve a poner el atajo nativo Registrar agua, que ese registro elimina, y repite los dos pasos al cambiar de idioma. Solo ejecuta las acciones que ha registrado, así que en Android otra app no puede lanzar a través de MainActivity la acción JS de registrar agua. Registrar agua sigue siendo distinto: Android registra la toma con WorkManager sin abrir la app, mientras que iOS abre la app y ejecuta logWaterDrink.
  - Evidencia: iOS: SparkyFitnessMobile/src/hooks/useQuickActions.ts:26-49 define 4 acciones (scan-food, search-food, log-water, fasting) y :136-154 las registra con expo-quick-actions (early return si Platform.OS !== 'ios' en :142); se activa en App.tsx:221. Android: solo el acceso directo dinámico 'Log water' publicado por targets/android-background-water/kotl…
- **Widget de calorías en pantalla de inicio** — Android: Glance con botones de búsqueda/escaneo y refresco también desde segundo plano; deduplica por contenido del snapshot. iOS: WidgetKit, incluye variantes de pantalla de bloqueo, y solo se actualiza cuando la app en primer plano tiene el resumen de hoy (sin refresco desde background sync).
  - **Sigue pendiente:** El widget de Android sigue mostrando solo las calorías restantes con una barra de progreso. Su instantánea solo lleva remaining, goal y progress, sin comido ni quemado. Las variantes de pantalla de bloqueo siguen siendo solo de iOS, e iOS sigue actualizando este widget solo mientras la app está en primer plano. La PR #3228, aún sin fusionar, añade lo comido y lo quemado a la instantánea de Android y los muestra en los tamaños grandes.
  - Evidencia: iOS: useWidgetSync.ts:63-122 escribe 'calorieSnapshot' en ExtensionStorage (App Group) y recarga el kind 'widget'; targets/widget/widgets.swift:201-207 soporta familias accessoryCircular/Rectangular/Inline (pantalla de bloqueo) y systemSmall. Android: useWidgetSync.ts:134-158 -> androidWidgetSyncService.ts:74-82 -> CalorieWidgetBridge.ts:22-37 (Na…
- **Widget de macronutrientes** — Android muestra barras por macro con progreso hacia cada objetivo (#2228); iOS dibuja un anillo de composición (las tres proporciones suman 1) y no recibe objetivos (comentario en useWidgetSync.ts:160-164).
  - Evidencia: iOS: useWidgetSync.ts:88-95 escribe 'macroSnapshot' (protein, carbs, fat, calories) sin objetivos y recarga 'macroWidget' (:121); targets/widget/macroWidget.swift:413. Android: useWidgetSync.ts:160-182 y androidWidgetSyncService.ts:34-62 incluyen proteinGoal/carbsGoal/fatGoal; MacroWidget.kt.tmpl.
- **Idioma de los widgets** — iOS: el locale lo decide el sistema (por app). Android 13+: LocaleManager es la autoridad y se pasa un caché de render; Android <=12: el widget guarda su propio override de idioma.
  - **Cubierto en parte por las PR #2989 y #3020 (fusionadas):** El hook de Android pasa a prepareWidgetLocale el idioma resuelto de la app (normalizeLanguage), deduplica con él y recarga los widgets de calorías, macros y agua, así que la limitación en/pl desaparece en Android. El hook de iOS (useIOSWidgetLanguageRefresh.ts) sigue reduciendo el idioma a en/pl, de modo que pasar de alemán a francés no fuerza allí ninguna recarga, y solo recarga los timelines de calorías y macros, no el widget de agua ni los controles.
  - Evidencia: iOS: hooks/useIOSWidgetLanguageRefresh.ts:51 (solo iOS) solo recarga las timelines 'widget' y 'macroWidget'; el widget resuelve su locale nativo. Android: hooks/useWidgetLanguageRefresh.ts:36-90 (solo Android) llama CalorieWidgetBridge.prepareWidgetLocale(preference, effectiveLanguage) y luego recarga ambos widgets; targets/android-widget/.../Widg…
- **Cabeceras de pantalla, iconos y menús de acciones** — iOS usa cabecera nativa (menús UIMenu, badges nativos, título grande); Android (e iOS 26 con Liquid Glass desactivado) usa cabecera dibujada por la pantalla con menú anclado. En Liquid Glass el botón Guardar no lleva acento.
  - Evidencia: hooks/useScreenHeader.tsx:739-790 (solo iOS: unstable_headerLeftItems/RightItems nativos y menús nativos con SF Symbols, :360-398), :415-424 (RawHeaderIcon: SymbolView en iOS, Ionicons en Android), :583 (useNativeIOSHeadersActive); en Android se renderiza la barra propia con HeaderBarButton y AnchoredMenu. hooks/useHeaderActionColors.ts:5-25 (iOS …
- **Inicio de sesión y registro de passkeys (navegador del sistema)** — iOS siempre usa la sesión de autenticación del sistema. En Android se fuerza un navegador compatible con passkeys (los firmados por F-Droid, p. ej. Fennec, no soportan passkeys); si no hay ninguno instalado se usa el predeterminado y puede fallar.
  - Evidencia: services/api/authService.ts:709-764 getPasskeyBrowserPackage (solo Android: si el navegador por defecto no está en la lista Chrome/Firefox/Samsung Internet/Edge, abre la ceremonia en uno de ellos vía Custom Tabs); usado en loginWithPasskey (:766-790) y addPasskey (:929-955).
- **Sonido de fin de descanso en silencio y en segundo plano** — iOS: el sonido suena aunque esté en silencio, con la app en segundo plano o la pantalla bloqueada. Android: suena aunque esté en silencio/vibración, pero solo en primer plano; en segundo plano el aviso es el sonido de la notificación.
  - Evidencia: services/sounds.ts:37-45 (isBackgroundRestChimeEnabled solo iOS), :66-91 (modo de audio; shouldPlayInBackground solo iOS), :309-344 (pista silenciosa keep-alive para mantener viva la sesión de audio en iOS); notifications.ts:225-236 (el ping de la notificación lleva el aviso cuando la app no está activa); screens/WorkoutSettingsScreen.tsx:153-181 …
- **Avisos de voz durante la grabación GPS con pantalla bloqueada** — iOS abre la sesión de audio en background (categoría de reproducción); Android depende del foreground service de ubicación que mantiene la app viva. Resultado similar para el usuario, mecanismo distinto.
  - Evidencia: services/sounds.ts:73-78 (shouldPlayInBackground si recordingCueSessionActive && Platform.OS === 'ios'); app.config.ts:247-266 (expo-location: isAndroidForegroundServiceEnabled true; modo background 'location' en iOS).
- **Selector de voz y sugerencia de voces de mayor calidad** — Solo cambia la ayuda: iOS remite a Ajustes > Accesibilidad > Leer y hablar > Voces; Android a los ajustes de texto a voz del teléfono. Las niveles de voz dependen del motor TTS de cada sistema.
  - Evidencia: hooks/useSpeechVoiceChoices.ts:72-83 (texto de ayuda distinto por plataforma); usado en components/GuidedWorkoutSettingsSection.tsx:54 y components/recording/RecordingVoiceCard.tsx:22.
- **Mapa de la ruta en actividades de cardio** — iOS usa Apple Maps sin clave. Android solo muestra mapa si la build se compiló con clave de Google Maps; si no, muestra únicamente la línea de la ruta sin mapa de fondo.
  - Evidencia: utils/routeMapSupport.ts:15-20 (iOS siempre; Android solo si extra.androidGoogleMapsEnabled); components/exerciseStats/RouteMap.tsx:17 (RouteTileMap vs RouteLine); app.config.ts:20-21,296-302,322 (GOOGLE_MAPS_ANDROID_API_KEY).
- **Pasos del teléfono para caminatas/carreras interiores y aprendizaje de zancada** — iOS consulta el historial de pasos al terminar (permiso Movimiento y forma física), no necesita nada durante la sesión. Android guarda el contador al empezar (permiso Reconocimiento de actividad); un reinicio del teléfono invalida la medición (devuelve null).
  - Evidencia: services/stepCounter.ts:40-50 (captureStepCounterBaseline solo Android) y :63-92 (Android resta el contador hardware desde el arranque; iOS consulta Pedometer.getStepCountAsync de la ventana); modules/step-counter; consumidores services/gpsRecordingService.ts:1188 y services/stepDistance.ts:43; app.config.ts:258-262 (texto de Motion & Fitness en i…
- **Actividad en vivo del entrenamiento y de carreras** — Entrenamiento: iOS Live Activity (Dynamic Island/pantalla de bloqueo) vs Android notificación en curso. Carrera GPS/reloj: Live Activity solo en iOS; Android no tiene tarjeta en vivo de carrera desde este servicio.
  - Evidencia: hooks/useAppStartup.ts:85-101 inicializa initWorkoutLiveActivity e initRunLiveActivity; services/workoutLiveActivity.ios.ts:456 (Live Activity iOS) vs services/workoutLiveActivity.android.ts:21-30,162 (notificación persistente Android, targets/android-workout-notification); services/runLiveActivity.ios.ts:450 vs services/runLiveActivity.ts:1-13 (s…
- **Sincronización periódica en segundo plano** — Misma tarea en ambos, pero iOS decide cuándo ejecutarla (y se complementa con observadores HealthKit), no puede leer HealthKit con el teléfono bloqueado; Android usa WorkManager con intervalo más fiable, reconecta el cliente Health Connect una vez por ejecución y además actualiza los widgets.
  - Evidencia: services/backgroundSyncService.ts:382-396 (expo-background-task, minimumInterval 240 min: 'Android lo respeta aproximadamente, iOS lo trata como sugerencia'), :259-281 (Android: avisa de cliente Health Connect desconectado; iOS: detecta dispositivo bloqueado/base de datos inaccesible y no avanza el cursor), :132-141 (Android refresca widgets).
- **Importación de historial de salud (backfill)** — Android: requiere 'Permitir acceso a todos los datos anteriores' y está limitado por la cuota de API de Health Connect (las sondas por métrica ahorran cuota). iOS: historial ilimitado con la autorización normal, sin cuota, pero puede mostrar de nuevo la hoja de permisos.
  - Evidencia: services/backfillService.ts:151-157 (pide permiso de historial; si se deniega solo llega ~30 días), :225-241 (solo iOS: vuelve a pedir autorización HealthKit antes de leer porque los tipos no determinados lanzan error), :93-100 y :184 (cuota de Health Connect -> reanuda otro día); services/healthconnect/index.ts:141-175 (ReadHealthDataHistory); se…
- **Solicitud de permisos de salud** — En Android la app sabe si faltan permisos y puede informarlo; en iOS no puede saber si la lectura fue denegada (los datos simplemente llegan vacíos).
  - **Actualizado en las PR #2998 y #3059 (fusionadas):** Android sigue avisando de los permisos que faltan, y 'Activar todas las métricas de salud' conserva ahora las métricas cuyos permisos se concedieron todos, y avisa de que solo falta la escritura cuando únicamente se rechazaron permisos de escritura. iOS no puede saber qué se concedió, así que allí sigue activando todas las métricas o ninguna. Al abrir la pantalla de sincronización, iOS pregunta ahora a HealthKit si algún tipo activado no se ha solicitado nunca y solo entonces pide permiso, mientras que Android solo vuelve a pedirlo cuando una actualización de la app sube su versión de permisos guardada.
  - Evidencia: iOS services/healthkit/index.ts:313-470: alerta 'Health App Not Available' si no hay HealthKit (:316-326), en simulador no pide nada (:333-347), expande tipos (tensión sistólica/diastólica :359-381, telemetría de entrenamientos :382-394, calorías totales = basal+activa :395-405, nutrición = tipos dietéticos :406-425) y devuelve true aunque el usua…
- **Telemetría de entrenamientos importados (series, vueltas y distancia)** — iOS añade dinámica de carrera (GCT, oscilación vertical, zancada) que Android no lee; Android añade cadencia de pasos que iOS no lee. iOS asigna muestras exactas del entrenamiento; Android las correlaciona por ventana de tiempo con límite de densidad.
  - **Actualizado en las PR #3065 y #3078 (fusionadas):** La sincronización de iOS envía ya dos datos por entrenamiento que la de Health Connect no envía: la valoración de esfuerzo de 1 a 10 que la propia persona ha guardado en Apple Health (se ignora la estimación automática de Apple), que se guarda como workout_effort, y, en iOS 27, el tiempo que el propio Apple ha contado en cada una de las cinco zonas de frecuencia cardiaca, que el servidor guarda en lugar de calcularlo. En los demás casos, y siempre en Android, el servidor calcula el tiempo en cada zona a partir de la serie de frecuencia cardiaca con los ajustes de zonas de la persona. Las diferencias de series, vueltas y distancia descritas aquí no cambian.
  - Evidencia: iOS services/healthkit/workoutTelemetry.ts:64-108 (FC, RunningSpeed/CyclingSpeed, RunningPower/CyclingPower, CyclingCadence, tiempo de contacto, oscilación vertical, longitud de zancada) con predicado por workout; vueltas desde eventos del HKWorkout (:251-286, :399-400); distancia probando walking/running, cycling, swimming, wheelchair y nieve (se…
- **Escritura de nutrición en la tienda de salud (writeback)** — Las grasas trans solo se escriben en Android. En Apple Health cada alimento aparece agrupado como correlación 'Food'. La hidratación se exporta igual en ambos (una muestra por bebida manual + resto de agua de alimentos a mediodía).
  - Evidencia: WritebackMetrics.ts:14,42-63 (solo nutrition e hydration en ambos); iOS services/healthkit/writebackMappers.ts:38-41 (sin trans_fat), :225-245 (una correlación HKCorrelationTypeIdentifierFood por alimento con nombre y comida) y services/healthkit/writeback.ts:55,67,78 (seguimiento por UUID, autorización por tipo); Android services/healthconnect/wr…
- **Lectura de nutrición desde la tienda de salud** — iOS no puede leer grasas trans (no hay identificador HealthKit). Las métricas iOS sueltas 'Dietary Fat Total', 'Dietary Protein' y 'Dietary Sodium' están definidas pero deshabilitadas (HealthMetrics.ts:721-768, enabled:false).
  - Evidencia: HealthMetrics.ts:144-158 (nutrition en ambas plataformas, rollingLookbackDays 2); iOS services/healthkit/dataTransformation.ts:125-139 (inverso de DIETARY_HK_MAP, sin grasas trans) y handleNutrition (services/healthkit/index.ts:1782); Android services/healthconnect/dataTransformation.ts:605 (recorre HC_NUTRIENT_COLUMNS de services/shared/dataTrans…
- **Métrica: Distancia diaria** — En iOS la distancia diaria solo cuenta caminar/correr (no ciclismo, natación ni silla de ruedas); en Android incluye todos los DistanceRecord.
  - Evidencia: HealthMetrics.ts:256 (ambas plataformas); iOS services/healthkit/index.ts:509-513 y :251 (solo HKQuantityTypeIdentifierDistanceWalkingRunning); Android services/healthconnect/index.ts:1253-1267 (agregado DISTANCE de DistanceRecord).
- **Métricas: calorías activas, calorías totales y metabolismo basal** — Mismas métricas visibles, pero fuentes y cálculo distintos; los valores pueden no coincidir entre un iPhone y un Android para el mismo usuario.
  - Evidencia: HealthMetrics.ts:69,88,201; iOS: total = basal + activa (services/healthkit/index.ts:700-725), BMR = suma diaria de energía en reposo con fecha del día siguiente (services/healthkit/provider.ts:26-36; index.ts:782). Android: total nativo con timestamp de captura (services/healthconnect/provider.ts:42-63), activas con fallback total − basal en días…
- **Métrica: Variabilidad de la frecuencia cardiaca (HRV)** — iOS envía SDNN y Android RMSSD con tipos de servidor distintos; no son comparables entre dispositivos.
  - **Actualizado en las PR #3019 y #3100 (fusionadas):** La sincronización de HRV alimenta ahora también el sueño: con el interruptor de HRV activado, las noches sincronizadas llevan avg_overnight_hrv, la media de SDNN de HealthKit durante el sueño en iOS y la de RMSSD de Health Connect en Android. El servidor guarda las dos en el mismo campo sin indicar el tipo, así que la HRV nocturna de los informes de sueño tampoco se puede comparar entre dispositivos.
  - Evidencia: HealthMetrics.ts:387 (iOS: HeartRateVariabilitySDNN, type 'HRV_SDNN', permiso :398) y :404 (Android: HeartRateVariabilityRmssd, type 'HRV'); services/healthkit/index.ts:249; services/healthconnect/dataTransformation.ts:265; app.config.ts:51.
- **Métrica: Cadencia de pedaleo** — Existe en ambos pero como métricas distintas (id, tipo de servidor y categoría diferentes).
  - Evidencia: HealthMetrics.ts:535 (Android: CyclingPedalingCadence, type cycling_pedaling_cadence; app.config.ts:40; healthconnect/dataTransformation.ts:855) y :956 (iOS: CyclingCadence, type cycling_cadence, categoría Cycling; services/healthkit/index.ts:274).

**Autenticación y seguridad de cuenta**

- **Inicio de sesión con passkey** — Android: getPasskeyBrowserPackage (authService.ts:705-760) abre la ceremonia en un navegador de una lista permitida (Chrome, Firefox, Samsung Internet, Edge) cuando el predeterminado puede no soportar passkeys (por ejemplo, Fennec de F-Droid). iOS: siempre la sesión de navegador del sistema (devuelve undefined).
  - Evidencia: SparkyFitnessMobile/src/screens/OnboardingScreen.tsx:367-401, 885-916; src/components/ServerConfigModal.tsx:468; src/components/ReauthModal.tsx:285, 620-635; src/services/api/authService.ts:766-843 (loginWithPasskey)
- **Registrar una nueva passkey** — Android elige un navegador con soporte de passkeys de la lista permitida (authService.ts:705-760); iOS usa el navegador del sistema. Los textos también cambian: 'Face ID, Touch ID o PIN' y 'My iPhone' en iOS frente a 'huella, desbloqueo facial o PIN' y 'My Android Phone' en Android (PasskeySettingsScreen.tsx:46-59).
  - Evidencia: SparkyFitnessMobile/src/screens/PasskeySettingsScreen.tsx:170-232 (validación de nombre y SESSION_NOT_FRESH en 210-216), 418-443, 466-515 (modal de nombre), 519-526 (ReauthModal); src/services/api/authService.ts:888-975 (register-ticket + register-passkey)
- **Servidores en LAN y certificados autofirmados** — Android (producción) confía en los certificados CA instalados por el usuario, así que un certificado autofirmado funciona tras instalar su CA. iOS pide el permiso de 'Red local' y solo confía en la cadena del sistema (un certificado propio necesita instalar y marcar como de confianza un perfil).
  - Evidencia: SparkyFitnessMobile/plugins/withNetworkSecurityConfig.ts (Android: cleartextTrafficPermitted=false y confianza en CAs de sistema y de usuario); app.config.ts:134 (solo en producción), 171-188 (iOS: NSLocalNetworkUsageDescription y NSAppTransportSecurity con NSAllowsArbitraryLoads false)

**Administración y recursos de desarrollador**

- **Pantalla 'Novedades' con tarjetas de funcionalidades** — La tarjeta 'A Liquid Glass look' solo aparece en iOS 26+ con APIs de cristal (WhatsNewScreen.tsx:567-568, :615-637; canUseLiquidGlass en src/utils/liquidGlass.ts:9-10 devuelve false fuera de iOS). Android y iOS antiguos ven una tarjeta menos.
  - Evidencia: SparkyFitnessMobile/src/screens/WhatsNewScreen.tsx:559-690 (features con CTA a MedicationsList, AppSettings, Chat, FoodScan); fila en src/screens/SettingsScreen.tsx:381-388; ruta App.tsx:1121-1125
- **Banner de novedades en la barra de pestañas** — En iOS con pestañas nativas (Liquid Glass) se muestra con presentación 'glass' superpuesta en cada escena (NativeTabsBannerOverlay); en Android y en iOS sin pestañas nativas se renderiza en estilo 'legacy' dentro de la barra personalizada.
  - Evidencia: SparkyFitnessMobile/src/components/WhatsNewBanner.tsx:38-89 (estado/elegibilidad), :94-200 (presentaciones legacy/glass); src/components/TabsLayout.tsx:104-127, :256-259, :365; src/services/whatsNewBanner.ts:7, :39-42

**Diario de comidas y registro diario**

- **Navegación de fecha (anterior/siguiente/Hoy/calendario)** — iOS 26+ con Liquid Glass: los controles de fecha se dibujan como items nativos de la cabecera (utils/nativeHeaderDatePicker.ts, services/nativeTabBarPreference.ts:25 sólo iOS). Android/iOS antiguo: barra DateNavigator propia. En Android el botón Atrás del sistema no cierra CalendarSheet (BottomSheetModal sin useSheetHardwareBack) y navega por debajo.
  - Evidencia: SparkyFitnessMobile/src/components/DateNavigator.tsx:60-95; CalendarSheet.tsx; DiaryScreen.tsx:173-232 (cabecera nativa iOS), 801-817 (DateNavigator), 782-787/828-833 (CalendarSheet)
- **Ajuste rápido de porción desde la fila** — En Android el botón Atrás no cierra ServingAdjustSheet (BottomSheetModal sin useSheetHardwareBack). No disponible para componentes de comidas registradas.
  - Evidencia: SwipeableFoodRow.tsx:93-131,183-193; components/ServingAdjustSheet.tsx:139-183; DiaryScreen.tsx:661-663,788-793
- **Copiar una comida a otra fecha/tipo de comida** — Sólo desde el detalle de la comida. En Android el botón Atrás no cierra CopyMealSheet.
  - Evidencia: MealTypeDetailScreen.tsx:108-115,274-293; components/CopyMealSheet.tsx:159-303 (Target date, Target meal, aviso de duplicado)
- **Registrar agua sin abrir la app** — iOS: Siri/Atajos, widget de agua con +/-, controles iOS 18 y acción rápida del icono. Android: sólo acceso directo dinámico 'Log water' en el lanzador.
  - **Cubierto en parte por las PR #2989 y #3020 (fusionadas):** Android ya registra agua sin abrir la app desde el atajo Registrar agua del lanzador, una baldosa de Ajustes rápidos Registrar agua (también desde la pantalla de bloqueo) y un widget de agua de 2x2 para la pantalla de inicio, cuyos botones − y + quitan o añaden una bebida del recipiente elegido en el Panel. Siri/Atajos, el botón Acción, el control Eliminar toma y los widgets de agua de la pantalla de bloqueo siguen siendo solo de iOS, y el widget de agua de Android tiene un único tamaño (en iOS hay pequeño y mediano).
  - Evidencia: targets/widget/ShortcutIntents.swift, Controls.swift, waterWidget.swift; hooks/useQuickActions.ts:24-35,142; targets/android-background-water
- **Escribir nutrición e hidratación del diario en la app de salud** — iOS escribe en HealthKit; Android en Health Connect (WRITE_NUTRITION/WRITE_HYDRATION). Opt-in por métrica.
  - Evidencia: src/services/writeback.ios.ts -> healthkit/writeback.ts; src/services/writeback.ts -> healthconnect/writeback.ts:90-175; components/HealthDataWriteback.tsx
- **Widgets con calorías/macros del diario** — iOS: calorías, macros y agua, más familias de pantalla de bloqueo y controles. Android: widgets Glance de calorías y macros.
  - **Cubierto en parte por las PR #2989 y #3020 (fusionadas):** Android ya tiene widgets de calorías, macros y agua (el de agua, con botones − y + que funcionan sin abrir la app) y cuatro baldosas de Ajustes rápidos como equivalente de los controles de iOS: Registrar agua, Escanear código, Buscar comida y Calorías restantes, con las kcal que quedan hoy en su etiqueta, también en la pantalla de bloqueo. Siguen siendo solo de iOS las familias de widgets de pantalla de bloqueo y los controles Iniciar ayuno, Terminar ayuno y Eliminar toma, aunque en Android el botón − del widget de agua hace lo mismo que este último. El widget de calorías de Android sigue sin mostrar consumidas y quemadas, y los de calorías y macros siguen siendo un 2x1 y un 2x2 fijos.
  - Evidencia: targets/widget/widgets.swift, macroWidget.swift, waterWidget.swift; targets/android-widget/kotlin/.../CalorieWidget.kt.tmpl, MacroWidget.kt.tmpl
- **Accesos rápidos para escanear/registrar comida** — El acceso directo de Android sólo ofrece 'Log water'.
  - **Actualizado en la PR #2989 (fusionada):** Android tiene ya Escanear comida y Registrar comida entre las acciones del icono, además de las baldosas de Ajustes rápidos Escanear código y Buscar comida, que abren las mismas pantallas y hacen de equivalente a los controles del Centro de control de iOS. El botón Acción de iOS, que también puede lanzar estos controles, sigue sin equivalente en Android.
  - Evidencia: hooks/useQuickActions.ts:24-35,114-118,142,170 (Platform.OS === 'ios'); targets/widget/Controls.swift (ScanFoodControlIntent/LogFoodControlIntent)

**Biblioteca de alimentos, comidas y planes de comidas**

- **Escanear etiqueta nutricional para rellenar el alimento** — iOS 27+ con Apple Intelligence puede leer la etiqueta en el dispositivo (modules/on-device-nutrition, expo-module.config.json platforms ['ios']; src/services/onDeviceLabelScan.ts:17) con interruptor en Ajustes > IA y banner para reintentar con la otra IA; Android siempre usa la IA del servidor.
  - Evidencia: EditFoodMode.tsx:668-681 botón 'Scan nutrition label' -> FoodScan capture-label; la creación desde FoodScan llega a CreateFoodMode con LabelScanSourceBanner (CreateFoodMode.tsx:570-575); FoodScanScreen.tsx:582-611 (dispositivo primero, luego servidor /api/foods/scan-label en externalFoodSearchApi.ts:732).

**Ejercicios, entrenamientos y running**

- **Ajustes de sonido del entreno** — En iOS 'Play through silent mode' también suena con la app en segundo plano o la pantalla bloqueada (pista keep-alive; sounds.ts:37-45 isBackgroundRestChimeEnabled solo iOS); en Android solo suena en primer plano y en segundo plano se usa la notificación. Textos distintos en WorkoutSettingsScreen.tsx:160-168.
  - Evidencia: src/screens/WorkoutSettingsScreen.tsx:134-202 ('Rest timer sound', 'Play through silent mode', 'Lower music during cues'); src/services/sounds.ts:30-90
- **Estado del entreno de fuerza fuera de la app** — iOS: Live Activity (pantalla de bloqueo / Dynamic Island) interactiva con −15 s, +15 s, saltar descanso y completar serie. Android: notificación persistente con barra de progreso y cronómetro de cuenta atrás, sin botones de acción (solo abre la app).
  - Evidencia: src/services/workoutLiveActivity.ios.ts:60-68 (botones rest ±15, skip, complete-set) + WorkoutLiveActivityLayout.tsx; src/services/workoutLiveActivity.android.ts:21-40 + targets/android-workout-notification/.../WorkoutNotificationModule.kt:92-106; plugins/withWorkoutNotification.ts
- **Detalle de sesión cardio** — El mapa real se dibuja siempre en iOS (Apple Maps); en Android solo si la build tiene clave de Google Maps, si no se muestra una línea simple (src/utils/routeMapSupport.ts:14-21).
  - **Cubierto en parte por las PR #3014, #3022, #3065, #3078 y #3135 (fusionadas):** El detalle de la sesión en el móvil muestra ya también la cadencia media, la longitud de zancada y la valoración del esfuerzo cuando la entrada las tiene, una tarjeta de parciales por km o por milla calculada a partir del recorrido GPS (barras de ritmo, desnivel y frecuencia cardiaca media) y botones para guardar el recorrido en Rutas y para compartir la sesión como imagen; la web y el móvil indican ya cómo se calcularon las zonas de frecuencia cardiaca. Al móvil le siguen faltando las gráficas de cadencia y de altitud y la tabla de vueltas del propio dispositivo, que la web sí tiene. En Android el mapa real sigue necesitando una compilación con clave de Google Maps.
  - Evidencia: src/screens/CardioSessionScreen.tsx:291-406 (Route, Pace, Heart Rate, Heart Rate Zones, estadísticas); sin gráficas de cadencia/elevación ni tabla de vueltas para sesiones sincronizadas
- **Grabación de actividad con GPS del teléfono** — Disponible en ambas; en segundo plano iOS usa el indicador de ubicación y Android un servicio en primer plano con notificación (gpsRecordingService.ts:1130-1135). Ver filas de Live Activity, GPS del reloj, consejos de batería y distancia en interior.
  - **Actualizado en la PR #3052 (fusionada):** La frecuencia cardiaca en directo durante una grabación con el móvil funciona ya también en Android con un reloj Wear OS conectado: el reloj la envía a la pantalla de grabación y se guarda con la actividad, como hace el Apple Watch en iOS. Sin reloj, ninguna de las dos plataformas muestra la frecuencia cardiaca. El aviso en segundo plano sigue siendo distinto: iOS muestra el indicador de ubicación y Android una notificación de servicio en primer plano.
  - Evidencia: src/screens/RecordActivityScreen.tsx:1034-1065 (Walk/Run/Ride, Outdoor/Indoor), 1528-1830 (mapa, Time, Distance, Avg pace, Elevation, Heart rate, Laps, Splits, Lap, Pause/Resume, Finish, Discard, Save activity); AddSheet.tsx:403-414; services/gpsRecordingService.ts:1115-1135
- **Distancia en interior por pasos y corrección de cinta** — Android guarda el contador de pasos del hardware al empezar y lo resta al final (un reinicio lo invalida) (stepCounter.ts:43-77); iOS consulta el historial del podómetro para la ventana al terminar (stepCounter.ts:80-88).
  - Evidencia: src/screens/RunSummaryScreen.tsx:296-327 ('Treadmill distance', Update); src/services/stepCounter.ts:35-90; strideCalibration.ts; hooks/useIndoorDistanceEstimate.ts
- **Ruta dibujada sobre mapa** — iOS siempre con Apple Maps; Android solo si la build tiene GOOGLE_MAPS_ANDROID_API_KEY, si no se dibuja solo la línea sin mapa (src/utils/routeMapSupport.ts:8-21).
  - Evidencia: src/components/exerciseStats/RouteMap.tsx:12-15 (RouteTileMap con react-native-maps o RouteLine)

**Check-in, medidas corporales y bienestar**

- **Sincronización automática de métricas corporales, sueño y pasos desde la tienda de salud del dispositivo** — iOS usa HealthKit y Android, Health Connect. Masa de agua corporal solo en Android (HealthMetrics.ts:505-518); Estrés solo en iOS (172-185); HRV y SpO2 usan tipos de registro distintos en cada plataforma (387-416, 606-646); iOS tiene entrega en segundo plano (src/services/healthkit/backgroundDelivery.ts).
  - Evidencia: src/HealthMetrics.ts:54-520 (definición de métricas con platforms); App.tsx:959-963 (Sync); src/screens/SyncScreen.tsx; src/services/healthConnectService.ts / .ios.ts
- **Importación del historial de salud (backfill)** — En Android, Health Connect limita la lectura histórica diaria y la importación se reanuda sola más tarde (ImportHistoryScreen.tsx:471-476). En iOS hay un aviso propio si HealthKit no está disponible (461-468).
  - Evidencia: App.tsx:964-968; src/screens/ImportHistoryScreen.tsx:391-681

**Objetivos y onboarding**

- **Visualización del progreso frente al objetivo de pasos** — La línea de objetivo en Health Trends existe en iOS y Android; la página Pasos y la complicación del Apple Watch solo existen en iOS.
  - **Actualizado en la PR #3052 (fusionada):** Wear OS tiene ya también una página de pasos con los pasos de hoy frente al objetivo y una complicación de pasos, así que estas superficies del reloj ya no son solo de iOS; la línea del objetivo en Health Trends no cambia en ninguna de las dos plataformas. A diferencia del Apple Watch, que muestra el último recuento del teléfono, Wear OS usa también el sensor de pasos del propio reloj cuando su recuento es mayor. La web permite fijar un objetivo de pasos, pero sigue sin mostrar el progreso frente a él.
  - Evidencia: SparkyFitnessMobile/src/hooks/useMeasurementsRange.ts:88 -> src/components/StepsBarChart.tsx:15-65 (línea de objetivo en Health Trends); src/hooks/useWatchCheckInBridge.ts:470-473 (stepGoal al reloj, 10.000 por defecto) -> targets/watch/Presentation/StepsView.swift y targets/watch-widget/StepsComplication.swift
- **Widgets de pantalla de inicio con progreso de objetivos** — iOS tiene widgets de calorías, macros y agua, con formatos de pantalla de bloqueo. Android tiene widgets Glance de calorías y macros, sin widget de agua.
  - **Cubierto en parte por la PR #3020 (fusionada):** Android ya tiene también un widget de agua con el agua de hoy frente al objetivo, una barra y botones − y +, junto a los widgets de calorías y macros. Sigue habiendo diferencias: el widget de calorías de Android solo muestra las kcal restantes y su barra, sin las calorías de comida ni las quemadas; cada widget de Android tiene un único tamaño fijo, mientras que iOS ofrece pequeño y mediano, y los formatos de pantalla de bloqueo siguen siendo solo de iOS.
  - Evidencia: iOS: SparkyFitnessMobile/targets/widget/widgets.swift, macroWidget.swift, waterWidget.swift; Android: targets/android-widget/kotlin/com/sparkyapps/sparkyfitness/widget/CalorieWidget.kt.tmpl, MacroWidget.kt.tmpl; plugins/withCalorieWidget.ts; src/services/CalorieWidgetBridge.ts
- **Usar BMR medido (check-ins y dispositivos sincronizados)** — En iOS, con el interruptor activado, aparece una nota extra (CalorieSettingsScreen.tsx:918-925, Platform.OS === 'ios') que recomienda poner el nivel de actividad en None (×1.0), porque la Resting Energy de Apple Health ya incluye actividad ligera. En Android no aparece.
  - Evidencia: SparkyFitnessMobile/src/screens/CalorieSettingsScreen.tsx:893-927 (Switch 'Use measured BMR from check-ins and synced devices'), Ajustes > Calories & BMR (SettingsScreen.tsx:272-280).

**Informes y analíticas**

- **Mapa de la ruta GPS de la actividad** — iOS siempre dibuja sobre Apple Maps. Android solo usa Google Maps si la build incluye GOOGLE_MAPS_ANDROID_API_KEY (androidGoogleMapsEnabled); sin clave muestra solo la línea de la ruta sin mapa de fondo (src/utils/routeMapSupport.ts:14-21; app.config.ts:20-22,283-287,322).
  - Evidencia: RouteMap en CardioSessionScreen (SparkyFitnessMobile/src/screens/CardioSessionScreen.tsx:298; src/components/exerciseStats/RouteMap.tsx, RouteTileMap.tsx, RouteLine.tsx)

**Medicación, GLP-1 y síntomas**

- **Escanear etiqueta 'Supplement Facts' (foto)** — En iOS se intenta primero el modelo on-device de Apple (modules/on-device-nutrition solo tiene carpeta ios/, FoundationModels iOS 27+ con Apple Intelligence, ajuste 'Scan Labels On Device'); en Android siempre se usa la IA del servidor.
  - Evidencia: 'Scan label to fill in' con 'Take photo'/'Choose photo' (MedicationFormScreen.tsx:276-389,983-1002); useSupplementLabelScan.ts:23 intenta primero scanSupplementLabelOnDevice (services/onDeviceSupplementScan.ts:177) y si no, IA del servidor.

**Ciclo menstrual, fertilidad y embarazo**

- **Guardado del registro diario** — En iOS con cabeceras nativas (iOS anterior a 26, o 26+ con Liquid Glass activado) Save va en la barra nativa (placement 'native-only'). En Android, e iOS 26+ con Liquid Glass desactivado, se usa la barra fija inferior FooterSaveBar (useNativeIOSHeadersActive en src/services/nativeTabBarPreference.ts:23-27). En Android el modal aplica el inset superior (CycleLogModalScreen.tsx:74).
  - Evidencia: Guardado explícito en el modal CycleLogModal: botón Save en la cabecera o en FooterSaveBar (src/screens/CycleLogModalScreen.tsx:53-67,143-150). handleSave valida los números antes de escribir (CycleTodayView.tsx:226-339).
- **Sincronizar datos reproductivos del sistema (menstruación, test de ovulación, moco cervical, sangrado intermenstrual)** — iOS ofrece menstruationFlow, menstruationPeriod, ovulationTest, cervicalMucus e intermenstrualBleeding. Sube el valor bruto de flujo, test de ovulación, moco y sangrado (src/services/healthkit/dataTransformation.ts:407-420). menstruationPeriod no tiene identificador HealthKit en index.ts, así que no lee nada. Android ofrece menstruationPeriod, ovulationTest, cervicalMucus e intermenstrualBleeding (no menstruationFlow). Transforma el periodo en u…
  - Evidencia: Métricas 'Reproductive' en src/HealthMetrics.ts:521-587 (Android) y 651-717 (iOS). El servidor no usa estos tipos para el ciclo: cycleRepository y cycleService solo leen basal_body_temperature.

**Chat con IA (SparkyChat) y ajustes de IA**

- **Contenedor de la interfaz de chat** — iOS usa la cabecera nativa (liquid glass, icono SF Symbol 'trash') y el KeyboardAvoidingView de RN core; Android usa la cabecera propia de la pantalla e ionicon, y react-native-keyboard-controller para evitar el teclado (ChatScreen.tsx:107-115, 980-993, 1095-1105; src/services/nativeTabBarPreference.ts:23-27).
  - Evidencia: SparkyFitnessMobile/App.tsx:771-775 (Stack.Screen 'Chat'); src/screens/ChatScreen.tsx:978-1166
- **Dictado por voz con el reconocedor del sistema** — iOS usa SFSpeechRecognizer y necesita un locale regional (src/utils/speechLocale.ts convierte 'en' en 'en-US' según el dispositivo). Android usa el reconocedor de Google/Samsung con androidIntentOptions EXTRA_ENABLE_LANGUAGE_SWITCH='balanced' (ChatScreen.tsx:581-585). addsPunctuation se pide en ambas plataformas (ChatScreen.tsx:578).
  - Evidencia: SparkyFitnessMobile/src/screens/ChatScreen.tsx:417-640 (SystemVoiceDictationButton), 735-743; app.config.ts:230-236 (plugin expo-speech-recognition con permisos de micrófono y reconocimiento)
- **Origen de la lectura y «Leer de nuevo» con el otro motor** — El reintento solo aparece cuando hay lectura en el dispositivo disponible (useRetryLabelScan.ts:44-50). En Android la fuente siempre es 'server', así que como mucho se ve la etiqueta de origen, sin «Leer de nuevo».
  - Evidencia: SparkyFitnessMobile/src/components/LabelScanSourceBanner.tsx:15-62; src/hooks/useRetryLabelScan.ts:30-75; src/screens/foodForm/CreateFoodMode.tsx:547, 571
- **Escaneo de etiqueta de suplementos (Supplement Facts)** — iOS 27+ con Apple Intelligence lo lee primero en el dispositivo (OnDeviceNutrition.scanSupplementLabel); Android usa siempre la visión del servidor.
  - Evidencia: SparkyFitnessMobile/src/hooks/useSupplementLabelScan.ts:20-31; src/services/onDeviceSupplementScan.ts:181-184; src/services/api/medicationsApi.ts (/api/v2/medications/supplement-label/scan y /map); src/screens/MedicationFormScreen.tsx:181, 306, 986-993

**Ajustes, perfil, familia e integraciones**

- **Sincronización de datos de salud del dispositivo** — iOS usa HealthKit (services/healthConnectService.ios.ts, services/healthkit); Android usa Health Connect (services/healthConnectService.ts) con aviso 'Not medical advice' solo en Android (SyncScreen.tsx:961-972).
  - Evidencia: src/screens/SettingsScreen.tsx:237-245 → SyncScreen (App.tsx:959-962); SyncScreen.tsx:190-196,514-515 (Health Connect vs Apple Health), HealthSourceLabel.tsx:13-19
- **Sincronización en segundo plano** — Android solicita el permiso BackgroundAccessPermission de Health Connect (SyncScreen.tsx:296-325); iOS arranca observadores de HealthKit (SyncScreen.tsx:337-365) y avisa que se actualiza 'cuando el teléfono lo permita' (SyncFrequency.tsx:38-45).
  - Evidencia: src/components/SyncFrequency.tsx:19-45; src/screens/SyncScreen.tsx:290-365,975-978
- **Selección de métricas de salud a sincronizar** — Flujos de permisos distintos (HealthKit vs Health Connect) pero mismo UI.
  - Evidencia: src/screens/SyncScreen.tsx:372-440 (permisos por métrica), :600-660 (todas), :983-990 (HealthDataSync)
- **Recordatorios de medicación** — Android crea un canal específico (services/notifications.ts:144-157) y pide el permiso de alarmas exactas para que suenen a tiempo; iOS no.
  - **Actualizado en la PR #3005 (fusionada):** Además de repetir, ocultar nombres y agrupar, los recordatorios de medicación tienen ahora un ajuste Recordar en (10, 15, 30 o 60 minutos) que fija la espera del nuevo botón Recordar en de la notificación, en iOS y Android. Android sigue creando su propio canal y pidiendo alarmas exactas; la web sigue sin recordatorios.
  - Evidencia: src/screens/NotificationSettingsScreen.tsx:298-392 (Medication Reminders, Repeat, Hide Medication Names, Consolidate)
- **Servicio de IA** — La opción 'On-device (Apple Intelligence)' / 'Scan Labels On Device' requiere iOS 27 con Apple Intelligence (AiSettingsScreen.tsx:146-150, services/onDeviceLabelScan); en Android aparece como no disponible.
  - Evidencia: src/screens/AiSettingsScreen.tsx:69-101 solo muestra el estado del proveedor del servidor (sin configurarlo) y :120-160 añade escaneo de etiquetas en el dispositivo
- **Atajos del sistema operativo (Siri/Atajos, controles y acceso directo del launcher)** — iOS: App Intents de Siri/Atajos (registrar o quitar agua, registrar peso, empezar o terminar ayuno) y controles de pantalla de bloqueo / Centro de Control (escanear y registrar alimento, abrir diario). Android: solo un acceso directo del launcher 'Log water' (LogWaterActivity sin UI + WorkManager).
  - **Cubierto en parte por las PR #2989 y #3020 (fusionadas):** Android tiene ya las acciones del icono Escanear comida, Registrar comida y Ayuno, que abren la app, cuatro baldosas de Ajustes rápidos y un widget de agua. El atajo y la baldosa Registrar agua registran una toma en segundo plano (la baldosa, también desde la pantalla de bloqueo), y los botones − y + del widget quitan o añaden una, todo ello con la sesión guardada. Android sigue sin nada parecido a Siri o la app Atajos, ninguna baldosa quita una toma y nada en el móvil registra el peso ni inicia o termina un ayuno sin abrir la app.
  - Evidencia: SparkyFitnessMobile/plugins/withBackgroundWater.ts:1-10; targets/widget/ShortcutIntents.swift:260 (LogWaterIntent), :300 (RemoveWaterIntent), :338 (LogWeightIntent), :370 y :408 (Start/End fast), :463-489 (controles Scan food, Log food, Open food diary); targets/android-background-water/.../BackgroundWaterModule.kt:32-33 (ShortcutInfoCompat 'Log w…

**Capacidades nativas del móvil**

- **Conexión con Apple Health / Health Connect** — iOS usa HealthKit (@kingstinct/react-native-healthkit) con la hoja de permisos del sistema. Android exige tener Health Connect instalado, con los permisos declarados en app.config.ts:27-80. El aviso 'Not medical advice' solo aparece en Android (SyncScreen.tsx:961-974).
  - Evidencia: SettingsScreen.tsx:237-245 (fila Health Data Sync → Sync); SyncScreen.tsx:190-197 (nombre de los ajustes de salud), 899-912 (mensajes de no disponible); services/healthConnectService.ts (Android) y healthConnectService.ios.ts (iOS)
- **Selección de métricas a sincronizar con vista previa** — La lista se filtra por el campo `platforms` de cada métrica (HealthMetrics.ts:1081-1083). El detalle de qué métricas hay en cada plataforma está en las tres filas siguientes.
  - Evidencia: SyncScreen.tsx:984-991 (HealthDataSync); components/HealthDataSync.tsx; HealthMetrics.ts:1076-1100 (filtro por plataforma y CATEGORY_ORDER)
- **Métricas de salud leídas en ambas plataformas** — La VFC, la SpO2 y las métricas reproductivas tienen una definición distinta en cada plataforma. iOS además lee 'flujo menstrual'. Masa ósea (HealthMetrics.ts:492) y empujes de silla de ruedas (435) salen en la lista de iOS, pero no tienen identificador en HEALTHKIT_TYPE_MAP (healthkit/index.ts:232-290) y la lectura devuelve vacío (index.ts:1929-1932). En la práctica solo funcionan en Android.
  - **Actualizado en las PR #3019, #3034, #3042, #3091 y #3100 (fusionadas):** Las sesiones de mindfulness se leen ahora en ambas plataformas como métrica común: Android conserva el tipo de sesión (meditación, respiración, sin guía u otra), el título y las notas, mientras que iOS envía todas las sesiones como 'other' sin notas. Las sesiones de sueño llevan ahora la VFC nocturna y la frecuencia cardiaca en reposo en ambas plataformas cuando esas métricas se sincronizan, y la media diaria de frecuencia cardiaca de Android da ahora el mismo peso a cada tramo de 5 minutos, mientras que iOS mantiene la media diaria de Apple Health. Masa ósea, empujes de silla de ruedas y periodo menstrual siguen sin sincronizar nada en iOS.
  - Evidencia: HealthMetrics.ts:54-445 y 492-503 (sin restricción de plataforma); VFC: entradas separadas en 387-400 (iOS) y 404-417 (Android); SpO2 y reproductivas: entradas Android en 521-617 e iOS en 636-718
- **Importar historial completo (backfill)** — En Android, Health Connect limita la lectura diaria y la importación se reanuda sola (ImportHistoryScreen.tsx:471-478). Sin el permiso READ_HEALTH_DATA_HISTORY solo llega a unos 30 días (512-519; app.config.ts:72; parche patches/react-native-health-connect@4.1.3.patch). En iOS no hay ninguno de estos límites.
  - Evidencia: SyncScreen.tsx:947-958 (fila Import Full History); ImportHistoryScreen.tsx:329-700; services/backfillService.ts; services/backfillCheckpoint.ts
- **Rutas GPS y FC de los entrenamientos sincronizados** — En Android la ruta exige un consentimiento por sesión con el diálogo del sistema (requestExerciseRoute en workoutTelemetry.ts:140-172, 325-330; app.config.ts:41-46). En iOS la ruta HKWorkoutRoute se lee con la autorización general. En iOS los entrenamientos que escribe el propio Apple Watch se excluyen para no duplicarlos (isOwnWatchWorkout).
  - Evidencia: services/healthconnect/workoutTelemetry.ts; services/healthkit/workoutTelemetry.ts; healthkit/index.ts:190-202, 265 (HKWorkoutRoute)
- **Widget de calorías** — En iOS (WidgetKit) hay tamaños systemSmall y systemMedium, más los accesorios de pantalla de bloqueo (widgets.swift:319-322); los botones van en el mediano. En Android (Glance) solo está en la pantalla de inicio, 2x1 y sin redimensionar (res/xml/sparky_calorie_widget_info.xml).
  - **Sigue pendiente:** Lo previsto para el widget de calorías de Android (mostrar las calorías consumidas y quemadas, y más tamaños o la posibilidad de redimensionarlo) no está en el código: sigue mostrando solo las kcal restantes, una barra y los botones de buscar y escanear, en un 2x1 fijo y solo en la pantalla de inicio. iOS mantiene sus tamaños pequeño y mediano con las calorías consumidas y quemadas, y las versiones de pantalla de bloqueo. La PR #3228, aún sin fusionar, lo hace redimensionable y añade el objetivo, lo comido y lo quemado en los tamaños grandes.
  - Evidencia: iOS: targets/widget/widgets.swift:179-213, 280-324; Android: targets/android-widget/kotlin/.../CalorieWidget.kt.tmpl:91-157; plugins/withCalorieWidget.ts; hooks/useWidgetSync.ts:63-134; services/CalorieWidgetBridge.ts
- **Widget de macros** — iOS tiene tamaños pequeño y mediano y versiones de pantalla de bloqueo. Android solo tiene widget de pantalla de inicio.
  - **Sigue pendiente:** Los tamaños adicionales o el redimensionado previstos para el widget de macros de Android no están en el código: sigue siendo un 2x2 fijo y solo para la pantalla de inicio. iOS mantiene sus tamaños pequeño y mediano y las versiones de pantalla de bloqueo. La PR #3228, aún sin fusionar, lo hace redimensionable, con los gramos frente a cada objetivo y las kcal comidas en los tamaños grandes.
  - Evidencia: iOS: targets/widget/macroWidget.swift:248-266, 396-428; Android: MacroWidget.kt.tmpl:89-104, 251; res/xml/sparky_macro_widget_info.xml
- **Idioma de widgets, Live Activities y superficies nativas** — Android usa recursos y locale propios para Glance. iOS usa Localizable.strings y recarga mediante ExtensionStorage.
  - **Cubierto en parte por las PR #2989, #3020, #3025, #3051 y #3052 (fusionadas):** En Android los widgets de calorías, macros y agua, las baldosas de Ajustes rápidos y las acciones rápidas del icono siguen el idioma de la app y se actualizan cuando cambia; los textos del widget de agua, los nombres de las baldosas Log water y Calories left y la etiqueta larga del atajo Log water solo están traducidos al español, polaco, portugués de Brasil, chino simplificado, chino tradicional y cantonés, y los resultados de Log water siguen en inglés. iOS tiene esas mismas seis traducciones para su widget de agua y sus controles, pero su hook aún reduce el idioma a en/pl y solo recarga los timelines de calorías y macros; en ambas plataformas los títulos de las acciones rápidas no están traducidos al húngaro, italiano, letón, noruego ni ruso, y las cadenas de widget en letón están vacías. Los textos propios de la app de Wear OS están solo en inglés, igual que los de la app del Apple Watch.
  - Evidencia: App.tsx:329-330 (useWidgetLanguageRefresh, useIOSWidgetLanguageRefresh); targets/android-widget/kotlin/.../WidgetLocale.kt.tmpl, WidgetLocaleApi33.kt.tmpl; targets/widget/en.lproj
- **Grabación GPS de actividades (caminar, correr, bici; exterior o interior)** — iOS usa el modo de fondo 'location' con la píldora azul (app.config.ts:200; gpsRecordingService.ts:1130). Android usa un servicio en primer plano con notificación (gpsRecordingService.ts:1131-1135) y muestra un consejo de batería, 'Recording with the screen off', con enlace a dontkillmyapp.com (RecordActivityScreen.tsx:1443-1466). La opción 'Record with: Phone/Watch' solo aparece con un Apple Watch emparejado (RecordActivityScreen.tsx:1073-1125).
  - **Cubierto en parte por las PR #3052, #3090 y #3154 (fusionadas):** Con un reloj Wear OS emparejado, Android ofrece ahora 'Registrar con: GPS del teléfono / GPS del reloj' para caminatas y carreras, como iOS con un Apple Watch, y el reloj envía la frecuencia cardiaca a las grabaciones con el GPS del móvil; las pruebas de forma física también abren esta pantalla, siempre con el móvil. Una caminata o carrera grabada en el reloj Wear OS llega al móvil con los puntos GPS y las marcas de vuelta en un formato que el móvil descarta, así que se guarda sin mapa, parciales ni vueltas, y sus lecturas de FC van en segundos desde el inicio en lugar de con la hora real, lo que deja casi vacías sus zonas de FC. El selector de ruta para seguir una ruta guardada también aparece en Android al grabar en exterior con el reloj, pero la app de Wear OS ignora la ruta elegida.
  - Evidencia: screens/RecordActivityScreen.tsx:226-239, 1030-1160, 1520-1650; services/gpsRecordingService.ts:1115-1137; hooks/useAddSheetActions.ts:324
- **Distancia en interior con el podómetro del teléfono** — iOS pide los pasos de la ventana a CMPedometer al terminar. Android guarda el contador de hardware al empezar y lo resta al final (módulo nativo propio); si el teléfono se reinicia en medio, no hay estimación.
  - Evidencia: services/stepCounter.ts:40-95; modules/step-counter/android/.../StepCounterModule.kt; services/strideCalibration.ts; hooks/useIndoorDistanceEstimate.ts; app.config.ts:267-270 (motionUsagePermission)
- **Mapa de ruta en actividades cardio** — iOS usa siempre Apple Maps. Android solo usa Google Maps si la build lleva GOOGLE_MAPS_ANDROID_API_KEY; si no, dibuja la línea de la ruta sin mapa de fondo.
  - Evidencia: utils/routeMapSupport.ts:13-21; components/exerciseStats/RouteTileMap.tsx; app.config.ts:16-22, 283-289 (react-native-maps)
- **FC del reloj durante y después del entrenamiento** — La FC en vivo solo llega con un Apple Watch, es decir, solo en iOS. Las cifras guardadas que vienen de entrenamientos sincronizados se ven en las dos plataformas.
  - **Actualizado en las PR #3052 y #3078 (fusionadas):** Android ya recibe FC en vivo de un reloj Wear OS, que la envía durante el entrenamiento: las tarjetas de ejercicio la muestran en directo y sus muestras dan después la misma FC media, máxima y por zonas. Sin reloj, Android sigue sin FC en vivo. Las zonas se calculan ahora con los ajustes de zonas de FC de cada persona, salvo en las sesiones del Apple Watch con watchOS 27, que conservan las zonas de Apple, y las barras de zonas indican con qué método se calcularon.
  - Evidencia: stores/liveHeartRateStore.ts; components/ActiveWorkoutExerciseCard.tsx; screens/WorkoutCompleteScreen.tsx; hooks/useWorkoutHeartRateZones.ts
- **Alerta de fin de descanso con acción 'Complete Set'** — En iOS se marca como 'timeSensitive' y atraviesa los modos Concentración (app.config.ts:212; notifications.ts:404-408). En Android depende del permiso de alarmas exactas (ver native-notif-exact-alarm), y la notificación se quita a mano tras pulsar la acción (notifications.ts:457).
  - Evidencia: services/notifications.ts:93-101 (categoría), 381-430 (scheduleRestNotification); NotificationSettingsScreen.tsx:256-275
- **Sonido de fin de descanso y 'Play through silent mode'** — En iOS, con 'silent mode' activo, también suena en segundo plano y con la pantalla bloqueada gracias a una pista silenciosa (UIBackgroundModes 'audio', app.config.ts:200; sounds.ts:38-45). En Android solo suena con la app abierta (fuera de ella el aviso es la notificación), aunque ignora el modo silencio o vibración.
  - Evidencia: WorkoutSettingsScreen.tsx:134-182; services/sounds.ts:32-120
- **Idioma de la app** — En iOS el idioma se cambia en Ajustes de iOS: la fila abre Linking.openSettings y muestra 'Managed by iOS'. En Android hay un selector propio sincronizado con 'Idiomas de las apps' del sistema en Android 13+ (LocaleManager); en Android 12 o anterior se guarda como preferencia local.
  - Evidencia: AppSettingsScreen.tsx:113-130, 165-208; targets/android-language/kotlin/.../AppLanguageModule.kt, AppLanguageApi33.kt; plugins/withAppLanguage.ts; hooks/useAppLanguageForegroundSync.ts; app.config.ts:160-165, 192
- **Gestión de servidores autoalojados** — Las builds de producción de Android confían en las CA instaladas por el usuario, útil con certificados propios (plugins/withNetworkSecurityConfig.ts:24-27; app.config.ts:134). iOS pide permiso de red local para servidores en la LAN (NSLocalNetworkUsageDescription, app.config.ts:171).
  - Evidencia: screens/ServerSettingsScreen.tsx:335-500; components/ServerConfigModal.tsx:62-188; services/storage.ts (proxyHeaders)
- **Escanear etiqueta o código de barras de un suplemento para rellenar el medicamento** — Está en las dos plataformas a través del servidor. Solo en iOS 27+ con Apple Intelligence (y el interruptor de AiSettingsScreen activo) se intenta antes la lectura en el dispositivo (modules/on-device-nutrition/index.ts:44-59, null en Android).
  - Evidencia: screens/MedicationFormScreen.tsx:181 (useSupplementLabelScan), 276-306 (ImagePicker.launchCameraAsync o launchImageLibraryAsync), 959-999 ('Scan barcode to fill in' → FoodScan y 'Scan label to fill in'); hooks/useSupplementLabelScan.ts:23-28 (primero onDeviceSupplementScan, después el servidor); services/api/medicationsApi.ts:56-62 (POST /api/v2/m…

## 4. Metodología y limitaciones

- Análisis estático: no se ejecutaron las apps. «Presente» significa alcanzable desde la UI (pantalla, diálogo, menú o ajuste registrado en la navegación), no solo una función del cliente API.
- Algunas funciones dependen de la configuración del servidor (p. ej. OIDC, demo, IA, proveedores) o de permisos (admin, acceso familiar).
- Estado de verificación de las filas: verificado: 857, sin diferencia: 311, añadido durante la verificación: 91, corregido por verificación: 81, añadido por el crítico de completitud: 25, sin verificación adversarial: 7, verificadores en desacuerdo (se toma la lectura más conservadora): 1.
- Las filas «Solo web / Solo móvil» con evidencia «No» indican que no se encontró ninguna ruta de UI tras búsquedas por nombre, etiquetas de traducción, endpoints y componentes.