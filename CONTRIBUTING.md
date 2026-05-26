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
