# Regularización sin OC · Quinta

Aplicación web (PWA) para regularizar productos recibidos en bodega **sin orden de compra**.
Funciona en el teléfono, se instala como app y **sigue funcionando sin señal**.

---

## Cómo publicarla en GitHub Pages (sin instalar nada)

### 1. Crear el repositorio

1. Entra a [github.com](https://github.com) e inicia sesión.
2. Arriba a la derecha, botón **+** → **New repository**.
3. Completa:
   - **Repository name**: `regularizacion` (o el nombre que quieras, sin espacios ni tildes)
   - Visibilidad: **Public** ← *obligatorio* si tu cuenta es gratuita, si no, Pages no funciona.
   - **NO** marques "Add a README file".
4. Botón **Create repository**.

### 2. Subir los archivos

1. En la página del repo recién creado, haz clic en **uploading an existing file**
   (o en **Add file → Upload files**).
2. Arrastra **todos** los archivos de esta carpeta a la vez:
   - `index.html`
   - `sw.js`
   - `manifest.json`
   - `icon-192.png`
   - `icon-512.png`
   - `.nojekyll`
   - `README.md`
3. Abajo, botón verde **Commit changes**.

> Si el archivo `.nojekyll` no aparece al arrastrar (por ser oculto), no pasa nada:
> también puedes crearlo con **Add file → Create new file**, poniendo como nombre
> `.nojekyll` y dejándolo vacío.

### 3. Activar GitHub Pages

1. En el repo, pestaña **Settings** (arriba a la derecha).
2. Menú de la izquierda: **Pages**.
3. En *Source* elige **Deploy from a branch**.
4. En *Branch* elige **main** y carpeta **/ (root)** → **Save**.
5. Espera 1–2 minutos y recarga esa página: aparecerá la dirección, del estilo:

```
https://TU-USUARIO.github.io/regularizacion/
```

Esa es la dirección de la app. Compártela con la gente de bodega.

### 4. Instalarla en el teléfono

- **Android (Chrome)**: abre el link → menú ⋮ → **Instalar aplicación** / *Agregar a pantalla principal*.
- **iPhone (Safari)**: abre el link → botón Compartir → **Agregar a pantalla de inicio**.

Queda con ícono propio y abre a pantalla completa. Después de abrirla una vez con
internet, funciona igual sin señal.

---

## Cuando quieras actualizar la app

1. Edita/reemplaza `index.html` en el repo (**Add file → Upload files**, mismo nombre).
2. **Importante**: abre `sw.js` en GitHub, botón del lápiz ✏️ y cambia la línea:

   ```js
   const VERSION = 'v1';   →   const VERSION = 'v2';
   ```

   Sin ese cambio, los teléfonos que ya la tienen instalada pueden seguir mostrando
   la versión antigua guardada en memoria.
3. **Commit changes**. En unos minutos, los teléfonos se actualizan solos al abrir la app.

---

## Sobre los datos

- Todo se guarda **en el propio teléfono** (IndexedDB `quinta_recepcion` y
  `localStorage`). No hay servidor ni base de datos central: GitHub Pages solo entrega
  los archivos.
- Cada teléfono tiene sus propios datos. No se sincronizan entre equipos.
- Los datos se comparten con la app de **Recepción de OC** solo si ambas están
  publicadas **en el mismo sitio** (mismo `https://TU-USUARIO.github.io/regularizacion/`).
  Si más adelante subes la app de Recepción, ponla **en este mismo repositorio**, por
  ejemplo como `recepcion.html`, y así ambas comparten la misma base local.
  Si la pones en otro repo, serán bases separadas y no se verán entre sí.
- Al ser un repositorio público, cualquiera con el link puede abrir la app (no tus
  datos, que quedan en el teléfono). Si eso es un problema, se puede usar un repo
  privado con GitHub Pages, lo que requiere una cuenta de pago.

## Opcional: base de órdenes para todos los teléfonos

Al abrirse, la app busca un archivo `ordenes.json` en el mismo sitio. Si no existe,
no pasa nada (funciona igual, cargando los productos a mano desde **Cargar productos**).

Si subes un `ordenes.json` al repositorio, **todos** los teléfonos toman esa base de
productos automáticamente al abrir la app, sin cargar nada a mano. El formato es:

```json
{ "ordenes": [ ... ] }
```

Es el mismo archivo que exporta/usa la app de Recepción de OC. Cada vez que lo
reemplaces en GitHub, los teléfonos lo actualizan solos al abrir con señal.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La aplicación completa (incluye SheetJS y jsPDF dentro, no necesita internet) |
| `sw.js` | Service worker: permite usarla sin señal y maneja las actualizaciones |
| `manifest.json` | Datos de instalación: nombre, colores, íconos |
| `icon-192.png` / `icon-512.png` | Ícono de la app en el teléfono |
| `.nojekyll` | Evita que GitHub procese los archivos y rompa algo |
