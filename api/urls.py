from django.urls import path
from api import views

app_name = 'api'
urlpatterns = [
    path("", views.music_list, name="all"),
    path("<int:pk>/", views.music_detail, name="detail"),
]
