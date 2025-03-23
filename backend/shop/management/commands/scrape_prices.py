from django.core.management.base import BaseCommand
from shop.scraper import scrape_prices

class Command(BaseCommand):
    help = "Termékárak frissítése a webshopokról"

    def handle(self, *args, **kwargs):
        scrape_prices()
        self.stdout.write(self.style.SUCCESS('✅ Az árak sikeresen frissítve!'))
