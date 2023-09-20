from django.urls import path,include
from accounts import views
from django.contrib.auth import views as auth_views



app_name = 'accounts'

urlpatterns = [
    path('register', views.registration_view, name="register"), 
    path('login/', views.CustomAuthToken.as_view(), name="login"), #obtain_auth_token


    #RESET PASSWORD
    # path('reset_password/', auth_views.PasswordResetView.as_view(template_name="accounts/password_reset.html"), name="reset_password"),
    path('reset_password/', auth_views.PasswordResetView.as_view(), name="reset_password"),
    path('password_reset_done/', auth_views.PasswordResetDoneView.as_view(), name="password_reset_done"),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    path('password_reset_complete/', auth_views.PasswordResetCompleteView.as_view(), name="password_reset_complete"),
]