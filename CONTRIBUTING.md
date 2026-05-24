# Contribuir a Praxis

¡Gracias por tu interés en colaborar con Praxis! Este es un proyecto de código abierto bajo la licencia **AGPLv3**, diseñado para evaluar el criterio técnico con entornos reales de trabajo.

Para mantener una base de código limpia, profesional y fácil de mantener, te pedimos que sigas las siguientes guías.

---

## Configuración del Entorno de Desarrollo

1.  **Hacer un Fork y Clonar:**
    *   Haz un fork del repositorio en GitHub.
    *   Clona tu fork localmente:
        ```bash
        git clone https://github.com/tu-usuario/Praxis.git
        cd Praxis
        ```

2.  **Instalar Dependencias:**
    Praxis utiliza `pnpm` como gestor de paquetes. Instala las dependencias ejecutando:
    ```bash
    pnpm install
    ```

3.  **Configurar Variables de Entorno:**
    *   Copia el archivo de ejemplo para crear tu archivo `.env`:
        ```bash
        cp .env.example .env
        ```
    *   Completa las variables requeridas (como las credenciales de Supabase).

4.  **Iniciar el Servidor de Desarrollo:**
    ```bash
    pnpm dev
    ```
    Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación corriendo.

---

## Flujo de Trabajo y Convenciones

### 1. Ramas (Branches)
Por favor, crea una rama descriptiva a partir de `main` antes de realizar cambios:
```bash
git checkout -b feature/nombre-de-la-mejora
# o
git checkout -b bugfix/nombre-del-bug
```

### 2. Convención de Commits
Seguimos la especificación de **Conventional Commits**. Esto mantiene el historial de Git legible y facilita la generación automática de changelogs. El formato es:

```
<tipo>(<opcional-alcance>): <descripción corta en minúsculas>
```

**Tipos comunes:**
*   `feat`: Una nueva funcionalidad.
*   `fix`: Solución a un error o bug.
*   `docs`: Cambios en la documentación.
*   `style`: Cambios estéticos o de formato que no afectan la lógica (espacios, formateo, etc.).
*   `refactor`: Cambio de código que no arregla un bug ni añade una característica.
*   `test`: Añadir o corregir pruebas unitarias.
*   `chore`: Tareas de mantenimiento o actualización de dependencias.

*Ejemplo:* `feat(tour): agregar paso de autocompletado en la revisión de PR`

---

## Pruebas y Calidad de Código

Antes de abrir un Pull Request, asegúrate de:

1.  **Formatear el código:**
    ```bash
    pnpm format
    ```
2.  **Correr el Linter:**
    ```bash
    pnpm lint
    ```
3.  **Ejecutar los Tests:**
    Asegúrate de que todas las pruebas pasen correctamente:
    ```bash
    pnpm test
    ```

---

## Enviar un Pull Request (PR)

1.  Haz push a tu rama en tu fork:
    ```bash
    git push origin feature/nombre-de-la-mejora
    ```
2.  Abre un Pull Request contra la rama `main` del repositorio original de Praxis.
3.  Describe claramente tus cambios, por qué son necesarios y cómo los probaste.
4.  Espera la revisión del equipo. ¡Toda contribución constructiva es bienvenida!
