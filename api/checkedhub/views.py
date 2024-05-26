from rest_framework import viewsets
from .models import Experience, Place
from .serializers import ExperiencePolymorphicSerializer, PlaceSerializer


class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperiencePolymorphicSerializer

    # def perform_create(self, serializer):
    #     serializer.save(user=self.request.user)


class PlaceViewSet(viewsets.ModelViewSet):
    queryset = Place.objects.all()
    serializer_class = PlaceSerializer