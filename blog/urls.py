from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("suscribir/", views.suscribir, name="suscribir"),
    path("privacidad/", views.privacidad, name="privacidad"),
    path("terminos/", views.terminos, name="terminos"),
]
