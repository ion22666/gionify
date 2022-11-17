from django.urls import path, include
from api import views
from rest_framework.urlpatterns import format_suffix_patterns

app_name = 'api'
urlpatterns = [
    path("", views.MusicList.as_view(), name="all"),
    path("<int:pk>/", views.MusicDetail.as_view(), name="detail"),
    path("get_dominant_colors/<int:pk>/", views.get_dominant_colors, name="get_dominant_colors")
]

urlpatterns = format_suffix_patterns(urlpatterns)