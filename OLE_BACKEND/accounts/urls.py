from django.urls import path,include
from accounts import views
from rest_framework.authtoken.views import obtain_auth_token

app_name = 'accounts'

urlpatterns = [
    # path('', UserListView.as_view(), name='user-list-view'),
    path('register', views.registration_view, name="register"), 
    path('login/', views.CustomAuthToken.as_view(), name="login"), #obtain_auth_token
]