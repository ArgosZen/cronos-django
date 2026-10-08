from django.contrib import admin
from .models import Categoria, Articulo, Suscriptor


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("nombre", "slug")
    prepopulated_fields = {"slug": ("nombre",)}


@admin.register(Articulo)
class ArticuloAdmin(admin.ModelAdmin):
    list_display = ("titulo", "categoria", "publicado", "fecha_publicacion")
    list_filter = ("categoria", "publicado")
    prepopulated_fields = {"slug": ("titulo",)}


@admin.register(Suscriptor)
class SuscriptorAdmin(admin.ModelAdmin):
    list_display = ("email", "activo", "fecha_alta")
    list_filter = ("activo",)
