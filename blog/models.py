from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=90, unique=True)

    class Meta:
        verbose_name_plural = "categorías"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class Articulo(models.Model):
    titulo = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    resumen = models.TextField(max_length=500)
    contenido = models.TextField()
    categoria = models.ForeignKey(
        Categoria, on_delete=models.PROTECT, related_name="articulos"
    )
    publicado = models.BooleanField(default=True)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-fecha_publicacion"]
        indexes = [
            models.Index(fields=["-fecha_publicacion"], name="idx_art_fecha"),
            models.Index(fields=["categoria", "publicado"], name="idx_art_cat_pub"),
        ]

    def __str__(self):
        return self.titulo


class Suscriptor(models.Model):
    email = models.EmailField(unique=True)
    fecha_alta = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "suscriptores"
        indexes = [models.Index(fields=["activo"], name="idx_sus_activo")]

    def __str__(self):
        return self.email