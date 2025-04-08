import requests
from bs4 import BeautifulSoup
from django.utils.timezone import now
from shop.models import Store, Product, Price

PRODUCT_URLS = [
     "https://www.mentavill.hu/termek/asfora-101-egypolusu-kapcsolo-feher-72068",
    "https://www.mentavill.hu/termek/asfora-105-csillarkapcsolo-feher-72098",
    "https://www.mentavill.hu/termek/asfora-106-valtokapcsolo-feher-72110",
    "https://www.mentavill.hu/termek/h07v-u-1x-1-5-fekete-mcu-mcu-1-5-63332",
    "https://www.mentavill.hu/termek/h07v-u-1x-1-5-z-s-mcu-mcu-1-5-63333",
    "https://www.mentavill.hu/termek/h07v-u-1x-1-5-kek-mcu-mcu-1-5-63327",
    "https://www.mentavill.hu/termek/h07v-u-1x-2-5-kek-mcu-mcu-2-5-63335",
    "https://www.mentavill.hu/termek/h07v-u-1x-2-5-fekete-mcu-mcu-2-5-63339",
    "https://www.mentavill.hu/termek/h07v-u-1x-2-5-z-s-mcu-mcu-2-5-63340",
    "https://www.mentavill.hu/termek/ym-j-3x1-5-re-mm-y-100m-tek-mbcu-3x1-5-63635",
    "https://www.mentavill.hu/termek/ym-j-3x2-5-re-mm-y-100m-tek-mbcu-3x2-5-63639",
    "https://www.mentavill.hu/termek/ym-j-5x2-5-re-mm-y-100m-tek-mbcu-5x2-5-63641",
    "https://www.mentavill.hu/termek/ym-j-5x1-5-re-mm-y-100m-tek-mbcu-5x1-5-63660",
    "https://www.mentavill.hu/termek/ym-j-3x4-re-mm-y-100m-tek-mbcu-3x4-63643",
    "https://www.mentavill.hu/termek/kismegszakito-1p-b-13a-6ka-4887",
    "https://www.mentavill.hu/termek/kismegszakito-1p-b-16a-6ka-4888",
    "https://www.mentavill.hu/termek/kismegszakito-1p-b-20a-6ka-4889",
    "https://www.mentavill.hu/termek/kismegszakito-1p-b-25a-6ka-4890",
    "https://www.mentavill.hu/termek/kismegszakito-3p-b-16a-6ka-4895",
    "https://www.mentavill.hu/termek/kismegszakito-1p-c-13a-6ka-4907",
    "https://www.mentavill.hu/termek/kismegszakito-1p-c-16a-6ka-4908",
    "https://www.mentavill.hu/termek/kismegszakito-1p-c-20a-6ka-4909",
    "https://www.mentavill.hu/termek/aramvedo-16a-2p-10ma-krd6-2-16-10-firele-208881",
    "https://www.mentavill.hu/termek/aramvedo-63a-2p-30ma-krd6-2-63-30-a-firele-202710",
    "https://www.mentavill.hu/termek/aramvedo-40a-4p-30ma-krd6-4-40-30-a-firele-198956"

]
def run():
    print(" Scrape-elés Mentavill (konkrét termékoldalak)...")

    store, created = Store.objects.get_or_create(name="Mentavill", defaults={"url": "https://www.mentavill.hu/"})

    for url in PRODUCT_URLS:
        print(f"\n Termékoldal: {url}")
        try:
            response = requests.get(url, timeout=10)
            if response.status_code != 200:
                print(f"⚠️ Nem elérhető oldal: {url}")
                continue

            soup = BeautifulSoup(response.text, "html.parser")

            name_elem = soup.select_one("h1")
            price_elem = soup.find(string=lambda t: "Ft / db" in t)
            image_elem = soup.select_one("img")

            if not name_elem or not price_elem:
                print("⚠️ Hiányzik név vagy ár:", url)
                continue

            name = name_elem.text.strip()
            image_url = image_elem["src"] if image_elem else ""
            price = int(price_elem.split("Ft")[0].replace(" ", "").replace(" ", "").replace(".", "").strip())

            product, _ = Product.objects.get_or_create(
                name=name,
                defaults={"image_url": image_url}  # A category mezőt itt ne állítsuk be
            )

            Price.objects.update_or_create(
                product=product,
                store=store,
                defaults={"price": price, "last_updated": now()}
            )

            print(f"✅ {name} - {price} Ft")

        except Exception as e:
            print(f"❌ Hiba a feldolgozásnál: {e}")