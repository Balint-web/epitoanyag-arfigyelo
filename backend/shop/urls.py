from django.urls import path
from .views import ProductListView, PriceListView

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('prices/', PriceListView.as_view(), name='price-list'),  # ✅ EZ HIÁNYZOTT
]
