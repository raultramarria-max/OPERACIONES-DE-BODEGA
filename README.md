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

## Repositorio nuevo, pero misma cuenta de GitHub

Esta app va en un repositorio propio, aparte de `RECEPCION-VESPUCIO`. Eso **no** rompe
nada, con una condición: que sea **la misma cuenta de GitHub**.

El navegador guarda los datos por *sitio*, y el sitio es `TU-USUARIO.github.io`, no el
repositorio. O sea que `TU-USUARIO.github.io/recepcion-vespucio/` y
`TU-USUARIO.github.io/regularizacion/` son el mismo sitio para el teléfono: **comparten
la base de órdenes, el correlativo MP, los folios y la bandeja de pallets**, igual que
si estuvieran en la misma carpeta.

Lo que sí cambiaría todo es publicarla en **otra cuenta** de GitHub o en un dominio
distinto: ahí el teléfono la ve como otro sitio, no encuentra nada, y el contador
partiría de cero (se arregla con *Fijar último MP*, ver más abajo).

Dos detalles del repositorio nuevo:

- Si un teléfono nunca abrió la app de Recepción, no tendrá la base de productos.
  Para eso conviene copiar también el `ordenes.json` a este repositorio (ver más abajo).
- El `sw.js` de este repositorio es independiente del de `RECEPCION-VESPUCIO`: cuando
  actualices esta app, subes el `VERSION` de **este** `sw.js`, no del otro.

## Los correlativos MP y RG nunca se reinician

Regla permanente de la app: **el número de contenedor MP y el folio RG jamás vuelven
a empezar de 1**. Siempre siguen desde el último número emitido.

Cómo está protegido (versión 1.1):

1. El número vive en la base del teléfono (IndexedDB `kv/mpseq` y `kv/regseq`).
   **Actualizar la app no la toca**: subir un `index.html` nuevo o un `sw.js` nuevo
   solo cambia los archivos, nunca los datos guardados.
2. Además se guarda un **espejo en `localStorage`** (`quinta_mpseq`, `quinta_regseq`)
   que **solo sube, nunca baja**. Si la base se pierde, el espejo levanta el contador
   de vuelta al arrancar.
3. Al abrir, la app se **adelanta al mayor número que encuentre**: en las recepciones
   de OC, en las regularizaciones, en la bandeja de pallets y en las ubicaciones.
   Nunca reparte un código que ya exista.
4. En **Datos** hay dos botones, *Fijar último MP* y *Fijar último RG*, para teléfonos
   nuevos o si se perdieron los datos: se escribe el último número ya emitido en
   bodega. Solo acepta números mayores al actual; hacia atrás no deja.

### Lo único que sí borra el contador

El número está guardado **por sitio web**. Se pierde si:

- se cambia la dirección del sitio (otra cuenta de GitHub u otro dominio) — dentro de
  la misma cuenta `TU-USUARIO.github.io` no hay problema, aunque cambies de repositorio;
- alguien borra los datos del navegador o desinstala la app del teléfono;
- se usa un teléfono nuevo que nunca abrió la app.

En esos tres casos el remedio es el mismo: **Datos → Fijar último MP / Fijar último RG**
con el último número emitido. Por eso conviene anotarlo cada cierto tiempo.

### Importante si son varios teléfonos

Cada teléfono lleva su propia cuenta: no hay servidor que los coordine. Si dos
teléfonos registran al mismo tiempo, los dos pueden entregar el mismo MP. Formas de
evitarlo: que **un solo teléfono** emita contenedores, o repartir rangos por equipo con
*Fijar último MP* (por ejemplo, teléfono 1 desde 0, teléfono 2 desde 50000).

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
