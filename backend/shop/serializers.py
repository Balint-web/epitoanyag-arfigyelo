from rest_framework import serializers
from .models import Product, Price, Store, Category, Cart, CartItem, MasterProduct

# Kategória serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']

# Store serializer
class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ['name', 'url']

# Egy-egy bolt kínálata (Product) egy adott MasterProduct alatt
class ProductOfferSerializer(serializers.ModelSerializer):
    store = serializers.CharField()
    price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['store', 'price', 'image_url', 'product_url']

    def get_price(self, obj):
        latest_price = Price.objects.filter(product=obj).order_by('-last_updated').first()
        if latest_price:
            return latest_price.price
        return None

# MasterProduct serializer: az egyes "főtermékek", pl. "Asfora váltókapcsoló"
class MasterProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    offers = ProductOfferSerializer(many=True, read_only=True)

    class Meta:
        model = MasterProduct
        fields = ['id', 'name', 'category', 'offers']

# Kosár item serializer – alap egy termék ID-val
class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.master_product.name', read_only=True)
    product_id = serializers.IntegerField(source='product.id', read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product_id', 'product_name', 'quantity']

# Kosár serializer (user kosara itemekkel együtt)
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(source='cartitem_set', many=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items']

# Árak szerializálása (ha külön kell)
class PriceSerializer(serializers.ModelSerializer):
    product = serializers.StringRelatedField()
    store = StoreSerializer()

    class Meta:
        model = Price
        fields = ['product', 'store', 'price', 'last_updated']

class GroupedProductSerializer(serializers.Serializer):
    name = serializers.CharField()
    min_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    image_url = serializers.CharField()
    category = serializers.CharField()
    offers = serializers.ListField()