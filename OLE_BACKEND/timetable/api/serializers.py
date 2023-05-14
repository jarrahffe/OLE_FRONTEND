from rest_framework import serializers
from ..models import Activity

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ["name", "day", "start_time", "end_time", "notes"]