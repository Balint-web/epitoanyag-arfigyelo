from django.urls import path
from .views import PriceListView

urlpatterns = [
    path('prices/', PriceListView.as_view(), name='price-list'),  # 🔹 API végpont
]
