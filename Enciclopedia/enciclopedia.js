// Este script contendrá la lógica de la enciclopedia interactiva.

// Datos de ejemplo para las 10 razas por tipo de animal
const datosEnciclopedia = {
    'perro': [
        { nombre: "Labrador Retriever", imagen: "../Enciclopedia/imagenesAnimales/LabradorRetriever.png" },
        { nombre: "Pastor Alemán", imagen: "../Enciclopedia/imagenesAnimales/PastorAlemán.png" },
        { nombre: "Golden Retriever", imagen: "../Enciclopedia/imagenesAnimales/GoldenRetriever.png" },
        { nombre: "Bulldog Francés", imagen: "../Enciclopedia/imagenesAnimales/BulldogFrancés.png" },
        { nombre: "Poodle", imagen: "../Enciclopedia/imagenesAnimales/Poodle.png" },
        { nombre: "Rottweiler", imagen: "../Enciclopedia/imagenesAnimales/Rottweiler.png" },
        { nombre: "Beagle", imagen: "../Enciclopedia/imagenesAnimales/Beagle.png" },
        { nombre: "Dachshund", imagen: "../Enciclopedia/imagenesAnimales/DachshundPerroSalchicha.png" },
        { nombre: "Boxer", imagen: "../Enciclopedia/imagenesAnimales/Boxer.png" },
        { nombre: "Chihuahua", imagen: "../Enciclopedia/imagenesAnimales/Chihuahua.png" }
    ],
    'gato': [
        { nombre: "Siamés", imagen: "../Enciclopedia/imagenesAnimales/siames.jpg" },
        { nombre: "Maine Coon", imagen: "../Enciclopedia/imagenesAnimales/mainecoon.jpg" },
        { nombre: "Persa", imagen: "../Enciclopedia/imagenesAnimales/persa.jpg" },
        { nombre: "Bengalí", imagen: "../Enciclopedia/imagenesAnimales/bengali.jpg" },
        { nombre: "Sphynx", imagen: "../Enciclopedia/imagenesAnimales/sphynx.jpg" },
        { nombre: "Ragdoll", imagen: "../Enciclopedia/imagenesAnimales/ragdoll.jpg" },
        { nombre: "Británico Pelo Corto", imagen: "../Enciclopedia/imagenesAnimales/bsh.jpg" },
        { nombre: "Scottish Fold", imagen: "../Enciclopedia/imagenesAnimales/scottishfold.jpg" },
        { nombre: "Abisinio", imagen: "../Enciclopedia/imagenesAnimales/abisinio.jpg" },
        { nombre: "Burmese", imagen: "../Enciclopedia/imagenesAnimales/burmese.jpg" }
    ],
    // Simular 10 razas para los demás tipos (por ahora, solo con nombre genérico)
    'conejo': Array.from({ length: 10 }, (_, i) => ({ nombre: `Conejo Raza ${i + 1}`, imagen: "conejo.jpg" })),
    'pajaro': Array.from({ length: 10 }, (_, i) => ({ nombre: `Pájaro Tipo ${i + 1}`, imagen: "pajaro.jpg" })),
    'pez': Array.from({ length: 10 }, (_, i) => ({ nombre: `Pez Especie ${i + 1}`, imagen: "pez.jpg" })),
};

