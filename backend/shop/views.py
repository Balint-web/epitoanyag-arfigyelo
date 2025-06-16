from rest_framework import generics, viewsets
from rest_framework.views import APIView
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.core.mail import send_mail
from django.http import JsonResponse
from collections import defaultdict
from .models import MasterProduct, Product, Price, Cart, CartItem
from .serializers import PriceSerializer, StoreSerializer, CartSerializer, MasterProductSerializer

import re
import unicodedata

class PriceListView(generics.ListAPIView):
    queryset = Price.objects.select_related('product__category', 'store', 'product')
    serializer_class = PriceSerializer

class MasterProductListView(generics.ListAPIView):
    queryset = MasterProduct.objects.prefetch_related('offers').all()
    serializer_class = MasterProductSerializer

def normalize_name(name):
    name = name.lower().strip()

    # --- 1. Kismegszakító
    if "kismegszakító" in name or "omb" in name or "resi9" in name or "stilo" in name:
        pole_match = re.search(r"\b(\d)[ -]?[pbc]\b", name)
        char_match = re.search(r"\b(b|c)\b", name)
        amp_match = re.search(r"\b(\d{1,2})a\b", name)

        pole = f"{pole_match.group(1)}P" if pole_match else ""
        char = char_match.group(1).upper() if char_match else ""
        amp = amp_match.group(1) + "A" if amp_match else ""

        if pole and char and amp:
            return f"Kismegszakító {pole} {char} {amp}"

    # --- 2. FI relé
    if any(keyword in name for keyword in ["fi", "áramvédő", "védőkapcsoló", "resi9"]):
        pole_match = re.search(r"(\d)[\s\-]?p(ólusú)?", name)
        amp_match = re.search(r"(\d{2})\s*a", name)
        ma_match = re.search(r"(\d{2,3})\s*ma", name)

        pole = pole_match.group(1) + "P" if pole_match else ""
        amp = amp_match.group(1) + "A" if amp_match else ""
        ma = ma_match.group(1) + "mA" if ma_match else ""

        if pole and amp and ma:
            return f"FI relé {pole} {amp} {ma}"

    # --- 3. Asfora kapcsolók
    if "asfora" in name and any(code in name for code in ["101", "105", "106"]):
        if "101" in name:
            return "Asfora 101 Egypólusú kapcsoló"
        elif "105" in name:
            return "Asfora 105 Csillárkapcsoló"
        elif "106" in name:
            return "Asfora 106 Váltókapcsoló"

    # --- 4. Asfora dugaljak
    if "asfora" in name and "2x2p+f" in name:
        return "Asfora dupla dugalj"
    elif "asfora" in name and "2p+f" in name:
        return "Asfora dugalj"

    # --- 5. Valena kapcsolók és dugaljak
    if "valena life" in name:
        if "egypólusú" in name:
            return "Valena Egypólusú kapcsoló"
        if "csillárkapcsoló" in name:
            return "Valena Csillárkapcsoló"
        if "váltókapcsoló" in name:
            return "Valena Váltókapcsoló"
        if "2x2p+f" in name:
            return "Valena dupla dugalj"
        if "2p+f" in name:
            return "Valena dugalj"

    # --- 6. MCU vagy H07V-U vezeték
    if "mcu" in name or "h07v-u" in name:
        if "z/s" in name or "zöld/sárga" in name or "zöld-sárga" in name or ("zöld" in name and "sárga" in name):
            color = "zöld-sárga"
        elif "fekete" in name:
            color = "fekete"
        elif "kék" in name:
            color = "kék"
        else:
            color = ""
        size_match = re.search(r"(1[,.]5|2[,.]5)", name)
        size = size_match.group(1).replace(',', '.').replace(' ', '') if size_match else ""

        if size and color:
            return f"MCU {size}mm {color} rézvezeték"

    # --- 7. NYM-J tömör kábel
    if "nym-j" in name or "mbcu" in name or "mb cu" in name:
        core = re.search(r"(\d)x\s*(1[,.]5|2[,.]5|4)", name)
        if core:
            count, size = core.groups()
            return f"NYM-J {count}x{size.replace(',', '.')} kábel"

    # --- 8. MT kábel
    if "h05vv-f" in name or "mt" in name:
        core = re.search(r"(\d)x\s*(1[,.]5|1|2[,.]5)", name)
        if core:
            count, size = core.groups()
            return f"H05VV-F {count}x{size.replace(',', '.')} kábel"

    # --- 9. WAGO
    if "wago" in name:
        model = re.search(r"221-\d{3}", name)
        return f"WAGO {model.group(0)} kötőelem" if model else "WAGO kötőelem"

    # --- 10. LED fényvető
    if "fényvető" in name or "reflektor" in name:
        watt = re.search(r"(\d{1,2})w", name)
        motion = " mozgásérzékelővel" if "mozgásérzékelő" in name else ""
        return f"LED fényvető {watt.group(1)}W{motion}" if watt else "LED fényvető"

    return name.strip()

