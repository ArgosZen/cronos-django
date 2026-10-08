from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST

from .models import Articulo, Suscriptor


def index(request):
    articulos = Articulo.objects.filter(publicado=True).select_related("categoria")[:5]
    return render(request, "index.html", {"articulos": articulos})


@require_POST
def suscribir(request):
    email = request.POST.get("email", "").strip().lower()
    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse({"ok": False, "mensaje": "Correo electrónico no válido."}, status=400)

    _, creado = Suscriptor.objects.get_or_create(email=email)
    if creado:
        mensaje = "¡Suscripción registrada con éxito!"
    else:
        mensaje = "Este correo ya estaba suscrito."
    return JsonResponse({"ok": True, "mensaje": mensaje})


def privacidad(request):
    return render(request, "privacidad.html")


def terminos(request):
    return render(request, "terminos.html")