function mostrarRazas(tipoAnimal) {
    const razas = datosEnciclopedia[tipoAnimal];
    const razasContainer = document.getElementById('razas-container');
    const tiposGrid = document.getElementById('tipos-grid');
    const selectorTitulo = document.getElementById('selector-titulo');
    const selectorSubtitulo = document.getElementById('selector-subtitulo');


    if (!razas || !razasContainer || !tiposGrid) return;
    
    // 1. Ocultar el selector de tipos y actualizar títulos
    tiposGrid.style.display = 'none';
    razasContainer.style.display = 'block';
    selectorTitulo.textContent = `Explora las Razas de ${tipoAnimal.charAt(0).toUpperCase() + tipoAnimal.slice(1)}`;
    selectorSubtitulo.textContent = 'Selecciona una raza para ver detalles.';
    
    // 2. Botón para volver al selector de tipos
    let htmlContent = `<div class="cta-button" id="back-to-tipos" style="margin-bottom: 30px;">
                        ← Volver a Tipos de Animales
                    </div>`;

    // 3. Grid de las 10 razas
    htmlContent += '<div class="razas-grid">';
    
    razas.forEach(raza => {
        htmlContent += `
            <div class="animal-card raza-card" data-raza="${raza.nombre.toLowerCase().replace(/\s/g, '-')}" title="Ver detalles de ${raza.nombre}">
                <img src="${raza.imagen}" alt="${raza.nombre}" class="animal-img">
                <p class="animal-name">${raza.nombre}</p>
            </div>
        `;
    });
    
    htmlContent += '</div>';

    razasContainer.innerHTML = htmlContent;

    // 4. Añadir eventos a cada tarjeta de raza para abrir modal con info y publicaciones
    const razaCards = razasContainer.querySelectorAll('.raza-card');
    razaCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const raza = card.getAttribute('data-raza');
            abrirModalRaza(raza, card.querySelector('.animal-name').textContent, card.querySelector('.animal-img').src);
        });
    });

    // 4. Añadir evento al botón de volver
    document.getElementById('back-to-tipos').addEventListener('click', () => {
        // Ocultar las razas y mostrar los tipos
        razasContainer.style.display = 'none';
        tiposGrid.style.display = 'grid';
        razasContainer.innerHTML = ''; // Limpiar el contenido
        
        // Restaurar títulos
        selectorTitulo.textContent = 'Elige el Tipo de Mascota que te Interesa';
        selectorSubtitulo.textContent = 'Haz clic en una categoría para ver las 10 razas más populares y sus detalles.';
        
        // Mover al usuario al inicio de la sección
        document.getElementById('enciclopedia-completa').scrollIntoView({ behavior: 'smooth' });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Solo si estamos en la página de enciclopedia
    if (document.getElementById('enciclopedia-completa')) {
        const animalCards = document.querySelectorAll('.animal-card');

        animalCards.forEach(card => {
            card.addEventListener('click', () => {
                const tipo = card.getAttribute('data-animal');
                mostrarRazas(tipo);
                // Mover al usuario al inicio de la sección para ver las razas
                document.getElementById('selector-titulo').scrollIntoView({ behavior: 'smooth' });
            });
        });
        // Inicializar modal y posts
        initRazaModal();
        initPhotoPreview();
    }
});

/* ------------------ Photo preview modal ------------------ */
function initPhotoPreview() {
    const modal = document.getElementById('photoPreviewModal');
    if (!modal) return;
    const overlay = document.getElementById('photoModalOverlay');
    const closeBtn = document.getElementById('photoModalClose');
    overlay && overlay.addEventListener('click', () => closePhotoPreview());
    closeBtn && closeBtn.addEventListener('click', () => closePhotoPreview());
}

function openPhotoPreview(src, caption) {
    const modal = document.getElementById('photoPreviewModal');
    if (!modal) return;
    const img = document.getElementById('previewImage');
    const cap = document.getElementById('previewCaption');
    img.src = src;
    cap.textContent = caption || '';
    modal.setAttribute('aria-hidden', 'false');
}

function closePhotoPreview() {
    const modal = document.getElementById('photoPreviewModal');
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    const img = document.getElementById('previewImage');
    if (img) img.src = '';
    const cap = document.getElementById('previewCaption');
    if (cap) cap.textContent = '';
}

/* ------------------ Modal y sistema de publicaciones (localStorage para pruebas) ------------------ */

function initRazaModal() {
    const modal = document.getElementById('razaModal');
    if (!modal) return;
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');

    overlay && overlay.addEventListener('click', () => closeModal());
    closeBtn && closeBtn.addEventListener('click', () => closeModal());

    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handlePostSubmit();
        });
    }
}

