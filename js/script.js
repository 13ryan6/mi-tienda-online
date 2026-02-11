/* 
===============================================
JAVASCRIPT PARA LA TIENDA
===============================================
Este archivo hace que la página sea interactiva
*/

// ============================================
// NAVEGACIÓN SUAVE
// ============================================
// Cuando haces clic en el menú, se desplaza suavemente
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// ANIMACIÓN DE CARGA DE TARJETAS
// ============================================
// Las tarjetas aparecen con una animación al cargar la página
window.addEventListener('load', () => {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s, transform 0.5s';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
});

// ============================================
// CLICK EN PRODUCTO
// ============================================
// Cuando haces clic en un producto, abre WhatsApp con el nombre del producto
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function() {
        const productName = this.querySelector('h3').textContent;
        
        // CAMBIA ESTE NÚMERO DE WHATSAPP
        const phoneNumber = '593999999999'; // <-- PON TU NÚMERO AQUÍ
        
        const message = `Hola! Me interesa el producto: ${productName}`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
    });
});

// ============================================
// MANEJO DE ERRORES DE IMÁGENES
// ============================================
// Si una imagen no carga, muestra un placeholder
document.querySelectorAll('.product-image').forEach(img => {
    img.addEventListener('error', function() {
        this.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
        this.style.display = 'flex';
        this.style.alignItems = 'center';
        this.style.justifyContent = 'center';
        this.innerHTML = '📸';
        this.style.fontSize = '4rem';
    });
});
