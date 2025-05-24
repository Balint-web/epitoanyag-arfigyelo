import requests
from bs4 import BeautifulSoup
from django.utils.timezone import now
from shop.models import Store, Product, Price, Category
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from shop.models import MasterProduct

import time
import re

def detect_category(url):
    if any(word in url for word in ["asfora", "kapcsoló", "konnektor", "valena", "101", "105", "106", "aljzat"]):
        return "Szerelvények (kapcsolók, dugaljak)"
    elif any(word in url for word in ["kismegszakító", "védőkapcsoló", "fi relé", "fi-relé", "áramvédő", "omb", "szakít"]):
        return "Védelmi eszközök (kismegszakító, Fi-relé)"
    elif any(word in url for word in ["ym-j", "h07v", "mcu", "réz", "vezeték", "mbcu", "mt", "kábel"]):
        return "Kábelek és vezetékek"
    elif any(word in url for word in ["elosztó", "lakáselosztó", "modul", "szekrény", "hager"]):
        return "Elosztó szekrények és kiegészítők"
    elif any(word in url for word in ["led", "3000k", "4000k", "2700k", "reflektor", "világítás", "foglalat"]):
        return "Lámpatestek"
    elif any(word in url for word in ["védőcső", "gipsz", "wago", "doboz", "tippli", "csavar", "mű-iii"]):
        return "Rögzítési- és kötőanyagok"
    else:
        return "Egyéb"  # alapértelmezett kategória


# Mentavill kategória oldalak (bővíthető új URL-ekkel is)
MENTAVILL_CATEGORIES = [
     "https://www.mentavill.hu/termek/vezetekosszekoto-2-polusu-atlatszo-nyithato-sodrott-vezetekes-hez-100db-csomag-128227",
    "https://www.mentavill.hu/termek/vezetekosszekoto-3-polusu-atlatszo-nyithato-sodrott-vezetekes-hez-50db-csomag-128228",
    "https://www.mentavill.hu/termek/vezetekosszekoto-5-polusu-atlatszo-nyithato-sodrott-vezetekes-hez-25db-csomag-128229",
    "https://www.mentavill.hu/termek/foglalat-e27-feher-pattintos-til-013-4535",
    "https://www.mentavill.hu/termek/valena-life-101-egypolusu-kapcsolo-mechanizmus-rugos-49428",
    "https://www.mentavill.hu/termek/valena-life-105-csillarkapcsolo-mechanizmus-rugos-49431",
    "https://www.mentavill.hu/termek/valena-life-106-valtokapcsolo-mechanizmus-rugos-49432",
    "https://www.mentavill.hu/termek/lakaseloszto-sullyesztett-1x12m-atlatszo-ajto-4783",
    "https://www.mentavill.hu/termek/lakaseloszto-sullyesztett-2x12m-atlatszo-ajto-4785",
    "https://www.mentavill.hu/termek/lakaseloszto-falon-kivuli-1x12m-atlatszo-ajto-4766",
    "https://www.mentavill.hu/termek/lakaseloszto-falon-kivuli-2x12m-atlatszo-ajto-4768",
    "https://www.mentavill.hu/termek/sorolosin-villas-1p-63a-12modul-202387",
    "https://www.mentavill.hu/termek/led-panel-40w-4000k-1200x300-4400lm-sku-216625-199123",
    "https://www.mentavill.hu/termek/telefon-dugo-8p-8c-patch-kabelhez-sodrott-kabelhez-114870",
    "https://www.mentavill.hu/termek/behuzo-20m-muanyag-atmero-4-mm-4500",
    "https://www.mentavill.hu/termek/utp-cat6-4x2xawg23-falkabel-4x2x-051-200601",
    "https://www.mentavill.hu/termek/utp-cat5e-4x2xawg24-falkabel-u-utp-4x2x-0-46-24-awg-200599",
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
    "https://www.mentavill.hu/termek/aramvedo-40a-4p-30ma-krd6-4-40-30-a-firele-198956",
    "https://www.mentavill.hu/termek/foglalat-e27-fekete-pattintos-til-017-4536",
    "https://www.mentavill.hu/termek/led-fenyveto-reflektor-10w-4000k-900lm-fekete-lapos-kivitel-elotet-nelkul-2897",
    "https://www.mentavill.hu/termek/led-fenyveto-reflektor-20w-4000k-1600lm-fekete-lapos-kivitel-elotet-nelkul-2898",
    "https://www.mentavill.hu/termek/led-fenyveto-reflektor-30w-4000k-2200lm-fekete-lapos-kivitel-elotet-nelkul-2899",
    "https://www.mentavill.hu/termek/led-fenyveto-reflektor-50w-4000k-3700lm-fekete-lapos-kivitel-elotet-nelkul-2900",
    "https://www.mentavill.hu/termek/led-fenyveto-reflektor-mozgaserzekelovel-10w-4000k-900lm-fekete-lapos-kivitel-elotet-nelkul-2903",
    "https://www.mentavill.hu/termek/led-fenyveto-reflektor-mozgaserzekelovel-20w-4000k-1600lm-fekete-lapos-kivitel-elotet-nelkul-2904",
    "https://www.mentavill.hu/termek/led-fenyveto-reflektor-mozgaserzekelovel-30w-4000k-2200lm-fekete-lapos-kivitel-elotet-nelkul-2905",
    "https://www.mentavill.hu/termek/midea-led-panel-kerek-6w-3000k-320lm-sullyesztett-anyaga-aluminium-2716",
    "https://www.mentavill.hu/termek/midea-led-panel-kerek-12w-3000k-780lm-sullyesztett-anyaga-aluminium-2717",
    "https://www.mentavill.hu/termek/midea-led-panel-kerek-6w-4000k-330lm-falon-kivuli-anyaga-aluminium-2725",
    "https://www.mentavill.hu/termek/midea-led-panel-kerek-12w-4000k-840lm-falon-kivuli-anyaga-aluminium-2726"
 
]

