from django.db import models

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.models import AbstractUser


class MyAccountManager(BaseUserManager):
    def create_account(self, email, first_name, last_name, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not first_name:
            raise ValueError('The First Name field must be set')
        if not last_name:
            raise ValueError('The Last Name field must be set')

        
        email = self.normalize_email(email)
        account = self.model(email=email, **extra_fields)
        account.first_name = first_name
        account.last_name = last_name
        
        account.set_password(password)
        account.save(using=self._db)
        return account


    def create_superuser(self, email, first_name, last_name, password=None):
        
        account = self.create_account(
            email=self.normalize_email(email),
            first_name = first_name,
            last_name = last_name,
            password=password,
        )

        account.is_admin = True
        account.is_staff = True
        account.is_superuser = True
        account.save(using=self._db)

        return account


class Account(AbstractBaseUser, PermissionsMixin):
    class Meta:
        db_table = "accounts_account"

        
    email           = models.EmailField(verbose_name='email', unique=True)
    first_name      = models.CharField(max_length=120, verbose_name='first_name', unique=True)
    last_name       = models.CharField(max_length=120, verbose_name='last_name', unique=True)

    is_admin        = models.BooleanField(default=False)
    is_active       = models.BooleanField(default=True)
    is_staff        = models.BooleanField(default=False)
    is_superuser    = models.BooleanField(default=False)

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = MyAccountManager()

    def __str__(self):
        return self.email
    
    def has_perm(self, perm, obj=None):
        return self.is_admin
    
    def has_module_label(self, app_label):
        return True



### old ###
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

