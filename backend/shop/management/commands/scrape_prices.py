from django.core.management.base import BaseCommand
from shop.scraper import scrape_all

class Command(BaseCommand):
    help = "Webshop árak frissítése"

    def handle(self, *args, **kwargs):
        scrape_all()
