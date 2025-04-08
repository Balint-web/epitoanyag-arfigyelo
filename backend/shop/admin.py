from django.contrib import admin
from .models import Product, Store, Price, Category

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "category"]  # ✅ "store" törölve
    list_filter = ["category"]           # ✅ szintén "store" helyett

@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ["name", "url"]

@admin.register(Price)
class PriceAdmin(admin.ModelAdmin):
    list_display = ["product", "store", "price", "last_updated"]
    list_filter = ["store"]

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name"]