#from django.core.management.base import BaseCommand
#from shop.scraper import scrape_all  # vagy amit használsz

class Command(BaseCommand):
    help = 'Termékárak frissítése webscrapinggel'

    def handle(self, *args, **kwargs):
        self.stdout.write(" Árfrissítés elindult...")
        scrape_all()
        self.stdout.write(" Árfrissítés sikeresen befejeződött.")
