document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contact-form');

    // Suaviza el desplazamiento al hacer clic en los enlaces de la barra de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Obtiene el href del enlace
            const href = this.getAttribute('href');
            
            // Si es un enlace de anclaje (#), hacer scroll suave
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                // Desplazamiento suave hacia la sección
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
            // Si es una ruta normal (/, /Enciclopedia/..., /Auth/...), permitir navegación normal
            // No hacer preventDefault(), dejar que el navegador maneje la navegación
        });
    });

    // Simulación de envío de formulario (para un feedback intuitivo)
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto. (Función simulada)');
            
            // Opcional: Limpiar el formulario
            contactForm.reset();
        });
    }

    // Nota: Las mini animaciones de hover (sobre botones y tarjetas)
    // se gestionan directamente en el código CSS con la propiedad 'transition' y ':hover',
    // lo cual es más eficiente y minimalista que usar JavaScript para esos efectos simples.
});