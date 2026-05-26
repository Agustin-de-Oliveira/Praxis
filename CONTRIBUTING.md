# Contribuir a Praxis

Gracias por el interés en colaborar. Praxis es un proyecto de código abierto bajo la licencia AGPLv3 enfocado en la simulación técnica de entornos de trabajo.

Para mantener la base de código limpia y ordenada, te sugerimos seguir estas pautas.

## Configuración del entorno

1. Haz un fork del repositorio y clónalo localmente:
   ```bash
   git clone https://github.com/tu-usuario/Praxis.git
   cd Praxis
   ```

2. Instala las dependencias usando pnpm:
   ```bash
   pnpm install
   ```

3. Crea el archivo de configuración local a partir de la plantilla y completa las credenciales de Supabase:
   ```bash
   cp .env.example .env
   ```

4. Inicia el servidor de desarrollo en http://localhost:3000:
   ```bash
   pnpm dev
   ```

## Contribuciones de diseño y sonido

Queremos que Praxis se sienta como un juego retro inmersivo. Si eres diseñador, artista de pixel art o diseñador de sonido, puedes aportar mejoras en la identidad visual y sonora del proyecto.

### Arte y avatares de 8 bits
Los avatares de los AI teammates actuales están ubicados en `public/avatars/`.
- **Formato**: Archivos PNG con transparencia.
- **Dimensiones**: 64x64 píxeles reales.
- **Estilo**: Estética pixel art de 8 bits con paleta de colores compacta.
- **Cómo colaborar**: Puedes proponer rediseños de los avatares existentes (Sarah, Alex, Jordan) o proponer retratos para futuros roles directamente reemplazando o añadiendo archivos en la carpeta `public/avatars/`.

### Efectos de sonido (SFX)
Los efectos de sonido de Praxis se sintetizan en tiempo real usando la API de Web Audio en `lib/audio.ts` para evitar la carga de archivos de audio tradicionales.
- **Síntesis**: Usamos osciladores nativos (`square`, `triangle`, `sine`, `sawtooth`) y modulaciones de frecuencia y ganancia para emular chips de sonido retro (estilo NES, Game Boy).
- **Cómo colaborar**: 
  - Puedes refinar las notas, frecuencias o transiciones de volumen de los efectos existentes en `lib/audio.ts` para darles un mejor acabado.
  - Puedes sintetizar nuevos efectos en la clase `SoundEffects` para enriquecer la respuesta sonora de la plataforma.

## Flujo de desarrollo

### Ramas y commits

Trabaja siempre sobre ramas descriptivas creadas desde main:
```bash
git checkout -b feature/nombre-de-la-mejora
# o
git checkout -b bugfix/nombre-del-bug
```

Seguimos la convención de Conventional Commits para mantener el historial legible:
`tipo(alcance): descripcion corta en minusculas`

Tipos comunes:
- feat: nueva funcionalidad
- fix: solución a un error
- docs: cambios en documentación
- style: formateo y estilos sin cambios en la lógica
- refactor: reestructuración de código
- test: pruebas unitarias
- chore: mantenimiento y dependencias

Ejemplo: `feat(tour): agregar paso de autocompletado en la revisión de PR`

### Pruebas y calidad

Antes de enviar tus cambios, asegúrate de verificar la calidad del código:
```bash
pnpm format    # Formatea el código con Prettier
pnpm lint      # Corre el linter
pnpm test      # Ejecuta las pruebas unitarias
```

### Enviar un Pull Request

1. Sube los cambios a tu fork:
   ```bash
   git push origin feature/nombre-de-la-mejora
   ```
2. Crea el Pull Request contra la rama main del repositorio original.
3. Describe los cambios realizados, la justificación y cómo los probaste.
