from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from shop.views import favorites_prices_view

def index(request):
    return HttpResponse("A backend működik! 🎉")

urlpatterns = [
    path('', index),  # ideiglenes főoldal
    path('admin/', admin.site.urls),

    #  Saját appok API-ja
    path('api/', include('shop.urls')),
    path('api/users/', include('users.urls')),

    #  REST alapú autentikáció (dj-rest-auth)
    path('api/auth/', include('dj_rest_auth.urls')),               # login, logout, password reset
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),  # regisztráció


    # Kedvenc oldal kéréséhez
    path('api/favorites-prices/', favorites_prices_view, name='favorites-prices'),


    # (tovább fejlesztésehez)
    # path('api/auth/', include('allauth.socialaccount.urls')),    # social login redirect - inkább webes loginhoz való
]