class GroupedProductAPIView(APIView):
    def get(self, request):
        prices = Price.objects.select_related('product__master_product__category', 'store', 'product')
        grouped = defaultdict(list)

        for price in prices:
            key = normalize_name(price.product.master_product.name)
            grouped[key].append({
                'store': price.store.name,
                'price': price.price,
                'image_url': price.product.image_url,
                'category': price.product.master_product.category.name,
                'original_name': price.product.master_product.name
            })

        result = []
        for name, offers in grouped.items():
            min_price = min(o['price'] for o in offers)
            valid_image_offer = next((o for o in offers if o['image_url'] and "no-image" not in o['image_url'] and "loading" not in o['image_url']), None)
            result.append({
                'name': name,
                'min_price': min_price,
                'image_url': valid_image_offer['image_url'] if valid_image_offer else "/no-image.png",
                'category': offers[0]['category'],
                'offers': offers
            })

        return Response(result)

class CartViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def current(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=['post'])
    def add(self, request):
        product_id = request.data.get("product_id")
        product = Product.objects.get(id=product_id)
        cart, _ = Cart.objects.get_or_create(user=request.user)
        item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            item.quantity += 1
            item.save()
        return Response({"status": "ok"})

@api_view(['GET'])
def cart_prices_view(request):
    ids_param = request.GET.get("ids")
    if not ids_param:
        return JsonResponse({"error": "Missing ids parameter"}, status=400)

    ids = [int(i) for i in ids_param.split(",") if i.isdigit()]
    response_data = []

    for product_id in ids:
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            continue

        prices = Price.objects.filter(product=product)
        price_map = {p.store.name: p.price for p in prices}
        for store_name in ["Govill", "Mentavill", "Daniella", "Mixvill"]:
            price_map.setdefault(store_name, None)

        response_data.append({
            "product_id": product.id,
            "product": product.master_product.name,
            "prices": price_map
        })

    return JsonResponse(response_data, safe=False)

@api_view(['GET'])
def favorites_prices_view(request):
    ids_param = request.GET.get("ids")
    if not ids_param:
        return JsonResponse({"error": "Missing ids parameter"}, status=400)

    ids = [int(i) for i in ids_param.split(",") if i.isdigit()]
    response_data = []

    for product_id in ids:
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            continue

        prices = Price.objects.filter(product=product)
        price_map = {p.store.name: p.price for p in prices}

        response_data.append({
            "product_id": product.id,
            "product_name": product.master_product.name,
            "image_url": product.image_url,
            "category": product.master_product.category.name,
            "prices": price_map
        })

    return JsonResponse(response_data, safe=False)

@api_view(['POST'])
def send_contact_email(request):
    data = request.data
    name = data.get("nev")
    email = data.get("email")
    subject = data.get("targy")
    message = data.get("uzenet")

    full_message = f"Név: {name}\nEmail: {email}\n\nÜzenet:\n{message}"

    try:
        send_mail(
            subject=subject,
            message=full_message,
            from_email='arfigyelo.kapcsolat@gmail.com',
            recipient_list=['arfigyelo.kapcsolat@gmail.com'],
            fail_silently=False,
        )
        return Response({"success": True, "message": "Üzenet elküldve!"})
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=500)
