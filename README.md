# 🌸 MI TIENDA ONLINE - GUÍA COMPLETA

## 📁 ESTRUCTURA DE CARPETAS

```
mi-tienda-online/
├── index.html          ← Página principal (EDITA AQUÍ LOS TEXTOS)
├── css/
│   └── styles.css      ← Estilos y colores (CAMBIA COLORES AQUÍ)
├── js/
│   └── script.js       ← Funcionalidad (CAMBIA NÚMERO DE WHATSAPP AQUÍ)
└── images/             ← SUBE TUS FOTOS AQUÍ
    ├── manualidades/   ← Fotos de manualidades
    ├── flores/         ← Fotos de arreglos florales
    └── regalos/        ← Fotos de regalos
```

---

## 🎨 CÓMO AGREGAR TUS FOTOS

### Paso 1: Prepara tus fotos
- **Formato recomendado**: JPG o PNG
- **Tamaño recomendado**: Máximo 1MB por foto (para que cargue rápido)
- **Nombre de archivo**: usa nombres simples sin espacios ni caracteres especiales
  - ✅ BIEN: `producto1.jpg`, `ramo-rosas.jpg`
  - ❌ MAL: `Mi Foto Con Espacios.jpg`, `foto#1.jpg`

### Paso 2: Organiza tus fotos en carpetas
Copia tus fotos en las carpetas correspondientes:
- **Manualidades** → carpeta `images/manualidades/`
- **Flores** → carpeta `images/flores/`
- **Regalos** → carpeta `images/regalos/`

### Paso 3: Actualiza el HTML
Abre el archivo `index.html` y busca las líneas que dicen:
```html
<img src="images/manualidades/producto1.jpg" alt="Cuadros Decorativos">
```

Cambia `producto1.jpg` por el nombre de TU foto:
```html
<img src="images/manualidades/mi-cuadro.jpg" alt="Cuadros Decorativos">
```

---

## ✏️ CÓMO EDITAR LOS TEXTOS Y PRECIOS

Abre `index.html` y busca las secciones que dicen `<!-- PRODUCTO 1 - CAMBIA AQUÍ -->`

### Ejemplo de producto:
```html
<div class="product-card">
    <img src="images/manualidades/producto1.jpg" alt="Cuadros Decorativos">
    <div class="product-info">
        <h3>Cuadros Decorativos</h3>              ← TÍTULO DEL PRODUCTO
        <p>Diseños únicos hechos a mano</p>       ← DESCRIPCIÓN
        <div class="product-price">Desde $15</div> ← PRECIO
    </div>
</div>
```

Simplemente cambia el texto entre las etiquetas:
- `<h3>TU TÍTULO AQUÍ</h3>`
- `<p>Tu descripción aquí</p>`
- `<div class="product-price">Desde $20</div>`

---

## ➕ CÓMO AGREGAR MÁS PRODUCTOS

### Opción 1: Copiar y pegar
1. Copia TODO el bloque desde `<div class="product-card">` hasta `</div>`
2. Pégalo debajo del último producto en la misma sección
3. Cambia la imagen, título, descripción y precio

### Opción 2: Crear nueva sección
Si quieres agregar una categoría nueva (por ejemplo "Decoraciones"):
1. Copia toda una sección completa (desde `<section id="manualidades">` hasta `</section>`)
2. Cambia el `id` y el título
3. Agrega tus productos dentro

---

## 📱 CÓMO CAMBIAR EL NÚMERO DE WHATSAPP

Debes cambiar el número en **3 lugares**:

### 1. En `index.html` (Botón flotante):
Busca:
```html
<a href="https://wa.me/593999999999?text=...
```
Cambia `593999999999` por tu número (incluye código de país, sin +)

### 2. En `index.html` (Sección de contacto):
Busca:
```html
<a href="https://wa.me/593999999999?text=...
```
Cambia `593999999999` por tu número

### 3. En `js/script.js`:
Busca:
```javascript
const phoneNumber = '593999999999';
```
Cambia por tu número

**IMPORTANTE**: 
- Ecuador: `593` + tu número (ejemplo: `593987654321`)
- USA: `1` + tu número (ejemplo: `12025551234`)
- España: `34` + tu número (ejemplo: `34612345678`)

---

## 🎨 CÓMO CAMBIAR LOS COLORES

Abre `css/styles.css` y al inicio verás:

