from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # Az alapértelmezett groups és user_permissions mezőket felülírjuk
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_groups',  # Egyedi related_name
        blank=True
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_permissions',  # Egyedi related_name
        blank=True
    )






#class CustomUser(AbstractUser):
   # email = models.EmailField(unique=True)

   # def __str__(self):
     #   return self.username
