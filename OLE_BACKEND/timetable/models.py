from django.db import models
# from django.contrib.auth.models import User
from django.db.models import JSONField
from django.contrib.auth import get_user_model

# Create your models here.

class Event(models.Model):
    name = models.CharField(max_length=120, default=None)
    notes = models.CharField(max_length=320, default=None, blank=True)
    account = models.ForeignKey(get_user_model(), default=None, on_delete=models.CASCADE, blank=True)


class Activity(models.Model):
    # event = models.ForeignKey(Event, default=None, on_delete=models.CASCADE, blank=True, null=True)
    
    name = models.CharField(max_length=120, default=None)
    type = models.CharField(max_length=120, default=None)
    day = models.CharField(max_length=120, default=None)
    week = models.IntegerField(default=None, null=True)
    start_time = models.IntegerField(default=None)
    date = models.DateField(default=None)

    account = models.ForeignKey(get_user_model(), default=None, on_delete=models.CASCADE, blank=True)


    def __str__(self): return self.name
    

class Swap_request(models.Model):
    # description = models.CharField(max_length=120, default=None)
    # changes = JSONField(default=None)
    # approved = models.IntegerField(default=None)
    # created_by = models.ForeignKey(get_user_model(), default=None, on_delete=models.CASCADE, blank=True)


    activity_1 = models.ForeignKey(Activity, default=None, on_delete=models.CASCADE, related_name="swap_request_sender")
    activity_2 = models.ForeignKey(Activity, default=None, on_delete=models.CASCADE, related_name="swap_request_receiver")

    def __str__(self):
        return self.activity_1.name + "<->" + self.activity_2.name







        