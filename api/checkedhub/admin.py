from django.contrib import admin
from polymorphic.admin import PolymorphicParentModelAdmin, PolymorphicChildModelAdmin, PolymorphicChildModelFilter
from .models import RoadTrip, Flight, Experience, Place, Visit, Stay


class ExperienceChildAdmin(PolymorphicChildModelAdmin):
    base_model = Experience
    # By using these `base_...` attributes instead of the regular ModelAdmin `form` and `fieldsets`,
    # the additional fields of the child models are automatically added to the admin form.
    # base_form = ...
    # base_fieldsets = (
    #     ...
    # )

@admin.register(Visit)
class VisitAdmin(ExperienceChildAdmin):
    base_model = Visit


@admin.register(Stay)
class StayAdmin(ExperienceChildAdmin):
    base_model = Stay


@admin.register(RoadTrip)
class RoadTripAdmin(ExperienceChildAdmin):
    base_model = RoadTrip


@admin.register(Flight)
class FlightAdmin(ExperienceChildAdmin):
    base_model = Flight


@admin.register(Experience)
class ExperienceParentAdmin(PolymorphicParentModelAdmin):
    base_model = Experience 
    child_models = (Flight, RoadTrip, Visit, Stay)
    list_filter = (PolymorphicChildModelFilter,)


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    base_model = Place