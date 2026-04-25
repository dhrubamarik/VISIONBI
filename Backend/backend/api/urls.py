from django.urls import path
from .views import ask, get_user_files, login_view, signup, upload_csv
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns = [
    path('ask/', ask),
    path('upload/', upload_csv),
    path('login/', login_view),
    path('signup/', signup),
    path('files/', get_user_files),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]