def scrape_mentavill():
    print(" Scraping Mentavill (Selenium)...")
    store, _ = Store.objects.get_or_create(name="Mentavill", defaults={"url": "https://www.mentavill.hu/"})

    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    try:
        for url in MENTAVILL_CATEGORIES:
            print(f"\n Termékoldal: {url}")
            try:
                driver.get(url)
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "h1")))

                name = driver.find_element(By.TAG_NAME, "h1").text.strip()

                price_elem = driver.find_element(By.CSS_SELECTOR, "div.onlinePrice")
                raw_price = price_elem.text.strip()
                price_number = raw_price.split("Ft")[0].replace(" ", "").replace(".", "")
                price = int(price_number)

                unit = "m"
                if "/ db" in raw_price or "/db" in raw_price:
                    unit = "db"

                # 🔧 ÚJ kép lekérő rész:
                image_url = ""
                try:
                    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, '#images img')))
                    image_elem = driver.find_element(By.CSS_SELECTOR, '#images img')
                    image_url = image_elem.get_attribute("src")
                    if image_url.startswith("/"):
                        image_url = "https://www.mentavill.hu" + image_url
                except Exception as e:
                    print(f"Kép lekérés sikertelen: {e}")

                if image_url:
                    print(f"Kép sikeresen mentve: {image_url}")
                else:
                    print(f"Nincs kép ehhez a termékhez: {name}")

                category_name = detect_category(url)
                category_obj, _ = Category.objects.get_or_create(name=category_name)

                master_product, _ = MasterProduct.objects.get_or_create(
                    name=name,
                    defaults={"category": category_obj}
                )

                product, _ = Product.objects.get_or_create(
                    master_product=master_product,
                    defaults={
                        "image_url": image_url,
                        "product_url": url
                    }
                )

                Price.objects.update_or_create(
                    product=product,
                    store=store,
                    defaults={"price": price, "last_updated": now()}
                )

                print(f"✅ {name} - {price} Ft / {unit}")

            except Exception as e:
                print(f"❌ Hiba a feldolgozásnál: {e}")
    finally:
        driver.quit()
                
