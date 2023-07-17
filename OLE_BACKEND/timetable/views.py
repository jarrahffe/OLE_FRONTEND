from django.http import HttpResponse
from django.shortcuts import render

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated, AllowAny

from django.core.mail import send_mail
from django.conf import settings

from timetable.models import Activity
from .serializers import ActivitySerializer
from django.contrib.auth.models import User
from django.db import models
import datetime




@api_view(['GET'])
@permission_classes([AllowAny])
def display_timetable(request):
    
    activities = Activity.objects
    serialised = ActivitySerializer(activities, many=True)

    return Response(serialised.data)


######## API ########

### VIEW Activity ###
@api_view(['GET'])
@permission_classes([AllowAny])
def get_activity(request):
    id = request.query_params['id']
    try:
        activity = Activity.objects.get(id=id)
    except Activity.DoesNotExist:
        return Response({'response:': "activity does not exist"})   
    
    serialised = ActivitySerializer(activity)
    return Response(serialised.data)


### ADD Activity ###
@api_view(['POST']) 
@permission_classes([IsAuthenticated])
def add_activity(request):

    data = request.data
    
    #add User to new activity object
    user = request.user
    new_activity = Activity(user=user, date=data['date'])

    #check if time is available
    activities = Activity.objects.filter(date=data['date'], start_time=int(data['start_time']))
    if len(activities) != 0:
        return Response({'Error: this time has already taken'})

    #save new Activity object to database
    serializer = ActivitySerializer(new_activity, data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
### DELETE Activity ###
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_activity(request):

    #get Activity object
    try:
        id = request.query_params['id']
        activity = Activity.objects.get(id=id)
    except Activity.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    #check Activity belongs to user that's querying
    user = request.user
    if user != activity.user:
        return Response({'response': "You don't have permission to delete this"})
    
    email_TO = activity.user.email
    start_time = activity.start_time
    activity.delete()

    title = 'NO REPLY'
    message = "Hi {}, \n\n This is a friendly message notifying your lesson time cancellation: {}:00".format(activity.name, str(start_time))

    send_mail(
        title,
        message,
        'settings.EMAIL_HOST_USER',
        [email_TO],
        fail_silently=False
    )

    return HttpResponse(200)


# {"activities": [
#   {"type": "block", "date": "2017-06-1", "day":  "monday", "start_time": 9}, 
#   {"type": "block", "date": "2017-06-1", "day":  "monday", "start_time": 10},
#   {"type": "block", "date": "2017-06-1", "day":  "monday", "start_time": 11}
# ]}
@api_view(['POST']) 
@permission_classes([AllowAny])
def block_times(request):
    # check if superuser
    # user = request.user
    user = User.objects.all()[0]
    if user.is_superuser != True:
        return Response({"Response": "You don't have permission to block time slots"})
    
    data = request.data
    for object in data['activities']:
        activity = Activity(user=user, name="unavailable", notes="unavailable")

        #save new Activity object to database
        serializer = ActivitySerializer(activity, object)
        if serializer.is_valid():
            serializer.save()
        print()

    return Response(200)