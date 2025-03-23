from django.db import models

class Store(models.Model):
    """Bolti információk tárolása"""
    name = models.CharField(max_length=255, unique=True)
    url = models.URLField(unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    """Termékek adatainak tárolása"""
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name

class Price(models.Model):
    """Árak tárolása az egyes boltokból"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.name} - {self.store.name} - {self.price} Ft"
