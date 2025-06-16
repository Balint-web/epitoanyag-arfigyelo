from django.urls import path
from django.urls import path
from .views import (
    MasterProductListView,
    PriceListView,
    GroupedProductAPIView,
    cart_prices_view,
    send_contact_email
)

urlpatterns = [
    path('prices/', PriceListView.as_view(), name='price-list'),
    path('grouped-products/', GroupedProductAPIView.as_view(), name='grouped-products'),
    path('cart-prices/', cart_prices_view, name='cart-prices'),
    path('products/', MasterProductListView.as_view(), name='masterproduct-list'),
    path('send-contact-email/', send_contact_email, name='send_contact_email'),
]
