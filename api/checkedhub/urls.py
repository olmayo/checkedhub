from django.urls import re_path, include
from rest_framework import routers
from . import views


router = routers.DefaultRouter()
router.register(r'experiences', views.ExperienceViewSet)
router.register(r'places', views.PlaceViewSet)
urlpatterns = [
    re_path(r'^', include(router.urls)),
]