// Información detallada de las razas
const infoRazas = {
    'labrador': {
        descripcion: 'El Labrador Retriever es una de las razas de perros más populares del mundo. Originario de Canadá, fue desarrollado inicialmente para ayudar a los pescadores a recuperar redes y peces. Son perros de tamaño mediano a grande, con un peso entre 25-36 kg. Su pelaje es corto, denso y resistente al agua, con colores negro, amarillo o chocolate.',
        temperamento: 'Amigable, gentil y extremadamente sociable. Son conocidos por su paciencia con los niños y su naturaleza leal. Muy inteligentes y fáciles de entrenar, ocupan el 7º lugar en inteligencia canina. Tienen un apetito voraz y necesitan ejercicio diario.',
        cuidados: 'Requieren ejercicio regular, cepillado semanal (diario durante la muda), y control de su alimentación para evitar sobrepeso. Son propensos a displasia de cadera. Expectativa de vida: 10-12 años.'
    },
    'pastor-aleman': {
        descripcion: 'El Pastor Alemán es una raza originaria de Alemania, desarrollada a finales del siglo XIX para el pastoreo de ovejas. Son perros de tamaño grande, con peso entre 30-40 kg los machos y 22-32 kg las hembras. Su altura varía de 60-65 cm en machos y 55-60 cm en hembras. Tienen un pelaje doble, denso y resistente.',
        temperamento: 'Perro equilibrado, inteligente, valiente y leal. Excelente para el trabajo, ocupando el 3º lugar en inteligencia canina. Son protectores de su familia pero amigables cuando se socializan correctamente. Muy versátiles: perros policía, de rescate, guías para ciegos y compañía.',
        cuidados: 'Necesitan ejercicio diario intenso y estimulación mental. Cepillado frecuente, especialmente durante la muda. Propensos a displasia de cadera y problemas digestivos. Expectativa de vida: 9-13 años.'
    },
    'golden-retriever': {
        descripcion: 'El Golden Retriever se originó en Escocia a mediados del siglo XIX para recuperar aves de caza en terrenos difíciles. Son perros de tamaño mediano a grande, con peso de 28-33 kg en machos y 26-30 kg en hembras. Su pelaje dorado característico es denso, repelente al agua y ligeramente ondulado.',
        temperamento: 'Extremadamente amigable, confiado y gentil. Excelentes con niños y otras mascotas. Muy inteligentes (4º lugar en inteligencia canina), son ideales como perros de terapia, guías y de asistencia. Les encanta el agua y son muy juguetones incluso de adultos.',
        cuidados: 'Requieren ejercicio diario moderado a intenso. Cepillado semanal (más frecuente durante la muda). Propensos a displasia de cadera, problemas cardíacos y obesidad. Expectativa de vida: 10-12 años.'
    },
    'bulldog-frances': {
        descripcion: 'El Bulldog Francés es una raza pequeña de origen francés, desarrollada en el siglo XIX como perro de compañía. Pesan entre 8-14 kg y miden 28-33 cm de altura. Son fácilmente reconocibles por sus orejas de "murciélago", cara chata y cuerpo compacto y musculoso.',
        temperamento: 'Cariñoso, juguetón y adaptable. Excelentes perros de compañía para apartamentos. Son sociables con personas y otros animales. No ladran excesivamente. Les gusta estar cerca de sus dueños y pueden ser algo tercos, pero son leales y afectuosos.',
        cuidados: 'Ejercicio moderado, no soportan bien el calor extremo debido a su hocico chato. Limpieza regular de arrugas faciales. Propensos a problemas respiratorios y de columna vertebral. Expectativa de vida: 10-12 años.'
    },
    'poodle': {
        descripcion: 'El Poodle (Caniche) es una raza muy antigua, originaria de Alemania y desarrollada en Francia. Vienen en tres tamaños: toy (24-28 cm), miniatura (28-35 cm) y estándar (45-60 cm). Su pelaje es rizado, denso e hipoalergénico, de diversos colores incluyendo blanco, negro, albaricoque, gris y marrón.',
        temperamento: 'Extremadamente inteligente (2º lugar en inteligencia canina), elegante y versátil. Son activos, juguetones y fáciles de entrenar. Excelentes nadadores y perros de trabajo. Sociables con personas y otros animales. Pueden ser algo sensibles.',
        cuidados: 'Requieren cepillado frecuente y corte profesional cada 6-8 semanas. Ejercicio diario moderado. Propensos a problemas dentales y de oído. Expectativa de vida: 12-15 años.'
    },
    'rottweiler': {
        descripcion: 'El Rottweiler es una raza alemana antigua, utilizada originalmente para arrear ganado y tirar de carros. Son perros grandes y robustos, con peso de 50-60 kg en machos y 35-48 kg en hembras. Su pelaje es corto, negro con marcas color fuego bien definidas.',
        temperamento: 'Seguro de sí mismo, valiente y leal. Excelentes perros guardianes pero equilibrados y calmados cuando se socializan correctamente. Muy protectores de su familia. Inteligentes y obedientes, necesitan un líder firme pero amoroso.',
        cuidados: 'Ejercicio diario intenso y socialización temprana son esenciales. Cepillado semanal. Propensos a displasia de cadera y problemas cardíacos. Expectativa de vida: 8-10 años.'
    },
    'beagle': {
        descripcion: 'El Beagle es una raza británica de perros sabuesos, desarrollada para la caza de conejos y liebres. Son de tamaño pequeño a mediano, pesando 9-11 kg y midiendo 33-40 cm de altura. Su pelaje es corto y denso, típicamente tricolor (blanco, negro y marrón) o bicolor.',
        temperamento: 'Amigable, curioso y alegre. Excelentes con niños y sociables con otros perros. Tienen un olfato excepcional y pueden seguir rastros con determinación. Son juguetones y enérgicos. Pueden ser algo tercos y tienden a vocalizar (aullidos).',
        cuidados: 'Necesitan ejercicio diario y estimulación mental. Cepillado semanal. Propensos a obesidad, problemas de oído y epilepsia. Su instinto de caza es fuerte, por lo que requieren cercas seguras. Expectativa de vida: 12-15 años.'
    },
    'dachshund': {
        descripcion: 'El Dachshund (Teckel o perro salchicha) es una raza alemana desarrollada para cazar tejones y otros animales de madriguera. Tienen un cuerpo alargado y patas cortas. Hay tres variedades de pelaje (liso, de pelo largo y de pelo duro) y dos tamaños (estándar: 7-14 kg, miniatura: hasta 5 kg).',
        temperamento: 'Valiente, inteligente y a veces terco. A pesar de su tamaño pequeño, son perros audaces y tienen un ladrido sorprendentemente fuerte. Leales y cariñosos con su familia. Pueden ser reservados con extraños. Son juguetones y enérgicos.',
        cuidados: 'Ejercicio moderado, evitando saltos y escaleras para proteger su espalda larga. Cepillado según el tipo de pelaje. Muy propensos a problemas de columna vertebral (enfermedad del disco intervertebral). Expectativa de vida: 12-16 años.'
    },
    'boxer': {
        descripcion: 'El Boxer es una raza alemana desarrollada a finales del siglo XIX, originalmente para caza y guardia. Son perros medianos a grandes, con peso de 30-38 kg en machos y 25-32 kg en hembras. Su pelaje es corto y brillante, generalmente atigrado o leonado con marcas blancas.',
        temperamento: 'Enérgico, juguetón y leal. Excelentes con niños y muy protectores de su familia. Inteligentes pero pueden ser tercos. Mantienen un comportamiento de cachorro hasta la edad adulta. Necesitan socialización temprana. Son vigilantes pero amigables.',
        cuidados: 'Requieren mucho ejercicio diario y estimulación mental. Cepillado mínimo. Sensibles al calor y al frío extremos. Propensos a problemas cardíacos y cáncer. Expectativa de vida: 10-12 años.'
    },
    'chihuahua': {
        descripcion: 'El Chihuahua es la raza de perro más pequeña del mundo, originaria de México. Pesan entre 1.5-3 kg y miden 15-23 cm de altura. Existen dos variedades: de pelo corto y de pelo largo. Sus ojos grandes y expresivos y orejas erguidas son característicos.',
        temperamento: 'Valiente, alerta y vivaz a pesar de su tamaño diminuto. Muy leales a su dueño y pueden ser protectores. A veces desconfiados con extraños. Inteligentes y pueden ser entrenados, aunque a veces tercos. Les gusta estar calientes y buscan refugio.',
        cuidados: 'Ejercicio moderado, son buenos para apartamentos. Cepillado según el tipo de pelaje. Sensibles al frío. Propensos a problemas dentales, luxación de rótula e hipoglucemia. Requieren socialización para evitar agresividad. Expectativa de vida: 12-20 años.'
    },
    'siames': {
        descripcion: 'El Siamés es una de las razas de gatos más antiguas y reconocibles, originaria de Tailandia (antiguo Siam). Son gatos de tamaño mediano, con peso entre 2.5-4.5 kg. Su característica principal es el patrón "pointed": cuerpo claro con extremidades, cara, orejas y cola más oscuras. Tienen ojos azules almendrados.',
        temperamento: 'Extremadamente vocal y comunicativo, conocido por sus maullidos distintivos. Muy inteligente, curioso y social. Busca activamente la interacción humana y no le gusta estar solo. Forma vínculos fuertes con sus dueños. Juguetón y activo durante toda su vida.',
        cuidados: 'Cepillado semanal. Necesitan estimulación mental y compañía constante. Son gatos de interior. Propensos a problemas respiratorios y dentales. Su vista nocturna es limitada comparada con otros gatos. Expectativa de vida: 10-12.5 años.'
    },
    'maine-coon': {
        descripcion: 'El Maine Coon es una de las razas de gatos domésticos más grandes, originaria de Estados Unidos (Maine). Los machos pesan 5.9-8.2 kg y las hembras 3.6-5.4 kg, pudiendo alcanzar hasta 120 cm de longitud. Tienen pelaje semilargo, denso y resistente al agua, con una gorguera leonina distintiva.',
        temperamento: 'Conocidos como "gigantes gentiles". Amigables, sociables e inteligentes. Se llevan bien con niños, perros y otros gatos. Independientes pero cariñosos, no son gatos falderos. Tienen fascinación por el agua. Muy vocales, usando trinos y chirridos para comunicarse.',
        cuidados: 'Cepillado 2-3 veces por semana. Necesitan espacio para moverse. Maduran lentamente (3-5 años). Propensos a miocardiopatía hipertrófica y displasia de cadera. Dieta alta en proteínas. Expectativa de vida: 12.5 años.'
    },
    'persa': {
        descripcion: 'El Persa es una raza de gato de origen iraní, muy popular por su pelaje largo y lujoso. Son gatos de tamaño mediano a grande. Su característica más distintiva es su cara plana con nariz chata, ojos grandes y redondos, y pelaje abundante que puede ser de muchos colores.',
        temperamento: 'Tranquilo, dócil y aristocrático. Conocidos como "tigres del sofá" por su naturaleza relajada. Prefieren ambientes tranquilos y predecibles. Cariñosos y leales con su familia. Menos activos y juguetones que otras razas. Son presumidos y disfrutan de la atención.',
        cuidados: 'Cepillado diario obligatorio para evitar enredos. Limpieza regular de ojos y cara debido a lagrimeo. Baños regulares. Propensos a problemas respiratorios, renales (PKD) y cardíacos. Son gatos de interior. Expectativa de vida: 12-17 años.'
    },
    'bengali': {
        descripcion: 'El Bengalí es una raza híbrida desarrollada al cruzar gatos domésticos con el gato leopardo asiático. Son gatos de tamaño mediano a grande, pesando 4.5-7 kg. Su pelaje corto tiene un patrón moteado o marmolado distintivo que les da una apariencia salvaje, con un brillo "glitter" único.',
        temperamento: 'Extremadamente activo, atlético y enérgico. Muy inteligente y curioso, disfrutan de juegos interactivos y pueden aprender trucos. Les encanta el agua y trepar. Vocales y sociales. Necesitan mucha estimulación y no son aptos para dueños sedentarios.',
        cuidados: 'Cepillado mínimo semanal. Necesitan mucho ejercicio, juguetes y enriquecimiento ambiental. Árboles para gatos altos son esenciales. Generalmente saludables. Pueden ser propensos a problemas cardíacos hereditarios. Expectativa de vida: 12-16 años.'
    },
    'sphynx': {
        descripcion: 'El Sphynx es una raza de gato sin pelo desarrollada en Canadá en los años 60. Son de tamaño mediano, pesando 3.5-7 kg. Aunque parecen sin pelo, tienen una fina capa de vello. Su piel arrugada y cuerpo musculoso son característicos. Tienen orejas grandes y ojos expresivos.',
        temperamento: 'Extremadamente cariñoso y social, a menudo descrito como "perro en cuerpo de gato". Busca constantemente calor y compañía humana. Muy juguetón, acrobático y activo. Inteligente y curioso. Se lleva bien con niños y otras mascotas. No le gusta estar solo.',
        cuidados: 'Baños semanales necesarios para eliminar aceites de la piel. Protección contra frío y sol (quemaduras). Limpieza regular de orejas. Mayor metabolismo requiere más alimento. Propensos a problemas cardíacos y de piel. Expectativa de vida: 8-14 años.'
    },
    'ragdoll': {
        descripcion: 'El Ragdoll es una raza americana desarrollada en los años 60. Son gatos grandes, con machos pesando 6-9 kg y hembras 4.5-6.8 kg. Tienen pelaje semilargo, sedoso y de patrón pointed similar al siamés. Sus ojos azules y carácter dócil son distintivos. Su nombre significa "muñeca de trapo".',
        temperamento: 'Extremadamente dócil y relajado, se relajan completamente cuando se les carga. Muy cariñosos y gentiles. Siguen a sus dueños por la casa. Tolerantes con niños y otras mascotas. No son agresivos ni defensivos. Prefieren estar a nivel del suelo. Vocalmente suaves.',
        cuidados: 'Cepillado 2-3 veces por semana. Gatos de interior debido a su naturaleza confiada. Pueden ser propensos a obesidad. Susceptibles a miocardiopatía hipertrófica y problemas renales. Expectativa de vida: 12-17 años.'
    },
    'britanico-pelo-corto': {
        descripcion: 'El Británico de Pelo Corto es una raza antigua originaria de Gran Bretaña. Son gatos robustos y musculosos de tamaño mediano a grande, pesando 4-8 kg. Su pelaje denso y afelpado, típicamente azul-gris (British Blue), es su característica más notable. Tienen cara redonda con mejillas prominentes.',
        temperamento: 'Tranquilo, independiente y digno. Cariñosos pero no demandantes. Toleran bien estar solos. Juguetones en su juventud pero más sedentarios de adultos. Buenos con niños y otras mascotas. No vocales. Maduran lentamente (3-5 años).',
        cuidados: 'Cepillado semanal (diario durante muda). Propensos a obesidad, por lo que requieren control de alimentación y ejercicio. Susceptibles a miocardiopatía hipertrófica y PKD. Expectativa de vida: 14-20 años.'
    },
    'scottish-fold': {
        descripcion: 'El Scottish Fold es una raza originaria de Escocia, famosa por sus orejas dobladas hacia adelante y abajo, resultado de una mutación genética. Son gatos de tamaño mediano, pesando 2.7-6 kg. Tienen ojos grandes y redondos, y cuerpo redondeado. El pelaje puede ser corto o largo.',
        temperamento: 'Dulce, tranquilo y adaptable. Muy cariñosos y apegados a su familia. Se llevan bien con niños y otras mascotas. No son muy vocales. Disfrutan de la compañía humana y pueden ser juguetones. Prefieren estar cerca de sus dueños.',
        cuidados: 'Cepillado semanal (más frecuente en variedad de pelo largo). Limpieza regular de orejas. La mutación genética puede causar problemas articulares severos (osteocondrodisplasia). Propensos a problemas cardíacos. Expectativa de vida: 11-14 años.'
    },
    'abisinio': {
        descripcion: 'El Abisinio es una de las razas de gatos más antiguas, posiblemente originaria de Etiopía (antigua Abisinia). Son gatos de tamaño mediano, pesando 3.5-5.5 kg, con cuerpo elegante y musculoso. Su pelaje corto tiene un patrón "ticked" único donde cada pelo tiene bandas de color.',
        temperamento: 'Extremadamente activo, curioso e inteligente. Muy juguetón y atlético, disfruta trepar y explorar. Social y cariñoso, pero no faldero. Necesita mucha interacción y estimulación. Vocal moderado. Se lleva bien con otras mascotas activas.',
        cuidados: 'Cepillado semanal. Necesita mucho enriquecimiento ambiental, juguetes y atención. Susceptible a problemas dentales, atrofia retinal progresiva y amiloidosis renal. Generalmente saludable. Expectativa de vida: 9-15 años.'
    },
    'burmese': {
        descripcion: 'El Burmés (Birmano) es una raza originaria de Birmania (Myanmar) y desarrollada en Estados Unidos. Son gatos de tamaño mediano, pesando 3.6-6.3 kg. Tienen cuerpo compacto y musculoso. Su pelaje corto y satinado es típicamente marrón oscuro (sable), aunque existen otros colores.',
        temperamento: 'Extremadamente cariñoso y orientado a las personas, a menudo descrito como "perro-gato". Muy vocal y comunicativo. Juguetón y enérgico durante toda su vida. Busca activamente la interacción y no le gusta estar solo. Inteligente y puede aprender trucos.',
        cuidados: 'Cepillado mínimo semanal. Necesita compañía constante y estimulación. Propenso a diabetes, defectos craneofaciales y miocardiopatía hipertrófica. Sensible a la anestesia. Expectativa de vida: 16-18 años.'
    }
};

