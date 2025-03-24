from django.core.management.base import BaseCommand
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
from decimal import Decimal
from shop.models import Store, Product, Price

class Command(BaseCommand):
    help = 'Árak scrape-elése és adatbázisba mentése'

    def handle(self, *args, **kwargs):
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")
        driver = webdriver.Chrome(options=chrome_options)

        try:
            url = "https://www.govill.hu/hu/kabelek-es-vezetekek/villanyszerelesi-vezetekek-es-kabelek/mcu-h05v-u-h07v-u-egyeru-tomor-vezetek/mcu-15mm-tomor-eru-rezvezetek-zold-sarga-h07v-u/"
            driver.get(url)
            time.sleep(5)

            # ✅ Termékadatok kinyerése
            product_name = driver.find_element(By.TAG_NAME, 'h1').text.strip()

            cikkszam_raw = driver.find_element(By.XPATH, "//div[contains(@class, 'col-sm-4') and contains(text(), 'Cikkszám')]").text.strip()
            cikkszam = cikkszam_raw.split(":")[1].strip()

            netto_ar = driver.find_element(By.XPATH, "//div[@class='price-title' and contains(text(),'Nettó ár')]/following-sibling::span").text.strip()

            brutto_block = driver.find_element(By.XPATH, "//div[@class='list1' and .//div[contains(text(),'Bruttó ár')]]")
            brutto_text = brutto_block.text
            brutto_value = [word for word in brutto_text.split() if 'Ft' in word or word.isdigit()]
            brutto_ar = ' '.join(brutto_value)

            # ✅ Store mentése, ha nem létezik
            store, _ = Store.objects.get_or_create(
                name="Govill",
                defaults={'url': 'https://www.govill.hu/'}
            )

            # ✅ Product mentése, ha nem létezik
            product, _ = Product.objects.get_or_create(
                name=product_name,
                defaults={'category': 'Kábelek', 'image_url': ''}
            )

            # ✅ Ár mentése
            Price.objects.create(
                product=product,
                store=store,
                price=Decimal(brutto_ar.replace('Ft', '').replace(' ', '').strip())
            )

            self.stdout.write(self.style.SUCCESS(f"✅ Sikeresen lementve: {product_name} - {brutto_ar}"))
        
        except Exception as e:
            self.stderr.write(f"Hiba: {e}")
        
        finally:
            driver.quit()
