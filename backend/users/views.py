from django.shortcuts import render
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.authtoken.models import Token
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


class EmailLoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"detail": "Email és jelszó kötelező!"}, status=status.HTTP_400_BAD_REQUEST)

        # fontos: authenticate mindig a `username` mező alapján működik
        user = authenticate(request, username=email, password=password)

        if not user:
            return Response({"detail": "Hibás email vagy jelszó!"}, status=status.HTTP_401_UNAUTHORIZED)

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "token": token.key,
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
            }
        })