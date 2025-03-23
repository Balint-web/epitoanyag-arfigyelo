import requests
from bs4 import BeautifulSoup
from django.utils.timezone import now
from shop.models import Store, Product, Price

# A webshopok listája
STORES = [
    {"name": "Daniella", "url": "https://daniella.hu/"},
    {"name": "Mentavill", "url": "https://www.mentavill.hu/"},
    {"name": "Govill", "url": "https://www.govill.hu/hu/"},
]

# Webscraping függvény
def scrape_prices():
    for store in STORES:
        store_obj, _ = Store.objects.get_or_create(name=store["name"], url=store["url"])
        print(f"🔍 {store['name']} weboldalának beolvasása...")

        try:
            response = requests.get(store["url"], timeout=10)
            if response.status_code != 200:
                print(f"⚠ Hiba: Nem sikerült elérni a(z) {store['name']} weboldalt ({response.status_code})")
                continue

            soup = BeautifulSoup(response.text, "html.parser")

            # 🔴 FONTOS: Módosítsd a webshopok szerkezetéhez megfelelően!
            if store["name"] == "Daniella":
                products = soup.select(".product-item")  # Példa: meg kell nézni a Daniella HTML szerkezetét
            elif store["name"] == "Mentavill":
                products = soup.select(".product-container")  # Példa: ellenőrizni kell a Mentavill oldalát
            elif store["name"] == "Govill":
                products = soup.select(".product-box")  # Példa: ellenőrizni kell a Govill oldalát
            else:
                continue

            for product in products:
                try:
                    name = product.select_one(".product-title").text.strip()
                    price_text = product.select_one(".product-price").text.strip()
                    price = float(price_text.replace(" Ft", "").replace(",", "."))
                    product_url = product.select_one("a")["href"]
                    image_url = product.select_one("img")["src"]

                    product_obj, _ = Product.objects.get_or_create(
                        name=name,
                        category="Villanyszerelési termékek",
                        image_url=image_url
                    )

                    # Frissítsük az árat vagy hozzuk létre, ha még nincs
                    Price.objects.update_or_create(
                        product=product_obj,
                        store=store_obj,
                        defaults={"price": price, "last_updated": now()}
                    )

                    print(f"✅ {name} - {price} Ft ({store['name']})")
                
                except Exception as e:
                    print(f"⚠ Hiba termék feldolgozása közben: {e}")

        except requests.RequestException as e:
            print(f"❌ Hálózati hiba történt: {e}")

    print("🎉 Webscraping sikeresen befejeződött!")

if __name__ == "__main__":
    scrape_prices()
