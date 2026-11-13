from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    fio = models.CharField(max_length=150, verbose_name="ФИО") 
    telefon = models.CharField(max_length=20, blank=True, null=True, verbose_name="Телефон")
    
    email = models.EmailField(unique=True, verbose_name="Email")

    def __str__(self):
        return self.username