MIXVILL_URLS = [
    "https://www.mixvill.hu/hu/kapcsolocsaladok/sullyesztett-kapcsolocsaladok/schneider-asfora-kapcsolocsalad/asfora-dugaljak-konnektorok/schneider-asfora-se-eph2900121-2pf-aljzat-dugalj-csavaros-feher",
    "https://www.mixvill.hu/hu/kapcsolocsaladok/sullyesztett-kapcsolocsaladok/schneider-asfora-kapcsolocsalad/asfora-dugaljak-konnektorok/schneider-se-eph9900121-asfora-2x2f-aljzat-feher-dupla-dugalj-konnektor-schuko",
    "https://www.mixvill.hu/hu/kapcsolocsaladok/sullyesztett-kapcsolocsaladok/schneider-asfora-kapcsolocsalad/asfora-kapcsolok-nyomogombok/schneider-asfora-egypolusu-kapcsolo-feher-101-keret-nelkul-sullyesztett-se-eph0170121",
    "https://www.mixvill.hu/hu/kapcsolocsaladok/sullyesztett-kapcsolocsaladok/schneider-asfora-kapcsolocsalad/asfora-kapcsolok-nyomogombok/schneider-asfora-valtokapcsolo-szimbolummal-keret-nelkul-feher-se-eph0470121-sullyesztett",
    "https://www.mixvill.hu/hu/kapcsolocsaladok/sullyesztett-kapcsolocsaladok/schneider-asfora-kapcsolocsalad/asfora-kapcsolok-nyomogombok/schneider-asfora-csillarkapcsolo-feher-105-kapcsolo-keret-nelkul-sullyesztett-se-eph0370121",
    "https://www.mixvill.hu/hu/szerelestechnika/vezetekosszekotok/csatos-wago-vezetekosszekoto-221-612-2x0-5-6mm2-hajlekony-es-tomor-vezetekhez",
    "https://www.mixvill.hu/hu/szerelestechnika/vezetekosszekotok/csatos-wago-vezetekosszekoto-221-613-3x0-5-6mm2-hajlekony-es-tomor-vezetekhez",
    "https://www.mixvill.hu/hu/szerelestechnika/vezetekosszekotok/csatos-wago-vezetekosszekoto-221-615-5x0-5-6mm2-hajlekony-es-tomor-vezetekhez",
    "https://www.mixvill.hu/hu/eloszto-fogyasztasmero-szekrenyek/sullyesztett-lakaselosztok/630-635-tipusu-feher-es-fustszinu-ajtos-muanyag-elosztoszekrenyek/63012be-12-modulos-feher-sullyesztett-eloszto-fust-szinu-ajtoval-ip40",
    "https://www.mixvill.hu/hu/eloszto-fogyasztasmero-szekrenyek/sullyesztett-lakaselosztok/630-635-tipusu-feher-es-fustszinu-ajtos-muanyag-elosztoszekrenyek/ec-63024ce-feher-24-modulos-sullyesztett-elosztoszekreny-feher-szinu-ajtoval-ip40",
    "https://www.mixvill.hu/hu/eloszto-fogyasztasmero-szekrenyek/falon-kivuli-lakaselosztok/mlf-lakaselosztok-fust-szinu-ajtoval/omu-system-mlf12-pd-12-modulos-lakaseloszto-fust-ajtoval",
    "https://www.mixvill.hu/hu/eloszto-fogyasztasmero-szekrenyek/falon-kivuli-lakaselosztok/mlf-lakaselosztok-fust-szinu-ajtoval/omu-system-mlf24-pd-24-modulos-lakaseloszto-fust-ajtoval",
    "https://www.mixvill.hu/hu/ujdonsagok/omu-lighting-22-plugr30123-4000k-emelt-fenyu-led-panel-120x30cm-30w-4000lm-vibralasmentes-ugr19-pmm",
    "https://www.mixvill.hu/hu/szerelestechnika/gyengearamu-csatlakozok-elosztok/telefon-es-adatatviteli-csatlakozok-tartozekok/05232-modularis-csatlakozo-8p_8c-cat-5-krimpelheto",
    "https://www.mixvill.hu/hu/szerelestechnika/szerszamok-muszerek-tarolok/szerszamok-villanyszereleshez/kabelbehuzo-berudalo-kabelgorgo/runpotec-runpo1-special-20m-es-muanyag-behuzo-szal-kabelbehuzo-4mm-atmeroju-fejjel-30030",
    

    "https://www.mixvill.hu/hu/kabelek-es-vezetekek/mcu-1x1-5-fekete-h07v-u-100m_-tekercs",
    "https://www.mixvill.hu/hu/kabelek-es-vezetekek/mcu-1x1-5-kek-h07v-u-100m_-tekercs",
    "https://www.mixvill.hu/hu/kabelek-es-vezetekek/mcu-1x1-5-zold-sarga-h07v-u-100m_-tekercs",
    "https://www.mixvill.hu/hu/kabelek-es-vezetekek/mcu-1x2-5-fekete-h07v-u-100m_-tekercs",
    "https://www.mixvill.hu/hu/kabelek-es-vezetekek/mcu-1x2-5-kek-h07v-u-100m_-tekercs-tomor-vezetek",
    "https://www.mixvill.hu/hu/kabelek-es-vezetekek/mcu-1x2-5-zold-sarga-h07v-u-100m_-tekercs",
    "https://www.mixvill.hu/hu/kabelek-es-vezetekek/mb-cu-3x1-5-nym-j-100m_-tekercs",
    "https://www.mixvill.hu/hu/kabelek-es-vezetekek/mb-cu-3x2-5-nym-j-100m_-tekercs",
    "https://www.mixvill.hu/hu/kabelek-es-vezetekek/mb-cu-5x1-5-nym-j-100m_-tekercs",
    "https://www.mixvill.hu/hu/kabelek-es-vezetekek/mb-cu-5x2-5-nym-j-100m_-tekercs",
    "https://www.mixvill.hu/hu/kabelek-es-vezetekek/h05vv-f-3x1-500v-mt-100m_-tekercs",
    "https://www.mixvill.hu/hu/kabelek-es-vezetekek/h05vv-f-3x1-5-500v-mt-100m_-tekercs",
    "https://www.mixvill.hu/hu/kabelek-es-vezetekek/h05vv-f-3x2-5-500v-mt-100m_-tekercs",


    "https://www.mixvill.hu/hu/energiaelosztas/kismegszakitok/4-5ka-kismegszakito/omu-system-omb45-1-polusu-10a-b-4-5ka-kismegszakito-omb45110b",
    "https://www.mixvill.hu/hu/energiaelosztas/kismegszakitok/6ka-kismegszakito/omu-system-omb06-1-polusu-13a-c-6ka-kismegszakito-omb06113c",
    "https://www.mixvill.hu/hu/energiaelosztas/kismegszakitok/4-5ka-kismegszakito/omu-system-omb45-1-polusu-16a-b-4-5ka-kismegszakito-omb45116b",
    "https://www.mixvill.hu/hu/energiaelosztas/kismegszakitok/6ka-kismegszakito/omu-system-omb06-1-polusu-20a-b-6ka-kismegszakito-omb06120b",
    "https://www.mixvill.hu/hu/energiaelosztas/kismegszakitok/4-5ka-kismegszakito/omu-system-omb45-3-polusu-16a-c-4-5ka-kismegszakito-omb45316c",
    "https://www.mixvill.hu/hu/energiaelosztas/kismegszakitok/schneider-kismegszakitok/schneider-electric-2-polusu-25a-30ma-resi9-aram-vedokapcsolo-fi-rele-r9r11225-ac-osztaly",
    "https://www.mixvill.hu/hu/energiaelosztas/kismegszakitok/schneider-kismegszakitok/schneider-electric-2-polusu-40a-30ma-resi9-aram-vedokapcsolo-fi-rele-r9r11240-ac-osztaly",
    "https://www.mixvill.hu/hu/energiaelosztas/kismegszakitok/schneider-kismegszakitok/schneider-electric-4-polusu-25a-30ma-resi9-aram-vedokapcsolo-fi-rele-r9r11425-ac-osztaly",
    "https://www.mixvill.hu/hu/energiaelosztas/kismegszakitok/schneider-kismegszakitok/schneider-electric-4-polusu-40a-30ma-resi9-aram-vedokapcsolo-fi-rele-r9r11440-ac-osztaly"


]
def scrape_mixvill():
    print("🔍 Scraping Mixvill (Selenium)...")
    store, _ = Store.objects.get_or_create(name="Mixvill", defaults={"url": "https://www.mixvill.hu/"})

    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    try:
        for url in MIXVILL_URLS:
            print(f"\n Termékoldal: {url}")
            try:
                driver.get(url)

                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "h1")))
                name = driver.find_element(By.TAG_NAME, "h1").text.strip()

                # Árkivonás
                price = None
                try:
                    price_elem = driver.find_element(By.CSS_SELECTOR, 'span[itemprop="price"]')
                    price_text = price_elem.get_attribute("content")
                    price = int(float(price_text))
                except Exception as e:
                    print(f"Ár nem olvasható: {e}")
                if price is None:
                    raise Exception("Ár nem található")

                # 👉 Egyszerű kép lekérés (nincs lightbox!)
                image_url = ""
                try:
                    image_elem = driver.find_element(By.CSS_SELECTOR, "img.js-qv-product-cover")
                    image_url = image_elem.get_attribute("src")
                except Exception:
                    print(f"⚠️ Nincs kép ehhez a termékhez: {name}")

                if image_url:
                    print(f"📷 Kép elmentve: {image_url}")

                # Kategória felismerés
                category_name = detect_category(url)
                category_obj, _ = Category.objects.get_or_create(name=category_name)

                master_product, _ = MasterProduct.objects.get_or_create(
                    name=name,
                    defaults={"category": category_obj}
                )

                product, _ = Product.objects.get_or_create(
                    master_product=master_product,
                    defaults={
                        "image_url": image_url,
                        "product_url": url
                    }
                )

                Price.objects.update_or_create(
                    product=product,
                    store=store,
                    defaults={"price": price, "last_updated": now()}
                )

                print(f"✅ {name} - {price} Ft")

            except Exception as e:
                print(f"❌ Hiba a feldolgozásnál: {e}")
    finally:
        driver.quit()


