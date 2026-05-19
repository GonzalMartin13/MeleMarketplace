# 🪣 Mele Marketplace

Marketplace interno de empleados con tablero de corcho.  
**Stack:** React + Vite (frontend) | Express.js (backend) | Supabase (auth + DB + storage)

---

## ⚙️ Setup paso a paso

### 1. Crear proyecto en Supabase

1. Ingresá a [supabase.com](https://supabase.com) y creá un proyecto nuevo.
2. Cuando esté listo, andá a **SQL Editor** y pegá todo el contenido de `supabase-schema.sql` y ejecutalo.
3. Habilitá el proveedor de Google:
   - En Supabase: **Authentication → Providers → Google**
   - Necesitás un **Client ID** y **Client Secret** de Google OAuth
   - Para obtenerlos: [console.cloud.google.com](https://console.cloud.google.com) → Credenciales → OAuth 2.0
   - En "Authorized redirect URIs" poné: `https://tu-proyecto.supabase.co/auth/v1/callback`

4. Copiá de Supabase:
   - **Project URL** → `SUPABASE_URL` y `VITE_SUPABASE_URL`
   - **anon key** → `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (solo en backend, nunca en frontend)

---

### 2. Backend

```bash
cd backend
cp .env.example .env
# Editá .env con tus keys de Supabase
npm install
npm run dev
# Corre en http://localhost:3001
```

---

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# Editá .env con tus keys de Supabase
npm install
npm run dev
# Corre en http://localhost:5173
```

---

## 📁 Estructura del proyecto

```
mele-marketplace/
├── supabase-schema.sql      ← Ejecutar en Supabase SQL Editor
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── supabase.js
│       └── routes/
│           ├── posts.js     ← CRUD publicaciones
│           ├── profiles.js  ← CRUD perfiles
│           └── upload.js    ← Upload imágenes
└── frontend/
    ├── .env.example
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── index.css
        ├── lib/
        │   ├── supabase.js
        │   └── api.js
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── PostCard.jsx
        │   └── CreatePostModal.jsx
        └── pages/
            ├── HomePage.jsx
            ├── LoginPage.jsx
            └── ProfilePage.jsx
```

---

## 🔌 Endpoints del backend

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/posts` | Listar publicaciones (query: `?type=vendo\|compro`) |
| POST | `/api/posts` | Crear publicación |
| DELETE | `/api/posts/:id` | Eliminar publicación (solo dueño) |
| GET | `/api/profiles/:user_id` | Obtener perfil |
| POST | `/api/profiles` | Crear/actualizar perfil |
| PUT | `/api/profiles/:user_id` | Actualizar campos del perfil |
| POST | `/api/upload` | Subir imagen al storage |

---

## 🚀 Para producción

- **Frontend:** desplegalo en [Vercel](https://vercel.com) o [Netlify](https://netlify.com)
- **Backend:** desplegalo en [Railway](https://railway.app) o [Render](https://render.com)
- Actualizá las variables de entorno con las URLs de producción

---

## 📱 Migración a React Native (futuro)

La lógica de `src/lib/api.js` y `src/context/AuthContext.jsx` es reutilizable en React Native. Los componentes visuales necesitan adaptarse (sin CSS modules, usar StyleSheet de RN), pero la arquitectura está pensada para esa migración.
