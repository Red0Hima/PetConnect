// Cookie Management Module for PetConnect
// Gestiona consentimiento de cookies y persistencia de sesión

const COOKIE_CONSENT_KEY = 'petconnect_cookie_consent';
const SESSION_BACKUP_KEY = 'petconnect_session_backup';

// Inicializar al cargar la página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieBanner);
} else {
    initCookieBanner();
}

// Guardar sesión antes de cerrar la página si cookies aceptadas
window.addEventListener('beforeunload', () => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent === 'accepted') {
        guardarSesionEnSessionStorage();
    } else if (consent === 'rejected' || !consent) {
        limpiarSesion();
    }
});

// Restaurar sesión cuando la página se abre de nuevo
window.addEventListener('pageshow', () => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent === 'accepted') {
        restaurarSesionDesdeSessionStorage();
    }
});

// Sincronizar entre pestañas
window.addEventListener('storage', (e) => {
    if (e.key === COOKIE_CONSENT_KEY) {
        if (e.newValue === 'accepted') {
            restaurarSesionDesdeSessionStorage();
        } else if (e.newValue === 'rejected') {
            limpiarSesion();
        }
    }
});

/**
 * Inicializa el banner de consentimiento de cookies
 */
function initCookieBanner() {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    
    if (!consent) {
        mostrarBannerCookies();
    } else if (consent === 'accepted') {
        restaurarSesionDesdeSessionStorage();
    } else if (consent === 'rejected') {
        limpiarSesion();
    }
}

/**
 * Muestra el banner de consentimiento de cookies
 */
function mostrarBannerCookies() {
    const banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: #fbf8f4;
        border: 2px solid #a8a39a;
        border-radius: 8px;
        padding: 20px;
        z-index: 999;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        max-width: 400px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    banner.innerHTML = `
        <p style="margin-top: 0; font-size: 14px; color: #8c847d; line-height: 1.5;">
            <strong>Consentimiento de Cookies</strong><br>
            Utilizamos cookies para mantener tu sesión iniciada entre visitas.
        </p>
        <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button id="acceptCookies" style="
                flex: 1;
                background: #c2d4c0;
                color: #333;
                border: none;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: background 0.3s;
            ">Aceptar</button>
            <button id="rejectCookies" style="
                flex: 1;
                background: #a8a39a;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: background 0.3s;
            ">Rechazar</button>
        </div>
    `;
    
    document.body.appendChild(banner);
    
    const acceptBtn = document.getElementById('acceptCookies');
    const rejectBtn = document.getElementById('rejectCookies');
    
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
        guardarSesionEnSessionStorage();
        banner.remove();
        console.log('[Cookies] Consentimiento aceptado - sesión será persistida');
    });
    
    rejectBtn.addEventListener('click', () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
        limpiarSesion();
        banner.remove();
        console.log('[Cookies] Consentimiento rechazado - sesión será limpiada al cerrar');
    });
}

/**
 * Guarda la sesión actual en sessionStorage (temporal, se restaura si cookies aceptadas)
 */
function guardarSesionEnSessionStorage() {
    const usuarioActual = localStorage.getItem('usuarioActual');
    if (usuarioActual) {
        sessionStorage.setItem(SESSION_BACKUP_KEY, usuarioActual);
        console.log('[Cookies] Sesión guardada en sessionStorage');
    }
}

/**
 * Restaura la sesión desde sessionStorage a localStorage
 */
function restaurarSesionDesdeSessionStorage() {
    const sessionBackup = sessionStorage.getItem(SESSION_BACKUP_KEY);
    if (sessionBackup) {
        localStorage.setItem('usuarioActual', sessionBackup);
        console.log('[Cookies] Sesión restaurada desde sessionStorage');
    }
}

/**
 * Limpia completamente la sesión de ambos storages
 */
function limpiarSesion() {
    localStorage.removeItem('usuarioActual');
    sessionStorage.removeItem(SESSION_BACKUP_KEY);
    console.log('[Cookies] Sesión limpiada');
}
