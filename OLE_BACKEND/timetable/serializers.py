from rest_framework import serializers
from .models import Activity
from .models import Swap_request

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ["id", "type", "name", "week", "date", "day", "start_time", "notes", "user"]

        
class SwapRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Swap_request
        # fields = ["id", "description", "changes", "approved", "created_by"]

        fields = ["id", "activity_1", "activity_2"]