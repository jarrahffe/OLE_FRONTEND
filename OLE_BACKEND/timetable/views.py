from django.http import HttpResponse
from django.shortcuts import render

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated, AllowAny

from django.core.mail import send_mail
from django.conf import settings

from django.contrib.auth import get_user_model
from timetable.models import Activity, Swap_request, Event
from .serializers import ActivitySerializer, SwapRequestSerializer

# from django.contrib.auth.models import User
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

### ADD Event ###
# {"activities": [
#   {"type": "event", "week": 3, "date": "2023-08-31", "day":  "monday", "start_time": 9}, 
#   {"type": "event", "week": 3, "date": "2023-08-31", "day":  "monday", "start_time": 10},
#   {"type": "event", "week": 3, "date": "2023-08-31", "day":  "monday", "start_time": 11}
# ]}
@api_view(['POST']) 
@permission_classes([IsAuthenticated])
def add_event(request):
    data = request.data

    account = request.data
    event = Event(account=account, name=data['name'])

    for object in data['activities']:
        activity = Activity(account=account, name=data['name'], event=event)

        #save new Activity object to database
        serializer = ActivitySerializer(activity, object)
        if serializer.is_valid():
            serializer.save()

    return Response(serializer.data) 

def add_note_to_event(request):
    pass


### ADD Activity ###
@api_view(['POST']) 
@permission_classes([IsAuthenticated])
def add_activity(request):

    data = request.data

    #add User to new activity object
    account = request.user
    new_activity = Activity(account=account, date=data['date'])

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
    
    #check Activity belongs to account that's querying
    Account = get_user_model()
    acc = Account.objects.all()[0]

    account = request.user
    if account != activity.account and not acc.is_superuser:
        return Response({'response': "You don't have permission to delete this"}, status=401)
    
    email_TO = activity.account.email
    start_time = activity.start_time
    activity.delete()

    title = 'NO REPLY'
    message = "Hi {}, \n\n This is a friendly message notifying your lesson time cancellation: {}:00".format(activity.name, str(start_time))

    if activity.type != "block":
        send_mail(
            title,
            message,
            'settings.EMAIL_HOST_USER',
            [email_TO],
            fail_silently=False
        )

    return HttpResponse(200)


# {"activities": [
#   {"type": "block", "week": 3, "date": "2023-08-2", "day":  "tuesday", "start_time": 9}, 
#   {"type": "block", "week": 3, "date": "2023-08-2", "day":  "tuesday", "start_time": 10},
#   {"type": "block", "week": 3, "date": "2023-08-2", "day":  "tuesday", "start_time": 11}
# ]}
@api_view(['POST']) 
@permission_classes([AllowAny])
def block_times(request):
    # check if superuser
    # account = request.user
    Account = get_user_model()
    account = Account.objects.all()[0]
    if account.is_superuser != True:
        return Response({"Response": "You don't have permission to block time slots"})
    
    data = request.data
    response = []
    for object in data['activities']:
        activity = Activity(account=account, name="unavailable")

        #save new Activity object to database
        print(object)
        serializer = ActivitySerializer(activity, object)
        if serializer.is_valid():
            serializer.save()
            response.append(serializer.data)
        print()

    return Response(response)


@api_view(['POST']) 
@permission_classes([IsAuthenticated])
def create_swap_request(request):
    data = request.data

    activity_1 = Activity.objects.get(pk=data['activity_1'])
    activity_2 = Activity.objects.get(pk=data['activity_2'])
    print(activity_1.name, activity_2.name)
    
    if activity_1.account != request.user:
        return Response({"response": "you don't have permission to request this swap"})



    swap_request = Swap_request(activity_1=activity_1, activity_2=activity_2)
    serializer = SwapRequestSerializer(swap_request, data)
    print(serializer)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def accept_swap_request(request):
    swap_request = Swap_request.objects.get(pk=request.data['id'])  
    activity_1 = swap_request.activity_1
    activity_2 = swap_request.activity_2

    if activity_2.account != request.user:
        return Response({"response": "you don't have permission to accept this swap"})

    #swap dates
    temp_date = activity_1.date
    activity_1.date = activity_2.date
    activity_2.date = temp_date

    #swap times
    temp_time = activity_1.start_time
    activity_1.start_time = activity_2.start_time
    activity_2.start_time = temp_time

    #swap day
    temp_day = activity_1.day
    activity_1.day = activity_2.day
    activity_2.day = temp_day

    activity_1.save()
    activity_2.save()

    swap_request.delete()

    return Response({"response": "successfully swapped {} <-> {}".format(activity_1, activity_2)})



# @api_view(['GET']) 
# @permission_classes([IsAuthenticated])
# def accept_swap_request(request):
#     swap_request = Swap_request.objects.get(id=request.data['id'])
#     swap_request.approved += 1
#     swap_request.save()

#     #perform swap
#     if swap_request.approved == len(swap_request.changes):
        
#         changes_dic = swap_request.changes
#         for k, v in changes_dic.items():
#             activity = Activity.objects.get(pk=int(k))
#             print(activity.name, k, v)

#             activity.start_time = int(v['start_time'])
#             activity.date = v['date']
#             activity.day = v['day']
#             activity.save()
    
#     serializer = SwapRequestSerializer(swap_request)
#     return Response(serializer.data)
