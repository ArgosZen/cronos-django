#!/bin/bash
# Inicializa la base de datos de Cronos Blog: tablas, índices y datos de ejemplo
set -e
python manage.py migrate
python manage.py shell << 'PYEOF'
from blog.models import Categoria, Articulo
cat, _ = Categoria.objects.get_or_create(nombre="Ciberseguridad", slug="ciberseguridad")
Articulo.objects.get_or_create(
    slug="bienvenida-a-cronos",
    defaults=dict(
        titulo="Bienvenida a Cronos",
        resumen="Primer artículo de ejemplo del blog.",
        contenido="Contenido de prueba cargado por el script de inicialización.",
        categoria=cat,
    ),
)
print("Datos iniciales cargados.")
PYEOF