DANIELLA_URLS = [
    "https://daniella.hu/asfora-2p-f-csatlakozoaljzat-csavaros-kerettel-feher-eph2900121-schneider-id-scheph2900121",
    "https://daniella.hu/asfora-egypolusu-kapcsolo-rugos-bekoetes-kerettel-feher-101-eph0100121-schneider-id-scheph0100121",
    "https://daniella.hu/asfora-2x2p-f-csatlakozoaljzat-csavaros-kerettel-feher-eph9900121-schneider-id-scheph9900121",
    "https://daniella.hu/asfora-valtokapcsolo-rugos-bekoetes-kerettel-feher-106-eph0400121-schneider-id-scheph0400121",
    "https://daniella.hu/asfora-csillarkapcsolo-rugos-bekoetes-kerettel-feher-105-eph0300121-schneider-id-scheph0300121",

    "https://daniella.hu/h07v-u-1x-15-fekete-(100)-450750v-egyeru-tomorvezetek-(m-cu-mcu)-id-vez1600012",
    "https://daniella.hu/h07v-u-1x-15-kek-(100)-450750v-egyeru-tomorvezetek-(m-cu-mcu)-id-vez1600013",
    "https://daniella.hu/h07v-u-1x-15-zoldsarga-(100)-450750v-egyeru-tomorvezetek-(m-cu-mcu)-id-vez1600019",
    "https://daniella.hu/h07v-u-1x-25-fekete-(100)-450750v-egyeru-tomorvezetek-(m-cu-mcu)-id-vez1600023",
    "https://daniella.hu/h07v-u-1x-25-kek-(100)-450750v-egyeru-tomorvezetek-(m-cu-mcu)-id-vez1600024",
    "https://daniella.hu/h07v-u-1x-25-zoldsarga-(100)-450750v-egyeru-tomorvezetek-(m-cu-mcu)-id-vez1600027",
    "https://daniella.hu/nym-j-3x-15-szurke-(100)-300500v-tomor-installacios-vezetek-(mb-cu-mbcu)-id-vez2100002",
    "https://daniella.hu/nym-j-3x-25-szurke-(100)-300500v-tomor-installacios-vezetek-(mb-cu-mbcu)-id-vez2100007",
    "https://daniella.hu/nym-j-5x-15-szurke-(100)-300500v-tomor-installacios-vezetek-(mb-cu-mbcu)-id-vez2100028",
    "https://daniella.hu/nym-j-5x-25-szurke-(100)-300500v-tomor-installacios-vezetek-(mb-cu-mbcu)-id-vez2100031",
    "https://daniella.hu/h05vv-f-3x-15-feher-(100)-300500v-hajlekony-tomlovezetek-(mt)-id-vez1800042",
    "https://daniella.hu/h05vv-f-3x-1-feher-(100)-300500v-hajlekony-tomlovezetek-(mt)-id-vez1800037",
    "https://daniella.hu/h05vv-f-3x-25-feher-(100)-300500v-hajlekony-tomlovezetek-(mt)-id-vez1800049",

    "https://daniella.hu/kismegszakito-1b-10a-6ka-stb1-63-stilo-sti558-id-sti558",
    "https://daniella.hu/kismegszakito-1b-16a-6ka-stb1-63-stilo-sti560-id-sti560",
    "https://daniella.hu/kismegszakito-1b-20a-6ka-stb1-63-stilo-sti562-id-sti562",
    "https://daniella.hu/kismegszakito-3c-16a-6ka-stb1-63-stilo-sti579-id-sti579",
    "https://daniella.hu/fi-rele-2p-40a-30ma-a-tipusu-stilo-stl52-sti787-id-sti787",
    "https://daniella.hu/fi-rele-4p-40a-30ma-a-tipusu-stilo-stl52-sti793-id-sti793",
    "https://daniella.hu/wago-221-412-vezetek-osszekoto-sodrott-2-es-atlatszo-02-4mm2-32a-id-wago221412",
    "https://daniella.hu/wago-221-413-vezetek-osszekoto-sodrott-3-as-atlatszo-02-4mm2-32a-id-wago221413",
    "https://daniella.hu/wago-221-415-vezetek-osszekoto-sodrott-5-os-atlatszo-02-4mm2-32a-id-wago221415",
    "https://daniella.hu/e27-foglalat-feher-muanyag-f-27-301-m-delux-del046-id-del046",
    "https://daniella.hu/valena-life-752101-101-egypolusu-kapcsolo-feher-legrand-id-leg752101",
    "https://daniella.hu/valena-life-752105-105-csillarkapcsolo-feher-legrand-id-leg752105",
    "https://daniella.hu/valena-life-752106-106-valtokapcsolo-feher-legrand-id-leg752106",
    "https://daniella.hu/lakaseloszto-suellyesztett-12-modulos-ip55-gw48682-gewiss-id-gewgw48682",
    "https://daniella.hu/kiseloszto-falonkivueli-1-12-atlatszo-ajtoval-ip30-pe-n-sinnel-sti615-stilo-id-sti615",
    "https://daniella.hu/tfss-1-sorolo-sin-1f-max-63a-tracon-id-tratfss1",
    "https://daniella.hu/led-panel-1200-300-35w-4200lm-4000k-ip20-mennyezeti-lampatest-pl-int-sf-4099854188497-ledvance-id-ldv4099854188497",
    "https://daniella.hu/telefon-modularis-dugo-8p8c-cat-5-hoz-csat-t004-ftp-id-som0889",
    "https://daniella.hu/muanyag-behuzo-runpo1-special-20-m-runpo-300-300-d-4mm-id-cel300300",
    "https://daniella.hu/szamitogep-vezetek-cat6-utp-fali-rez-250mhz-lsoh-lszh-european-305-id-vez1000099",
    "https://daniella.hu/szamitogep-vezetek-cat5-e-utp-fali-rez-pvc-belden-1583e-305-id-belde1583e"
]

