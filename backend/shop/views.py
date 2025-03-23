from django.shortcuts import render

from rest_framework import generics
from .models import Price
from .serializers import PriceSerializer

class PriceListView(generics.ListAPIView):
    queryset = Price.objects.all()
    serializer_class = PriceSerializer
