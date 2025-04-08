from rest_framework import serializers
from .models import Product, Price, Store, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer()

    class Meta:
        model = Product
        fields = ['name', 'image_url', 'category']

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ['name']

class PriceSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    store = StoreSerializer()

    class Meta:
        model = Price
        fields = ['product', 'store', 'price']