def scrape_daniella():
    print("🔍 Scraping Daniella Villamosság...")
    store, _ = Store.objects.get_or_create(name="Daniella", defaults={"url": "https://daniella.hu/"})

    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    try:
        for url in DANIELLA_URLS:
            print(f"\n📄 Termékoldal: {url}")
            try:
                driver.get(url)

                WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
                soup = BeautifulSoup(driver.page_source, "html.parser")

                # Név kinyerése: első található H5 tag, vagy fallback a <h1>, <h2> alapján
                name = ""
                for tag in ["h5", "h1", "h2"]:
                    elem = soup.find(tag, {"class": "one-cms-grid-renderer"})
                    if elem:
                        name = elem.get_text(strip=True)
                        break
                if not name:
                    raise Exception("Terméknév nem található")

                # Ár kinyerése: többféle szelektorral próbálkozunk
                price = None
                selectors = [
                    "h3.one-product-tile-right-price__value",       # újabb struktúrák
                    "h3.one-product-tile-right-price__value.mb-0",  # másik variáns
                    "div.sale",                                     # fallback Govill struktúrára hasonló
                ]
                for sel in selectors:
                    try:
                        elem = soup.select_one(sel)
                        if elem and "Ft" in elem.text:
                            price_text = elem.text.split("Ft")[0]
                            price_clean = price_text.replace(" ", "").replace(".", "").replace(",", ".")
                            price = int(float(price_clean))
                            break
                    except:
                        continue

                if price is None:
                    raise Exception("Ár nem található: egyik szelektor sem működött")

                # Kép lekérése
                image_url = ""
                try:
                    # Próbáljuk először a slide-képet
                    image_elem = driver.find_element(By.CSS_SELECTOR, "img.slide-content")
                    image_url = image_elem.get_attribute("src")
                except:
                    try:
                        # Ha nem található, próbáljuk a másik (szerelvényes) képet
                        image_elem = driver.find_element(By.CSS_SELECTOR, "img.main-img")
                        image_url = image_elem.get_attribute("src")
                    except:
                        image_url = ""
                # Vissza jelzés a sikeres kép betöltésről
                if image_url:
                    print(f"Kép sikeresen mentve: {image_url}")
                else:
                    print(f"Nincs kép ehhez a termékhez: {name}")        
                # Kategória mentés
                category_name = detect_category(url)
                category_obj, _ = Category.objects.get_or_create(name=category_name)

                master_product, _ = MasterProduct.objects.get_or_create(
                    name=name,
                    defaults={"category": category_obj}
                )

                product, _ = Product.objects.get_or_create(
                    master_product=master_product,
                    defaults={
                        "image_url": image_url,
                        "product_url": url
                    }
                )

                Price.objects.update_or_create(
                    product=product,
                    store=store,
                    defaults={"price": price, "last_updated": now()}
                )

                print(f"✅ {name} - {price} Ft")

            except Exception as e:
                print(f"❌ Hiba a feldolgozásnál: {e}")
    finally:
        driver.quit()

    
