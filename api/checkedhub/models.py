from django.db import models
from django.contrib.auth.models import User
from polymorphic.models import PolymorphicModel


class Place(models.Model):
    name = models.CharField(max_length=255)
    types = models.JSONField(max_length=255, default=list)
    place_id = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=25, decimal_places=20)
    longitude = models.DecimalField(max_digits=25, decimal_places=20)
    def __str__(self):
        return f"{self.name}"
    class Meta:
        pass


class PlacesOrderedManyToManyField(models.ManyToManyField):
    """This fetches from the join table, then fetches the Places in the fixed id order."""
    def value_from_object(self, object):
        rel = getattr(object, self.attname)
        qry = {self.related.var_name: object}
        qs = rel.through.objects.filter(**qry).order_by('id')
        aids = qs.values_list('place_id', flat=True)
        places = dict((a.pk, a) for a in Place.objects.filter(pk__in=aids))
        return [places[aid] for aid in aids if aid in places]


class Experience(PolymorphicModel):
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    public = models.BooleanField(default=False)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    class Meta:
        pass


class Event(Experience):
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    class Meta:
        abstract = True


class Visit(Event):
    def __str__(self):
        return f"Visit {self.place} on {self.start_date}"
    class Meta:
        pass


class Stay(Event):
    def __str__(self):
        return f"Stay {self.place} from {self.start_date} to {self.end_date}"
    class Meta:
        pass


class Journey(Experience):
    places = PlacesOrderedManyToManyField(Place)
    class Meta:
        abstract = True


class Overland(Journey):
    polyline = models.TextField(max_length=10000)
    def __str__(self):
        return f"Overland journey from {self.fr} to {self.to} of {self.start_date}"
    class Meta:
        pass


class Flight(Journey):
    airport_departure = models.ForeignKey(Place, on_delete=models.CASCADE, related_name='departure_airports')
    airport_arrival = models.ForeignKey(Place, on_delete=models.CASCADE, related_name='arrival_airports')
    def __str__(self):
        return f"Flight {self.fr} > {self.to} of {self.start_date}"
    class Meta:
        pass