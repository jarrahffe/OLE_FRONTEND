from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Activity(models.Model):
    name = models.CharField(max_length=120, default=None)
    type = models.CharField(max_length=120, default=None)
    day = models.CharField(max_length=120, default=None)
    start_time = models.IntegerField(default=None)
    notes = models.CharField(max_length=1000, blank=True)
    date = models.DateField(default=None)

    user = models.ForeignKey(User, default=None, on_delete=models.CASCADE, blank=True)


    def __str__(self):
        return self.name