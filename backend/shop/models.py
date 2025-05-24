from django.db import models
from django.contrib.auth.models import User

class Store(models.Model):
    """Bolti információk tárolása"""
    name = models.CharField(max_length=255, unique=True)
    url = models.URLField(unique=True)

    class Meta:
        verbose_name = "Shop"
        verbose_name_plural = "Shops"

    def __str__(self):
        return self.name

class Category(models.Model):
    """Termékkategóriák tárolása"""
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class MasterProduct(models.Model):
    """
    Összesített termék (pl. ugyanaz az Asfora kapcsoló több boltban kapható).
    A nevet itt tároljuk, nem a Product-ban.
    """
    name = models.CharField(max_length=255)  # Pl. "Asfora váltókapcsoló"
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Product(models.Model):
    """
    Egy adott boltban elérhető konkrét termék (egy master_product bolt-specifikus változata).
    """
    master_product = models.ForeignKey(MasterProduct, on_delete=models.CASCADE, related_name='offers')
    store = models.CharField(max_length=100)  # Pl. "Mentavill", "Govill"
    image_url = models.URLField()
    product_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.master_product.name} - {self.store}"


class Price(models.Model):
    """
    Ártörténet vagy aktuális ár mentése – bolt és termék alapján.
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="price_entries")
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.master_product.name} - {self.store.name} - {self.price} Ft"

class Cart(models.Model):
    """Kosár a felhasználónak"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Kosár - {self.user.username}"

class CartItem(models.Model):
    """Kosár tétel (termék és mennyiség)"""
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.product} x {self.quantity}"