GOVILL_KABELEK = [
    "https://www.govill.hu/hu/mbcu-3x15mm-tomor-eru-rezkabel-kabel-nym-j/",
    "https://www.govill.hu/hu/mbcu-3x25mm-tomor-eru-rezkabel-kabel-nym-j/",
    "https://www.govill.hu/hu/mbcu-5x15mm-tomor-eru-rezkabel-kabel-nym-j/",
    "https://www.govill.hu/hu/mbcu-5x25mm-tomor-eru-rezkabel-kabel-nym-j/",
    "https://www.govill.hu/hu/mcu-15mm-tomor-eru-rezvezetek-feketeh07v-u/",
    "https://www.govill.hu/hu/mcu-15mm-tomor-eru-rezvezetek-kek-h07v-u/",
    "https://www.govill.hu/hu/mcu-15mm-tomor-eru-rezvezetek-zold-sarga-h07v-u/",
    "https://www.govill.hu/hu/mcu-25mm-tomor-eru-rezvezetek-fekete-h07v-u/",
    "https://www.govill.hu/hu/mcu-25-mm-tomor-eru-rezvezetek-zold-sarga-h07v-u/",
    "https://www.govill.hu/hu/mcu-25-mm-tomor-eru-rezvezetek-kek-h07v-u/",
    "https://www.govill.hu/hu/mt-3x1mm-kabel-h05vv-f/",
    "https://www.govill.hu/hu/mt-3x15mm-kabel-h05vv-f/",
    "https://www.govill.hu/hu/mt-3x25mm-kabel-h05vv-f/",
    "https://www.govill.hu/hu/wago-221-412-compact-vezetek-osszekoto-2x02-4/",
    "https://www.govill.hu/hu/wago-221-413-compact-vezetek-osszekoto-3x02-4/",
    "https://www.govill.hu/hu/wago-221-613/",
    "https://www.govill.hu/hu/muanyag-e27-foglalat-pattintos-feher/",
    "https://www.govill.hu/hu/legrand-valena-life-valtokapcsolo-feher/"
    ]

