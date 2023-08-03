from django.db import models
from django.contrib.auth.models import User
from django.db.models import JSONField

# Create your models here.
class Activity(models.Model):
    name = models.CharField(max_length=120, default=None)
    type = models.CharField(max_length=120, default=None)
    day = models.CharField(max_length=120, default=None)
    week = models.IntegerField(default=None, null=True)
    start_time = models.IntegerField(default=None)
    notes = models.CharField(max_length=1000, blank=True)
    date = models.DateField(default=None)

    user = models.ForeignKey(User, default=None, on_delete=models.CASCADE, blank=True)


    def __str__(self): return self.name
    
class Swap_request(models.Model):
    # description = models.CharField(max_length=120, default=None)
    # changes = JSONField(default=None)
    # approved = models.IntegerField(default=None)
    # created_by = models.ForeignKey(User, default=None, on_delete=models.CASCADE, blank=True)


    activity_1 = models.ForeignKey(Activity, default=None, on_delete=models.CASCADE, related_name="swap_request_sender")
    activity_2 = models.ForeignKey(Activity, default=None, on_delete=models.CASCADE, related_name="swap_request_receiver")

    def __str__(self):
        return self.activity_1.name + "<->" + self.activity_2.name





        