from django.urls import path,include
from .views import UserListView, CustomAuthToken
from users import views
from rest_framework.authtoken.views import obtain_auth_token

app_name = 'users'

urlpatterns = [
    path('', UserListView.as_view(), name='user-list-view'),
    path('register', views.registration_view, name="register"),
    path('login', CustomAuthToken.as_view(), name="login") #obtain_auth_token
    
]