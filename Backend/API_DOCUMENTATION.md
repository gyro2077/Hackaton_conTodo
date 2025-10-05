# API Documentation

This document describes the project API endpoints, their URLs, HTTP methods, authentication requirements and example JSON request/response shapes.

Base URL (local dev): http://localhost:3000

Authentication
--------------
- Login endpoint: POST /auth/login
  - Request JSON:
    {
      "user": "admin",
      "password": "your_password_here"
    }
  - Response JSON (200):
    {
      "token": "<JWT_TOKEN>"
    }
  - Notes: Use the returned token in Authorization header: `Authorization: Bearer <JWT_TOKEN>` for protected endpoints.

Route groups summary
--------------------
- /eje - Manage Ejes (no auth required for read; create/update/delete depend on implementation)
- /indicadores - Manage Indicadores
- /reporte - Manage report instances (create/list/update)
- /tiene - Manage assignment of EJES to report instances
- /usuario - User management (create/list). Creating a user uses hashed password.
- /auth - Authentication (login)
- /plantilla - Admin-only: manage templates, add/remove ejes and indicadores to a plantilla
- /instancia - Admin-only: instantiate a report from a plantilla; change estado
- /respuesta - ONG: submit responses; list responses for a report

Detailed endpoints
------------------

## /auth

### POST /auth/login
- Purpose: Exchange user credentials for a JWT (1 hour validity)
- Auth: none
- Request JSON:
  {
    "user": "admin",
    "password": "secret"
  }
- Response JSON (200):
  {
    "token": "<JWT>"
  }
- Errors:
  - 400: missing fields
  - 401: invalid credentials
  - 500: server configuration error (JWT_SECRET missing)


## /usuario

### POST /usuario/crear
- Purpose: Create a new user (password is hashed by the service)
- Auth: typically admin (depends on route protection)
- Request JSON:
  {
    "USUARIO_NOMBREONG": "My ONG",
    "USUARIO_USER": "myuser",
    "USUARIO_CONTRASENA": "plaintextPassword",
    "USUARIO_ROLE": "ong", // optional, defaults to 'ong'
    "USUARI_DESCRIPCION": "Descripción opcional"
  }
- Response JSON: created user row (returned fields depend on repository; may include USUARIO_ID)

### GET /usuario/
- Purpose: List users
- Auth: depends on protection
- Response: array of user objects


## /eje

### GET /eje/
- Purpose: List all ejes
- Auth: public
- Response: array of objects like:
  {
    "EJES_ID": 1,
    "EJES_NOMBRE": "Salud",
    "EJES_DESCRIPCION": "Descripción"
  }

### POST /eje/crear
- Purpose: Create an eje
- Request JSON: { "EJES_NOMBRE": "...", "EJES_DESCRIPCION": "..." }
- Response: created eje row

(Other standard CRUD endpoints follow the same pattern)


## /indicadores

### GET /indicadores/
- Response: array of indicadores with fields: INDICADORES_ID, EJES_ID, INDICADORES_NOMBRE, INDICADORES_DESCRIPCION, INDICADORES_VALOR

### POST /indicadores/crear
- Request JSON: {
    "EJES_ID": 1,
    "INDICADORES_NOMBRE": "Nombre",
    "INDICADORES_DESCRIPCION": "Desc",
    "INDICADORES_VALOR": "Valor"
  }
- Response: created indicador row


## /plantilla (admin-only)

NOTE: routes under `/plantilla` are protected and require an `admin` role. Use `Authorization: Bearer <token>` header.

### POST /plantilla/crear
- Purpose: Create a report template
- Request JSON:
  {
    "USUARIO_ID": 1, // admin user who creates the plantilla
    "PLANTILLA_NOMBRE": "Plantilla Octubre",
    "PLANTILLA_FECHAINICIO": "2025-10-01",
    "PLANTILLA_FECHAFIN": "2025-10-31",
    "PLANTILLA_PERIODOSUBIRREPORTES": "mensual", // or "1-9"
    "PLANTILLA_DESCRIPCION": "Descripción"
  }
- Response: created plantilla row

### GET /plantilla/
- Purpose: List plantillas
- Auth: admin
- Response: array of plantilla rows

### GET /plantilla/id/:id
- Purpose: Get plantilla by id
- Auth: admin

### Ejes management on plantilla
- POST /plantilla/:plantillaId/eje/:ejeId  (adds eje to plantilla) — admin
- DELETE /plantilla/:plantillaId/eje/:ejeId — admin
- GET /plantilla/:plantillaId/ejes — admin

### Indicadores management on plantilla
- POST /plantilla/:plantillaId/indicador/:indicadorId
  - Body: { "ejeId": <EJES_ID> }
- DELETE /plantilla/:plantillaId/indicador/:indicadorId
- GET /plantilla/:plantillaId/indicadores


## /instancia (admin-only)

### POST /instancia/crear-desde-plantilla/:plantillaId
- Purpose: Create a report instance from a plantilla. Copies ejes and indicators into TIENE and REPORTE_INDICADORES.
- Auth: admin (Authorization: Bearer <token>)
- Request body: optional overrides for fields; by default copies from plantilla
  e.g. { "REPORTEPROYECTO_ESTADO": "Pendiente" }
- Response: created report row (REPORTEPROYECTO)

### PUT /instancia/cambiar-estado/:id
- Purpose: Admin changes the state of a report (e.g., review accepted)
- Body: { "estado": "Aprobado" }
- Auth: admin


## /reporte

### GET /reporte/
- List reports

### GET /reporte/id/:id
- Get report details

(Other CRUD operations similar)


## /tiene

### GET /tiene/reporte/:reporteId
- Returns ejes assigned to a report

### POST /tiene/crear
- Create a TIENE entry
- Request JSON: { "REPORTEPROYECTO_ID": 1, "EJES_ID": 2 }


## /respuesta

### POST /respuesta/crear
- Purpose: Submit a response for a report
- Auth: authenticated ONG user (token required). The server will attach `USUARIO_ID` from the token.
- Request JSON:
  {
    "REPORTEPROYECTO_ID": 123,
    "EJES_ID": 5,
    "INDICADORES_ID": 12,
    "RESPUESTA_VALOR": "123"
  }
- Validation: The controller enforces a submission window based on the report's `REPORTEPROYECTO_PERIODOSUBIRREPORTES` (example: `mensual` allows days 1-9). You can also use explicit ranges like `1-9`.
- Response: created respuesta row

### GET /respuesta/reporte/:reporteId
- Purpose: List responses for a report (auth required)


Notes, caveats and next steps
----------------------------
- The API uses JWT-based auth with `JWT_SECRET` set in environment variables. Make sure `.env` has `JWT_SECRET`.
- Passwords are stored hashed (bcrypt). Use `UsuarioService.createUsuario` or the included seeder script to create admin users.
- ID generation in repositories currently uses `SELECT COALESCE(MAX(...),0)+1` — this is race-prone. Consider switching to DB sequences/serial/IDENTITY.
- Instantiation (`/instancia/crear-desde-plantilla`) now runs copies inside a DB transaction but `reporteRepo.create` is still a separate call — for stronger guarantees wire `reporteRepo.create` to accept an explicit client/transaction.

If you want, I can also:
- Generate an OpenAPI (Swagger) spec JSON/YAML from these endpoints.
- Create a Swagger UI route to visualize the API (already have swagger.js in project).
- Add example curl / PowerShell commands for each endpoint.

---

_Last updated: 2025-10-05_
