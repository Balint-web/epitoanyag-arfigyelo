from django.core.management.base import BaseCommand
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
from shop.models import Store, Product, Price

class Command(BaseCommand):
    help = 'Árak scrape-elése és adatbázisba mentése'

    def handle(self, *args, **kwargs):
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        driver = webdriver.Chrome(options=chrome_options)

        try:
            url = "https://www.govill.hu/hu/kabelek-es-vezetekek/villanyszerelesi-vezetekek-es-kabelek/mcu-h05v-u-h07v-u-egyeru-tomor-vezetek/mcu-15mm-tomor-eru-rezvezetek-zold-sarga-h07v-u/"
            driver.get(url)
            time.sleep(5)

            # ✅ Termék adatainak scrape-elése
            product_name = driver.find_element(By.TAG_NAME, 'h1').text.strip()
            cikkszam_raw = driver.find_element(By.XPATH, "//div[contains(@class, 'col-sm-4') and contains(text(), 'Cikkszám')]").text.strip()
            cikkszam = cikkszam_raw.split(":")[1].strip()
            netto_ar = driver.find_element(By.XPATH, "//div[@class='price-title' and contains(text(),'Nettó ár')]/following-sibling::span").text.strip()
            brutto_block = driver.find_element(By.XPATH, "//div[@class='list1' and .//div[contains(text(),'Bruttó ár')]]")
            brutto_text = brutto_block.text
            brutto_value = [word for word in brutto_text.split() if 'Ft' in word or word.isdigit()]
            brutto_ar = ' '.join(brutto_value)

            # ✅ Adatok mentése az adatbázisba
            store, created = Store.objects.get_or_create(name="Govill", defaults={'url': 'https://www.govill.hu/'})
            if not created:
                store.url = 'https://www.govill.hu/'
                store.save()

            product, _ = Product.objects.get_or_create(name=product_name)

            Price.objects.create(
                product=product,
                store=store,
                price=int(brutto_ar.replace('Ft', '').strip())  # csak számot tároljunk
            )

            self.stdout.write(self.style.SUCCESS(f"✅ Sikeresen lementve: {product_name} - {brutto_ar}"))

        except Exception as e:
            self.stderr.write(f"Hiba: {e}")
        finally:
            driver.quit()
