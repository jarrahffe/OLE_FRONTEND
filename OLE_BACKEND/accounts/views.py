from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.serializer import RegistrationSerializer

from rest_framework import authentication, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken

from django.db import models
from timetable.models import Swap_request, Activity
from timetable.serializers import SwapRequestSerializer
from django.db.models import Q


class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        
        print("aaaaA")
        serializer.is_valid(raise_exception=True)
        account = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=account)


        print("b")

        swap_requests = Swap_request.objects.filter(Q(activity_1__account__id=account.pk) | Q(activity_2__account__id=account.pk))
        if len(swap_requests) != 0:
            swap_requests_serialized = SwapRequestSerializer(swap_requests, many=True)
            swap_data = swap_requests_serialized.data
        else:
            swap_requests_serialized = None
            swap_data = None
        
        print("c")

        return Response({
            'token': token.key,
            'email': account.email,
            'first_name': account.first_name,
            'last_name': account.last_name,
            'account': account.pk,
            'is_superuser': account.is_superuser,
            'swap_requests': swap_data
        })
    



@api_view(['POST'])
@permission_classes([AllowAny])
def registration_view(request):
    if request.method == 'POST':
        serializer = RegistrationSerializer(data=request.data)
        data = {}
        print(serializer)
        if serializer.is_valid():
            account = serializer.save()
            data['account'] = account.id
            data['is_superuser'] = account.is_superuser
            data['response'] = "succesfully registered a new account"
            data['email'] = account.email
            data['first_name'] = account.first_name
            data['last_name'] = account.last_name
            token = Token.objects.get(user=account).key
            data['token'] = token
        else:
            data = serializer.errors

        return Response(data)