```css
:root {
    --color-principal: #667eea;    ← Color morado principal
    --color-secundario: #764ba2;   ← Color morado oscuro
    --color-whatsapp: #25d366;     ← Color verde de WhatsApp
    --color-fondo: #fdf8f5;        ← Color de fondo beige
}
```

Cambia los códigos de color (puedes buscar "color picker" en Google para elegir colores).

### Ejemplos de combinaciones:
- **Rosa y fucsia**: `#ff6b9d` y `#c44569`
- **Azul suave**: `#4facfe` y `#00f2fe`
- **Verde menta**: `#56ab2f` y `#a8e063`
- **Naranja vibrante**: `#f46b45` y `#eea849`

---

## 🚀 CÓMO SUBIR A VERCEL

### Opción 1: Usando GitHub (RECOMENDADO)

1. **Crea una cuenta en GitHub** (si no tienes): https://github.com
2. **Crea un nuevo repositorio**:
   - Click en "New repository"
   - Ponle un nombre (ejemplo: `mi-tienda`)
   - Márcalo como "Public"
   - Click en "Create repository"

3. **Sube tus archivos**:
   - Click en "uploading an existing file"
   - Arrastra TODA la carpeta `mi-tienda-online`
   - Click en "Commit changes"

4. **Conecta con Vercel**:
   - Ve a https://vercel.com
   - Inicia sesión con tu cuenta de GitHub
   - Click en "New Project"
   - Selecciona tu repositorio `mi-tienda`
   - Click en "Deploy"
   - ¡LISTO! En 1 minuto tendrás tu página online

### Opción 2: Arrastrando archivos directamente

1. Ve a https://vercel.com e inicia sesión
2. Click en "New Project"
3. Click en "Deploy from Archive"
4. Arrastra la carpeta `mi-tienda-online`
5. Click en "Deploy"

**Tu página estará en una URL como**: `mi-tienda.vercel.app`

---

## 🚀 CÓMO SUBIR A RAILWAY

### Usando GitHub:

1. **Sube tu proyecto a GitHub** (igual que arriba)

2. **Conecta con Railway**:
   - Ve a https://railway.app
   - Inicia sesión con GitHub
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Elige tu repositorio
   - Railway detectará automáticamente que es una página estática
   - Click en "Deploy"

3. **Configura el dominio**:
   - Click en tu proyecto
   - Ve a "Settings" → "Domains"
   - Railway te dará una URL automática

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Las imágenes no se ven
✅ Verifica que:
- El nombre del archivo en el HTML coincide EXACTAMENTE con el nombre de la foto
- La foto está en la carpeta correcta (`images/manualidades/`, etc.)
- El nombre no tiene espacios ni caracteres especiales

### El botón de WhatsApp no funciona
✅ Verifica que:
- Cambiaste el número en los 3 lugares mencionados arriba
- El número incluye el código de país
- No pusiste el símbolo `+` antes del número

### La página no se despliega
✅ Verifica que:
- Subiste TODOS los archivos (HTML, CSS, JS, imágenes)
- La estructura de carpetas está intacta
- El archivo principal se llama `index.html` (en minúsculas)

---

## 📝 CONSEJOS IMPORTANTES

1. **Guarda copias de seguridad**: Antes de hacer cambios grandes, guarda una copia de tus archivos

2. **Prueba localmente primero**: Abre el archivo `index.html` en tu navegador para ver los cambios antes de subir

3. **Optimiza las imágenes**: Usa herramientas como TinyPNG.com para reducir el tamaño de tus fotos sin perder calidad

4. **Actualiza regularmente**: Cada vez que agregues nuevos productos, sube los cambios a GitHub y se actualizarán automáticamente en Vercel/Railway

5. **Nombres descriptivos**: Usa nombres de archivo que describan el producto (ejemplo: `ramo-rosas-rojas.jpg`)

---

## 🔄 ACTUALIZACIONES FUTURAS

Cuando quieras agregar funcionalidad de compra directa:
- Puedes integrar Stripe, MercadoPago o PayPal
- Agregar un carrito de compras
- Sistema de inventario
- Panel de administración

¡Por ahora tienes una página funcional para mostrar tus productos y recibir pedidos por WhatsApp!

---

## 💡 ¿NECESITAS AYUDA?

Si tienes problemas:
1. Revisa esta guía paso a paso
2. Busca tutoriales en YouTube sobre "subir página a Vercel"
3. Contacta a alguien que sepa de programación básica

**¡Mucha suerte con tu tienda online! 🚀✨**
