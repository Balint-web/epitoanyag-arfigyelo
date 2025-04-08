from rest_framework import generics
from .models import Product, Price
from .serializers import ProductSerializer, PriceSerializer

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class PriceListView(generics.ListAPIView):
    queryset = Price.objects.select_related('product__category', 'store', 'product')
    serializer_class = PriceSerializer
