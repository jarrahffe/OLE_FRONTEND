from rest_framework import serializers
from .models import Activity, Event
from .models import Swap_request

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "name", "notes", "account"] 

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ["id", "type", "name", "week", "date", "day", "start_time", "account"]

        
class SwapRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Swap_request

        fields = ["id", "activity_1", "activity_2"]