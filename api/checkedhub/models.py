from django.db import models
from django.contrib.auth.models import User
from polymorphic.models import PolymorphicModel


class Place(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
    place_id = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=20, decimal_places=15)
    longitude = models.DecimalField(max_digits=20, decimal_places=15)
    def __str__(self):
        return f"{self.name}"
    class Meta:
        pass


class Experience(PolymorphicModel):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    public = models.BooleanField(default=False)
    start_date = models.DateField()
    end_date = models.DateField()
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    class Meta:
        pass


class Event(Experience):
    class Meta:
        abstract = True


class Visit(Experience):
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    def __str__(self):
        return f"Visit {self.place} on {self.start_date}"
    class Meta:
        pass


class Stay(Experience):
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    def __str__(self):
        return f"Stay {self.place} from {self.start_date} to {self.end_date}"
    class Meta:
        pass


class Journey(Experience):
    fr = models.CharField(max_length=200)
    to = models.CharField(max_length=200)
    class Meta:
        abstract = True


class RoadTrip(Journey):
    polyline = models.TextField(max_length=10000)
    def __str__(self):
        return f"Road Trip from {self.fr} to {self.to} of {self.start_date}"
    class Meta:
        pass


class Flight(Journey):
    airport_departure = models.ForeignKey(Place, on_delete=models.CASCADE, related_name='departure_airports')
    airport_arrival = models.ForeignKey(Place, on_delete=models.CASCADE, related_name='arrival_airports')
    def __str__(self):
        return f"Flight {self.fr} > {self.to} of {self.start_date}"
    class Meta:
        pass