function abrirModalRaza(razaId, razaNombre, imagenSrc) {
    const modal = document.getElementById('razaModal');
    if (!modal) return;
    const modalTitle = document.getElementById('modalTitle');
    const modalRazaDesc = document.getElementById('modalRazaDesc');
    const mustLogin = document.getElementById('mustLogin');
    const postForm = document.getElementById('postForm');

    modal.setAttribute('aria-hidden', 'false');
    modalTitle.textContent = razaNombre;
    
    // Obtener información detallada de la raza
    const info = infoRazas[razaId];
    let descripcionHTML = '';
    
    if (info) {
        descripcionHTML = `
            <div class="info-raza-detalle">
                <h4>📋 Descripción</h4>
                <p>${info.descripcion}</p>
                
                <h4>🐾 Temperamento</h4>
                <p>${info.temperamento}</p>
                
                <h4>💚 Cuidados</h4>
                <p>${info.cuidados}</p>
            </div>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        `;
    }
    
    descripcionHTML += `<p>Aquí tienes información básica de <strong>${razaNombre}</strong>. Puedes compartir fotos de tu mascota si inicias sesión.</p>`;
    
    modalRazaDesc.innerHTML = descripcionHTML;
    modal.dataset.raza = razaId;

    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuario) {
        mustLogin && (mustLogin.style.display = 'block');
        postForm && (postForm.style.display = 'none');
    } else {
        mustLogin && (mustLogin.style.display = 'none');
        postForm && (postForm.style.display = 'flex');
    }

    renderPostsForRaza(razaId);
}

