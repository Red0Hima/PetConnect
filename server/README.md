# PetConnect - Backend (Express + SQLite)

Backend simple con autenticación y endpoints para posts. Usa SQLite como base de datos.

## Setup Local (Windows)

1. Copia el proyecto completo a tu PC:
   - Desde la raíz del proyecto en la USB, ejecuta: `.\copy_to_local.ps1`
   - El proyecto se copiará a `C:\Users\love4\Documents\PROYECTO HANZEL Y ANA DEF`

2. Instala dependencias:

```powershell
cd "C:\Users\love4\Documents\PROYECTO HANZEL Y ANA DEF\server"
npm install
```

3. (Opcional) Configura variables de entorno creando `.env`:

```powershell
copy .env.example .env
# Edita .env y ajusta PORT y JWT_SECRET si lo deseas
```

4. Inicia el servidor:

```powershell
npm start
# o con nodemon para desarrollo:
npm run dev
```

El servidor correrá en el puerto definido en `.env` (por defecto 3000). La base de datos SQLite se creará automáticamente en `server/data/petconnect.db`.

## Endpoints

- `POST /api/auth/register` { username, email, password } → Registers user, returns `{ user, token }`.
- `POST /api/auth/login` { identifier, password } → identifier = email OR username; returns `{ user, token }`.
- `GET /api/posts?razaId=...` → get posts (populated with author data)
- `POST /api/posts` → create post (auth required). JSON: `{ caption, imageBase64, razaId }`. Use header `Authorization: Bearer <token>`.
- `POST /api/posts/:id/like` → toggle like (auth required)

## Frontend integration (example)

Register:

```javascript
fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, email, password })
}).then(r => r.json()).then(data => {
  // store data.token and data.user
});
```

Login:

```javascript
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ identifier: 'juan123 or juan@example.com', password })
})
.then(r => r.json())
.then(data => {
  // data.token, data.user
});
```

Create post (example):

```javascript
fetch('http://localhost:3000/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({ caption, imageBase64, razaId })
})
```

## Frontend

Abre `C:\Users\love4\Documents\PROYECTO HANZEL Y ANA DEF\PaginaPrincipal\index.html` en tu navegador después de iniciar el servidor.

## Notas
- Las imágenes se manejan como base64 para simplicidad. Para producción considera usar `multer` + almacenamiento en la nube.
- Las contraseñas se hashean con `bcryptjs`.
- La autenticación usa JWT almacenado en el cliente (localStorage). Para mayor seguridad usa httpOnly cookies.
- La base de datos SQLite (`petconnect.db`) se crea automáticamente en `server/data/`.
