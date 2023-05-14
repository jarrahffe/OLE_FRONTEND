from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from rest_framework.permissions import AllowAny, IsAuthenticated

# from account.models import Account
from timetable.models import Activity
from .serializers import ActivitySerializer



@api_view(['GET'])
def display_timetable(request):
    activities = Activity.objects.all()
    times = [8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7]
    serialised = ActivitySerializer(activities, many=True)

    return Response(serialised.data)

    # days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    # return render(request, 'timetable.html', {'activities': activities, 'days': days, 'times': times}, )




######## API ########

@api_view(['GET'])
# request(data) --->>
def get_activity(request):
    id = request.query_params['id']
    activity = Activity.objects.get(id=id)
    serialised = ActivitySerializer(activity)
    return Response(serialised.data)

@api_view(['POST'])
def add_activity(request):
    serializer = ActivitySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    
    return HttpResponse(200)

#DELETE
@api_view(['DELETE'])
def delete_activity(request):
    try:
        id = request.query_params['id']
        activity = Activity.objects.get(id=id)
        activity.delete()
        return HttpResponse(200)

    except Activity.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)