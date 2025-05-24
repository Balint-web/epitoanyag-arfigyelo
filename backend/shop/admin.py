from django.contrib import admin
from .models import Product, Store, Price, Category, MasterProduct, Cart, CartItem

@admin.register(MasterProduct)
class MasterProductAdmin(admin.ModelAdmin):
    list_display = ["name", "category"]
    list_filter = ["category"]
    search_fields = ["name"]

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["get_master_name", "store", "product_url"]
    list_filter = ["store"]
    search_fields = ["master_product__name", "store"]

    def get_master_name(self, obj):
        return obj.master_product.name
    get_master_name.short_description = "Terméknév"

@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ["name", "url"]
    search_fields = ["name"]

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name"]
    search_fields = ["name"]

@admin.register(Price)
class PriceAdmin(admin.ModelAdmin):
    list_display = ["product", "store", "price", "last_updated"]
    list_filter = ["store"]

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ["user"]

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ["cart", "product", "quantity"]
