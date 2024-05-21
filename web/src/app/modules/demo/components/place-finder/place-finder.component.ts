import { Component } from '@angular/core';
import { Loader } from "@googlemaps/js-api-loader";
import { PointOfInterest } from '../../models/point-of-interest';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-place-finder',
  templateUrl: './place-finder.component.html',
  styleUrls: ['./place-finder.component.sass']
})
export class PlaceFinderComponent implements ControlValueAccessor {

    query: string = '';
    place?: PointOfInterest;
    places: any = Array<PointOfInterest>;
    
    // ControlValueAccessor Implementation
    onChange(newVal: PointOfInterest) {}
    onTouched(_?: any) {}
    private value: PointOfInterest = new PointOfInterest();

    writeValue(obj: PointOfInterest): void { this.value = obj; }
    registerOnChange(fn: any): void { this.onChange = fn; }
    registerOnTouched(fn: any): void { this.onTouched = fn; }

    search(query: string) {
      const loader = new Loader({
        apiKey: "AIzaSyAKS6nVQRipLHPqBa90uKbkq3Ljs-gMzGI",
        version: "weekly",
        libraries: ["geometry"]
      });
      loader.load().then(async () => {
        const { Place } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
        const { places } = await Place.searchByText({
          textQuery: query,
          fields: ['displayName', 'location', 'formattedAddress', 'types'],
          language: 'en-US',
          maxResultCount: 10
        });
        this.places = places.map((x: any) => {
          let poi = new PointOfInterest();
          poi.id = x.id;
          poi.name = x.displayName;
          poi.location = x.location;
          poi.types = x.types;
          poi.formattedAddress = x.formattedAddress;
          return poi;
        });
        console.log(places, this.places);
      });

    }

    select(place: PointOfInterest) {
      this.place = place;
      this.writeValue(place);
    }

}
