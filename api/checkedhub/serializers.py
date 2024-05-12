from rest_framework import serializers
from .models import *
from rest_polymorphic.serializers import PolymorphicSerializer


class PlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Place
        fields = ('id', 'name', 'type', 'place_id', 'latitude', 'longitude')


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ('id', 'name', 'fr', 'to')



class RoadTripSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadTrip
        fields = ('id', 'name', 'polyline')


class VisitSerializer(serializers.ModelSerializer):
    place = PlaceSerializer()
    class Meta:
        model = Visit
        fields = ('id', 'name', 'place')


class StaySerializer(serializers.ModelSerializer):
    place = PlaceSerializer()
    class Meta:
        model = Stay
        fields = ('id', 'name', 'place')


class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = ('id', 'name')


class ExperiencePolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        RoadTrip: RoadTripSerializer,
        Flight: FlightSerializer,
        Visit: VisitSerializer,
        Stay: StaySerializer
    }