function closeModal() {
    const modal = document.getElementById('razaModal');
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    const imgInput = document.getElementById('postImage');
    const caption = document.getElementById('postCaption');
    if (imgInput) imgInput.value = '';
    if (caption) caption.value = '';
}

function renderPostsForRaza(razaId) {
    const postsList = document.getElementById('postsList');
    if (!postsList) return;
    postsList.innerHTML = '';
    const all = JSON.parse(localStorage.getItem('posts') || '[]');
    const posts = all.filter(p => p.raza === razaId).sort((a,b) => new Date(b.created) - new Date(a.created));

    if (posts.length === 0) {
        postsList.innerHTML = '<p>No hay publicaciones aún. Sé el primero en compartir una foto si estás registrado.</p>';
        return;
    }

    posts.forEach(p => {
        const div = document.createElement('div');
        div.className = 'post-item';

        const img = document.createElement('img');
        img.className = 'post-thumb';
        img.src = p.image;
        img.alt = p.caption || ('Foto de ' + p.raza);
        // abrir preview al hacer click en la miniatura
        img.addEventListener('click', () => openPhotoPreview(p.image, p.caption));

        const meta = document.createElement('div');
        meta.className = 'post-meta';
        meta.innerHTML = `<strong>${escapeHtml(p.author)}</strong> <small style="color:#666;"> · ${new Date(p.created).toLocaleString()}</small>`;
        if (p.caption) {
            const cap = document.createElement('div');
            cap.style.marginTop = '6px';
            cap.innerHTML = escapeHtml(p.caption);
            meta.appendChild(cap);
        }

        const actions = document.createElement('div');
        actions.className = 'post-actions';

        const likeBtn = document.createElement('button');
        likeBtn.className = 'like-btn';
        likeBtn.textContent = `❤ ${p.likes.length}`;
        const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
        if (usuario && p.likes.includes(usuario.email)) {
            likeBtn.classList.add('liked');
        }
        likeBtn.addEventListener('click', () => toggleLike(p.id, likeBtn));

        actions.appendChild(likeBtn);
        meta.appendChild(actions);

        div.appendChild(img);
        div.appendChild(meta);

        postsList.appendChild(div);
    });
}

