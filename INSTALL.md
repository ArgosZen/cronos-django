# Instalación de Cronos Blog (Django)

Guía para reproducir el entorno de la aplicación en Ubuntu.

## Versiones utilizadas

| Componente | Versión |
|---|---|
| Python | 3.14.4 |
| Django | 6.1.2 |
| django-csp | 4.0 |
| psycopg2-binary | 2.9.13 |
| python-dotenv | 1.2.4 |
| PostgreSQL | psql (PostgreSQL) 18.6 (Ubuntu 18.6-0ubuntu0.26.04.1) |

La lista completa de dependencias está en `requirements.txt`.

## Pasos de instalación

### 1. Dependencias del sistema
```bash
sudo apt update
sudo apt install -y python3-venv python3-pip postgresql postgresql-contrib libpq-dev
sudo systemctl enable --now postgresql
```

### 2. Entorno virtual y dependencias
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Base de datos
```bash
sudo -u postgres psql
```
```sql
CREATE DATABASE cronos_db;
CREATE USER cronos_user WITH PASSWORD 'tu_clave';
ALTER ROLE cronos_user SET client_encoding TO 'utf8';
ALTER ROLE cronos_user SET timezone TO 'America/Mexico_City';
ALTER DATABASE cronos_db OWNER TO cronos_user;
```

### 4. Variables de entorno
Crear un archivo `.env` en la raíz (no se sube a Git):
SECRET_KEY=clave_generada
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=cronos_db
DB_USER=cronos_user
DB_PASSWORD=tu_clave
DB_HOST=localhost
DB_PORT=5432

Para generar la clave secreta:
```bash
python -c "from django.core.management.utils import get_random_secret_key as g; print(g())"
```

### 5. Inicializar la base de datos
Crea las tablas, los índices y los datos de ejemplo:
```bash
./scripts/init_db.sh
```

### 6. Administrador y servidor
```bash
python manage.py createsuperuser
python manage.py check
python manage.py runserver
```
- Sitio: http://127.0.0.1:8000/
- Administración: http://127.0.0.1:8000/admin/

## Dependencias adicionales

- **django-csp**: agrega el encabezado Content-Security-Policy para mitigar ataques XSS y de inyección de contenido.

## Dominio local y HTTPS

### 1. Dominio simulado
```bash
echo "127.0.0.1   cronos.local" | sudo tee -a /etc/hosts
```

### 2. Certificado autofirmado
```bash
mkdir -p certs
openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
  -keyout certs/cronos.key -out certs/cronos.crt \
  -subj "/C=MX/ST=Guanajuato/O=Cronos Blog/CN=cronos.local" \
  -addext "subjectAltName=DNS:cronos.local"
sudo mkdir -p /etc/ssl/cronos
sudo cp certs/cronos.crt certs/cronos.key /etc/ssl/cronos/
sudo chmod 600 /etc/ssl/cronos/cronos.key
```

### 3. Variables adicionales en el `.env`
### 4. Archivos estáticos y Gunicorn
```bash
pip install gunicorn
python manage.py collectstatic --noinput
sudo mkdir -p /var/www/cronos-django
sudo rsync -a staticfiles/ /var/www/cronos-django/static/
gunicorn config.wsgi:application --bind 127.0.0.1:8001
```

### 5. Nginx
Copiar `deploy/nginx-cronos.conf` a `/etc/nginx/sites-available/cronos-django`, habilitarlo y reiniciar:
```bash
sudo cp deploy/nginx-cronos.conf /etc/nginx/sites-available/cronos-django
sudo ln -s /etc/nginx/sites-available/cronos-django /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```
Si el puerto 80 está ocupado (por ejemplo, por Apache), detener el otro servicio con `sudo systemctl stop apache2`.

Sitio final: https://cronos.local (el navegador mostrará una advertencia porque el certificado es autofirmado).

## Medidas de seguridad aplicadas

- Redirección de HTTP a HTTPS (Nginx y `SECURE_SSL_REDIRECT`)
- Strict-Transport-Security (HSTS)
- Content-Security-Policy con `django-csp`
- Cookies de sesión y CSRF con atributo `Secure`
- Encabezados `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` y `Cross-Origin-Opener-Policy`
- Secretos fuera del repositorio (`.env` ignorado por Git)

## Documentos legales

- Aviso de Privacidad: `/privacidad/`
- Términos y Condiciones: `/terminos/`
