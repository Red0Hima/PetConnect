# Sistema de Cookies y Sesión - PetConnect

## Descripción General

Se ha implementado un sistema completo de gestión de cookies y sesiones que permite al usuario controlar si su sesión persiste entre visitas o se elimina al cerrar la página.

## Arquitectura

### Archivos Modificados

1. **`PaginaPrincipal/cookies.js`** (NUEVO)
   - Módulo independiente que maneja todo el sistema de consentimiento de cookies
   - Se carga ANTES de otros scripts en el HTML
   - Proporciona funciones globales: `limpiarSesion()`, `guardarSesionEnSessionStorage()`, `restaurarSesionDesdeSessionStorage()`

2. **`PaginaPrincipal/index.html`**
   - Agregado: `<script src="cookies.js"></script>` antes de otros scripts
   - Script de usuario mejorado con selector correcto para el botón de login

3. **`Enciclopedia/enciclopedia.html`**
   - Agregado: `<script src="../PaginaPrincipal/cookies.js"></script>`
   - Script de usuario mejorado con selector correcto

## Flujo de Funcionamiento

### Primera Visita (Sin Consentimiento Guardado)

```
┌─────────────────────────────────────────┐
│ Página se carga                         │
│ cookies.js: initCookieBanner()          │
│ → No encuentra consentimiento en localStorage
│ → Muestra banner de aceptar/rechazar    │
└─────────────────────────────────────────┘
         │
         ├─── Usuario Acepta ─────┐
         │                        │
         │                        ▼
         │                  localStorage.setItem(
         │                    'petconnect_cookie_consent',
         │                    'accepted'
         │                  )
         │                  guardaSesionEnSessionStorage()
         │                  → sessionStorage[backup] = usuario
         │
         └─── Usuario Rechaza ─────┐
                                  │
                                  ▼
                            localStorage.setItem(
                              'petconnect_cookie_consent',
                              'rejected'
                            )
                            limpiarSesion()
                            → Se borra usuarioActual de localStorage
```

### Usuario Cierra la Página (beforeunload)

**Si cookies ACEPTADAS:**
```
window.beforeunload → guardarSesionEnSessionStorage()
→ sessionStorage['petconnect_session_backup'] = usuarioActual
→ localStorage.removeItem('usuarioActual') NO se ejecuta aquí
```

**Si cookies RECHAZADAS o SIN CONSENTIMIENTO:**
```
window.beforeunload → limpiarSesion()
→ localStorage.removeItem('usuarioActual')
→ sessionStorage.removeItem('petconnect_session_backup')
```

### Usuario Reabre la Página (pageshow)

**Si cookies ACEPTADAS:**
```
window.pageshow → restaurarSesionDesdeSessionStorage()
→ const sessionBackup = sessionStorage.getItem('petconnect_session_backup')
→ localStorage.setItem('usuarioActual', sessionBackup)
→ Usuario aparece como autenticado, menú muestra su nombre
```

**Si cookies RECHAZADAS:**
```
window.pageshow → limpiarSesion()
→ localStorage está limpio, usuario verá "Iniciar Sesión"
→ Banner de cookies vuelve a aparecer
```

## Estados de la Sesión

| Acción | Cookies Aceptadas | Cookies Rechazadas |
|--------|-------------------|--------------------|
| Usuario inicia sesión | ✅ usuarioActual en localStorage | ✅ usuarioActual en localStorage |
| Usuario navega página | ✅ Sesión activa, nombre visible | ✅ Sesión activa, nombre visible |
| Usuario cierra pestaña | 📦 Sesión en sessionStorage | 🗑️ Sesión eliminada |
| Usuario reabre página | ✅ Sesión restaurada de sessionStorage | ❌ Debe iniciar sesión nuevamente |
| Usuario abre otra pestaña | ✅ Sesión sincronizada via localStorage | ✅ Sesión sincronizada via localStorage |

## Claves de Storage

### localStorage
- `petconnect_cookie_consent`: "accepted" | "rejected" | not set
- `usuarioActual`: Objeto JSON con {username, email, password, fechaRegistro}