function handlePostSubmit() {
    const modal = document.getElementById('razaModal');
    if (!modal) return;
    const razaId = modal.dataset.raza;
    const imgInput = document.getElementById('postImage');
    const caption = document.getElementById('postCaption').value.trim();
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));

    if (!usuario) {
        alert('Debes iniciar sesión para subir fotos.');
        return;
    }

    if (!imgInput.files || imgInput.files.length === 0) {
        alert('Selecciona una imagen para publicar.');
        return;
    }

    const file = imgInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const id = 'post_' + Date.now() + '_' + Math.random().toString(36).slice(2,8);
        const nuevo = {
            id,
            raza: razaId,
            author: usuario.email,
            authorEmail: usuario.email,
            image: base64,
            caption: caption,
            likes: [],
            created: new Date().toISOString()
        };
        posts.push(nuevo);
        localStorage.setItem('posts', JSON.stringify(posts));
        renderPostsForRaza(razaId);
        imgInput.value = '';
        document.getElementById('postCaption').value = '';
    };
    reader.readAsDataURL(file);
}

function toggleLike(postId, buttonEl) {
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuario) {
        alert('Debes iniciar sesión para dar like.');
        return;
    }
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const idx = posts.findIndex(p => p.id === postId);
    if (idx === -1) return;
    const p = posts[idx];
    const userEmail = usuario.email;
    const liked = p.likes.includes(userEmail);
    if (liked) {
        p.likes = p.likes.filter(e => e !== userEmail);
    } else {
        p.likes.push(userEmail);
    }
    posts[idx] = p;
    localStorage.setItem('posts', JSON.stringify(posts));
    buttonEl.textContent = `❤ ${p.likes.length}`;
    buttonEl.classList.toggle('liked', !liked);
}

function escapeHtml(str) {
    return String(str).replace(/[&<>\"]/g, function(match) {
        const map = { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' };
        return map[match];
    });
}