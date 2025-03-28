from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse  # ideiglenes főoldalhoz (opcionális)

def index(request):
    return HttpResponse("A backend működik! 🎉")

urlpatterns = [
    path('', index),  # ideiglenes főoldal, hogy a / ne dobjon hibát
    path('admin/', admin.site.urls),
    path('api/prices/', include('shop.urls')),
    path('api/users/', include('users.urls')),  # 🔥 EZ A FONTOS SOR!
]