GOVILL_SZERELVENYEK = [
    "https://www.govill.hu/hu/asfora-2pf-aljzat-csavaros-bekotes-feher/",
    "https://www.govill.hu/hu/asfora-2x2pf-aljzat-csavaros-bekotes-feher/",
    "https://www.govill.hu/hu/asfora-egypolusu-kapcsolo-rugos-bekotes-feher-101/",
    "https://www.govill.hu/hu/asfora-csillarkapcsolo-rugos-bekotes-feher-105/",
    "https://www.govill.hu/hu/asfora-valtokapcsolo-rugos-bekotes-feher-106/",
    "https://www.govill.hu/hu/legrand-valena-life-valtokapcsolo-feher/",
    "https://www.govill.hu/hu/legrand-valena-life-csillarkapcsolo-feher/",
    "https://www.govill.hu/hu/legrand-valena-life-egypolusu-kapcsolo-feher/",
    "https://www.govill.hu/hu/legrand-valena-life-2pf-dugalj-csavaros-bekot-feher/",
    "https://www.govill.hu/hu/legrand-valena-life-2x2pf-dugalj-gyermekvedelemmel-feher/"
]

GOVILL_VEDELMI_ESZKOZOK = [
   "https://www.govill.hu/hu/kismegszakito-resi9-1p-10a-b-45ka/",
    "https://www.govill.hu/hu/kismegszakito-resi9-1p-16a-b-45ka/",
    "https://www.govill.hu/hu/kismegszakito-resi9-1p-20a-c-45ka/",
    "https://www.govill.hu/hu/kismegszakito-resi9-1p-25a-c-45ka/",
    "https://www.govill.hu/hu/kismegszakito-resi9-3p-16a-c-45ka/",
    "https://www.govill.hu/hu/legrand-rx3-fi-rele-2p-25a-30ma/",
    "https://www.govill.hu/hu/legrand-rx3-fi-rele-2p-40a-30ma/",
    "https://www.govill.hu/hu/legrand-rx3-fi-rele-4p-25a-30ma/",
    "https://www.govill.hu/hu/legrand-rx3-fi-rele-4p-40a-30ma/",
    

]

GOVILL_ELOSZTOK = [
  "https://www.govill.hu/hu/hager-lakaseloszto-atlatszo-ajtoval-sullyesztheto-12-modul-golf/",
    "https://www.govill.hu/hu/hager-lakaseloszto-atlatszo-ajtoval-sullyesztheto-2x12-modul-golf/",
    "https://www.govill.hu/hu/hager-lakaseloszto-atlatszo-ajtoval-sullyesztheto-3x12-modul-golf/",

]

