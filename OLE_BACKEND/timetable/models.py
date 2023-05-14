from django.db import models

# Create your models here.
class Activity(models.Model):
    name = models.CharField(max_length=120, null=True)
    day = models.CharField(max_length=120, null=True)
    start_time = models.IntegerField(null=True)
    end_time = models.IntegerField(null=True)
    notes = models.CharField(max_length=1000, null=True)
    img_id = 'ajsckanlanca1323'

    def __str__(self):
        return self.name

    