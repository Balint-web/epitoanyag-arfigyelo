from rest_framework import serializers
from .models import Product, Price, Store

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ['name', 'url']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['name']


class PriceSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    store = StoreSerializer()

    class Meta:
        model = Price
        fields = ['product', 'store', 'price', 'last_updated']
