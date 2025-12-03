// Este archivo contiene funciones compartidas de autenticación

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} True si hay un usuario autenticado
 */
function estaAutenticado() {
    return localStorage.getItem('usuarioActual') !== null;
}

/**
 * Obtiene el usuario actual
 * @returns {Object|null} Objeto del usuario o null si no hay autenticación
 */
function obtenerUsuarioActual() {
    const usuarioJSON = localStorage.getItem('usuarioActual');
    return usuarioJSON ? JSON.parse(usuarioJSON) : null;
}

/**
 * Cierra la sesión del usuario actual
 */
function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    window.location.href = '../Auth/login.html';
}

/**
 * Protege una página requiriendo autenticación
 * Si el usuario no está autenticado, lo redirige a login
 */
function protegerPagina() {
    if (!estaAutenticado()) {
        window.location.href = '../Auth/login.html';
    }
}
