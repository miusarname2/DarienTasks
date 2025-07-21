# DarienTasks

**DarienTasks**
Una aplicación web para la gestión de tareas, que permite crear, actualizar, eliminar y completar tareas. Más información y código fuente en: [https://github.com/miusarname2/DarienTasks](https://github.com/miusarname2/DarienTasks)

---

## 📖 Descripción

DarienTasks es un sistema todo-en-uno para administrar tareas de manera sencilla e intuitiva. Permite a los usuarios:

* Crear nuevas tareas con título, descripción y fecha de vencimiento.
* Marcar tareas como completadas.
* Editar y eliminar tareas existentes.
* Filtrar vistas según estado de las tareas.

Estado actual: **v1.0.0**

---

## 🧰 Tecnologías y Versiones Exactas

| Componente | Versión               |
| ---------- | --------------------- |
| Laravel    | 12.20.0               |
| PHP        | 8.3                   |
| MySQL      | 9.3.0                 |
| React      | 19.0.0                |
| Node.js    | 22.0                  |
| npm        | (incluido en Node.js) |
| Vite       | 6.0                   |
| Composer   | 2.8.9                 |
| Inertia.js | 2.0.0                 |

---

## 🚀 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

* PHP ≥ 8.3
* Composer ≥ 2.8.9
* Node.js ≥ 22.0 (incluye npm)
* MySQL ≥ 9.3.0
* Extensiones de PHP: bcmath, calendar, Core, ctype, curl, date, dom, fileinfo, filter, ftp, gd, hash, iconv, json, libxml, mbstring, mysqlnd, openssl, pcre, PDO, pdo\_mysql, Phar, random, readline, Reflection, session, SimpleXML, SPL, standard, tokenizer, xml, xmlreader, xmlwriter, zip, zlib
* Recursos mínimos de sistema:

  * 512 MB RAM
  * 2 GB espacio en disco
  * 1 CPU core

---

## 🔧 Variables de Entorno

Copia el archivo `.env.example` a `.env` y ajusta valores según tu entorno:

```ini
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:pVI0lJEXds0XrezJ+ZLnWr0NtQGPpVjTDGtJAVXMcjs=
APP_DEBUG=true
APP_URL=http://localhost:8000

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
PHP_CLI_SERVER_WORKERS=4
BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravels
DB_USERNAME=root
DB_PASSWORD=rootpassword

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=database

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="${APP_NAME}"
```

---

## 📥 Instalación & Configuración

1. Clona el repositorio:

   ```bash
   git clone https://github.com/miusarname2/DarienTasks.git
   cd DarienTasks
   ```


2. Instala dependencias PHP:

    ```bash
   composer require
   ```


3. Instala dependencias de Node.js:

   ```bash
   npm install
   ```

4. Genera la clave de aplicación Laravel(para este paso, ya tendras que tener el archivo .env, que esta o bien arriba en este documento, o te lo incluyo como un .env.example):
   ```bash
    php artisan key:generate
    ```

   Ajusta el nombre en `.env` si cambias `DB_DATABASE`.

6. Aplica migraciones y seeders:
   ```bash
    php artisan migrate
    php artisan db:seed
    ```

7. (Opcional) Base de datos para pruebas:

   ```sql
   CREATE DATABASE myapp\_testing;
   ```


---

## 🚀 Levantar la Aplicación
- **Backend (API Laravel)**:  
  ```bash
    php artisan serve
   ```

Acceder en: `http://localhost:8000`

* **Frontend (React + Vite)**:

  ```bash
  npm run dev
  ```

  Acceder en: `http://localhost:5173` *(por defecto)*

---

## 🧪 Ejecución de Pruebas
Ejecuta los tests de Laravel (unitarias e integración):
```bash
php artisan test
````

*(No hay tests de frontend configurados actualmente.)*

---

## ⚙️ Consideraciones Especiales

* Asegúrate de habilitar las extensiones PHP listadas en **Prerrequisitos**.
* Recursos mínimos del servidor: 512 MB RAM, 2 GB disco, 1 CPU.
* Ajusta `SESSION_DRIVER`, `CACHE_STORE` y `QUEUE_CONNECTION` según prefieras (por defecto: base de datos).
* Para correo en desarrollo, usa `MAIL_MAILER=log`.

---

## 📄 Licencia

Distribuido bajo la licencia MIT.
