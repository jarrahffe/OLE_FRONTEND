from django.contrib import admin
from django.urls import path
from timetable import views
# from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('', views.display_timetable),
        
    #REST FRAMEWORK URLS
    #DJANGO API
    path('get_activity', views.get_activity),
    path('add_activity', views.add_activity),
    path('delete_activity', views.delete_activity),
    path('block_times', views.block_times),

    path('create_swap_request', views.create_swap_request),
    path('accept_swap_request', views.accept_swap_request)
    
]