### sessionStorage
- `petconnect_session_backup`: Backup temporal de usuarioActual (solo si cookies aceptadas)

## Sincronización Entre Pestañas

El evento `storage` de JavaScript permite sincronizar el estado entre pestañas:

```javascript
window.addEventListener('storage', (e) => {
    if (e.key === COOKIE_CONSENT_KEY) {
        if (e.newValue === 'accepted') {
            // Otra pestaña aceptó cookies
            restaurarSesionDesdeSessionStorage();
        } else if (e.newValue === 'rejected') {
            // Otra pestaña rechazó cookies
            limpiarSesion();
        }
    }
});
```

## Casos de Uso

### Caso 1: Usuario Responsable
1. Visita la página → Ve banner de cookies
2. Acepta cookies → Se guarda consentimiento
3. Inicia sesión → usuarioActual en localStorage
4. Cierra navegador → Sesión guardada en sessionStorage
5. Reabre navegador → Sesión restaurada automáticamente
6. Puede publicar fotos sin volver a iniciar sesión ✅

### Caso 2: Usuario Privado
1. Visita la página → Ve banner de cookies
2. Rechaza cookies → Se guarda rechazo
3. Inicia sesión → usuarioActual en localStorage
4. Cierra navegador → Sesión completamente eliminada
5. Reabre navegador → Must iniciar sesión nuevamente
6. Ve banner nuevamente (consentimiento se limpió) ❌ NOTA: Esto puede no ocurrir si se guardó el rechazo

### Caso 3: Usuario en Múltiples Pestañas
1. Pestaña A: Inicia sesión → localStorage actualizado
2. Pestaña B: Detecta cambio via `storage` event → Se sincroniza
3. Ambas pestañas muestran nombre de usuario ✅

## Seguridad y Privacidad

### Qué SE guarda:
- Email del usuario (necesario para identificación)
- Username del usuario (para mostrar en UI)
- Fecha de registro (metadata)

### Qué NO se guarda:
- Contraseña clara en sessionStorage (solo en localStorage durante sesión activa)
- Datos de sesión sin consentimiento explícito

### Recomendaciones Futuras:
1. Implementar **encriptación** de datos en localStorage
2. Agregar **expiración automática** de sesión (ej: 30 minutos de inactividad)
3. Usar **httpOnly cookies** en backend (cuando se implemente API)
4. Implementar **refresh tokens** en lugar de almacenar datos sensibles en localStorage

## Pruebas Recomendadas

```javascript
// Abrir DevTools (F12) y ejecutar en la consola:

// 1. Ver consentimiento actual
console.log(localStorage.getItem('petconnect_cookie_consent'));

// 2. Ver usuario actual
console.log(JSON.parse(localStorage.getItem('usuarioActual')));

// 3. Ver backup de sesión
console.log(sessionStorage.getItem('petconnect_session_backup'));

// 4. Simular cierre de página (se ejecuta beforeunload)
window.dispatchEvent(new Event('beforeunload'));

// 5. Limpiar todo manualmente
localStorage.clear();
sessionStorage.clear();
```

## Troubleshooting

### Problema: Usuario ve "Iniciar Sesión" pero puede publicar fotos
**Causa**: localStorage tiene usuarioActual pero UI no se actualiza
**Solución**: Recargar página (F5) después de iniciar sesión

### Problema: Banner de cookies no aparece
**Causa**: Consentimiento ya guardado en localStorage
**Solución**: Abrir DevTools, ejecutar `localStorage.removeItem('petconnect_cookie_consent')`, recargar

### Problema: Sesión desaparece al cambiar de pestaña
**Causa**: Consentimiento fue rechazado
**Solución**: Volver a aceptar cookies en el banner

## Próximos Pasos

1. ✅ Integrar cookies.js en ambas páginas principales
2. ⏳ Prueba manual de todos los flujos
3. ⏳ Agregar persistencia de posts en sessionStorage (para continuidad)
4. ⏳ Implementar backend API con JWT tokens
5. ⏳ Migrar a httpOnly cookies del servidor
