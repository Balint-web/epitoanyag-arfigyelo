from django.contrib import admin

from .models import Store, Product, Price

admin.site.register(Store)
admin.site.register(Product)
admin.site.register(Price)