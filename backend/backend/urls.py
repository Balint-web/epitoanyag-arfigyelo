from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse  # ideiglenes főoldalhoz (opcionális)

def index(request):
    return HttpResponse("A backend működik! 🎉")

urlpatterns = [
    path('', index),  # ideiglenes főoldal
    path('admin/', admin.site.urls),

    # Saját appok
    path('api/prices/', include('shop.urls')),
    path('api/users/', include('users.urls')),

    # 🔐 Autentikáció
    path('api/auth/', include('dj_rest_auth.urls')),  # login, logout, password reset
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),  # regisztráció
    path('api/auth/', include('allauth.socialaccount.urls')),  # social login redirectek (Google, Facebook)
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),


]