GOVILL_KOTOANYAGOK = [
    "https://www.govill.hu/hu/mu-iii-11-villanyszerelesi-vedocso/",
    "https://www.govill.hu/hu/mu-iii-135-villanyszerelesi-vedocso/",
    "https://www.govill.hu/hu/mu-iii-16-villanyszerelesi-vedocso/",
    "https://www.govill.hu/hu/dunszt-elagazodoboz-80-as-langallo-sarga-750c/",
    "https://www.govill.hu/hu/dunszt-elagazodoboz-100x100-vakolat-ala-langallo/",
    "https://www.govill.hu/hu/wago-221-412-compact-vezetek-osszekoto-2x02-4/",
    "https://www.govill.hu/hu/wago-221-413-compact-vezetek-osszekoto-3x02-4/",
    "https://www.govill.hu/hu/wago-221-415-compact-vezetek-osszekoto-5x02-4/"
]

import re  # Ez nagyon fontos!

def scrape_govill():
    print("🔍 Scraping Govill (bruttó kedvezményes vagy bruttó ár alapján)...")
    store, _ = Store.objects.get_or_create(name="Govill", defaults={"url": "https://www.govill.hu/"})

    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")

    all_urls = GOVILL_KABELEK + GOVILL_SZERELVENYEK + GOVILL_VEDELMI_ESZKOZOK + GOVILL_ELOSZTOK + GOVILL_KOTOANYAGOK

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    try:
        for url in all_urls:
            print(f"\n📄 Termékoldal: {url}")
            try:
                driver.get(url)
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "h1")))

                name = driver.find_element(By.TAG_NAME, "h1").text.strip()
                soup = BeautifulSoup(driver.page_source, "html.parser")

                # Ár kinyerése: először próbáljuk a "Bruttó kedvezményes ár"-at
                price = None

                # 1. Kedvezményes bruttó ár (ez a legfontosabb)
                for block in soup.select("div.sale"):
                    if "bruttó kedvezményes ár" in block.text.lower():
                        match = re.search(r"(\d[\d\s.,]*)\s*Ft", block.text)
                        if match:
                            raw_price = match.group(1)
                            price_clean = raw_price.replace(" ", "").replace(".", "").replace(",", ".")
                            price = int(float(price_clean))
                            break

                # 2. Ha nincs, próbáljunk sima bruttó árat
                if price is None:
                    for sel in ["div.list1", "div.price"]:
                        for block in soup.select(sel):
                            if "Ft" in block.text:
                                match = re.search(r"(\d[\d\s.,]*)\s*Ft", block.text)
                                if match:
                                    raw_price = match.group(1)
                                    price_clean = raw_price.replace(" ", "").replace(".", "").replace(",", ".")
                                    price = int(float(price_clean))
                                    break
                        if price:
                            break

                if not price:
                    raise Exception("Ár nem található (bruttó sem)")

                #Kép lekérése termékoldalról
                image_url = ""
                try:
                    image_elem = driver.find_element(By.CSS_SELECTOR, "img.preview")
                    image_url = image_elem.get_attribute("src")
                    # Ha relatív URL, kiegészítjük a domain-nel
                    if image_url.startswith("/"):
                        image_url = "https://www.govill.hu" + image_url
                except Exception as e:
                    print(f"⚠️ Kép lekérés sikertelen: {e}")
                    image_url = ""

                #Visszajelzés a képről
                if image_url:
                    print(f"🖼️ Kép sikeresen mentve: {image_url}")
                else:
                    print(f"⚠️ Nincs kép ehhez a termékhez: {name}")

                category_name = detect_category(url)
                category_obj, _ = Category.objects.get_or_create(name=category_name)

                master_product, _ = MasterProduct.objects.get_or_create(
                    name=name,
                    defaults={"category": category_obj}
                )

                product, _ = Product.objects.get_or_create(
                    master_product=master_product,
                    defaults={
                        "image_url": image_url,
                        "product_url": url
                    }
                )

                Price.objects.update_or_create(
                    product=product,
                    store=store,
                    defaults={"price": price, "last_updated": now()}
                )

                print(f"✅ {name} - {price} Ft")

            except Exception as e:
                print(f"❌ Hiba a feldolgozásnál: {e}")

    finally:
        driver.quit()
                
def scrape_all():
    print("=== 🔄 Scraping összes bolt (Mentavill → Mixvill → Daniella → Govill) ===")
    scrape_mentavill()
    scrape_mixvill()
    scrape_daniella()
    scrape_govill()
scrape_all()