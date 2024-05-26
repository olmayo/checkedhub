from rest_framework import serializers
from .models import *
from rest_polymorphic.serializers import PolymorphicSerializer


class PlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Place
        fields = ('id', 'place_id', 'name', 'types', 'latitude', 'longitude')

# Generic Serializers

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ('id', 'name', 'fr', 'to', 'start_date', 'start_time', 'end_date', 'end_time')


class OverlandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Overland
        fields = ('id', 'name', 'polyline', 'start_date', 'start_time', 'end_date', 'end_time')


class BasePlaceNestedCreateSerializer(serializers.ModelSerializer):
    place = PlaceSerializer()

    def create(self, validated_data):
        place_data = validated_data.pop('place')
        place, created = Place.objects.get_or_create(**place_data)
        return self.Meta.model.objects.create(place=place, **validated_data)
    

class VisitSerializer(BasePlaceNestedCreateSerializer):
    class Meta:
        model = Visit
        fields = ('id', 'name', 'place', 'start_date', 'start_time', 'end_date', 'end_time') #, 'user')
        #read_only_fields = ['user']


class StaySerializer(BasePlaceNestedCreateSerializer):
    class Meta:
        model = Stay
        fields = ('id', 'name', 'place', 'start_date', 'start_time', 'end_date', 'end_time')


class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = ('id', 'name', 'start_date', 'start_time', 'end_date', 'end_time')


class ExperiencePolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        Overland: OverlandSerializer,
        Flight: FlightSerializer,
        Visit: VisitSerializer,
        Stay: StaySerializer
    }