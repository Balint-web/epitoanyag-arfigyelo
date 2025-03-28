from django.shortcuts import render
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, CustomTokenObtainPairSerializer

User = get_user_model()

# ✅ Nyitólaphoz egy egyszerű válasz APIView
class HomeView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        return Response({
            "message": "🎉 Üdvözlünk a Django API backendben!",
            "info": "Ez az epitoanyag-arfigyelo projekt API-ja.",
            "available_endpoints": ["/api/register/", "/api/login/", "/api/token/refresh/"]
        })


class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = (AllowAny,)
