# Visión del Producto: El "Simulador de Vuelo" para Desarrolladores

**Última actualización:** Mayo 2026 | → [PROJECT_INDEX.md](./PROJECT_INDEX.md)

---

## 1. El Concepto Core

La mayoría de las plataformas de educación y evaluación técnica se basan en acertijos lógicos aislados, cuestionarios de opción múltiple o sandboxes de código abstractos. Esto genera un **choque con la realidad** cuando un programador ingresa a su primer empleo real: allí se encuentra con bases de código heredadas y complejas, herramientas de CI/CD, dinámicas de comunicación internas (Slack/correo) y revisiones de código exhaustivas hechas por ingenieros senior.

Praxis aborda esta brecha a través de la **inmersión diegética**. No es un curso, ni una prueba estática; es un **juego de rol técnico (Developer RPG) y simulador de carrera**. 

El jugador opera dentro de **Praxis OS**, un sistema operativo simulado directamente en el navegador, equipado con herramientas que imitan el entorno cotidiano de un desarrollador de software profesional:
- **Mail.exe**: Para recibir instrucciones del negocio y prioridades del Product Manager.
- **Teams / Slack**: Canales de chat e hilos interactivos con colegas virtuales.
- **Kanban.exe**: Un tablero interactivo para mover y estructurar el estado de los tickets.
- **IDE.exe**: Un editor de código real potenciado por Monaco (VS Code) con árbol de archivos y autocompletado inteligente.
- **Terminal.exe**: Para correr comandos de compilación, linters y despliegues simulados.
- **Browser.exe**: Un navegador integrado para inspeccionar mockups de Figma y probar vistas previas del código en vivo.

---

## 2. Gamificación y el Ciclo de Recompensa: El Currículum Dinámico

En Praxis, la gamificación no se reduce a medallas superficiales o rankings competitivos. Se enfoca en la **validación real de habilidades** y el progreso tangible del jugador.

### El Currículum (CV) como Recompensa de Juego
El mayor incentivo dentro de Praxis es la construcción automatizada de tu **currículum o CV interactivo**. 
- Cada vez que el jugador completa con éxito un escenario (por ejemplo, implementar JWT, optimizar un pipeline DevOps o auditar una interfaz responsiva en Figma), el simulador valida el código y registra la tecnología en su perfil.
- Esta información alimenta de forma dinámica un CV público y verificado.
- En lugar de simplemente decir "sé React", el currículum del jugador demuestra y certifica que resolvió problemas reales de React, Docker o seguridad dentro del simulador bajo la tutela de revisiones de código de ingenieros senior con IA.
- Esto transforma el progreso del juego en un activo directo para su carrera profesional fuera de la simulación.

### El Árbol de Habilidades y la Calibración
El progreso técnico del jugador se evalúa en base a dimensiones clave del mundo laboral (lectura de código, debugging, seguridad, pruebas y comunicación). Cada escenario completado otorga puntos de experiencia (XP) y eleva sus habilidades, visualizando su crecimiento en un árbol de especialidades técnicas.

---

## 3. Código Abierto y Colaboración Multidisciplinaria

Praxis es un proyecto de código abierto bajo la licencia **AGPLv3**. Nuestra meta es crear una comunidad colaborativa y diversa. 

No queremos que Praxis sea construido únicamente por desarrolladores de software. Para crear un simulador verdaderamente inmersivo y memorable, fomentamos y abrimos las puertas a la participación de creativos y profesionales de diversas disciplinas:

### ¿Cómo colaborar desde otras áreas?

- **Diseño de Juego (Game Designers)**:
  - Diseñar nuevas mecánicas de interacción dentro del sistema operativo simulado.
  - Diseñar y calibrar la progresión del árbol de habilidades, el balanceo de dificultad de los escenarios técnicos y los sistemas de ayuda y mentores.
- **Diseño Visual y Arte (Graphic Designers & Pixel Artists)**:
  - Refinar el estilo de la interfaz (la estética oscura de "Obsidian & Steel" con dithering de shaders de pantalla).
  - Diseñar avatares en pixel art de 8 bits para los miembros virtuales del equipo (compañeros de desarrollo, líderes y directores).
- **Diseño de Sonido (Sound Designers)**:
  - Praxis utiliza síntesis de sonido en tiempo real en la Web Audio API (`lib/audio.ts`) para lograr efectos retro memorables y ligeros (estilo chiptune NES/Game Boy).
  - Colaborar optimizando osciladores, modulando vibratos y creando nuevos efectos de sonido retro para alertas de compilación, de errores de teclado, clics y transiciones.
- **Guionistas y Escritores de Contenido (Writers)**:
  - Crear la narrativa detrás de cada escenario.
  - Escribir correos corporativos ficticios, discusiones e hilos del canal de Slack de ingeniería y especificaciones de tickets.
  - Diseñar la personalidad y las respuestas del ingeniero senior virtual y el Product Manager (las "personas" de IA).

Para más detalles prácticos sobre la instalación local y cómo proponer contribuciones en cada área, consulta [CONTRIBUTING.md](../CONTRIBUTING.md).

---

## 4. Filosofía del Simulador

1. **El valor del fracaso**: La verdadera destreza técnica se demuestra cuando los sistemas fallan. Los escenarios no son lineales; simulan incidentes de producción, variables faltantes y errores de código heredado para enseñar a depurar y mantener la calma bajo presión.
2. **Criterio técnico sobre respuestas fijas**: Praxis no califica sintaxis de memoria. Valida que el código cumpla los objetivos lógicos y de comportamiento, dando libertad al jugador de resolver el desafío a su manera.
3. **Diegético por defecto**: Cada botón, texto de ayuda o pantalla forma parte del entorno físico del juego (correos, terminal, navegador virtual). No hay paneles flotantes externos que rompan la inmersión en la estación de trabajo.
